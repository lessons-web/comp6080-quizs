import type { ReactNode } from 'react'

interface ContentLoadingProps {
  rows?: number
  children?: ReactNode
  className?: string
}

export function ContentLoading({ rows = 8, children, className = '' }: ContentLoadingProps) {
  return (
    <div className={['w-full space-y-2', className].filter(Boolean).join(' ')}>
      <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-slate-100 last:w-3/4"
          />
        ))}
      </div>
      {children}
    </div>
  )
}
