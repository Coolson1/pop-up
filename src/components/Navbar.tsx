"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-serif italic">P</span>
          Pop-up Kitchen
        </Link>
        <Link
          href="/admin"
          className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-amber-600 transition-all duration-300"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}