import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/notifier";
import { createCheckout } from "@/lib/monime";
import { generateCode } from "@/lib/codes";

type Body = {
  phone: string;
  items: { id: string; name: string; price_cents: number; qty: number }[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
  }

  if (!body.phone || !body.items?.length) {
    return NextResponse.json({ error: "Missing phone or items" }, { status: 400 });
  }

  const total = (body.items ?? []).reduce(
    (s, i) => s + i.price_cents * i.qty,
    0
  );

  const code = generateCode();
  const reference = crypto.randomUUID();

  const { data: order, error } = await db
    .from("orders")
    .insert({
      code,
      reference,
      phone: body.phone,
      total_cents: total,
      status: "pending",
    })
    .select("id, code, reference")
    .single();

  if (error || !order) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }

  await db.from("order_items").insert(
    body.items.map((i) => ({
      order_id: order.id,
      menu_item_id: i.id,
      name: i.name,
      price_cents: i.price_cents,
      qty: i.qty,
    }))
  );

  let checkout;
  try {
    console.log("[Checkout API] Creating Monime session with items:", JSON.stringify(body.items));
    checkout = await createCheckout({
      name: body.phone, // Using phone as name since we don't have a customer name
      phone: body.phone,
      reference: order.reference,
      lineItems: body.items.map(i => ({
        name: i.name,
        quantity: i.qty,
        price: i.price_cents
      })),
    });
  } catch (e) {
    console.error("Checkout creation error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment provider error" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    code: order.code,
    redirect_url: checkout.redirect_url,
  });
}
