"use client"

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Reveal } from "@/components/reveal"

/* Assets: Downloads/ICON → public/guide/*.png (trimmed to content bounds) */
const V = "g5"
const SHOW_TEAM_MATCHING = false

function GuideImg({
  src,
  alt,
  width,
  height,
  className = "",
  pixelated = false,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  pixelated?: boolean
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      draggable={false}
      className={`select-none object-contain ${className}`}
      style={pixelated ? { imageRendering: "pixelated" } : undefined}
    />
  )
}

function Twinkles() {
  const stars = [
    { t: "5%", l: "8%", d: 0 },
    { t: "12%", l: "40%", d: 0.6 },
    { t: "8%", l: "72%", d: 1.2 },
    { t: "35%", l: "92%", d: 0.3 },
    { t: "60%", l: "4%", d: 0.9 },
    { t: "78%", l: "55%", d: 1.4 },
    { t: "88%", l: "85%", d: 0.5 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-[11px] text-[#5b8cff]/70"
          style={{ top: s.t, left: s.l }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: 2.2 + (i % 3) * 0.4,
            delay: s.d,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          +
        </motion.span>
      ))}
    </div>
  )
}

function PixelCursor() {
  return (
    <motion.svg
      width="28"
      height="32"
      viewBox="0 0 8 10"
      shapeRendering="crispEdges"
      aria-hidden
      animate={{ x: [0, 3, 0], y: [0, 2, 0] }}
      transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <rect x="1" y="0" width="2" height="8" fill="#7eb6ff" />
      <rect x="3" y="1" width="2" height="2" fill="#7eb6ff" />
      <rect x="3" y="3" width="3" height="2" fill="#5b8cff" />
      <rect x="3" y="5" width="2" height="2" fill="#3b6cff" />
    </motion.svg>
  )
}

function PixelFlag() {
  return (
    <svg width="28" height="36" viewBox="0 0 8 12" shapeRendering="crispEdges" aria-hidden>
      <rect x="1" y="0" width="1" height="10" fill="#7eb6ff" />
      <g className="origin-[1px_1px] [animation:pixel-wave_1.2s_ease-in-out_infinite] motion-reduce:animate-none">
        <rect x="2" y="1" width="4" height="1" fill="#5b8cff" />
        <rect x="2" y="2" width="5" height="1" fill="#3b6cff" />
        <rect x="2" y="3" width="4" height="1" fill="#4d8fff" />
      </g>
      <rect x="0" y="10" width="3" height="1" fill="#2a4fcf" />
    </svg>
  )
}

function ActionButton({
  href,
  children,
  download,
}: {
  href: string
  children: ReactNode
  download?: string | boolean
}) {
  return (
    <motion.a
      href={href}
      download={download}
      data-cursor="link"
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b6cff] px-5 py-4 text-lg font-semibold text-white shadow-[0_0_24px_rgba(59,108,255,0.35)] transition-colors hover:bg-[#5b8cff] md:text-xl"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: [
          "0 0 16px rgba(59,108,255,0.28)",
          "0 0 28px rgba(59,108,255,0.5)",
          "0 0 16px rgba(59,108,255,0.28)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      }}
    >
      {children}
      <span aria-hidden>→</span>
    </motion.a>
  )
}

/** Header illustration — build together scene */
function HeaderVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[400px] md:max-w-[460px] lg:max-w-[500px]">
      <GuideImg
        src={`/guide/build-together.png?v=${V}`}
        alt="함께 배우고 만드는 제로톤"
        width={1536}
        height={1024}
        className="h-auto w-full drop-shadow-[0_0_40px_rgba(124,108,240,0.35)]"
      />
    </div>
  )
}

function ScheduleIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative inline-flex h-[72px] w-[80px] shrink-0 items-center justify-center md:h-[84px] md:w-[92px]">
      <span
        aria-hidden
        className="absolute inset-[8%] rounded-full bg-[#a78bfa]/35 blur-2xl"
      />
      <span
        aria-hidden
        className="absolute inset-x-[16%] bottom-[6%] h-2.5 rounded-full bg-[#1a1030]/50 blur-md"
      />
      <GuideImg
        src={src}
        alt={alt}
        width={512}
        height={512}
        className="relative z-[1] h-[58px] w-auto drop-shadow-[0_8px_18px_rgba(91,140,255,0.45)] md:h-[70px]"
      />
    </span>
  )
}

