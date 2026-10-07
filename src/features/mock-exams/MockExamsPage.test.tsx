import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { MockExamsPage } from './MockExamsPage'

vi.mock('../../lib/content/mockExams', () => ({
  getAllMockExams: vi.fn().mockResolvedValue([
    {
      id: 'week-1-mock-1',
      title: 'Week 1 真题套卷 1',
      description: 'A test exam',
      totalMarks: 20,
      questions: [],
    },
  ]),
}))

describe('MockExamsPage', () => {
  it('renders a list of mock exams', async () => {
    const router = createMemoryRouter([
      { path: '/', element: <MockExamsPage /> },
    ])

    render(<RouterProvider router={router} />)

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
  })
})
