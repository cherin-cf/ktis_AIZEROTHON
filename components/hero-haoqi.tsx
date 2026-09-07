"use client"

/**
 * HeroHaoqi — layered motion + hero title.
 *
 * TITLE MODES (toggle USE_HERO_TITLE_GLASS_A below):
 * - A (active, true): WebGL Lobster jelly glass + falling stickers
 * - B (false): prerender hybrid — /hero/title-wi-zerothon.png + light parallax
 *
 * Remembered A upgrade path (if improving realtime 3D later):
 * 1) Swap Lobster → geometric black sans + sharp chamfer bevels
 * 2) Layered materials (transmission body + rim/clearcoat + specular highlights)
 * Keep mouse wand deformation; do not rely on prerender for A.
 */

import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { HeroGlassText } from "@/components/hero/glass-text-scene"
import { HeroLoader } from "@/components/hero-loader"
import { useApplyModal } from "@/components/apply/apply-modal-context"
import { heroCtaRef } from "@/lib/hero-cta-ref"

/** true = A (WebGL glass) · false = B (prerender title hybrid) */
const USE_HERO_TITLE_GLASS_A = true

/** Page 1 = first screen + short run past the CTA fold (before 이란?) */
const PAGE1_H = "calc(100svh + min(28vh, 14rem))" as const

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

