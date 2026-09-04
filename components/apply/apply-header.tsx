"use client"

import Link from "next/link"
import { KtIsMark } from "@/components/kt-is-mark"

export function ApplyHeader() {
  return (
    <header className="border-b border-[#3d2a6b] bg-[#1a1030]">
      <div className="site-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <KtIsMark className="h-8 w-auto brightness-110" />
          <span className="text-base font-bold tracking-[0.04em] text-[#e9d5ff] md:text-lg">
            WI ZEROTHON
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm font-medium text-[#d8c9ff] transition-colors hover:bg-[#2a1848] hover:text-white md:text-base"
        >
          메인으로
        </Link>
      </div>
    </header>
  )
}
