import { Link, useLocation, useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { ContentLoading } from '../../components/ContentLoading'
import {
  getKnowledgeByWeek,
  isSupportedWeek,
} from '../../lib/content/knowledge'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { parseWeek } from '../../lib/utils/parseWeek'

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
      <h2 className="text-xl font-semibold">知识点内容加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

export function KnowledgePage() {
  const { week: weekParam } = useParams()
  const location = useLocation()
  const pathWeek = location.pathname.match(/week-(\d+)/i)?.[1]
  const week = parseWeek(weekParam ?? pathWeek)
  const supported = isSupportedWeek(week)

  const { data: knowledge, loading, error } = useAsyncContent(
    () => (supported ? getKnowledgeByWeek(week) : Promise.resolve(null)),
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
        <ContentLoading rows={10} />
      </section>
    )
  }

  if (error || !knowledge) {
    return error ? <LoadErrorCard /> : <UnsupportedWeekCard />
  }

  const KnowledgeContent = knowledge.Component

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Knowledge
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {`Week ${week} 知识点解析`}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              先读核心概念，再跳到单题训练和整卷模拟，形成“理解 -
              练习 - 复盘”的学习闭环。
            </p>
          </div>
          <WeekTabs basePath="knowledge" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <KnowledgeContent />
        </article>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-semibold text-slate-950">本页使用方式</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>先看概念和易错点，建立答题语言。</li>
              <li>再去做分类题库，检查是否能独立判断。</li>
              <li>最后用整卷模拟题训练输出节奏。</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">关联入口</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                to={`/practice/week-${week}`}
              >
                进入模拟题库
              </Link>
              <Link
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                to={`/mock-exams/week-${week}`}
              >
                查看模拟真题
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
