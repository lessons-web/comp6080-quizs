# Week 2 Course Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Week 2 从 placeholder 课程骨架补成完整的 CSS PPT + Live Demo 闭环，并与 Week 4 的课程 / demo 体验保持一致。

**Architecture:** 直接在 `src/lib/content/courses.ts` 中把 Week 2 的 placeholder lessons 替换成真实 slide deck，同时在 `src/lib/content/demos.ts` 注册 5 个 Week 2 CSS demo，并在 `public/course-demos/week2/` 下提供独立 HTML 实验页。先用课程与 demo 内容测试把目标结构钉住，再补课程内容和 demo 资产，最后跑内容层和页面层回归验证。

**Tech Stack:** TypeScript content registry, static HTML demos, Vitest

---

### Task 1: 锁定 Week 2 课程与 Demo 内容测试

**Files:**
- Modify: `src/lib/content/courses.test.ts`
- Modify: `src/lib/content/demos.test.ts`
- Test: `src/lib/content/courses.test.ts`
- Test: `src/lib/content/demos.test.ts`

- [ ] **Step 1: 为 Week 2 课程写失败测试**

```ts
describe('course week 2 rollout', () => {
  it('uses a structured overview and keeps grid/frameworks as slide-first content', () => {
    const overview = getCourseLesson('week-2', 'overview')
    const grid = getCourseLesson('week-2', 'grid-frameworks')

    expect(overview).not.toBeNull()
    expect(overview?.lesson.status).toBe('ready')
    expect(overview?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])

    expect(grid?.lesson.status).toBe('ready')
    expect(grid?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(false)
    expect(grid?.lesson.slides.some((slide) => slide.kind === 'compare')).toBe(true)
  })

  it('uses demo entries for cascade, box model, flex, positioning and responsive lessons', () => {
    const flex = getCourseLesson('week-2', 'flexbox')
    const responsive = getCourseLesson('week-2', 'responsive-viewport')

    const flexDemo = flex?.lesson.slides.find((slide) => slide.kind === 'demo')
    const responsiveDemo = responsive?.lesson.slides.find((slide) => slide.kind === 'demo')

    expect(flex?.lesson.status).toBe('ready')
    expect(flexDemo?.demo?.route).toBe('/demos/week-2/css/flex-alignment')

    expect(responsive?.lesson.status).toBe('ready')
    expect(responsiveDemo?.demo?.route).toBe('/demos/week-2/css/responsive-breakpoints')
    expect(responsiveDemo?.demo?.objectives?.length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: 为 Week 2 demo registry 写失败测试**

```ts
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
```

- [ ] **Step 3: 运行测试，确认它们先失败**

Run: `pnpm vitest run src/lib/content/courses.test.ts src/lib/content/demos.test.ts`
Expected: FAIL，因为 Week 2 还是 placeholder，demo 也尚未注册。

### Task 2: 把 Week 2 课程从 placeholder 改成真实 slide deck

**Files:**
- Modify: `src/lib/content/courses.ts`
- Test: `src/lib/content/courses.test.ts`

- [ ] **Step 1: 新增 Week 2 overview lesson，并保持 4 张纯讲解 slide**

```ts
{
  id: 'overview',
  title: '本周导览：从层叠到响应式',
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

- [ ] **Step 2: 把 `selectors-cascade`、`box-model`、`flexbox`、`positioning-stacking`、`responsive-viewport` 改成真实 lesson，并给它们各放 1 个 demo slide**

```ts
demo: {
  route: '/demos/week-2/css/flex-alignment',
  ctaLabel: '打开实验',
  objectives: ['比较 justify-content / align-items 的差异', '观察 flex-grow / shrink 带来的布局变化'],
}
```

- [ ] **Step 3: 把 `grid-frameworks` 保持成 slide-first lesson，只用 compare / content / codes 解释，不加 demo slide**

```ts
{
  id: 'grid-frameworks',
  status: 'ready',
  slides: [
    { id: 'cover', kind: 'cover', ... },
    { id: 'grid-core', kind: 'content', ... },
    { id: 'grid-vs-framework', kind: 'compare', ... },
    { id: 'closing', kind: 'closing', ... },
  ],
}
```

- [ ] **Step 4: 运行课程测试，确认 Week 2 slide 结构成立**

Run: `pnpm vitest run src/lib/content/courses.test.ts`
Expected: PASS

### Task 3: 注册 Week 2 demo 并创建静态实验页

**Files:**
- Modify: `src/lib/content/demos.ts`
- Create: `public/course-demos/week2/02a-cascade-inspector-demo.html`
- Create: `public/course-demos/week2/02b-box-model-lab-demo.html`
- Create: `public/course-demos/week2/02c-flex-alignment-demo.html`
- Create: `public/course-demos/week2/02d-position-stacking-demo.html`
- Create: `public/course-demos/week2/02e-responsive-breakpoints-demo.html`
- Test: `src/lib/content/demos.test.ts`

- [ ] **Step 1: 在 demo registry 中注册 5 个 Week 2 CSS demo**

```ts
{
  route: '/demos/week-2/css/cascade-inspector',
  slug: ['week-2', 'css', 'cascade-inspector'],
  title: '选择器与层叠检视器',
  weekId: 'week-2',
  lessonId: 'selectors-cascade',
  sourceHtmlPath: '/course-demos/week2/02a-cascade-inspector-demo.html',
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
    language: 'css',
    filename: '02c-flex-alignment.css',
    source: '.toolbar { display: flex; justify-content: space-between; align-items: center; }',
    highlightLines: [1],
  },
]
```

- [ ] **Step 4: 运行 demo 内容测试，确认 slug 与 demo 资产路径可解析**

Run: `pnpm vitest run src/lib/content/demos.test.ts`
Expected: PASS

### Task 4: 跑 Week 2 回归验证

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
- Week 2 已从 placeholder 改成 ready lesson
- 5 个 CSS lesson 都接上了独立 demo 入口
- grid/frameworks 仍是 slide-first，不做重型 demo
- demo registry 与静态 HTML 资产已经对齐
```
