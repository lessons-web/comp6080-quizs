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

const kpModules = import.meta.glob<MdxFixture>(
  '../../../content/knowledge/**/*.mdx',
  { eager: false },
)

export function isSupportedTopic(value: unknown): value is TopicId {
  return typeof value === 'string' && (SUPPORTED_TOPICS as string[]).includes(value)
}

export function getAllKnowledgeTopics(): TopicId[] {
  return SUPPORTED_TOPICS.slice()
}

type KpModuleKey = string
function buildKpKey(topic: TopicId, id: string): KpModuleKey {
  return `../../../content/knowledge/${topic}/${id}.mdx`
}

interface KpKeyParts { topic: TopicId; id: string }
function parseKpKey(key: KpModuleKey): KpKeyParts | null {
  const m = key.match(/\/content\/knowledge\/([^/]+)\/([^/]+)\.mdx$/)
  if (!m) return null
  const [, topic, id] = m
  if (!isSupportedTopic(topic)) return null
  return { topic, id }
}

function sortKpList(list: KnowledgePointMeta[]): KnowledgePointMeta[] {
  return list.slice().sort((a, b) => a.id.localeCompare(b.id))
}

export async function getAllTopicSummaries() {
  const counts = new Map<TopicId, number>()
  const keys = Object.keys(kpModules)
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
  const prefix = `../../../content/knowledge/${topic}/`
  for (const [key, loader] of Object.entries(kpModules)) {
    if (!key.startsWith(prefix)) continue
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
  const loader = kpModules[key]
  if (!loader) throw new Error('Knowledge point not found')
  const mod = await loader()
  return { Component: mod.default, meta: mod.frontmatter }
}
