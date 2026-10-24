import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CourseSlide } from '../../../../types/course'
import { SlideRenderer } from './SlideRenderer'

const accent = {
  gradient: 'from-emerald-500 to-green-600',
  text: 'text-emerald-700',
}

describe('SlideRenderer week 4 json teaching polish', () => {
  it('renders content bullets with embedded code examples', () => {
    const slide: CourseSlide = {
      id: 'content',
      kind: 'content',
      eyebrow: '知识点 01 · 1.3',
      title: '四条必须记住的语法限制',
      bullets: [
        {
          title: 'key 必须是双引号字符串',
          text: "name 和 'name' 都不行。",
          code: {
            language: 'json',
            source: '{ "name": "Bob" }',
          },
        },
      ],
      note: {
        tone: 'rule',
        label: '一句话',
        text: '把结构化数据变成可以传输的字符串。',
      },
    }

    render(<SlideRenderer slide={slide} accent={accent} />)

    expect(screen.getByText('key 必须是双引号字符串')).toBeInTheDocument()
    expect(screen.getByText(/name 和 'name' 都不行/)).toBeInTheDocument()
    expect(
      screen.getByText((_, element) =>
        element?.tagName === 'CODE' &&
        element.textContent?.includes('"name"') &&
        element.textContent?.includes('"Bob"')
          ? true
          : false,
      ),
    ).toBeInTheDocument()
  })

  it('renders highlighted code lines in code slides', () => {
    const slide: CourseSlide = {
      id: 'code',
      kind: 'code',
      title: '01-json-basics.js',
      code: {
        language: 'javascript',
        filename: '01-json-basics.js',
        source: [
          'const text = JSON.stringify(DATA)',
          'const back = JSON.parse(text)',
        ].join('\n'),
        highlightLines: [1],
      },
    }

    render(<SlideRenderer slide={slide} accent={accent} />)

    expect(screen.getAllByText('01-json-basics.js')).toHaveLength(2)
    expect(document.querySelector('[data-highlighted="true"]')).not.toBeNull()
  })
})
