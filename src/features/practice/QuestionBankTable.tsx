import type { Difficulty, PracticeQuestion, TopicId } from '../../types/content'
import { TOPIC_META } from '../../types/content'

export interface QuestionBankTableProps {
  questions: PracticeQuestion[]
  highlight?: string
  onSelect?: (id: string) => void
  activeId?: string | null
}

const DIFF_META: Record<Difficulty, { label: string; dot: string; text: string; bg: string; ring: string }> = {
  easy: {
    label: '简单',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    ring: 'ring-1 ring-emerald-100',
  },
  medium: {
    label: '中等',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    ring: 'ring-1 ring-amber-100',
  },
  hard: {
    label: '困难',
    dot: 'bg-rose-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    ring: 'ring-1 ring-rose-100',
  },
}

const TOPIC_CHIP: Record<TopicId, string> = {
  html: 'bg-orange-50 text-orange-700 ring-orange-100',
  css: 'bg-sky-50 text-sky-700 ring-sky-100',
  javascript: 'bg-yellow-50 text-yellow-800 ring-yellow-100',
  react: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  nodejs: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function highlightFragment(text: string, kw: string) {
  if (!kw) return text
  const low = text.toLowerCase()
  const klow = kw.toLowerCase()
  const idx = low.indexOf(klow)
  if (idx < 0) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + kw.length)
  const after = text.slice(idx + kw.length)
  return (
    <>
      {before}
      <mark className="rounded bg-yellow-200/80 px-0.5 text-slate-900 not-italic">{match}</mark>
      {after}
    </>
  )
}

export function QuestionBankTable({
  questions,
  highlight,
  onSelect,
  activeId,
}: QuestionBankTableProps) {
  const kw = highlight ?? ''

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_1px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto pb-6">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              <th scope="col" className="px-5 py-3.5 w-24 shrink-0">
                编号
              </th>
              <th scope="col" className="px-4 py-3.5 w-28 shrink-0">
                分类
              </th>
              <th scope="col" className="px-4 py-3.5 min-w-[38%]">
                题目
              </th>
              <th scope="col" className="px-4 py-3.5 w-28 shrink-0">
                难度
              </th>
              <th scope="col" className="px-4 py-3.5 min-w-[26%]">
                标签
              </th>
              <th scope="col" className="px-4 py-3.5 w-32 shrink-0 text-right">
                发布时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13.5px]">
            {questions.map((q) => {
              const diff = DIFF_META[q.difficulty]
              const topicChipCls = TOPIC_CHIP[q.topic]
              const topicMeta = TOPIC_META[q.topic]
              const isActive = activeId === q.id

              return (
                <tr
                  key={q.id}
                  onClick={() => onSelect?.(q.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect?.(q.id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  className={[
                    'group cursor-pointer transition-colors',
                    isActive
                      ? 'bg-blue-50/70 hover:bg-blue-50'
                      : 'hover:bg-slate-50/80',
                  ].join(' ')}
                >
                  <td className="px-5 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap rounded-md bg-slate-900/5 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-tight text-slate-600 ring-1 ring-slate-900/5">
                        {q.id}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ${topicChipCls}`}
                    >
                      {topicMeta.label}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <p className="line-clamp-2 leading-snug font-semibold tracking-tight text-slate-900 group-hover:text-slate-950">
                      {highlightFragment(q.question, kw)}
                    </p>
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${diff.bg} ${diff.text} ${diff.ring}`}
                    >
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${diff.dot}`} />
                      {diff.label}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-middle">
                    {q.tags.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {q.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/80"
                          >
                            # {highlightFragment(t, kw)}
                          </span>
                        ))}
                        {q.tags.length > 3 ? (
                          <span className="text-[11px] font-medium text-slate-400">
                            +{q.tags.length - 3}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-[11.5px] text-slate-300">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right align-middle">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11.5px] text-slate-400">
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3 shrink-0">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 4.75A1.75 1.75 0 0 1 4.75 3h6.5A1.75 1.75 0 0 1 13 4.75v6.5A1.75 1.75 0 0 1 11.25 13h-6.5A1.75 1.75 0 0 1 3 11.25v-6.5Z"
                        />
                        <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M3 6.25h10M5.5 3v3.25m5-3.25v3.25" />
                      </svg>
                      {formatDate(q.createdAt)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
