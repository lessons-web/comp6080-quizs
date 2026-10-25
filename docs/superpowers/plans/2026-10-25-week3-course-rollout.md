# Week 3 Course Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Week 3 从 placeholder 课程骨架补成完整的 JavaScript PPT + Live Demo 闭环，并与 Week 1 / Week 2 / Week 4 的课程体验保持一致。

**Architecture:** 直接在 `src/lib/content/courses.ts` 中把 Week 3 的 placeholder lessons 替换成真实 slide deck，同时在 `src/lib/content/demos.ts` 注册 5 个 Week 3 JavaScript demo，并在 `public/course-demos/week3/` 下提供独立 HTML 实验页。先用课程与 demo 内容测试钉住结构，再补课程内容和 demo 资产，最后跑内容层和页面层回归验证。

**Tech Stack:** TypeScript content registry, static HTML demos, Vitest

---

### Task 1: 锁定 Week 3 课程与 Demo 内容测试

**Files:**
- Modify: `src/lib/content/courses.test.ts`
- Modify: `src/lib/content/demos.test.ts`
- Test: `src/lib/content/courses.test.ts`
- Test: `src/lib/content/demos.test.ts`

- [ ] **Step 1: 为 Week 3 课程写失败测试**

```ts
describe('course week 3 rollout', () => {
  it('uses a structured overview and keeps ecosystem/npm as slide-first content', () => {
    const overview = getCourseLesson('week-3', 'overview')
    const ecosystem = getCourseLesson('week-3', 'ecosystem-npm')

    expect(overview).not.toBeNull()
    expect(overview?.lesson.status).toBe('ready')
    expect(overview?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])

    expect(ecosystem?.lesson.status).toBe('ready')
    expect(ecosystem?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(false)
    expect(ecosystem?.lesson.slides.some((slide) => slide.kind === 'flow')).toBe(true)
  })

  it('uses demo entries for closures, dom, events, forms and storage lessons', () => {
    const closures = getCourseLesson('week-3', 'functions-closures')
    const storage = getCourseLesson('week-3', 'storage')

    const closureDemo = closures?.lesson.slides.find((slide) => slide.kind === 'demo')
    const storageDemo = storage?.lesson.slides.find((slide) => slide.kind === 'demo')

    expect(closures?.lesson.status).toBe('ready')
    expect(closureDemo?.demo?.route).toBe('/demos/week-3/javascript/closure-snapshot')

    expect(storage?.lesson.status).toBe('ready')
    expect(storageDemo?.demo?.route).toBe('/demos/week-3/javascript/localstorage-notes')
    expect(storageDemo?.demo?.objectives?.length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: 为 Week 3 demo registry 写失败测试**

```ts
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
```

- [ ] **Step 3: 运行测试，确认它们先失败**

Run: `pnpm vitest run src/lib/content/courses.test.ts src/lib/content/demos.test.ts`
Expected: FAIL，因为 Week 3 还是 placeholder，demo 也尚未注册。

### Task 2: 把 Week 3 课程从 placeholder 改成真实 slide deck

**Files:**
- Modify: `src/lib/content/courses.ts`
- Test: `src/lib/content/courses.test.ts`

- [ ] **Step 1: 新增 Week 3 overview lesson，并保持 4 张纯讲解 slide**

```ts
{
  id: 'overview',
  title: '本周导览：让页面开始响应用户',
  short: '本周导览',
  status: 'ready',
  slides: [
    { id: 'cover', kind: 'cover', ... },
    { id: 'roadmap', kind: 'roadmap', ... },
    { id: 'cards', kind: 'cards', ... },
    { id: 'closing', kind: 'closing', ... },
  ],
}
```

- [ ] **Step 2: 把 `functions-closures`、`dom`、`events`、`forms`、`storage` 改成真实 lesson，并给它们各放 1 个 demo slide**

```ts
demo: {
  route: '/demos/week-3/javascript/dom-query',
  ctaLabel: '打开实验',
  objectives: ['比较 querySelector / querySelectorAll 的返回值', '观察 classList / textContent 的修改结果'],
}
```

- [ ] **Step 3: 把 `js-intro-syntax` 与 `ecosystem-npm` 保持成 concept-first lesson，只用 content / compare / code / flow 讲清楚，不加 demo slide**

```ts
{
  id: 'ecosystem-npm',
  status: 'ready',
  slides: [
    { id: 'cover', kind: 'cover', ... },
    { id: 'runtime-flow', kind: 'content', flow: [...] },
    { id: 'browser-vs-node', kind: 'compare', ... },
    { id: 'closing', kind: 'closing', ... },
  ],
}
```

- [ ] **Step 4: 运行课程测试，确认 Week 3 slide 结构成立**

Run: `pnpm vitest run src/lib/content/courses.test.ts`
Expected: PASS

### Task 3: 注册 Week 3 demo 并创建静态实验页

**Files:**
- Modify: `src/lib/content/demos.ts`
- Create: `public/course-demos/week3/03a-closure-snapshot-demo.html`
- Create: `public/course-demos/week3/03b-dom-query-demo.html`
- Create: `public/course-demos/week3/03c-event-propagation-demo.html`
- Create: `public/course-demos/week3/03d-form-validation-demo.html`
- Create: `public/course-demos/week3/03e-localstorage-notes-demo.html`
- Test: `src/lib/content/demos.test.ts`

- [ ] **Step 1: 在 demo registry 中注册 5 个 Week 3 JavaScript demo**

```ts
{
  route: '/demos/week-3/javascript/closure-snapshot',
  slug: ['week-3', 'javascript', 'closure-snapshot'],
  title: '闭包快照实验',
  weekId: 'week-3',
  lessonId: 'functions-closures',
  sourceHtmlPath: '/course-demos/week3/03a-closure-snapshot-demo.html',
}
```

- [ ] **Step 2: 创建 5 个独立 HTML demo 页，统一复用 `../week4/assets/demo.css` 与 `../week4/assets/demo.js`**

```html
<link rel="stylesheet" href="../week4/assets/demo.css" />
<script src="../week4/assets/demo.js"></script>
```

- [ ] **Step 3: 每个 demo 都提供 1 段课程里能直接对上的核心代码**

```ts
codes: [
  {
    language: 'javascript',
    filename: '03b-dom-query-demo.js',
    source: 'const nodes = document.querySelectorAll(".item")',
    highlightLines: [1],
  },
]
```

- [ ] **Step 4: 运行 demo 内容测试，确认 slug 与 demo 资产路径可解析**

Run: `pnpm vitest run src/lib/content/demos.test.ts`
Expected: PASS

### Task 4: 跑 Week 3 回归验证

**Files:**
- Test: `src/lib/content/courses.test.ts`
- Test: `src/lib/content/demos.test.ts`
- Test: `src/features/demos/DemoPage.test.tsx`
- Test: `src/features/courses/components/slides/SlideRenderer.test.tsx`

- [ ] **Step 1: 运行课程与 demo 内容测试**

Run: `pnpm vitest run src/lib/content/courses.test.ts src/lib/content/demos.test.ts`
Expected: PASS

- [ ] **Step 2: 运行课程页与 demo 页回归测试**

Run: `pnpm vitest run src/features/demos/DemoPage.test.tsx src/features/courses/components/slides/SlideRenderer.test.tsx`
Expected: PASS

- [ ] **Step 3: 汇报时明确说明**

```text
需要汇报：
- Week 3 已从 placeholder 改成 ready lesson
- 5 个 JavaScript lesson 都接上了独立 demo 入口
- js-intro-syntax 与 ecosystem/npm 仍是 concept-first，不做伪 demo
- demo registry 与静态 HTML 资产已经对齐
```
