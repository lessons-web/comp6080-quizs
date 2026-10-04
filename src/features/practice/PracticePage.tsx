import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { ContentLoading } from '../../components/ContentLoading'
import { useLocalStoragePref } from '../../lib/hooks/useLocalStoragePref'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import {
  getPracticeQuestionsByWeek,
  groupPracticeQuestions,
} from '../../lib/content/practice'
import { parseWeek } from '../../lib/utils/parseWeek'
import { isSupportedTopic } from '../../lib/content/knowledge'
import { TOPIC_META, type TopicId } from '../../types/content'
import { QuestionCard } from './QuestionCard'

const COLUMN_KEY = 'comp6080:pref:practice-columns'
type ColumnPref = '1' | '2' | '3'
const isValidColumn = (v: string): v is ColumnPref => ['1', '2', '3'].includes(v)

const COL_ICON = {
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
  '3': (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6.25" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
} as const

function gridClassFor(pref: ColumnPref) {
  switch (pref) {
    case '1':
      return 'grid gap-4 grid-cols-1'
    case '2':
      return 'grid gap-4 grid-cols-1 lg:grid-cols-2'
    case '3':
      return 'grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  }
}

function extractTopic(rest: string | undefined): string | undefined {
  if (!rest) return undefined
  const seg = rest.split('/').filter(Boolean)[0]
  return seg
}

function findTopicByWeekNum(weekNum: number): TopicId | undefined {
  const weekTag = `week-${weekNum}` as const
  const entries = Object.entries(TOPIC_META) as [TopicId, typeof TOPIC_META[TopicId]][]
  const match = entries.find(([, meta]) => meta.defaultWeek === weekTag)
  return match ? match[0] : undefined
}

function weekNumberFromTag(weekTag: string): number {
  const m = /week-(\d+)/i.exec(weekTag)
  return m ? Number(m[1]) : Number.NaN
}

function resolveTopicParam(
  rest: string | undefined,
  weekParam: string | undefined,
): TopicId | undefined {
  const fromRest = extractTopic(rest)
  if (fromRest && isSupportedTopic(fromRest)) return fromRest
  const weekNum = parseWeek(weekParam)
  if (!Number.isNaN(weekNum)) {
    const mapped = findTopicByWeekNum(weekNum)
    if (mapped) return mapped
  }
  return undefined
}

function topicToWeekNum(topic: TopicId): number | undefined {
  const weekTag = TOPIC_META[topic].defaultWeek
  const num = weekNumberFromTag(weekTag)
  return Number.isNaN(num) ? undefined : num
}

function UnsupportedTopicCard() {
  return (
    <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-xl font-semibold">暂不支持这个领域</h2>
      <p className="mt-2 text-sm leading-6">
        请选择 `HTML` / `CSS` / `JavaScript` / `React` / `Node.js`。
      </p>
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

export function PracticePage() {
  const { '*': rest, week: weekParam } = useParams()
  const topic = resolveTopicParam(rest, weekParam)
  const supported = isSupportedTopic(topic)
  const weekNum = supported && topic ? topicToWeekNum(topic) : undefined

  const { data: collection, loading, error } = useAsyncContent(
    () => (supported && weekNum !== undefined ? getPracticeQuestionsByWeek(weekNum) : Promise.resolve(null)),
    [supported, weekNum],
  )

  const [colPref, setColPref] = useLocalStoragePref<ColumnPref>(
    COLUMN_KEY,
    '2',
    isValidColumn,
  )
  const gridClass = gridClassFor(colPref)

  const grouped = useMemo(() => {
    if (!collection) return {}
    return groupPracticeQuestions(collection.questions)
  }, [collection])

  if (!supported) {
    return <UnsupportedTopicCard />
  }

  if (loading) {
    return (
      <section className="flex w-full flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl flex-1">
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-slate-200" />
              </div>
              <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="h-9 w-60 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
        <ContentLoading rows={8} />
      </section>
    )
  }

  if (error || !collection) {
    return error ? <LoadErrorCard /> : <UnsupportedTopicCard />
  }

  const topicLabel = TOPIC_META[topic].label

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Practice
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {`${topicLabel} 模拟题库`}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                每次先独立判断，再展开答案，训练“概念 + 解释”一体化输出。
              </p>
            </div>

            <div
              role="group"
              aria-label="题库列数切换"
              className="inline-flex w-28 shrink-0 items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1 text-slate-500"
            >
              {(['1', '2', '3'] as const).map((n) => {
                const active = colPref === n
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`题库 ${n} 列`}
                    aria-pressed={active}
                    onClick={() => setColPref(n)}
                    className={[
                      'flex h-7 flex-1 items-center justify-center rounded-full transition',
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-blue-700',
                    ].join(' ')}
                  >
                    {COL_ICON[n]}
                  </button>
                )
              })}
            </div>
          </div>

          <WeekTabs basePath="practice" />
        </div>
      </div>

      {collection.questions.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
          当前领域题库还未填充，后续会补充该领域的分类练习题。
        </div>
      ) : null}

      {Object.entries(grouped).map(([topicGroup, questions]) => (
        <div key={topicGroup} className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
            {topicGroup}
          </h3>
          <div className={gridClass}>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
