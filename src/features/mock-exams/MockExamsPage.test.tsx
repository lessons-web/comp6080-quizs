import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
      description: 'A test exam',
      tags: ['真题'],
      totalMarks: 20,
      questions: [],
    },
  ]),
}))

import { MockExamsPage } from './MockExamsPage'

describe('MockExamsPage', () => {
  it('renders a list of mock exams', async () => {
    render(<MockExamsPage />)

    expect(
      await screen.findByRole('heading', { level: 2, name: '模拟真题列表' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Week 1 真题套卷 1',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('A test exam')).toBeInTheDocument()
    expect(screen.getByText('总分: 20')).toBeInTheDocument()
    expect(screen.getByText('真题')).toBeInTheDocument()
  })

  it('uses the warm paper theme on key exam list accents', async () => {
    render(<MockExamsPage />)

    const eyebrow = await screen.findByText('Mock Exams')
    const examTag = screen.getByText('真题')
    const startCta = screen.getByText('开始测试 →')

    expect(eyebrow).toHaveClass('text-[#2f6b5f]')
    expect(examTag).toHaveClass('bg-[#fbf0dc]', 'text-[#8b5e34]')
    expect(startCta).toHaveClass('text-[#2f6b5f]')
  })
})
