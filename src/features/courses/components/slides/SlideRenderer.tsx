'use client'

import { useState } from 'react'

import type { CourseSlide } from '../../../../types/course'
import { PlaceholderBlock, type PlaceholderWidth } from './Placeholder'
import { SlideFrame } from './SlideFrame'

export interface AccentTokens {
  gradient: string
  text: string
}

interface SlideProps {
  slide: CourseSlide
  accent: AccentTokens
}

/* ------------------------------------------------------------------ 封面 */
function CoverSlide({ slide, accent }: SlideProps) {
  return (
    <SlideFrame
      eyebrow={slide.eyebrow}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <ul className="mt-2 space-y-3">
        {(slide.points ?? []).map((point, i) => (
          <li
            key={point}
            className="flex items-start gap-3 rounded-xl border border-[#e3ded4] bg-[#faf8f4] px-4 py-3"
          >
            <span
              className={`course-mono mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${accent.gradient} text-[11px] font-semibold text-white`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[15px] leading-7 text-[#16181d]">{point}</span>
          </li>
        ))}
      </ul>
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 导览 */
function OutlineSlide({ slide, accent }: SlideProps) {
  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '本节导览'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <ol className="mt-2 grid gap-3 sm:grid-cols-2">
        {(slide.points ?? []).map((point, i) => (
          <li
            key={point}
            className="flex items-start gap-3 rounded-xl border border-[#e3ded4] bg-white px-4 py-3.5"
          >
            <span className="course-mono text-[13px] font-semibold text-[#b3470f]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[14.5px] leading-6 text-[#4c5159]">{point}</span>
          </li>
        ))}
      </ol>
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 讲解 */
function ContentSlide({ slide, accent }: SlideProps) {
  const count = slide.placeholderCount ?? 4
  const columns = slide.columns ?? 1

  const blocks = Array.from({ length: count }).map((_, i) => {
    const widths: PlaceholderWidth[] = ['full', 'wide', 'half', 'full', 'wide', 'half']
    return (
      <PlaceholderBlock
        key={i}
        width={widths[i % widths.length]}
        label={`内容占位 · 第 ${i + 1} 段`}
      />
    )
  })

  return (
    <SlideFrame
      eyebrow={slide.eyebrow}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <div
        className={
          columns === 2
            ? 'mt-2 grid gap-4 lg:grid-cols-2'
            : 'mt-2 flex flex-col gap-4'
        }
      >
        {blocks}
      </div>
      <p className="course-mono mt-5 text-[11px] tracking-[0.08em] text-[#8b9099]">
        占位说明：本页将承载「讲解 + 可运行代码演示」，实际内容待补充。
      </p>
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 演示 */
function DemoSlide({ slide, accent }: SlideProps) {
  const { src, url, note } = slide.demo ?? {}
  const target = src ? encodeURI(src) : url

  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '可运行演示'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      {target ? (
        <div className="flex h-full min-h-[420px] flex-col">
          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#e3ded4] bg-white">
            <iframe
              src={target}
              title={slide.title}
              loading="lazy"
              className="h-full w-full"
            />
          </div>
          {note ? (
            <p className="course-mono mt-3 text-[11.5px] leading-5 text-[#8b9099]">
              {note}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-2">
          <PlaceholderBlock width="full" label="演示占位 · 待接入可运行页面" lines={6} />
          <p className="course-mono mt-4 text-[11px] tracking-[0.08em] text-[#8b9099]">
            这里将内嵌一个原生 HTML 演示页（iframe），保证代码可以当场跑起来。
          </p>
        </div>
      )}
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 代码 */
function CodeSlide({ slide, accent }: SlideProps) {
  const [copied, setCopied] = useState(false)
  const code = slide.code

  const handleCopy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code.source)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* 剪贴板不可用时静默失败 */
    }
  }

  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '核心代码'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      {code ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-[#23272f] bg-[#171a21] shadow-[0_2px_4px_rgba(22,24,29,.05),0_10px_24px_-12px_rgba(22,24,29,.18)]">
          <div className="flex items-center gap-3 border-b border-[#2a2f38] bg-[#1d2129] px-3.5 py-2">
            <span className="course-mono text-[11.5px] uppercase tracking-[0.12em] text-[#9aa3b0]">
              {code.language}
            </span>
            {code.filename ? (
              <span className="course-mono ml-auto text-[11.5px] text-[#6d7683]">
                {code.filename}
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleCopy}
              className={`course-mono rounded-full border px-2.5 py-0.5 text-[11px] tracking-[0.06em] transition ${
                copied
                  ? 'border-[#2f6a49] bg-[#1f3a2c] text-[#8fe3b0]'
                  : 'border-[#333a45] bg-[#262b34] text-[#b9c1cc] hover:border-[#46505e] hover:bg-[#333a45] hover:text-white'
              }`}
            >
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          <pre className="course-mono overflow-x-auto p-5 text-[13px] leading-[1.7] text-[#e9e6df]">
            <code>{code.source}</code>
          </pre>
        </div>
      ) : (
        <PlaceholderBlock width="full" label="代码占位" lines={5} />
      )}
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 对比 */
function CompareSlide({ slide, accent }: SlideProps) {
  const left = slide.compare?.leftTitle ?? '✗ 反例'
  const right = slide.compare?.rightTitle ?? '✓ 正例'

  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '对比'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <div className="mt-2 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#f0cdc8] bg-[#fdf3f1] p-4">
          <div className="course-mono mb-3 text-[12.5px] font-semibold tracking-[0.06em] text-[#b3261e]">
            {left}
          </div>
          <div className="space-y-3">
            <PlaceholderBlock width="full" label="反例占位" lines={3} />
          </div>
        </div>
        <div className="rounded-xl border border-[#cfe7db] bg-[#f1f9f5] p-4">
          <div className="course-mono mb-3 text-[12.5px] font-semibold tracking-[0.06em] text-[#1f7a4d]">
            {right}
          </div>
          <div className="space-y-3">
            <PlaceholderBlock width="full" label="正例占位" lines={3} />
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 小结 */
function ClosingSlide({ slide, accent }: SlideProps) {
  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '本节小结'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <ul className="mt-2 grid gap-4 sm:grid-cols-3">
        {(slide.points ?? []).map((point, i) => (
          <li
            key={point}
            className="flex flex-col gap-2 rounded-xl border border-[#e3ded4] bg-white p-4"
          >
            <span className={`course-mono text-[12px] ${accent.text}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[14.5px] leading-6 font-medium text-[#16181d]">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </SlideFrame>
  )
}

/* --------------------------------------------------------------- 分发器 */
export function SlideRenderer({ slide, accent }: SlideProps) {
  switch (slide.kind) {
    case 'cover':
      return <CoverSlide slide={slide} accent={accent} />
    case 'outline':
      return <OutlineSlide slide={slide} accent={accent} />
    case 'demo':
      return <DemoSlide slide={slide} accent={accent} />
    case 'code':
      return <CodeSlide slide={slide} accent={accent} />
    case 'compare':
      return <CompareSlide slide={slide} accent={accent} />
    case 'closing':
      return <ClosingSlide slide={slide} accent={accent} />
    case 'content':
    default:
      return <ContentSlide slide={slide} accent={accent} />
  }
}
