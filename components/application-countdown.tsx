"use client"

import { Calendar, Clock } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

/** 참가 마감: 2026.9.21.(월) 23:59:59 KST */
const DEADLINE_MS = new Date("2026-09-21T23:59:59+09:00").getTime()

const BEVEL_CLIP =
  "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)"

const UNIT_THEMES = [
  {
    border: "rgba(34,211,238,0.85)",
    borderGlow: "rgba(34,211,238,0.35)",
    label: "#67e8f9",
    numGradient:
      "linear-gradient(180deg, #f0fdff 0%, #a5f3fc 38%, #22d3ee 72%, #0891b2 100%)",
    numGlow: "drop-shadow(0 0 20px rgba(34,211,238,0.55))",
    separator: "#67e8f9",
  },
  {
    border: "rgba(96,165,250,0.85)",
    borderGlow: "rgba(96,165,250,0.32)",
    label: "#93c5fd",
    numGradient:
      "linear-gradient(180deg, #f0f7ff 0%, #bfdbfe 40%, #60a5fa 75%, #3b82f6 100%)",
    numGlow: "drop-shadow(0 0 20px rgba(96,165,250,0.5))",
    separator: "#93c5fd",
  },
  {
    border: "rgba(167,139,250,0.85)",
    borderGlow: "rgba(167,139,250,0.32)",
    label: "#c4b5fd",
    numGradient:
      "linear-gradient(180deg, #faf5ff 0%, #ddd6fe 40%, #a78bfa 72%, #7c3aed 100%)",
    numGlow: "drop-shadow(0 0 20px rgba(167,139,250,0.5))",
    separator: "#c4b5fd",
  },
  {
    border: "rgba(192,132,252,0.9)",
    borderGlow: "rgba(192,132,252,0.35)",
    label: "#d8b4fe",
    numGradient:
      "linear-gradient(180deg, #fdf4ff 0%, #e9d5ff 38%, #c084fc 70%, #a855f7 100%)",
    numGlow: "drop-shadow(0 0 22px rgba(192,132,252,0.55))",
    separator: "#d8b4fe",
  },
] as const

type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  ended: boolean
}

function getCountdown(now: number): CountdownParts {
  const diff = DEADLINE_MS - now
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, ended: false }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block font-mono text-[#c4b5fd] ${className}`}
      style={{ textShadow: "0 0 14px rgba(196,181,253,0.95)" }}
    >
      ✦
    </span>
  )
}

