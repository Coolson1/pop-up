"use client";

import { addToCart } from "@/lib/cart";

type Props = {
  item: { id: string; name: string; price_cents: number };
};

export function MenuCard({ item }: Props) {
  return (
    <article className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all duration-500 ease-out overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 group-hover:bg-amber-100/50 duration-700" />
      
      <div className="relative z-10">
        <h3 className="font-bold text-xl text-gray-900 group-hover:text-amber-700 transition-colors duration-300 leading-tight">
          {item.name}
        </h3>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Price</span>
            <span className="text-2xl font-black text-gray-900">
              NLe {(item.price_cents / 100).toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={() => addToCart(item)}
            className="bg-gray-900 text-white text-sm rounded-full px-6 py-3 font-bold hover:bg-amber-600 active:scale-95 transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-amber-200"
          >
            Add to Order
          </button>
        </div>
      </div>
    </article>
  );
}