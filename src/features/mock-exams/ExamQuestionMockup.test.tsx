import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ExamQuestionMockup } from './ExamQuestionMockup'
import type { ExamQuestionMockup as ExamQuestionMockupType } from '../../types/content'

describe('ExamQuestionMockup', () => {
  const fixture: ExamQuestionMockupType = {
    files: [
      { name: 'card.png' },
      {
        name: 'card.css',
        code: '.card { width: 300px; padding: 20px; }',
      },
      {
        name: 'index.html',
        code: '<div class="card">Product card</div>',
        active: true,
      },
    ],
    html: '<div>Rendered preview</div>',
  }

  it('shows the active code file by default', () => {
    render(<ExamQuestionMockup mockup={fixture} />)

    expect(screen.getByText('<div class="card">Product card</div>')).toBeInTheDocument()
    expect(screen.queryByText('Rendered preview')).not.toBeInTheDocument()
  })

  it('switches to another code file when clicked', () => {
    render(<ExamQuestionMockup mockup={fixture} />)

    fireEvent.click(screen.getByRole('button', { name: 'card.css' }))

    expect(screen.getByText('.card { width: 300px; padding: 20px; }')).toBeInTheDocument()
    expect(screen.queryByText('<div class="card">Product card</div>')).not.toBeInTheDocument()
  })

  it('shows the preview when a non-code file is clicked', () => {
    render(<ExamQuestionMockup mockup={fixture} />)

    fireEvent.click(screen.getByRole('button', { name: 'card.png' }))

    expect(screen.getByText('Rendered preview')).toBeInTheDocument()
    expect(screen.queryByText('.card { width: 300px; padding: 20px; }')).not.toBeInTheDocument()
  })

  it('shows file type badges in the supporting files list', () => {
    render(<ExamQuestionMockup mockup={fixture} />)

    expect(screen.getByText('IMG')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
    expect(screen.getByText('HTML')).toBeInTheDocument()
  })
})
