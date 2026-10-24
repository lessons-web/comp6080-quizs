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

  it('stores week 4 exam and practice coverage for all six core sections', () => {
    const week4Exam = readJson('content/exams/week-4.mock-exams.json')
    const week4Practice = readJson('content/questions/week-4.practice.json')

    const examText = JSON.stringify(week4Exam)
    const practiceText = JSON.stringify(week4Practice)

    expect(week4Exam.exams).toBeInstanceOf(Array)
    expect((week4Exam.exams as unknown[]).length).toBeGreaterThan(0)

    for (const keyword of ['JSON', 'XHR', 'fetch', 'Promise', 'async', 'Express']) {
      expect(examText).toContain(keyword)
      expect(practiceText).toContain(keyword)
    }
  })

  it('stores week 4 exam as a six-section polished paper', () => {
    const week4Exam = readJson('content/exams/week-4.mock-exams.json')
    const exam = (
      week4Exam.exams as Array<{
        totalMarks: number
        questions: Array<{ title: string; marks: number }>
      }>
    )[0]

    expect(exam.totalMarks).toBe(44)
    expect(exam.questions).toHaveLength(6)
    expect(exam.questions.map((question) => question.title)).toEqual([
      'JSON 与 localStorage',
      'XMLHttpRequest 与 AJAX',
      'fetch 与 Response',
      'Promise 状态与编排',
      'async / await 与并行控制',
      'HTTP / Express 请求与响应',
    ])
    expect(
      exam.questions.reduce((sum, question) => sum + question.marks, 0),
    ).toBe(44)
  })
})
