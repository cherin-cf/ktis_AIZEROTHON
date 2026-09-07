"use client"

import { Montserrat, Noto_Sans_KR } from "next/font/google"
import { ApplicationCountdown } from "@/components/application-countdown"
import { Reveal } from "@/components/reveal"

const display = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-intro-display",
  display: "swap",
})

const bodyKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-intro-body",
  display: "swap",
})

function IconCube({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="intro-g1" x1="8" y1="10" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5CE1FF" />
          <stop offset="1" stopColor="#B56CFF" />
        </linearGradient>
      </defs>
      <path
        d="M24 8.5L38 16.2V31.8L24 39.5L10 31.8V16.2L24 8.5Z"
        stroke="url(#intro-g1)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M24 8.5V24M24 24L10 16.2M24 24L38 16.2M24 24V39.5" stroke="url(#intro-g1)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function IconChart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="intro-g2" x1="8" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5CE1FF" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      <path d="M10 36V28H15V36H10Z" stroke="url(#intro-g2)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M19.5 36V22H24.5V36H19.5Z" stroke="url(#intro-g2)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M29 36V16H34V36H29Z" stroke="url(#intro-g2)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 20L22 12L29 17L38 8" stroke="url(#intro-g2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32.5 8H38V13.5" stroke="url(#intro-g2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="intro-g3" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#E879F9" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="14.5" stroke="url(#intro-g3)" strokeWidth="1.8" />
      <path d="M24 15.5V24.5L30 28" stroke="url(#intro-g3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMonitor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="intro-g4" x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5CE1FF" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <rect x="9" y="11" width="30" height="20" rx="2.5" stroke="url(#intro-g4)" strokeWidth="1.8" />
      <path d="M18 37H30M24 31V37" stroke="url(#intro-g4)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 24L20 20L25 23L33 16" stroke="url(#intro-g4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const FEATURES = [
  { title: "노코드 · AI", desc: "누구나 쉽게 활용", Icon: IconCube },
  { title: "업무 개선", desc: "실질적 결과 도출", Icon: IconChart },
  { title: "단기간 구현", desc: "48시간 집중 완성", Icon: IconClock },
  { title: "시연", desc: "직접 시연 & 피드백", Icon: IconMonitor },
] as const

/** WORKWAY INNOVATION — only leading W and leading I in cyan */
function WorkwayInnovationLabel({ className = "" }: { className?: string }) {
  const blue =
    "text-[#67e8f9] [text-shadow:0_0_14px_rgba(34,211,238,0.55)]"
  return (
    <p className={className}>
      <span className={blue}>W</span>
      <span className="text-white">ORKWAY</span>
      <span className="inline-block w-[0.4em]" aria-hidden />
      <span className={blue}>I</span>
      <span className="text-white">NNOVATION</span>
    </p>
  )
}

function WiVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[460px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.28),rgba(168,85,247,0.12)_50%,transparent_72%)] blur-2xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/introduce-wi.png"
        alt="WI"
        width={1024}
        height={616}
        draggable={false}
        className="relative z-[1] h-auto w-full select-none object-contain"
      />
    </div>
  )
}

