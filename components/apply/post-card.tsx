"use client"

import { CharacterAvatar } from "@/components/apply/character-avatar"
import type { PublicPost } from "@/lib/apply/types"

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "방금 전"
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export function PostCard({
  post,
  onApply,
  onManage,
}: {
  post: PublicPost
  onApply: (post: PublicPost) => void
  onManage?: (post: PublicPost) => void
}) {
  const remaining = post.recruitCount - post.acceptedCount
  const isFull = remaining <= 0

  return (
    <article className="flex flex-col rounded-2xl border border-[#e8eaf0] bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:p-6">
      <div className="flex gap-4">
        <CharacterAvatar characterId={post.characterId} size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-lg font-bold text-[#1e1b4b] md:text-xl">
              {post.nickname}
            </h3>
            <span className="shrink-0 text-sm text-[#94a3b8]">{timeAgo(post.createdAt)}</span>
          </div>
          <p className="mt-2.5 line-clamp-3 text-base leading-relaxed text-[#475569] md:text-[1.05rem]">
            {post.content}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#f1f5f9] pt-4">
        <span
          className={`text-base font-semibold md:text-lg ${
            isFull ? "text-[#94a3b8]" : "text-[#7c3aed]"
          }`}
        >
          {isFull ? "모집 완료" : `${remaining}명 모집 중`}
        </span>
        <div className="flex gap-2">
          {onManage ? (
            <button
              type="button"
              onClick={() => onManage(post)}
              className="rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm font-medium text-[#64748b] hover:bg-[#f8fafc] md:text-base"
            >
              관리
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onApply(post)}
            disabled={isFull}
            className="rounded-lg border-2 border-[#7c3aed] px-5 py-2 text-sm font-semibold text-[#7c3aed] transition-colors hover:bg-[#7c3aed] hover:text-white disabled:cursor-not-allowed disabled:border-[#e2e8f0] disabled:text-[#cbd5e1] disabled:hover:bg-transparent md:text-base"
          >
            {isFull ? "모집 완료" : "신청하기"}
          </button>
        </div>
      </div>
    </article>
  )
}
