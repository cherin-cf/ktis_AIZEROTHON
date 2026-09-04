"use client"

import Image from "next/image"
import { ChevronRight, FilePenLine, Mail, Plus, Shield, Unlock, UserRoundPlus } from "lucide-react"
import { Fragment, useState } from "react"
import { TeamApplyModal } from "@/components/apply/apply-modals"

const primaryBtnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(124,58,237,0.28)] transition-transform hover:-translate-y-0.5 md:text-lg"

export function ApplyHeroPanels({ onCreatePost }: { onCreatePost: () => void }) {
  const [teamModalOpen, setTeamModalOpen] = useState(false)

  return (
    <>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_1.2fr_minmax(17rem,20rem)]">
        {/* 팀 참가 */}
        <article
          id="team-apply"
          className="overflow-hidden rounded-2xl border border-[#e8eaf0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
        >
          <div className="flex h-full flex-col items-stretch md:flex-row">
            <div className="flex shrink-0 items-center justify-center bg-[#f2f4f8] px-8 py-8 md:w-[42%] md:py-10">
              <Image
                src="/apply/team-participation.png"
                alt="팀 참가"
                width={360}
                height={200}
                unoptimized
                className="h-auto w-full max-w-[300px] object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="flex flex-1 flex-col px-8 py-8 md:py-10">
              <h2 className="text-xl font-bold text-[#1e1b4b] md:text-2xl">
                팀으로 참가하시나요?
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#64748b] md:text-base">
                팀 신청서를 작성해 제출해주세요.
              </p>
              <button
                type="button"
                onClick={() => setTeamModalOpen(true)}
                className={`mt-6 ${primaryBtnClass}`}
              >
                <Mail className="h-5 w-5" />
                팀 신청하기
              </button>
            </div>
          </div>
        </article>

        {/* 혼자 참가 */}
        <article className="overflow-hidden rounded-2xl border border-[#e8eaf0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
          <div className="flex h-full flex-col items-stretch md:flex-row">
            <div className="flex shrink-0 items-center justify-center bg-[#f2f4f8] px-8 py-8 md:w-[42%] md:py-10">
              <Image
                src="/apply/solo-participation.png"
                alt="혼자 참가"
                width={240}
                height={240}
                unoptimized
                className="h-auto w-full max-w-[100px] object-contain md:max-w-[90px]"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="flex flex-1 flex-col px-8 py-8 md:py-10">
              <h2 className="text-xl font-bold text-[#1e1b4b] md:text-2xl">
                혼자 참가하시나요?
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#64748b] md:text-base">
                아래 참가자 목록을 둘러보고
                <br />
                마음에 드는 팀에 신청해보세요.
              </p>
              <button
                type="button"
                onClick={onCreatePost}
                className={`mt-6 ${primaryBtnClass}`}
              >
                <Plus className="h-5 w-5" />
                참가 글 작성
              </button>
            </div>
          </div>
        </article>

        {/* 안내 */}
        <aside className="flex flex-col items-center justify-center rounded-2xl border border-[#e9d5ff] bg-[#f5f3ff] p-6 text-center xl:p-8">
          <div className="flex items-center justify-center gap-2.5 text-[#7c3aed]">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-bold">안내</span>
          </div>
          <p className="mt-5 text-base leading-relaxed text-[#5b4f8a] md:text-lg">
            신청자와 작성자 모두의
            <br />
            <span className="font-semibold text-[#4c1d95]">수락 전까지 익명</span>으로
            표시됩니다.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#5b4f8a] md:text-lg">
            상호 수락 시,
            <br />
            연락처가 공개됩니다.
          </p>
        </aside>
      </section>

      {teamModalOpen ? <TeamApplyModal onClose={() => setTeamModalOpen(false)} /> : null}
    </>
  )
}

export function ApplyUsageGuide() {
  const steps = [
    {
      icon: FilePenLine,
      label: "모집자",
      desc: "모집 글을 작성하고 등록해주세요.",
    },
    {
      icon: UserRoundPlus,
      label: "참가자",
      desc: "마음이 맞는 팀원에게 신청해주세요.",
    },
    {
      icon: Unlock,
      label: "매칭",
      desc: "모집자가 신청하면 익명이 해제됩니다.",
    },
  ]

  return (
    <section className="rounded-2xl border border-[#e8eaf0] bg-white px-6 py-10 md:px-10">
      <h2 className="text-center text-xl font-bold text-[#1e1b4b] md:text-2xl">이용 안내</h2>
      <div className="mt-8 flex items-center justify-between gap-2 md:gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <Fragment key={step.label}>
              {i > 0 ? (
                <ChevronRight
                  className="h-7 w-7 shrink-0 text-[#c4b5fd] md:h-8 md:w-8"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#7c3aed]">
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-base font-bold text-[#7c3aed] md:text-lg">
                  {i + 1}. {step.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] md:text-base">
                  {step.desc}
                </p>
              </div>
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
