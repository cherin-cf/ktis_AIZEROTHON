import { MainPageShell } from "@/components/main-page-shell"
import { SiteCursor } from "@/components/site-cursor"
import { HeroHaoqi } from "@/components/hero-haoqi"
import { MarqueeBand } from "@/components/marquee-band"
import { IntroduceSection } from "@/components/introduce-section"
import { AboutSection } from "@/components/about-section"
import { PrizesSection } from "@/components/prizes-section"
import { GuideSection } from "@/components/guide-section"
import { FaqSection } from "@/components/faq-section"
import { CtaFooter } from "@/components/cta-footer"

export default function Page() {
  return (
    <MainPageShell>
      <main className="relative bg-background">
        <SiteCursor />
        <HeroHaoqi />
        <MarqueeBand />
        <IntroduceSection />
        <AboutSection />
        <PrizesSection />
        <GuideSection />
        <FaqSection />
        <CtaFooter />
      </main>
    </MainPageShell>
  )
}
