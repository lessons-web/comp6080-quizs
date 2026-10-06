import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExamSubQuestionList } from './ExamSubQuestionList'
import type { ExamSubQuestion } from '../../types/content'

const mockSubQuestions: ExamSubQuestion[] = [
  {
    id: 'q1-a',
    label: '(a)',
    marks: 5,
    questionMdx: 'What is HTML?',
    answerMdx: 'HyperText Markup Language',
    markingMdx: '1 mark for HyperText\n1 mark for Markup Language'
  }
]

describe('ExamSubQuestionList', () => {
  it('renders nothing if subQuestions is empty', () => {
    const { container } = render(<ExamSubQuestionList subQuestions={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders sub-questions correctly', () => {
    render(<ExamSubQuestionList subQuestions={mockSubQuestions} />)
    
    expect(screen.getByText('(a)')).toBeInTheDocument()
    expect(screen.getByText('[5 marks]')).toBeInTheDocument()
    expect(screen.getByText('What is HTML?')).toBeInTheDocument()
    
    // initially answer is hidden
    expect(screen.queryByText('HyperText Markup Language')).not.toBeInTheDocument()
  })

  it('toggles answer visibility on click', () => {
    render(<ExamSubQuestionList subQuestions={mockSubQuestions} />)
    
    const button = screen.getByText(/查看答案与解析/)
    fireEvent.click(button)
    
    // Answer and marking criteria should now be visible
    expect(screen.getByText('HyperText Markup Language')).toBeInTheDocument()
    expect(screen.getByText('Marking Criteria')).toBeInTheDocument()
    
    const hideButton = screen.getByText(/收起答案与解析/)
    fireEvent.click(hideButton)
    
    // Answer should be hidden again
    expect(screen.queryByText('HyperText Markup Language')).not.toBeInTheDocument()
  })
})
