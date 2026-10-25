'use client'

import type { ExamPaper as ExamPaperType } from '../../types/content'
import { useLocalStoragePref } from '../../lib/hooks/useLocalStoragePref'
import { ExamQuestionCard } from './ExamQuestionCard'
import {
  EXAM_LOCALE_LABELS,
  examSupportsChinese,
  getExamText,
  type ExamLocale,
} from './examLocale'

type ExamPaperProps = {
  exam: ExamPaperType
  questions?: ExamPaperType['questions']
  isGuest?: boolean
}

export function ExamPaper({ exam, questions, isGuest }: ExamPaperProps) {
  const displayQuestions = questions ?? exam.questions
  const supportsChinese = examSupportsChinese(exam)
  const [locale, setLocale] = useLocalStoragePref<ExamLocale>(
    'comp6080:pref:exam-language',
    supportsChinese ? 'zh' : 'en',
    (value) => value === 'en' || value === 'zh',
  )
  const labels = EXAM_LOCALE_LABELS[locale]
  const text = getExamText(exam, locale)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6 rounded-[1.75rem] border border-[#245348] bg-[linear-gradient(135deg,#1f4d45_0%,#2f6b5f_100%)] p-6 text-white shadow-[0_24px_48px_-24px_rgba(47,98,88,0.5)]">
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-bold">{text.title}</h3>
          {text.description && (
            <p className="mt-1 text-sm text-[#d7e8df]">{text.description}</p>
          )}
          {isGuest ? (
            <p className="mt-2 text-xs font-medium text-[#f0c675]">
              {labels.previewMode} · {labels.previewSuffix(displayQuestions.length)}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 text-right">
          {supportsChinese ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1">
              {(['zh', 'en'] as const).map((option) => {
                const active = locale === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLocale(option)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? 'bg-white text-[#1f4d45]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-pressed={active}
                  >
                    {option === 'zh' ? '中文' : 'EN'}
                  </button>
                )
              })}
            </div>
          ) : null}
          <div>
            <div className="text-sm uppercase tracking-wider text-[#d7e8df]">{labels.total}</div>
            <div className="text-2xl font-bold text-[#d6a64e]">
              {exam.totalMarks} {labels.marks}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {displayQuestions.map((question) => (
          <ExamQuestionCard key={question.id} question={question} locale={locale} />
        ))}
      </div>
    </div>
  )
}
