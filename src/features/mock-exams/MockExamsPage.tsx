import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { getMockExamsByWeek } from '../../lib/content/mockExams'
import { parseWeek } from '../../lib/utils/parseWeek'
import { ExamPaper } from './ExamPaper'

export function MockExamsPage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const collection = getMockExamsByWeek(week)

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
