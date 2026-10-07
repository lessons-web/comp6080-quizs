import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { TopicCardGrid } from './components/TopicCardGrid'
import { KnowledgeDetailPanel } from './components/KnowledgeDetailPanel'
import { KnowledgeSidebar } from './components/KnowledgeSidebar'
import {
  getAllTopicSummaries,
  getKnowledgePoint,
  getKnowledgePointList,
  isSupportedTopic,
} from '../../lib/content/knowledge'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import type { TopicId } from '../../types/content'

function extractKnowledgeSegments(rest: string | undefined): string[] {
  if (!rest) return []
  return rest.split('/').filter(Boolean)
}

export function KnowledgePage() {
  const { '*': rest } = useParams()
  const navigate = useNavigate()
  const [topicStr, knowledgeId] = extractKnowledgeSegments(rest)
  const topic: TopicId | null =
    topicStr && isSupportedTopic(topicStr) ? topicStr : null

  useAsyncContent(() => getAllTopicSummaries(), [])

  const { data: list, loading: listLoading } = useAsyncContent(
    () => (topic ? getKnowledgePointList(topic) : Promise.resolve(null)),
    [topic],
  )

  useEffect(() => {
    if (!topic) return
    if (knowledgeId) return
    if (!list || list.length === 0) return
    navigate(`/knowledge/${topic}/${list[0].id}`, { replace: true })
  }, [topic, knowledgeId, list, navigate])

  const {
    data: detail,
    loading: detailLoading,
    error: detailError,
  } = useAsyncContent(
    () =>
      topic && knowledgeId
        ? getKnowledgePoint(topic, knowledgeId)
        : Promise.resolve(null),
    [topic, knowledgeId],
  )

  if (!topic) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto bg-slate-50">
        <TopicCardGrid />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full">
      <KnowledgeSidebar topic={topic} />
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <KnowledgeDetailPanel
            topic={topic}
            meta={detail?.meta ?? null}
            Component={detail?.Component ?? null}
            loading={Boolean(knowledgeId) && detailLoading && !listLoading}
            error={detailError}
          />
        </div>
      </section>
    </div>
  )
}
