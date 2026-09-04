import { assignUniqueCharacterIds, pickCharacterIdExcluding } from "@/lib/apply/characters"
import type {
  ApplyInput,
  AuthorApplicationView,
  CreatePostInput,
  PostApplication,
  PublicPost,
  RecruitmentPost,
} from "@/lib/apply/types"

const STORAGE_KEY = "wi-zerothon-apply-v3"

type StoreData = {
  posts: RecruitmentPost[]
  applications: PostApplication[]
}

function load(): StoreData {
  if (typeof window === "undefined") {
    return { posts: [], applications: [] }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { posts: [], applications: [] }
    const data = JSON.parse(raw) as StoreData

    if (assignUniqueCharacterIds(data.posts)) {
      save(data)
    }

    return data
  } catch {
    return { posts: [], applications: [] }
  }
}

function save(data: StoreData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function listPublicPosts(): PublicPost[] {
  const { posts } = load()
  return posts
    .map(({ pin: _pin, authorName: _a, employeeId: _e, department: _d, contact: _c, email: _m, ...rest }) => rest)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getPost(postId: string): RecruitmentPost | null {
  return load().posts.find((p) => p.id === postId) ?? null
}

export function getPublicPost(postId: string): PublicPost | null {
  const post = getPost(postId)
  if (!post) return null
  const { pin: _pin, authorName: _a, employeeId: _e, department: _d, contact: _c, email: _m, ...rest } = post
  return rest
}

export function createPost(input: CreatePostInput): { ok: true; post: PublicPost } | { ok: false; error: string } {
  const data = load()

  if (data.posts.some((p) => p.employeeId === input.employeeId)) {
    return { ok: false, error: "사번당 1개의 모집 글만 작성할 수 있습니다." }
  }

  if (!/^[0-9]{4,6}$/.test(input.pin)) {
    return { ok: false, error: "관리용 PIN은 4~6자리 숫자로 입력해주세요." }
  }

  const usedCharacterIds = data.posts.map((p) => p.characterId)

  const post: RecruitmentPost = {
    id: uid(),
    nickname: input.nickname.trim(),
    authorName: input.authorName.trim(),
    employeeId: input.employeeId.trim(),
    department: input.department.trim(),
    contact: input.contact.trim(),
    email: input.email.trim(),
    content: input.content.trim(),
    recruitCount: input.recruitCount,
    acceptedCount: 0,
    characterId: pickCharacterIdExcluding(usedCharacterIds),
    pin: input.pin,
    createdAt: new Date().toISOString(),
  }

  data.posts.unshift(post)
  save(data)

  const { pin: _pin, authorName: _a, employeeId: _e, department: _d, contact: _c, email: _m, ...rest } = post
  return { ok: true, post: rest }
}

export function applyToPost(
  postId: string,
  input: ApplyInput,
): { ok: true } | { ok: false; error: string } {
  const data = load()
  const post = data.posts.find((p) => p.id === postId)

  if (!post) return { ok: false, error: "모집 글을 찾을 수 없습니다." }

  const remaining = post.recruitCount - post.acceptedCount
  if (remaining <= 0) return { ok: false, error: "이미 모집이 완료된 글입니다." }

  if (post.employeeId === input.employeeId) {
    return { ok: false, error: "본인이 작성한 글에는 신청할 수 없습니다." }
  }

  const duplicate = data.applications.some(
    (a) => a.postId === postId && a.employeeId === input.employeeId,
  )
  if (duplicate) return { ok: false, error: "이미 이 글에 신청하셨습니다." }

  const application: PostApplication = {
    id: uid(),
    postId,
    nickname: input.nickname.trim(),
    applicantName: input.applicantName.trim(),
    employeeId: input.employeeId.trim(),
    department: input.department.trim(),
    contact: input.contact.trim(),
    email: input.email.trim(),
    content: input.content.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  data.applications.unshift(application)
  save(data)
  return { ok: true }
}

export function verifyAuthor(employeeId: string, pin: string): RecruitmentPost | null {
  const data = load()
  return data.posts.find((p) => p.employeeId === employeeId && p.pin === pin) ?? null
}

export function listApplicationsForAuthor(
  postId: string,
  employeeId: string,
  pin: string,
): AuthorApplicationView[] | null {
  const data = load()
  const post = data.posts.find((p) => p.employeeId === employeeId && p.pin === pin)
  if (!post || post.id !== postId) return null

  return data.applications
    .filter((a) => a.postId === postId)
    .map((a) => {
      if (a.status === "accepted") {
        return {
          id: a.id,
          nickname: a.nickname,
          content: a.content,
          status: a.status,
          createdAt: a.createdAt,
          applicantName: a.applicantName,
          employeeId: a.employeeId,
          department: a.department,
          contact: a.contact,
          email: a.email,
        }
      }

      return {
        id: a.id,
        nickname: a.nickname,
        content: a.content,
        status: a.status,
        createdAt: a.createdAt,
      }
    })
}

export function acceptApplication(
  postId: string,
  applicationId: string,
  employeeId: string,
  pin: string,
): { ok: true; match?: { author: RecruitmentPost; applicant: PostApplication } } | { ok: false; error: string } {
  const data = load()
  const post = data.posts.find((p) => p.employeeId === employeeId && p.pin === pin)
  if (!post || post.id !== postId) return { ok: false, error: "작성자 인증에 실패했습니다." }

  const remaining = post.recruitCount - post.acceptedCount
  if (remaining <= 0) return { ok: false, error: "모집 인원이 이미 찼습니다." }

  const application = data.applications.find((a) => a.id === applicationId && a.postId === postId)
  if (!application) return { ok: false, error: "신청을 찾을 수 없습니다." }
  if (application.status !== "pending") return { ok: false, error: "이미 처리된 신청입니다." }

  application.status = "accepted"
  post.acceptedCount += 1
  save(data)

  return { ok: true, match: { author: { ...post }, applicant: { ...application } } }
}

export function getApplicationWithIdentity(
  applicationId: string,
  viewerEmployeeId: string,
  viewerPin: string,
): PostApplication | null {
  const data = load()
  const application = data.applications.find((a) => a.id === applicationId)
  if (!application || application.status !== "accepted") return null

  const post = data.posts.find((p) => p.id === application.postId)
  if (!post) return null

  const isAuthor = post.employeeId === viewerEmployeeId && post.pin === viewerPin
  const isApplicant = application.employeeId === viewerEmployeeId

  if (!isAuthor && !isApplicant) return null
  return application
}
