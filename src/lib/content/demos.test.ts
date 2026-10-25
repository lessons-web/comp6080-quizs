import { describe, expect, it } from 'vitest'

import { getDemoBySlug } from './demos'

describe('demos content layer', () => {
  it('resolves week 1 document skeleton demo by slug', () => {
    const demo = getDemoBySlug(['week-1', 'html', 'document-skeleton'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('HTML 文档骨架观察器')
    expect(demo?.lessonId).toBe('structure')
    expect(demo?.sourceHtmlPath).toBe('/course-demos/week1/01a-document-skeleton-demo.html')
  })

  it('resolves week 1 lists/tables/code demo by slug', () => {
    const demo = getDemoBySlug(['week-1', 'html', 'lists-tables-code'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('列表、表格与代码标签实验')
    expect(demo?.lessonId).toBe('lists-tables')
    expect(demo?.sourceHtmlPath).toBe('/course-demos/week1/01d-lists-tables-code-demo.html')
  })

  it('resolves week 2 cascade inspector demo by slug', () => {
    const demo = getDemoBySlug(['week-2', 'css', 'cascade-inspector'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('选择器与层叠检视器')
    expect(demo?.lessonId).toBe('selectors-cascade')
    expect(demo?.sourceHtmlPath).toBe('/course-demos/week2/02a-cascade-inspector-demo.html')
  })

  it('resolves week 2 responsive breakpoint demo by slug', () => {
    const demo = getDemoBySlug(['week-2', 'css', 'responsive-breakpoints'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('响应式断点实验')
    expect(demo?.lessonId).toBe('responsive-viewport')
    expect(demo?.sourceHtmlPath).toBe('/course-demos/week2/02e-responsive-breakpoints-demo.html')
  })

  it('resolves week 3 closure snapshot demo by slug', () => {
    const demo = getDemoBySlug(['week-3', 'javascript', 'closure-snapshot'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('闭包快照实验')
    expect(demo?.lessonId).toBe('functions-closures')
    expect(demo?.sourceHtmlPath).toBe('/course-demos/week3/03a-closure-snapshot-demo.html')
  })

  it('resolves week 3 localstorage notes demo by slug', () => {
    const demo = getDemoBySlug(['week-3', 'javascript', 'localstorage-notes'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('localStorage 笔记实验')
    expect(demo?.lessonId).toBe('storage')
    expect(demo?.sourceHtmlPath).toBe('/course-demos/week3/03e-localstorage-notes-demo.html')
  })

  it('resolves week 4 stringify parse demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'json', 'stringify-parse'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('stringify / parse 双向转换')
    expect(demo?.weekId).toBe('week-4')
    expect(demo?.lessonId).toBe('data-interchange')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/01a-stringify-parse-demo.html',
    )
    expect(demo?.codes[0]?.filename).toBe('01a-stringify-parse-demo.js')
    expect(demo?.backToCourseHref).toBe('/courses/week-4/data-interchange')
  })

  it('resolves week 4 localstorage demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'json', 'localstorage'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('JSON + localStorage 持久化')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/01b-localstorage-demo.html',
    )
    expect(demo?.codes[0]?.filename).toBe('01b-localstorage-demo.js')
    expect(demo?.objectives).toContain('观察 localStorage 里真实存着的字符串')
  })

  it('resolves week 4 xhr request demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'xhr', 'request'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('最小 XHR GET 请求')
    expect(demo?.weekId).toBe('week-4')
    expect(demo?.lessonId).toBe('xhr')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/02a-xhr-request-demo.html',
    )
    expect(demo?.codes[0]?.filename).toBe('02a-xhr-request-demo.js')
    expect(demo?.backToCourseHref).toBe('/courses/week-4/xhr')
  })

  it('resolves week 4 xhr error-paths demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'xhr', 'error-paths'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('两条错误路径对照')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/02b-xhr-error-paths-demo.html',
    )
    expect(demo?.codes[0]?.filename).toBe('02b-xhr-error-paths-demo.js')
    expect(demo?.objectives).toContain('确认 4xx 走 onload 而不是 onerror')
  })

  it('resolves week 4 fetch response inspector demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'fetch', 'response-inspector'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('fetch 与 Response 检视器')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/03a-fetch-response-demo.html',
    )
    expect(demo?.codes[0]?.filename).toBe('03a-fetch-response-demo.js')
    expect(demo?.backToCourseHref).toBe('/courses/week-4/fetch')
  })

  it('resolves week 4 fetch post/body demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'fetch', 'post-and-body'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('POST 请求与 body 读取规则')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/03b-fetch-post-body-demo.html',
    )
    expect(demo?.codes).toHaveLength(2)
    expect(demo?.codes[0]?.filename).toBe('03b-fetch-post-demo.js')
  })

  it('resolves week 4 promise state demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'promise', 'state-and-chain'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('Promise 状态机与链式')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/04a-promise-state-demo.html',
    )
    expect(demo?.codes[0]?.filename).toBe('04a-promise-state-demo.js')
    expect(demo?.backToCourseHref).toBe('/courses/week-4/promise')
  })

  it('resolves week 4 promise combinators demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'promise', 'combinators-and-errors'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('Promise 编排与错误兜底')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/04b-promise-combinators-demo.html',
    )
    expect(demo?.codes).toHaveLength(2)
    expect(demo?.codes[0]?.filename).toBe('04b-promise-combinators-demo.js')
  })

  it('resolves week 4 async serial/parallel demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'async-await', 'serial-vs-parallel'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('串行 await 与 Promise.all')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/05a-async-serial-parallel-demo.html',
    )
    expect(demo?.codes).toHaveLength(2)
    expect(demo?.codes[0]?.filename).toBe('05a-async-serial-demo.js')
    expect(demo?.backToCourseHref).toBe('/courses/week-4/async-await')
  })

  it('resolves week 4 async errors/pitfalls demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'async-await', 'errors-and-pitfalls'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('try / catch / finally 与 async 坑点')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/05b-async-errors-demo.html',
    )
    expect(demo?.codes).toHaveLength(2)
    expect(demo?.codes[0]?.filename).toBe('05b-async-try-catch-demo.js')
  })

  it('resolves week 4 http request/response demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'http-server', 'request-response'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('HTTP 请求-响应检视器')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/06a-http-request-response-demo.html',
    )
    expect(demo?.codes).toHaveLength(2)
    expect(demo?.codes[0]?.filename).toBe('06a-http-packets.http')
    expect(demo?.backToCourseHref).toBe('/courses/week-4/http-server')
  })

  it('resolves week 4 express routing demo by slug', () => {
    const demo = getDemoBySlug(['week-4', 'http-server', 'express-routing'])

    expect(demo).not.toBeNull()
    expect(demo?.title).toBe('Express 路由与 RESTful')
    expect(demo?.sourceHtmlPath).toBe(
      '/course-demos/week4/06b-express-routing-demo.html',
    )
    expect(demo?.codes).toHaveLength(2)
    expect(demo?.codes[0]?.filename).toBe('06b-express-server.js')
  })
})