export function IntroduceSection() {
  return (
    <section
      id="introduce"
      className={`${display.variable} ${bodyKr.variable} relative z-[20] scroll-mt-0 overflow-x-clip overflow-y-visible bg-transparent pointer-events-none`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(9,7,28,0.35) 10%, rgba(9,7,28,0.78) 26%, #09071c 44%, #09071c 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(9,7,28,0.35) 28%, #09071c 58%, #09071c 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(ellipse_58%_55%_at_78%_48%,rgba(56,189,248,0.16),transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(ellipse_40%_45%_at_12%_82%,rgba(168,85,247,0.12),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/3 -z-[1] h-[28rem] w-[28rem] -translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-16 -z-[1] h-[22rem] w-[22rem] translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_70%)] blur-2xl"
      />

      <div className="site-shell pointer-events-auto relative z-[1] pb-14 pt-2 md:pb-20 md:pt-3 lg:pb-24">
        <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-6 xl:gap-8">
            <div className="relative z-[1] flex min-w-0 flex-col items-start lg:col-span-7 xl:col-span-7">
              <Reveal>
                <a
                  href="#introduce"
                  className={`${bodyKr.className} group relative mt-0 inline-flex items-center gap-2.5 rounded-full p-[1.5px] shadow-[0_0_28px_rgba(124,108,240,0.28)]`}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[linear-gradient(105deg,#38bdf8,#a78bfa,#e879f9)] opacity-90"
                  />
                  <span className="relative inline-flex items-center gap-2.5 rounded-full bg-[#070b1c] px-6 py-2.5 text-[1.05rem] font-medium tracking-tight text-white/95 transition group-hover:bg-[#0b1228] md:px-7 md:py-3 md:text-[1.15rem]">
                    WI ZEROTHON이란?
                    <span aria-hidden className="translate-y-px text-white/75">
                      &gt;
                    </span>
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.12}>
                <WorkwayInnovationLabel
                  className={`${display.className} mt-8 text-[1.05rem] font-semibold uppercase tracking-[0.26em] md:mt-10 md:text-[1.2rem] lg:text-[1.35rem]`}
                />
              </Reveal>

              <Reveal delay={0.24}>
                <h2 className="mt-3 overflow-visible font-black italic leading-[0.92] tracking-[-0.04em] md:mt-4">
                  <span className="inline-block -translate-x-[0.06em] whitespace-nowrap pb-3 pe-[0.28em] text-[clamp(3.85rem,10vw,8.25rem)] md:-translate-x-[0.08em]">
                    <span className="text-white [text-shadow:0_0_28px_rgba(103,232,249,0.55)]">
                      WI{" "}
                    </span>
                    <span className="bg-gradient-to-r from-[#67e8f9] via-[#818cf8] to-[#c084fc] bg-clip-text pe-[0.14em] text-transparent [filter:drop-shadow(0_0_18px_rgba(96,165,250,0.45))]">
                      ZEROTHON
                    </span>
                  </span>
                </h2>
              </Reveal>

              <div
                className={`${bodyKr.className} mt-6 max-w-[38rem] text-[1.15rem] font-medium leading-[1.75] text-white/92 md:mt-7 md:text-[1.35rem] md:leading-[1.8] lg:text-[1.45rem]`}
              >
                <Reveal delay={0.36}>
                  <p>
                    비 IT직무자가{" "}
                    <span className="bg-gradient-to-r from-[#67e8f9] to-[#22d3ee] bg-clip-text font-semibold text-transparent">
                      노코드·AI도구
                    </span>
                    를 활용해
                  </p>
                </Reveal>
                <Reveal delay={0.48}>
                  <p>
                    단기간 내 업무 개선 결과물을{" "}
                    <span className="bg-gradient-to-r from-[#c084fc] to-[#e879f9] bg-clip-text font-semibold text-transparent">
                      구현·시연
                    </span>
                    하는 프로그램
                  </p>
                </Reveal>
              </div>

              <ul className="mt-10 flex w-full max-w-[56rem] flex-col gap-5 sm:mt-12 sm:flex-row sm:items-stretch sm:gap-0 md:mt-14">
                {FEATURES.map(({ title, desc, Icon }, i) => (
                  <li
                    key={title}
                    className={`min-w-0 flex-1 ${
                      i === 0
                        ? "sm:pr-3 md:pr-4"
                        : "sm:border-l sm:border-[#3b6cff]/30 sm:px-3 md:px-4"
                    }`}
                  >
                    <Reveal delay={0.58 + i * 0.1}>
                      <div className="flex items-center gap-3.5 md:gap-4">
                        <span className="flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-2xl border border-[#60a5fa]/50 bg-[#060b1f]/85 shadow-[0_0_0_1px_rgba(96,165,250,0.12),0_0_28px_rgba(59,130,246,0.28),inset_0_0_20px_rgba(56,189,248,0.06)] md:h-[4.25rem] md:w-[4.25rem]">
                          <Icon className="h-9 w-9 md:h-10 md:w-10" />
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`${bodyKr.className} text-[1.05rem] font-bold leading-tight text-white md:text-[1.15rem]`}
                          >
                            {title}
                          </p>
                          <p
                            className={`${bodyKr.className} mt-1 whitespace-nowrap text-[0.88rem] font-medium leading-snug text-white/60 md:text-[0.95rem]`}
                          >
                            {desc}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-[1] flex justify-center lg:col-span-5 lg:justify-end lg:pr-2 xl:pr-4">
              <Reveal delay={0.3}>
                <WiVisual />
              </Reveal>
            </div>
          </div>

        <Reveal delay={0.1}>
          <ApplicationCountdown compact className="mt-28 md:mt-36 lg:mt-44" />
        </Reveal>
      </div>
    </section>
  )
}
