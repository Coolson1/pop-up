"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 mb-8">
      <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
          Pop-up Kitchen
        </Link>
        <Link
          href="/admin"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}