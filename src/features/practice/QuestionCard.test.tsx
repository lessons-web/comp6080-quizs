import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { appRoutes } from '../../app/router'

describe('Practice route', () => {
  it('reveals the answer only after the learner expands a question card', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/practice/week-1'],
    })

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { level: 3, name: 'HTML-Q1' }),
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
