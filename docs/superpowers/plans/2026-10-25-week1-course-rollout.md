# Week 1 Course Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Week 1 从 placeholder 课程骨架补成完整的 PPT + Live Demo 闭环，并保持与 Week 4 一致的课程 / demo 体验。

**Architecture:** 直接在 `src/lib/content/courses.ts` 中把 Week 1 的 placeholder lessons 替换成真实 slide deck，同时在 `src/lib/content/demos.ts` 注册 4 个 Week 1 demo，并在 `public/course-demos/week1/` 下提供独立 HTML 实验页。先用课程与 demo 内容测试把行为钉住，再补课程内容和 demo 资产，最后跑回归验证。

**Tech Stack:** TypeScript content registry, static HTML demos, Vitest

---

### Task 1: 锁定 Week 1 课程与 Demo 内容测试

**Files:**
- Modify: `src/lib/content/courses.test.ts`
- Modify: `src/lib/content/demos.test.ts`
- Test: `src/lib/content/courses.test.ts`
- Test: `src/lib/content/demos.test.ts`

- [ ] **Step 1: 为 Week 1 课程写失败测试**

```ts
describe('course week 1 rollout', () => {
  it('uses a structured overview and a flow-first git lesson', () => {
    const overview = getCourseLesson('week-1', 'overview')
    const git = getCourseLesson('week-1', 'course-overview-git')

    expect(overview).not.toBeNull()
    expect(overview?.lesson.status).toBe('ready')
    expect(overview?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])

    expect(git).not.toBeNull()
    expect(git?.lesson.status).toBe('ready')
    expect(git?.lesson.slides.some((slide) => slide.kind === 'flow')).toBe(true)
    expect(git?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(false)
  })

  it('uses code -> demo rhythm for html structure and links lessons', () => {
    const structure = getCourseLesson('week-1', 'structure')
    const links = getCourseLesson('week-1', 'links-images')

    const structureDemo = structure?.lesson.slides.find((slide) => slide.kind === 'demo')
    const linksDemo = links?.lesson.slides.find((slide) => slide.kind === 'demo')

    expect(structure?.lesson.status).toBe('ready')
    expect(structureDemo?.demo?.route).toBe('/demos/week-1/html/document-skeleton')
    expect(structureDemo?.demo?.ctaLabel).toContain('打开实验')

    expect(links?.lesson.status).toBe('ready')
    expect(linksDemo?.demo?.route).toBe('/demos/week-1/html/paths-and-images')
    expect(linksDemo?.demo?.objectives?.length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: 为 Week 1 demo 注册写失败测试**

```ts
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
```

- [ ] **Step 3: 运行测试，确认它们先失败**

Run: `pnpm vitest run src/lib/content/courses.test.ts src/lib/content/demos.test.ts`
Expected: FAIL，因为 Week 1 还是 placeholder，demo 也尚未注册。

### Task 2: 把 Week 1 课程从 placeholder 改成真实 slide deck

**Files:**
- Modify: `src/lib/content/courses.ts`
- Test: `src/lib/content/courses.test.ts`

- [ ] **Step 1: 为 Week 1 新增 overview lesson，并保持 4 张纯讲解 slide**

```ts
{
  id: 'overview',
  title: '本周导览：从 Git 到 HTML 语义结构',
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

- [ ] **Step 2: 把 `course-overview-git` 改成 flow-first 的真实 lesson**

```ts
{
  id: 'course-overview-git',
  status: 'ready',
  slides: [
    { id: 'cover', kind: 'cover', ... },
    { id: 'workflow', kind: 'content', flow: [...] },
    { id: 'good-vs-bad-commit', kind: 'compare', ... },
    { id: 'minimum-commands', kind: 'cards', ... },
    { id: 'closing', kind: 'closing', ... },
  ],
}
```

- [ ] **Step 3: 把 `structure`、`semantics`、`links-images`、`lists-tables` 改成真实 lesson，并给 4 节 HTML 课各放 1 个 demo slide**

```ts
demo: {
  route: '/demos/week-1/html/document-skeleton',
  ctaLabel: '打开实验',
  objectives: ['观察 doctype / head / body 缺失时的差异', '建立最小 HTML 骨架直觉'],
}
```

- [ ] **Step 4: 运行课程测试，确认 Week 1 slide 结构成立**

Run: `pnpm vitest run src/lib/content/courses.test.ts`
Expected: PASS

### Task 3: 注册 Week 1 demo 并创建静态实验页

**Files:**
- Modify: `src/lib/content/demos.ts`
- Create: `public/course-demos/week1/01a-document-skeleton-demo.html`
- Create: `public/course-demos/week1/01b-semantic-landmarks-demo.html`
- Create: `public/course-demos/week1/01c-paths-images-demo.html`
- Create: `public/course-demos/week1/01d-lists-tables-code-demo.html`
- Test: `src/lib/content/demos.test.ts`

- [ ] **Step 1: 在 demo registry 中注册 4 个 Week 1 demo**

```ts
{
  route: '/demos/week-1/html/document-skeleton',
  slug: ['week-1', 'html', 'document-skeleton'],
  title: 'HTML 文档骨架观察器',
  weekId: 'week-1',
  lessonId: 'structure',
  sourceHtmlPath: '/course-demos/week1/01a-document-skeleton-demo.html',
}
```

- [ ] **Step 2: 创建 4 个独立 HTML demo 页，统一复用 `../week4/assets/demo.css` 与 `../week4/assets/demo.js`**

```html
<link rel="stylesheet" href="../week4/assets/demo.css" />
<script src="../week4/assets/demo.js"></script>
```

- [ ] **Step 3: 每个 demo 至少提供 1 段 `codes` 对照里提到的核心代码行为**

```ts
codes: [
  {
    language: 'html',
    filename: '01a-document-skeleton.html',
    source: '<!doctype html>...',
    highlightLines: [1, 3, 6],
  },
]
```

- [ ] **Step 4: 运行 demo 内容测试，确认 slug 与 demo 资产路径可解析**

Run: `pnpm vitest run src/lib/content/demos.test.ts`
Expected: PASS

### Task 4: 跑 Week 1 回归验证

**Files:**
- Test: `src/lib/content/courses.test.ts`
- Test: `src/lib/content/demos.test.ts`

- [ ] **Step 1: 运行课程与 demo 内容测试**

Run: `pnpm vitest run src/lib/content/courses.test.ts src/lib/content/demos.test.ts`
Expected: PASS

- [ ] **Step 2: 汇报时明确说明**

```text
需要汇报：
- Week 1 已从 placeholder 改成 ready lesson
- Git 课保持 flow-first，不做伪 demo
- 4 个 HTML lesson 都有独立 demo 入口
- demo registry 与静态 HTML 资产已经对齐
```
