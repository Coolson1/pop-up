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
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-600" />
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-full mb-6">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">
            Pickup Code
          </p>
          <p className="font-mono text-5xl font-black tracking-tighter mt-2 text-gray-900">
            {order.code}
          </p>
        </div>
        <div
          className={`mt-8 text-center text-sm rounded-2xl py-4 px-6 font-bold transition-all ${
            isPaid
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-amber-50 text-amber-700 border border-amber-100"
          }`}
        >
          {isPaid ? "✓ Paid — See you at pickup!" : "⏳ Waiting for payment…"}
        </div>
        <div className="mt-10 space-y-4">
          {items?.map((i, idx) => (
            <div key={idx} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-600">
                <span className="font-black text-gray-900 mr-2">{i.qty}×</span> {i.name}
              </span>
              <span className="font-bold text-gray-900">
                NLe {((i.price_cents * i.qty) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">Total</span>
          <span className="font-black text-3xl text-gray-900">
            NLe {(order.total_cents / 100).toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-12 text-center font-medium">
          Show this code at pickup time
        </p>
      </div>
    </main>
  );
}