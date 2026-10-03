import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ExamPaper } from './ExamPaper'
import type { MockExam } from '../../types/content'

const fixture: MockExam = {
  id: 'W1-TEST',
  title: 'Test Paper',
  questions: [
    {
      id: 'Q1',
      question: 'What is HTML?',
      knowledgePoint: 'HTML basics',
      answerExplanation: 'Hypertext Markup Language.',
      codeBlocks: [],
      images: [],
    },
    {
      id: 'Q2',
      question: 'What is CSS?',
      knowledgePoint: 'CSS basics',
      answerExplanation: 'Cascading Style Sheets.',
      codeBlocks: [],
      images: [],
    },
  ],
}

describe('ExamPaper view mode tabs', () => {
  it('defaults to split view (both panels rendered)', () => {
    render(<ExamPaper exam={fixture} />)
    expect(screen.getByRole('heading', { name: '题目' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '答案' })).toBeInTheDocument()
    const split = screen.getByRole('tab', { name: '分屏对照' }) as HTMLButtonElement
    expect(split).toHaveAttribute('aria-selected', 'true')
  })
  it('hides answers when "仅题目" tab is selected', async () => {
    const user = userEvent.setup()
    render(<ExamPaper exam={fixture} />)
    await user.click(screen.getByRole('tab', { name: '仅题目' }))
    expect(screen.queryByRole('heading', { name: '答案' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '题目' })).toBeInTheDocument()
  })
  it('hides questions when "仅答案" tab is selected', async () => {
    const user = userEvent.setup()
    render(<ExamPaper exam={fixture} />)
    await user.click(screen.getByRole('tab', { name: '仅答案' }))
    expect(screen.queryByRole('heading', { name: '题目' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '答案' })).toBeInTheDocument()
  })
})
