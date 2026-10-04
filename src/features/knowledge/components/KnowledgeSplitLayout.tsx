import type { ReactNode } from 'react'

export interface KnowledgeSplitLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function KnowledgeSplitLayout({ left, right }: KnowledgeSplitLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-6.5rem)] gap-4 px-4 py-3">
      {left}
      {right}
    </div>
  )
}
