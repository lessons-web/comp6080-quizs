import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { TopicCardGrid } from './components/TopicCardGrid'
import { KnowledgeSplitLayout } from './components/KnowledgeSplitLayout'
import { KnowledgeListPanel } from './components/KnowledgeListPanel'
import { KnowledgeDetailPanel } from './components/KnowledgeDetailPanel'
import {
  getKnowledgePoint,
  getKnowledgePointList,
  isSupportedTopic,
} from '../../lib/content/knowledge'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { TOPIC_META, type TopicId } from '../../types/content'

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
    return <TopicCardGrid />
  }

  const topicLabel = TOPIC_META[topic].label
  const listData = list ?? []
  const activeId = knowledgeId ?? null

  return (
    <KnowledgeSplitLayout
      left={
        listLoading ? (
          <div className="h-full w-96 shrink-0 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <KnowledgeListPanel
            items={listData}
            topicLabel={topicLabel}
            activeId={activeId}
            onSelect={(id) => navigate(`/knowledge/${topic}/${id}`)}
          />
        )
      }
      right={
        <KnowledgeDetailPanel
          topic={topic}
          meta={detail?.meta ?? null}
          Component={detail?.Component ?? null}
          loading={Boolean(knowledgeId) && detailLoading}
          error={detailError}
        />
      }
    />
  )
}