function CountdownSeparator({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden
      className="flex w-5 shrink-0 items-center justify-center self-stretch sm:w-6 md:w-8"
    >
      <div className="relative flex h-[min(72%,9.5rem)] flex-col items-center justify-center gap-[0.4rem] md:gap-[0.5rem]">
        <div
          className="absolute inset-y-1 w-px"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${accent}88 35%, ${accent}88 65%, transparent 100%)`,
            boxShadow: `0 0 8px ${accent}66`,
          }}
        />
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="relative z-[1] h-1.5 w-1.5 rounded-full md:h-[7px] md:w-[7px]"
            style={{
              background: accent,
              boxShadow: `0 0 10px ${accent}, 0 0 18px ${accent}88`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function CountdownUnitPanel({
  value,
  label,
  index,
}: {
  value: string
  label: string
  index: number
}) {
  const theme = UNIT_THEMES[index] ?? UNIT_THEMES[3]

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <div
        className="relative w-full max-w-[10.5rem] sm:max-w-[11.5rem] md:max-w-[13rem]"
        style={{
          filter: `drop-shadow(0 0 14px ${theme.borderGlow})`,
        }}
      >
        <div
          className="p-px"
          style={{
            clipPath: BEVEL_CLIP,
            background: `linear-gradient(145deg, ${theme.border}, ${theme.borderGlow})`,
          }}
        >
          <div
            className="relative bg-[#060a18]/96 px-3 py-5 sm:px-4 sm:py-6 md:px-5 md:py-8"
            style={{ clipPath: BEVEL_CLIP }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(91,140,255,0.12),transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <span
              className="relative block text-center font-sans text-[clamp(2.75rem,9vw,5.75rem)] font-bold leading-none tabular-nums tracking-[-0.04em]"
              style={{
                backgroundImage: theme.numGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                filter: theme.numGlow,
              }}
            >
              {value}
            </span>
          </div>
        </div>
      </div>
      <span
        className="mt-3 text-[10px] font-semibold uppercase tracking-[0.34em] sm:text-[11px] md:mt-4 md:text-xs"
        style={{
          color: theme.label,
          textShadow: `0 0 12px ${theme.label}66`,
        }}
      >
        {label}
      </span>
    </div>
  )
}

function CountdownDisplay({ parts }: { parts: CountdownParts }) {
  const units = [
    { value: pad(parts.days), label: "Days" },
    { value: pad(parts.hours), label: "Hours" },
    { value: pad(parts.minutes), label: "Mins" },
    { value: pad(parts.seconds), label: "Secs" },
  ]

  if (parts.ended) {
    return (
      <p className="py-10 text-center font-sans text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[0.2em] text-foreground/25">
        00 : 00 : 00 : 00
      </p>
    )
  }

  return (
    <div className="flex items-stretch justify-center">
      {units.map((unit, i) => (
        <div key={unit.label} className="contents">
          <CountdownUnitPanel value={unit.value} label={unit.label} index={i} />
          {i < units.length - 1 ? (
            <CountdownSeparator
              accent={
                UNIT_THEMES[i]?.separator ?? UNIT_THEMES[2].separator
              }
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}

const PLACEHOLDER_PARTS: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  ended: false,
}

export function ApplicationCountdown({
  className = "",
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const [parts, setParts] = useState<CountdownParts>(PLACEHOLDER_PARTS)

  useEffect(() => {
    const tick = () => setParts(getCountdown(Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section
      className={`relative mx-auto w-full max-w-[min(100%,92rem)] px-2 py-8 sm:px-4 md:py-12 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-[28rem] w-[min(100%,68rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,108,240,0.18),transparent_68%)] md:h-[34rem]"
      />

      <div className="relative flex flex-col items-center text-center">
        {!compact ? (
          <>
            <div className="flex items-center justify-center gap-3 md:gap-4">
          <Sparkle className="text-base md:text-lg" />
          <Image
            src="/brand/wi-zerothon-logo-dark.png"
            alt="kt is WI ZEROTHON"
            width={642}
            height={96}
            priority
            className="h-8 w-auto md:h-10 lg:h-11"
          />
          <Sparkle className="text-base md:text-lg" />
        </div>

        {/* Headline — single line */}
        <h2 className="mt-8 whitespace-nowrap text-[clamp(1.65rem,5.2vw,5.25rem)] font-black uppercase leading-none tracking-[-0.03em] md:mt-10">
          <span className="text-white">What will you </span>
          <span className="bg-gradient-to-b from-[#eef6ff] via-[#c4b5fd] to-[#8b6cf0] bg-clip-text text-transparent">
            build?
          </span>
        </h2>

        {/* Sub-headline */}
        <div className="mt-5 flex w-full max-w-xl items-center justify-center gap-2.5 md:mt-6 md:gap-4">
          <span
            aria-hidden
            className="h-px w-12 bg-gradient-to-r from-transparent to-[#5b8cff]/55 sm:w-20 md:w-28"
          />
          <Sparkle className="text-xs md:text-sm" />
          <span className="whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-foreground/70 sm:text-xs md:text-sm">
            From zero to product
          </span>
          <Sparkle className="text-xs md:text-sm" />
          <span
            aria-hidden
            className="h-px w-12 bg-gradient-to-l from-transparent to-[#5b8cff]/55 sm:w-20 md:w-28"
          />
            </div>
          </>
        ) : null}

        {/* Timer label — solid「참가」, gradient on「마감까지」only */}
        <p
          className={`${compact ? "mt-0" : "mt-8 md:mt-10"} whitespace-nowrap text-[clamp(2.15rem,7vw,6.75rem)] font-black leading-none tracking-[-0.03em]`}
        >
          {parts.ended ? (
            <span className="text-white">참가 신청이 마감되었습니다</span>
          ) : (
            <>
              <span
                className="text-white"
                style={{
                  filter:
                    "drop-shadow(0 0 10px rgba(255,255,255,0.35))",
                }}
              >
                참가
              </span>
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #e8f9ff 0%, #7dd3fc 28%, #4fc3f7 48%, #8b9cff 68%, #b794f6 84%, #e9d5ff 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  filter:
                    "drop-shadow(0 0 22px rgba(79,195,247,0.5)) drop-shadow(0 0 32px rgba(183,148,246,0.35))",
                }}
              >
                {" "}
                마감까지
              </span>
            </>
          )}
        </p>

        {/* Timer frame */}
        <div className="relative mt-16 w-full md:mt-20 lg:mt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-3 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#22d3ee]/28 blur-3xl md:-left-6 md:h-48 md:w-48"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-3 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#a855f7]/28 blur-3xl md:-right-6 md:h-48 md:w-48"
          />

          <div className="relative rounded-[1.5rem] bg-gradient-to-r from-[#22d3ee] via-[#6366f1] to-[#c084fc] p-px shadow-[0_0_64px_rgba(124,108,240,0.38)] md:rounded-[1.75rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[12%] -top-px h-px bg-gradient-to-r from-transparent via-[#67e8f9]/90 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[12%] -bottom-px h-px bg-gradient-to-r from-transparent via-[#c084fc]/80 to-transparent"
            />

            <div className="relative overflow-hidden rounded-[1.47rem] bg-[#04060f]/97 px-3 py-7 sm:px-6 sm:py-9 md:rounded-[1.72rem] md:px-10 md:py-12 lg:px-12 lg:py-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_0%,rgba(91,140,255,0.1),transparent_62%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-[#22d3ee]/50 via-white/25 to-[#c084fc]/50"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-[#22d3ee]/30 via-[#7c6cf0]/40 to-[#c084fc]/50"
              />

              <CountdownDisplay parts={parts} />

              {/* Bottom status bar */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#22d3ee] shadow-[0_0_18px_rgba(34,211,238,0.95),0_0_36px_rgba(34,211,238,0.45)] md:w-20"
              />
            </div>
          </div>
        </div>

        {!compact ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-base tracking-wide text-[#67e8f9] md:mt-10 md:gap-2.5 md:text-lg">
          <Calendar className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
          <span>DEADLINE · 2026. 9. 21. (월) 23:59 KST</span>
          <Clock className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
        </div>
        ) : null}
      </div>
    </section>
  )
}
