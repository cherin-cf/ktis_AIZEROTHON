"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Download, Mail, X } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const APPLY_EMAIL = "minj.kang@kt.com"
const APPLY_FORM_FILE = "/apply/team-application-form.docx"
const APPLY_FORM_DOWNLOAD_NAME = "양식_2026년 kt is WI 제로톤 참가신청서.docx"

type ApplyModalContextValue = {
  openApplyModal: () => void
  closeApplyModal: () => void
}

const ApplyModalContext = createContext<ApplyModalContextValue | null>(null)

export function useApplyModal() {
  const ctx = useContext(ApplyModalContext)
  if (!ctx) {
    throw new Error("useApplyModal must be used within ApplyModalProvider")
  }
  return ctx
}

function ParticipateApplyModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="apply-modal"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="닫기"
            className="absolute inset-0 bg-[#1a1030]/55 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            className="relative z-[1] w-full max-w-lg overflow-hidden rounded-2xl border border-[#d8c9ff]/80 bg-gradient-to-b from-[#f3eefb] via-[#ebe4f8] to-[#e4daf5] shadow-[0_0_64px_rgba(167,139,250,0.28)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4b5fd]/80 to-transparent"
            />

            <div className="flex items-start justify-between gap-4 border-b border-[#d8c9ff]/70 px-6 py-5 md:px-7 md:py-6">
              <div>
                <p className="font-mono text-xs font-semibold tracking-[0.22em] text-[#7c6cf0] md:text-sm">
                  PARTICIPATE
                </p>
                <h2
                  id="apply-modal-title"
                  className="mt-2 text-2xl font-bold text-[#2a1f45] md:text-3xl"
                >
                  참가 신청 방법
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c4b5fd]/70 bg-white/50 text-[#6d4aff] transition-colors hover:border-[#a78bfa] hover:bg-white/80 hover:text-[#5530c8]"
                aria-label="팝업 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6 md:space-y-6 md:px-7 md:py-7">
              <ol className="space-y-4 text-lg leading-relaxed text-[#3b2d5c]/90 md:text-xl">
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c4b5fd]/80 bg-white/70 font-mono text-sm font-bold text-[#6d4aff]">
                    1
                  </span>
                  <span className="pt-0.5">
                    아래 참가 신청서 다운로드 버튼 클릭
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c4b5fd]/80 bg-white/70 font-mono text-sm font-bold text-[#6d4aff]">
                    2
                  </span>
                  <span className="pt-0.5">작성 후 이메일 제출</span>
                </li>
              </ol>

              <div className="rounded-xl border border-[#d8c9ff]/80 bg-white/55 p-5 text-center md:p-6">
                <div className="flex items-center justify-center gap-2 text-sm text-[#5b4a7a]/80 md:text-base">
                  <Mail className="h-4 w-4 shrink-0 text-[#7c6cf0]" />
                  <span>제출 이메일</span>
                </div>
                <a
                  href={`mailto:${APPLY_EMAIL}`}
                  className="mt-2 block text-lg font-semibold text-[#6d4aff] transition-colors hover:text-[#5530c8] md:text-xl"
                >
                  {APPLY_EMAIL}
                </a>
              </div>

              <motion.a
                href={APPLY_FORM_FILE}
                download={APPLY_FORM_DOWNLOAD_NAME}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#7c6cf0] to-[#6d4aff] px-5 py-4 text-lg font-semibold text-white shadow-[0_0_24px_rgba(124,108,240,0.35)] transition-colors hover:from-[#8b7cf5] hover:to-[#7c5cff] md:text-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-5 w-5" />
                참가 신청서 다운로드
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function ApplyModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openApplyModal = useCallback(() => setOpen(true), [])
  const closeApplyModal = useCallback(() => setOpen(false), [])

  return (
    <ApplyModalContext.Provider value={{ openApplyModal, closeApplyModal }}>
      {children}
      <ParticipateApplyModal open={open} onClose={closeApplyModal} />
    </ApplyModalContext.Provider>
  )
}
