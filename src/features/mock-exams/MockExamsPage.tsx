'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ContentLoading } from '../../components/ContentLoading'
import {
  GuestNoticeInline,
  GUEST_OPENED_EXAM_IDS,
  isExamAllowedForGuest,
  useIsGuest,
} from '../../components/GuestNotice'
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

type ExamCategory = 'mock' | 'real' | 'topic'

const EXAM_CATEGORY_LABELS: Record<ExamCategory, string> = {
  mock: '模拟卷',
  real: '真题卷',
  topic: '专题卷',
}

interface CategorizedExam {
  id: string
  tags?: string[]
}

function getExamCategory(exam: CategorizedExam): ExamCategory {
  const tags = exam.tags ?? []
  if (tags.includes('真题')) return 'real'
  if (tags.includes('专题卷')) return 'topic'
  return 'mock'
}

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
  const isGuest = useIsGuest()
  const pathname = usePathname()
  const loginHref = `/login${pathname ? `?redirect=${encodeURIComponent(pathname)}` : ''}`

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExamCategory>('all')
  const [layoutMode, setLayoutMode] = useLocalStoragePref<'card' | 'table'>(
    'comp6080:pref:exam-layout',
    'table',
    (v) => v === 'card' || v === 'table',
  )

  const updateLayoutMode = (mode: 'card' | 'table') => {
    setLayoutMode(mode)
  }

  const filteredAndSortedExams = useMemo(() => {
    if (!exams) return []
    let result = [...exams]

    if (categoryFilter !== 'all') {
      result = result.filter((exam) => getExamCategory(exam) === categoryFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((exam) =>
        [exam.title, exam.titleZh, exam.description, exam.descriptionZh].some(
          (value) => value?.toLowerCase().includes(q),
        ) ||
        (exam.tags && exam.tags.some((tag) => tag.toLowerCase().includes(q))),
      )
    }

    if (isGuest) {
      result.sort((a, b) => {
        const aOpen = isExamAllowedForGuest(a.id) ? 0 : 1
        const bOpen = isExamAllowedForGuest(b.id) ? 0 : 1
        if (aOpen !== bOpen) return aOpen - bOpen
        const timeA = a.time ? new Date(a.time).getTime() : 0
        const timeB = b.time ? new Date(b.time).getTime() : 0
        return timeB - timeA
      })
    } else {
      result.sort((a, b) => {
        const timeA = a.time ? new Date(a.time).getTime() : 0
        const timeB = b.time ? new Date(b.time).getTime() : 0
        return timeB - timeA
      })
    }

    return result
  }, [exams, categoryFilter, searchQuery, isGuest])

  if (loading) {
    return (
      <PageShell>
        <section className="flex w-full flex-col gap-6 pb-16">
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
        <div className="rounded-[2rem] border border-[#e3ded4] bg-[#fffdfa] p-6 shadow-[0_2px_4px_rgba(22,24,29,.04),0_28px_60px_-36px_rgba(22,24,29,.18)] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6b5f]">
                  Mock Exams
                </p>
                <GuestNoticeInline />
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#16181d]">
                模拟真题列表
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#4c5159]">
                先完成整卷题目，再对照下方答案进行复盘，训练考试节奏与表达完整度。
                {isGuest ? (
                  <span className="ml-1 font-medium text-[#9f5d24]">
                    （访客仅开放 {GUEST_OPENED_EXAM_IDS.length} 套试卷预览，每套前 10 题）
                  </span>
                ) : null}
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-72 shrink-0">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b9099]" />
                <input
                  type="text"
                  placeholder="搜索真题..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#d8d1c5] bg-white py-2 pl-9 pr-4 text-sm text-[#16181d] outline-none transition-colors placeholder:text-[#8b9099] focus:border-[#2f6b5f] focus:ring-2 focus:ring-[#dff2ea]"
                />
              </div>
              <div className="flex w-28 shrink-0 items-center rounded-xl border border-[#d8d1c5] bg-[#f4f1ea] p-1">
                <button
                  onClick={() => updateLayoutMode('card')}
                  className={`flex-1 rounded-lg py-1.5 flex justify-center items-center transition-colors ${
                    layoutMode === 'card'
                      ? 'bg-white text-[#2f6b5f] shadow-sm'
                      : 'text-[#6b7078] hover:text-[#4c5159]'
                  }`}
                  title="卡片视图"
                >
                  <LayoutGridIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => updateLayoutMode('table')}
                  className={`flex-1 rounded-lg py-1.5 flex justify-center items-center transition-colors ${
                    layoutMode === 'table'
                      ? 'bg-white text-[#2f6b5f] shadow-sm'
                      : 'text-[#6b7078] hover:text-[#4c5159]'
                  }`}
                  title="列表视图"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              aria-pressed={categoryFilter === 'all'}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-[#2f6b5f] text-white'
                  : 'bg-[#f4f1ea] text-[#6b7078] ring-1 ring-inset ring-[#d8d1c5] hover:text-[#4c5159]'
              }`}
            >
              全部
            </button>
            {(['mock', 'real', 'topic'] as const).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                aria-pressed={categoryFilter === category}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  categoryFilter === category
                    ? 'bg-[#2f6b5f] text-white'
                    : 'bg-[#f4f1ea] text-[#6b7078] ring-1 ring-inset ring-[#d8d1c5] hover:text-[#4c5159]'
                }`}
              >
                {EXAM_CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>

        {filteredAndSortedExams.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#d8d1c5] bg-[#fffdfa] p-8 text-center text-sm text-[#6b7078] shadow-sm">
            {searchQuery || categoryFilter !== 'all'
              ? '没有找到匹配的试卷'
              : '当前还没有录入模拟真题，后续会补充。'}
          </div>
        ) : layoutMode === 'card' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedExams.map((exam) => {
              const locked = isGuest && !isExamAllowedForGuest(exam.id)
              if (locked) {
                return (
                  <div
                    key={exam.id}
                    aria-disabled
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#ddd5c8] bg-[#f7f4ed] p-6 shadow-[0_1px_2px_rgba(22,24,29,.05)] opacity-95"
                  >
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#faf8f4]/80 backdrop-blur-[1px]" />
                    <div className="relative flex flex-1 flex-col">
                      <h3 className="text-xl font-semibold text-[#4c5159]">
                        {exam.titleZh || exam.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ebe5da] px-2.5 py-0.5 text-[11px] font-semibold text-[#6a6257] ring-1 ring-[#d8d1c5]">
                          <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3">
                            <path fill="currentColor" d="M8.5 4.5V4a2.5 2.5 0 0 0-5 0v.5H2.5A1.5 1.5 0 0 0 1 6v3.5A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 10.5 9.5V6A1.5 1.5 0 0 0 9 4.5h-.5Zm-4 0V4a1.5 1.5 0 0 1 3 0v.5h-3ZM6 9A1 1 0 1 1 6 7a1 1 0 0 1 0 2Z" />
                          </svg>
                          仅登录后可查看
                        </span>
                        {exam.tags && exam.tags.length > 0 && (
                          <>
                            {exam.tags.map(tag => (
                              <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                tag === '真题'
                                  ? 'bg-[#fbf0dc] text-[#8b5e34] ring-[#eed9ab]'
                                  : 'bg-[#eef6f2] text-[#2f6b5f] ring-[#cfe7db]'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                      {(exam.descriptionZh || exam.description) && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6b7078]">
                          {exam.descriptionZh || exam.description}
                        </p>
                      )}
                      {exam.time && (
                        <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#f1ede4] px-3 py-1 text-[11px] font-medium text-[#8b9099]">
                          <span className="text-[#7e847c]">发布于</span>
                          <span>{new Date(exam.time).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                        </div>
                      )}
                      <div className="mt-4 rounded-xl border border-dashed border-[#e6d7b8] bg-[#fff7e8] p-3 text-[12px] leading-5 text-[#6a6257]">
                        访客仅开放「模拟试卷 1」和「2026 Term 3 Quiz 1」两套试卷。登录或扫码咨询老师解锁全部。
                      </div>
                    </div>
                    <div className="relative mt-6 flex items-center justify-between border-t border-[#e7e0d5] pt-4 text-sm text-[#8b9099]">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#efe9de] px-3 py-1 text-[12px] font-semibold text-[#6a6257]">
                        <span className="text-[#8b9099]">总分</span>
                        <span>{exam.totalMarks}</span>
                      </span>
                      <Link
                        href={loginHref}
                        className="font-medium text-[#2f6b5f] hover:text-[#245348]"
                      >
                        登录解锁 →
                      </Link>
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={exam.id}
                  href={`/exams/${exam.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e3ded4] bg-[#fffdfa] p-6 shadow-[0_1px_2px_rgba(22,24,29,.05)] transition-all hover:-translate-y-1 hover:border-[#bdd5c7] hover:shadow-[0_2px_4px_rgba(22,24,29,.05),0_18px_36px_-24px_rgba(22,24,29,.2)]"
                >
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-xl font-semibold text-[#16181d] group-hover:text-[#2f6b5f]">
                      {exam.titleZh || exam.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#edf7f1] px-2.5 py-0.5 text-xs font-medium text-[#24745c] ring-1 ring-inset ring-[#cfe7db]">
                        访客可预览
                      </span>
                      {exam.tags && exam.tags.length > 0 && (
                        <>
                          {exam.tags.map(tag => (
                            <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                              tag === '真题'
                                ? 'bg-[#fbf0dc] text-[#8b5e34] ring-[#eed9ab]'
                                : 'bg-[#eef6f2] text-[#2f6b5f] ring-[#cfe7db]'
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                    {(exam.descriptionZh || exam.description) && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#4c5159]">
                        {exam.descriptionZh || exam.description}
                      </p>
                    )}
                    {exam.time && (
                      <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#f4f1ea] px-3 py-1 text-[11px] font-medium text-[#8b9099]">
                        <span className="text-[#6b7078]">发布于</span>
                        <span>{new Date(exam.time).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[#ece7dd] pt-4 text-sm text-[#6a6257]">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-3 py-1 text-[12px] font-semibold text-[#5d635c]">
                      <span className="text-[#8b9099]">总分</span>
                      <span>{exam.totalMarks}</span>
                    </span>
                    <span className="font-medium text-[#2f6b5f] opacity-0 transition-opacity group-hover:opacity-100">
                      开始测试 →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-[#e3ded4] bg-[#fffdfa] shadow-[0_1px_2px_rgba(22,24,29,.05)]">
            <table className="w-full min-w-[1120px] table-fixed text-left text-sm">
              <colgroup>
                <col style={{ width: '40%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>
              <thead className="bg-[#f4f1ea] text-[#6b7078]">
                <tr>
                  <th className="px-4 py-4 font-medium">试卷名称</th>
                  <th className="px-4 py-4 font-medium">标签</th>
                  <th className="px-4 py-4 font-medium">发布时间</th>
                  <th className="px-4 py-4 font-medium">总分</th>
                  <th className="px-4 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece7dd]">
                {filteredAndSortedExams.map(exam => {
                  const locked = isGuest && !isExamAllowedForGuest(exam.id)
                  return (
                    <tr key={exam.id} className={[
                      'group transition-colors',
                      locked ? 'bg-[#f7f4ed]' : 'hover:bg-[#fbfaf6]',
                    ].join(' ')}>
                      <td className="px-4 py-4">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className={[
                            'min-w-0 truncate font-medium',
                            locked ? 'text-[#6b7078]' : 'text-[#16181d] group-hover:text-[#2f6b5f]',
                          ].join(' ')}>
                            {exam.titleZh || exam.title}
                          </div>
                          {locked ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ebe5da] px-2 py-0.5 text-[10px] font-semibold text-[#6a6257] ring-1 ring-[#d8d1c5]">
                              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                                <path fill="currentColor" d="M8.5 4.5V4a2.5 2.5 0 0 0-5 0v.5H2.5A1.5 1.5 0 0 0 1 6v3.5A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 10.5 9.5V6A1.5 1.5 0 0 0 9 4.5h-.5Zm-4 0V4a1.5 1.5 0 0 1 3 0v.5h-3ZM6 9A1 1 0 1 1 6 7a1 1 0 0 1 0 2Z" />
                              </svg>
                              锁定
                            </span>
                          ) : (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#edf7f1] px-2 py-0.5 text-[10px] font-medium text-[#24745c] ring-1 ring-inset ring-[#cfe7db]">
                              可预览
                            </span>
                          )}
                        </div>
                        {(exam.descriptionZh || exam.description) && (
                          <div className="mt-1 truncate text-[#6b7078]">
                            {exam.descriptionZh || exam.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {exam.tags && (
                          <div className="flex flex-wrap gap-2">
                            {exam.tags.map(tag => (
                              <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                tag === '真题' 
                                  ? 'bg-[#fbf0dc] text-[#8b5e34] ring-[#eed9ab]'
                                  : 'bg-[#eef6f2] text-[#2f6b5f] ring-[#cfe7db]'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#6b7078]">
                        {exam.time ? new Date(exam.time).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#6a6257]">
                        {exam.totalMarks} 分
                      </td>
                      <td className="px-4 py-4 text-right">
                        {locked ? (
                          <Link
                            href={loginHref}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[#f4f1ea] px-3 py-1.5 text-xs font-medium text-[#6a6257] transition-colors hover:bg-[#ebe5da] hover:text-[#4c5159]"
                          >
                            登录解锁
                          </Link>
                        ) : (
                          <Link
                            href={`/exams/${exam.id}`}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[#edf7f1] px-3 py-1.5 text-xs font-medium text-[#2f6b5f] transition-colors hover:bg-[#dff2ea]"
                          >
                            开始测试
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageShell>
  )
}
