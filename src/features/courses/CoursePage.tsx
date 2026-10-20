'use client'

import { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { CourseHome } from './components/CourseHome'
import { CourseWeekSidebar } from './components/CourseWeekSidebar'
import { SlideDeck } from './components/SlideDeck'
import {
  getCourseLesson,
  getFirstLessonId,
  isCourseWeekId,
} from '../../lib/content/courses'
import type { CourseWeekId } from '../../types/course'

function extractSegments(rest: string | string[] | undefined): string[] {
  if (!rest) return []
  if (Array.isArray(rest)) return rest.filter(Boolean)
  return rest.split('/').filter(Boolean)
}

/**
 * 课程模块编排层。
 *
 * 路由形态：
 *   /courses                         → 课程首页（按周卡片）
 *   /courses/week-4                  → 重定向到该周第一节
 *   /courses/week-4/xhr              → 左侧周次菜单 + 右侧 PPT 翻页
 */
export function CoursePage() {
  const params = useParams<{ slug?: string[] }>()
  const router = useRouter()
  const [weekStr, lessonId] = extractSegments(params?.slug)
  const weekId: CourseWeekId | null =
    weekStr && isCourseWeekId(weekStr) ? weekStr : null

  // 解析出当前知识点；若 lessonId 非法或缺失，回落到该周第一节。
  const resolved = useMemo(() => {
    if (!weekId) return null
    if (lessonId) {
      const hit = getCourseLesson(weekId, lessonId)
      if (hit) return hit
    }
    const firstId = getFirstLessonId(weekId)
    return firstId ? getCourseLesson(weekId, firstId) : null
  }, [weekId, lessonId])

  // URL 与解析结果不一致时（缺节 / 节名错误）纠正地址栏。
  useEffect(() => {
    if (!weekId) return
    if (resolved && lessonId === resolved.lesson.id) return
    if (resolved) router.replace(`/courses/${weekId}/${resolved.lesson.id}`)
  }, [weekId, lessonId, resolved, router])
  const activeWeekId = resolved?.week.id ?? null
  const activeLessonId = resolved?.lesson.id ?? null

  return (
    <div className="course-sans flex h-full w-full bg-[#faf8f4]">
      <CourseWeekSidebar
        activeWeekId={activeWeekId}
        activeLessonId={activeLessonId}
      />
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {resolved ? (
          <SlideDeck
            key={resolved.lesson.id}
            week={resolved.week}
            lesson={resolved.lesson}
          />
        ) : (
          <CourseHome />
        )}
      </section>
    </div>
  )
}
