import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { useLocalStoragePref } from '../../lib/hooks/useLocalStoragePref'
import { parseWeek } from '../../lib/utils/parseWeek'
import {
  getPracticeQuestionsByWeek,
  groupPracticeQuestions,
} from '../../lib/content/practice'
import { QuestionCard } from './QuestionCard'

const COLUMN_KEY = 'comp6080:pref:practice-columns'
type ColumnPref = '1' | '2' | '3'
const isValidColumn = (v: string): v is ColumnPref => ['1', '2', '3'].includes(v)

const COL_ICON = {
  1: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.5" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  3: (
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

export function PracticePage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const collection = getPracticeQuestionsByWeek(week)
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

  if (!collection) {
    return (
      <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <h2 className="text-xl font-semibold">暂不支持这个周次</h2>
        <p className="mt-2 text-sm leading-6">
          请选择 `Week 1` 到 `Week 4` 之间的内容。
        </p>
      </section>
    )
  }

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
                {`Week ${week} 模拟题库`}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                每次先独立判断，再展开答案，训练"概念 + 解释"一体化输出。
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
                    {COL_ICON[n as 1 | 2 | 3]}
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
          当前周题库还未填充，后续会补充这一周的分类练习题。
        </div>
      ) : null}

      {Object.entries(grouped).map(([topic, questions]) => (
        <div key={topic} className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
            {topic}
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
