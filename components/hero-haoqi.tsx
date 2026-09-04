"use client"

/**
 * HeroHaoqi — layered motion + WebGL glass / cursor lens (MVP).
 *
 * Motion: translation depth, springs, idle float, soft light/shadow.
 * WebGL: original spectral glass (navy/cyan/white) + swirl/bokeh lens.
 * Does not copy haoqi.design shader source — technique only.
 */

import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { HeroGlassText } from "@/components/hero/glass-text-scene"
import { HeroLoader } from "@/components/hero-loader"
import { KtIsMark } from "@/components/kt-is-mark"
import { useApplyModal } from "@/components/apply/apply-modal-context"

/* -------------------------------------------------------------------------- */
/* Motion system — springs & layer presets                                    */
/* -------------------------------------------------------------------------- */

type SpringCfg = { stiffness: number; damping: number; mass: number }

/** Heavier = more lag. Atmosphere trails; stickers respond first. */
const SPRINGS = {
  /** Soft atmospheric follow (parallax wash) */
  atmosphere: { stiffness: 38, damping: 22, mass: 1.1 } satisfies SpringCfg,
  /** Main hero object — weighted, expensive settle */
  main: { stiffness: 72, damping: 20, mass: 0.85 } satisfies SpringCfg,
  /** Stickers / foreground accents */
  accent: { stiffness: 110, damping: 18, mass: 0.55 } satisfies SpringCfg,
  /** Editorial type — barely moves */
  type: { stiffness: 95, damping: 24, mass: 0.7 } satisfies SpringCfg,
} as const

type LayerId =
  | "background"
  | "gradient"
  | "headline"
  | "info"
  | "main"
  | "stickerNear"
  | "stickerMid"
  | "stickerFar"
  | "cursorGlow"

/** Pixel travel at full pointer offset (±0.5). Translation only. */
const LAYER_DEPTH: Record<LayerId, { x: number; y: number }> = {
  background: { x: 6, y: 4 },
  gradient: { x: 18, y: 12 },
  headline: { x: 10, y: 6 },
  info: { x: 8, y: 5 },
  main: { x: 22, y: 14 },
  stickerNear: { x: 28, y: 20 },
  stickerMid: { x: 38, y: 28 },
  stickerFar: { x: 48, y: 34 },
  cursorGlow: { x: 0, y: 0 }, // driven by absolute pointer, not depth map
}

type FloatSpec = {
  ampX: number
  ampY: number
  ampR: number
  duration: number
  phase: number
}

/* -------------------------------------------------------------------------- */
/* Hooks (Hero-scoped; do not leak into the app)                              */
/* -------------------------------------------------------------------------- */

function useHeroPointer(sectionRef: RefObject<HTMLElement | null>) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Shared normalized pointer (−0.5 … 0.5), then forked into layer springs.
  const baseX = useSpring(rawX, SPRINGS.main)
  const baseY = useSpring(rawY, SPRINGS.main)

  const atmX = useSpring(rawX, SPRINGS.atmosphere)
  const atmY = useSpring(rawY, SPRINGS.atmosphere)

  const accentX = useSpring(rawX, SPRINGS.accent)
  const accentY = useSpring(rawY, SPRINGS.accent)

  const typeX = useSpring(rawX, SPRINGS.type)
  const typeY = useSpring(rawY, SPRINGS.type)

  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const pending = useRef<{ x: number; y: number } | null>(null)
  const raf = useRef(0)

  const flushCoords = () => {
    raf.current = 0
    if (!pending.current) return
    setCoords(pending.current)
    pending.current = null
  }

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = sectionRef.current ?? e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    rawX.set(px - 0.5)
    rawY.set(py - 0.5)

    pending.current = {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    }
    if (!raf.current) raf.current = requestAnimationFrame(flushCoords)
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  // Slow CSS gradient focal (atmosphere spring) — not a glow element
  useMotionValueEvent(atmX, "change", (vx) => {
    const el = sectionRef.current
    if (!el) return
    el.style.setProperty("--mx", `${((vx + 0.5) * 100).toFixed(2)}%`)
    el.style.setProperty("--my", `${((atmY.get() + 0.5) * 100).toFixed(2)}%`)
  })
  useMotionValueEvent(atmY, "change", (vy) => {
    const el = sectionRef.current
    if (!el) return
    el.style.setProperty("--mx", `${((atmX.get() + 0.5) * 100).toFixed(2)}%`)
    el.style.setProperty("--my", `${((vy + 0.5) * 100).toFixed(2)}%`)
  })

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current)
  }, [])

  return {
    coords,
    onMove,
    onLeave,
    raw: { x: rawX, y: rawY },
    springs: { baseX, baseY, atmX, atmY, accentX, accentY, typeX, typeY },
  }
}

