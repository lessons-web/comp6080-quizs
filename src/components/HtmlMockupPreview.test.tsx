import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HtmlMockupPreview } from './HtmlMockupPreview'

describe('HtmlMockupPreview', () => {
  it('renders static HTML inside the shared mockup style scope', () => {
    const { container } = render(
      <HtmlMockupPreview html='<div class="exam-ui-page-title">Settings</div>' />,
    )

    expect(
      container.querySelector('.exam-ui-root .exam-ui-page-title'),
    ).toHaveTextContent('Settings')
  })

  it('keeps the preview hidden from assistive technology and inert', () => {
    const { container } = render(<HtmlMockupPreview html="<button>Save</button>" />)
    const preview = container.querySelector('.exam-ui-root')

    expect(preview).toHaveAttribute('aria-hidden', 'true')
    expect(preview).toHaveAttribute('inert')
  })
})
