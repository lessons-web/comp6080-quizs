export type WeekTag = `week-${number}`

export type Difficulty = 'easy' | 'medium' | 'hard'

export const TOPIC_META = {
  html: {
    label: 'HTML',
    defaultWeek: 'week-1',
    description: '文档结构与语义化',
    accent: 'from-orange-500 to-red-500',
  },
  css: {
    label: 'CSS',
    defaultWeek: 'week-1',
    description: '样式与布局系统',
    accent: 'from-sky-500 to-blue-600',
  },
  javascript: {
    label: 'JavaScript',
    defaultWeek: 'week-2',
    description: '语言核心与异步模型',
    accent: 'from-yellow-400 to-amber-500',
  },
  react: {
    label: 'React',
    defaultWeek: 'week-3',
    description: '组件化与状态管理',
    accent: 'from-cyan-400 to-sky-500',
  },
  nodejs: {
    label: 'Node.js',
    defaultWeek: 'week-4',
    description: '服务端运行时与生态',
    accent: 'from-emerald-500 to-green-600',
  },
} satisfies Record<string, {
  label: string
  defaultWeek: WeekTag
  description: string
  accent: string
}>

export type TopicId = keyof typeof TOPIC_META

export interface ContentCodeBlock {
  language: string
  code: string
}

export interface ContentImage {
  src: string
  alt: string
}

export interface KnowledgePointMeta {
  id: string
  title: string
  topic: TopicId
  category: string
  difficulty: Difficulty
  tags: WeekTag[]
  summary: string
  createdAt: string
  updatedAt?: string
}

export interface PracticeQuestion {
  id: string
  topic: TopicId
  weeks: WeekTag[]
  difficulty: Difficulty
  tags: string[]
  question: string
  knowledgePoint: string
  answerExplanation: string
  codeBlocks: ContentCodeBlock[]
  images: ContentImage[]
  createdAt: string
}

export interface PracticeQuestionCollection {
  topic: TopicId
  questions: PracticeQuestion[]
}

export interface ExamSubQuestion {
  id: string
  label: string
  marks: number
  questionMdx: string
  answerMdx: string
  markingMdx?: string
}

export interface ExamQuestion {
  id: string
  title: string
  marks: number
  contentMdx: string
  subQuestions: ExamSubQuestion[]
}

export interface ExamPaper {
  id: string
  title: string
  description?: string
  tags?: string[]
  totalMarks: number
  questions: ExamQuestion[]
}

export interface MockExamCollection {
  topic: TopicId
  exams: ExamPaper[]
}
