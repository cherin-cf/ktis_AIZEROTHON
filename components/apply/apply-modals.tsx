"use client"

import { useState } from "react"

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#4a4270]">
        {label}
        {required ? <span className="text-[#7c5cff]"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  "w-full rounded-xl border border-[#e0d4ff] bg-[#faf8ff] px-4 py-3 text-sm text-[#2d2458] outline-none transition-colors placeholder:text-[#b0a3d4] focus:border-[#9b8cff] focus:bg-white"

export function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-[#1a1030]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#e8ddff] bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#2d2458]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[#8b7db8] hover:bg-[#f3edff]"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function CreatePostModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (form: FormData) => void
}) {
  const [error, setError] = useState("")

  return (
    <ModalShell title="참가 글 작성" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setError("")
          const form = e.currentTarget
          const formData = new FormData(form)
          const pin = String(formData.get("pin") ?? "").trim()

          if (!/^[0-9]{4,6}$/.test(pin)) {
            setError("관리용 PIN은 4~6자리 숫자로 입력해주세요.")
            return
          }

          onSubmit(formData)
        }}
      >
        <Field label="닉네임" required>
          <input name="nickname" required className={inputClass} placeholder="익명으로 표시될 닉네임" />
        </Field>
        <Field label="신청자명" required>
          <input name="authorName" required className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="사번" required>
            <input name="employeeId" required className={inputClass} />
          </Field>
          <Field label="소속" required>
            <input name="department" required className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="연락처" required>
            <input name="contact" required className={inputClass} />
          </Field>
          <Field label="이메일" required>
            <input name="email" type="email" required className={inputClass} />
          </Field>
        </div>
        <Field label="모집 인원" required>
          <input
            name="recruitCount"
            type="number"
            min={1}
            max={10}
            defaultValue={2}
            required
            className={inputClass}
          />
        </Field>
        <Field label="모집 내용" required>
          <textarea
            name="content"
            required
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="어떤 팀원을 찾고 있는지 작성해주세요."
          />
        </Field>
        <Field label="관리용 PIN (4~6자리 숫자)" required>
          <input
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]{4,6}"
            minLength={4}
            maxLength={6}
            required
            title="4~6자리 숫자를 입력해주세요"
            className={inputClass}
            placeholder="예: 0411"
          />
        </Field>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <p className="text-xs leading-relaxed text-[#8b7db8]">
          사번당 1개의 모집 글만 작성할 수 있습니다. PIN은 본인 글 관리 및 신청자 수락에 사용됩니다.
        </p>
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#6340d8] py-3.5 text-sm font-semibold text-white"
        >
          글 등록하기
        </button>
      </form>
    </ModalShell>
  )
}

export function ApplyModal({
  postNickname,
  onClose,
  onSubmit,
}: {
  postNickname: string
  onClose: () => void
  onSubmit: (form: FormData) => void
}) {
  return (
    <ModalShell title={`${postNickname} 팀 신청`} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(new FormData(e.currentTarget))
        }}
      >
        <Field label="닉네임" required>
          <input name="nickname" required className={inputClass} placeholder="익명으로 표시될 닉네임" />
        </Field>
        <Field label="신청자명" required>
          <input name="applicantName" required className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="사번" required>
            <input name="employeeId" required className={inputClass} />
          </Field>
          <Field label="소속" required>
            <input name="department" required className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="연락처" required>
            <input name="contact" required className={inputClass} />
          </Field>
          <Field label="이메일" required>
            <input name="email" type="email" required className={inputClass} />
          </Field>
        </div>
        <Field label="신청 내용" required>
          <textarea
            name="content"
            required
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="자기소개 및 참여 동기를 작성해주세요."
          />
        </Field>
        <p className="text-xs leading-relaxed text-[#8b7db8]">
          작성자가 수락하기 전까지 닉네임과 신청 내용만 공개됩니다.
        </p>
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#6340d8] py-3.5 text-sm font-semibold text-white"
        >
          신청하기
        </button>
      </form>
    </ModalShell>
  )
}

import type { AuthorApplicationView } from "@/lib/apply/types"

