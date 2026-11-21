import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PracticeQuestionMockupCard } from './PracticeQuestionMockupCard'

describe('PracticeQuestionMockupCard', () => {
  it('renders static evidence with its caption', () => {
    const { container } = render(
      <PracticeQuestionMockupCard
        mockup={{
          html: '<div class="exam-ui-page-title">Create thread</div>',
          caption: 'The submit button remains available while the request is pending.',
        }}
      />,
    )

    expect(screen.getByText(/submit button remains available/i)).toBeInTheDocument()
    expect(
      container.querySelector('.exam-ui-root .exam-ui-page-title'),
    ).toHaveTextContent('Create thread')
  })

  it('uses a narrow preview wrapper for mobile evidence', () => {
    const { container } = render(
      <PracticeQuestionMockupCard
        mockup={{
          html: '<div class="exam-ui-page-title">Actions</div>',
          caption: 'Two mobile row actions.',
          viewport: 'mobile',
        }}
      />,
    )

    const mobileViewport = container.querySelector('[data-viewport="mobile"]')
    expect(mobileViewport).toHaveClass('mx-auto', 'max-w-[320px]')
  })

  it('renders nothing when no mockup is provided', () => {
    const { container } = render(<PracticeQuestionMockupCard mockup={undefined} />)

    expect(container.firstChild).toBeNull()
  })
})
