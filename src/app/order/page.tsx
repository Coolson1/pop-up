"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { clearCart, readCart, setQty, type CartItem } from "@/lib/cart";

export default function OrderPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("cart:change", sync);
    return () => window.removeEventListener("cart:change", sync);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price_cents * item.qty, 0);

  function handleClear() {
    clearCart();
    setItems([]);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-2xl border border-gray-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 text-center md:text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">Your Order</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">Order details in one place</h1>
            </div>
            <div className="rounded-3xl bg-amber-50 border border-amber-100 px-4 py-3 shadow-sm text-amber-700 text-sm">
              {items.length > 0 ? (
                <span>{items.length} item{items.length === 1 ? "" : "s"} added</span>
              ) : (
                <span>No items yet</span>
              )}
            </div>
          </div>
          {items.length > 0 && (
            <div className="mt-4 rounded-3xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-800">
              Someone has added an item — check the order page or head to checkout.
            </div>
          )}
          <p className="mt-4 text-gray-500 max-w-full md:max-w-2xl">
            All cart changes are saved automatically. When someone adds an item, this page updates and the navbar shows an order badge.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 shadow-2xl border border-gray-100 text-center">
            <p className="text-xl font-bold text-gray-900 mb-4">Your order is empty</p>
            <p className="text-gray-500 mb-6">Add items from the menu to see them here.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-3xl bg-gray-900 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-amber-600"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white p-8 shadow-2xl border border-gray-100">
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">NLe {(item.price_cents / 100).toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="h-10 w-10 rounded-full bg-white border border-gray-200 text-xl font-bold text-gray-700 hover:border-amber-400 transition"
                    >
                      –
                    </button>
                    <span className="min-w-[2rem] text-center font-black text-gray-900">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="h-10 w-10 rounded-full bg-black text-white hover:bg-amber-700 transition"
                    >
                      +
                    </button>
                    <span className="ml-4 text-sm font-semibold text-gray-900">NLe {((item.price_cents * item.qty) / 100).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Subtotal</p>
                <p className="text-3xl font-black text-gray-900">NLe {(subtotal / 100).toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-3xl bg-gray-900 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-amber-600"
                >
                  Checkout
                </button>
                <button
                  onClick={handleClear}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 transition hover:border-amber-400"
                >
                  Clear Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
