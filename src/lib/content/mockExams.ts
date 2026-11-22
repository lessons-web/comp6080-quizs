import type { MockExamCollection, ExamPaper } from '../../types/content'

const examLoaders: Record<string, () => Promise<MockExamCollection>> = {
  'week-1.mock-exams': () =>
    import('@/content/exams/week-1.mock-exams.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'week-2.mock-exams': () =>
    import('@/content/exams/week-2.mock-exams.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'week-3.mock-exams': () =>
    import('@/content/exams/week-3.mock-exams.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'week-4.mock-exams': () =>
    import('@/content/exams/week-4.mock-exams.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'mock-exam-1': () =>
    import('@/content/exams/mock-exam-1.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'mock-exam-2': () =>
    import('@/content/exams/mock-exam-2.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'quiz-2.mock-exams': () =>
    import('@/content/exams/quiz-2.mock-exams.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'quiz-3.mock-exams': () =>
    import('@/content/exams/quiz-3.mock-exams.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'topic-1.html': () =>
    import('@/content/exams/topic-1.html.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'topic-2.css': () =>
    import('@/content/exams/topic-2.css.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'topic-3.js-dom': () =>
    import('@/content/exams/topic-3.js-dom.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'topic-4.async-network': () =>
    import('@/content/exams/topic-4.async-network.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'topic-5.uiux-react': () =>
    import('@/content/exams/topic-5.uiux-react.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'sprint-1.quiz12': () =>
    import('@/content/exams/sprint-1.quiz12.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'sprint-2.quiz3': () =>
    import('@/content/exams/sprint-2.quiz3.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
  'sprint-3.final': () =>
    import('@/content/exams/sprint-3.final.json').then(
      (m) => m.default as unknown as MockExamCollection,
    ),
}

export async function getAllMockExams(): Promise<ExamPaper[]> {
  const loaders = Object.values(examLoaders)
  const collections = await Promise.all(loaders.map((load) => load()))

  const allExams: ExamPaper[] = []
  for (const collection of collections) {
    if (collection && collection.exams) {
      allExams.push(...collection.exams)
    }
  }
  return allExams
}

export async function getMockExamById(id: string): Promise<ExamPaper | null> {
  const allExams = await getAllMockExams()
  return allExams.find((exam) => exam.id === id) || null
}
