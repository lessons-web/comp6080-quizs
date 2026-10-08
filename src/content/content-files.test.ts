import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(currentDir, '..', '..')

function readText(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), 'utf8')
}

function readJson(relativePath: string) {
  return JSON.parse(readText(relativePath)) as Record<string, unknown>
}

describe('content files', () => {
  it('stores knowledge point MDX files with required point-level frontmatter', () => {
    const html1 = readText('content/knowledge/html/001-structure-semantics.mdx')
    const css4 = readText('content/knowledge/css/004-stacking-context.mdx')

    expect(html1).toContain('id: "001-structure-semantics"')
    expect(html1).toContain('category: "文档基础"')
    expect(html1).toContain('topic: "html"')
    expect(html1).toContain('difficulty: "easy"')
    expect(html1).toContain('tags: ["week-1"]')
    expect(html1).toContain('createdAt:')
    expect(css4).toContain('difficulty: "hard"')
    expect(css4).toContain('summary:')
  })

  it('stores week 1 practice questions with the spec fields', () => {
    const practice = readJson('content/questions/week-1.practice.json')

    expect(practice.week).toBe('week-1')
    expect(practice.questions).toBeInstanceOf(Array)
    expect((practice.questions as unknown[])[0]).toMatchObject({
      question: expect.any(String),
      knowledgePoint: expect.any(String),
      answerExplanation: expect.any(String),
      codeBlocks: expect.any(Array),
      images: expect.any(Array),
    })
  })

  it('stores week 1 mock exams and empty later-week placeholders', () => {
    const exams = readJson('content/exams/week-1.mock-exams.json')
    const week2Practice = readJson('content/questions/week-2.practice.json')

    expect(exams.topic).toBe('html')
    expect(exams.exams).toBeInstanceOf(Array)
    expect((exams.exams as Array<{ questions: unknown[] }>)).toHaveLength(1)
    expect(
      (exams.exams as Array<{ questions: unknown[] }>)[0].questions[0],
    ).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      marks: expect.any(Number),
      subQuestions: expect.any(Array),
    })
    expect(week2Practice.questions).toBeInstanceOf(Array)
  })
})
