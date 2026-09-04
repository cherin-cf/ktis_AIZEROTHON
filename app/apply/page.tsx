import { ApplyPage } from "@/components/apply/apply-page"
import { redirect } from "next/navigation"

/** 기존 참가 신청 페이지 — 잠정 미사용 (코드 유지, 접근 차단) */
const APPLY_PAGE_ENABLED = false

export const metadata = {
  title: "참가 신청 — kt is WI ZEROTHON",
  description: "팀원 매칭 및 참가 신청",
}

export default function Page() {
  if (!APPLY_PAGE_ENABLED) {
    redirect("/")
  }

  return <ApplyPage />
}
