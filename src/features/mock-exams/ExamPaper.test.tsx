import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ExamPaper } from './ExamPaper'
import type { ExamPaper as ExamPaperType } from '../../types/content'

// Mock ExamQuestionCard
vi.mock('./ExamQuestionCard', () => ({
  ExamQuestionCard: ({ question }: { question: any }) => (
    <div data-testid={`question-card-${question.id}`}>{question.title}</div>
  )
}))

const fixture: ExamPaperType = {
  id: 'W1-TEST',
  title: 'Test Paper',
  description: 'Test paper description',
  totalMarks: 30,
  questions: [
    {
      id: 'Q1',
      title: 'Question 1',
      marks: 15,
      contentMdx: 'Content 1',
      subQuestions: []
    },
    {
      id: 'Q2',
      title: 'Question 2',
      marks: 15,
      contentMdx: 'Content 2',
      subQuestions: []
    },
  ],
}

describe('ExamPaper', () => {
  it('renders exam title, description and total marks', () => {
    render(<ExamPaper exam={fixture} />)
    
    expect(screen.getByText('Test Paper')).toBeInTheDocument()
    expect(screen.getByText('Test paper description')).toBeInTheDocument()
    expect(screen.getByText('30 marks')).toBeInTheDocument()
  })

  it('uses the brand exam paper header theme', () => {
    render(<ExamPaper exam={fixture} isGuest />)

    const totalMarks = screen.getByText('30 marks')
    const guestPreview = screen.getByText('访客预览模式 · 已展示前 2 题')

    expect(totalMarks).toHaveClass('text-[#d6a64e]')
    expect(guestPreview).toHaveClass('text-[#f0c675]')
  })

  it('renders question cards for all questions', () => {
    render(<ExamPaper exam={fixture} />)
    
    expect(screen.getByTestId('question-card-Q1')).toBeInTheDocument()
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    
    expect(screen.getByTestId('question-card-Q2')).toBeInTheDocument()
    expect(screen.getByText('Question 2')).toBeInTheDocument()
  })
})
