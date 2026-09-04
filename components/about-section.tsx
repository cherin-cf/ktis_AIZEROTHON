"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { ReactNode } from "react"
import { Reveal } from "@/components/reveal"

/* Assets from Downloads/ICON → public/about/*.png (already have alpha) */
const ASSET_V = "about5"

function AboutImg({
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

function CheckBullet({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#5b8cff]/70 bg-[#1a2f6e]/80 shadow-[0_0_10px_rgba(59,108,255,0.35)] transition-colors duration-300 group-hover:border-[#c4b5fd]/80 group-hover:bg-[#3b2a6e]/90 group-focus-visible:border-[#c4b5fd]/80 group-focus-visible:bg-[#3b2a6e]/90 md:mt-0.5 md:h-6 md:w-6 ${className}`}
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3 md:h-3.5 md:w-3.5" fill="none">
        <path
          d="M2.5 6.25 5 8.75 9.5 3.75"
          stroke="#9ec4ff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-300 group-hover:stroke-[#f0e8ff] group-focus-visible:stroke-[#f0e8ff]"
        />
      </svg>
    </span>
  )
}

function PixelGlow({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.span
        aria-hidden
        className="absolute inset-[-24%] rounded-full bg-[#3b6cff]/35 blur-2xl"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.08, 0.92] }}
        transition={{
          duration: 2.8,
          delay,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <span className="relative z-[1]">{children}</span>
    </div>
  )
}

/** Flag with >{ } mark — KEY POINTS rail (attachment 1) */
function PixelFlagPole({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="36"
      height="52"
      viewBox="0 0 12 18"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="2" y="0" width="1" height="15" fill="#7eb6ff" />
      <g className="origin-[2px_1px] [animation:pixel-wave_1.2s_ease-in-out_infinite] motion-reduce:animate-none">
        <rect x="3" y="1" width="7" height="6" fill="#3b6cff" />
        <rect x="3" y="1" width="7" height="1" fill="#7eb6ff" />
        <rect x="3" y="6" width="7" height="1" fill="#2a4fcf" />
        {/* >{ } */}
        <rect x="4" y="3" width="1" height="1" fill="#dff0ff" />
        <rect x="5" y="2" width="1" height="1" fill="#dff0ff" />
        <rect x="5" y="4" width="1" height="1" fill="#dff0ff" />
        <rect x="7" y="2" width="1" height="3" fill="#dff0ff" />
        <rect x="8" y="2" width="1" height="1" fill="#dff0ff" />
        <rect x="8" y="4" width="1" height="1" fill="#dff0ff" />
      </g>
      <rect x="0" y="15" width="5" height="2" fill="#1a2558" />
      <rect x="1" y="16" width="3" height="1" fill="#2a4fcf" />
    </svg>
  )
}

function TwinkleField() {
  const stars = [
    { t: "8%", l: "6%", d: 0 },
    { t: "14%", l: "22%", d: 0.4 },
    { t: "6%", l: "48%", d: 0.8 },
    { t: "18%", l: "72%", d: 0.2 },
    { t: "10%", l: "88%", d: 1.1 },
    { t: "38%", l: "12%", d: 0.6 },
    { t: "42%", l: "40%", d: 1.4 },
    { t: "52%", l: "64%", d: 0.3 },
    { t: "58%", l: "90%", d: 0.9 },
    { t: "72%", l: "18%", d: 1.2 },
    { t: "78%", l: "55%", d: 0.5 },
    { t: "88%", l: "78%", d: 0.7 },
    { t: "28%", l: "95%", d: 1.5 },
    { t: "65%", l: "4%", d: 0.15 },
  ]

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-[10px] leading-none text-[#5b8cff]/70"
          style={{ top: s.t, left: s.l }}
          animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.85, 1.15, 0.85] }}
          transition={{
            duration: 2.4 + (i % 4) * 0.35,
            delay: s.d,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          +
        </motion.span>
      ))}
    </div>
  )
}

function IdeaPathScene() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] md:max-w-[460px] lg:ml-auto lg:max-w-[500px]">
      <AboutImg
        src={`/about/idea-path.png?v=${ASSET_V}`}
        alt="아이디어에서 현실로 — START, 48H, 트로피까지의 여정"
        width={1536}
        height={1024}
        className="h-auto w-full drop-shadow-[0_0_32px_rgba(59,108,255,0.25)]"
      />
    </div>
  )
}

const KEY_POINTS = [
  {
    num: "01",
    title: "Prize & Benefits",
    bullets: [
      "CES 참관 기회 제공",
      "IT기기 및 상품권 상품",
      "수상팀 확산 후속 지원",
    ],
    iconSrc: `/about/prize.png?v=${ASSET_V}`,
    iconAlt: "Prize trophy",
    iconClass: "h-[118px] w-auto md:h-[136px]",
  },
  {
    num: "02",
    title: "Education & ZEROTHON",
    bullets: [
      "사전교육 제공 (1,2차)",
      "본 제로톤 시행 (1박 2일)",
      "아이디어 전사 확산",
    ],
    iconSrc: `/about/light.png?v=${ASSET_V}`,
    iconAlt: "Education book",
    iconClass: "h-[118px] w-auto md:h-[136px]",
  },
  {
    num: "03",
    title: "Expert Coaching",
    bullets: [
      "문제 정의 AX설계 교육 (1차)",
      "AI적용 구체화 교육 (2차)",
      "팀별 전문 코치 피드백",
    ],
    iconSrc: `/about/expert.png?v=${ASSET_V}`,
    iconAlt: "Expert coaching",
    iconClass: "h-[118px] w-auto md:h-[136px]",
  },
  {
    num: "04",
    title: "TOP10 TEAMS",
    bullets: [
      "3인 1팀 서류 심사",
      "분야: 고객가치 제공 / 내부 효율화",
      "파이널 10팀 교육 및 제로톤 참가",
    ],
    iconSrc: `/about/team.png?v=${ASSET_V}`,
    iconAlt: "Top teams",
    iconClass: "h-[118px] w-auto md:h-[136px]",
  },
] as const

