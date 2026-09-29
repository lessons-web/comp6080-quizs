import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { appRoutes } from '../../app/router'

describe('Mock exams route', () => {
  it('renders week 1 exam papers with question and answer sections', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/mock-exams/week-1'],
    })

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Week 1 真题套卷 1' }),
    ).toBeInTheDocument()
    const firstExamPaper = screen
      .getByRole('heading', { level: 2, name: 'Week 1 真题套卷 1' })
      .closest('article')

    expect(firstExamPaper).not.toBeNull()
    expect(
      within(firstExamPaper as HTMLElement).getByRole('heading', {
        level: 3,
        name: '题目',
      }),
    ).toBeInTheDocument()
    expect(
      within(firstExamPaper as HTMLElement).getByRole('heading', {
        level: 3,
        name: '答案',
      }),
    ).toBeInTheDocument()
  })
})
