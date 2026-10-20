'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const weeks = [1, 2, 3, 4]

type WeekTabsProps = {
  basePath: 'knowledge' | 'practice' | 'mock-exams'
}

function tabClassName(isActive: boolean) {
  return [
    'rounded-full border px-3 py-1.5 text-sm font-medium transition',
    isActive
      ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)]'
      : 'border-[var(--paper-border)] bg-[var(--paper-surface)] text-slate-600 hover:border-[var(--brand-200)] hover:text-[var(--brand-700)]',
  ].join(' ')
}

export function WeekTabs({ basePath }: WeekTabsProps) {
  const pathname = usePathname() || ''
  return (
    <nav aria-label="周次切换" className="flex flex-wrap gap-2">
      {weeks.map((week) => (
        <Link
          key={week}
          className={tabClassName(pathname.includes(`/week-${week}`))}
          href={`/${basePath}/week-${week}`}
        >
          {`Week ${week}`}
        </Link>
      ))}
    </nav>
  )
}
