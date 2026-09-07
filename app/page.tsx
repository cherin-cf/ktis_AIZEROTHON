import { MainPageShell } from "@/components/main-page-shell"
import { SiteCursor } from "@/components/site-cursor"
import { HeroHaoqi } from "@/components/hero-haoqi"
import { HeroConceptTest } from "@/components/hero-concept-test"
import { IntroduceSection } from "@/components/introduce-section"
import { AboutSection } from "@/components/about-section"
import { PrizesSection } from "@/components/prizes-section"
import { GuideSection } from "@/components/guide-section"
import { FaqSection } from "@/components/faq-section"
import { CtaFooter } from "@/components/cta-footer"

/** true = 시안 풀이미지 테스트 / false = HeroHaoqi (B prerender 기본, A는 컴포넌트 플래그) */
const USE_HERO_CONCEPT_TEST = false

export default function Page() {
  return (
    <MainPageShell>
      <main className="relative overflow-x-clip bg-background">
        <SiteCursor />
        <div className="relative">
          {USE_HERO_CONCEPT_TEST ? <HeroConceptTest /> : <HeroHaoqi />}
          <IntroduceSection />
        </div>
        <AboutSection />
        <PrizesSection />
        <GuideSection />
        <FaqSection />
        <CtaFooter />
      </main>
    </MainPageShell>
  )
}
