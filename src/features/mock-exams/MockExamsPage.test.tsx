import { render, screen, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { MockExamsPage } from './MockExamsPage'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    useParams: () => ({ week: 'week-1' }),
  }
})

vi.mock('../../lib/content/mockExams', () => ({
  getMockExamsByWeek: vi.fn().mockResolvedValue({
    week: 'week-1',
    exams: [
      {
        id: 'week-1-mock-1',
        title: 'Week 1 真题套卷 1',
        questions: [
          {
            id: 'W1-M1-Q1',
            question:
              '在 HTML 基本文档中，`<head>` 和 `<body>` 的职责分别是什么？',
            knowledgePoint: 'HTML 文档结构',
            answerExplanation:
              '`<head>` 放文档元信息，`<body>` 放页面主体内容。',
            codeBlocks: [],
            images: [],
          },
        ],
      },
    ],
  }),
}))

describe('MockExamsPage', () => {
  it('renders week 1 exam papers with question and answer sections', async () => {
    const router = createMemoryRouter([
      { path: '/', element: <MockExamsPage /> },
    ])

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
