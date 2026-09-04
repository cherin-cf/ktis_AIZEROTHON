"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { ReactNode } from "react"
import { Reveal } from "@/components/reveal"

function AwardImg({
  src,
  alt,
  width,
  height,
  className = "",
  screen = true,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  screen?: boolean
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      draggable={false}
      className={`select-none object-contain ${screen ? "mix-blend-screen" : ""} ${className}`}
    />
  )
}

function TwinkleField() {
  const stars = [
    { t: "6%", l: "4%", d: 0 },
    { t: "12%", l: "18%", d: 0.5 },
    { t: "8%", l: "55%", d: 1.1 },
    { t: "16%", l: "78%", d: 0.3 },
    { t: "22%", l: "92%", d: 0.8 },
    { t: "48%", l: "8%", d: 1.4 },
    { t: "55%", l: "96%", d: 0.2 },
    { t: "72%", l: "14%", d: 0.9 },
    { t: "80%", l: "48%", d: 0.6 },
    { t: "88%", l: "72%", d: 1.2 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-[11px] leading-none text-[#5b8cff]/75"
          style={{ top: s.t, left: s.l }}
          animate={{ opacity: [0.12, 1, 0.12], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 2.2 + (i % 5) * 0.3,
            delay: s.d,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {i % 3 === 0 ? "×" : "+"}
        </motion.span>
      ))}
    </div>
  )
}

function Float({
  children,
  delay = 0,
  amp = 10,
}: {
  children: ReactNode
  delay?: number
  amp?: number
}) {
  return (
    <motion.div
      animate={{ y: [0, -amp, 0] }}
      transition={{
        duration: 3.2 + delay * 0.2,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

function PanelSparkles({
  seed,
  color,
}: {
  seed: number
  color: string
}) {
  const spots = [
    { t: "6%", l: "10%", s: 12, d: 0 },
    { t: "12%", l: "84%", s: 14, d: 0.35 },
    { t: "32%", l: "4%", s: 11, d: 0.7 },
    { t: "48%", l: "92%", s: 13, d: 0.2 },
    { t: "68%", l: "14%", s: 10, d: 1.0 },
    { t: "82%", l: "78%", s: 12, d: 0.55 },
  ]

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {spots.map((sp, i) => (
        <motion.span
          key={`${seed}-${i}`}
          className="absolute font-mono font-bold leading-none"
          style={{
            top: sp.t,
            left: sp.l,
            fontSize: sp.s,
            color,
            textShadow: `0 0 12px ${color}`,
          }}
          animate={{
            opacity: [0.2, 1, 0.25],
            y: [0, -10 - (i % 3) * 4, 0],
            x: [0, i % 2 === 0 ? 6 : -6, 0],
            scale: [0.7, 1.2, 0.75],
          }}
          transition={{
            duration: 2.5 + (i % 4) * 0.3,
            delay: sp.d + seed * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {i % 3 === 0 ? "✦" : "+"}
        </motion.span>
      ))}
    </div>
  )
}

function GradientText({
  children,
  gradient,
  glow,
  className = "",
}: {
  children: ReactNode
  gradient: string
  glow?: string
  className?: string
}) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        filter: glow,
      }}
    >
      {children}
    </span>
  )
}

function AppleLogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-14 w-14 text-white md:h-16 md:w-16"
        fill="currentColor"
      >
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    </span>
  )
}

const PERK_TITLE_CLASS =
  "text-[clamp(1.65rem,2.9vw,2.3rem)] font-extrabold leading-[1.1]"

function CesPerkBlock() {
  return (
    <div className="flex w-full items-center gap-4 md:gap-5">
      <div className="flex h-[3.75rem] w-[4.75rem] shrink-0 items-center justify-center md:h-16 md:w-[5.25rem]">
        <AwardImg
          src="/awards/logo-ces.png"
          alt="CES"
          width={649}
          height={330}
          screen={false}
          className="h-14 w-auto max-w-none object-contain md:h-[3.65rem]"
        />
      </div>
      <div className="min-w-0 flex-1 pt-3.5 text-left md:pt-4">
        <div className={`whitespace-nowrap ${PERK_TITLE_CLASS}`}>
          <GradientText
            className="font-extrabold"
            gradient="linear-gradient(90deg, #fffef0 0%, #ffe08a 45%, #ffc107 100%)"
            glow="drop-shadow(0 0 10px rgba(255,196,60,0.35))"
          >
            컨퍼런스 참가 기회
          </GradientText>
        </div>
        <p className="mt-1.5 font-sans text-[clamp(0.95rem,1.45vw,1.12rem)] font-medium leading-snug text-white md:mt-2">
          미국 라스베이거스, 세계 최대 IT전시회인
          <br />
          CES 컨퍼런스 참가 기회제공
        </p>
      </div>
    </div>
  )
}

