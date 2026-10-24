import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { DemoDefinition } from '../../types/demo'
import { DemoDetailPage, DemoIndexPage } from './DemoPage'

const demo: DemoDefinition = {
  route: '/demos/week-4/json/stringify-parse',
  slug: ['week-4', 'json', 'stringify-parse'],
  title: 'stringify / parse 双向转换',
  subtitle: '现场观察 parse 成功与失败的区别。',
  weekId: 'week-4',
  lessonId: 'data-interchange',
  lessonTitle: '数据交换格式与 JSON',
  objectives: [
    '观察 parse 成功与失败的区别',
    '比较紧凑字符串和格式化字符串',
    '验证 stringify 会丢掉哪些值',
  ],
  sourceHtmlPath: '/course-demos/week4/01a-stringify-parse-demo.html',
  backToCourseHref: '/courses/week-4/data-interchange',
  topicLabel: 'Week 4 · JSON',
}

describe('DemoDetailPage', () => {
  it('目录页的打开实验入口使用新窗口', () => {
    render(<DemoIndexPage demos={[demo]} />)

    const link = screen.getByRole('link', { name: '打开实验' })
    expect(link).toHaveAttribute('href', demo.route)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noreferrer')
  })

  it('使用 1:2 左右分栏布局承载说明与实验区', () => {
    render(<DemoDetailPage demo={demo} />)

    const split = screen.getByTestId('demo-detail-split')
    expect(split.className).toContain('md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]')
    expect(split.className).not.toContain('max-w-7xl')
    expect(split.className).not.toContain('px-4')

    const info = screen.getByTestId('demo-detail-info')
    const stage = screen.getByTestId('demo-detail-stage')
    expect(split).toContainElement(info)
    expect(split).toContainElement(stage)
    expect(info.className).toContain('px-4')
  })

  it('页面使用整体滚动，而不是右侧单独滚动', () => {
    render(<DemoDetailPage demo={demo} />)

    const root = screen.getByTestId('demo-detail-root')
    expect(root.className).toContain('h-full')
    expect(root.className).toContain('overflow-y-auto')

    const stage = screen.getByTestId('demo-detail-stage')
    expect(stage.className).toContain('px-4')
    expect(stage.className).not.toContain('rounded-3xl')
  })

  it('页面本身就是独立实验页，不再额外提供二次打开按钮', () => {
    render(<DemoDetailPage demo={demo} />)

    expect(
      screen.getByText(/这个页面本身就是独立实验页/),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /新窗口打开实验/ }),
    ).not.toBeInTheDocument()
  })

  it('保留返回课件的入口', () => {
    render(<DemoDetailPage demo={demo} />)

    const link = screen.getByRole('link', { name: '返回课件' })
    expect(link).toHaveAttribute('href', demo.backToCourseHref)
  })

  it('渲染实验台 iframe 与观察点', () => {
    render(<DemoDetailPage demo={demo} />)

    const iframe = document.querySelector('iframe')
    expect(iframe).toHaveAttribute(
      'src',
      demo.sourceHtmlPath,
    )
    expect((iframe as HTMLIFrameElement | null)?.style.minHeight).toBe('720px')
    expect(screen.getByText('观察 parse 成功与失败的区别')).toBeInTheDocument()
  })
})
