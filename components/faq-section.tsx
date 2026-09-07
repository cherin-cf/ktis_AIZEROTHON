"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  GraduationCap,
  LayoutGrid,
  Lightbulb,
  Rocket,
  Trophy,
  Users,
} from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import { Reveal } from "@/components/reveal"

type Category =
  | "전체"
  | "참가/팀"
  | "아이디어"
  | "교육"
  | "ZEROTHON"
  | "시상/혜택"

type FaqCategory = Exclude<Category, "전체">

type FaqEntry = {
  globalId: string
  sectionId: string
  sectionTitle: string
  category: FaqCategory
  q: string
  a: ReactNode
}

const CATEGORIES: {
  id: Category
  label: string
  icon: typeof LayoutGrid
}[] = [
  { id: "전체", label: "전체", icon: LayoutGrid },
  { id: "참가/팀", label: "참가/팀", icon: Users },
  { id: "아이디어", label: "아이디어", icon: Lightbulb },
  { id: "교육", label: "교육", icon: GraduationCap },
  { id: "ZEROTHON", label: "ZEROTHON", icon: Rocket },
  { id: "시상/혜택", label: "시상/혜택", icon: Trophy },
]

function AnswerText({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3.5 text-lg leading-relaxed text-foreground/80 md:text-xl md:leading-relaxed">
      {children}
    </div>
  )
}

