import { describe, expect, it } from 'vitest'

import {
  getAllTopicSummaries,
  getKnowledgePoint,
  getKnowledgePointList,
  SUPPORTED_TOPICS,
} from './knowledge'

describe('knowledge content layer', () => {
  it('getAllTopicSummaries returns 5 topics with point counts', async () => {
    const list = await getAllTopicSummaries()
    expect(list).toHaveLength(5)
    expect(list.map((s) => s.topic)).toEqual(SUPPORTED_TOPICS)
    const counts = Object.fromEntries(list.map((s) => [s.topic, s.pointCount]))
    expect(counts.html).toBe(3)
    expect(counts.css).toBe(4)
    expect(counts.javascript).toBe(0)
    expect(counts.react).toBe(0)
    expect(counts.nodejs).toBe(0)
    for (const s of list) {
      expect(s.label).toBeTruthy()
      expect(s.description).toBeTruthy()
      expect(s.accent).toMatch(/^from-\w+-\d+ to-\w+-\d+$/)
    }
  })

  it('getKnowledgePointList(html) returns ordered list of 3 points with full meta', async () => {
    const list = await getKnowledgePointList('html')
    expect(list).toHaveLength(3)
    expect(list.map((m) => m.id)).toEqual([
      '001-structure-semantics',
      '002-paths-images',
      '003-code-tags',
    ])
    for (const m of list) {
      expect(m.topic).toBe('html')
      expect(m.title).toBeTruthy()
      expect(['easy', 'medium', 'hard']).toContain(m.difficulty)
      expect(m.category).toBeTruthy()
      expect(m.tags.length).toBeGreaterThan(0)
      expect(m.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    }
  })

  it('getKnowledgePoint(css, 004-stacking-context) loads body and frontmatter', async () => {
    const { meta, Component } = await getKnowledgePoint(
      'css',
      '004-stacking-context',
    )
    expect(meta.id).toBe('004-stacking-context')
    expect(meta.topic).toBe('css')
    expect(meta.difficulty).toBe('hard')
    expect(typeof Component).toBe('function')
  })

  it('getKnowledgePointList("notatopic") throws unsupported', async () => {
    await expect(
      // @ts-expect-error test illegal arg
      getKnowledgePointList('notatopic'),
    ).rejects.toThrow(/Unsupported topic/)
  })

  it('getKnowledgePoint(html, no-such-id) throws not found', async () => {
    await expect(
      getKnowledgePoint('html', 'no-such-id'),
    ).rejects.toThrow(/Knowledge point not found/)
  })
})
