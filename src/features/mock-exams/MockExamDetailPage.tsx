'use client'

import { useParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ContentLoading } from '../../components/ContentLoading'
import {
  useGuestLimit,
  useIsGuest,
  GuestNoticeInline,
  GUEST_OPENED_EXAM_IDS,
  isExamAllowedForGuest,
} from '../../components/GuestNotice'
import { getMockExamById } from '../../lib/content/mockExams'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { ExamPaper } from './ExamPaper'

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  )
}

function NotFoundCard() {
  return (
    <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-xl font-semibold">找不到该试卷</h2>
      <p className="mt-2 text-sm leading-6">
        请检查链接是否正确，或返回试卷列表。
      </p>
    </section>
  )
}

function LoadErrorCard() {
  return (
    <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h2 className="text-xl font-semibold">试卷加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}

export function MockExamDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const router = useRouter()
  const pathname = usePathname()
  const isGuest = useIsGuest()
  const loginHref = `/login${pathname ? `?redirect=${encodeURIComponent(pathname)}` : ''}`

  const { data: exam, loading, error } = useAsyncContent(
    () => (id ? getMockExamById(id as string) : Promise.resolve(null)),
    [id],
  )

  const { list: limitedQuestions, hiddenCount } = useGuestLimit(exam?.questions ?? [])

  if (loading) {
    return (
      <PageShell>
        <section className="flex w-full flex-col gap-6">
          <div className="rounded-[2rem] border border-[#e3ded4] bg-[#fffdfa] p-6 shadow-[0_2px_4px_rgba(22,24,29,.04),0_28px_60px_-36px_rgba(22,24,29,.18)] sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl flex-1">
                <div className="h-4 w-24 animate-pulse rounded-full bg-[#e3ded4]" />
                <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-[#e3ded4]" />
              </div>
            </div>
          </div>
          <ContentLoading rows={8} />
        </section>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell>
        <LoadErrorCard />
      </PageShell>
    )
  }

  if (!exam) {
    return (
      <PageShell>
        <NotFoundCard />
      </PageShell>
    )
  }

  const examBlocked = isGuest && !isExamAllowedForGuest(exam.id)
  if (examBlocked) {
    return (
      <PageShell>
        <section className="flex w-full flex-col gap-6 pb-16">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push('/exams')}
              className="flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#4c5159] transition-colors hover:bg-[#f4f1ea] hover:text-[#16181d]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              返回试卷列表
            </button>
            <GuestNoticeInline />
          </div>
          <div className="mx-auto w-full max-w-4xl rounded-[1.75rem] border border-[#e3ded4] bg-[#fffdfa] p-8 shadow-[0_2px_4px_rgba(22,24,29,.04),0_28px_60px_-36px_rgba(22,24,29,.18)]">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4f1ea] text-[#8b9099]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                  <path fill="currentColor" d="M17 8V7a5 5 0 0 0-10 0v1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Zm3 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-[#16181d]">
                    {exam.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ebe5da] px-2.5 py-0.5 text-[11px] font-semibold text-[#6a6257] ring-1 ring-[#d8d1c5]">
                    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3">
                      <path fill="currentColor" d="M8.5 4.5V4a2.5 2.5 0 0 0-5 0v.5H2.5A1.5 1.5 0 0 0 1 6v3.5A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 10.5 9.5V6A1.5 1.5 0 0 0 9 4.5h-.5Zm-4 0V4a1.5 1.5 0 0 1 3 0v.5h-3ZM6 9A1 1 0 1 1 6 7a1 1 0 0 1 0 2Z" />
                    </svg>
                    该试卷未开放预览
                  </span>
                </div>
                {exam.description && (
                  <p className="mt-2 text-sm leading-6 text-[#4c5159]">
                    {exam.description}
                  </p>
                )}
                <div className="mt-5 rounded-2xl border border-dashed border-[#e6d7b8] bg-[#fff7e8] p-5 text-sm leading-6 text-[#6a6257]">
                  <p className="font-semibold text-[#16181d]">
                    访客仅开放 {GUEST_OPENED_EXAM_IDS.length} 套试卷预览
                  </p>
                  <p className="mt-1 text-[#6b7078]">
                    目前访客仅可预览以下 {GUEST_OPENED_EXAM_IDS.length} 套试卷的前 10 道题：
                  </p>
                  <ul className="mt-2 ml-5 list-disc space-y-1 text-[#6b7078]">
                    <li>模拟试卷 1（id: MOCK-EXAM-1）</li>
                    <li>2026 Term 3 Quiz 1 真题（id: 2026T3-QUIZ1）</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href="/exams"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f1ea] px-4 py-2 text-xs font-medium text-[#4c5159] transition hover:bg-[#ebe5da]"
                    >
                      返回试卷列表
                    </Link>
                    <Link
                      href={loginHref}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#b3470f] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#9b3c0c]"
                    >
                      登录解锁全部
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <section className="flex w-full flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push('/exams')}
            className="flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#4c5159] transition-colors hover:bg-[#f4f1ea] hover:text-[#16181d]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            返回试卷列表
          </button>
          <GuestNoticeInline />
        </div>
        <ExamPaper
          exam={exam}
          questions={isGuest ? limitedQuestions : exam.questions}
          isGuest={isGuest}
        />
      </section>
    </PageShell>
  )
}
