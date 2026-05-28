"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, signOut } from "@/lib/auth";

type Order = {
  id: string;
  code: string;
  phone: string;
  total_cents: number;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [prepList, setPrepList] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  async function checkAuthAndLoadData() {
    try {
      const { data, error } = await getUser();

      if (error || !data.user) {
        router.push("/admin/login");
        return;
      }

      setAuthenticated(true);

      // Fetch admin data from API route
      const res = await fetch("/api/admin/orders");
      const { orders: ordersData, prepList: prepData } = await res.json();

      setOrders(ordersData);
      setPrepList(prepData);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  if (!authenticated || loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Prep List</h1>
          <p className="text-gray-500 text-sm mt-1">Paid orders ready for preparation</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold px-5 py-3 shadow-lg shadow-gray-200 hover:bg-amber-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5">
          <div className="rounded-[2rem] bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Order Summary</p>
                <h2 className="text-2xl font-black text-gray-900 mt-2">Prep List</h2>
              </div>
              <span className="text-sm text-gray-500">{prepList.length} items</span>
            </div>
            {prepList.length === 0 ? (
              <div className="rounded-3xl bg-gray-50 p-8 text-center">
                <p className="text-gray-500">No paid orders yet</p>
                <p className="mt-2 text-sm text-gray-400">Orders appear here once payment is confirmed.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {prepList?.map(([name, qty]) => (
                  <li key={name} className="flex justify-between items-center rounded-3xl border border-gray-100 bg-gray-50 px-5 py-4">
                    <span className="font-semibold text-gray-800">{name}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 font-bold">×{qty}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Paid Orders</h2>
            {orders.length === 0 ? (
              <div className="rounded-3xl bg-gray-50 p-6 text-center text-sm text-gray-500">No paid orders yet.</div>
            ) : (
              <ul className="space-y-4">
                {orders?.map((o) => (
                  <li
                    key={o.id}
                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <span className="font-mono font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full">{o.code}</span>
                        <p className="text-gray-500 text-sm mt-2">{o.phone}</p>
                      </div>
                      <span className="font-black text-gray-900">NLe {(o.total_cents / 100).toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="rounded-[2rem] bg-amber-50/70 p-6 shadow-2xl border border-amber-100">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Kitchen Ready</p>
            <h3 className="text-2xl font-black text-amber-900 mt-3">Focus on fresh orders</h3>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            This dashboard shows only paid orders. Use the prep list to coordinate the kitchen and keep everything moving smoothly.
          </p>
        </aside>
      </div>
    </main>
  );
}