function useHeroPointer(
  sectionRef: RefObject<HTMLDivElement | null>,
  titleZoneRef?: RefObject<HTMLDivElement | null>,
  glassPointerRef?: MutableRefObject<{ x: number; y: number }>,
) {
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

    // Glass wand must use the title-stage box (first screen), not full Earth height
    if (glassPointerRef) {
      const zone = titleZoneRef?.current
      if (zone) {
        const zr = zone.getBoundingClientRect()
        const zw = Math.max(1, zr.width)
        const zh = Math.max(1, zr.height)
        glassPointerRef.current = {
          x: (e.clientX - zr.left) / zw - 0.5,
          y: (e.clientY - zr.top) / zh - 0.5,
        }
      } else {
        glassPointerRef.current = { x: px - 0.5, y: py - 0.5 }
      }
    }

    pending.current = {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    }
    if (!raf.current) raf.current = requestAnimationFrame(flushCoords)
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
    if (glassPointerRef) glassPointerRef.current = { x: 0, y: 0 }
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

  // Reliable glass wand tracking (section onMouseMove can miss under overlays)
  useEffect(() => {
    if (!glassPointerRef || !titleZoneRef) return
    const onMove = (e: PointerEvent) => {
      const zone = titleZoneRef.current
      if (!zone) return
      const zr = zone.getBoundingClientRect()
      const zw = Math.max(1, zr.width)
      const zh = Math.max(1, zr.height)
      glassPointerRef.current = {
        x: (e.clientX - zr.left) / zw - 0.5,
        y: (e.clientY - zr.top) / zh - 0.5,
      }
    }
    const onLeave = () => {
      glassPointerRef.current = { x: 0, y: 0 }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
    }
  }, [glassPointerRef, titleZoneRef])

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

/** EARTH art — drop mid void so the limb sits nearer the title */
const EARTH_IMG = { w: 1024, h: 1536, src: "/hero/EARTH.png" } as const
/** Keep space/moons through this fraction of the source */
const EARTH_KEEP_TOP = 0.24
/** Resume at the atmospheric limb */
const EARTH_KEEP_FROM = 0.465
/** Nudge top-left moon/planet higher in the frame (source-height fraction) */
const EARTH_TOP_LIFT = 0.055
/** >1 zooms the top plate out slightly (moon reads smaller; keeps right crescent in frame) */
const EARTH_TOP_ZOOM_OUT = 1.14
const EARTH_TOP_H = EARTH_IMG.h * EARTH_KEEP_TOP
const EARTH_BOT_H = EARTH_IMG.h * (1 - EARTH_KEEP_FROM)
const EARTH_JOIN_FADE = "linear-gradient(to bottom, transparent 0%, #000 14%)"

export function HeroHaoqi() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleZoneRef = useRef<HTMLDivElement>(null)
  const glassPointerRef = useRef({ x: 0, y: 0 })
  const pointer = useHeroPointer(sectionRef, titleZoneRef, glassPointerRef)
  const { openApplyModal } = useApplyModal()

  const [reducedMotion, setReducedMotion] = useState(false)
  const [glassReady, setGlassReady] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const loadStartedAt = useRef(
    typeof performance !== "undefined" ? performance.now() : 0,
  )

  /**
   * Stage 1 — during / after first-screen scroll (ZEROTHON page):
   * Earth below the limb fades to void. Space above stays clear.
   */
  const page1Ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: firstScreenScroll } = useScroll({
    target: page1Ref,
    offset: ["start start", "end start"],
  })
  const bottomDark = useTransform(
    firstScreenScroll,
    [0.05, 0.28, 0.55],
    [0, 0.62, 1],
  )
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

  // B mode: don't block forever if title image cache-skips onLoad
  useEffect(() => {
    if (USE_HERO_TITLE_GLASS_A) return
    const t = window.setTimeout(() => setGlassReady(true), 2500)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!showLoader) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [showLoader])

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
  const propMid = useParallax(
    pointer.springs.accentX,
    pointer.springs.accentY,
    LAYER_DEPTH.stickerMid,
  )
  const propNear = useParallax(
    pointer.springs.accentX,
    pointer.springs.accentY,
    LAYER_DEPTH.stickerNear,
  )
  const robotFloat = useFloating({
    ampX: 5,
    ampY: 9,
    ampR: 1.8,
    duration: 7.2,
    phase: 0.35,
  })
  const laptopFloat = useFloating({
    ampX: 4,
    ampY: 7,
    ampR: 1.2,
    duration: 8.6,
    phase: 1.4,
  })
  const robotX = useTransform(
    [propMid.x, robotFloat.x],
    ([a, b]) => (a as number) + (b as number),
  )
  const robotY = useTransform(
    [propMid.y, robotFloat.y],
    ([a, b]) => (a as number) + (b as number),
  )
  const laptopX = useTransform(
    [propNear.x, laptopFloat.x],
    ([a, b]) => (a as number) + (b as number),
  )
  const laptopY = useTransform(
    [propNear.y, laptopFloat.y],
    ([a, b]) => (a as number) + (b as number),
  )
  const robotShadow = useDynamicShadow(
    pointer.springs.accentX,
    pointer.springs.accentY,
    0.85,
  )
  const laptopShadow = useDynamicShadow(
    pointer.springs.accentX,
    pointer.springs.accentY,
    0.7,
  )
  const titleParallax = useParallax(
    pointer.springs.baseX,
    pointer.springs.baseY,
    LAYER_DEPTH.main,
  )
  const titleFloat = useFloating({
    ampX: 3,
    ampY: 5,
    ampR: 0.4,
    duration: 9.5,
    phase: 0.8,
  })
  const titleX = useTransform(
    [titleParallax.x, titleFloat.x],
    ([a, b]) => (a as number) + (b as number),
  )
  const titleY = useTransform(
    [titleParallax.y, titleFloat.y],
    ([a, b]) => (a as number) + (b as number),
  )

  return (
    <section id="top" className="relative z-10 w-full overflow-x-clip overflow-y-visible bg-[#09071c]">
      {/*
        EARTH framed for title: keep top space + Earth limb/bottom,
        skip the empty mid void so the planet sits near ZEROTHON.
      */}
      <div
        ref={sectionRef}
        onMouseMove={pointer.onMove}
        onMouseLeave={pointer.onLeave}
        className="relative z-10 w-full overflow-x-clip overflow-y-visible"
        style={
          {
            /* Cap to page 1 — no empty night strip below sticker cutoff */
            height: PAGE1_H,
            minHeight: PAGE1_H,
            ["--mx" as string]: "50%",
            ["--my" as string]: "42%",
          } as CSSProperties
        }
      >
        {/* Earth art — never fade the whole frame (top must stay lit) */}
        <div className="pointer-events-none absolute inset-0 z-0">
        {/* Top plate — space / moons / streaks */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{
            height: `${((EARTH_TOP_H + EARTH_IMG.h * 0.05) / (EARTH_TOP_H + EARTH_BOT_H)) * 100}%`,
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={EARTH_IMG.src}
            alt=""
            width={EARTH_IMG.w}
            height={EARTH_IMG.h}
            draggable={false}
            decoding="async"
            className="absolute left-0 w-full max-w-none select-none"
            style={{
              height: `${(EARTH_IMG.h / (EARTH_TOP_H * EARTH_TOP_ZOOM_OUT)) * 100}%`,
              top: `${(-EARTH_TOP_LIFT / (EARTH_KEEP_TOP * EARTH_TOP_ZOOM_OUT)) * 100}%`,
            }}
          />
        </div>

        {/* Bottom plate — limb + night side (feathered into top) */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 overflow-hidden"
          style={{
            height: `${((EARTH_BOT_H + EARTH_IMG.h * 0.05) / (EARTH_TOP_H + EARTH_BOT_H)) * 100}%`,
            WebkitMaskImage: EARTH_JOIN_FADE,
            maskImage: EARTH_JOIN_FADE,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={EARTH_IMG.src}
            alt=""
            width={EARTH_IMG.w}
            height={EARTH_IMG.h}
            draggable={false}
            decoding="async"
            className="absolute left-0 w-full max-w-none select-none"
            style={{
              height: `${(EARTH_IMG.h / EARTH_BOT_H) * 100}%`,
              top: `${(-EARTH_KEEP_FROM / (1 - EARTH_KEEP_FROM)) * 100}%`,
            }}
          />
        </div>
        </div>

        {/* Soft exit — Earth stars feather into void (kills hard cut above countdown) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[42%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(9,7,28,0.18) 22%, rgba(9,7,28,0.55) 48%, rgba(9,7,28,0.88) 72%, #09071c 92%, #09071c 100%)",
          }}
        />

        {/* Night veil from limb downward — visible on the “one scroll” Earth page */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]"
          style={{
            top: "38%",
            opacity: bottomDark,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(9,7,28,0.22) 14%, rgba(9,7,28,0.62) 36%, rgba(9,7,28,0.92) 62%, #09071c 86%, #09071c 100%)",
          }}
        />

        {/* Soft wash — full framed height */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 70% 28% at 50% 12%, rgba(5,8,28,0.14), transparent 58%), linear-gradient(180deg, rgba(5,8,20,0.18) 0%, transparent 14%, transparent 100%)",
          }}
        />

        <MotionLayer
          x={bg.x}
          y={bg.y}
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 80% 42% at var(--mx) var(--my), color-mix(in oklch, #1a2558 20%, transparent) 0%, transparent 70%)",
          }}
        />

        <MotionLayer
          x={gradient.x}
          y={gradient.y}
          className="pointer-events-none absolute inset-x-0 top-0 z-[8] h-[min(100%,100svh)] mix-blend-screen"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, color-mix(in oklch, var(--primary) 14%, transparent) 46%, transparent 54%, color-mix(in oklch, var(--primary) 8%, transparent) 66%, transparent 74%)",
            }}
          />
        </MotionLayer>

        {/* Soft bridge over the join (hides any remaining cut) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-[3]"
          style={{
            top: `${(EARTH_TOP_H / (EARTH_TOP_H + EARTH_BOT_H)) * 100 - 5}%`,
            height: "12%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(3,7,20,0.28) 45%, transparent 100%)",
          }}
        />

        {/*
          Page 1 = first screen (100svh) + former middle height.
          Glass/stickers fill page 1; UI stays locked to the top 100svh.
        */}
        <div
          ref={page1Ref}
          className="pointer-events-none absolute inset-0 z-[12]"
        >
      {/* WebGL title + sticker rain across full page 1 */}
      {USE_HERO_TITLE_GLASS_A ? (
        <HeroGlassText
          pointerRef={glassPointerRef}
          reducedMotion={reducedMotion}
          onReady={() => setGlassReady(true)}
        />
      ) : null}

      {/* First-screen UI box — % / clamp stay relative to 100svh */}
      <div
        ref={titleZoneRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-[12] h-[100svh]"
      >
      <HeroLoader visible={showLoader} ready={glassReady} />

      {/* ---------- TITLE: B = prerender hybrid (A is full page-1 canvas above) ---------- */}
      {!USE_HERO_TITLE_GLASS_A ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[12] flex items-center justify-center"
          style={{
            x: titleX,
            y: titleY,
            rotate: reducedMotion ? 0 : titleFloat.rotate,
            willChange: "transform",
          }}
        >
          <div className="relative w-[min(92vw,860px)] -translate-y-[4vh] md:w-[min(78vw,920px)] md:-translate-y-[2vh]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22),rgba(168,85,247,0.12)_45%,transparent_70%)] blur-2xl"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/title-wi-zerothon.png"
              alt="WI ZEROTHON"
              width={492}
              height={190}
              draggable={false}
              onLoad={() => setGlassReady(true)}
              className="relative z-[1] h-auto w-full select-none object-contain drop-shadow-[0_0_40px_rgba(96,165,250,0.35)]"
            />
          </div>
        </motion.div>
      ) : null}

      {/* ---------- HEADER: logo | centered nav | CTA ---------- */}
      <header className="pointer-events-auto relative z-30 w-full px-3 py-5 sm:px-4 md:px-5 md:py-[1.35rem] lg:px-6 xl:px-8">
        {/* Soft bright band behind menu (attachment glow) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] top-1/2 hidden h-11 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,160,255,0.2)_0%,rgba(80,120,220,0.08)_45%,transparent_70%)] blur-md md:block"
        />
        <div className="relative grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <a
            href="#top"
            className="flex items-center justify-self-start"
            aria-label="kt is WI ZEROTHON home"
            data-cursor="link"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/wi-zerothon-logo-dark.png"
              alt="kt is WI ZEROTHON"
              width={642}
              height={96}
              draggable={false}
              className="h-7 w-auto select-none object-contain object-left md:h-8"
            />
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center justify-self-center gap-24 -translate-x-6 md:flex lg:gap-28 lg:-translate-x-10 xl:gap-32 xl:-translate-x-12"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            {[
              { label: "대회 소개", href: "#about" },
              { label: "참가 방법", href: "#guide" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-cursor="link"
                className="text-base font-bold tracking-tight text-white/95 [text-shadow:0_0_16px_rgba(180,210,255,0.35)] transition hover:text-white md:text-lg lg:text-xl"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="justify-self-end">
            <button
              type="button"
              onClick={openApplyModal}
              data-cursor="link"
              style={{ fontFamily: "var(--font-nav)" }}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#5b21b6] via-[#4338ca] to-[#1d4ed8] px-9 py-3 text-base font-extrabold tracking-tight text-white shadow-[0_0_0_1.5px_rgba(255,255,255,0.55),0_0_18px_rgba(255,255,255,0.35),0_0_36px_rgba(255,255,255,0.15),0_3px_0_0_rgba(30,27,75,0.85),0_8px_22px_rgba(67,56,202,0.45),inset_0_1px_0_rgba(255,255,255,0.28)] ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:shadow-[0_0_0_1.5px_rgba(255,255,255,0.65),0_0_22px_rgba(255,255,255,0.4),0_0_40px_rgba(255,255,255,0.18),0_4px_0_0_rgba(30,27,75,0.85),0_12px_28px_rgba(67,56,202,0.55),inset_0_1px_0_rgba(255,255,255,0.32)] active:translate-y-0 md:min-w-[12.25rem] md:px-11 md:py-3 md:text-[1.05rem]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-2 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/22 to-transparent"
              />
              <span className="relative">지금 신청하기 →</span>
            </button>
          </div>
        </div>

        {/* Short luminous hairline — deep blue with soft center glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] bottom-0 h-px md:inset-x-[10%]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(40,70,140,0.55) 12%, rgba(90,140,220,0.95) 38%, rgba(160,200,255,0.7) 50%, rgba(90,140,220,0.95) 62%, rgba(40,70,140,0.55) 88%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[16%] bottom-0 h-[2px] blur-[1.5px] md:inset-x-[18%]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(80,130,210,0.35) 30%, rgba(140,185,255,0.45) 50%, rgba(80,130,210,0.35) 70%, transparent 100%)",
          }}
        />
      </header>

      {/* ---------- Floating copy (repositioned) ---------- */}
      <MotionLayer
        x={info.x}
        y={info.y}
        className="pointer-events-none absolute inset-0 z-20"
      >
        {/* 48-Hour — top-right */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-[clamp(0.75rem,3vw,2rem)] top-[clamp(5.5rem,11vh,7.5rem)] text-right text-3xl font-bold leading-[1.05] tracking-tight text-white [text-shadow:0_0_24px_rgba(160,200,255,0.35)] md:text-4xl lg:text-[2.75rem]"
        >
          48-Hour
          <br />
          WI Zerothon
        </motion.h2>

        {/* Bring a spark… → bottom-left */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[clamp(14%,16vh,20%)] left-[clamp(1rem,4vw,3rem)] max-w-[16rem] font-mono text-sm leading-relaxed text-white/90 md:text-base"
        >
          Bring a spark of an idea.
          <br />
          Leave with intelligence.
        </motion.p>

        {/* Event blurb → mid-right */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-[clamp(1rem,4vw,3rem)] top-[clamp(28%,34vh,42%)] max-w-[17rem] text-right font-mono text-xs leading-relaxed text-white/80 md:max-w-[19rem] md:text-sm"
        >
          kt is WI ZEROTHON — a 48-hour build sprint where designers, engineers,
          and researchers turn zero into shipped. One question: what will you
          build with AI?
        </motion.p>
      </MotionLayer>

      {/* ---------- CENTER: handled by HeroGlassText (full-bleed WebGL) ---------- */}

      {/* Stickers render in WebGL (behind glass) for refraction — see SceneStickers */}

      {/* Tagline + CTAs — original first-screen position under ZEROTHON */}
      <div
        id="hero-cta"
        ref={(node) => {
          ;(heroCtaRef as { current: HTMLElement | null }).current = node
        }}
        className="pointer-events-none absolute inset-x-0 top-[min(78vh,80%)] z-[25] flex -translate-x-5 flex-col items-center gap-4 px-4 sm:top-[min(79vh,81%)] sm:-translate-x-6 sm:gap-5 md:top-[min(80vh,82%)] md:-translate-x-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: headline.x, y: headline.y }}
          className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-white sm:text-base sm:tracking-[0.26em] md:text-lg md:tracking-[0.28em]"
        >
          What will you build with{" "}
          <span className="bg-gradient-to-r from-[#22d3ee] via-[#67e8f9] to-[#c084fc] bg-clip-text font-bold text-transparent [text-shadow:none] drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]">
            AI
          </span>
          <span className="bg-gradient-to-r from-[#c084fc] to-[#e879f9] bg-clip-text font-bold text-transparent">
            ?
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex flex-wrap items-center justify-center gap-4 sm:gap-5"
          style={{ fontFamily: "var(--font-nav)" }}
        >
          <button
            type="button"
            onClick={openApplyModal}
            data-cursor="link"
            className="relative min-w-[14.5rem] overflow-hidden rounded-full bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#22d3ee] px-12 py-3.5 text-base font-extrabold tracking-tight text-white shadow-[0_0_0_1.5px_rgba(255,255,255,0.6),0_0_20px_rgba(255,255,255,0.4),0_0_42px_rgba(255,255,255,0.18),0_0_28px_rgba(99,102,241,0.45),0_0_48px_rgba(34,211,238,0.22),inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-white/45 transition hover:brightness-110 md:min-w-[16.5rem] md:px-14 md:py-4 md:text-lg"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -left-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/50 blur-md"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/30 to-transparent"
            />
            <span className="relative">지금 신청하기 →</span>
          </button>
          <a
            href="#about"
            data-cursor="link"
            className="min-w-[14.5rem] rounded-full border border-[#7dd3fc]/70 bg-transparent px-12 py-3.5 text-center text-base font-bold tracking-tight text-white transition hover:border-[#a5f3fc] hover:bg-white/5 md:min-w-[16.5rem] md:px-14 md:py-4 md:text-lg"
          >
            대회 소개 보기
          </a>
        </motion.div>
      </div>
      </div>
      </div>

      {/* Props live on full Earth frame (not first-screen box) — no 100svh clip */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-[15] hidden sm:block"
        style={{
          left: "clamp(0.5rem, 2vw, 1.5rem)",
          top: "clamp(5%, 7vh, 11%)",
          x: robotX,
          y: robotY,
          rotate: robotFloat.rotate,
          filter: robotShadow,
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/ROBOT.png"
          alt=""
          draggable={false}
          className="h-auto w-[min(28vw,250px)] select-none object-contain md:w-[min(24vw,280px)] lg:w-[min(20vw,310px)]"
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-[15] hidden sm:block"
        style={{
          right: "clamp(0.75rem, 3vw, 2.5rem)",
          top: "min(72vh, 78%)",
          x: laptopX,
          y: laptopY,
          rotate: laptopFloat.rotate,
          filter: laptopShadow,
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/NEW_NOTEBOOK.png"
          alt=""
          draggable={false}
          className="h-auto w-[min(30vw,260px)] rotate-[8deg] select-none object-contain md:w-[min(26vw,280px)] lg:w-[min(22vw,300px)]"
        />
      </motion.div>
      </div>
    </section>
  )
}
