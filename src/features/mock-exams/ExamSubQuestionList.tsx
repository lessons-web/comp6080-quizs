'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamSubQuestion } from '../../types/content'

function SubQuestionItem({ sub }: { sub: ExamSubQuestion }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-[#ece7dd] py-4">
      <div className="flex gap-3">
        <span className="shrink-0 font-semibold text-[#4c5159]">{sub.label}</span>
        <div className="flex-1">
          <div className="prose prose-sm prose-slate max-w-none mb-3">
            <span className="mr-2 font-medium text-[#9f5d24]">[{sub.marks} marks]</span>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sub.questionMdx}</ReactMarkdown>
          </div>
          
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-sm font-medium text-[#2f6b5f] transition-colors hover:text-[#245348]"
          >
            {open ? '收起答案与解析' : '查看答案与解析'}
            <span className="text-[10px]">{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <div className="mt-4 space-y-4 rounded-r-[1rem] border border-[#f0e0c0] border-l-4 border-l-[#d6a64e] bg-[#fff7e8] p-4">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9f5d24]">Model Answer</h4>
                <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                  {sub.answerMdx}
                </div>
              </div>
              {sub.markingMdx && (
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9f5d24]">Marking Criteria</h4>
                  <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-[#4c5159]">
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
