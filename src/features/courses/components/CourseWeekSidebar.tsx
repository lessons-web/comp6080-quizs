'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'

import { COURSE_WEEKS, WEEK_ACCENT, getCourseStats } from '../../../lib/content/courses'
import { isPublicCourseWeek, type CourseWeekId } from '../../../types/course'

export interface CourseWeekSidebarProps {
  activeWeekId?: CourseWeekId | null
  activeLessonId?: string | null
}

/**
 * 课程侧边栏：二级菜单。一级是 Week 1 → Week 8，点击展开后列出该周知识点。
 * 展开状态用「显式覆盖表」管理，默认展开当前所在周，无需在 effect 里同步路由状态。
 */
export function CourseWeekSidebar({
  activeWeekId = null,
  activeLessonId = null,
}: CourseWeekSidebarProps) {
  const { user } = useAuth()
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  const stats = getCourseStats()
  const defaultOpenWeekId = activeWeekId
  const canAccessLockedWeeks = user?.role === 'admin' || user?.role === 'student'

  const isOpen = (id: string) =>
    overrides[id] ?? (defaultOpenWeekId !== null && id === defaultOpenWeekId)

  const toggle = (id: string) =>
    setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? id === defaultOpenWeekId) }))

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col overflow-hidden border-r border-[#e3ded4] bg-[#faf8f4]">
      <div className="flex items-center gap-2 border-b border-[#e3ded4] px-4 py-4">
        <Link
          href="/courses"
          className="course-mono inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[12px] text-[#8b9099] transition hover:bg-[#f4f1ea] hover:text-[#b3470f]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          课程首页
        </Link>
        <span className="course-mono ml-auto shrink-0 rounded-full bg-[#f4f1ea] px-2.5 py-0.5 text-[11px] text-[#4c5159]">
          {stats.lessonCount} 个知识点
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <p className="course-mono px-3 pb-2 text-[10.5px] uppercase tracking-[0.16em] text-[#8b9099]">
          按周学习 · Week 1 – Week {COURSE_WEEKS.length}
        </p>

        <ul className="space-y-1">
          {COURSE_WEEKS.map((week) => {
            const accent = WEEK_ACCENT[week.accent]
            const open = isOpen(week.id)
            const isActiveWeek = activeWeekId === week.id
            const locked = !isPublicCourseWeek(week.id) && !canAccessLockedWeeks

            return (
              <li key={week.id}>
                <button
                  type="button"
                  onClick={() => toggle(week.id)}
                  aria-expanded={open}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                    isActiveWeek ? 'bg-white shadow-sm ring-1 ring-[#e3ded4]' : 'hover:bg-[#f4f1ea]'
                  }`}
                >
                  <span
                    className={`course-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${accent.gradient} text-[11px] font-semibold text-white`}
                  >
                    W{week.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13.5px] font-semibold text-[#16181d]">
                        {week.title}
                      </span>
                      {locked ? (
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 shrink-0 text-[#b07d44]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="10" rx="2" />
                          <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                        </svg>
                      ) : null}
                    </span>
                    <span className={`course-mono block truncate text-[10.5px] tracking-[0.08em] ${accent.text}`}>
                      {week.theme} · {week.lessons.length} 节
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 shrink-0 text-[#8b9099] transition-transform ${open ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {open ? (
                  <ul className="mb-1 mt-1 space-y-0.5 border-l border-[#e3ded4] pl-2 ml-[26px]">
                    {week.lessons.map((lesson, i) => {
                      const active =
                        isActiveWeek && activeLessonId === lesson.id
                      const href = locked
                        ? `/login?redirect=${encodeURIComponent(`/courses/${week.id}/${lesson.id}`)}`
                        : `/courses/${week.id}/${lesson.id}`
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={href}
                            className={`flex items-start gap-2 rounded-md px-2.5 py-1.5 transition ${
                              active
                                ? 'bg-[#fdf1e8] text-[#b3470f]'
                                : 'text-[#4c5159] hover:bg-[#f4f1ea] hover:text-[#16181d]'
                            }`}
                          >
                            <span className="course-mono mt-0.5 text-[10px] tabular-nums text-[#8b9099]">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="min-w-0 flex-1 text-[13px] leading-5">
                              {lesson.short}
                            </span>
                            {locked ? (
                              <svg
                                aria-hidden
                                viewBox="0 0 24 24"
                                className="mt-1 h-3.5 w-3.5 shrink-0 text-[#b07d44]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                              </svg>
                            ) : (
                              <span
                                aria-hidden
                                title={lesson.status === 'ready' ? '已接入演示' : '内容占位'}
                                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                                  lesson.status === 'ready' ? 'bg-emerald-500' : 'bg-[#cfc8bb]'
                                }`}
                              />
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>

      {!canAccessLockedWeeks ? (
        <div className="border-t border-[#e3ded4] bg-[#faf0e2] px-4 py-3">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold leading-5 text-[#9f5d24]">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V8a5 5 0 0 1 10 0v3" />
            </svg>
            <span>
              <strong>Week 1–3 默认开放</strong>
              <span className="mx-1.5 text-[#c89c67]">·</span>
              <strong>Week 4 之后登录解锁</strong>
            </span>
          </p>
        </div>
      ) : null}
    </aside>
  )
}
