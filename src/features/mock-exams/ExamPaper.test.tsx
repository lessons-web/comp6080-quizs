import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const bilingualFixture: ExamPaperType = {
  ...fixture,
  titleZh: '测试试卷',
  descriptionZh: '测试试卷说明',
  questions: fixture.questions.map((question) => ({
    ...question,
    titleZh: `${question.title} 中文版`,
    contentMdxZh: `${question.contentMdx} 中文版`,
    subQuestions: [],
  })),
}

describe('ExamPaper', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders exam title, description and total marks', () => {
    render(<ExamPaper exam={fixture} />)
    
    expect(screen.getByText('Test Paper')).toBeInTheDocument()
    expect(screen.getByText('Test paper description')).toBeInTheDocument()
    expect(screen.getByText('30 marks')).toBeInTheDocument()
  })

  it('uses the brand exam paper header theme', () => {
    render(<ExamPaper exam={bilingualFixture} isGuest />)

    const totalMarks = screen.getByText('30 分')
    const guestPreview = screen.getByText((_, node) => (
      node?.textContent?.replace(/\s+/g, ' ').trim() === '访客预览 · 已展示前 2 题'
    ))

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

  it('shows a locale switcher and defaults to Chinese for bilingual exams', () => {
    render(<ExamPaper exam={bilingualFixture} />)

    expect(screen.getByText('测试试卷')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '中文' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches back to English when the user presses EN', () => {
    render(<ExamPaper exam={bilingualFixture} />)

    fireEvent.click(screen.getByRole('button', { name: 'EN' }))

    expect(screen.getByText('Test Paper')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
    expect(window.localStorage.getItem('comp6080:pref:exam-language')).toBe('en')
  })
})
