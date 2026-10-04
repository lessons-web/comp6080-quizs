import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { ContentLoading } from '../../components/ContentLoading'
import { getMockExamsByWeek } from '../../lib/content/mockExams'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { parseWeek } from '../../lib/utils/parseWeek'
import { isSupportedTopic } from '../../lib/content/knowledge'
import { TOPIC_META, type TopicId } from '../../types/content'
import { ExamPaper } from './ExamPaper'

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
      <h2 className="text-xl font-semibold">真题加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

export function MockExamsPage() {
  const { '*': rest, week: weekParam } = useParams()
  const topic = resolveTopicParam(rest, weekParam)
  const supported = isSupportedTopic(topic)
  const weekNum = supported && topic ? topicToWeekNum(topic) : undefined

  const { data: collection, loading, error } = useAsyncContent(
    () => (supported && weekNum !== undefined ? getMockExamsByWeek(weekNum) : Promise.resolve(null)),
    [supported, weekNum],
  )

  if (!supported) {
    return <UnsupportedTopicCard />
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
    return error ? <LoadErrorCard /> : <UnsupportedTopicCard />
  }

  const topicLabel = TOPIC_META[topic].label

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Mock Exams
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {`${topicLabel} 模拟真题`}
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
          当前领域模拟真题还未录入，后续会补充历史题与模拟卷。
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
