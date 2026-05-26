import { db } from "@/lib/notifier";
import { TicketView } from "@/components/TicketView";

export const dynamic = "force-dynamic";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: order } = await db
    .from("orders")
    .select("id, code, phone, total_cents, status, created_at")
    .eq("code", code)
    .maybeSingle();

  if (!order) {
    return (
      <main className="max-w-md mx-auto px-6 py-12 text-center">
        <div className="bg-red-50 rounded-xl p-8 border border-red-200">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Ticket Not Found</h1>
          <p className="text-red-600">This order code doesn&apos;t exist</p>
        </div>
      </main>
    );
  }

  const { data: items } = await db
    .from("order_items")
    .select("name, qty, price_cents")
    .eq("order_id", order.id);

  return <TicketView order={order} items={items ?? []} />;
}