/** 모집 대상 / 선발 규모 — centered blue info cards */
function StatCard({
  label,
  value,
  note,
  delay = 0,
}: {
  label: string
  value: ReactNode
  note?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div
        data-cursor="hover"
        className="group relative flex h-full min-h-[148px] flex-col overflow-hidden rounded-2xl border border-[#5b8cff]/55 bg-gradient-to-br from-[#0c1640] via-[#080d28] to-[#05081a] px-6 py-5 text-center shadow-[0_0_0_1px_rgba(59,108,255,0.12),0_0_32px_rgba(59,108,255,0.16)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#7eb6ff]/80 hover:shadow-[0_0_0_1px_rgba(126,182,255,0.35),0_0_40px_rgba(91,140,255,0.3)] md:min-h-[160px] md:px-8 md:py-6"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#3b6cff]/25 blur-3xl"
          animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3.2, delay, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -bottom-12 left-10 h-24 w-44 rounded-full bg-[#7eb6ff]/12 blur-3xl"
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{
            duration: 2.8,
            delay: delay + 0.4,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <div className="relative flex flex-1 flex-col justify-center">
          <div className="font-sans text-lg font-semibold tracking-[0.16em] text-[#7eb6ff] md:text-xl lg:text-2xl">
            {label}
          </div>
          <div
            aria-hidden
            className="mx-auto mt-3 h-px w-full max-w-[14rem] bg-gradient-to-r from-transparent via-[#5b8cff]/55 to-transparent md:mt-3.5"
          />
          <div className="mt-3.5 text-[1.65rem] font-bold leading-tight tracking-tight text-foreground md:mt-4 md:text-[2rem] lg:text-[2.25rem]">
            {value}
          </div>
          <p
            className={`mt-2 font-sans text-base md:text-lg ${
              note ? "text-foreground/75" : "invisible"
            }`}
          >
            {note ?? "placeholder"}
          </p>
        </div>
      </div>
    </Reveal>
  )
}

const SCHEDULE = [
  {
    day: "STEP 01",
    src: `/guide/day1.png?v=${V}`,
    iconAlt: "대상자 모집",
    title: "1. 대상자 모집/참가서류 제출",
    desc: "  참가 신청 및 참가서류를 접수합니다.",
    date: "~9.18.(금)",
  },
  {
    day: "STEP 02",
    src: `/guide/day2.png?v=${V}`,
    iconAlt: "참가 팀 발표",
    title: "2. 참가 팀 발표",
    desc: "  최종 참가 팀을 발표합니다.",
    date: "9.28.(월)",
  },
  {
    day: "STEP 03",
    src: `/guide/day3.png?v=${V}`,
    iconAlt: "WI 제로톤 교육",
    title: "3. WI 제로톤 1/2차 교육",
    desc: "  제로톤 준비를 위한 사전 교육을 진행합니다.",
    date: "'26.10월",
  },
  {
    day: "STEP 04",
    src: `/guide/day4.png?v=${V}`,
    iconAlt: "WI 제로톤",
    title: "4. WI 제로톤",
    desc: "  48시간 집중 개발! 아이디어를 현실로 만듭니다.",
    date: "'26.11월 초",
  },
] as const

function ScheduleTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const flagRef = useRef<HTMLDivElement>(null)
  const sparkedRef = useRef<boolean[]>(SCHEDULE.map(() => false))
  const flagFiredRef = useRef(false)
  const [reached, setReached] = useState(() => SCHEDULE.map(() => false))
  const [sparkIndex, setSparkIndex] = useState<number | null>(null)
  const [flagBurstKey, setFlagBurstKey] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.55"],
  })

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  const fireFlagBurst = () => {
    if (flagFiredRef.current) return
    flagFiredRef.current = true
    setFlagBurstKey((k) => k + 1)
  }

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = SCHEDULE.length
    for (let i = 0; i < n; i++) {
      const threshold = n === 1 ? 0 : i / (n - 1)
      if (v >= threshold - 0.02 && !sparkedRef.current[i]) {
        sparkedRef.current[i] = true
        setReached((prev) => {
          if (prev[i]) return prev
          const next = [...prev]
          next[i] = true
          return next
        })
        setSparkIndex(i)
        window.setTimeout(() => {
          setSparkIndex((cur) => (cur === i ? null : cur))
        }, 700)
      }
    }
    // Reset so burst can replay when scrolling back up
    if (v < 0.55) {
      flagFiredRef.current = false
    }
  })

  // Fire when growing line nearly fills (reaches flag)
  useMotionValueEvent(lineScale, "change", (v) => {
    if (v >= 0.88) fireFlagBurst()
  })

  // Fallback: flag enters lower viewport
  useEffect(() => {
    const el = flagRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          fireFlagBurst()
        }
      },
      { threshold: [0.4, 0.7], rootMargin: "0px 0px -10% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const particles = [
    { a: -80, d: 28, c: "#dff0ff", s: "✦" },
    { a: -40, d: 34, c: "#7eb6ff", s: "+" },
    { a: 0, d: 36, c: "#c9b0ff", s: "✦" },
    { a: 40, d: 34, c: "#7eb6ff", s: "+" },
    { a: 80, d: 28, c: "#dff0ff", s: "✦" },
    { a: -120, d: 24, c: "#5b8cff", s: "+" },
    { a: 120, d: 24, c: "#5b8cff", s: "+" },
    { a: -20, d: 30, c: "#e9d5ff", s: "✦" },
    { a: 20, d: 30, c: "#e9d5ff", s: "+" },
    { a: -55, d: 20, c: "#b794f6", s: "·" },
    { a: 55, d: 20, c: "#b794f6", s: "·" },
  ]

  return (
    <div ref={containerRef} className="relative overflow-visible">
      {/* Track (dim) — first node → blue flag */}
      <div
        aria-hidden
        className="absolute bottom-3 left-[calc(1.75rem-1px)] top-5 w-[2px] bg-[#3b6cff]/20 md:left-[calc(2rem-1px)] md:top-6"
      />
      {/* Growing line */}
      <motion.div
        aria-hidden
        className="absolute left-[calc(1.75rem-1px)] top-5 w-[2px] origin-top bg-gradient-to-b from-[#7eb6ff] via-[#5b8cff] to-[#3b6cff] shadow-[0_0_12px_rgba(91,140,255,0.65)] md:left-[calc(2rem-1px)] md:top-6"
        style={{
          bottom: "0.75rem",
          scaleY: lineScale,
        }}
      />

      <div className="flex flex-col gap-8 md:gap-11">
        {SCHEDULE.map((s, i) => {
          const active = reached[i]
          const sparking = sparkIndex === i
          return (
            <div
              key={s.day}
              className="relative grid grid-cols-[3.5rem_1fr] gap-4 md:grid-cols-[4rem_1fr] md:gap-6"
            >
              <div className="relative z-[1] flex items-center justify-center pt-5 md:pt-6">
                <motion.span
                  className={`relative block h-2.5 w-2.5 rounded-full md:h-3 md:w-3 ${
                    active ? "bg-[#dff0ff]" : "bg-[#5b8cff]/55"
                  }`}
                  animate={
                    sparking
                      ? {
                          scale: [1, 1.8, 1],
                          boxShadow: [
                            "0 0 0 0 rgba(126,182,255,0)",
                            "0 0 0 10px rgba(126,182,255,0.35)",
                            "0 0 22px 3px rgba(183,148,246,0.5)",
                            "0 0 0 0 rgba(126,182,255,0)",
                          ],
                        }
                      : active
                        ? {
                            boxShadow: "0 0 12px rgba(126,182,255,0.55)",
                            scale: 1,
                          }
                        : { boxShadow: "0 0 0 rgba(0,0,0,0)", scale: 1 }
                  }
                  transition={{ duration: 0.65, ease: "easeOut" }}
                />
              </div>

              <div
                data-cursor="hover"
                className={`flex items-center gap-4 rounded-xl border px-4 py-4 transition-[border-color,transform,box-shadow,background-color] hover:-translate-y-0.5 md:gap-6 md:px-6 md:py-5 ${
                  active
                    ? "border-[#d8b4fe]/70 bg-[#5b4a8f]/55 shadow-[0_0_28px_rgba(192,132,252,0.2)]"
                    : "border-[#c4b5fd]/45 bg-[#4a3a72]/50 hover:border-[#e9d5ff]/60 hover:bg-[#554080]/55"
                }`}
              >
                <ScheduleIcon src={s.src} alt={s.iconAlt} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h4 className="text-xl font-bold tracking-tight text-foreground md:text-2xl lg:text-[1.65rem]">
                      {s.title}
                    </h4>
                    <div className="shrink-0 text-xl font-bold tracking-tight text-foreground md:text-2xl lg:text-[1.65rem]">
                      {s.date}
                    </div>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-lg leading-snug text-foreground/85 md:text-xl">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Flag endpoint + firework */}
      <div className="relative mt-8 grid grid-cols-[3.5rem_1fr] items-center gap-4 overflow-visible md:mt-10 md:grid-cols-[4rem_1fr] md:gap-6">
        <div className="relative z-[2] flex justify-center overflow-visible">
          <div ref={flagRef} className="relative overflow-visible py-2">
            <PixelFlag />
            {flagBurstKey > 0 ? (
              <div
                key={flagBurstKey}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[40%] z-20 h-0 w-0"
              >
                <motion.span
                  className="absolute left-0 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dff0ff]"
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  style={{ boxShadow: "0 0 22px 4px rgba(126,182,255,0.9)" }}
                />
                {particles.map((p, i) => {
                  const rad = (p.a * Math.PI) / 180
                  const x = Math.cos(rad) * p.d
                  const y = Math.sin(rad) * p.d - 10
                  return (
                    <motion.span
                      key={`${flagBurstKey}-${i}`}
                      className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] leading-none drop-shadow-[0_0_6px_rgba(126,182,255,0.9)]"
                      style={{ color: p.c }}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, x, y, scale: 1.25 }}
                      transition={{ duration: 0.75, ease: "easeOut" }}
                    >
                      {p.s}
                    </motion.span>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
        <p className="font-sans text-base leading-relaxed text-foreground/70 md:text-lg">
          상세 일정은 상황에 따라 변경될 수 있으며, 변경 시 사전 안내드립니다.
        </p>
      </div>
    </div>
  )
}

export function GuideSection() {
  return (
    <section
      id="guide"
      className="relative overflow-x-clip border-t border-border"
    >
      <Twinkles />

      <div className="site-shell py-28 md:py-40">
        {/* -------- Header -------- */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="min-w-0 flex-1 md:max-w-none">
            <Reveal>
              <span className="font-mono text-xl font-bold tracking-[0.22em] text-[#7eb6ff] md:text-2xl lg:text-3xl">
                03 — PARTICIPATE
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-[clamp(3rem,5.2vw,5.75rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
                <span className="block whitespace-nowrap">
                  LEARN{" "}
                  <span className="bg-gradient-to-r from-white via-[#c4b5fd] to-[#7c6cf0] bg-clip-text text-transparent">
                    TOGETHER
                  </span>
                </span>
                <span className="mt-[0.06em] block whitespace-nowrap">
                  BUILD{" "}
                  <span className="bg-gradient-to-r from-white via-[#c4b5fd] to-[#7c6cf0] bg-clip-text text-transparent">
                    TOGETHER
                  </span>
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 whitespace-nowrap font-sans text-xl leading-relaxed text-foreground/85 md:text-2xl">
                아이디어를 현실로 만들어갈{" "}
                <span className="font-semibold text-[#c4b5fd]">kt is</span>{" "}
                구성원을 기다립니다.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="shrink-0 self-center md:self-start md:pt-2">
            <HeaderVisual />
          </Reveal>
        </div>

        {/* Stats — centered purple cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-14 md:gap-7 lg:gap-8">
          <StatCard
            label="모집 대상"
            value={
              <>
                <span className="text-[#7eb6ff]">kt is</span> 구성원 누구나
              </>
            }
            delay={0.05}
          />
          <StatCard
            label="선발 규모"
            value="총 10팀"
            note="팀당 최대 3인 구성"
            delay={0.12}
          />
        </div>

        {/* 행사 안내 제목 → 일정 + 참가 신청은 DAY 01 높이로 정렬 */}
        <div className="mt-14 md:mt-16">
          <Reveal>
            <h3 className="font-sans text-2xl font-bold tracking-wide text-[#c4b5fd] md:text-3xl">
              과정안내
            </h3>
          </Reveal>

          <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-8">
              <ScheduleTimeline />
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={0.1}>
                <aside className="sticky top-24 space-y-0 overflow-hidden rounded-2xl border border-[#3b6cff]/50 bg-[#080d24]/80 shadow-[0_0_40px_rgba(59,108,255,0.1)]">
                  <div className="border-b border-[#3b6cff]/30 p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <GuideImg
                        src={`/guide/sidebar-apply.png?v=${V}`}
                        alt=""
                        width={512}
                        height={512}
                        className="h-9 w-auto mix-blend-screen md:h-10"
                      />
                      <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                        참가 신청 방법
                      </h3>
                    </div>
                    <div className="mt-4 space-y-2 text-lg leading-relaxed text-foreground/80 md:text-xl">
                      <p>1. 아래 참가 신청서 다운로드 버튼 클릭</p>
                      <p>
                        2. 작성 후 이메일 제출{" "}
                        <a
                          href="mailto:minj.kang@kt.com"
                          className="font-semibold text-[#7eb6ff] transition-colors hover:text-[#a5c8ff]"
                        >
                          minj.kang@kt.com
                        </a>
                      </p>
                    </div>
                    <ActionButton
                      href="/apply/team-application-form.docx"
                      download="양식_2026년 kt is WI 제로톤 참가신청서.docx"
                    >
                      참가 신청서 다운로드
                    </ActionButton>
                  </div>

                  {SHOW_TEAM_MATCHING ? (
                  <div className="border-b border-[#3b6cff]/30 p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <GuideImg
                        src={`/guide/sidebar-team.png?v=${V}`}
                        alt=""
                        width={512}
                        height={512}
                        className="h-9 w-auto mix-blend-screen md:h-10"
                      />
                      <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                        팀원을 못 찾았다면?
                      </h3>
                    </div>
                    <p className="mt-3 text-lg leading-relaxed text-foreground/80 md:text-xl">
                      팀원을 찾고 함께 아이디어를 실현해 보세요.
                    </p>
                    <ActionButton href="/apply">팀원 찾기</ActionButton>
                  </div>
                  ) : null}

                  <div className="p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <GuideImg
                        src={`/guide/sidebar-place.png?v=${V}`}
                        alt=""
                        width={512}
                        height={512}
                        className="h-9 w-auto object-contain md:h-10"
                      />
                      <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                        대회 장소
                      </h3>
                    </div>
                    <p className="mt-3 text-xl font-semibold text-foreground md:text-2xl">
                      KT원주연수원
                    </p>
                    <p className="mt-2 text-lg leading-relaxed text-foreground/80 md:text-xl">
                      강원특별자치도 원주시 행구덕현길 109, KT원주연수원
                    </p>
                    <div className="relative mt-5 overflow-hidden rounded-xl border border-[#c4b5fd]/35 bg-[#3d2f6b]/40 p-3 md:p-4">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-6 bottom-2 h-10 rounded-full bg-[#3b6cff]/20 blur-2xl"
                      />
                      <GuideImg
                        src={`/guide/kt-building.png?v=${V}`}
                        alt="KT원주연수원"
                        width={1363}
                        height={489}
                        className="relative z-[1] mx-auto h-auto w-full max-w-[320px]"
                      />
                    </div>
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
