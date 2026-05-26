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

      // Redirect to admin page on successful login
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 flex items-center justify-center min-h-screen">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </label>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Contact your administrator for credentials
        </p>
      </div>
    </main>
  );
}
