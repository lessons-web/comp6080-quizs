'use client'

import type { ReactNode } from 'react'

export interface SlideFrameProps {
  eyebrow?: string
  title: string
  subtitle?: string
  /** 页眉强调色（来自周主题），如 text-emerald-700 */
  accentText: string
  /** 顶部色条渐变，如 from-emerald-500 to-green-600 */
  accentGradient: string
  children?: ReactNode
}

/**
 * 幻灯片外框：统一页眉（眉标 + 标题 + 副标题）与内容区。
 * 内容区独立滚动，保证长内容不会撑破翻页容器。
 */
export function SlideFrame({
  eyebrow,
  title,
  subtitle,
  accentText,
  accentGradient,
  children,
}: SlideFrameProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#e3ded4] bg-[#fffdfa] shadow-[0_2px_4px_rgba(22,24,29,.05),0_24px_48px_-24px_rgba(22,24,29,.28)]">
      <div className={`h-1.5 w-full bg-gradient-to-r ${accentGradient}`} />
      <div className="flex min-h-0 flex-1 flex-col px-8 py-7 lg:px-14 lg:py-10">
        <header className="mb-6 shrink-0">
          {eyebrow ? (
            <div
              className={`course-mono mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] ${accentText}`}
            >
              <span className="h-px w-6 bg-current" />
              {eyebrow}
            </div>
          ) : null}
          <h2 className="course-serif text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#16181d] lg:text-[34px]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 max-w-[62ch] text-[15px] leading-7 text-[#4c5159]">
              {subtitle}
            </p>
          ) : null}
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
