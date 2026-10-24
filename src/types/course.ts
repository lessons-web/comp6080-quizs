import type { TopicId } from './content'

/**
 * 课程模块（/courses）类型定义。
 *
 * 与「知识点解析」按技术领域划分不同，课程模块按老师授课进度重组为 8 周：
 * 一周一个 Week，学生按周逐步推进。
 *
 * 每个知识点（Lesson）不是 Markdown，而是一套「幻灯片（Slide）」——
 * 因为无论 HTML 还是 JS，知识点都必须靠可运行的代码演示才能讲透。
 */

export type CourseWeekId =
  | 'week-1'
  | 'week-2'
  | 'week-3'
  | 'week-4'
  | 'week-5'
  | 'week-6'
  | 'week-7'
  | 'week-8'

/** 默认开放试听的周次：Week 1 ~ Week 3 */
export const PUBLIC_COURSE_WEEK_IDS: readonly CourseWeekId[] = [
  'week-1',
  'week-2',
  'week-3',
]

export function isPublicCourseWeek(weekId: CourseWeekId) {
  return PUBLIC_COURSE_WEEK_IDS.includes(weekId)
}

/** 周主题配色键，映射表见 lib/content/courses.ts 的 WEEK_ACCENT */
export type CourseAccentKey =
  | 'amber'
  | 'sky'
  | 'yellow'
  | 'emerald'
  | 'violet'
  | 'rose'

export type CourseSlideKind =
  /** 封面：本节标题 + 将要覆盖的要点 */
  | 'cover'
  /** 导览：这一节回答哪些问题 */
  | 'outline'
  /** 路线图：把本节知识点串成一条主线 */
  | 'roadmap'
  /** 卡片总览：固定卡片阵列，适合章节地图 */
  | 'cards'
  /** 讲解：真实知识点内容（段落 / 要点 / 表格 / 提示条），无内容时退回占位骨架 */
  | 'content'
  /** 演示：内嵌可运行的原生 HTML 演示页 */
  | 'demo'
  /** 代码：静态代码片段 */
  | 'code'
  /** 多段代码：并列对比同一份数据的多种写法（如 JSON / YAML / XML） */
  | 'codes'
  /** 对比：好坏 / 对错两栏 */
  | 'compare'
  /** 小结：收尾要点 */
  | 'closing'

/** 演示页来源：优先 iframe 内嵌本地静态页 */
export interface CourseSlideDemo {
  /** 内嵌的静态 HTML 地址（public 目录下，如 /course-demos/week4/01-xxx.html） */
  src?: string
  /** 需要新窗口打开的完整外部地址 */
  url?: string
  /** 独立 demos 模块中的实验路由 */
  route?: string
  /** 课程页实验入口按钮文案 */
  ctaLabel?: string
  /** 课程页实验入口页中的观察目标 */
  objectives?: string[]
  /** 演示说明 */
  note?: string
}

export interface CourseSlideCode {
  language: string
  filename?: string
  source: string
  /** 需要强调的代码行（从 1 开始） */
  highlightLines?: number[]
}

export interface CourseSlideRoadmapItem {
  label: string
  title: string
  description: string
}

export interface CourseSlideCard {
  eyebrow?: string
  title: string
  description: string
  meta?: string
}

export interface CourseSlideFlowStep {
  label?: string
  title: string
  description: string
  meta?: string
}

/** 知识点页的要点条目 */
export interface CourseSlideBullet {
  title: string
  text: string
  /** 该要点对应的最小代码例子 */
  code?: CourseSlideCode
}

/** 提示条语气：规则 / 建议 / 注意 / 陷阱 */
export type CourseSlideNoteTone = 'rule' | 'tip' | 'warn' | 'trap'

/** 知识点页底部的提示条 */
export interface CourseSlideNote {
  tone: CourseSlideNoteTone
  /** 提示条前缀，如「一句话」「陷阱」 */
  label?: string
  text: string
}

/** 知识点页的对比表 */
export interface CourseSlideTable {
  headers: string[]
  rows: string[][]
}

/** 对比页的其中一栏 */
export interface CourseSlideCompareSide {
  /** 该栏展示的代码块 */
  code?: CourseSlideCode
  /** 该栏展示的要点 */
  items?: string[]
}

export interface CourseSlide {
  id: string
  kind: CourseSlideKind
  /** 页眉小标题，如「知识点 1.2」 */
  eyebrow?: string
  title: string
  subtitle?: string
  /** 要点列表：cover / outline / closing 使用 */
  points?: string[]
  /** content 页分栏数，默认 1 */
  columns?: 1 | 2
  /** content 页占位骨架的条目数，默认 4 */
  placeholderCount?: number
  demo?: CourseSlideDemo
  code?: CourseSlideCode
  /** codes 页并列展示的多段代码 */
  codes?: CourseSlideCode[]
  roadmap?: CourseSlideRoadmapItem[]
  cards?: CourseSlideCard[]
  /** content 页正文段落 */
  paragraphs?: string[]
  /** content 页要点列表 */
  bullets?: CourseSlideBullet[]
  /** content 页流程图步骤 */
  flow?: CourseSlideFlowStep[]
  /** content 页对比表 */
  table?: CourseSlideTable
  /** content 页底部提示条 */
  note?: CourseSlideNote
  /** compare 页左右两栏的标题与内容 */
  compare?: {
    leftTitle: string
    rightTitle: string
    left?: CourseSlideCompareSide
    right?: CourseSlideCompareSide
  }
}

/** ready = 已接入真实演示；placeholder = 仅占位骨架，待补充 */
export type CourseLessonStatus = 'ready' | 'placeholder'

export interface CourseLesson {
  id: string
  title: string
  /** 侧边栏与面包屑使用的短标题 */
  short: string
  summary: string
  tags: string[]
  status: CourseLessonStatus
  slides: CourseSlide[]
}

export interface CourseWeek {
  id: CourseWeekId
  /** 1 起，用于展示 Week N */
  index: number
  title: string
  /** 一句话主线，如「数据从服务器来」 */
  theme: string
  description: string
  accent: CourseAccentKey
  /** 关联的技术领域，用于联动题库中心 */
  topics: TopicId[]
  lessons: CourseLesson[]
}
