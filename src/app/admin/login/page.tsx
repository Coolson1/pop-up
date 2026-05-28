"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await signIn(email, password);

      if (authError || !data.user) {
        setError(authError?.message || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F4F0] px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-[2rem] bg-white/95 border border-gray-100 shadow-2xl p-10">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">Admin Access</p>
          <h1 className="text-4xl font-black text-gray-900">Kitchen Dashboard</h1>
          <p className="mt-3 text-gray-500">Sign in to manage orders, prep lists, and daily menus.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-gray-900 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-gray-200 transition hover:bg-amber-600 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          For kitchen operations only. Keep credentials secure.
        </p>
      </div>
    </main>
  );
}