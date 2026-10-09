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
      ? 'border-blue-600 bg-blue-50 text-blue-700'
      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700',
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
