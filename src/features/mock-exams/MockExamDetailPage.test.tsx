import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { MockExamDetailPage } from './MockExamDetailPage'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    useParams: () => ({ id: 'week-1-mock-1' }),
  }
})

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
        subQuestions: []
      },
    ],
  }),
}))

describe('MockExamDetailPage', () => {
  it('renders exam paper with question and answer sections', async () => {
    const router = createMemoryRouter([
      { path: '/', element: <MockExamDetailPage /> },
    ])

    render(<RouterProvider router={router} />)

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