function MacBookPerkBlock() {
  return (
    <div className="flex w-full items-center gap-3 md:gap-3.5">
      <AppleLogoMark />
      <div className="min-w-0 flex-1 -ml-2 text-left md:-ml-3">
        <div className={`whitespace-nowrap ${PERK_TITLE_CLASS}`}>
          <span className="font-extrabold text-white">개인별 </span>
          <GradientText
            className="font-extrabold"
            gradient="linear-gradient(90deg, #67e8f9 0%, #60a5fa 42%, #a78bfa 78%, #c084fc 100%)"
            glow="drop-shadow(0 0 10px rgba(96,165,250,0.4))"
          >
            MacBook NEO
          </GradientText>
        </div>
        <p className="mt-1 text-[clamp(0.82rem,1.25vw,0.98rem)] leading-tight text-white/50">
          * 모델 및 사양 추후 안내
        </p>
      </div>
    </div>
  )
}

function AirPodsPerkBlock() {
  return (
    <div className="flex w-full items-center gap-4 md:gap-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl md:h-16 md:w-16">
        <AwardImg
          src="/awards/mini-airpods.png"
          alt="AirPods"
          width={200}
          height={200}
          screen={false}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className={`whitespace-nowrap ${PERK_TITLE_CLASS}`}>
          <span className="font-extrabold text-white">개인별 최신 </span>
          <GradientText
            className="font-extrabold"
            gradient="linear-gradient(90deg, #f3e8ff 0%, #d8b4fe 45%, #c084fc 78%, #a855f7 100%)"
            glow="drop-shadow(0 0 10px rgba(192,132,252,0.4))"
          >
            AirPods
          </GradientText>
        </div>
        <p className="mt-1 text-[clamp(0.82rem,1.25vw,0.98rem)] leading-tight text-white/50">
          * 모델 및 사양 추후 안내
        </p>
      </div>
    </div>
  )
}

const AWARDS = [
  {
    num: "01",
    title: "대상",
    heroSrc: "/awards/prize-grand-hero.png",
    heroAlt: "대상 트로피",
    heroClass:
      "h-[275px] w-auto md:h-[315px] lg:h-[335px] translate-y-2 md:translate-y-3",
    heroAlign: "center" as const,
    laurels: true,
    titleGradient:
      "linear-gradient(180deg, #ffffff 0%, #fff8dc 35%, #ffe08a 68%, #ffc107 100%)",
    titleGlow: "drop-shadow(0 0 18px rgba(255,196,60,0.45))",
    badgeBorder: "border-[#ffe08a]/70",
    badgeText: "text-[#ffe08a]",
    cardBorder: "border-[#ffe08a]/45",
    cardShadow:
      "shadow-[0_0_0_1px_rgba(255,224,138,0.2),0_0_40px_rgba(255,196,60,0.15)]",
    cardHover:
      "hover:border-[#ffe08a]/75 hover:shadow-[0_0_0_1px_rgba(255,224,138,0.5),0_0_56px_rgba(255,196,60,0.35)]",
    glow: "rgba(255,196,60,0.2)",
    sparkle: "#ffe08a",
    perk: <CesPerkBlock />,
  },
  {
    num: "02",
    title: "우수상",
    heroSrc: "/awards/prize-macbook-hero.png",
    heroAlt: "MacBook NEO",
    heroClass: "h-[240px] w-auto md:h-[280px] lg:h-[300px]",
    laurels: false,
    titleGradient:
      "linear-gradient(90deg, #67e8f9 0%, #38bdf8 28%, #60a5fa 55%, #a78bfa 82%, #c084fc 100%)",
    titleGlow: "drop-shadow(0 0 18px rgba(96,165,250,0.45))",
    badgeBorder: "border-[#60a5fa]/70",
    badgeText: "text-[#7eb6ff]",
    cardBorder: "border-[#60a5fa]/45",
    cardShadow:
      "shadow-[0_0_0_1px_rgba(96,165,250,0.2),0_0_40px_rgba(96,165,250,0.15)]",
    cardHover:
      "hover:border-[#60a5fa]/75 hover:shadow-[0_0_0_1px_rgba(96,165,250,0.5),0_0_56px_rgba(96,165,250,0.35)]",
    glow: "rgba(96,165,250,0.2)",
    sparkle: "#7eb6ff",
    perk: <MacBookPerkBlock />,
  },
  {
    num: "03",
    title: "협업상",
    heroSrc: "/awards/prize-airpods-hero.png",
    heroAlt: "AirPods",
    heroClass: "h-[240px] w-auto md:h-[280px] lg:h-[300px]",
    laurels: false,
    titleGradient:
      "linear-gradient(90deg, #f3e8ff 0%, #e9d5ff 30%, #d8b4fe 58%, #c084fc 82%, #a855f7 100%)",
    titleGlow: "drop-shadow(0 0 18px rgba(192,132,252,0.45))",
    badgeBorder: "border-[#c084fc]/70",
    badgeText: "text-[#d8b4fe]",
    cardBorder: "border-[#c084fc]/45",
    cardShadow:
      "shadow-[0_0_0_1px_rgba(192,132,252,0.2),0_0_40px_rgba(192,132,252,0.15)]",
    cardHover:
      "hover:border-[#c084fc]/75 hover:shadow-[0_0_0_1px_rgba(192,132,252,0.5),0_0_56px_rgba(192,132,252,0.35)]",
    glow: "rgba(192,132,252,0.2)",
    sparkle: "#d8b4fe",
    perk: <AirPodsPerkBlock />,
  },
] as const