/** Independent idle breathing — unique amplitude / duration / phase per object. */
function useFloating(spec: FloatSpec) {
  const t = useMotionValue(0)
  const x = useTransform(
    t,
    (v) => Math.sin(v * Math.PI * 2 + spec.phase) * spec.ampX,
  )
  const y = useTransform(
    t,
    (v) => Math.sin(v * Math.PI * 2 + spec.phase * 1.37) * spec.ampY,
  )
  const rotate = useTransform(
    t,
    (v) => Math.sin(v * Math.PI * 2 + spec.phase * 0.61) * spec.ampR,
  )

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const loop = (now: number) => {
      const elapsed = (now - start) / 1000
      t.set(elapsed / spec.duration)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [spec.duration, t])

  return { x, y, rotate }
}

function useParallax(
  sx: MotionValue<number>,
  sy: MotionValue<number>,
  depth: { x: number; y: number },
) {
  const x = useTransform(sx, [-0.5, 0.5], [-depth.x, depth.x])
  const y = useTransform(sy, [-0.5, 0.5], [-depth.y, depth.y])
  return { x, y }
}

/** Soft shadow that gently shifts opposite the pointer (light from cursor). */
function useDynamicShadow(
  sx: MotionValue<number>,
  sy: MotionValue<number>,
  strength = 1,
) {
  const ox = useTransform(sx, [-0.5, 0.5], [10 * strength, -10 * strength])
  const oy = useTransform(sy, [-0.5, 0.5], [18 * strength, 8 * strength])
  const blur = useTransform(sx, (v) => 28 + Math.abs(v) * 12 * strength)
  const alpha = useTransform(sy, (v) => 0.32 + Math.abs(v) * 0.08)
  return useMotionTemplate`drop-shadow(${ox}px ${oy}px ${blur}px rgba(0,0,0,${alpha}))`
}

/* -------------------------------------------------------------------------- */
/* Layer primitives                                                           */
/* -------------------------------------------------------------------------- */