export function AboutSection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <TwinkleField />

      <div className="site-shell py-28 md:py-40">
        {/* ----- Header: copy left, path right ----- */}
        <div
          id="about"
          className="relative scroll-mt-28 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6 md:scroll-mt-32"
        >
          <div className="lg:col-span-7">
            <Reveal>
              <span className="font-mono text-xl font-bold tracking-[0.22em] text-[#7eb6ff] md:text-2xl lg:text-3xl">
                01 — ABOUT
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-[clamp(3.5rem,5.8vw,6.25rem)] font-bold leading-[1.02] tracking-[-0.035em] text-foreground">
                From Idea
                <br />
                <span className="bg-gradient-to-r from-white via-[#c4b5fd] to-[#7c6cf0] bg-clip-text text-transparent">
                  to Reality.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-10 max-w-4xl md:mt-12">
                <p className="font-sans text-lg leading-[1.75] text-foreground/90 md:text-xl lg:text-2xl">
                  생각에 머물던 아이디어를, 직접 만들어보세요.
                </p>
                <p className="mt-[1.5em] font-sans text-lg leading-[1.75] text-foreground/90 md:text-xl lg:text-2xl">
                  kt is WI ZEROTHON에서
                  <br />
                  교육과 멘토링, 그리고{" "}
                  <span className="text-[#7eb6ff]">48시간의 몰입</span>.
                  <br />
                  직접 만들고, 실험하고,{" "}
                  <span className="text-[#7eb6ff]">현실로</span> 완성하세요.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.22}>
              <IdeaPathScene />
            </Reveal>
          </div>
        </div>

        {/* ----- KEY POINTS rail ----- */}
        <div className="mt-10 md:mt-14">
          <Reveal>
            <div className="mb-5 flex items-center gap-4 md:mb-6 md:gap-5">
              <PixelFlagPole className="shrink-0 drop-shadow-[0_0_10px_rgba(91,140,255,0.45)]" />
              <span
                aria-hidden
                className="h-px flex-1 border-t border-dashed border-[#3b6cff]/55"
              />
              <span className="shrink-0 font-mono text-2xl font-bold uppercase tracking-[0.28em] text-[#7eb6ff] md:text-3xl lg:text-[2.25rem]">
                KEY POINTS
              </span>
              <span
                aria-hidden
                className="h-px flex-1 border-t border-dashed border-[#3b6cff]/55"
              />
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {KEY_POINTS.map((card, i) => (
              <Reveal key={card.num} delay={0.06 * i}>
                <article
                  data-cursor="hover"
                  tabIndex={0}
                  className="group relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-2xl border border-[#3b6cff]/45 bg-[#080d24]/70 px-5 pb-2 pt-6 shadow-[0_0_0_1px_rgba(59,108,255,0.08),0_0_28px_rgba(59,108,255,0.08)] transition-[transform,box-shadow,border-color,background-color,color] duration-300 hover:-translate-y-1 hover:border-[#e9d5ff] hover:bg-[#2a1548] hover:shadow-[0_0_0_1px_rgba(233,213,255,0.7),0_0_28px_rgba(216,180,254,0.85),0_0_64px_rgba(192,132,252,0.65),0_0_100px_rgba(168,85,247,0.4)] focus-visible:-translate-y-1 focus-visible:border-[#e9d5ff] focus-visible:bg-[#2a1548] focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_rgba(233,213,255,0.7),0_0_28px_rgba(216,180,254,0.85),0_0_64px_rgba(192,132,252,0.65),0_0_100px_rgba(168,85,247,0.4)] md:min-h-[360px] md:px-6 md:pb-2.5 md:pt-8 lg:min-h-[372px] lg:pt-9"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse 90% 70% at 50% 15%, rgba(233,213,255,0.55), rgba(192,132,252,0.28) 45%, transparent 75%)",
                    }}
                  />
                  <div className="relative mb-1.5 flex min-h-[74px] items-end justify-center pt-1 md:mb-2 md:min-h-[82px] md:pt-1.5 lg:min-h-[88px]">
                    <PixelGlow delay={i * 0.35}>
                      <AboutImg
                        src={card.iconSrc}
                        alt={card.iconAlt}
                        width={512}
                        height={512}
                        className={card.iconClass}
                      />
                    </PixelGlow>
                  </div>
                  <div className="relative font-mono text-base tracking-[0.2em] text-[#5b8cff] transition-colors duration-300 group-hover:text-[#e9d5ff] group-focus-visible:text-[#e9d5ff] md:text-lg">
                    {card.num}
                  </div>
                  <h3 className="relative mt-0.5 text-2xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-white group-focus-visible:text-white md:text-3xl">
                    {card.title}
                  </h3>
                  <ul className="relative mt-3 space-y-3.5 border-t border-[#3b6cff]/25 pt-4 font-sans text-lg leading-relaxed text-foreground/90 transition-colors duration-300 group-hover:border-[#e9d5ff]/40 group-hover:text-[#f5f3ff] group-focus-visible:border-[#e9d5ff]/40 group-focus-visible:text-[#f5f3ff] md:mt-5 md:space-y-4 md:pt-5 md:text-xl">
                    {card.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <CheckBullet />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
