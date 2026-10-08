import { Link } from 'react-router-dom'
import { ContentLoading } from '../../components/ContentLoading'
import { getAllMockExams } from '../../lib/content/mockExams'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'

function LoadErrorCard() {
  return (
    <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h2 className="text-xl font-semibold">真题加载失败</h2>
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

export function MockExamsPage() {
  const { data: exams, loading, error } = useAsyncContent(
    () => getAllMockExams(),
    [],
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

  if (error || !exams) {
    return (
      <PageShell>
        <LoadErrorCard />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <section className="flex w-full flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Mock Exams
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                模拟真题列表
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                先完成整卷题目，再对照下方答案进行复盘，训练考试节奏与表达完整度。
              </p>
            </div>
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
            当前还没有录入模拟真题，后续会补充。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                to={`/exams/${exam.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                      {exam.title}
                    </h3>
                    {exam.tags && exam.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {exam.tags.map(tag => (
                          <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            tag === '真题' 
                              ? 'bg-red-50 text-red-700 ring-red-600/10'
                              : 'bg-blue-50 text-blue-700 ring-blue-700/10'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {exam.description && (
                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                      {exam.description}
                    </p>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                  <span>总分: {exam.totalMarks}</span>
                  <span className="font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    开始测试 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}
