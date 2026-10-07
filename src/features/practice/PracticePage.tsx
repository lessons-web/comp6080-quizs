import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ContentLoading } from '../../components/ContentLoading'
import { useLocalStoragePref } from '../../lib/hooks/useLocalStoragePref'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { collectUniqueTags, getAllPracticeQuestions } from '../../lib/content/practice'
import { isSupportedTopic } from '../../lib/content/knowledge'
import { TOPIC_META, type Difficulty, type PracticeQuestion, type TopicId } from '../../types/content'
import { QuestionBankCard } from './QuestionBankCard'
import { QuestionBankTable } from './QuestionBankTable'
import Select, { type SelectOption } from '../../components/form/Select'
import MultiSelect from '../../components/form/MultiSelect'

const LAYOUT_KEY = 'comp6080:pref:practice-layout'
type LayoutPref = '1' | '2' | 'table'
const isValidLayout = (v: string): v is LayoutPref => ['1', '2', 'table'].includes(v)

const DIFF_FILTERS: Array<{ value: 'all' | Difficulty; label: string }> = [
  { value: 'all', label: '全部难度' },
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
]

const TOPIC_FILTERS: Array<{ value: 'all' | TopicId; label: string }> = [
  { value: 'all', label: '全部领域' },
  { value: 'html', label: TOPIC_META.html.label },
  { value: 'css', label: TOPIC_META.css.label },
  { value: 'javascript', label: TOPIC_META.javascript.label },
  { value: 'react', label: TOPIC_META.react.label },
  { value: 'nodejs', label: TOPIC_META.nodejs.label },
]

const LAYOUT_ICON: Record<LayoutPref, React.JSX.Element> = {
  '1': (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  '2': (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.5" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path fill="none" stroke="currentColor" strokeWidth="1.25" d="M2 6.25h12M2 9.5h12M6.25 2.5v11M9.75 2.5v11" />
    </svg>
  ),
} as const

function gridClassFor(pref: LayoutPref) {
  switch (pref) {
    case '1':
      return 'grid gap-4 grid-cols-1'
    case '2':
      return 'grid gap-4 grid-cols-1 lg:grid-cols-2'
    default:
      return ''
  }
}

function useDebounced<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}

function UnsupportedTopicCard() {
  return (
    <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-xl font-semibold">暂不支持这个领域</h2>
      <p className="mt-2 text-sm leading-6">请选择 `HTML` / `CSS` / `JavaScript` / `React` / `Node.js`。</p>
    </section>
  )
}

