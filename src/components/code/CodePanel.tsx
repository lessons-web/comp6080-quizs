'use client'

import { useState } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import 'highlight.js/styles/github-dark.css'

import type { CourseSlideCode } from '../../types/course'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)

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

export function CodePanel({
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
                className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 px-0 py-0.5 ${isHighlighted ? 'bg-[#233042]' : ''}`}
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
