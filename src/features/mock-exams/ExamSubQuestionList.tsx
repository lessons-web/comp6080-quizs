import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamSubQuestion } from '../../types/content'

function SubQuestionItem({ sub }: { sub: ExamSubQuestion }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-slate-100 py-4">
      <div className="flex gap-3">
        <span className="font-semibold text-slate-700 shrink-0">{sub.label}</span>
        <div className="flex-1">
          <div className="prose prose-sm prose-slate max-w-none mb-3">
            <span className="text-slate-500 font-medium mr-2">[{sub.marks} marks]</span>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sub.questionMdx}</ReactMarkdown>
          </div>
          
          <button
            onClick={() => setOpen(!open)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            {open ? '收起答案与解析' : '查看答案与解析'}
            <span className="text-[10px]">{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <div className="mt-4 p-4 bg-slate-50 border-l-4 border-blue-500 rounded-r-lg space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Model Answer</h4>
                <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                  {sub.answerMdx}
                </div>
              </div>
              {sub.markingMdx && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Marking Criteria</h4>
                  <div className="prose prose-sm prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                    {sub.markingMdx}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ExamSubQuestionList({ subQuestions }: { subQuestions: ExamSubQuestion[] }) {
  if (!subQuestions || subQuestions.length === 0) return null
  
  return (
    <div className="mt-4 flex flex-col">
      {subQuestions.map((sub) => (
        <SubQuestionItem key={sub.id} sub={sub} />
      ))}
    </div>
  )
}
