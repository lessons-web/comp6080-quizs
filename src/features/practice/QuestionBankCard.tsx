import type { Difficulty, PracticeQuestion, TopicId } from '../../types/content'
import { TOPIC_META } from '../../types/content'

export interface QuestionBankCardProps {
  question: PracticeQuestion
  highlight?: string
  onClick?: () => void
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

function formatWeek(w: string) {
  const m = /week-(\d+)/i.exec(w)
  return m ? `Week ${m[1]}` : w
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}-${day}`
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
      <mark className="rounded bg-yellow-200/80 px-0.5 text-slate-900 not-italic">
        {match}
      </mark>
      {after}
    </>
  )
}

const TOPIC_ACCENT: Record<TopicId, string> = {
  html: 'from-orange-400 to-red-500',
  css: 'from-sky-400 to-blue-600',
  javascript: 'from-yellow-400 to-amber-500',
  react: 'from-cyan-400 to-sky-500',
  nodejs: 'from-emerald-500 to-green-600',
}

const TOPIC_CHIP: Record<TopicId, string> = {
  html: 'bg-orange-50 text-orange-700 ring-orange-100',
  css: 'bg-sky-50 text-sky-700 ring-sky-100',
  javascript: 'bg-yellow-50 text-yellow-800 ring-yellow-100',
  react: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  nodejs: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

export function QuestionBankCard({ question, highlight, onClick }: QuestionBankCardProps) {
  const topicMeta = TOPIC_META[question.topic]
  const diff = DIFF_META[question.difficulty]
  const accent = TOPIC_ACCENT[question.topic]
  const topicChipCls = TOPIC_CHIP[question.topic]
  const kw = highlight ?? ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left',
        'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_1px_rgba(15,23,42,0.03)]',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_25px_-8px_rgba(15,23,42,0.12),0_4px_10px_-4px_rgba(15,23,42,0.08)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
      ].join(' ')}
    >
      <div
        aria-hidden="true"
        className={`absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b ${accent}`}
      />

      <div className="flex flex-col gap-3 pl-5 pr-5 pt-4 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md bg-slate-900/5 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-tight text-slate-600 ring-1 ring-slate-900/5">
            {question.id}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${topicChipCls}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br ${accent}`} />
            {topicMeta.label}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${diff.bg} ${diff.text} ${diff.ring}`}
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${diff.dot}`} />
              {diff.label}
            </span>
          </div>
        </div>

        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-slate-900 group-hover:text-slate-950">
          {highlightFragment(question.question, kw)}
        </h3>

        <p className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex max-w-full items-center rounded-lg bg-slate-100/70 px-2 py-1 text-[12px] font-medium text-slate-700 ring-1 ring-slate-200/60">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="mr-1 h-3 w-3 shrink-0 text-slate-500">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 2.25a2 2 0 0 0-2 2v1.5h4V4.25a2 2 0 0 0-2-2Zm-3.25 4.5v.634c0 .502-.198.983-.553 1.338L3.25 9.72v1.53a1.5 1.5 0 0 0 1.5 1.5h6.5a1.5 1.5 0 0 0 1.5-1.5V9.72l-.947-.998a1.886 1.886 0 0 1-.553-1.338V6.75h-8.75Z"
              />
            </svg>
            <span className="truncate">{highlightFragment(question.knowledgePoint, kw)}</span>
          </span>
        </p>

        {question.tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {question.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/80"
              >
                # {highlightFragment(t, kw)}
              </span>
            ))}
            {question.tags.length > 3 ? (
              <span className="text-[11px] text-slate-400">+{question.tags.length - 3}</span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-1 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
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
            {question.weeks.map(formatWeek).join(' · ')}
          </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
              <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 4.75V8l2.25 1.25" />
            </svg>
            {formatDate(question.createdAt)}
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] scale-x-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 opacity-80 transition-transform duration-200 group-hover:scale-x-100"
      />
    </button>
  )
}
