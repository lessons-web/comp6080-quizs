'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { WEEK_ACCENT } from '../../../lib/content/courses'
import type {
  CourseLesson,
  CourseSlideKind,
  CourseWeek,
} from '../../../types/course'
import { SlideRenderer } from './slides/SlideRenderer'

const KIND_LABEL: Record<CourseSlideKind, string> = {
  cover: '封面',
  outline: '导览',
  roadmap: '主线',
  cards: '总览',
  content: '讲解',
  demo: '演示',
  code: '代码',
  codes: '代码对比',
  compare: '对比',
  closing: '小结',
}

export interface SlideDeckProps {
  week: CourseWeek
  lesson: CourseLesson
}

/**
 * PPT 式翻页容器：一页一个知识点，支持按钮 / 键盘 / 目录跳转。
 * 通过父组件传入的 key={lesson.id} 在切换知识点时自动重置到第一页。
 */
export function SlideDeck({ week, lesson }: SlideDeckProps) {
  const accent = useMemo(() => {
    const meta = WEEK_ACCENT[week.accent]
    return { gradient: meta.gradient, text: meta.text, softBg: meta.softBg }
  }, [week.accent])

  const slides = lesson.slides
  const [index, setIndex] = useState(0)
  const [outlineOpen, setOutlineOpen] = useState(false)

  const lessonIndex = week.lessons.findIndex((l) => l.id === lesson.id)
  const lessonOrder = lessonIndex >= 0 ? lessonIndex + 1 : null
  const prevLesson = lessonIndex > 0 ? week.lessons[lessonIndex - 1] : null
  const nextLesson =
    lessonIndex >= 0 && lessonIndex < week.lessons.length - 1
      ? week.lessons[lessonIndex + 1]
      : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setIndex((i) => Math.min(slides.length - 1, i + 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setIndex((i) => Math.max(0, i - 1))
      } else if (e.key === 'Home') {
        setIndex(0)
      } else if (e.key === 'End') {
        setIndex(slides.length - 1)
      } else if (e.key === 'Escape') {
        setOutlineOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length])

  const current = slides[Math.min(index, slides.length - 1)]
  const progress = slides.length > 0 ? ((index + 1) / slides.length) * 100 : 0

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-3 p-3 lg:p-4">
      {/* 顶部工具条 */}
      <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={`course-mono inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${accent.gradient} px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white`}
        >
          Week {week.index}
        </span>
        <div className="min-w-0">
          <h1 className="course-serif truncate text-[17px] font-semibold leading-6 text-[#16181d]">
            {lesson.title}
          </h1>
          <p className="course-mono truncate text-[11px] tracking-[0.06em] text-[#8b9099]">
            {lessonOrder ? `第 ${lessonOrder} 节 / 共 ${week.lessons.length} 节` : '课程内容'} ·{' '}
            {lesson.status === 'ready' ? '已接入演示' : '内容占位'} · 共 {slides.length} 页
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOutlineOpen((v) => !v)}
            className="course-mono inline-flex items-center gap-1.5 rounded-full border border-[#cfc8bb] bg-white px-3 py-1.5 text-[12px] text-[#4c5159] transition hover:border-[#b3470f] hover:text-[#b3470f]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            本节目录
          </button>
          <div className="flex items-center gap-1">
            {prevLesson ? (
              <Link
                href={`/courses/${week.id}/${prevLesson.id}`}
                title={`上一节：${prevLesson.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#cfc8bb] bg-white text-[#4c5159] transition hover:border-[#b3470f] hover:text-[#b3470f]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Link>
            ) : null}
            {nextLesson ? (
              <Link
                href={`/courses/${week.id}/${nextLesson.id}`}
                title={`下一节：${nextLesson.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#cfc8bb] bg-white text-[#4c5159] transition hover:border-[#b3470f] hover:text-[#b3470f]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {/* 幻灯片舞台 */}
      <main className="min-h-0 flex-1">
        <SlideRenderer
          key={current?.id ?? index}
          slide={current}
          accent={{ gradient: accent.gradient, text: accent.text }}
        />
      </main>

      {/* 翻页控制条 */}
      <footer className="flex shrink-0 items-center gap-4 rounded-xl border border-[#e3ded4] bg-[#fffdfa] px-4 py-2.5">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#cfc8bb] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#16181d] transition enabled:hover:border-[#b3470f] enabled:hover:text-[#b3470f] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          上一页
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#e3ded4]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${accent.gradient} transition-[width] duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="course-mono shrink-0 text-[12px] tabular-nums text-[#4c5159]">
            {index + 1} / {slides.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
          disabled={index >= slides.length - 1}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#b3470f] px-3.5 py-1.5 text-[13px] font-medium text-white transition enabled:hover:bg-[#9b3c0c] disabled:cursor-not-allowed disabled:opacity-40"
        >
          下一页
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </footer>

      <p className="course-mono shrink-0 px-1 text-[10.5px] tracking-[0.06em] text-[#8b9099]">
        快捷键：← → 翻页 · Home / End 跳到首尾 · Esc 关闭目录
      </p>

      {/* 本节目录浮层 */}
      {outlineOpen ? (
        <div className="absolute right-4 top-16 z-30 w-72 overflow-hidden rounded-xl border border-[#e3ded4] bg-[#fffdfa] shadow-[0_24px_48px_-24px_rgba(22,24,29,.28)]">
          <div className="course-mono border-b border-[#e3ded4] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[#8b9099]">
            本节目录
          </div>
          <ol className="max-h-[52vh] overflow-y-auto p-2">
            {slides.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i)
                    setOutlineOpen(false)
                  }}
                  className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition ${
                    i === index ? 'bg-[#fdf1e8]' : 'hover:bg-[#f4f1ea]'
                  }`}
                >
                  <span className="course-mono mt-0.5 text-[11px] tabular-nums text-[#8b9099]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-[#16181d]">
                      {s.title}
                    </span>
                    <span className={`course-mono text-[10.5px] uppercase tracking-[0.1em] ${accent.text}`}>
                      {KIND_LABEL[s.kind]}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
