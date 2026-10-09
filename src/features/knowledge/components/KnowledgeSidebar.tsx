'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import type { KnowledgePointMeta, TopicId } from '../../../types/content'
import { TOPIC_META } from '../../../types/content'
import { getKnowledgePointList } from '../../../lib/content/knowledge'
import { useAsyncContent } from '../../../lib/hooks/useAsyncContent'
import { KnowledgeListItem } from './KnowledgeListItem'

export interface KnowledgeSidebarProps {
  topic: TopicId
}

export function KnowledgeSidebar({ topic }: KnowledgeSidebarProps) {
  const router = useRouter()
  const pathname = usePathname() || ''

  const { data: list, loading: listLoading } = useAsyncContent(
    () => getKnowledgePointList(topic),
    [topic],
  )

  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    setQuery('')
    setDebounced('')
  }, [topic])

  const listData = list ?? []
  const activeKnowledgeId = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length < 3) return null
    return parts[2]
  }, [pathname])

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return listData
    return listData.filter((m) => {
      const hay = [m.title, m.category, m.summary, m.tags.join(' ')]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [listData, debounced])

  const items: KnowledgePointMeta[] = filtered
  const topicLabel = TOPIC_META[topic].label

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Link
          href="/knowledge"
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {topicLabel} · {listData.length} 项
        </div>
      </div>

      <div className="border-b border-slate-100 px-5 py-4">
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="搜索标题 / 类别 / 标签"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {listLoading && items.length === 0 ? (
          <div className="space-y-2 px-5 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            {listData.length === 0
              ? '暂无知识点，敬请期待。'
              : '暂无匹配的知识点'}
          </div>
        ) : (
          <div className="px-2 py-2">
            {items.map((m) => (
              <KnowledgeListItem
                key={m.id}
                meta={m}
                active={activeKnowledgeId === m.id}
                highlight={debounced}
                onClick={() => router.push(`/knowledge/${topic}/${m.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
