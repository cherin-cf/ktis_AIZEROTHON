"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ApplicationCountdown } from "@/components/application-countdown"
import { Reveal } from "@/components/reveal"

const V = "intro5"

function ScreenImg({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      draggable={false}
      priority={priority}
      className={`pointer-events-none select-none mix-blend-screen ${className}`}
    />
  )
}

export function IntroduceSection() {
  return (
    <section id="introduce" className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_18%,rgba(59,108,255,0.14),transparent_64%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_42%,rgba(124,108,240,0.12),transparent_60%)]"
      />

      <div className="site-shell relative py-16 md:py-24 lg:py-28">
        <Reveal>
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-[70%] w-[48%] bg-[radial-gradient(ellipse_70%_80%_at_80%_45%,rgba(59,108,255,0.28),transparent_68%)]"
            />

            {/* Top: copy left + AI right (첨부3) */}
            <div className="relative grid items-start gap-6 py-4 md:gap-8 md:py-6 lg:grid-cols-12 lg:items-center lg:gap-6">
              <div className="min-w-0 overflow-visible lg:col-span-7">
                <span className="inline-flex items-center rounded-full border border-[#7eb6ff]/50 bg-[#07101f]/90 px-4 py-1.5 text-sm font-medium tracking-wide text-white/90 md:px-5 md:py-2 md:text-base">
                  WI ZEROTHON이란?
                </span>

                <h2 className="mt-4 overflow-visible pr-5 font-black italic leading-[0.92] tracking-[-0.04em] md:mt-5 md:pr-8 lg:pr-10">
                  <span className="inline-block whitespace-nowrap pb-1 text-[clamp(3.75rem,11vw,9.25rem)]">
                    <span className="text-white [text-shadow:0_0_28px_rgba(103,232,249,0.55)]">
                      WI{" "}
                    </span>
                    <span className="bg-gradient-to-r from-[#67e8f9] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent [filter:drop-shadow(0_0_18px_rgba(96,165,250,0.45))]">
                      ZEROTHON
                    </span>
                  </span>
                </h2>

                <p className="mt-4 max-w-2xl font-sans text-lg leading-relaxed text-white/90 md:mt-5 md:text-xl lg:text-2xl">
                  비 IT직무자가{" "}
                  <span className="bg-gradient-to-r from-[#67e8f9] to-[#93c5fd] bg-clip-text font-semibold text-transparent">
                    노코드·AI도구
                  </span>
                  를 활용해
                  <br className="hidden sm:block" />
                  단기간 내 업무 개선 결과물을{" "}
                  <span className="bg-gradient-to-r from-[#d8b4fe] to-[#a78bfa] bg-clip-text font-semibold text-transparent">
                    구현·시연
                  </span>
                  하는 프로그램
                </p>

                {/* 4SECTION — under 프로그램 (초록 영역) */}
                <div className="relative mt-5 w-full max-w-xl md:mt-6 md:max-w-2xl lg:max-w-[36rem]">
                  <ScreenImg
                    src={`/4SECTION/new_4section.png?v=${V}`}
                    alt="노코드 AI, 업무 개선, 단기간 구현, 시연"
                    width={1920}
                    height={360}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>

              <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
                <motion.div
                  className="relative w-full max-w-[300px] overflow-visible md:max-w-[340px] lg:max-w-[380px]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-8 bottom-8 h-24 rounded-full bg-[#3b6cff]/40 blur-3xl"
                  />
                  {/* Soft edge fade so black plate / JPG rim disappears into bg */}
                  <div
                    className="relative z-[1] scale-[1.06] [mask-image:radial-gradient(ellipse_68%_64%_at_50%_48%,#000_38%,rgba(0,0,0,0.85)_58%,transparent_76%)] [-webkit-mask-image:radial-gradient(ellipse_68%_64%_at_50%_48%,#000_38%,rgba(0,0,0,0.85)_58%,transparent_76%)]"
                  >
                    <ScreenImg
                      src={`/introduce/NEW_AI.png?v=${V}`}
                      alt="WI ZEROTHON AI 큐브"
                      width={1024}
                      height={1024}
                      priority
                      className="relative h-auto w-full object-contain"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ApplicationCountdown compact className="mt-10 md:mt-14" />
        </Reveal>
      </div>
    </section>
  )
}
