import type { MockExamCollection, ExamPaper } from '../../types/content'

const examLoaders: Record<string, () => Promise<MockExamCollection>> = {
  'week-1.mock-exams': () =>
    import('@/content/exams/week-1.mock-exams.json') as Promise<MockExamCollection>,
  'week-2.mock-exams': () =>
    import('@/content/exams/week-2.mock-exams.json') as Promise<MockExamCollection>,
  'week-3.mock-exams': () =>
    import('@/content/exams/week-3.mock-exams.json') as Promise<MockExamCollection>,
  'week-4.mock-exams': () =>
    import('@/content/exams/week-4.mock-exams.json') as Promise<MockExamCollection>,
  'mock-exam-1': () =>
    import('@/content/exams/mock-exam-1.json') as Promise<MockExamCollection>,
  'mock-exam-2': () =>
    import('@/content/exams/mock-exam-2.json') as Promise<MockExamCollection>,
  'week1-sim': () =>
    import('@/content/exams/week1-sim.json') as Promise<MockExamCollection>,
  'week2-sim': () =>
    import('@/content/exams/week2-sim.json') as Promise<MockExamCollection>,
  'week3-sim': () =>
    import('@/content/exams/week3-sim.json') as Promise<MockExamCollection>,
  'week4-sim': () =>
    import('@/content/exams/week4-sim.json') as Promise<MockExamCollection>,
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
