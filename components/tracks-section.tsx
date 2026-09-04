"use client"

import { Reveal } from "@/components/reveal"
import { Brain, Bot, Sparkles, ChartLine } from "lucide-react"

const tracks = [
  {
    icon: Bot,
    name: "Agents & Automation",
    desc: "Autonomous systems that plan, act, and get real work done across tools and APIs.",
  },
  {
    icon: Sparkles,
    name: "Generative Interfaces",
    desc: "New surfaces for creation — where prompts, canvases, and models become the product.",
  },
  {
    icon: Brain,
    name: "Applied Research",
    desc: "Fine-tuning, retrieval, and evaluation pushed to solve a concrete, measurable problem.",
  },
  {
    icon: ChartLine,
    name: "AI for Good",
    desc: "Intelligence pointed at climate, health, access, and the systems people rely on.",
  },
]

export function TracksSection() {
  return (
    <section id="tracks" className="relative border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              02 — Tracks
            </span>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Four ways to start from zero.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
              Pick a track or blur the lines. Judges reward the boldest leap
              from idea to something that actually runs.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {tracks.map((t, i) => {
            const Icon = t.icon
            return (
              <Reveal key={t.name} delay={i * 0.08}>
                <div
                  data-cursor="hover"
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-8 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                    {t.name}
                  </h3>
                  <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
                    {t.desc}
                  </p>
                  <span className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary">
                    0{i + 1} / Explore →
                  </span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
