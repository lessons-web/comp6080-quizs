import type { ExamPaper as ExamPaperType } from '../../types/content'
import { ExamQuestionCard } from './ExamQuestionCard'

type ExamPaperProps = {
  exam: ExamPaperType
}

export function ExamPaper({ exam }: ExamPaperProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
        <div>
          <h3 className="text-2xl font-bold">{exam.title}</h3>
          {exam.description && (
            <p className="mt-1 text-sm text-slate-400">{exam.description}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400 uppercase tracking-wider">Total</div>
          <div className="text-2xl font-bold text-blue-400">{exam.totalMarks} marks</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {exam.questions.map((question) => (
          <ExamQuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  )
}
