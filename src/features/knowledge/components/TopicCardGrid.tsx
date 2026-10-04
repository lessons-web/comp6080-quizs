import { getAllTopicSummaries } from '../../../lib/content/knowledge'
import { useAsyncContent } from '../../../lib/hooks/useAsyncContent'
import { TopicCard } from './TopicCard'

export function TopicCardGrid() {
  const { data, loading, error } = useAsyncContent(() => getAllTopicSummaries(), [])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[160px] animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
          <h2 className="text-xl font-semibold">加载失败</h2>
          <p className="mt-2 text-sm leading-6 text-rose-700">请稍后再试。</p>
        </div>
      </div>
    )
  }

  const summaries = data ?? []

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          知识点解析
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          选择一个技术领域进入知识点讲解，按知识点颗粒度学习，结合模拟题库巩固记忆。
        </p>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {summaries.map((s) => (
          <TopicCard
            key={s.topic}
            topic={s.topic}
            label={s.label}
            description={s.description}
            accent={s.accent}
            pointCount={s.pointCount}
          />
        ))}
      </div>
    </div>
  )
}
