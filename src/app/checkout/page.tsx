"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readCart, clearCart, type CartItem } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = items.reduce((s, i) => s + i.price_cents * i.qty, 0);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clearCart();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        router.push(`/ticket/${data.code}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center bg-gray-50 rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-4">Add items from the menu to proceed</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">
        Checkout
      </h1>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
        <h2 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-4">Order Summary</h2>
        <ul className="space-y-4 mb-6">
          {items?.map((i) => (
            <li key={i.id} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-800 font-medium">
                <span className="text-gray-400 mr-2">{i.qty}×</span> {i.name}
              </span>
              <span className="font-bold text-gray-900">
                NLe {((i.price_cents * i.qty) / 100).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">Total</span>
          <span className="font-black text-2xl text-gray-900">
            NLe {(total / 100).toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={pay} className="space-y-6">
        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-bold text-gray-700 ml-1">Mobile money number</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+232..."
              className="mt-2 w-full rounded-2xl border border-gray-200 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50/50 transition-all"
            />
          </label>
        </div>
        <button
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold hover:bg-amber-600 transition-all duration-300 shadow-lg shadow-gray-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 text-center font-medium">
            {error}
          </div>
        )}
      </form>
    </main>
  );
}