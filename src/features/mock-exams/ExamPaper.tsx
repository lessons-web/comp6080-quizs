import type { ExamPaper as ExamPaperType } from '../../types/content'
import { ExamQuestionCard } from './ExamQuestionCard'

type ExamPaperProps = {
  exam: ExamPaperType
  questions?: ExamPaperType['questions']
  isGuest?: boolean
}

export function ExamPaper({ exam, questions, isGuest }: ExamPaperProps) {
  const displayQuestions = questions ?? exam.questions
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-[1.75rem] border border-[#245348] bg-[linear-gradient(135deg,#1f4d45_0%,#2f6b5f_100%)] p-6 text-white shadow-[0_24px_48px_-24px_rgba(47,98,88,0.5)]">
        <div>
          <h3 className="text-2xl font-bold">{exam.title}</h3>
          {exam.description && (
            <p className="mt-1 text-sm text-[#d7e8df]">{exam.description}</p>
          )}
          {isGuest ? (
            <p className="mt-2 text-xs font-medium text-[#f0c675]">
              访客预览模式 · 已展示前 {displayQuestions.length} 题
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <div className="text-sm uppercase tracking-wider text-[#d7e8df]">Total</div>
          <div className="text-2xl font-bold text-[#d6a64e]">{exam.totalMarks} marks</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {displayQuestions.map((question) => (
          <ExamQuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  )
}
