import { useParams, useNavigate } from 'react-router-dom'
import { ContentLoading } from '../../components/ContentLoading'
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
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: exam, loading, error } = useAsyncContent(
    () => (id ? getMockExamById(id) : Promise.resolve(null)),
    [id],
  )

  if (loading) {
    return (
      <PageShell>
        <section className="flex w-full flex-col gap-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl flex-1">
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-slate-200" />
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

  return (
    <PageShell>
      <section className="flex w-full flex-col gap-6">
        <button
          onClick={() => navigate('/exams')}
          className="flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          返回试卷列表
        </button>
        <ExamPaper exam={exam} />
      </section>
    </PageShell>
  )
}
