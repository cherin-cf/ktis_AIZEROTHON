/** Shared apply-form download — same file + name from every entry point */
export const APPLY_FORM_FILE = "/apply/team-application-form.docx"
export const APPLY_FORM_DOWNLOAD_NAME =
  "양식_2026년 kt is WI 제로톤 참가신청서.docx"

/** Force the download filename (browsers often ignore `download` with Korean names). */
export async function downloadApplyForm() {
  const res = await fetch(APPLY_FORM_FILE)
  if (!res.ok) throw new Error("Failed to fetch apply form")
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = APPLY_FORM_DOWNLOAD_NAME
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
