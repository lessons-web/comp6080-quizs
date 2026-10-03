import { Link } from 'react-router-dom'

import type { TopicId } from '../../../types/content'

type TopicIconName = TopicId
function TopicIcon({ name, className }: { name: TopicIconName; className: string }) {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  }
  switch (name) {
    case 'html':
      return (
        <svg {...common}>
          <path d="m8 3-5 9 5 9" />
          <path d="m16 3 5 9-5 9" />
        </svg>
      )
    case 'css':
      return (
        <svg {...common}>
          <path d="M4 4h16l-2 14-6 2-6-2-2-14Z" />
          <path d="M8 8h8l-1 6H8Z" />
          <path d="M9 18 8 16h8l-1 2-3 1-3-1Z" />
        </svg>
      )
    case 'javascript':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h3a2 2 0 0 1 0 4H9" />
          <path d="M15 9h2v4" />
          <path d="M15 15h1v2" />
        </svg>
      )
    case 'react':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      )
    case 'nodejs':
      return (
        <svg {...common}>
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
          <path d="M12 8v8" />
          <path d="M9 11h6M9 14h4" />
        </svg>
      )
  }
}

export interface TopicCardProps {
  topic: TopicId
  label: string
  description: string
  accent: string
  pointCount: number
}

export function TopicCard({ topic, label, description, accent, pointCount }: TopicCardProps) {
  return (
    <Link
      to={`/knowledge/${topic}`}
      className="group relative flex h-[160px] flex-col overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-sm`}>
        <TopicIcon name={topic} className="h-5 w-5" />
      </div>
      <div className="mt-3 text-base font-semibold text-slate-900 group-hover:text-slate-950">
        {label}
      </div>
      <div className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
        {description}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{pointCount} 篇</span>
      </div>
    </Link>
  )
}
