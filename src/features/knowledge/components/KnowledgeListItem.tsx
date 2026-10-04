import type { Difficulty, KnowledgePointMeta, WeekTag } from '../../../types/content'

export interface KnowledgeListItemProps {
  meta: KnowledgePointMeta
  active: boolean
  highlight?: string
  onClick: () => void
}

function formatWeekTag(tag: WeekTag) {
  const m = /week-(\d+)/i.exec(tag)
  return m ? `Week ${m[1]}` : tag
}

const DIFF_CLASS: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: '简单', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { label: '中等', cls: 'bg-amber-50 text-amber-600' },
  hard: { label: '困难', cls: 'bg-rose-50 text-rose-600' },
}

function highlightText(text: string, kw: string) {
  if (!kw) return text
  const idx = text.toLowerCase().indexOf(kw.toLowerCase())
  if (idx < 0) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + kw.length)
  const after = text.slice(idx + kw.length)
  return (
    <>
      {before}
      <mark className="rounded bg-yellow-200/70 px-0.5 text-slate-900">{match}</mark>
      {after}
    </>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function KnowledgeListItem({ meta, active, highlight, onClick }: KnowledgeListItemProps) {
  const diff = DIFF_CLASS[meta.difficulty]
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'block w-full cursor-pointer border-b border-slate-50 px-3 py-2.5 text-left transition last:border-none',
        active
          ? 'bg-blue-50 ring-1 ring-blue-200 border-l-2 border-blue-500'
          : 'hover:bg-slate-50',
      ].join(' ')}
    >
      <div className="text-sm font-medium text-slate-800">
        {highlightText(meta.title, highlight ?? '')}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
          {meta.category}
        </span>
        <span className={`rounded px-1.5 py-0.5 font-medium ${diff.cls}`}>
          {diff.label}
        </span>
        {meta.tags.map((t) => (
          <span
            key={t}
            className="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-600"
          >
            {formatWeekTag(t)}
          </span>
        ))}
        <span className="ml-auto text-slate-400">{formatDate(meta.createdAt)}</span>
      </div>
    </button>
  )
}
