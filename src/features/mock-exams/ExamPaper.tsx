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
      <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
        <div>
          <h3 className="text-2xl font-bold">{exam.title}</h3>
          {exam.description && (
            <p className="mt-1 text-sm text-slate-400">{exam.description}</p>
          )}
          {isGuest ? (
            <p className="mt-2 text-xs font-medium text-blue-400">
              访客预览模式 · 已展示前 {displayQuestions.length} 题
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400 uppercase tracking-wider">Total</div>
          <div className="text-2xl font-bold text-blue-400">{exam.totalMarks} marks</div>
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
