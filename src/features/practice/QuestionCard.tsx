'use client'

import { useState } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github-dark.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)

import type { PracticeQuestion } from '../../types/content'

type QuestionCardProps = {
  question: PracticeQuestion
  variant?: 'card' | 'bare'
  mode?: 'full' | 'question-only'
}

export function QuestionCard({
  question,
  variant = 'card',
  mode = 'full',
}: QuestionCardProps) {
  const [open, setOpen] = useState(false)
  const answerId = `answer-${question.id}`

  const wrapperClass =
    variant === 'bare'
      ? ''
      : 'rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm'

  return (
    <article className={wrapperClass}>
      <div className="flex flex-col gap-3">
        {mode === 'full' ? (
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-slate-950">{question.id}</h3>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {question.knowledgePoint}
            </span>
          </div>
        ) : null}

        <div className="prose prose-sm prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {question.question}
          </ReactMarkdown>
        </div>

        {question.codeBlocks.length > 0 ? (
          <div className="space-y-3">
            {question.codeBlocks.map((block, index) => {
              const language = block.language.toLowerCase()
              const highlightedCode = hljs.getLanguage(language)
                ? hljs.highlight(block.code, { language }).value
                : hljs.highlightAuto(block.code).value

              return (
                <div
                  key={`${question.id}-${block.language}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {block.language}
                  </div>
                  <pre className="overflow-x-auto bg-slate-950 px-4 py-4 text-sm leading-6 text-slate-100">
                    <code
                      className={`hljs language-${language} !bg-transparent !p-0`}
                      dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                  </pre>
                </div>
              )
            })}
          </div>
        ) : null}

        {mode === 'full' ? (
          <div className="pt-1">
            <button
              aria-controls={answerId}
              aria-expanded={open}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              {open ? '收起答案' : '展开答案'}
            </button>
          </div>
        ) : null}
      </div>

      {mode === 'full' && open ? (
        <div
          className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-slate-700"
          id={answerId}
        >
          <p>
            <span className="font-semibold text-slate-950">知识点：</span>
            {question.knowledgePoint}
          </p>
          <div className="mt-2">
            <span className="font-semibold text-slate-950 block mb-2">答案解析：</span>
            <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {question.answerExplanation}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  )
}
