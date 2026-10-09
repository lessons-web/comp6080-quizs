'use client'

import Link from 'next/link'

import type { TopicId } from '../../../types/content'

type TopicIconName = TopicId
function TopicIcon({ name, className }: { name: TopicIconName; className: string }) {
  switch (name) {
    case 'html':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M5 3h14l-1.2 13.5L12 18.5 6.2 16.5 5 3Zm2.2 2L6.3 15l5.7 1.6 5.7-1.6L16.8 5H7.2Z" />
          <path d="M8.5 7h5l-.4 4.5-2.1.6-2.1-.6-.1-1.5h2.8l.1-1H8.5Z" fill="#fff" />
          <path d="M15.5 7h-2.4v1h1.2l-.2 2.5L12 11.3V13l3.6-1 .1-1.8.8-3.2Z" fill="#fff" />
        </svg>
      )
    case 'css':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M5 3h14l-1.3 14.3L12 19l-5.7-1.7L5 3Zm2.2 2L6.3 15.1 12 16.7l5.7-1.6L16.8 5H7.2Z" />
          <path d="M8.5 7h5l-.3 3L12 10.6l-1.2-.6-.1-.8h2.1v-1H8.5l.2-.9Z" fill="#fff" />
          <path d="M15.5 7h-2.4V8h1l-.2 1.8L12 10.7l-1.9-.9-.1.8L10.2 12l1.8.9V14l-3.6-1-.2-2h1v-1h-.9l.2-3h6.8l-.6 2.3L13 11.2 14.3 10l.3-1H13V8h2.5V7Z" fill="#fff" />
        </svg>
      )
    case 'javascript':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" opacity="0.15" />
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h3a2 2 0 0 1 0 4H9v-1h3a1 1 0 0 0 0-2H9" />
          <path d="M15 9h2v4a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1" />
          <path d="M14.5 15h1v2" />
        </svg>
      )
    case 'react':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="2.2" fill="#fff" />
          <g fill="none" stroke="#fff" strokeWidth="1.6">
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          </g>
        </svg>
      )
    case 'nodejs':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" fill="currentColor" opacity="0.15" />
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
          <path d="M12 8v8" fill="#fff" />
          <path d="M9 11h6M9 14h4" />
        </svg>
      )
  }
}

export interface TopicCardProps {
  topic: TopicId
  label: string
  description: string
  pointCount: number
}

function topicBoxClasses(topic: TopicId): string {
  switch (topic) {
    case 'html':
      return 'bg-gradient-to-br from-orange-500 to-red-500'
    case 'css':
      return 'bg-gradient-to-br from-sky-500 to-blue-600'
    case 'javascript':
      return 'bg-gradient-to-br from-yellow-400 to-amber-500'
    case 'react':
      return 'bg-gradient-to-br from-cyan-400 to-sky-500'
    case 'nodejs':
      return 'bg-gradient-to-br from-emerald-500 to-green-600'
  }
}

export function TopicCard({ topic, label, description, pointCount }: TopicCardProps) {
  const boxCls = topicBoxClasses(topic)
  return (
    <Link
      href={`/knowledge/${topic}`}
      className="group relative flex h-[160px] flex-col overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm ${boxCls}`}>
        <TopicIcon name={topic} className="h-5 w-5" />
      </div>
      <div className="mt-3 text-base font-semibold text-slate-900 group-hover:text-slate-950">
        {label}
      </div>
      <div className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
        {description}
      </div>
      <div className="mt-auto flex items-center justify-end">
        <span className="text-xs font-medium text-slate-500">{pointCount} 篇</span>
      </div>
    </Link>
  )
}
