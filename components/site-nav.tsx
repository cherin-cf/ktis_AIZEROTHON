"use client"

import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { useState } from "react"
import { useApplyModal } from "@/components/apply/apply-modal-context"
import { KtIsMark } from "@/components/kt-is-mark"

const links = [
  { label: "대회 소개", href: "#introduce" },
  { label: "참가 방법", href: "#guide" },
]

export function SiteNav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const { openApplyModal } = useApplyModal()

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24)
  })

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-7 md:px-9 lg:px-11 xl:px-14"
    >
      <nav
        className={`flex w-full max-w-[118rem] items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "border-border bg-background/80 shadow-[0_8px_30px_rgb(0_0_0/0.05)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="kt is ZEROTHON home"
        >
          <KtIsMark className="h-6 w-auto" />
          <span className="text-sm font-bold tracking-[0.06em] text-foreground md:text-base">
            ZEROTHON
          </span>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-pixel inline-flex items-center justify-center rounded-md border border-[#5b8cff]/70 bg-[#0a1238]/85 px-3.5 py-2 text-sm leading-none tracking-wide text-[#dff0ff] transition-all hover:border-[#7eb6ff] hover:bg-[#121b4a] hover:text-white md:text-base"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={openApplyModal}
            className="font-pixel inline-flex items-center justify-center rounded-md border border-[#5b8cff]/70 bg-[#0a1238]/85 px-3.5 py-2 text-sm leading-none tracking-wide text-[#dff0ff] transition-all hover:border-[#7eb6ff] hover:bg-[#121b4a] hover:text-white md:text-base"
          >
            참가 신청
          </button>
          <a
            href="#faq"
            className="font-pixel inline-flex items-center justify-center rounded-md border border-[#5b8cff]/70 bg-[#0a1238]/85 px-3.5 py-2 text-sm leading-none tracking-wide text-[#dff0ff] transition-all hover:border-[#7eb6ff] hover:bg-[#121b4a] hover:text-white md:text-base"
          >
            FAQ
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
