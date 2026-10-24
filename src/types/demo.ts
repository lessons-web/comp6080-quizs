import type { CourseSlideCode, CourseWeekId } from './course'

export interface DemoDefinition {
  route: string
  slug: string[]
  title: string
  subtitle: string
  weekId: CourseWeekId
  lessonId: string
  lessonTitle: string
  objectives: string[]
  sourceHtmlPath: string
  codes: CourseSlideCode[]
  backToCourseHref: string
  topicLabel: string
}
