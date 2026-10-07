import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { PracticeQuestion } from '../../types/content'
import { QuestionCard } from './QuestionCard'

const fixture: PracticeQuestion = {
  id: 'HTML-Q1',
  topic: 'html',
  weeks: ['week-1'],
  difficulty: 'easy',
  tags: ['文档结构', '语义化'],
  question: '在下面代码中，哪一部分属于页面主体内容？为什么？',
  knowledgePoint: 'HTML 文档结构（head 与 body）',
  answerExplanation:
    '页面主体内容是 `<body>` 内的内容。`<head>` 主要放文档元信息（标题、meta、样式链接等），不是给用户直接阅读的主内容区域。',
  codeBlocks: [
    {
      language: 'html',
      code: '<!doctype html>\n<html>\n  <head>\n    <title>Week 1</title>\n  </head>\n  <body>\n    <h1>Hello</h1>\n    <p>COMP6080</p>\n  </body>\n</html>',
    },
  ],
  images: [],
  createdAt: '2026-03-15',
}

describe('QuestionCard', () => {
  it('reveals the answer only after the learner expands a question card', async () => {
    render(<QuestionCard question={fixture} />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'HTML-Q1' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/页面主体内容是/i)).not.toBeInTheDocument()

    const firstCard = screen
      .getByRole('heading', { level: 3, name: 'HTML-Q1' })
      .closest('article')
    expect(firstCard).not.toBeNull()

    const firstToggleButton = within(firstCard as HTMLElement).getByRole(
      'button',
      {
        name: '展开答案',
      },
    )
    expect(firstToggleButton).toHaveAttribute('aria-controls', 'answer-HTML-Q1')
    await userEvent.click(firstToggleButton)

    expect(screen.getByText(/页面主体内容是/i)).toBeInTheDocument()
  })
})
