"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 mb-6">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Pop-up Kitchen
        </Link>
        <Link
          href="/admin"
          className="text-sm text-gray-600 hover:text-black transition-colors"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}