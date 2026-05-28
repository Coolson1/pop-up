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
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-md rounded-[2rem] bg-white/95 border border-gray-100 shadow-2xl p-10 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Ticket Not Found</h1>
          <p className="text-gray-500 leading-relaxed">
            We couldn&apos;t locate an order for that code. Please verify your pickup code or return to the menu.
          </p>
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