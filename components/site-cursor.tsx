"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, useMotionValue } from "framer-motion"

/**
 * OS system cursor always paints above the page — we can't put a DOM duck
 * on top of it. Instead: hide the system cursor and composite
 * (pointer graphic) + (duck) ourselves, duck stacked above the arrow.
 */
export function SiteCursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)

  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)")
    if (!mq.matches) return
    setEnabled(true)
    document.documentElement.classList.add("custom-cursor")

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target as HTMLElement | null
      setHovering(
        Boolean(target?.closest("a, button, [data-cursor='hover'], [data-cursor='link']")),
      )
    }
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener("mousemove", move, { passive: true })
    document.addEventListener("mouseleave", leave)
    document.addEventListener("mouseenter", enter)
    return () => {
      document.documentElement.classList.remove("custom-cursor")
      window.removeEventListener("mousemove", move)
      document.removeEventListener("mouseleave", leave)
      document.removeEventListener("mouseenter", enter)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[250] hidden md:block"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div
          className="relative"
          style={{
            transform: hovering ? "scale(1.06)" : "scale(1)",
            transformOrigin: "2px 2px",
            transition: "transform 120ms ease-out",
          }}
        >
          {/* Fake system pointer (under duck) */}
          <svg
            width="22"
            height="28"
            viewBox="0 0 24 32"
            className="absolute left-0 top-0 z-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
            aria-hidden
          >
            <path
              d="M3 2 L3 26 L9 20 L13 30 L16.5 28.5 L12.5 18.5 L21 18.5 Z"
              fill="#ffffff"
              stroke="#111827"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>

          {/* Duck stacked on top of the pointer tip */}
          <Image
            src="/cursor/duck.png"
            alt=""
            width={160}
            height={198}
            unoptimized
            draggable={false}
            className="relative z-[2] ml-[6px] mt-[4px] h-[48px] w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:h-[56px]"
            style={{ imageRendering: "pixelated" }}
            priority
          />
        </div>
      </motion.div>
    </div>
  )
}
