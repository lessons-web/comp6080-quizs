import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { ContentLoading } from '../../components/ContentLoading'
import { getMockExamsByWeek } from '../../lib/content/mockExams'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { parseWeek } from '../../lib/utils/parseWeek'
import { isSupportedWeek } from '../../lib/content/knowledge'
import { ExamPaper } from './ExamPaper'

function UnsupportedWeekCard() {
  return (
    <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-xl font-semibold">暂不支持这个周次</h2>
      <p className="mt-2 text-sm leading-6">
        请选择 `Week 1` 到 `Week 4` 之间的内容。
      </p>
    </section>
  )
}

function LoadErrorCard() {
  return (
    <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h2 className="text-xl font-semibold">真题加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

export function MockExamsPage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const supported = isSupportedWeek(week)

  const { data: collection, loading, error } = useAsyncContent(
    () => (supported ? getMockExamsByWeek(week) : Promise.resolve(null)),
    [supported, week],
  )

  if (!supported) {
    return <UnsupportedWeekCard />
  }

  if (loading) {
    return (
      <section className="flex w-full flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl flex-1">
              <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-9 w-60 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
        <ContentLoading rows={8} />
      </section>
    )
  }

  if (error || !collection) {
    return error ? <LoadErrorCard /> : <UnsupportedWeekCard />
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Mock Exams
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {`Week ${week} 模拟真题`}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              先完成整卷题目，再对照下方答案进行复盘，训练考试节奏与表达完整度。
            </p>
          </div>
          <WeekTabs basePath="mock-exams" />
        </div>
      </div>

      {collection.exams.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
          当前周模拟真题还未录入，后续会补充历史题与模拟卷。
        </div>
      ) : null}

      <div className="space-y-6">
        {collection.exams.map((exam) => (
          <ExamPaper key={exam.id} exam={exam} />
        ))}
      </div>
    </section>
  )
}
