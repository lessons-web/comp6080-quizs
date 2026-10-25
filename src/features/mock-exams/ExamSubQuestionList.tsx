'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamSubQuestion } from '../../types/content'
import { EXAM_LOCALE_LABELS, getSubQuestionText, type ExamLocale } from './examLocale'

function SubQuestionItem({
  sub,
  displayStyle,
  locale = 'en',
}: {
  sub: ExamSubQuestion
  displayStyle?: 'default' | 'quiz-sample'
  locale?: ExamLocale
}) {
  const [open, setOpen] = useState(false)
  const quizSample = displayStyle === 'quiz-sample'
  const text = getSubQuestionText(sub, locale)
  const labels = EXAM_LOCALE_LABELS[locale]
  const marksText = locale === 'zh' ? `${sub.marks} 分` : `${sub.marks} marks`

  return (
    <div className={quizSample ? 'py-4' : 'border-t border-[#ece7dd] py-4'}>
      <div className={quizSample ? 'space-y-3' : 'flex gap-3'}>
        <div className={quizSample ? 'flex items-start justify-between gap-4' : 'contents'}>
          <span className={quizSample ? 'shrink-0 font-semibold text-[#245ec9]' : 'shrink-0 font-semibold text-[#4c5159]'}>
            {sub.label}
          </span>
          <div className={quizSample ? 'min-w-0 flex-1' : 'flex-1'}>
            <div className={quizSample ? 'flex items-start justify-between gap-3' : 'prose prose-sm prose-slate max-w-none mb-3'}>
              <div className={quizSample ? 'prose prose-sm prose-slate max-w-none flex-1' : ''}>
                {!quizSample ? (
                  <span className="mr-2 font-medium text-[#9f5d24]">[{marksText}]</span>
                ) : null}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{text.questionMdx}</ReactMarkdown>
              </div>
              {quizSample ? (
                <span className="shrink-0 rounded-full bg-[#f0eeea] px-2.5 py-0.5 text-xs font-semibold text-[#8a8f97]">
                  {marksText}
                </span>
              ) : null}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className={quizSample
                ? 'mt-1 inline-flex items-center gap-1 rounded-full border border-[#d6dfef] bg-white px-3 py-1.5 text-xs font-medium text-[#245ec9] transition-colors hover:bg-[#f5f9ff]'
                : 'flex items-center gap-1 text-sm font-medium text-[#2f6b5f] transition-colors hover:text-[#245348]'
              }
            >
              {open ? labels.hideAnswer : labels.revealAnswer}
              <span className="text-[10px]">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
              <div className={quizSample
                ? 'mt-4 rounded-[1.2rem] border border-[#ddd9d0] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'
                : 'mt-4 space-y-4 rounded-r-[1rem] border border-[#f0e0c0] border-l-4 border-l-[#d6a64e] bg-[#fff7e8] p-4'
              }>
                <div>
                  <h4 className={quizSample
                    ? 'mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a8f97]'
                    : 'mb-2 text-xs font-bold uppercase tracking-wider text-[#9f5d24]'
                  }>
                    {labels.modelAnswer}
                  </h4>
                  <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                    {text.answerMdx}
                  </div>
                </div>
                {text.markingMdx && (
                  <div>
                    <h4 className={quizSample
                      ? 'mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a8f97]'
                      : 'mb-2 text-xs font-bold uppercase tracking-wider text-[#9f5d24]'
                    }>
                      {labels.markingCriteria}
                    </h4>
                    <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-[#4c5159]">
                      {text.markingMdx}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ExamSubQuestionList({
  subQuestions,
  displayStyle,
  locale = 'en',
}: {
  subQuestions: ExamSubQuestion[]
  displayStyle?: 'default' | 'quiz-sample'
  locale?: ExamLocale
}) {
  if (!subQuestions || subQuestions.length === 0) return null
  
  return (
    <div className={displayStyle === 'quiz-sample' ? 'mt-2 flex flex-col gap-2' : 'mt-4 flex flex-col'}>
      {subQuestions.map((sub) => (
        <SubQuestionItem key={sub.id} sub={sub} displayStyle={displayStyle} locale={locale} />
      ))}
    </div>
  )
}
