import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamQuestion } from '../../types/content'
import { ExamSubQuestionList } from './ExamSubQuestionList'

export function ExamQuestionCard({ question }: { question: ExamQuestion }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-semibold text-slate-950">
            {question.title}
          </h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {question.marks} marks
          </span>
        </div>

        {question.contentMdx && (
          <div className="prose prose-sm prose-slate max-w-none bg-slate-50/50 p-4 rounded-xl border border-slate-100">
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
