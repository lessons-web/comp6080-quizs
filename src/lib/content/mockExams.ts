import type { MockExamCollection, ExamPaper } from '../../types/content'

const examModules = import.meta.glob<MockExamCollection>(
  '../../../content/exams/*.json',
  { eager: false },
)

export async function getAllMockExams(): Promise<ExamPaper[]> {
  const loaders = Object.values(examModules)
  const collections = await Promise.all(loaders.map(load => load()))
  
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
  return allExams.find(exam => exam.id === id) || null
}
