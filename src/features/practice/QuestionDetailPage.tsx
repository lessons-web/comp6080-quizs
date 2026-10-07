import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { ContentLoading } from '../../components/ContentLoading'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import {
  findRelatedQuestionsByTags,
  getAllPracticeQuestions,
  getPracticeQuestionById,
} from '../../lib/content/practice'
import { TOPIC_META, type Difficulty, type PracticeQuestion, type TopicId } from '../../types/content'
import { QuestionCard } from './QuestionCard'

const DIFF_META: Record<Difficulty, { label: string; dot: string; text: string; bg: string; ring: string }> = {
  easy: {
    label: '简单',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    ring: 'ring-1 ring-emerald-100',
  },
  medium: {
    label: '中等',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    ring: 'ring-1 ring-amber-100',
  },
  hard: {
    label: '困难',
    dot: 'bg-rose-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    ring: 'ring-1 ring-rose-100',
  },
}

const TOPIC_ACCENT: Record<TopicId, string> = {
  html: 'from-orange-400 to-red-500',
  css: 'from-sky-400 to-blue-600',
  javascript: 'from-yellow-400 to-amber-500',
  react: 'from-cyan-400 to-sky-500',
  nodejs: 'from-emerald-500 to-green-600',
}

const TOPIC_CHIP: Record<TopicId, string> = {
  html: 'bg-orange-50 text-orange-700 ring-orange-100',
  css: 'bg-sky-50 text-sky-700 ring-sky-100',
  javascript: 'bg-yellow-50 text-yellow-800 ring-yellow-100',
  react: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  nodejs: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 pt-6 pb-12 sm:px-6 lg:flex-row lg:items-start lg:px-8 lg:pt-8 lg:pb-16">
        {children}
      </div>
    </div>
  )
}

