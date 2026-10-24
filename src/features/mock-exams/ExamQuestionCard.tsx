import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamQuestion } from '../../types/content'
import { ExamSubQuestionList } from './ExamSubQuestionList'

export function ExamQuestionCard({ question }: { question: ExamQuestion }) {
  return (
    <article className="mb-6 rounded-[1.75rem] border border-[#e3ded4] bg-[#fffdfa] p-6 shadow-[0_1px_2px_rgba(22,24,29,.05)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece7dd] pb-4">
          <h3 className="text-xl font-semibold text-[#16181d]">
            {question.title}
          </h3>
          <span className="rounded-full bg-[#fbf0dc] px-3 py-1 text-sm font-semibold text-[#8b5e34]">
            {question.marks} marks
          </span>
        </div>

        {question.contentMdx && (
          <div className="prose prose-sm prose-slate max-w-none rounded-xl border border-[#ece7dd] bg-[#faf8f4] p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {question.contentMdx}
            </ReactMarkdown>
          </div>
        )}

        <ExamSubQuestionList subQuestions={question.subQuestions} />
      </div>
    </article>
  )
}
