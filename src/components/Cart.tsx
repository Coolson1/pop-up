"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readCart, setQty, type CartItem } from "@/lib/cart";

export function Cart() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("cart:change", sync);
    return () => window.removeEventListener("cart:change", sync);
  }, []);

  const subtotal = items.reduce(
    (sum, i) => sum + i.price_cents * i.qty,
    0
  );

  if (items.length === 0) {
    return (
      <aside className="bg-white rounded-3xl p-8 border border-gray-100 sticky top-4 h-fit shadow-sm">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-gray-900 mb-2">Your Order</h2>
          <p className="text-gray-500 text-sm">Your cart is currently empty</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-4 h-fit">
      <h2 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-2">
        Your Order
        <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{items.length}</span>
      </h2>
      <ul className="space-y-4">
        {items?.map((i) => (
          <li key={i.id} className="flex items-center justify-between text-sm bg-gray-50/50 rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
            <span className="flex-1 pr-2 font-bold text-gray-800">{i.name}</span>
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-amber-400 hover:text-amber-600 font-bold text-gray-500 transition-all flex items-center justify-center"
                onClick={() => setQty(i.id, i.qty - 1)}
                aria-label={`Decrease ${i.name}`}
              >
                –
              </button>
              <span className="w-5 text-center font-black text-gray-900">{i.qty}</span>
              <button
                className="w-8 h-8 rounded-full bg-gray-900 text-white hover:bg-amber-600 font-bold transition-all flex items-center justify-center shadow-md"
                onClick={() => setQty(i.id, i.qty + 1)}
                aria-label={`Increase ${i.name}`}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Subtotal</span>
        <span className="font-black text-2xl text-gray-900">
          NLe {(subtotal / 100).toFixed(2)}
        </span>
      </div>
      <button
        onClick={() => router.push("/checkout")}
        className="mt-6 w-full bg-gray-900 text-white rounded-2xl py-4 font-bold hover:bg-amber-600 transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-amber-200 active:scale-95"
      >
        Complete Order
      </button>
    </aside>
  );
}