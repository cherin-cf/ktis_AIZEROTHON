"use client"

import { useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

export function HeroCinematic() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Drive the cinematic transition off this tall wrapper's scroll progress.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  })

  // Hero flies forward: scales up and fades as the camera pushes through it.
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 7])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4, 0.55], [1, 1, 0])
  const heroBlur = useTransform(scrollYProgress, [0.3, 0.55], [0, 12])
  const heroFilter = useMotionTemplate`blur(${heroBlur}px)`

  // Next scene emerges from within the headline.
  const nextScale = useTransform(scrollYProgress, [0.45, 1], [0.7, 1])
  const nextOpacity = useTransform(scrollYProgress, [0.5, 0.75], [0, 1])
  const nextY = useTransform(scrollYProgress, [0.45, 1], [80, 0])

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  // Cursor-follow badge (spring smoothed).
  const bx = useMotionValue(0)
  const by = useMotionValue(0)
  const badgeX = useSpring(bx, { stiffness: 120, damping: 18, mass: 0.8 })
  const badgeY = useSpring(by, { stiffness: 120, damping: 18, mass: 0.8 })
  const badgeRotate = useTransform(badgeX, [-260, 260], [-14, 14])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    bx.set(e.clientX - rect.left - rect.width / 2)
    by.set(e.clientY - rect.top - rect.height / 2)
  }
  const onLeave = () => {
    bx.set(0)
    by.set(0)
  }

  return (
    <section ref={wrapperRef} id="top" className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
        {/* subtle grid backdrop */}
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(60% 50% at 50% 42%, transparent 40%, var(--background) 100%)",
          }}
        />

        {/* ---- HERO LAYER ---- */}
        <motion.div
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ scale: heroScale, opacity: heroOpacity, filter: heroFilter }}
          className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 text-center will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Applications open · 2026
          </motion.div>

          <h1 className="text-balance text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-foreground">
            <RevealLine delay={0.15}>What will you</RevealLine>
            <RevealLine delay={0.28}>
              build with <span className="text-primary">AI?</span>
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            KT is AI ZEROTHON — a 48-hour hackathon where builders turn raw ideas
            into working intelligence. From zero to shipped.
          </motion.p>

          {/* Floating cursor-follow badge (replaces a plain HELLO) */}
          <motion.div
            style={{ x: badgeX, y: badgeY, rotate: badgeRotate }}
            className="pointer-events-none absolute -top-10 right-[6%] hidden md:block"
          >
            <div className="relative -rotate-6 rounded-2xl border border-primary/20 bg-primary px-5 py-3 text-primary-foreground shadow-[0_20px_50px_-12px_rgb(63_107_255/0.6)]">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">
                KT is
              </div>
              <div className="text-xl font-bold leading-none tracking-tight">
                AI ZEROTHON
              </div>
              <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-background ring-2 ring-primary" />
            </div>
          </motion.div>
        </motion.div>

        {/* ---- NEXT SCENE LAYER (emerges from the headline) ---- */}
        <motion.div
          style={{ scale: nextScale, opacity: nextOpacity, y: nextY }}
          className="absolute inset-0 z-20 flex items-center justify-center px-6 will-change-transform"
        >
          <div className="mx-auto max-w-4xl text-center">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              The premise
            </span>
            <p className="mt-6 text-balance text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
              Every breakthrough starts at zero. Bring a spark of an idea, and
              leave with something the world hasn&apos;t seen yet.
            </p>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Scroll to enter
            <span className="flex h-8 w-5 items-start justify-center rounded-full border border-border p-1">
              <motion.span
                className="h-2 w-1 rounded-full bg-foreground"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