const TITLE_ROW_CLASS =
  "flex min-h-[clamp(4.25rem,8.5vw,6rem)] items-center justify-center"

function AwardTitle({
  title,
  gradient,
  glow,
  laurels,
}: {
  title: string
  gradient: string
  glow: string
  laurels: boolean
}) {
  const titleEl = (
    <h3 className="text-[clamp(3.25rem,7.5vw,5rem)] font-extrabold leading-none tracking-tight">
      <GradientText gradient={gradient} glow={glow}>
        {title}
      </GradientText>
    </h3>
  )

  if (!laurels) {
    return (
      <div
        className={`text-center -translate-y-2 md:-translate-y-2.5 ${TITLE_ROW_CLASS}`}
      >
        {titleEl}
      </div>
    )
  }

  return (
    <div
      className={`relative mx-auto w-full max-w-[min(100%,24rem)] -translate-y-3 md:-translate-y-4 ${TITLE_ROW_CLASS}`}
    >
      <AwardImg
        src="/awards/NEW_LEAVES.png"
        alt=""
        width={960}
        height={280}
        screen={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      />
      <div className="relative z-[1] w-full text-center">{titleEl}</div>
    </div>
  )
}

function AwardCard({
  award,
  index,
}: {
  award: (typeof AWARDS)[number]
  index: number
}) {
  return (
    <motion.article
      data-cursor="hover"
      tabIndex={0}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#080b18]/90 p-6 transition-[transform,box-shadow,border-color] duration-300 focus-visible:outline-none md:p-7 lg:p-8 ${award.cardBorder} ${award.cardShadow} ${award.cardHover}`}
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 3.4 + index * 0.2,
        delay: index * 0.45,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      whileHover={{ y: -14, scale: 1.015 }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-[28%] z-0 h-28 rounded-full blur-3xl"
        style={{ background: award.glow }}
        animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.92, 1.06, 0.92] }}
        transition={{
          duration: 3.6,
          delay: index * 0.3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <span
        className={`relative z-[2] inline-flex w-fit rounded-lg border-2 bg-[#0c1020]/90 px-4 py-2 font-mono text-base font-black tracking-[0.22em] md:px-5 md:py-2.5 md:text-lg lg:text-xl ${award.badgeBorder} ${award.badgeText}`}
      >
        {award.num}
      </span>

      <div
        className={`relative z-[1] mt-3 flex shrink-0 justify-center overflow-visible md:mt-4 h-[260px] md:h-[300px] lg:h-[320px] ${
          "heroAlign" in award && award.heroAlign === "start"
            ? "items-start"
            : "items-center"
        }`}
      >
        <PanelSparkles seed={index} color={award.sparkle} />
        <Float delay={index * 0.35} amp={10}>
          <AwardImg
            src={award.heroSrc}
            alt={award.heroAlt}
            width={600}
            height={600}
            className={`relative z-[1] ${award.heroClass}`}
          />
        </Float>
      </div>

      <div
        className={`relative z-[2] shrink-0 ${
          award.laurels ? "py-1 md:py-2" : "py-3 md:py-4"
        }`}
      >
        <AwardTitle
          title={award.title}
          gradient={award.titleGradient}
          glow={award.titleGlow}
          laurels={award.laurels}
        />
      </div>

      <div className="relative z-[2] mt-auto">
        <div className="flex min-h-[7.75rem] items-center rounded-xl border border-white/[0.08] bg-[#12182c]/95 px-5 py-3 md:min-h-[8.25rem] md:px-6 md:py-3.5">
          {award.perk}
        </div>
      </div>
    </motion.article>
  )
}

export function PrizesSection() {
  return (
    <section
      id="prizes"
      className="relative overflow-hidden border-t border-border"
    >
      <TwinkleField />

      <div className="site-shell py-28 md:py-40">
        <div className="max-w-6xl">
          <Reveal>
            <span className="font-mono text-lg font-bold tracking-[0.22em] text-[#7eb6ff] md:text-xl lg:text-2xl">
              02 — AWARDS
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 max-w-6xl text-[clamp(3.25rem,5.2vw,5.75rem)] font-bold leading-[1.02] tracking-[-0.035em] text-foreground">
              BUILD ONCE,
              <br />
              <span className="bg-gradient-to-r from-white via-[#c4b5fd] to-[#7c6cf0] bg-clip-text text-transparent">
                GROW BEYOND
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-3xl font-sans text-lg leading-relaxed text-foreground/75 md:text-xl">
              수상을 넘어, 더 큰 프로젝트로 이어질 기회를 제공합니다.
            </p>
            <p className="mt-2 max-w-3xl font-sans text-base leading-relaxed text-foreground/60 md:text-lg">
              (참가 시 MS 365 Copilot 권한 부여)
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-7 lg:mt-20">
          {AWARDS.map((award, i) => (
            <Reveal key={award.num} delay={0.08 * i}>
              <AwardCard award={award} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
