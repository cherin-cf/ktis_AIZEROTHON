"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "@/components/reveal"

const steps = [
  { day: "Day 00", title: "Kickoff & team forming", desc: "Opening keynote, model access unlocked, teams assemble around ideas." },
  { day: "Day 01", title: "Build sprint", desc: "48 hours on the clock. Mentor studios, office hours, and midnight fuel." },
  { day: "Day 02", title: "Demo & judging", desc: "Ship, present live, and defend your build in front of the panel." },
  { day: "Day 02", title: "Awards night", desc: "Winners crowned, credits granted, and the after-party begins." },
]

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="timeline" className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          03 — Timeline
        </span>
        <h2 className="mt-6 text-balance text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Three days. One trajectory.
        </h2>
      </Reveal>

      <div ref={ref} className="relative mt-16 pl-8 md:pl-0">
        {/* track */}
        <div className="absolute bottom-0 left-0 top-0 w-px bg-border md:left-[8.5rem]" aria-hidden />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute bottom-0 left-0 top-0 w-px origin-top bg-primary md:left-[8.5rem]"
          aria-hidden
        />

        <div className="flex flex-col gap-14">
          {steps.map((s, i) => (
            <Reveal key={i} delay={0.05}>
              <div className="relative flex flex-col gap-2 md:flex-row md:gap-10">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary md:w-32 md:pt-1 md:text-right">
                  {s.day}
                </div>
                <span
                  className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background md:left-[8.5rem] md:-translate-x-1/2"
                  aria-hidden
                />
                <div className="md:pl-6">
                  <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
