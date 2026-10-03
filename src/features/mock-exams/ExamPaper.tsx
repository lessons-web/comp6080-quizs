import { useState, type KeyboardEvent } from 'react'

import type { MockExam } from '../../types/content'

type ViewMode = 'split' | 'questions' | 'answers'

type ExamPaperProps = { exam: MockExam }

const TABS: { value: ViewMode; label: string }[] = [
  { value: 'split', label: '分屏对照' },
  { value: 'questions', label: '仅题目' },
  { value: 'answers', label: '仅答案' },
]

export function ExamPaper({ exam }: ExamPaperProps) {
  const [mode, setMode] = useState<ViewMode>('split')
  const questionsId = `questions-${exam.id}`
  const answersId = `answers-${exam.id}`

  const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const values: ViewMode[] = ['split', 'questions', 'answers']
    const idx = values.indexOf(mode)
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = values[(idx + 1) % values.length]
      setMode(next)
      requestAnimationFrame(() => {
        const el = document.getElementById(`${exam.id}-tab-${next}`) as HTMLElement | null
        el?.focus()
      })
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = values[(idx - 1 + values.length) % values.length]
      setMode(prev)
      requestAnimationFrame(() => {
        document.getElementById(`${exam.id}-tab-${prev}`)?.focus()
      })
    } else if (e.key === 'Home') {
      e.preventDefault(); setMode(values[0])
      requestAnimationFrame(() => document.getElementById(`${exam.id}-tab-${values[0]}`)?.focus())
    } else if (e.key === 'End') {
      e.preventDefault(); setMode(values[values.length - 1])
      requestAnimationFrame(() => document.getElementById(`${exam.id}-tab-${values[values.length - 1]}`)?.focus())
    }
  }

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {exam.title}
        </h2>
        <div
          role="tablist"
          aria-label="试卷视图切换"
          onKeyDown={handleTabKeyDown}
          className="inline-flex w-56 shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 p-1"
        >
          {TABS.map((tab) => {
            const active = mode === tab.value
            const controlsId =
              tab.value === 'split'
                ? `${questionsId} ${answersId}`
                : tab.value === 'questions'
                  ? questionsId
                  : answersId
            return (
              <button
                key={tab.value}
                id={`${exam.id}-tab-${tab.value}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={controlsId}
                tabIndex={mode === tab.value ? 0 : -1}
                onClick={() => setMode(tab.value)}
                className={[
                  'flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition',
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-700',
                ].join(' ')}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section
          id={questionsId}
          role="tabpanel"
          aria-labelledby={`${exam.id}-tab-${mode}`}
          hidden={mode === 'answers'}
          className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
        >
          <h3 className="text-lg font-semibold text-slate-950">题目</h3>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
            {exam.questions.map((question, index) => (
              <li key={question.id}>
                <span className="font-semibold text-slate-950">{`${index + 1}. `}</span>
                {question.question}
                {question.codeBlocks.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {question.codeBlocks.map((block, bi) => (
                      <div
                        key={`${question.id}-${bi}`}
                        className="overflow-hidden rounded-2xl border border-slate-200"
                      >
                        <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {block.language}
                        </div>
                        <pre className="overflow-x-auto bg-slate-950 px-4 py-4 text-sm leading-6 text-slate-100">
                          <code>{block.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section
          id={answersId}
          role="tabpanel"
          aria-labelledby={`${exam.id}-tab-${mode}`}
          hidden={mode === 'questions'}
          className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5"
        >
          <h3 className="text-lg font-semibold text-slate-950">答案</h3>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
            {exam.questions.map((question, index) => (
              <li key={`${question.id}-answer`}>
                <p>
                  <span className="font-semibold text-slate-950">{`${index + 1}. `}</span>
                  <span className="font-semibold text-slate-950">知识点：</span>
                  {question.knowledgePoint}
                </p>
                <p className="mt-1">{question.answerExplanation}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  )
}
