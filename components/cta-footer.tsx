"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Reveal } from "@/components/reveal"

function OfficialBrand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/brand/wi-zerothon-logo-dark.png"
        alt="kt is WI ZEROTHON"
        width={642}
        height={96}
        unoptimized
        draggable={false}
        className="h-7 w-auto md:h-8"
      />
    </div>
  )
}

export function CtaFooter() {
  return (
    <>
      <section
        id="register"
        className="relative overflow-hidden border-t border-border bg-background text-foreground"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b794f6]/18 blur-3xl"
          animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.92, 1.08, 0.92] }}
          transition={{
            duration: 3.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <div className="site-shell py-32 text-center md:py-48">
          <Reveal delay={0.08}>
            <h2 className="mx-auto max-w-4xl text-[clamp(2.5rem,5.6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                so-
              </motion.span>
              <motion.span
                className="mt-2 block"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                what will you build
              </motion.span>
              <motion.span
                className="mt-2 block"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                with{" "}
                <motion.span
                  className="relative inline-block bg-gradient-to-b from-[#e8dcff] via-[#c9b0ff] to-[#9b7aef] bg-clip-text text-transparent"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 0px rgba(183,148,246,0.0))",
                      "drop-shadow(0 0 18px rgba(183,148,246,0.85))",
                      "drop-shadow(0 0 0px rgba(183,148,246,0.0))",
                    ],
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  AI
                  <motion.span
                    aria-hidden
                    className="absolute -inset-x-2 -inset-y-1 -z-10 rounded-lg bg-[#b794f6]/25 blur-md"
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{
                      duration: 2.4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
                ?
              </motion.span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <OfficialBrand className="mt-10 md:mt-12" />
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border bg-background text-foreground/60">
        <div className="site-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <OfficialBrand className="justify-start" />
          <p className="font-mono text-xs uppercase tracking-[0.15em]">
            © 2026 · Built for those who start at zero
          </p>
        </div>
      </footer>
    </>
  )
}