function MotionLayer({
  children,
  className,
  style,
  x,
  y,
}: {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  x: MotionValue<number>
  y: MotionValue<number>
}) {
  return (
    <motion.div
      className={className}
      style={{ x, y, ...style, willChange: "transform" }}
    >
      {children}
    </motion.div>
  )
}

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-0 text-foreground/25 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 0V18M0 9H18" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function HeroHaoqi() {
  const sectionRef = useRef<HTMLElement>(null)
  const pointer = useHeroPointer(sectionRef)
  const { openApplyModal } = useApplyModal()

  const [reducedMotion, setReducedMotion] = useState(false)
  const [glassPointer, setGlassPointer] = useState({ x: 0, y: 0 })
  const [glassReady, setGlassReady] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const loadStartedAt = useRef(
    typeof performance !== "undefined" ? performance.now() : 0,
  )
  const glassRaf = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (!glassReady) return
    const MIN_MS = 900
    const FILL_MS = 420
    const elapsed = performance.now() - loadStartedAt.current
    const wait = Math.max(FILL_MS, MIN_MS - elapsed)
    const t = window.setTimeout(() => setShowLoader(false), wait)
    return () => window.clearTimeout(t)
  }, [glassReady])

  useEffect(() => {
    if (!showLoader) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [showLoader])

  useMotionValueEvent(pointer.raw.x, "change", (vx) => {
    const vy = pointer.raw.y.get()
    if (glassRaf.current) return
    glassRaf.current = requestAnimationFrame(() => {
      glassRaf.current = 0
      setGlassPointer({ x: vx, y: vy })
    })
  })
  useMotionValueEvent(pointer.raw.y, "change", (vy) => {
    const vx = pointer.raw.x.get()
    if (glassRaf.current) return
    glassRaf.current = requestAnimationFrame(() => {
      glassRaf.current = 0
      setGlassPointer({ x: vx, y: vy })
    })
  })

  // Layer parallax bindings
  const bg = useParallax(
    pointer.springs.atmX,
    pointer.springs.atmY,
    LAYER_DEPTH.background,
  )
  const gradient = useParallax(
    pointer.springs.atmX,
    pointer.springs.atmY,
    LAYER_DEPTH.gradient,
  )
  const info = useParallax(
    pointer.springs.typeX,
    pointer.springs.typeY,
    LAYER_DEPTH.info,
  )
  const headline = useParallax(
    pointer.springs.typeX,
    pointer.springs.typeY,
    LAYER_DEPTH.headline,
  )

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseMove={pointer.onMove}
      onMouseLeave={pointer.onLeave}
      className="relative flex h-screen min-h-[720px] w-full flex-col overflow-hidden bg-background"
      style={
        {
          ["--mx" as string]: "50%",
          ["--my" as string]: "42%",
        } as CSSProperties
      }
    >
      <HeroLoader visible={showLoader} ready={glassReady} />

      {/* ---------- Background — focal via --mx/--my (WebGL owns main field) ---------- */}
      <MotionLayer
        x={bg.x}
        y={bg.y}
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at var(--mx) var(--my), color-mix(in oklch, #1a2558 55%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Diagonal light streaks — under glass; parallax only, no cursor blob */}
      <MotionLayer
        x={gradient.x}
        y={gradient.y}
        className="pointer-events-none absolute inset-0 z-[8] mix-blend-screen"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, color-mix(in oklch, var(--primary) 18%, transparent) 46%, transparent 54%, color-mix(in oklch, var(--primary) 10%, transparent) 66%, transparent 74%)",
          }}
        />
      </MotionLayer>

      <HeroGlassText
        pointerX={glassPointer.x}
        pointerY={glassPointer.y}
        reducedMotion={reducedMotion}
        onReady={() => setGlassReady(true)}
      />

      {/* ---------- HEADER ---------- */}
      <header className="site-shell relative z-30 flex items-center justify-between py-6">
        <a
          href="#top"
          className="flex items-center gap-2.5 md:gap-3.5"
          aria-label="kt is WI ZEROTHON home"
          data-cursor="link"
        >
          <KtIsMark className="h-7 w-auto md:h-8" />
          <span className="text-base font-bold tracking-[0.08em] text-foreground md:text-lg">
            WI ZEROTHON
          </span>
        </a>
        <nav className="hidden items-center gap-3 md:flex lg:gap-4">
          {[
            { label: "대회 소개", href: "#about" },
            { label: "참가 방법", href: "#guide" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-cursor="link"
              className="font-pixel inline-flex items-center justify-center rounded-lg border-2 border-[#d8b4fe] bg-gradient-to-br from-[#6d4aff] via-[#5530c8] to-[#3b1f9e] px-5 py-3 text-base font-semibold leading-none tracking-wide text-white shadow-[0_0_0_1px_rgba(216,180,254,0.5),0_0_24px_rgba(124,108,240,0.55),0_0_48px_rgba(109,74,255,0.35)] transition-all hover:-translate-y-0.5 hover:border-[#ede9fe] hover:from-[#7c5cff] hover:via-[#6340d8] hover:to-[#4a28b0] hover:shadow-[0_0_0_1px_rgba(237,233,254,0.7),0_0_32px_rgba(167,139,250,0.75),0_0_64px_rgba(124,108,240,0.45)] md:px-6 md:py-3.5 md:text-lg lg:px-7 lg:py-4 lg:text-xl"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={openApplyModal}
            data-cursor="link"
            className="font-pixel inline-flex items-center justify-center rounded-lg border-2 border-[#d8b4fe] bg-gradient-to-br from-[#6d4aff] via-[#5530c8] to-[#3b1f9e] px-5 py-3 text-base font-semibold leading-none tracking-wide text-white shadow-[0_0_0_1px_rgba(216,180,254,0.5),0_0_24px_rgba(124,108,240,0.55),0_0_48px_rgba(109,74,255,0.35)] transition-all hover:-translate-y-0.5 hover:border-[#ede9fe] hover:from-[#7c5cff] hover:via-[#6340d8] hover:to-[#4a28b0] hover:shadow-[0_0_0_1px_rgba(237,233,254,0.7),0_0_32px_rgba(167,139,250,0.75),0_0_64px_rgba(124,108,240,0.45)] md:px-6 md:py-3.5 md:text-lg lg:px-7 lg:py-4 lg:text-xl"
          >
            참가 신청
          </button>
          <a
            href="#faq"
            data-cursor="link"
            className="font-pixel inline-flex items-center justify-center rounded-lg border-2 border-[#d8b4fe] bg-gradient-to-br from-[#6d4aff] via-[#5530c8] to-[#3b1f9e] px-5 py-3 text-base font-semibold leading-none tracking-wide text-white shadow-[0_0_0_1px_rgba(216,180,254,0.5),0_0_24px_rgba(124,108,240,0.55),0_0_48px_rgba(109,74,255,0.35)] transition-all hover:-translate-y-0.5 hover:border-[#ede9fe] hover:from-[#7c5cff] hover:via-[#6340d8] hover:to-[#4a28b0] hover:shadow-[0_0_0_1px_rgba(237,233,254,0.7),0_0_32px_rgba(167,139,250,0.75),0_0_64px_rgba(124,108,240,0.45)] md:px-6 md:py-3.5 md:text-lg lg:px-7 lg:py-4 lg:text-xl"
          >
            FAQ
          </a>
        </nav>
      </header>

      {/* ---------- TOP INFO ROW ---------- */}
      <MotionLayer
        x={info.x}
        y={info.y}
        className="site-shell relative z-20 grid flex-1 grid-cols-1 gap-8 pt-10 md:grid-cols-3 md:pt-12"
      >
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl font-bold leading-[1.05] tracking-tight text-foreground md:text-3xl"
        >
          48-Hour
          <br />
          WI Zerothon
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="justify-self-center text-center font-mono text-sm leading-relaxed text-foreground/90 md:text-left md:justify-self-auto"
        >
          Bring a spark of an idea.
          <br />
          Leave with intelligence.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-sm justify-self-start font-mono text-xs leading-relaxed text-foreground/80 md:justify-self-end md:text-right"
        >
          kt is WI ZEROTHON — a 48-hour build sprint where designers, engineers,
          and researchers turn zero into shipped. One question: what will you
          build with AI?
        </motion.p>
      </MotionLayer>

      {/* ---------- CENTER: handled by HeroGlassText (full-bleed WebGL) ---------- */}

      {/* Stickers render in WebGL (behind glass) for refraction — see SceneStickers */}

      {/* ---------- BOTTOM HEADLINE ---------- */}
      <MotionLayer x={headline.x} y={headline.y} className="site-shell relative z-20 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[16ch] text-left text-[clamp(4rem,10.4vw,11.5rem)] font-black uppercase leading-[0.88] tracking-[-0.055em] text-foreground"
        >
          <span className="block origin-left scale-x-[0.96]">
            <span className="block">What will you</span>
            <span className="mt-[0.02em] block">
              build with{" "}
              <span className="bg-gradient-to-b from-[#e8dcff] via-[#c9b0ff] to-[#9b7aef] bg-clip-text text-transparent">
                AI
              </span>
              <span>?</span>
            </span>
          </span>
        </motion.h1>
      </MotionLayer>
    </section>
  )
}
