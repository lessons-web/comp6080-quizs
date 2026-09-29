import type { MockExam } from '../../types/content'

type ExamPaperProps = {
  exam: MockExam
}

export function ExamPaper({ exam }: ExamPaperProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        {exam.title}
      </h2>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-950">题目</h3>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
            {exam.questions.map((question, index) => (
              <li key={question.id}>
                <span className="font-semibold text-slate-950">{`${index + 1}. `}</span>
                {question.question}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5">
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
