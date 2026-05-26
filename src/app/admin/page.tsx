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
      <main className="max-w-3xl mx-auto p-6">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prep List</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {prepList.length === 0 ? (
        <p className="text-gray-500">No paid orders yet.</p>
      ) : (
        <ul className="bg-white rounded-xl border border-gray-100 divide-y">
          {prepList.map(([name, qty]) => (
            <li key={name} className="flex justify-between p-4">
              <span className="font-medium">{name}</span>
              <span className="font-mono">×{qty}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-10 mb-3">Paid Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">Nothing yet.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => (
            <li
              key={o.id}
              className="bg-white rounded-lg border border-gray-100 p-3 flex justify-between text-sm"
            >
              <div>
                <span className="font-mono font-semibold">{o.code}</span>
                <span className="text-gray-500 ml-3">{o.phone}</span>
              </div>
              <span>NLe {(o.total_cents / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
