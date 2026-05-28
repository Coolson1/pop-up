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
      <aside className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 sticky top-4 h-fit">
        <h2 className="font-bold text-lg text-amber-800 mb-3">Your Order</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Your cart is empty</p>
          <p className="text-amber-600 text-xs mt-1">Add items from the menu to get started</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 sticky top-4 h-fit">
      <h2 className="font-bold text-lg text-gray-800 mb-4">Your Order</h2>
      <ul className="space-y-3">
        {items?.map((i) => (
          <li key={i.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
            <span className="flex-1 pr-2 font-medium text-gray-700">{i.name}</span>
            <div className="flex items-center gap-2">
              <button
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 font-bold text-gray-600 transition-colors"
                onClick={() => setQty(i.id, i.qty - 1)}
                aria-label={`Decrease ${i.name}`}
              >
                –
              </button>
              <span className="w-6 text-center font-semibold">{i.qty}</span>
              <button
                className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 hover:bg-amber-200 font-bold text-amber-700 transition-colors"
                onClick={() => setQty(i.id, i.qty + 1)}
                aria-label={`Increase ${i.name}`}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Subtotal</span>
        <span className="font-bold text-lg text-amber-600">
          NLe {(subtotal / 100).toFixed(2)}
        </span>
      </div>
      <button
        onClick={() => router.push("/checkout")}
        className="mt-5 w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg py-3 font-semibold hover:from-amber-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        Checkout • NLe {(subtotal / 100).toFixed(2)}
      </button>
    </aside>
  );
}