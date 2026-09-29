import type { ComponentType } from 'react'

import Week1Content, {
  frontmatter as week1Frontmatter,
} from '../../../content/knowledge/week-1.mdx'
import Week2Content, {
  frontmatter as week2Frontmatter,
} from '../../../content/knowledge/week-2.mdx'
import Week3Content, {
  frontmatter as week3Frontmatter,
} from '../../../content/knowledge/week-3.mdx'
import Week4Content, {
  frontmatter as week4Frontmatter,
} from '../../../content/knowledge/week-4.mdx'

import type { KnowledgeFrontmatter } from '../../types/content'

type KnowledgeEntry = {
  Component: ComponentType<Record<string, never>>
  frontmatter: KnowledgeFrontmatter
}

const knowledgeEntries: Record<number, KnowledgeEntry> = {
  1: { Component: Week1Content, frontmatter: week1Frontmatter },
  2: { Component: Week2Content, frontmatter: week2Frontmatter },
  3: { Component: Week3Content, frontmatter: week3Frontmatter },
  4: { Component: Week4Content, frontmatter: week4Frontmatter },
}

export function isSupportedWeek(value: number): value is 1 | 2 | 3 | 4 {
  return value >= 1 && value <= 4
}

export function getKnowledgeByWeek(week: number) {
  if (!isSupportedWeek(week)) {
    throw new Error('Unsupported week')
  }

  return knowledgeEntries[week]
}