const FAQ_SECTIONS: {
  id: string
  title: string
  category: FaqCategory
  items: { q: string; a: ReactNode }[]
}[] = [
  {
    id: "01",
    title: "참가 & 팀 구성",
    category: "참가/팀",
    items: [
      {
        q: "누가 참가할 수 있나요?",
        a: (
          <AnswerText>
            <p>kt is 직원이라면 참가할 수 있습니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "개인으로도 참가할 수 있나요?",
        a: (
          <AnswerText>
            <p>네. 개인 참가도 가능합니다.</p>
            <p>
              개인으로 신청할 경우 신청 내용을 검토한 후 인재경영팀에서 3명
              1팀으로 매칭해드립니다.
            </p>
          </AnswerText>
        ),
      },
      {
        q: "팀은 몇 명으로 구성하나요?",
        a: (
          <AnswerText>
            <p>반드시 3명 1팀으로 구성합니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "다른 부서의 구성원과 팀을 구성해도 되나요?",
        a: (
          <AnswerText>
            <p>
              네. 소속 부서와 관계없이 서로 다른 부서의 구성원과도 팀을 구성할
              수 있습니다.
            </p>
          </AnswerText>
        ),
      },
      {
        q: "팀원이 아직 없다면 어떻게 하나요?",
        a: (
          <AnswerText>
            <p>개인 참가로 신청해주세요.</p>
            <p>
              신청 내용을 바탕으로 인재경영팀에서 서로의 관심과 역량 등을
              고려해 팀을 매칭해드립니다.
            </p>
          </AnswerText>
        ),
      },
      {
        q: "신청 후 팀원을 변경할 수 있나요?",
        a: (
          <AnswerText>
            <p>팀 확정 이후에는 팀원 변경이 불가합니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "AI를 잘 몰라도 참가할 수 있나요?",
        a: (
          <AnswerText>
            <p>네. AI 비전문가도 참가할 수 있습니다.</p>
            <p>
              사전 AI 교육과 멘토링을 통해 아이디어를 구체화하고 구현할 수
              있도록 지원합니다.
            </p>
          </AnswerText>
        ),
      },
    ],
  },
  {
    id: "02",
    title: "아이디어 & 과제",
    category: "아이디어",
    items: [
      {
        q: "어떤 주제로 참가하나요?",
        a: (
          <AnswerText>
            <p>아래 두 가지 과제 분야 중 하나를 선택해 참가합니다.</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="shrink-0 font-semibold text-[#7eb6ff]">
                  고객가치제공
                </span>
                <span className="text-foreground/70">:</span>
                <span>고객 경험과 가치를 높이는 아이디어</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 font-semibold text-[#c4b5fd]">
                  내부효율화
                </span>
                <span className="text-foreground/70">:</span>
                <span>업무와 조직의 효율을 높이는 아이디어</span>
              </li>
            </ul>
          </AnswerText>
        ),
      },
      {
        q: "아이디어는 자유롭게 제안할 수 있나요?",
        a: (
          <AnswerText>
            <p>
              네. 일상에서 발견한 문제부터 업무 현장의 개선 아이디어까지, AI를
              활용해 해결할 수 있는 아이디어라면 자유롭게 제안할 수 있습니다.
            </p>
          </AnswerText>
        ),
      },
      {
        q: "개발 경험이 없어도 참가할 수 있나요?",
        a: (
          <AnswerText>
            <p>
              네. 개발뿐 아니라 기획, 문제정의, 서비스 설계 등 다양한 역할로
              참여할 수 있습니다.
            </p>
          </AnswerText>
        ),
      },
    ],
  },
  {
    id: "03",
    title: "선발",
    category: "아이디어",
    items: [
      {
        q: "최종 몇 팀이 선발되나요?",
        a: (
          <AnswerText>
            <p>심사를 통해 총 10팀을 선발합니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "선발은 어떻게 진행되나요?",
        a: (
          <AnswerText>
            <p>
              제출해주신 신청서와 아이디어를 바탕으로 심사를 진행하며, 세부
              평가 기준은 추후 안내드립니다.
            </p>
          </AnswerText>
        ),
      },
      {
        q: "평가 기준은 무엇인가요?",
        a: (
          <AnswerText>
            <p>세부 평가 기준은 추후 안내드릴 예정입니다.</p>
          </AnswerText>
        ),
      },
    ],
  },
  {
    id: "04",
    title: "AI 교육",
    category: "교육",
    items: [
      {
        q: "사전 AI 교육에 꼭 참석해야 하나요?",
        a: (
          <AnswerText>
            <p>네. 사전 AI 교육은 필수 참석입니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "사전 AI 교육에서는 무엇을 배우나요?",
        a: (
          <AnswerText>
            <p>
              ZEROTHON에서 아이디어를 실제로 구현할 수 있도록 AI 활용 방법과
              아이디어 구체화, 서비스 구현 등에 필요한 내용을 교육합니다.
            </p>
          </AnswerText>
        ),
      },
      {
        q: "어떤 AI 도구를 사용하나요?",
        a: (
          <AnswerText>
            <p>Microsoft 365 Copilot을 중심으로 활용합니다.</p>
            <p>기타 AI 도구의 활용 방법은 교육 당일 안내드립니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "참가자에게 AI 도구가 제공되나요?",
        a: (
          <AnswerText>
            <p>네. 참가자에게 Microsoft 365 Copilot 권한이 부여됩니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "AI를 잘 못하는데 교육을 따라갈 수 있을까요?",
        a: (
          <AnswerText>
            <p>
              물론입니다. AI 초보자도 참여할 수 있도록 사전 교육을 진행하며,
              ZEROTHON 현장에서도 전문가 멘토링을 지원합니다.
            </p>
          </AnswerText>
        ),
      },
    ],
  },
  {
    id: "05",
    title: "ZEROTHON",
    category: "ZEROTHON",
    items: [
      {
        q: "ZEROTHON은 언제 진행되나요?",
        a: (
          <AnswerText>
            <p>2026년 11월 초 진행 예정입니다.</p>
            <p>정확한 일정은 추후 안내드립니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "ZEROTHON은 어디에서 진행되나요?",
        a: (
          <AnswerText>
            <p>KT 원주연수원에서 진행됩니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "ZEROTHON은 어떤 방식으로 진행되나요?",
        a: (
          <AnswerText>
            <p>
              팀별로 아이디어를 구체화하고 AI를 활용해 실제 결과물을
              만들어보는 1박 2일 집중 프로그램으로 진행됩니다.
            </p>
          </AnswerText>
        ),
      },
      {
        q: "개인 노트북을 가져가야 하나요?",
        a: (
          <AnswerText>
            <p>네. 회사 개인 PC를 반드시 지참해주세요.</p>
          </AnswerText>
        ),
      },
      {
        q: "ZEROTHON 당일에도 도움을 받을 수 있나요?",
        a: (
          <AnswerText>
            <p>
              네. 전문가 멘토링을 통해 아이디어 구체화부터 AI 활용, 구현
              과정까지 팀별로 도움을 받을 수 있습니다.
            </p>
          </AnswerText>
        ),
      },
    ],
  },
  {
    id: "06",
    title: "발표 & 결과물",
    category: "ZEROTHON",
    items: [
      {
        q: "최종 결과물은 어떤 형태로 제출하나요?",
        a: (
          <AnswerText>
            <p>결과물 제출 방식은 추후 안내드립니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "최종 발표는 어떻게 진행되나요?",
        a: (
          <AnswerText>
            <p>발표 방식은 추후 안내드립니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "평가 기준은 어떻게 되나요?",
        a: (
          <AnswerText>
            <p>세부 평가 기준은 추후 안내드립니다.</p>
          </AnswerText>
        ),
      },
    ],
  },
  {
    id: "07",
    title: "시상 & 혜택",
    category: "시상/혜택",
    items: [
      {
        q: "어떤 시상이 있나요?",
        a: (
          <AnswerText>
            <p>대상, 우수상, 협업상을 시상합니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "수상 혜택은 팀원 모두에게 제공되나요?",
        a: (
          <AnswerText>
            <p>네. 수상팀 전원에게 혜택이 제공됩니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "대상 혜택은 무엇인가요?",
        a: (
          <AnswerText>
            <p>대상팀에게는 CES 참가 기회가 제공됩니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "우수상 혜택은 무엇인가요?",
        a: (
          <AnswerText>
            <p>우수상팀에게는 개인별 MacBook이 제공됩니다.</p>
            <p>세부 모델 및 사양은 추후 안내드립니다.</p>
          </AnswerText>
        ),
      },
      {
        q: "협업상 혜택은 무엇인가요?",
        a: (
          <AnswerText>
            <p>협업상팀에게는 개인별 최신 AirPods이 제공됩니다.</p>
            <p>세부 모델 및 사양은 추후 안내드립니다.</p>
          </AnswerText>
        ),
      },
    ],
  },
]

function buildFaqEntries(): FaqEntry[] {
  let counter = 0
  const entries: FaqEntry[] = []

  for (const section of FAQ_SECTIONS) {
    for (const item of section.items) {
      counter += 1
      entries.push({
        globalId: String(counter).padStart(2, "0"),
        sectionId: section.id,
        sectionTitle: section.title,
        category: section.category,
        q: item.q,
        a: item.a,
      })
    }
  }

  return entries
}

const ALL_FAQS = buildFaqEntries()

function Twinkles() {
  const stars = [
    { t: "8%", l: "12%", d: 0 },
    { t: "18%", l: "68%", d: 0.7 },
    { t: "28%", l: "88%", d: 1.2 },
    { t: "55%", l: "6%", d: 0.4 },
    { t: "82%", l: "40%", d: 0.9 },
    { t: "90%", l: "78%", d: 0.2 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-[11px] text-[#5b8cff]/70"
          style={{ top: s.t, left: s.l }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: 2.2 + (i % 3) * 0.35,
            delay: s.d,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          +
        </motion.span>
      ))}
    </div>
  )
}

function FaqHeaderVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[380px] md:max-w-[440px] lg:max-w-[480px]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 bottom-4 h-20 rounded-full bg-[#3b6cff]/35 blur-3xl"
      />
      <Image
        src="/faq/NEW_FAQ.png"
        alt="FAQ 로봇"
        width={1024}
        height={1024}
        unoptimized
        draggable={false}
        priority
        className="relative z-[1] h-auto w-full drop-shadow-[0_0_48px_rgba(124,108,240,0.4)]"
      />
    </div>
  )
}

function SectionHeading({
  id,
  title,
}: {
  id: string
  title: string
}) {
  return (
    <div className="flex items-center gap-3 pt-3 pb-2 md:gap-4">
      <span className="font-mono text-base font-bold tracking-[0.12em] text-[#5b8cff] md:text-lg">
        {id}.
      </span>
      <h3 className="text-xl font-bold text-foreground md:text-2xl">{title}</h3>
      <span
        aria-hidden
        className="hidden h-px flex-1 bg-gradient-to-r from-[#3b6cff]/50 to-transparent sm:block"
      />
    </div>
  )
}

function FaqBadge({
  label,
  variant,
}: {
  label: string
  variant: "q" | "a"
}) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs font-bold tracking-wide md:h-12 md:w-12 md:text-sm ${
        variant === "q"
          ? "border-[#5b8cff]/70 bg-[#0a1538]/90 text-[#7eb6ff] shadow-[0_0_16px_rgba(59,108,255,0.2)]"
          : "border-[#7c6cf0]/60 bg-[#12102a]/90 text-[#c4b5fd] shadow-[0_0_16px_rgba(124,108,240,0.2)]"
      }`}
    >
      {label}
    </span>
  )
}

function FaqItem({
  id,
  q,
  a,
  open,
  onToggle,
}: {
  id: string
  q: string
  a: ReactNode
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      layout
      className={`overflow-hidden rounded-2xl border bg-[#060a1c]/80 backdrop-blur-sm transition-[border-color,box-shadow] ${
        open
          ? "border-[#7eb6ff]/70 shadow-[0_0_32px_rgba(59,108,255,0.18),inset_0_1px_0_rgba(126,182,255,0.08)]"
          : "border-[#3b6cff]/35 hover:border-[#5b8cff]/55 hover:shadow-[0_0_24px_rgba(59,108,255,0.1)]"
      }`}
    >
      <button
        type="button"
        data-cursor="hover"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-5 text-left md:gap-5 md:px-7 md:py-6"
      >
        <FaqBadge label={`Q.${id}`} variant="q" />
        <span className="min-w-0 flex-1 text-lg font-semibold leading-snug text-foreground md:text-xl lg:text-2xl">
          {q}
        </span>
        <motion.span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3b6cff]/40 bg-[#0a1238]/60 font-mono text-2xl leading-none text-[#7eb6ff] md:h-11 md:w-11"
          animate={{ rotate: open ? 0 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open ? "−" : "+"}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-5 md:px-7 md:pb-6">
              <div className="flex gap-4 rounded-xl border border-[#3b6cff]/20 bg-[#040818]/90 p-5 md:gap-5 md:p-6">
                <FaqBadge label="A." variant="a" />
                <div className="min-w-0 flex-1 pt-0.5">{a}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function groupBySection(items: FaqEntry[]) {
  const groups: { sectionId: string; sectionTitle: string; items: FaqEntry[] }[] =
    []

  for (const item of items) {
    const last = groups[groups.length - 1]
    if (last?.sectionId === item.sectionId) {
      last.items.push(item)
    } else {
      groups.push({
        sectionId: item.sectionId,
        sectionTitle: item.sectionTitle,
        items: [item],
      })
    }
  }

  return groups
}

export function FaqSection() {
  const [category, setCategory] = useState<Category>("전체")
  const [openId, setOpenId] = useState<string | null>("01")

  const filteredItems = useMemo(
    () =>
      category === "전체"
        ? ALL_FAQS
        : ALL_FAQS.filter((f) => f.category === category),
    [category],
  )

  const groupedItems = useMemo(
    () => groupBySection(filteredItems),
    [filteredItems],
  )

  const showSectionHeadings = category === "전체" || groupedItems.length > 1

  return (
    <section
      id="faq"
      className="relative z-20 overflow-hidden border-t border-border bg-background"
    >
      <Twinkles />

      <div className="site-shell py-28 md:py-40">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="min-w-0 flex-1 md:max-w-none">
            <Reveal>
              <span className="font-mono text-xl font-bold tracking-[0.22em] text-[#7eb6ff] md:text-2xl lg:text-3xl">
                05 — FAQ
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(2.75rem,5vw,5.25rem)] font-bold leading-[1.08] tracking-[-0.035em]">
                <span className="text-foreground">자주 묻는</span>
                <span className="bg-gradient-to-r from-white via-[#c4b5fd] to-[#7c6cf0] bg-clip-text text-transparent">
                  질문
                </span>
                <span className="rounded-full border border-[#5b8cff]/50 bg-[#0a1238]/80 px-3 py-1 font-mono text-xs font-semibold tracking-[0.18em] text-[#7eb6ff] md:text-sm">
                  FAQ
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-3xl font-sans text-xl leading-relaxed text-foreground/80 md:text-2xl">
                AI 제로톤에 대해 자주 문의하시는 내용을 모아두었어요.
                <br />
                궁금한 내용이 있다면 아래에서 확인해 보세요!
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={0.15}
            className="shrink-0 self-center md:self-start md:pt-2"
          >
            <FaqHeaderVisual />
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-14 flex flex-wrap gap-3 md:mt-16 md:gap-4">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const active = category === id
              return (
                <motion.button
                  key={id}
                  type="button"
                  data-cursor="hover"
                  onClick={() => {
                    setCategory(id)
                    setOpenId(null)
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-base font-semibold transition-all md:gap-3 md:px-6 md:py-3.5 md:text-lg lg:text-xl ${
                    active
                      ? "border-transparent bg-gradient-to-r from-[#3b6cff] via-[#5b6cff] to-[#7c3aed] text-white shadow-[0_0_28px_rgba(59,108,255,0.4)]"
                      : "border-[#3b6cff]/45 bg-[#080d24]/75 text-foreground/90 hover:border-[#7eb6ff]/70 hover:bg-[#0a1238]/80"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 md:h-6 md:w-6 ${active ? "text-white" : "text-[#7eb6ff]"}`}
                    strokeWidth={2}
                  />
                  {label}
                </motion.button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col gap-5 md:mt-14 md:gap-6">
          <AnimatePresence mode="popLayout">
            {groupedItems.map((group) => (
              <motion.div
                key={`${category}-${group.sectionId}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 md:gap-6"
              >
                {showSectionHeadings && (
                  <SectionHeading
                    id={group.sectionId}
                    title={group.sectionTitle}
                  />
                )}
                {group.items.map((item, i) => (
                  <motion.div
                    key={item.globalId}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                  >
                    <FaqItem
                      id={item.globalId}
                      q={item.q}
                      a={item.a}
                      open={openId === item.globalId}
                      onToggle={() =>
                        setOpenId((prev) =>
                          prev === item.globalId ? null : item.globalId,
                        )
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <p className="py-10 text-center text-foreground/60">
              해당 카테고리의 질문이 없습니다.
            </p>
          )}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 flex justify-center md:mt-20">
            <div className="w-full max-w-3xl rounded-2xl border border-dashed border-[#5b8cff]/50 bg-[#080d24]/80 px-8 py-6 text-left md:px-10 md:py-7">
              <p className="text-lg font-semibold text-foreground md:text-xl">
                더 궁금한 점이 있다면 아래 메일로 문의해주세요
              </p>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-foreground/80 md:text-lg">
                <li className="flex flex-wrap gap-x-2 gap-y-1">
                  <span className="text-[#7eb6ff]">○</span>
                  <span>경영기획총괄 인재경영팀 강민정 차장:</span>
                  <a
                    href="mailto:minj.kang@kt.com"
                    className="font-semibold text-[#7eb6ff] transition-colors hover:text-[#a5c8ff]"
                  >
                    minj.kang@kt.com
                  </a>
                </li>
                <li className="flex flex-wrap gap-x-2 gap-y-1">
                  <span className="text-[#7eb6ff]">○</span>
                  <span>경영기획총괄 인재경영팀 김채린:</span>
                  <a
                    href="mailto:cherin.kim@kt.com"
                    className="font-semibold text-[#7eb6ff] transition-colors hover:text-[#a5c8ff]"
                  >
                    cherin.kim@kt.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
