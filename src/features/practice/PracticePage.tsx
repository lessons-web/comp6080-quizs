import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import {
  getPracticeQuestionsByWeek,
  groupPracticeQuestions,
} from '../../lib/content/practice'
import { QuestionCard } from './QuestionCard'

function parseWeek(weekParam?: string) {
  const match = weekParam?.match(/^week-(\d)$/)
  const value = Number(match?.[1])

  return Number.isInteger(value) ? value : Number.NaN
}

export function PracticePage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const collection = getPracticeQuestionsByWeek(week)

  const grouped = useMemo(() => {
    if (!collection) {
      return {}
    }

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Practice
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {`Week ${week} 模拟题库`}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              每次先独立判断，再展开答案，训练“概念 + 解释”一体化输出。
            </p>
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
          <div className="grid gap-4 lg:grid-cols-2">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
