'use client'

import { useMemo, useState } from 'react'
import type { ExamQuestionMockup as ExamQuestionMockupType } from '../../types/content'
import { EXAM_LOCALE_LABELS, type ExamLocale, getMockupText } from './examLocale'

function getFileTypeMeta(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'html':
      return { label: 'HTML', dotClassName: 'bg-[#f97316]' }
    case 'css':
      return { label: 'CSS', dotClassName: 'bg-[#2563eb]' }
    case 'js':
      return { label: 'JS', dotClassName: 'bg-[#d97706]' }
    case 'svg':
      return { label: 'SVG', dotClassName: 'bg-[#7c3aed]' }
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
      return { label: 'IMG', dotClassName: 'bg-[#16a34a]' }
    default:
      return { label: 'FILE', dotClassName: 'bg-[#94a3b8]' }
  }
}

function renderCodePanel(code: string) {
  const lines = code.split('\n')

  return (
    <div className="exam-ui-root" aria-hidden="true">
      <div className="exam-ui-code-preview">
        <div className="exam-ui-code-grid">
          <div className="exam-ui-line-nos">
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <pre className="exam-ui-code">{code}</pre>
        </div>
      </div>
    </div>
  )
}

export function ExamQuestionMockup({
  mockup,
  locale = 'en',
}: {
  mockup: ExamQuestionMockupType
  locale?: ExamLocale
}) {
  const labels = EXAM_LOCALE_LABELS[locale]
  const defaultFileName = useMemo(() => (
    mockup.files.find((file) => file.active)?.name
      ?? mockup.files.find((file) => file.name.endsWith('.html'))?.name
      ?? mockup.files[0]?.name
      ?? null
  ), [mockup.files])
  const [selectedFileName, setSelectedFileName] = useState(defaultFileName)
  const selectedFile = mockup.files.find((file) => file.name === selectedFileName) ?? null
  const viewportClass =
    mockup.viewport === 'mobile'
      ? 'mx-auto max-w-[320px]'
      : 'w-full'
  const { html, caption } = getMockupText(mockup, locale)
  const selectedCode =
    locale === 'zh'
      ? selectedFile?.codeZh ?? selectedFile?.code
      : selectedFile?.code
  const showCodePanel = Boolean(selectedCode)

  return (
    <figure className="overflow-hidden rounded-[1.5rem] border border-[#e4dfd5] bg-[#f5f3ee] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <div className="grid gap-0 md:grid-cols-[214px_minmax(0,1fr)]">
        <aside className="border-b border-[#e2ddd3] bg-[#eef1f6] md:border-b-0 md:border-r">
          <div className="border-b border-[#e2ddd3] px-4 py-3 text-sm font-medium text-[#88909a]">
            {EXAM_LOCALE_LABELS[locale].supportingFiles}
          </div>
          <div className="p-2">
            <ul className="space-y-1">
              {mockup.files.map((file) => (
                <li key={file.name} className="text-sm">
                  <button
                    type="button"
                    onClick={() => setSelectedFileName(file.name)}
                    aria-label={file.name}
                    aria-pressed={selectedFileName === file.name}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition ${
                      selectedFileName === file.name
                        ? 'bg-[#dce9ff] text-[#3166c7]'
                        : 'text-[#6b7280] hover:bg-[#e8ecf3]'
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-[3px] ${getFileTypeMeta(file.name).dotClassName}`} />
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] ${
                        selectedFileName === file.name
                          ? 'border-[#8db4f1] bg-white/75 text-[#3166c7]'
                          : 'border-[#d8dee8] bg-white/70 text-[#7a8089]'
                      }`}
                    >
                      {getFileTypeMeta(file.name).label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="bg-[#f7f7f5] p-4">
          <div className="relative">
            <button
              type="button"
              aria-label={labels.expandPreview}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dfe3ea] bg-white text-[#4b5563] shadow-[0_1px_2px_rgba(22,24,29,.05)]"
            >
              ↗
            </button>
            <div className={`${viewportClass} rounded-[1rem] border border-[#e3e6ea] bg-white p-4 shadow-[0_1px_2px_rgba(22,24,29,.05)]`}>
              {showCodePanel ? (
                renderCodePanel(selectedCode!)
              ) : (
                <div
                  className="exam-ui-root"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          </div>
          {caption ? (
            <figcaption className="mt-3 text-xs text-[#7a8089]">{caption}</figcaption>
          ) : null}
        </div>
      </div>
    </figure>
  )
}
