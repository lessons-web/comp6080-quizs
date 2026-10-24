import { describe, expect, it } from 'vitest'

import { getDemoBySlug } from './demos'

describe('demos content layer', () => {
  it('resolves week 4 stringify parse demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'json', 'stringify-parse'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('stringify / parse 双向转换')
    expect(demo?.weekId).toBe('week-4')
    expect(demo?.lessonId).toBe('data-interchange')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/01a-stringify-parse-demo.html',
    )
    expect(demo?.backToCourseHref).toBe('/courses/week-4/data-interchange')
  })

  it('resolves week 4 localstorage demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'json', 'localstorage'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('JSON + localStorage 持久化')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/01b-localstorage-demo.html',
    )
    expect(demo?.objectives).toContain('观察 localStorage 里真实存着的字符串')
  })
})
