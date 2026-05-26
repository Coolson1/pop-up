"use client";

import { addToCart } from "@/lib/cart";

type Props = {
  item: { id: string; name: string; price_cents: number };
};

export function MenuCard({ item }: Props) {
  return (
    <article className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all duration-200">
      <h3 className="font-bold text-lg text-gray-800 group-hover:text-amber-700 transition-colors">{item.name}</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-semibold text-amber-600">
          NLe {(item.price_cents / 100).toFixed(2)}
        </span>
        <button
          onClick={() => addToCart(item)}
          className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-sm rounded-lg px-4 py-2 font-medium hover:from-amber-700 hover:to-orange-600 active:scale-95 transition-all shadow-sm hover:shadow"
        >
          + Add
        </button>
      </div>
    </article>
  );
}