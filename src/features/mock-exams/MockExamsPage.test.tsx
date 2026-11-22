import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  usePathname: () => '/exams',
}))

vi.mock('../../lib/auth/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', role: 'student' }, loading: false }),
}))

vi.mock('../../lib/content/mockExams', () => ({
  getAllMockExams: vi.fn().mockResolvedValue([
    {
      id: 'week-1-mock-1',
      title: 'Week 1 真题套卷 1',
      titleZh: '2026 T3 Quiz 1 · 真题卷',
      description: 'A test exam',
      descriptionZh: '2026 T3 真题模拟卷，覆盖 HTML 与 CSS 基础知识。',
      tags: ['真题'],
      totalMarks: 20,
      time: '2026-10-03 10:00',
      questions: [],
    },
    {
      id: 'topic-1-html',
      title: 'Week 1 HTML 专题卷',
      titleZh: 'HTML 与语义结构 · 专题卷',
      description: 'A topic paper',
      descriptionZh: 'HTML 文档结构、语义地标与标题层级专题练习。',
      tags: ['专题卷', 'Weeks1'],
      totalMarks: 50,
      time: '2026-11-12 10:00',
      questions: [],
    },
    {
      id: 'week-2-mock-1',
      title: 'Week 2 模拟卷',
      titleZh: 'Week 2 CSS 模拟卷',
      description: 'A simulation paper',
      descriptionZh: '覆盖 CSS 布局、响应式设计与层叠规则。',
      tags: ['模拟题', 'Week2'],
      totalMarks: 42,
      time: '2026-10-25 10:00',
      questions: [],
    },
    {
      id: 'fallback-paper',
      title: 'English fallback title',
      description: 'English fallback description',
      tags: ['模拟题'],
      totalMarks: 30,
      time: '2026-10-01 10:00',
      questions: [],
    },
  ]),
}))

import { MockExamsPage } from './MockExamsPage'

describe('MockExamsPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the default list view sorted by published time descending', async () => {
    render(<MockExamsPage />)

    expect(
      await screen.findByRole('heading', { level: 2, name: '模拟真题列表' }),
    ).toBeInTheDocument()

    // Default layout is the list (table) view.
    expect(screen.getByRole('columnheader', { name: '试卷名称' })).toBeInTheDocument()

    expect(screen.getByText('2026 T3 Quiz 1 · 真题卷')).toBeInTheDocument()
    expect(screen.getByText('2026 T3 真题模拟卷，覆盖 HTML 与 CSS 基础知识。')).toBeInTheDocument()
    expect(screen.getByText('20 分')).toBeInTheDocument()
    expect(screen.getByText('真题')).toBeInTheDocument()
    expect(screen.getByText('English fallback title')).toBeInTheDocument()
    expect(screen.getByText('English fallback description')).toBeInTheDocument()
    expect(screen.queryByText('Week 1 真题套卷 1')).not.toBeInTheDocument()

    const table = screen.getByRole('table')
    expect(table).toHaveClass('table-fixed', 'min-w-[1120px]')
    expect(
      Array.from(table.querySelectorAll('col')).map((column) => (column as HTMLElement).style.width),
    ).toEqual(['40%', '25%', '15%', '9%', '11%'])
    expect(table.parentElement).toHaveClass('overflow-x-auto')
    expect(screen.getAllByRole('link', { name: '开始测试' })[0]).toHaveClass('whitespace-nowrap')

    const examLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/exams/'))
    expect(examLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/exams/topic-1-html',
      '/exams/week-2-mock-1',
      '/exams/week-1-mock-1',
      '/exams/fallback-paper',
    ])
  })

  it('filters the list by the three paper categories', async () => {
    render(<MockExamsPage />)

    await screen.findByText('2026 T3 Quiz 1 · 真题卷')

    // 真题卷: only the paper tagged 真题 survives.
    fireEvent.click(screen.getByRole('button', { name: '真题卷' }))
    expect(screen.getByText('2026 T3 Quiz 1 · 真题卷')).toBeInTheDocument()
    expect(screen.queryByText('HTML 与语义结构 · 专题卷')).not.toBeInTheDocument()
    expect(screen.queryByText('Week 2 CSS 模拟卷')).not.toBeInTheDocument()

    // 专题卷: only the paper tagged 专题卷 survives.
    fireEvent.click(screen.getByRole('button', { name: '专题卷' }))
    expect(screen.getByText('HTML 与语义结构 · 专题卷')).toBeInTheDocument()
    expect(screen.queryByText('2026 T3 Quiz 1 · 真题卷')).not.toBeInTheDocument()

    // 模拟卷: everything without 真题 / 专题卷 tags.
    fireEvent.click(screen.getByRole('button', { name: '模拟卷' }))
    expect(screen.getByText('Week 2 CSS 模拟卷')).toBeInTheDocument()
    expect(screen.getByText('English fallback title')).toBeInTheDocument()
    expect(screen.queryByText('2026 T3 Quiz 1 · 真题卷')).not.toBeInTheDocument()
    expect(screen.queryByText('HTML 与语义结构 · 专题卷')).not.toBeInTheDocument()

    // 全部: restores every paper.
    fireEvent.click(screen.getByRole('button', { name: '全部' }))
    expect(screen.getByText('2026 T3 Quiz 1 · 真题卷')).toBeInTheDocument()
    expect(screen.getByText('HTML 与语义结构 · 专题卷')).toBeInTheDocument()
    expect(screen.getByText('Week 2 CSS 模拟卷')).toBeInTheDocument()
  })

  it('uses Chinese titles and descriptions in card view too', async () => {
    render(<MockExamsPage />)

    await screen.findByText('2026 T3 Quiz 1 · 真题卷')
    fireEvent.click(screen.getByTitle('卡片视图'))

    expect(screen.getByRole('heading', { name: '2026 T3 Quiz 1 · 真题卷' })).toBeInTheDocument()
    expect(screen.getByText('2026 T3 真题模拟卷，覆盖 HTML 与 CSS 基础知识。')).toBeInTheDocument()
  })

  it('uses the warm paper theme on key exam list accents', async () => {
    render(<MockExamsPage />)

    const eyebrow = await screen.findByText('Mock Exams')
    const examTag = screen.getByText('真题')
    const startCta = screen.getAllByText('开始测试')[0]

    expect(eyebrow).toHaveClass('text-[#2f6b5f]')
    expect(examTag).toHaveClass('bg-[#fbf0dc]', 'text-[#8b5e34]')
    expect(startCta).toHaveClass('text-[#2f6b5f]')
  })
})
