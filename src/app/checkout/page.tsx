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
    <main className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
        Checkout
      </h1>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Order Summary</h2>
        <ul className="space-y-3 mb-4">
          {items?.map((i) => (
            <li key={i.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-700">
                <span className="font-medium">{i.qty}×</span> {i.name}
              </span>
              <span className="font-medium text-amber-600">
                NLe {((i.price_cents * i.qty) / 100).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="font-bold text-xl text-amber-600">
            NLe {(total / 100).toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={pay} className="space-y-5">
        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Mobile money number</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+232..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg py-3.5 font-semibold hover:from-amber-700 hover:to-orange-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {loading ? "Starting payment…" : `Pay NLe ${(total / 100).toFixed(2)}`}
        </button>
      </form>
    </main>
  );
}