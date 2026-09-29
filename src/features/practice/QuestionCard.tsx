import { useState } from 'react'

import type { PracticeQuestion } from '../../types/content'

type QuestionCardProps = {
  question: PracticeQuestion
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [open, setOpen] = useState(false)
  const answerId = `answer-${question.id}`

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold text-slate-950">{question.id}</h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {question.knowledgePoint}
          </span>
        </div>

        <p className="text-sm leading-7 text-slate-700">{question.question}</p>

        {question.codeBlocks.length > 0 ? (
          <div className="space-y-3">
            {question.codeBlocks.map((block, index) => (
              <div
                key={`${question.id}-${block.language}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {block.language}
                </div>
                <pre className="overflow-x-auto bg-slate-950 px-4 py-4 text-sm leading-6 text-slate-100">
                  <code>{block.code}</code>
                </pre>
              </div>
            ))}
          </div>
        ) : null}

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
      </div>

      {open ? (
        <div
          className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-slate-700"
          id={answerId}
        >
          <p>
            <span className="font-semibold text-slate-950">知识点：</span>
            {question.knowledgePoint}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-slate-950">答案解析：</span>
            {question.answerExplanation}
          </p>
        </div>
      ) : null}
    </article>
  )
}
