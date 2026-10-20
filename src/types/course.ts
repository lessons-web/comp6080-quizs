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
  /** 讲解：文字 + 占位骨架 */
  | 'content'
  /** 演示：内嵌可运行的原生 HTML 演示页 */
  | 'demo'
  /** 代码：静态代码片段 */
  | 'code'
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
  /** 演示说明 */
  note?: string
}

export interface CourseSlideCode {
  language: string
  filename?: string
  source: string
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
  /** compare 页左右两栏的标题 */
  compare?: { leftTitle: string; rightTitle: string }
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
