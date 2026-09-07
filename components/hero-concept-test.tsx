"use client"

/**
 * TEST ONLY — concept hero using the attached mockup as a full-bleed image.
 * Toggle off in app/page.tsx (USE_HERO_CONCEPT_TEST = false) to restore WebGL hero.
 */
import Image from "next/image"
import { useApplyModal } from "@/components/apply/apply-modal-context"
import { KtIsMark } from "@/components/kt-is-mark"

export function HeroConceptTest() {
  const { openApplyModal } = useApplyModal()

  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#05061a]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/concept-test.jpg"
          alt="WI ZEROTHON concept hero"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Soft fade into next section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />
      </div>

      {/* Working nav over the baked-in mockup nav (so links still work) */}
      <header className="site-shell relative z-30 flex items-center justify-between py-6">
        <a
          href="#top"
          className="flex items-center gap-2.5 opacity-0 md:gap-3.5"
          aria-label="kt is WI ZEROTHON home"
          data-cursor="link"
        >
          <KtIsMark className="h-7 w-auto md:h-8" />
          <span className="text-base font-bold tracking-[0.08em] text-foreground md:text-lg">
            WI ZEROTHON
          </span>
        </a>
        <nav className="flex items-center gap-2 md:gap-3 lg:gap-4">
          {[
            { label: "대회 소개", href: "#about" },
            { label: "참가 방법", href: "#guide" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-cursor="link"
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 opacity-90 transition hover:bg-white/10 hover:opacity-100 md:px-4 md:text-base"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={openApplyModal}
            data-cursor="link"
            className="rounded-full bg-gradient-to-r from-[#4f7cff] to-[#9b6bff] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.45)] transition hover:brightness-110 md:px-5 md:text-base"
          >
            지금 신청하기 →
          </button>
        </nav>
      </header>

      <div className="relative z-20 mt-auto flex justify-center pb-6 pt-[min(62vh,720px)]">
        <p className="rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs tracking-wide text-white/80 backdrop-blur-sm md:text-sm">
          TEST · 시안 이미지 히어로 (기존 WebGL 히어로는 플래그로 복구)
        </p>
      </div>
    </section>
  )
}
