import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { AppShell } from './app/AppShell'

vi.mock('./features/knowledge/KnowledgePage', () => ({
  KnowledgePage: () => (
    <div>
      <h1>Week 1 Foundations</h1>
    </div>
  ),
}))

vi.mock('./features/practice/PracticePage', () => ({
  PracticePage: () => null,
}))

vi.mock('./features/mock-exams/MockExamsPage', () => ({
  MockExamsPage: () => null,
}))

import { KnowledgePage } from './features/knowledge/KnowledgePage'
import { PracticePage } from './features/practice/PracticePage'
import { MockExamsPage } from './features/mock-exams/MockExamsPage'

describe('App', () => {
  it('shows the module navigation and the week 1 knowledge page by default', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <KnowledgePage /> },
          { path: 'practice', element: <PracticePage /> },
          { path: 'exams', element: <MockExamsPage /> },
        ],
      },
    ])

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('link', { name: '知识点解析' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '模拟题库' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '模拟真题' })).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /week 1 foundations/i,
      }),
    ).toBeInTheDocument()
  })
})
