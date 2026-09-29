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
  it('stores knowledge MDX files with required frontmatter', () => {
    const week1 = readText('content/knowledge/week-1.mdx')
    const week4 = readText('content/knowledge/week-4.mdx')

    expect(week1).toContain('title:')
    expect(week1).toContain('week: "week-1"')
    expect(week4).toContain('summary:')
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

    expect(exams.week).toBe('week-1')
    expect(exams.exams).toBeInstanceOf(Array)
    expect((exams.exams as Array<{ questions: unknown[] }>)).toHaveLength(2)
    expect(
      (exams.exams as Array<{ questions: unknown[] }>)[0].questions[0],
    ).toMatchObject({
      question: expect.any(String),
      knowledgePoint: expect.any(String),
      answerExplanation: expect.any(String),
      codeBlocks: expect.any(Array),
      images: expect.any(Array),
    })
    expect(week2Practice.questions).toEqual([])
  })
})
