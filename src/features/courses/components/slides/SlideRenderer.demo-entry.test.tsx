import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CourseSlide } from '../../../../types/course'
import { SlideRenderer } from './SlideRenderer'

const accent = {
  gradient: 'from-emerald-500 to-green-600',
  text: 'text-emerald-700',
}

describe('SlideRenderer demo entry slide', () => {
  it('renders demo slides as experiment entry cards instead of iframes', () => {
    const slide: CourseSlide = {
      id: 'stringify-parse-demo',
      kind: 'demo',
      eyebrow: '知识点 01 · 1.4',
      title: 'live demo · stringify / parse 双向转换',
      subtitle: '这一页是实验入口，不直接承载 demo 本身。',
      demo: {
        route: '/demos/week-4/json/stringify-parse',
        ctaLabel: '打开实验',
        objectives: [
          '观察 parse 成功与失败的区别',
          '比较紧凑字符串和格式化字符串',
        ],
      },
    }

    render(<SlideRenderer slide={slide} accent={accent} />)

    expect(screen.getByText('打开实验')).toBeInTheDocument()
    expect(screen.getByText('观察 parse 成功与失败的区别')).toBeInTheDocument()
    expect(screen.getByText('比较紧凑字符串和格式化字符串')).toBeInTheDocument()
    expect(screen.queryByTitle('live demo · stringify / parse 双向转换')).toBeNull()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('实验入口在新窗口打开，避免打断课件学习流', () => {
    const slide: CourseSlide = {
      id: 'stringify-parse-demo',
      kind: 'demo',
      title: 'live demo · stringify / parse 双向转换',
      demo: {
        route: '/demos/week-4/json/stringify-parse',
        ctaLabel: '打开实验',
      },
    }

    render(<SlideRenderer slide={slide} accent={accent} />)

    const link = screen.getByText('打开实验').closest('a')
    expect(link).toHaveAttribute('href', '/demos/week-4/json/stringify-parse')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link?.getAttribute('rel')).toContain('noreferrer')
  })
})
