import { useEffect, useMemo, useState } from 'react'

import type { KnowledgePointMeta } from '../../../types/content'
import { KnowledgeListItem } from './KnowledgeListItem'

export interface KnowledgeListPanelProps {
  items: KnowledgePointMeta[]
  topicLabel: string
  activeId: string | null
  emptyHint?: string
  onSelect: (id: string) => void
}

export function KnowledgeListPanel({
  items,
  topicLabel,
  activeId,
  emptyHint,
  onSelect,
}: KnowledgeListPanelProps) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200)
    return () => clearTimeout(t)
  }, [query])

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return items
    return items.filter((m) => {
      const hay = [m.title, m.category, m.summary, m.tags.join(' ')]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [items, debounced])

  return (
    <div className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {topicLabel} 知识点
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {items.length} 项
          </span>
        </div>
        <div className="relative w-72 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="搜索标题 / 类别 / 标签"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 shrink-0 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-slate-400">
            {items.length === 0
              ? emptyHint ?? '暂无知识点，敬请期待。'
              : '暂无匹配的知识点'}
          </div>
        ) : (
          filtered.map((m) => (
            <KnowledgeListItem
              key={m.id}
              meta={m}
              active={activeId === m.id}
              highlight={debounced}
              onClick={() => onSelect(m.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
