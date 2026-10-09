import type { ComponentType } from 'react'
import type { KnowledgePointMeta, TopicId } from '../../types/content'
import { TOPIC_META } from '../../types/content'

type MdxFixture = {
  default: ComponentType<Record<string, never>>
  frontmatter: KnowledgePointMeta
}

type KpEntry = {
  Component: ComponentType<Record<string, never>>
  meta: KnowledgePointMeta
}

export const SUPPORTED_TOPICS = Object.keys(TOPIC_META) as TopicId[]

const mdxLoaders: Record<string, () => Promise<MdxFixture>> = {
  'html/001-structure-semantics': () =>
    import('@/content/knowledge/html/001-structure-semantics.mdx') as Promise<MdxFixture>,
  'html/002-paths-images': () =>
    import('@/content/knowledge/html/002-paths-images.mdx') as Promise<MdxFixture>,
  'html/003-code-tags': () =>
    import('@/content/knowledge/html/003-code-tags.mdx') as Promise<MdxFixture>,
  'css/001-specificity': () =>
    import('@/content/knowledge/css/001-specificity.mdx') as Promise<MdxFixture>,
  'css/002-box-model': () =>
    import('@/content/knowledge/css/002-box-model.mdx') as Promise<MdxFixture>,
  'css/003-flexbox': () =>
    import('@/content/knowledge/css/003-flexbox.mdx') as Promise<MdxFixture>,
  'css/004-stacking-context': () =>
    import('@/content/knowledge/css/004-stacking-context.mdx') as Promise<MdxFixture>,
}

export function isSupportedTopic(value: unknown): value is TopicId {
  return typeof value === 'string' && (SUPPORTED_TOPICS as string[]).includes(value)
}

export function getAllKnowledgeTopics(): TopicId[] {
  return SUPPORTED_TOPICS.slice()
}

function buildKpKey(topic: TopicId, id: string): string {
  return `${topic}/${id}`
}

interface KpKeyParts { topic: TopicId; id: string }
function parseKpKey(key: string): KpKeyParts | null {
  const parts = key.split('/')
  if (parts.length !== 2) return null
  const [topic, id] = parts
  if (!isSupportedTopic(topic)) return null
  return { topic, id }
}

function sortKpList(list: KnowledgePointMeta[]): KnowledgePointMeta[] {
  return list.slice().sort((a, b) => a.id.localeCompare(b.id))
}

export async function getAllTopicSummaries() {
  const counts = new Map<TopicId, number>()
  const keys = Object.keys(mdxLoaders)
  for (const k of keys) {
    const parts = parseKpKey(k)
    if (!parts) continue
    counts.set(parts.topic, (counts.get(parts.topic) ?? 0) + 1)
  }
  return SUPPORTED_TOPICS.map((topic) => {
    const meta = TOPIC_META[topic]
    return {
      topic,
      label: meta.label,
      description: meta.description,
      accent: meta.accent,
      pointCount: counts.get(topic) ?? 0,
    }
  })
}

export async function getKnowledgePointList(topic: TopicId): Promise<KnowledgePointMeta[]> {
  if (!isSupportedTopic(topic)) throw new Error('Unsupported topic')
  const result: KnowledgePointMeta[] = []
  for (const [key, loader] of Object.entries(mdxLoaders)) {
    const parts = parseKpKey(key)
    if (!parts || parts.topic !== topic) continue
    const mod = await loader()
    result.push(mod.frontmatter)
  }
  return sortKpList(result)
}

export async function getKnowledgePoint(
  topic: TopicId,
  knowledgeId: string,
): Promise<KpEntry> {
  if (!isSupportedTopic(topic)) throw new Error('Unsupported topic')
  const key = buildKpKey(topic, knowledgeId)
  const loader = mdxLoaders[key]
  if (!loader) throw new Error('Knowledge point not found')
  const mod = await loader()
  return { Component: mod.default, meta: mod.frontmatter }
}
