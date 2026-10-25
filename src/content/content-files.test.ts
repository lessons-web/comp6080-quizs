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

  it('stores week 1 mock exams with the required question fields', () => {
    const exams = readJson('content/exams/week-1.mock-exams.json')
    const week2Practice = readJson('content/questions/week-2.practice.json')

    expect(exams.topic).toBe('html')
    expect(exams.exams).toBeInstanceOf(Array)
    expect(
      (exams.exams as Array<{ questions: unknown[] }>).length,
    ).toBeGreaterThan(0)
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

  it('stores week 1 real paper plus a chapter-aligned sim', () => {
    const exams = readJson('content/exams/week-1.mock-exams.json')
    const list = exams.exams as Array<{
      id: string
      totalMarks: number
      questions: Array<{ title: string; marks: number }>
    }>

    expect(list).toHaveLength(2)
    expect(list.some((exam) => exam.id === '2026T3-QUIZ1')).toBe(true)

    const sim = list.find((exam) => exam.id === 'WEEK1-SIM')
    expect(sim).toBeTruthy()
    expect(sim!.questions.map((question) => question.title)).toEqual([
      'Git 最小工作流',
      'HTML 文档结构',
      '语义化标签与标题层级',
      '链接、图片与路径',
      '列表、表格与预格式化文本',
    ])
    expect(
      sim!.questions.reduce((sum, question) => sum + question.marks, 0),
    ).toBe(sim!.totalMarks)
  })

  it('stores a week 2 six-chapter sim', () => {
    const exams = readJson('content/exams/week-2.mock-exams.json')
    const list = exams.exams as Array<{
      id: string
      totalMarks: number
      questions: Array<{ title: string; marks: number }>
    }>

    expect(list).toHaveLength(1)
    const sim = list[0]
    expect(sim.id).toBe('WEEK2-SIM')
    expect(sim.questions.map((question) => question.title)).toEqual([
      '选择器与层叠优先级',
      '盒模型与单位',
      'Flexbox 布局',
      'CSS Grid、框架与样式复用',
      '定位、z-index 与视觉层级',
      '响应式、媒体查询与开发者工具',
    ])
    expect(
      sim.questions.reduce((sum, question) => sum + question.marks, 0),
    ).toBe(sim.totalMarks)
  })

  it('stores a week 3 seven-chapter sim', () => {
    const exams = readJson('content/exams/week-3.mock-exams.json')
    const list = exams.exams as Array<{
      id: string
      totalMarks: number
      questions: Array<{ title: string; marks: number }>
    }>

    expect(list).toHaveLength(1)
    const sim = list[0]
    expect(sim.id).toBe('WEEK3-SIM')
    expect(sim.questions.map((question) => question.title)).toEqual([
      'JavaScript 语言特性与语法',
      '高级函数与闭包',
      'JavaScript 生态、Node 与 npm',
      'DOM 查询与操作',
      '事件与事件委托',
      '表单与客户端校验',
      'localStorage 与持久化',
    ])
    expect(
      sim.questions.reduce((sum, question) => sum + question.marks, 0),
    ).toBe(sim.totalMarks)
  })

  it('keeps week 1-3 practice banks in sync with the sim chapters', () => {
    const week1 = JSON.stringify(readJson('content/questions/week-1.practice.json'))
    const week2 = JSON.stringify(readJson('content/questions/week-2.practice.json'))
    const week3 = JSON.stringify(readJson('content/questions/week-3.practice.json'))

    for (const keyword of ['选择器', '盒模型', 'Flexbox', 'Grid', 'z-index', '响应式']) {
      expect(week2).toContain(keyword)
    }
    for (const keyword of ['闭包', 'npm', 'DOM', '事件委托', '表单', 'localStorage']) {
      expect(week3).toContain(keyword)
    }
    expect(week1).toContain('Git')
  })

  it('stores a quiz 2 paper that excludes React but covers week 1-5 non-React topics', () => {
    const quiz2 = readJson('content/exams/quiz-2.mock-exams.json')
    const exam = (
      quiz2.exams as Array<{
        id: string
        totalMarks: number
        questions: Array<{
          id: string
          title: string
          titleZh?: string
          displayNumber?: string
          categoryLabel?: string
          displayStyle?: string
          mockup?: {
            files: Array<{ name: string; code?: string; codeZh?: string }>
            html?: string
            htmlZh?: string
            caption?: string
            captionZh?: string
          }
        }>
      }>
    )[0]
    const week2 = JSON.stringify(readJson('content/questions/week-2.practice.json'))
    const week3 = JSON.stringify(readJson('content/questions/week-3.practice.json'))
    const week4 = JSON.stringify(readJson('content/questions/week-4.practice.json'))
    const week5 = JSON.stringify(readJson('content/questions/week-5.practice.json'))
    const quizText = JSON.stringify(quiz2)

    expect(exam.id).toBe('2026T3-QUIZ2')
    expect(exam.totalMarks).toBe(90)
    expect(exam.questions).toHaveLength(18)
    expect(quizText).not.toContain('useState')
    expect(quizText).not.toContain('JSX')
    expect(quizText).toContain('HTML/CSS Layout and Responsive Behaviour')
    expect(quizText).toContain('Async JavaScript: Event Loop and Promises')
    expect(quizText).toContain('UI Design Principles and User Experience Reasoning')
    expect(quizText).toContain('Export that freezes the page')
    expect(quizText).toContain('Recent orders panel')
    expect(quizText).toContain('Old prices on a cafe menu')
    expect(quizText).toContain('Saving a note')
    expect(quizText).toContain('Live comments')
    expect(quizText).toContain('Finding the confirm action')
    expect(quizText).toContain('Delete beside Save')
    expect(quizText).toContain('A crowded signup form')

    expect(exam.questions.every((question) => question.displayStyle === 'quiz-sample')).toBe(true)
    expect(exam.questions.every((question) => Boolean(question.displayNumber))).toBe(true)
    expect(exam.questions.every((question) => Boolean(question.categoryLabel))).toBe(true)
    expect(exam.questions.every((question) => (question.mockup?.files?.length ?? 0) > 0)).toBe(true)
    expect(
      exam.questions.every((question) => (
        question.mockup?.files.every((file) => (
          /\.(html|css|js)$/i.test(file.name)
            ? Boolean(file.code && file.codeZh)
            : true
        )) ?? true
      )),
    ).toBe(true)
    expect(
      exam.questions
        .filter((question) => Boolean(question.titleZh) && question.mockup)
        .every((question) => Boolean(question.mockup?.htmlZh)),
    ).toBe(true)
    expect(
      exam.questions
        .filter((question) => Boolean(question.mockup?.caption))
        .every((question) => Boolean(question.mockup?.captionZh)),
    ).toBe(true)

    expect(week2).toContain('Box sizing and available width')
    expect(week2).toContain('Flexbox axis relationships')
    expect(week2).toContain('Specificity and source order')
    expect(week3).toContain('Shared object state')
    expect(week3).toContain('Event origin and listener context')
    expect(week3).toContain('Form submission and DOM state')
    expect(week4).toContain('Export that freezes the page')
    expect(week4).toContain('Recent orders panel')
    expect(week4).toContain('Old prices on a cafe menu')
    expect(week4).toContain('A count that takes ten seconds')
    expect(week5).toContain('Saving a note')
    expect(week5).toContain('Inbox that says no messages')
    expect(week5).toContain('Live comments')
    expect(week5).toContain('Finding the confirm action')
    expect(week5).toContain('Delete beside Save')
    expect(week5).toContain('A crowded signup form')
  })
})
