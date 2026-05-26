import { NextResponse } from "next/server";
import { db } from "@/lib/notifier";

export async function GET() {
  try {
    const { data: orders } = await db
      .from("orders")
      .select("id, code, phone, total_cents, status, created_at")
      .eq("status", "paid")
      .order("created_at", { ascending: false });

    const orderIds = (orders ?? []).map((o) => o.id);

    const itemsResult = orderIds.length
      ? await db
          .from("order_items")
          .select("order_id, name, qty")
          .in("order_id", orderIds)
      : { data: [] };

    const items = itemsResult.data ?? [];

    const prepTotals = new Map<string, number>();
    for (const item of items) {
      prepTotals.set(item.name, (prepTotals.get(item.name) ?? 0) + item.qty);
    }

    const prepList = Array.from(prepTotals.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    return NextResponse.json({
      orders: orders ?? [],
      prepList,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}
