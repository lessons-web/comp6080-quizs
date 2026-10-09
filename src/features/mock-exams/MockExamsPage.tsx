'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ContentLoading } from '../../components/ContentLoading'
import { getAllMockExams } from '../../lib/content/mockExams'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { useLocalStoragePref } from '../../lib/hooks/useLocalStoragePref'

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const LayoutGridIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

const ListIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
)

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

  const [searchQuery, setSearchQuery] = useState('')
  const [layoutMode, setLayoutMode] = useLocalStoragePref<'card' | 'table'>(
    'comp6080:pref:exam-layout',
    'card',
    (v) => v === 'card' || v === 'table',
  )

  const updateLayoutMode = (mode: 'card' | 'table') => {
    setLayoutMode(mode)
  }

  const filteredAndSortedExams = useMemo(() => {
    if (!exams) return []
    let result = [...exams]
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(exam => 
        exam.title.toLowerCase().includes(q) ||
        (exam.description && exam.description.toLowerCase().includes(q)) ||
        (exam.tags && exam.tags.some(t => t.toLowerCase().includes(q)))
      )
    }

    result.sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0
      const timeB = b.time ? new Date(b.time).getTime() : 0
      return timeB - timeA
    })

    return result
  }, [exams, searchQuery])

  if (loading) {
    return (
      <PageShell>
        <section className="flex w-full flex-col gap-6 pb-16">
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
      <section className="flex w-full flex-col gap-6 pb-16">
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
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-72 shrink-0">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索真题..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0 w-28">
                <button
                  onClick={() => updateLayoutMode('card')}
                  className={`flex-1 rounded-lg py-1.5 flex justify-center items-center transition-colors ${
                    layoutMode === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="卡片视图"
                >
                  <LayoutGridIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => updateLayoutMode('table')}
                  className={`flex-1 rounded-lg py-1.5 flex justify-center items-center transition-colors ${
                    layoutMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="列表视图"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredAndSortedExams.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
            {searchQuery ? '没有找到匹配的真题' : '当前还没有录入模拟真题，后续会补充。'}
          </div>
        ) : layoutMode === 'card' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedExams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exams/${exam.id}`}
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
                  {exam.time && (
                    <p className="mt-2 text-xs text-slate-400">
                      发布于：{new Date(exam.time).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
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
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">试卷名称</th>
                  <th className="px-6 py-4 font-medium">标签</th>
                  <th className="px-6 py-4 font-medium">发布时间</th>
                  <th className="px-6 py-4 font-medium">总分</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedExams.map(exam => (
                  <tr key={exam.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-blue-600">
                        {exam.title}
                      </div>
                      {exam.description && (
                        <div className="mt-1 text-slate-500 line-clamp-1">{exam.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {exam.tags && (
                        <div className="flex flex-wrap gap-2">
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
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {exam.time ? new Date(exam.time).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {exam.totalMarks} 分
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/exams/${exam.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        开始测试
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageShell>
  )
}
