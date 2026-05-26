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
    router.push("/admin/login");
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
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Prep List</h1>
          <p className="text-gray-500 text-sm mt-1">All paid orders ready for preparation</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
        {prepList.length === 0 ? (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 text-center border border-amber-100">
            <p className="text-gray-500">No paid orders yet</p>
            <p className="text-sm text-amber-600 mt-2">Orders will appear here once payment is confirmed</p>
          </div>
        ) : (
          <ul className="bg-white rounded-xl border border-gray-100 divide-y shadow-sm overflow-hidden">
            {prepList.map(([name, qty]) => (
              <li key={name} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-800">{name}</span>
                <span className="bg-amber-100 text-amber-700 font-mono font-bold px-3 py-1 rounded-full">×{qty}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Paid Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm bg-gray-50 rounded-lg p-4">Nothing yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li
                key={o.id}
                className="bg-white rounded-lg border border-gray-100 p-4 flex justify-between items-center text-sm hover:shadow-sm transition-shadow"
              >
                <div>
                  <span className="font-mono font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">{o.code}</span>
                  <span className="text-gray-500 ml-3">{o.phone}</span>
                </div>
                <span className="font-semibold text-gray-700">NLe {(o.total_cents / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}