import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'week-1-mock-1' }),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/exams/week-1-mock-1',
}))

vi.mock('../../lib/auth/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', role: 'student' }, loading: false }),
}))

vi.mock('../../lib/content/mockExams', () => ({
  getMockExamById: vi.fn().mockResolvedValue({
    id: 'week-1-mock-1',
    title: 'Week 1 真题套卷 1',
    totalMarks: 20,
    questions: [
      {
        id: 'W1-M1-Q1',
        title: 'Q1. HTML & CSS (20 marks)',
        marks: 20,
        contentMdx: 'This is the question content.',
        subQuestions: [],
      },
    ],
  }),
}))

import { MockExamDetailPage } from './MockExamDetailPage'

describe('MockExamDetailPage', () => {
  it('renders exam paper with question and answer sections', async () => {
    render(<MockExamDetailPage />)

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Week 1 真题套卷 1' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Q1. HTML & CSS (20 marks)',
      }),
    ).toBeInTheDocument()
  })
})
