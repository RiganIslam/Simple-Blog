"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#f5f1ea]/90 backdrop-blur-xl border-b border-[#ded6ca]">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-[#191714]"
        >
          SIMPLE
          <span className="text-[#d95f3f]">
            BLOG
          </span>
        </Link>

        <div className="flex items-center gap-2">

          <Link
            href="/"
            className="px-4 py-2 rounded-full text-sm font-medium text-[#625b52] hover:bg-white hover:text-[#191714] transition"
          >
            Stories
          </Link>

          <Link
            href="/authors"
            className="px-4 py-2 rounded-full text-sm font-medium text-[#625b52] hover:bg-white hover:text-[#191714] transition"
          >
            Authors
          </Link>

          <Link
            href="/create"
            className="ml-2 px-5 py-2.5 rounded-full bg-[#191714] text-white text-sm font-semibold hover:bg-[#d95f3f] transition-all duration-300"
          >
            + Write
          </Link>

        </div>

      </div>

    </nav>
  );
}