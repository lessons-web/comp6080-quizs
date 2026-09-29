export type WeekId = 'week-1' | 'week-2' | 'week-3' | 'week-4'

export interface ContentCodeBlock {
  language: string
  code: string
}

export interface ContentImage {
  src: string
  alt: string
}

export interface KnowledgeFrontmatter {
  title: string
  week: WeekId
  summary: string
}

export interface PracticeQuestion {
  id: string
  topic: string
  question: string
  knowledgePoint: string
  answerExplanation: string
  codeBlocks: ContentCodeBlock[]
  images: ContentImage[]
}

export interface PracticeQuestionCollection {
  week: WeekId
  questions: PracticeQuestion[]
}

export interface MockExamQuestion {
  id: string
  question: string
  knowledgePoint: string
  answerExplanation: string
  codeBlocks: ContentCodeBlock[]
  images: ContentImage[]
}

export interface MockExam {
  id: string
  title: string
  questions: MockExamQuestion[]
}

export interface MockExamCollection {
  week: WeekId
  exams: MockExam[]
}