export function ManageModal({
  onClose,
  onVerify,
  applicants,
  remainingSlots,
  onAccept,
}: {
  onClose: () => void
  onVerify: (employeeId: string, pin: string) => void
  applicants: AuthorApplicationView[] | null
  remainingSlots: number | null
  onAccept: (applicationId: string) => void
}) {
  const [employeeId, setEmployeeId] = useState("")
  const [pin, setPin] = useState("")

  return (
    <ModalShell title="내 글 관리" onClose={onClose}>
      {!applicants ? (
        <div className="space-y-4">
          <Field label="사번" required>
            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="관리용 PIN" required>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]{4,6}"
              minLength={4}
              maxLength={6}
              title="4~6자리 숫자를 입력해주세요"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={inputClass}
              placeholder="예: 0411"
            />
          </Field>
          <button
            type="button"
            onClick={() => onVerify(employeeId, pin)}
            className="w-full rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#6340d8] py-3.5 text-sm font-semibold text-white"
          >
            확인
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {remainingSlots !== null ? (
            <p className="rounded-xl border border-[#e8ddff] bg-[#faf8ff] px-4 py-3 text-sm font-medium text-[#5b4f8a]">
              {remainingSlots > 0 ? `${remainingSlots}명 모집 중` : "모집 완료"}
            </p>
          ) : null}

          {applicants.filter((a) => a.status === "accepted").length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#2d2458]">매칭된 팀원</h3>
              {applicants
                .filter((a) => a.status === "accepted")
                .map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-[#c4b5fd] bg-[#f5f0ff] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-[#2d2458]">
                        {a.applicantName ?? a.nickname}
                      </h4>
                      <span className="text-xs font-medium text-[#7c5cff]">매칭 완료</span>
                    </div>
                    <dl className="mt-3 space-y-1.5 text-sm text-[#4a4270]">
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 text-[#8b7db8]">닉네임</dt>
                        <dd>{a.nickname}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 text-[#8b7db8]">사번</dt>
                        <dd>{a.employeeId}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 text-[#8b7db8]">소속</dt>
                        <dd>{a.department}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 text-[#8b7db8]">연락처</dt>
                        <dd>{a.contact}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 text-[#8b7db8]">이메일</dt>
                        <dd className="break-all">{a.email}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 border-t border-[#e0d4ff] pt-3 text-sm leading-relaxed text-[#4a4270]">
                      {a.content}
                    </p>
                  </div>
                ))}
            </div>
          ) : null}

          {applicants.filter((a) => a.status === "pending").length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#2d2458]">신청 대기</h3>
              {applicants
                .filter((a) => a.status === "pending")
                .map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-[#e8ddff] bg-[#faf8ff] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-[#2d2458]">{a.nickname}</h4>
                      <span className="text-xs text-[#8b7db8]">대기 중</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#4a4270]">{a.content}</p>
                    <button
                      type="button"
                      onClick={() => onAccept(a.id)}
                      className="mt-3 rounded-lg bg-[#7c5cff] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      수락하기
                    </button>
                  </div>
                ))}
            </div>
          ) : applicants.length === 0 ? (
            <p className="text-sm text-[#8b7db8]">아직 신청자가 없습니다.</p>
          ) : null}
        </div>
      )}
    </ModalShell>
  )
}

export function TeamApplyModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="팀 신청 안내" onClose={onClose}>
      <div className="space-y-6">
        <a
          href="/apply/team-application-form.docx"
          download="양식_2026년 kt is WI 제로톤 참가신청서.docx"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#7c3aed] bg-[#f5f3ff] px-5 py-3.5 text-base font-semibold text-[#7c3aed] transition-colors hover:bg-[#ede9fe]"
        >
          신청서 양식 다운로드
        </a>
        <p className="text-center text-base leading-relaxed text-[#4a4270] md:text-lg">
          첨부 신청서를 작성해{" "}
          <span className="font-semibold text-[#7c3aed]">9.21.(월)</span> 까지
          아래 메일로 보내주세요!
        </p>
        <a
          href="mailto:minj.kang@kt.com"
          className="block rounded-xl bg-[#faf8ff] px-5 py-4 text-center text-base font-medium text-[#2d2458] transition-colors hover:bg-[#f3edff] md:text-lg"
        >
          ○ minj.kang@kt.com
        </a>
      </div>
    </ModalShell>
  )
}
