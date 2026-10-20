'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'

import { COURSE_WEEKS, WEEK_ACCENT, getCourseStats } from '../../../lib/content/courses'
import { isPublicCourseWeek } from '../../../types/course'

/**
 * 课程首页：按周展开的课程地图。
 * 与「知识点解析」的技术领域卡片不同，这里的主轴是老师的授课进度。
 */
export function CourseHome() {
  const { user } = useAuth()
  const stats = getCourseStats()
  const canAccessLockedWeeks = user?.role === 'admin' || user?.role === 'student'

  return (
    <div className="course-sans h-full w-full overflow-y-auto bg-[#f7f4ed]">
      <div className="mx-auto w-full max-w-[1380px] px-6 pb-16 pt-8 lg:px-8 xl:px-10">
        <section className="overflow-hidden rounded-[28px] border border-[#e3ded4] bg-[#fffdfa] shadow-[0_2px_4px_rgba(22,24,29,.04),0_28px_60px_-36px_rgba(22,24,29,.18)]">
          <div className="px-6 py-7 lg:px-8 lg:py-8">
            <div className="course-mono mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#0d6a63]">
              <span className="h-px w-6 bg-current" />
              COMP6080 · 课程
            </div>
            <h1 className="course-mono max-w-none text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-[#16181d]">
              对接课程知识点，深化 COMP6080 前端知识体系
            </h1>
            <p className="mt-4 w-full text-md leading-7 text-[#4c5159]">
              课程模块以老师授课主线为骨架，按 Week 1 到 Week 8 重新组织核心内容，把分散的 HTML、CSS、JavaScript、React、UI/UX、
              可访问性与测试知识串成一套连续的学习路径。左侧按周展开，右侧承载每节 PPT 式知识点与代码演示入口；需要动代码的地方，
              直接内嵌可运行的原生 HTML 演示，帮助学生从“知道概念”走到“真正理解并能应用”。其中 Week 1–3 默认开放试听，
              Week 4 之后登录学员账号解锁。
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <HeroTag label="周次" value={`${stats.weekCount} 周`} />
              <HeroTag label="知识点" value={`${stats.lessonCount} 节`} />
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {COURSE_WEEKS.map((week) => {
            const accent = WEEK_ACCENT[week.accent]
            const first = week.lessons[0]
            const locked = !isPublicCourseWeek(week.id) && !canAccessLockedWeeks
            const entryHref = first
              ? locked
                ? `/login?redirect=${encodeURIComponent(`/courses/${week.id}/${first.id}`)}`
                : `/courses/${week.id}/${first.id}`
              : '/courses'
            return (
              <section
                key={week.id}
                className="group flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-[#e3ded4] bg-[#fffdfa] shadow-[0_1px_2px_rgba(22,24,29,.05)] transition hover:-translate-y-0.5 hover:border-[#cfc8bb] hover:shadow-[0_2px_4px_rgba(22,24,29,.05),0_10px_24px_-12px_rgba(22,24,29,.18)]"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${accent.gradient}`} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`course-mono flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accent.gradient} text-[12px] font-semibold text-white`}
                    >
                      W{week.index}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="course-serif truncate text-[17px] font-semibold text-[#16181d]">
                          {week.title}
                        </h2>
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
                      </div>
                      <p className={`course-mono text-[10.5px] uppercase tracking-[0.1em] ${accent.text}`}>
                        {week.theme}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-[13.5px] leading-6 text-[#4c5159]">
                    {week.description}
                  </p>

                  <ul className="mt-4 flex-1 space-y-1.5">
                    {week.lessons.slice(0, 4).map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={
                            locked
                              ? `/login?redirect=${encodeURIComponent(`/courses/${week.id}/${lesson.id}`)}`
                              : `/courses/${week.id}/${lesson.id}`
                          }
                          className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[13px] text-[#4c5159] transition hover:bg-[#f4f1ea] hover:text-[#16181d]"
                        >
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
                          ) : (
                            <span
                              aria-hidden
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                lesson.status === 'ready' ? 'bg-emerald-500' : 'bg-[#cfc8bb]'
                              }`}
                            />
                          )}
                          <span className="truncate">{lesson.short}</span>
                        </Link>
                      </li>
                    ))}
                    {week.lessons.length > 4 ? (
                      <li className="course-mono px-1.5 pt-1 text-[11px] text-[#8b9099]">
                        还有 {week.lessons.length - 4} 节…
                      </li>
                    ) : null}
                  </ul>

                  {first ? (
                    <Link
                      href={entryHref}
                      className="course-mono mt-5 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.08em] text-[#b3470f]"
                    >
                      {locked ? '登录解锁' : '开始学习'}
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : null}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function HeroTag({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd5c8] bg-[#faf8f4] px-3 py-1.5">
      <div className="course-mono text-[10.5px] uppercase tracking-[0.12em] text-[#8b9099]">
        {label}
      </div>
      <div className="course-mono text-[12.5px] font-semibold text-[#16181d]">
        {value}
      </div>
    </div>
  )
}