function Card({
  title,
  countBadge,
  children,
  className = '',
}: {
  title: string
  countBadge?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={[
        'shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
        className,
      ].join(' ')}
    >
      <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <h3 className="text-sm font-semibold tracking-tight text-slate-800">{title}</h3>
        {countBadge ? (
          <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {countBadge}
          </span>
        ) : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

function StatsCard() {
  const attempted = 1284
  const correctRate = 62
  const wrong = 100 - correctRate
  return (
    <Card title="答题统计">
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-3">
          <div className="text-4xl font-semibold tracking-tight text-slate-900">
            {attempted.toLocaleString()}
          </div>
          <div className="pb-1 text-[12px] font-medium text-slate-500">人已答过</div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-[12px] font-medium text-slate-500">
            <span>正确率</span>
            <span className="font-semibold text-emerald-600">{correctRate}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${correctRate}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>正确 {correctRate}%</span>
            <span>错误 {wrong}%</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function RelatedQuestionRow({ q }: { q: PracticeQuestion }) {
  const diff = DIFF_META[q.difficulty]
  const accent = TOPIC_ACCENT[q.topic]
  const chip = TOPIC_CHIP[q.topic]
  const topicMeta = TOPIC_META[q.topic]
  return (
    <Link
      to={`/practice/question/${q.id}`}
      className="group flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white p-3 transition hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-[0_4px_12px_-6px_rgba(15,23,42,0.12)]"
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-1 w-6 shrink-0 rounded-full bg-gradient-to-r ${accent}`}
        />
        <span className="rounded-md bg-slate-900/5 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-600 ring-1 ring-slate-900/5">
          {q.id}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${chip}`}>
          {topicMeta.label}
        </span>
        <div className="ml-auto">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${diff.bg} ${diff.text} ${diff.ring}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${diff.dot}`} />
            {diff.label}
          </span>
        </div>
      </div>

      <p className="line-clamp-2 text-[13px] leading-snug font-medium text-slate-700 group-hover:text-slate-900">
        {q.question}
      </p>

      {q.tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          {q.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200/80"
            >
              # {t}
            </span>
          ))}
          {q.tags.length > 3 ? (
            <span className="text-[10px] text-slate-400">+{q.tags.length - 3}</span>
          ) : null}
        </div>
      ) : null}
    </Link>
  )
}

function RelatedQuestionsCard({
  current,
  all,
}: {
  current: PracticeQuestion
  all: PracticeQuestion[]
}) {
  const related = useMemo(
    () => findRelatedQuestionsByTags(current.id, current.tags, all, 5),
    [current, all],
  )
  return (
    <Card
      title="相关试题"
      countBadge={`${related.length} 题`}
      className="flex flex-col"
    >
      <div className="flex flex-col gap-2">
        {related.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-6 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10.25 10.25 13 13" />
              </svg>
            </div>
            <p className="text-[12px] font-medium text-slate-600">暂无同标签题目</p>
            <p className="text-[11px] text-slate-400">当前题目的标签暂未匹配到其他试题</p>
          </div>
        ) : (
          related.map((q) => <RelatedQuestionRow key={q.id} q={q} />)
        )}
      </div>
    </Card>
  )
}

function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
        <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10 3.5 5.5 8 10 12.5" />
      </svg>
      返回题库
    </button>
  )
}

function MetaCard({ question }: { question: PracticeQuestion }) {
  const topicMeta = TOPIC_META[question.topic]
  const diff = DIFF_META[question.difficulty]
  const accent = TOPIC_ACCENT[question.topic]
  const chip = TOPIC_CHIP[question.topic]
  return (
    <div className="shrink-0 relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div
        aria-hidden="true"
        className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${accent}`}
      />
      <div className="flex flex-col gap-4 pl-3">
        <div className="flex flex-wrap items-center gap-3">
          <BackButton />
          <div className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
              <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 4.75V8l2.25 1.25" />
            </svg>
            创建于 {question.createdAt}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-slate-900/5 px-2.5 py-1 font-mono text-[13px] font-semibold tracking-tight text-slate-700 ring-1 ring-slate-900/5">
            {question.id}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${chip}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br ${accent}`} />
            {topicMeta.label}
          </span>
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${diff.bg} ${diff.text} ${diff.ring}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${diff.dot}`} />
            {diff.label}
          </span>
        </div>

        {question.tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {question.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/80"
              >
                # {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function QuestionBodyCard({
  question,
  answerOpen,
  onToggleAnswer,
}: {
  question: PracticeQuestion
  answerOpen: boolean
  onToggleAnswer: () => void
}) {
  return (
    <div className="shrink-0 flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div>
        <QuestionCard question={question} variant="bare" mode="question-only" />
      </div>
      <div className="pt-5 mt-auto">
        <button
          type="button"
          onClick={onToggleAnswer}
          aria-expanded={answerOpen}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {answerOpen ? '收起答案' : '展开答案'}
        </button>
      </div>
    </div>
  )
}

function AnswerCard({
  question,
  open,
}: {
  question: PracticeQuestion
  open: boolean
}) {
  if (!open) return null
  return (
    <div className="shrink-0 rounded-[1.75rem] border border-blue-100 bg-blue-50/80 p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-3 text-sm leading-7 text-slate-800">
        <p>
          <span className="font-semibold text-slate-950">知识点：</span>
          {question.knowledgePoint}
        </p>
        <div>
          <span className="font-semibold text-slate-950 block mb-2">答案解析：</span>
          <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {question.answerExplanation}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export function QuestionDetailPage() {
  const { questionId } = useParams()
  const [answerOpen, setAnswerOpen] = useState(false)

  const { data: all, loading: loadingAll } = useAsyncContent(
    () => getAllPracticeQuestions(),
    [],
  )

  const { data: question, loading: loadingQuestion } = useAsyncContent(
    () => (questionId && all ? getPracticeQuestionById(questionId, all) : Promise.resolve(null)),
    [questionId, all],
  )

  const loading = loadingAll || loadingQuestion

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-1 flex-col gap-6 lg:min-w-0 lg:flex-[2]">
          <ContentLoading rows={10} />
        </div>
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[380px]">
          <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
          <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
        </aside>
      </PageShell>
    )
  }

  if (!question) {
    return (
      <PageShell>
        <div className="flex flex-1 items-center justify-center">
          <section className="w-full max-w-xl rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-rose-900">
            <div className="mb-2 flex items-center gap-2">
              <BackButton />
            </div>
            <h2 className="text-xl font-semibold">未找到该题目</h2>
            <p className="mt-2 text-sm leading-6">
              题目 ID <span className="font-mono">{questionId ?? '未知'}</span> 不存在或已被移除。
            </p>
            <div className="mt-4">
              <Link
                to="/practice"
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
              >
                返回题库列表
              </Link>
            </div>
          </section>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <section className="flex flex-1 flex-col gap-5 lg:min-w-0 lg:flex-[2]">
        <MetaCard question={question} />
        <QuestionBodyCard
          question={question}
          answerOpen={answerOpen}
          onToggleAnswer={() => setAnswerOpen((v) => !v)}
        />
        <AnswerCard question={question} open={answerOpen} />
      </section>

      <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[380px]">
        <StatsCard />
        {all ? <RelatedQuestionsCard current={question} all={all} /> : null}
      </aside>
    </PageShell>
  )
}