function LoadErrorCard() {
  return (
    <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h2 className="text-xl font-semibold">题库加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

function matchQuestion(
  q: PracticeQuestion,
  kw: string,
  topic: 'all' | TopicId,
  diff: 'all' | Difficulty,
  tags: string[],
) {
  if (topic !== 'all' && q.topic !== topic) return false
  if (diff !== 'all' && q.difficulty !== diff) return false
  if (tags.length > 0 && !tags.every((t) => q.tags.includes(t))) return false
  if (!kw) return true
  const s = kw.toLowerCase()
  return (
    q.question.toLowerCase().includes(s) ||
    q.knowledgePoint.toLowerCase().includes(s) ||
    q.id.toLowerCase().includes(s) ||
    q.tags.some((t) => t.toLowerCase().includes(s))
  )
}

const DIFF_STAT_CLASS: Record<Difficulty, string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-rose-500',
}

export function PracticePage() {
  const { '*': rest } = useParams()
  const navigate = useNavigate()
  const initialTopic = useMemo(() => {
    const seg = rest?.split('/').filter(Boolean)[0]
    if (seg && isSupportedTopic(seg)) return seg as TopicId
    return 'all' as const
  }, [rest])

  const { data: allQuestions, loading, error } = useAsyncContent(
    () => getAllPracticeQuestions(),
    [],
  )

  const [layoutPref, setLayoutPref] = useLocalStoragePref<LayoutPref>(
    LAYOUT_KEY,
    'table',
    isValidLayout,
  )
  const gridClass = gridClassFor(layoutPref)

  const [searchRaw, setSearchRaw] = useState('')
  const debouncedSearch = useDebounced(searchRaw, 200)
  const [topicFilter, setTopicFilter] = useState<'all' | TopicId>(initialTopic)
  const [diffFilter, setDiffFilter] = useState<'all' | Difficulty>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(
    () => (allQuestions ? collectUniqueTags(allQuestions) : []),
    [allQuestions],
  )
  const tagOptions: SelectOption[] = useMemo(
    () => allTags.map((t) => ({ value: t, label: `# ${t}` })),
    [allTags],
  )

  const diffCounts = useMemo(() => {
    const base: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 }
    if (!allQuestions) return base
    return allQuestions.reduce((acc, q) => {
      acc[q.difficulty] += 1
      return acc
    }, base)
  }, [allQuestions])

  const topicCounts = useMemo(() => {
    const base: Record<string, number> = {}
    if (!allQuestions) return base
    return allQuestions.reduce((acc, q) => {
      acc[q.topic] = (acc[q.topic] ?? 0) + 1
      return acc
    }, base)
  }, [allQuestions])

  const topicOptions: SelectOption[] = useMemo(
    () =>
      TOPIC_FILTERS.map((f) => ({
        value: f.value,
        label: f.label,
        suffix: f.value === 'all' ? undefined : `· ${topicCounts[f.value] ?? 0}`,
      })),
    [topicCounts],
  )
  const diffOptions: SelectOption[] = useMemo(
    () => DIFF_FILTERS.map((f) => ({ value: f.value, label: f.label })),
    [],
  )

  const filtered = useMemo(() => {
    if (!allQuestions) return []
    return allQuestions.filter((q) =>
      matchQuestion(q, debouncedSearch, topicFilter, diffFilter, selectedTags),
    )
  }, [allQuestions, debouncedSearch, topicFilter, diffFilter, selectedTags])

  if (loading) {
    return (
      <PageShell>
        <section className="flex w-full flex-col gap-6 pb-16">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-3xl flex-1">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-100" />
                </div>
                <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="h-11 w-72 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-11 w-28 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-11 w-28 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-11 w-40 shrink-0 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
          <ContentLoading rows={8} />
        </section>
      </PageShell>
    )
  }

  if (error || !allQuestions) {
    return <PageShell>{error ? <LoadErrorCard /> : <UnsupportedTopicCard />}</PageShell>
  }

  return (
    <PageShell>
      <section className="flex w-full flex-col gap-6 pb-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Question Bank
                  </p>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    共 {allQuestions.length} 题
                  </span>
                </div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  模拟题库
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  所有试题总览，支持按关键词、领域、难度与标签多维筛选；点击卡片或表格行可展开答案与解析进行独立复盘。
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px]">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${DIFF_STAT_CLASS[d]}`} />
                      {d === 'easy' ? '简单' : d === 'medium' ? '中等' : '困难'}
                      <span className="text-slate-500">{diffCounts[d]}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div
                role="group"
                aria-label="题库布局切换"
                className="inline-flex w-28 shrink-0 items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1 text-slate-500"
              >
                {(['1', '2', 'table'] as const).map((mode) => {
                  const active = layoutPref === mode
                  return (
                    <button
                      key={mode}
                      type="button"
                      aria-label={mode === 'table' ? '表格式布局' : `题库 ${mode} 列`}
                      aria-pressed={active}
                      onClick={() => setLayoutPref(mode)}
                      className={[
                        'flex h-7 flex-1 items-center justify-center rounded-full transition',
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-blue-700',
                      ].join(' ')}
                    >
                      {LAYOUT_ICON[mode]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
              <div className="relative w-72 shrink-0">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                >
                  <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10.25 10.25 13 13" />
                </svg>
                <input
                  type="search"
                  value={searchRaw}
                  onChange={(e) => setSearchRaw(e.target.value)}
                  placeholder="搜索题目 / 知识点 / 标签…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {searchRaw ? (
                  <button
                    type="button"
                    onClick={() => setSearchRaw('')}
                    aria-label="清除搜索"
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                ) : null}
              </div>

              <Select
                value={topicFilter}
                onChange={(v) => setTopicFilter(v as any)}
                options={topicOptions}
                placeholder="全部领域"
                className="w-28 shrink-0"
              />

              <Select
                value={diffFilter}
                onChange={(v) => setDiffFilter(v as any)}
                options={diffOptions}
                placeholder="全部难度"
                className="w-28 shrink-0"
              />

              <MultiSelect
                value={selectedTags}
                onChange={(next) => setSelectedTags(next)}
                options={tagOptions}
                placeholder={allTags.length === 0 ? '暂无标签' : '选择标签'}
                className="w-40 shrink-0"
              />

              <div className="ml-auto text-[12px] font-medium text-slate-500">
                筛选后 <span className="font-semibold text-slate-800">{filtered.length}</span> /{' '}
                {allQuestions.length} 题
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-6 w-6">
                <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10.25 10.25 13 13" />
              </svg>
            </div>
            <p className="font-medium text-slate-800">没有匹配的题目</p>
            <p className="mt-1 text-slate-500">试试调整搜索关键词、领域、难度或标签条件。</p>
          </div>
        ) : null}

        {layoutPref === 'table' ? (
          <QuestionBankTable
            questions={filtered}
            highlight={debouncedSearch}
            onSelect={(id) => navigate(`/practice/question/${id}`)}
          />
        ) : (
          <div className={gridClass}>
            {filtered.map((q) => (
              <QuestionBankCard
                key={q.id}
                question={q}
                highlight={debouncedSearch}
                onClick={() => navigate(`/practice/question/${q.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}
