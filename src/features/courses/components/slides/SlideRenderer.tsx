'use client'

import Link from 'next/link'
import { useState } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import 'highlight.js/styles/github-dark.css'

import type {
  CourseSlide,
  CourseSlideCode,
  CourseSlideCompareSide,
  CourseSlideNote,
  CourseSlideNoteTone,
  CourseSlideTable,
} from '../../../../types/course'
import { PlaceholderBlock, type PlaceholderWidth } from './Placeholder'
import { SlideFrame } from './SlideFrame'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)

export interface AccentTokens {
  gradient: string
  text: string
}

interface SlideProps {
  slide: CourseSlide
  accent: AccentTokens
}

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function highlightLine(source: string, language: string) {
  if (!source.trim()) {
    return '&nbsp;'
  }

  try {
    const normalized = language.toLowerCase()
    if (hljs.getLanguage(normalized)) {
      return hljs.highlight(source, { language: normalized }).value
    }
  } catch {
    /* 回退到纯文本 */
  }

  return escapeHtml(source)
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

/* ------------------------------------------------------------------ 主线地图 */
function RoadmapSlide({ slide, accent }: SlideProps) {
  const items = slide.roadmap ?? []

  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '主线地图'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <div className="mt-2 grid gap-3 lg:grid-cols-5">
        {items.map((item, index) => (
          <div key={`${item.label}-${item.title}`} className="flex items-center gap-3">
            <article className="min-w-0 flex-1 rounded-2xl border border-[#d9e8df] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf8_100%)] p-4 shadow-[0_8px_20px_-18px_rgba(31,122,77,.45)]">
              <div className={`course-mono text-[11px] font-semibold tracking-[0.14em] ${accent.text}`}>
                {item.label}
              </div>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-[#16181d]">
                {item.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-6 text-[#4c5159]">
                {item.description}
              </p>
            </article>
            {index < items.length - 1 ? (
              <div className="hidden shrink-0 lg:flex">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-[#8ab49b]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[#dce7df] bg-[#f8fbf8] px-4 py-3">
        <p className="text-[14px] leading-6 text-[#3f5a4b]">
          这 5 个知识点不是并列记忆点，而是一条连续链路：
          先知道数据如何表示，再知道怎么请求，接着理解异步结果如何组织，最后把写法收束成更顺的流程。
        </p>
      </div>
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 卡片总览 */
function CardsSlide({ slide, accent }: SlideProps) {
  const cards = slide.cards ?? []

  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '本节目录'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <div className="mt-2 grid gap-4 lg:grid-cols-6">
        {cards.map((card, index) => {
          const spanClass =
            index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'

          return (
            <article
              key={`${card.eyebrow ?? 'card'}-${card.title}`}
              className={`${spanClass} rounded-2xl border border-[#e3ded4] bg-[linear-gradient(180deg,#fffdfa_0%,#faf7f0_100%)] p-4`}
            >
              {card.eyebrow ? (
                <div className={`course-mono text-[11px] tracking-[0.14em] ${accent.text}`}>
                  {card.eyebrow}
                </div>
              ) : null}
              <h3 className="mt-2 text-[19px] font-semibold tracking-[-0.02em] text-[#16181d]">
                {card.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-6 text-[#4c5159]">
                {card.description}
              </p>
              {card.meta ? (
                <p className="course-mono mt-3 rounded-full bg-[#f4f1ea] px-2.5 py-1 text-[11px] tracking-[0.06em] text-[#8b9099]">
                  {card.meta}
                </p>
              ) : null}
            </article>
          )
        })}
      </div>
    </SlideFrame>
  )
}

/* ------------------------------------------------------------- 提示条 */
const NOTE_TONE: Record<
  CourseSlideNoteTone,
  { wrap: string; label: string }
> = {
  rule: {
    wrap: 'border-[#e3ded4] bg-[#faf8f4] text-[#4c5159]',
    label: 'text-[#8b9099]',
  },
  tip: {
    wrap: 'border-[#cfe7db] bg-[#f1f9f5] text-[#2f5a45]',
    label: 'text-[#1f7a4d]',
  },
  warn: {
    wrap: 'border-[#f0e0c0] bg-[#fdf8ee] text-[#6b5327]',
    label: 'text-[#a5751b]',
  },
  trap: {
    wrap: 'border-[#f0cdc8] bg-[#fdf3f1] text-[#8a3b35]',
    label: 'text-[#b3261e]',
  },
}

function NoteBar({ note }: { note: CourseSlideNote }) {
  const tone = NOTE_TONE[note.tone]

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 ${tone.wrap}`}
    >
      {note.label ? (
        <span
          className={`course-mono mt-0.5 shrink-0 text-[11px] tracking-[0.08em] ${tone.label}`}
        >
          {note.label}
        </span>
      ) : null}
      <p className="text-[13.5px] leading-6">{note.text}</p>
    </div>
  )
}

/* ------------------------------------------------------------- 对比表 */
function ContentTable({ table }: { table: CourseSlideTable }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#e3ded4]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#f4f1ea]">
            {table.headers.map((header) => (
              <th
                key={header}
                className="px-3.5 py-2.5 text-[12px] font-semibold tracking-[0.04em] text-[#6b7078]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-[#ece7dd] bg-white even:bg-[#fbfaf6]"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-3.5 py-2.5 text-[13px] leading-6 ${
                    cellIndex === 0
                      ? 'font-semibold text-[#16181d]'
                      : 'text-[#4c5159]'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ 讲解 */
function PlaceholderContentSlide({ slide, accent }: SlideProps) {
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

function ContentSlide({ slide, accent }: SlideProps) {
  const paragraphs = slide.paragraphs ?? []
  const bullets = slide.bullets ?? []
  const table = slide.table
  const hasRealContent =
    paragraphs.length > 0 || bullets.length > 0 || Boolean(table)

  if (!hasRealContent) {
    return <PlaceholderContentSlide slide={slide} accent={accent} />
  }

  return (
    <SlideFrame
      eyebrow={slide.eyebrow}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      {paragraphs.length ? (
        <div className="mt-1 space-y-3">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-[15px] leading-7 text-[#4c5159]">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {table ? <ContentTable table={table} /> : null}

      {bullets.length ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {bullets.map((bullet) => (
            <li
              key={bullet.title}
              className="rounded-xl border border-[#e3ded4] bg-white px-4 py-3"
            >
              <div className="text-[14px] font-semibold text-[#16181d]">
                {bullet.title}
              </div>
              <p className="mt-1 text-[13.5px] leading-6 text-[#4c5159]">
                {bullet.text}
              </p>
              {bullet.code ? (
                <div className="mt-3">
                  <CodePanel code={bullet.code} compact />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {slide.note ? <NoteBar note={slide.note} /> : null}
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 演示 */
function DemoSlide({ slide, accent }: SlideProps) {
  const { src, url, route, ctaLabel, objectives, note } = slide.demo ?? {}
  if (route) {
    return (
      <SlideFrame
        eyebrow={slide.eyebrow ?? '实验入口'}
        title={slide.title}
        subtitle={slide.subtitle}
        accentText={accent.text}
        accentGradient={accent.gradient}
      >
        <div className="mt-2 flex h-full min-h-[420px] flex-col gap-4">
          <section className="rounded-2xl border border-[#e3ded4] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f4ed_100%)] p-6 shadow-[0_24px_48px_-24px_rgba(22,24,29,.18)]">
            <div className="course-mono text-[11px] uppercase tracking-[0.14em] text-[#8b9099]">
              实验入口
            </div>
            <p className="mt-3 text-[15px] leading-7 text-[#4c5159]">
              {note ?? '这张 slide 负责告诉你接下来要验证什么，真正的实验操作会在独立 demos 页面完成。'}
            </p>

            {objectives?.length ? (
              <ul className="mt-5 grid gap-3 lg:grid-cols-3">
                {objectives.map((objective, index) => (
                  <li
                    key={objective}
                    className="rounded-xl border border-[#e3ded4] bg-white px-4 py-3"
                  >
                    <div className="course-mono text-[11px] uppercase tracking-[0.12em] text-[#8b9099]">
                      观察点 {index + 1}
                    </div>
                    <p className="mt-2 text-[13.5px] leading-6 text-[#4c5159]">
                      {objective}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={route}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-[#b3470f] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#9b3c0c]"
              >
                {ctaLabel ?? '打开实验'}
              </Link>
              <span className="course-mono text-[11px] tracking-[0.08em] text-[#8b9099]">
                在新页面中操作实验，完成后再返回课件继续学习
              </span>
            </div>
          </section>
        </div>
      </SlideFrame>
    )
  }

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
function CodePanel({
  code,
  compact = false,
}: {
  code: CourseSlideCode
  compact?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const highlighted = new Set(code.highlightLines ?? [])
  const lines = code.source.split('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.source)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* 剪贴板不可用时静默失败 */
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#23272f] bg-[#171a21] shadow-[0_2px_4px_rgba(22,24,29,.05),0_10px_24px_-12px_rgba(22,24,29,.18)]">
      <div
        className={`flex items-center gap-3 border-b border-[#2a2f38] bg-[#1d2129] ${compact ? 'px-3 py-1.5' : 'px-3.5 py-2'}`}
      >
        <span className="course-mono text-[11.5px] uppercase tracking-[0.12em] text-[#9aa3b0]">
          {code.language}
        </span>
        {code.filename ? (
          <span className="course-mono ml-auto text-[11.5px] text-[#6d7683]">
            {code.filename}
          </span>
        ) : null}
        {!compact ? (
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
        ) : null}
      </div>
      <pre
        className={`hljs overflow-x-auto !bg-transparent ${compact ? 'p-3 text-[12px] leading-[1.6]' : 'p-5 text-[13px] leading-[1.7]'} text-[#e9e6df]`}
      >
        <code className="block">
          {lines.map((line, index) => {
            const lineNumber = index + 1
            const isHighlighted = highlighted.has(lineNumber)

            return (
              <span
                key={`${lineNumber}-${line}`}
                data-highlighted={isHighlighted ? 'true' : 'false'}
                className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 ${compact ? 'px-0 py-0.5' : 'px-0 py-0.5'} ${isHighlighted ? 'bg-[#233042]' : ''}`}
              >
                <span className="select-none text-right text-[11px] text-[#637086]">
                  {lineNumber}
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightLine(line, code.language),
                  }}
                />
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}

function CodeSlide({ slide, accent }: SlideProps) {
  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '核心代码'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      {slide.code ? (
        <div className="mt-2">
          <CodePanel code={slide.code} />
        </div>
      ) : (
        <PlaceholderBlock width="full" label="代码占位" lines={5} />
      )}
    </SlideFrame>
  )
}

/* -------------------------------------------------------------- 多段代码 */
function CodesSlide({ slide, accent }: SlideProps) {
  const codes = slide.codes ?? []

  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '对比代码'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      {codes.length ? (
        <div className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {codes.map((code, index) => (
            <CodePanel
              key={`${code.filename ?? code.language}-${index}`}
              code={code}
            />
          ))}
        </div>
      ) : (
        <PlaceholderBlock width="full" label="代码占位" lines={5} />
      )}
    </SlideFrame>
  )
}

/* ------------------------------------------------------------------ 对比 */
function CompareColumn({
  title,
  tone,
  side,
}: {
  title: string
  tone: 'bad' | 'good'
  side?: CourseSlideCompareSide
}) {
  const wrap =
    tone === 'bad'
      ? 'border-[#f0cdc8] bg-[#fdf3f1]'
      : 'border-[#cfe7db] bg-[#f1f9f5]'
  const label = tone === 'bad' ? 'text-[#b3261e]' : 'text-[#1f7a4d]'
  const fallbackLabel = tone === 'bad' ? '反例占位' : '正例占位'
  const hasReal = Boolean(side?.code || side?.items?.length)

  return (
    <div className={`rounded-xl border p-4 ${wrap}`}>
      <div
        className={`course-mono mb-3 text-[12.5px] font-semibold tracking-[0.06em] ${label}`}
      >
        {title}
      </div>
      {hasReal ? (
        <div className="space-y-3">
          {side?.items?.length ? (
            <ul className="space-y-2">
              {side.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-[13.5px] leading-6 text-[#3f444c]"
                >
                  <span aria-hidden="true">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {side?.code ? <CodePanel code={side.code} /> : null}
        </div>
      ) : (
        <div className="space-y-3">
          <PlaceholderBlock width="full" label={fallbackLabel} lines={3} />
        </div>
      )}
    </div>
  )
}

function CompareSlide({ slide, accent }: SlideProps) {
  const leftTitle = slide.compare?.leftTitle ?? '✗ 反例'
  const rightTitle = slide.compare?.rightTitle ?? '✓ 正例'

  return (
    <SlideFrame
      eyebrow={slide.eyebrow ?? '对比'}
      title={slide.title}
      subtitle={slide.subtitle}
      accentText={accent.text}
      accentGradient={accent.gradient}
    >
      <div className="mt-2 grid gap-4 lg:grid-cols-2">
        <CompareColumn
          title={leftTitle}
          tone="bad"
          side={slide.compare?.left}
        />
        <CompareColumn
          title={rightTitle}
          tone="good"
          side={slide.compare?.right}
        />
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
    case 'roadmap':
      return <RoadmapSlide slide={slide} accent={accent} />
    case 'cards':
      return <CardsSlide slide={slide} accent={accent} />
    case 'demo':
      return <DemoSlide slide={slide} accent={accent} />
    case 'code':
      return <CodeSlide slide={slide} accent={accent} />
    case 'codes':
      return <CodesSlide slide={slide} accent={accent} />
    case 'compare':
      return <CompareSlide slide={slide} accent={accent} />
    case 'closing':
      return <ClosingSlide slide={slide} accent={accent} />
    case 'content':
    default:
      return <ContentSlide slide={slide} accent={accent} />
  }
}
