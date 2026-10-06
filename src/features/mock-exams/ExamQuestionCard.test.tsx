import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ExamQuestionCard } from './ExamQuestionCard'
import type { ExamQuestion } from '../../types/content'

// Mock ReactMarkdown since we just want to know if it renders the content
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="markdown">{children}</div>
}))

// Mock ExamSubQuestionList to verify it receives correct props
vi.mock('./ExamSubQuestionList', () => ({
  ExamSubQuestionList: ({ subQuestions }: any) => (
    <div data-testid="sub-question-list">
      {subQuestions.length} sub-questions
    </div>
  )
}))

describe('ExamQuestionCard', () => {
  const mockQuestion: ExamQuestion = {
    id: 'q1',
    title: 'Question 1: HTML & CSS',
    marks: 15,
    contentMdx: 'This is the main question content.',
    subQuestions: [
      {
        id: 'q1-a',
        label: '(a)',
        marks: 5,
        questionMdx: 'Sub question a',
        answerMdx: 'Answer a'
      },
      {
        id: 'q1-b',
        label: '(b)',
        marks: 10,
        questionMdx: 'Sub question b',
        answerMdx: 'Answer b'
      }
    ]
  }

  it('renders question title and marks', () => {
    render(<ExamQuestionCard question={mockQuestion} />)
    
    expect(screen.getByText('Question 1: HTML & CSS')).toBeInTheDocument()
    expect(screen.getByText('15 marks')).toBeInTheDocument()
  })

  it('renders contentMdx if provided', () => {
    render(<ExamQuestionCard question={mockQuestion} />)
    
    const markdownElement = screen.getByTestId('markdown')
    expect(markdownElement).toBeInTheDocument()
    expect(markdownElement).toHaveTextContent('This is the main question content.')
  })

  it('does not render contentMdx container if not provided', () => {
    const questionWithoutContent = { ...mockQuestion, contentMdx: '' }
    render(<ExamQuestionCard question={questionWithoutContent} />)
    
    expect(screen.queryByTestId('markdown')).not.toBeInTheDocument()
  })

  it('renders ExamSubQuestionList with correct sub-questions', () => {
    render(<ExamQuestionCard question={mockQuestion} />)
    
    const subList = screen.getByTestId('sub-question-list')
    expect(subList).toBeInTheDocument()
    expect(subList).toHaveTextContent('2 sub-questions')
  })
})
