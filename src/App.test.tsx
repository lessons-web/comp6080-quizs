import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('shows the module navigation and the week 1 knowledge page by default', async () => {
    render(<App />)

    expect(screen.getByRole('link', { name: '知识点解析' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '模拟题库' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '模拟真题' })).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /week 1 foundations/i,
      }),
    ).toBeInTheDocument()
  })
})
