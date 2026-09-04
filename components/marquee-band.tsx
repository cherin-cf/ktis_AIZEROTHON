"use client"

import { motion } from "framer-motion"

const items = ["WHAT WILL YOU BUILD", "48 HOURS", "FROM ZERO TO PRODUCT", "kt is WI ZEROTHON"]

function MarqueeText({ text }: { text: string }) {
  if (text === "kt is WI ZEROTHON") {
    return (
      <span className="bg-gradient-to-r from-[#5b8cff] via-[#9b8cff] to-[#b794f6] bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
        {text}
      </span>
    )
  }

  return (
    <span className="text-2xl font-semibold tracking-tight md:text-3xl">{text}</span>
  )
}

export function MarqueeBand() {
  const row = [...items, ...items, ...items]
  return (
    <div className="relative flex overflow-hidden border-y border-border bg-foreground py-6 text-background">
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <MarqueeText text={t} />
            <span className="text-[#b794f6]">✳</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
