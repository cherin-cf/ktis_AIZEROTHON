"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

const THINK_FRAMES = [
  "/cursor/think1.png",
  "/cursor/think2.png",
  "/cursor/think3.png",
  "/cursor/think4.png",
] as const

const FRAME_MS = 180

type Props = {
  visible: boolean
  /** Glass text ready — bar fills to 100% */
  ready?: boolean
}

/** Full-screen loader: duck + purple progress gauge */
export function HeroLoader({ visible, ready = false }: Props) {
  const [frame, setFrame] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!visible) return
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % THINK_FRAMES.length)
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [visible])

  useEffect(() => {
    if (!visible) {
      setProgress(0)
      return
    }
    if (ready) {
      setProgress(100)
      return
    }
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p
        const step = 1.2 + Math.random() * 2.8
        return Math.min(90, p + step)
      })
    }, 160)
    return () => window.clearInterval(id)
  }, [visible, ready])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="hero-loader"
          className="fixed inset-0 z-[200] flex flex-col bg-[#05081a]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-busy="true"
          aria-label="WI ZEROTHON 로딩 중"
        >
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="relative flex flex-col items-center">
              <div className="relative mb-1 h-[100px] w-[80px] md:h-[120px] md:w-[96px]">
                <Image
                  src={THINK_FRAMES[frame]}
                  alt=""
                  width={366}
                  height={473}
                  unoptimized
                  priority
                  draggable={false}
                  className="h-full w-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/cursor/duck.png"
                  alt=""
                  width={200}
                  height={248}
                  unoptimized
                  priority
                  draggable={false}
                  className="h-[88px] w-auto drop-shadow-[0_8px_24px_rgba(155,122,239,0.4)] md:h-[108px]"
                  style={{ imageRendering: "pixelated" }}
                />
              </motion.div>
            </div>

            <p className="font-pixel mt-10 text-center text-sm tracking-wide text-[#c9b0ff] md:text-base">
              WI ZEROTHON
            </p>

            {/* Purple gauge — between title and LOADING % */}
            <div className="mt-6 w-full max-w-[280px] md:mt-7 md:max-w-[320px]">
              <div
                className="h-2.5 overflow-hidden rounded-full border border-[#9b7aef]/45 bg-[#12102a] shadow-[0_0_20px_rgba(155,122,239,0.15)] md:h-3"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#b794f6] via-[#9b7aef] to-[#7c5ce0]"
                  style={{
                    boxShadow:
                      "0 0 16px rgba(183,148,246,0.65), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    duration: ready ? 0.35 : 0.22,
                    ease: ready ? [0.22, 1, 0.36, 1] : "linear",
                  }}
                />
              </div>
            </div>

            <p className="mt-4 font-mono text-xs tracking-[0.28em] text-foreground/45 md:text-sm">
              LOADING {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
