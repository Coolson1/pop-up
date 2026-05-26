type Order = {
  code: string;
  phone: string;
  total_cents: number;
  status: string;
  created_at: string;
};

type Item = {
  name: string;
  qty: number;
  price_cents: number;
};

export function TicketView({
  order,
  items,
}: {
  order: Order;
  items: Item[];
}) {
  const isPaid = order.status === "paid";

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Pickup Code
          </p>
          <p className="font-mono text-4xl font-bold tracking-widest mt-2 text-gray-800">
            {order.code}
          </p>
        </div>
        <div
          className={`mt-6 text-center text-sm rounded-lg py-3 px-4 font-medium ${
            isPaid
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {isPaid ? "✓ Paid — See you at pickup!" : "⏳ Waiting for payment…"}
        </div>
        <div className="mt-6 space-y-3">
          {items.map((i, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-700">
                <span className="font-medium">{i.qty}×</span> {i.name}
              </span>
              <span className="font-medium text-amber-600">
                NLe {((i.price_cents * i.qty) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="font-bold text-xl text-amber-600">
            NLe {(order.total_cents / 100).toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-6 text-center">
          Show this code at pickup time
        </p>
      </div>
    </main>
  );
}