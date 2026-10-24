import type { CourseWeekId } from './course'

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
  backToCourseHref: string
  topicLabel: string
}
