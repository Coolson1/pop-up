"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readCart } from "@/lib/cart";

export function Navbar() {
  const pathname = usePathname();
  const isOrderPage = pathname === "/order";
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const sync = () =>
      setOrderCount(readCart().reduce((sum, item) => sum + item.qty, 0));
    sync();
    window.addEventListener("cart:change", sync);
    return () => window.removeEventListener("cart:change", sync);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-serif italic">P</span>
          Pop-up Kitchen
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={isOrderPage ? "/" : "/order"}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 hover:border-amber-300 hover:text-amber-600 transition-all duration-300"
          >
            <span>{isOrderPage ? "Home" : "Your Order"}</span>
            {!isOrderPage && orderCount > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-600 px-2 text-[10px] font-black uppercase text-white shadow-sm">
                {orderCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin"
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-amber-600 transition-all duration-300 whitespace-nowrap"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}