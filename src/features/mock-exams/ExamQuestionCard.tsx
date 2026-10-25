import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamQuestion } from '../../types/content'
import { ExamSubQuestionList } from './ExamSubQuestionList'
import { ExamQuestionMockup } from './ExamQuestionMockup'
import { getQuestionText, type ExamLocale } from './examLocale'

export function ExamQuestionCard({
  question,
  locale = 'en',
}: {
  question: ExamQuestion
  locale?: ExamLocale
}) {
  const quizSample = question.displayStyle === 'quiz-sample'
  const { title, contentMdx, categoryLabel } = getQuestionText(question, locale)
  const marksLabel = locale === 'zh' ? `${question.marks} 分` : `${question.marks} marks`

  return (
    <article className={quizSample
      ? 'mb-6 rounded-[1.85rem] border border-[#e7e2d8] bg-[#fbfaf7] p-6 shadow-[0_1px_2px_rgba(22,24,29,.05)]'
      : 'mb-6 rounded-[1.75rem] border border-[#e3ded4] bg-[#fffdfa] p-6 shadow-[0_1px_2px_rgba(22,24,29,.05)]'
    }>
      <div className="flex flex-col gap-4">
        {quizSample ? (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-[2rem] font-semibold leading-[1.15] tracking-tight text-[#1b1f25]">
                {question.displayNumber ? (
                  <span className="mr-3 text-[#245ec9]">{question.displayNumber}</span>
                ) : null}
                <span>{title}</span>
              </h3>
              {categoryLabel ? (
                <p className="mt-1 text-sm font-medium text-[#7b8794]">
                  {categoryLabel}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 rounded-full bg-[#f0eeea] px-3 py-1 text-sm font-semibold text-[#8a8f97]">
              {marksLabel}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece7dd] pb-4">
            <h3 className="text-xl font-semibold text-[#16181d]">
              {title}
            </h3>
            <span className="rounded-full bg-[#fbf0dc] px-3 py-1 text-sm font-semibold text-[#8b5e34]">
              {marksLabel}
            </span>
          </div>
        )}

        {contentMdx && (
          <div className={quizSample
            ? 'prose prose-sm prose-slate max-w-none'
            : 'prose prose-sm prose-slate max-w-none rounded-xl border border-[#ece7dd] bg-[#faf8f4] p-4'
          }>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contentMdx}
            </ReactMarkdown>
          </div>
        )}

        {question.mockup ? <ExamQuestionMockup mockup={question.mockup} locale={locale} /> : null}

        <ExamSubQuestionList
          subQuestions={question.subQuestions}
          displayStyle={question.displayStyle}
          locale={locale}
        />
      </div>
    </article>
  )
}
