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

  it('stores static mockups on UI/UX practice questions with visual evidence', () => {
    const practice = readJson('content/questions/week-5.practice.json')
    const questions = practice.questions as Array<{
      id: string
      topic: string
      mockup?: {
        html: string
        caption: string
        viewport?: string
      }
    }>
    const questionsById = new Map(questions.map((question) => [question.id, question]))
    const mockupIds = [
      ...Array.from({ length: 8 }, (_, index) => `UIUX-Q${index + 2}`),
      'QUIZ2-W5-Q1',
      'QUIZ2-W5-Q5',
      'QUIZ2-W5-Q6',
      'QUIZ2-W5-Q7',
      ...Array.from({ length: 14 }, (_, index) => `QUIZ3-W5-Q${index + 1}`),
    ]

    expect(mockupIds).toHaveLength(26)
    for (const id of mockupIds) {
      const question = questionsById.get(id)
      expect(question, id).toBeDefined()
      expect(question?.topic, id).toBe('ui-ux')
      expect(question?.mockup?.html, id).toEqual(expect.any(String))
      expect(question?.mockup?.html.trim(), id).not.toBe('')
      expect(question?.mockup?.caption, id).toEqual(expect.any(String))
      expect(question?.mockup?.caption.trim(), id).not.toBe('')
      expect(['desktop', 'mobile']).toContain(question?.mockup?.viewport)
    }

    expect(questionsById.get('UIUX-Q1')?.mockup).toBeUndefined()
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

  it('stores a quiz 3 paper focused on weeks 7-8 React content', () => {
    const quiz3 = readJson('content/exams/quiz-3.mock-exams.json')
    const exam = (
      quiz3.exams as Array<{
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
    const week5 = JSON.stringify(readJson('content/questions/week-5.practice.json'))
    const week7 = JSON.stringify(readJson('content/questions/week-7.practice.json'))
    const quizText = JSON.stringify(quiz3)

    expect(exam.id).toBe('2026T3-QUIZ3')
    expect(exam.totalMarks).toBe(69)
    expect(exam.questions).toHaveLength(14)
    expect(quizText).toContain('React State and Rendering')
    expect(quizText).toContain('React Effects and Data Flow')
    expect(quizText).toContain('React Router and URL State')
    expect(quizText).toContain('useState')
    expect(quizText).toContain('useEffect')
    expect(quizText).toContain('useParams')
    expect(quizText).toContain('Delete beside Edit')
    expect(quizText).toContain('An empty dashboard')
    expect(quizText).toContain('A token that runs out of its comment')
    expect(quizText).toContain('Buttons that jump')
    expect(quizText).toContain('Helpers for the register page')
    expect(quizText).toContain('Super like')
    expect(quizText).toContain('Vote totals in two components')
    expect(quizText).toContain('Two cart item counts')
    expect(quizText).toContain('Account redirect effect')
    expect(quizText).toContain('Interval with stale state')
    expect(quizText).toContain('An async effect callback')
    expect(quizText).toContain('Hotel route parameters')
    expect(quizText).toContain('Navbar links')
    expect(quizText).toContain('Profile pages')

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

    expect(week2).toContain('A token that runs out of its comment')
    expect(week2).toContain('Buttons that jump')
    expect(week3).toContain('Helpers for the register page')
    expect(week5).toContain('Delete beside Edit')
    expect(week5).toContain('An empty dashboard')
    expect(week7).toContain('Super like')
    expect(week7).toContain('Vote totals in two components')
    expect(week7).toContain('Two cart item counts')
    expect(week7).toContain('Account redirect effect')
    expect(week7).toContain('Interval with stale state')
    expect(week7).toContain('An async effect callback')
    expect(week7).toContain('Hotel route parameters')
    expect(week7).toContain('Navbar links')
    expect(week7).toContain('Profile pages')
  })

  it('stores the async & network topic paper with mockups and a synced practice bank', () => {
    const topic = readJson('content/exams/topic-4.async-network.json')
    const week4 = JSON.stringify(readJson('content/questions/week-4.practice.json'))
    const exam = (
      topic.exams as Array<{
        id: string
        totalMarks: number
        questions: Array<{
          id: string
          title: string
          titleZh?: string
          marks: number
          displayNumber?: string
          categoryLabel?: string
          categoryLabelZh?: string
          contentMdxZh?: string
          displayStyle?: string
          subQuestions: Array<{ id: string; label: string; marks: number }>
          mockup?: {
            files: Array<{ name: string; code?: string; codeZh?: string; active?: boolean }>
            html?: string
            htmlZh?: string
            caption?: string
            captionZh?: string
            viewport?: string
          }
        }>
      }>
    )[0]
    const topicText = JSON.stringify(topic)

    expect(exam.id).toBe('TOPIC4-ASYNC-NETWORK')
    expect(exam.totalMarks).toBe(50)
    expect(exam.questions).toHaveLength(10)
    expect(exam.questions.every((question) => question.subQuestions.length === 3)).toBe(true)
    expect(exam.questions.every((question) => question.displayStyle === 'quiz-sample')).toBe(true)
    expect(exam.questions.every((question) => Boolean(question.displayNumber))).toBe(true)
    expect(exam.questions.every((question) => Boolean(question.categoryLabel))).toBe(true)
    expect(exam.questions.every((question) => Boolean(question.categoryLabelZh))).toBe(true)
    expect(exam.questions.every((question) => Boolean(question.titleZh))).toBe(true)
    expect(exam.questions.every((question) => Boolean(question.contentMdxZh))).toBe(true)
    expect(exam.questions.every((question) => (question.mockup?.files?.length ?? 0) > 0)).toBe(true)
    expect(
      exam.questions.every((question) => (
        question.mockup?.files.some((file) => file.active) ?? false
      )),
    ).toBe(true)
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
      exam.questions.every((question) => Boolean(question.mockup?.html && question.mockup?.htmlZh)),
    ).toBe(true)
    expect(
      exam.questions.every((question) => Boolean(question.mockup?.caption && question.mockup?.captionZh)),
    ).toBe(true)
    expect(
      exam.questions.reduce((sum, question) => sum + question.marks, 0),
    ).toBe(exam.totalMarks)
    expect(
      exam.questions.every((question) => (
        question.subQuestions.reduce((sum, subQuestion) => sum + subQuestion.marks, 0)
          === question.marks
      )),
    ).toBe(true)

    for (const keyword of ['JSON', 'XMLHttpRequest', 'fetch', 'Promise', 'await', 'Express']) {
      expect(topicText).toContain(keyword)
    }

    for (let index = 1; index <= 10; index += 1) {
      expect(week4).toContain(`TOPIC4-Q${index}`)
    }
  })

  it('stores the full topic & sprint paper set with quiz-sample mockups and a synced practice bank', () => {
    type PaperQuestion = {
      id: string
      title: string
      titleZh?: string
      marks: number
      contentMdx: string
      contentMdxZh?: string
      displayNumber?: string
      categoryLabel?: string
      categoryLabelZh?: string
      displayStyle?: string
      subQuestions: Array<{
        id: string
        label: string
        marks: number
        questionMdx: string
        answerMdx: string
        markingMdx: string
        questionMdxZh?: string
        answerMdxZh?: string
        markingMdxZh?: string
      }>
      mockup?: {
        files: Array<{ name: string; code?: string; codeZh?: string; active?: boolean }>
        html?: string
        htmlZh?: string
        caption?: string
        captionZh?: string
        viewport?: string
      }
    }
    type Paper = {
      id: string
      title: string
      titleZh?: string
      description?: string
      descriptionZh?: string
      totalMarks: number
      questions: PaperQuestion[]
    }

    const papers: Array<{ file: string; id: string; titleZh?: string; totalMarks: number; questions: number }> = [
      { file: 'content/exams/topic-1.html.json', id: 'TOPIC1-HTML', totalMarks: 50, questions: 10 },
      { file: 'content/exams/topic-2.css.json', id: 'TOPIC2-CSS', totalMarks: 50, questions: 10 },
      { file: 'content/exams/topic-3.js-dom.json', id: 'TOPIC3-JS-DOM', totalMarks: 50, questions: 10 },
      { file: 'content/exams/topic-4.async-network.json', id: 'TOPIC4-ASYNC-NETWORK', totalMarks: 50, questions: 10 },
      { file: 'content/exams/topic-5.uiux-react.json', id: 'TOPIC5-UIUX-REACT', totalMarks: 50, questions: 10 },
      {
        file: 'content/exams/sprint-1.quiz12.json',
        id: 'SPRINT1-QUIZ12',
        titleZh: 'COMP6080 冲刺卷01',
        totalMarks: 76,
        questions: 10,
      },
      {
        file: 'content/exams/sprint-2.quiz3.json',
        id: 'SPRINT2-QUIZ3',
        titleZh: 'COMP6080 冲刺卷02',
        totalMarks: 80,
        questions: 10,
      },
      {
        file: 'content/exams/sprint-3.final.json',
        id: 'SPRINT3-FINAL',
        titleZh: 'COMP6080 冲刺卷03',
        totalMarks: 80,
        questions: 10,
      },
    ]

    const sync: Record<string, Array<{ week: string; ids: string[] }>> = {
      'TOPIC1-HTML': [{ week: 'week-1', ids: Array.from({ length: 10 }, (_, index) => `TOPIC1-Q${index + 1}`) }],
      'TOPIC2-CSS': [{ week: 'week-2', ids: Array.from({ length: 10 }, (_, index) => `TOPIC2-Q${index + 1}`) }],
      'TOPIC3-JS-DOM': [{ week: 'week-3', ids: Array.from({ length: 10 }, (_, index) => `TOPIC3-Q${index + 1}`) }],
      'TOPIC4-ASYNC-NETWORK': [{ week: 'week-4', ids: Array.from({ length: 10 }, (_, index) => `TOPIC4-Q${index + 1}`) }],
      'TOPIC5-UIUX-REACT': [
        {
          week: 'week-5',
          ids: ['TOPIC5-Q1', 'TOPIC5-Q2', 'TOPIC5-Q3', 'TOPIC5-Q7', 'TOPIC5-Q8'],
        },
        {
          week: 'week-7',
          ids: ['TOPIC5-Q4', 'TOPIC5-Q5', 'TOPIC5-Q6', 'TOPIC5-Q9', 'TOPIC5-Q10'],
        },
      ],
      'SPRINT1-QUIZ12': [
        { week: 'week-1', ids: ['SPRINT1-Q1'] },
        { week: 'week-2', ids: ['SPRINT1-Q2', 'SPRINT1-Q9'] },
        { week: 'week-3', ids: ['SPRINT1-Q3', 'SPRINT1-Q4', 'SPRINT1-Q10'] },
        { week: 'week-4', ids: ['SPRINT1-Q5', 'SPRINT1-Q6'] },
        { week: 'week-5', ids: ['SPRINT1-Q7', 'SPRINT1-Q8'] },
      ],
      'SPRINT2-QUIZ3': [
        {
          week: 'week-7',
          ids: [
            'SPRINT2-Q1',
            'SPRINT2-Q2',
            'SPRINT2-Q3',
            'SPRINT2-Q4',
            'SPRINT2-Q5',
            'SPRINT2-Q6',
            'SPRINT2-Q7',
            'SPRINT2-Q9',
            'SPRINT2-Q10',
          ],
        },
        { week: 'week-3', ids: ['SPRINT2-Q8'] },
      ],
      'SPRINT3-FINAL': [
        {
          week: 'week-7',
          ids: ['SPRINT3-Q1', 'SPRINT3-Q2', 'SPRINT3-Q3', 'SPRINT3-Q4', 'SPRINT3-Q5', 'SPRINT3-Q6'],
        },
        {
          week: 'week-8',
          ids: ['SPRINT3-Q7', 'SPRINT3-Q8', 'SPRINT3-Q9', 'SPRINT3-Q10'],
        },
      ],
    }

    const weekCache = new Map<string, string>()

    for (const meta of papers) {
      const exam = (readJson(meta.file).exams as Paper[])[0]

      expect(exam.id).toBe(meta.id)
      if (meta.titleZh) expect(exam.titleZh).toBe(meta.titleZh)
      expect(exam.totalMarks).toBe(meta.totalMarks)
      expect(Boolean(exam.titleZh && exam.descriptionZh)).toBe(true)
      expect(exam.questions).toHaveLength(meta.questions)
      expect(exam.questions.every((question) => question.subQuestions.length === 3)).toBe(true)
      expect(exam.questions.every((question) => question.displayStyle === 'quiz-sample')).toBe(true)
      expect(exam.questions.every((question) => Boolean(question.displayNumber))).toBe(true)
      expect(
        exam.questions.every((question) => Boolean(question.categoryLabel && question.categoryLabelZh)),
      ).toBe(true)
      expect(exam.questions.every((question) => Boolean(question.titleZh && question.contentMdxZh))).toBe(true)
      expect(
        exam.questions.every((question) => (
          question.subQuestions.every((subQuestion) => (
            Boolean(
              subQuestion.questionMdx
              && subQuestion.answerMdx
              && subQuestion.markingMdx
              && subQuestion.questionMdxZh
              && subQuestion.answerMdxZh
              && subQuestion.markingMdxZh,
            )
          ))
        )),
      ).toBe(true)
      expect(exam.questions.every((question) => (question.mockup?.files.length ?? 0) >= 2)).toBe(true)
      expect(
        exam.questions.every((question) => (
          question.mockup?.files.filter((file) => file.active).length === 1
        )),
      ).toBe(true)
      expect(
        exam.questions.every((question) => (
          question.mockup?.files.every((file) => (
            /\.(html|css|js)$/i.test(file.name) ? Boolean(file.code && file.codeZh) : true
          )) ?? true
        )),
      ).toBe(true)
      expect(
        exam.questions.every((question) => Boolean(
          question.mockup?.html
          && question.mockup?.htmlZh
          && question.mockup?.caption
          && question.mockup?.captionZh
          && question.mockup?.viewport,
        )),
      ).toBe(true)
      expect(exam.questions.reduce((sum, question) => sum + question.marks, 0)).toBe(exam.totalMarks)
      expect(
        exam.questions.every((question) => (
          question.subQuestions.reduce((sum, subQuestion) => sum + subQuestion.marks, 0)
            === question.marks
        )),
      ).toBe(true)

      for (const target of sync[meta.id]) {
        if (!weekCache.has(target.week)) {
          weekCache.set(
            target.week,
            JSON.stringify(readJson(`content/questions/${target.week}.practice.json`)),
          )
        }
        const bank = weekCache.get(target.week) as string
        for (const id of target.ids) {
          expect(bank).toContain(id)
        }
      }
    }
  })
})
