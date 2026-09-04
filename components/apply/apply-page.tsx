"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ApplyHeader } from "@/components/apply/apply-header"
import { ApplyHeroPanels, ApplyUsageGuide } from "@/components/apply/apply-hero-panels"
import {
  ApplyModal,
  CreatePostModal,
  ManageModal,
} from "@/components/apply/apply-modals"
import { PostCard } from "@/components/apply/post-card"
import {
  acceptApplication,
  applyToPost,
  createPost,
  listApplicationsForAuthor,
  listPublicPosts,
} from "@/lib/apply/mock-store"
import type { AuthorApplicationView, PublicPost } from "@/lib/apply/types"
import { Search } from "lucide-react"

export function ApplyPage() {
  const [posts, setPosts] = useState<PublicPost[]>([])
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [applyTarget, setApplyTarget] = useState<PublicPost | null>(null)
  const [manageTarget, setManageTarget] = useState<PublicPost | null>(null)
  const [manageAuth, setManageAuth] = useState<{ employeeId: string; pin: string } | null>(null)
  const [applicants, setApplicants] = useState<AuthorApplicationView[] | null>(null)
  const [remainingSlots, setRemainingSlots] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setPosts(listPublicPosts())
  }, [])

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (p) =>
        p.nickname.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    )
  }, [posts, search])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  function closeManage() {
    setManageTarget(null)
    setManageAuth(null)
    setApplicants(null)
    setRemainingSlots(null)
  }

  function loadManageView(postId: string, employeeId: string, pin: string) {
    const list = listApplicationsForAuthor(postId, employeeId, pin)
    if (!list) return false

    const post = listPublicPosts().find((p) => p.id === postId)
    setManageAuth({ employeeId, pin })
    setApplicants(list)
    setRemainingSlots(post ? post.recruitCount - post.acceptedCount : null)
    return true
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8] text-[#1e1b4b]">
      <ApplyHeader />

      <main className="site-shell py-8 md:py-10">
        <ApplyHeroPanels onCreatePost={() => setShowCreate(true)} />

        <section className="mt-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold text-[#1e1b4b] md:text-3xl">
              개인 참가자 둘러보기
            </h2>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <label className="relative flex-1 sm:min-w-[280px] lg:min-w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="닉네임 또는 키워드 검색"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3 pl-10 pr-4 text-base text-[#1e1b4b] outline-none focus:border-[#7c3aed]"
                />
              </label>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="shrink-0 rounded-xl bg-[#7c3aed] px-6 py-3 text-base font-semibold text-white shadow-[0_4px_16px_rgba(124,58,237,0.25)]"
              >
                + 참가 글 작성
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[#d8d8e4] bg-white px-6 py-16 text-center">
                <p className="text-lg font-semibold text-[#475569]">
                  {search ? "검색 결과가 없습니다." : "아직 등록된 글이 없습니다."}
                </p>
                <p className="mt-2 text-sm text-[#94a3b8]">
                  {search ? "다른 키워드로 검색해보세요." : "첫 번째 참가 글을 작성해보세요."}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onApply={setApplyTarget}
                  onManage={setManageTarget}
                />
              ))
            )}
          </div>
        </section>

        <div className="mt-12">
          <ApplyUsageGuide />
        </div>
      </main>

      {showCreate ? (
        <CreatePostModal
          onClose={() => setShowCreate(false)}
          onSubmit={(form) => {
            const result = createPost({
              nickname: String(form.get("nickname") ?? ""),
              authorName: String(form.get("authorName") ?? ""),
              employeeId: String(form.get("employeeId") ?? ""),
              department: String(form.get("department") ?? ""),
              contact: String(form.get("contact") ?? ""),
              email: String(form.get("email") ?? ""),
              content: String(form.get("content") ?? ""),
              recruitCount: Number(form.get("recruitCount") ?? 1),
              pin: String(form.get("pin") ?? ""),
            })
            if (!result.ok) {
              setToast(result.error)
              return
            }
            setShowCreate(false)
            refresh()
            setToast("참가 글이 등록되었습니다.")
          }}
        />
      ) : null}

      {applyTarget ? (
        <ApplyModal
          postNickname={applyTarget.nickname}
          onClose={() => setApplyTarget(null)}
          onSubmit={(form) => {
            const result = applyToPost(applyTarget.id, {
              nickname: String(form.get("nickname") ?? ""),
              applicantName: String(form.get("applicantName") ?? ""),
              employeeId: String(form.get("employeeId") ?? ""),
              department: String(form.get("department") ?? ""),
              contact: String(form.get("contact") ?? ""),
              email: String(form.get("email") ?? ""),
              content: String(form.get("content") ?? ""),
            })
            if (!result.ok) {
              setToast(result.error)
              return
            }
            setApplyTarget(null)
            setToast("신청이 완료되었습니다. 작성자 수락을 기다려주세요.")
          }}
        />
      ) : null}

      {manageTarget ? (
        <ManageModal
          onClose={closeManage}
          applicants={applicants}
          remainingSlots={remainingSlots}
          onVerify={(employeeId, pin) => {
            if (!loadManageView(manageTarget.id, employeeId, pin)) {
              setToast("사번 또는 PIN이 올바르지 않습니다.")
            }
          }}
          onAccept={(applicationId) => {
            if (!manageAuth) return
            const result = acceptApplication(
              manageTarget.id,
              applicationId,
              manageAuth.employeeId,
              manageAuth.pin,
            )
            if (!result.ok) {
              setToast(result.error)
              return
            }
            refresh()
            loadManageView(manageTarget.id, manageAuth.employeeId, manageAuth.pin)
            setToast("신청을 수락했습니다. 매칭된 팀원 정보를 확인하세요.")
          }}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl border border-[#e2e8f0] bg-white px-5 py-3 text-sm font-medium text-[#1e1b4b] shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  )
}
