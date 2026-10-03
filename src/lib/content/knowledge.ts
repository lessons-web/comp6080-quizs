import type { ComponentType } from 'react'

import type { KnowledgeFrontmatter } from '../../types/content'

type MdxFixture = {
  default: ComponentType<Record<string, never>>
  frontmatter: KnowledgeFrontmatter
}

type KnowledgeEntry = {
  Component: ComponentType<Record<string, never>>
  frontmatter: KnowledgeFrontmatter
}

const knowledgeModules = import.meta.glob<MdxFixture>(
  '../../../content/knowledge/*.mdx',
  { eager: false },
)

export function isSupportedWeek(value: number): value is 1 | 2 | 3 | 4 {
  return value >= 1 && value <= 4
}

async function importWeekModule(week: number): Promise<KnowledgeEntry | null> {
  const key = `../../../content/knowledge/week-${week}.mdx`
  const loader = knowledgeModules[key]
  if (!loader) return null
  const mod = await loader()
  return { Component: mod.default, frontmatter: mod.frontmatter }
}

export async function getKnowledgeByWeek(week: number) {
  if (!isSupportedWeek(week)) {
    throw new Error('Unsupported week')
  }
  const entry = await importWeekModule(week)
  if (!entry) {
    throw new Error(`Knowledge content not found for week ${week}`)
  }
  return entry
}
