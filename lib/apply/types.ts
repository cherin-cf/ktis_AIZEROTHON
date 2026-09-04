export type ApplicationStatus = "pending" | "accepted" | "rejected"

export type RecruitmentPost = {
  id: string
  nickname: string
  authorName: string
  employeeId: string
  department: string
  contact: string
  email: string
  content: string
  recruitCount: number
  acceptedCount: number
  characterId: number
  pin: string
  createdAt: string
}

export type PostApplication = {
  id: string
  postId: string
  nickname: string
  applicantName: string
  employeeId: string
  department: string
  contact: string
  email: string
  content: string
  status: ApplicationStatus
  createdAt: string
}

export type CreatePostInput = {
  nickname: string
  authorName: string
  employeeId: string
  department: string
  contact: string
  email: string
  content: string
  recruitCount: number
  pin: string
}

export type ApplyInput = {
  nickname: string
  applicantName: string
  employeeId: string
  department: string
  contact: string
  email: string
  content: string
}

export type PublicPost = Pick<
  RecruitmentPost,
  | "id"
  | "nickname"
  | "content"
  | "recruitCount"
  | "acceptedCount"
  | "characterId"
  | "createdAt"
>

export type PublicApplication = Pick<
  PostApplication,
  "id" | "nickname" | "content" | "status" | "createdAt"
>

/** Author view — identity revealed only after acceptance */
export type AuthorApplicationView = PublicApplication & {
  applicantName?: string
  employeeId?: string
  department?: string
  contact?: string
  email?: string
}
