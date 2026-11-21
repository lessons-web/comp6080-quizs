import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { PracticeQuestion } from '../../types/content'
import { QuestionBankCard } from './QuestionBankCard'

const fixture: PracticeQuestion = {
  id: 'QUIZ3-W5-Q3',
  topic: 'ui-ux',
  weeks: ['week-5'],
  difficulty: 'medium',
  tags: ['Quiz3', '反馈 Feedback'],
  question: 'A submit button gives no feedback.',
  knowledgePoint: 'Feedback',
  answerExplanation: 'Show a pending state while the request runs.',
  codeBlocks: [],
  images: [],
  mockup: {
    html: '<div class="exam-ui-page-title">Create thread</div>',
    caption: 'The submit button has no pending state.',
  },
  createdAt: '2026-11-08',
}

describe('QuestionBankCard', () => {
  it('keeps the list card compact when the question has a mockup', () => {
    const { container } = render(<QuestionBankCard question={fixture} />)

    expect(screen.getByText('A submit button gives no feedback.')).toBeInTheDocument()
    expect(screen.queryByText(fixture.mockup!.caption)).not.toBeInTheDocument()
    expect(container.querySelector('.exam-ui-root')).toBeNull()
  })
})
