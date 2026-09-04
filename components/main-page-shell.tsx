"use client"

import { ApplyModalProvider } from "@/components/apply/apply-modal-context"
import type { ReactNode } from "react"

export function MainPageShell({ children }: { children: ReactNode }) {
  return <ApplyModalProvider>{children}</ApplyModalProvider>
}
