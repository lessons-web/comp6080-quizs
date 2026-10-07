# 知识点解析模块重构 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 把"知识点解析"Tab 改造成「卡片首页 + 双栏详情页」的文档库结构，左列表（支持搜索）右详情（Markdown 正文 + 题库关联入口）。

**架构：** 内容侧把单个长 MDX 拆为 `content/knowledge/{topic}/{id}.mdx` 多条小知识点文件；类型层新增 `Difficulty` / `KnowledgePointMeta`；加载层用 `import.meta.glob` 的 **/*.mdx 扫描并提供卡片/列表/详情三类 API；UI 层拆为 TopicCardGrid（4 卡片）与 KnowledgeSplitLayout（双栏）两个子模块，内部滚动不产出外部滚动条）。

**技术栈：** React 19 + TypeScript 6 + Tailwind v4（零配置） + MDX 3 + React Router 7

---

## 文件职责总览

**新增：**
- `content/knowledge/html/001-structure-semantics.mdx` — HTML 知识点 1
- `content/knowledge/html/002-paths-images.mdx` — HTML 知识点 2
- `content/knowledge/html/003-code-tags.mdx` — HTML 知识点 3
- `content/knowledge/css/001-specificity.mdx` — CSS 知识点 1
- `content/knowledge/css/002-box-model.mdx` — CSS 知识点 2
- `content/knowledge/css/003-flexbox.mdx` — CSS 知识点 3
- `content/knowledge/css/004-stacking-context.mdx` — CSS 知识点 4
- `src/features/knowledge/components/TopicCardGrid.tsx` — 卡片首页网格
- `src/features/knowledge/components/TopicCard.tsx` — 单张 topic 卡片
- `src/features/knowledge/components/KnowledgeSplitLayout.tsx` — 双栏容器
- `src/features/knowledge/components/KnowledgeListPanel.tsx` — 左栏（搜索+列表）
- `src/features/knowledge/components/KnowledgeListItem.tsx` — 单条列表项
- `src/features/knowledge/components/KnowledgeDetailPanel.tsx` — 右栏详情

**修改：**
- `src/types/content.ts` — 新增 Difficulty / KnowledgePointMeta；删除 KnowledgeFrontmatter；扩展 TOPIC_META
- `src/lib/content/knowledge.ts` — 重写 glob 和 API（删除旧的单文件接口）
- `src/app/router.tsx` — 根路由与兜底改为 `/knowledge`；knowledge/* 仍由 KnowledgePage 处理
- `src/components/Header.tsx` — 知识点解析 Tab 跳转改为 `/knowledge`
- `src/features/knowledge/KnowledgePage.tsx` — 三段 URL 分发 + 缺省跳转；移除旧长文渲染
- `src/content/content-files.test.ts` — 断言改为新 frontmatter 字段

**删除：**
- `content/knowledge/html.mdx`、`css.mdx`、`javascript.mdx`、`react.mdx`、`nodejs.mdx`（被 topic 目录取代）

---

## 任务 1：类型定义 + TOPIC_META 扩展

**文件：**
- 修改：`src/types/content.ts:1-64`
- 测试：`src/types/`（无独立测试，由 tsc 和后续任务的测试间接覆盖）

- [ ] **步骤 1：修改类型文件**

打开 `src/types/content.ts`，全内容替换为：

```ts
export type WeekTag = `week-${number}`

export type TopicId = 'html' | 'css' | 'javascript' | 'react' | 'nodejs'

export type Difficulty = 'easy' | 'medium' | 'hard'

export const TOPIC_META: Record<TopicId, {
  label: string
  defaultWeek: WeekTag
  description: string
  accent: string
}> = {
  html: {
    label: 'HTML',
    defaultWeek: 'week-1',
    description: '文档结构与语义化',
    accent: 'from-orange-500 to-red-500',
  },
  css: {
    label: 'CSS',
    defaultWeek: 'week-1',
    description: '样式与布局系统',
    accent: 'from-sky-500 to-blue-600',
  },
  javascript: {
    label: 'JavaScript',
    defaultWeek: 'week-2',
    description: '语言核心与异步模型',
    accent: 'from-yellow-400 to-amber-500',
  },
  react: {
    label: 'React',
    defaultWeek: 'week-3',
    description: '组件化与状态管理',
    accent: 'from-cyan-400 to-sky-500',
  },
  nodejs: {
    label: 'Node.js',
    defaultWeek: 'week-4',
    description: '服务端运行时与生态',
    accent: 'from-emerald-500 to-green-600',
  },
}

export interface ContentCodeBlock {
  language: string
  code: string
}

export interface ContentImage {
  src: string
  alt: string
}

export interface KnowledgePointMeta {
  id: string
  title: string
  topic: TopicId
  category: string
  difficulty: Difficulty
  tags: WeekTag[]
  summary: string
  createdAt: string
  updatedAt?: string
}

export interface PracticeQuestion {
  id: string
  topic: string
  weeks: WeekTag[]
  question: string
  knowledgePoint: string
  answerExplanation: string
  codeBlocks: ContentCodeBlock[]
  images: ContentImage[]
}

export interface PracticeQuestionCollection {
  topic: TopicId
  questions: PracticeQuestion[]
}

export interface MockExamQuestion {
  id: string
  question: string
  knowledgePoint: string
  answerExplanation: string
  codeBlocks: ContentCodeBlock[]
  images: ContentImage[]
}

export interface MockExam {
  id: string
  title: string
  questions: MockExamQuestion[]
}

export interface MockExamCollection {
  topic: TopicId
  exams: MockExam[]
}
```

（删除 KnowledgeFrontmatter。TOPIC_META 新增 description + accent；新增 Difficulty 与 KnowledgePointMeta；保留其它。）

- [ ] **步骤 2：tssc 验证**

运行：
```bash
cd /Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs && npx tsc -b --noEmit
```
预期：大量 "not found"（knowledge.ts 引用旧类型）错误，先忽略（下一个任务修）。类型自身部分 OK 就够。

- [ ] **步骤 3：Commit**
```bash
git add src/types/content.ts
git commit -m "feat(types): knowledge point meta type & extended topic meta"
```

---

## 任务 2：内容 MDX 文件拆分（HTML + CSS）+ 旧文件删除 + 空目录创建

**文件：**
- 创建（7 个实际 + 3 个空目录创建）：
  - `content/knowledge/html/001-structure-semantics.mdx`
  - `content/knowledge/html/002-paths-images.mdx`
  - `content/knowledge/html/003-code-tags.mdx`
  - `content/knowledge/css/001-specificity.mdx`
  - `content/knowledge/css/002-box-model.mdx`
  - `content/knowledge/css/003-flexbox.mdx`
  - `content/knowledge/css/004-stacking-context.mdx`
- 删除：`content/knowledge/html.mdx`、`content/knowledge/css.mdx`、`content/knowledge/javascript.mdx`、`content/knowledge/react.mdx`、`content/knowledge/nodejs.mdx`
- 创建空目录：`content/knowledge/javascript/`、`content/knowledge/react/`、`content/knowledge/nodejs/`（每个放一个 `.gitkeep` 方便提交）

**HTML 001：**
```mdx
---
id: "001-structure-semantics"
title: "HTML Structure and Semantics"
topic: "html"
category: "文档基础"
difficulty: "easy"
tags: ["week-1"]
summary: "HTML 文档结构、head/body 分工与语义化标签"
createdAt: "2026-09-28T12:00:00.000Z"
---

# HTML Structure and Semantics

A basic HTML document separates metadata from visible content. Elements inside `<head>` describe the document, while elements inside `<body>` become the main content users read and interact with.

Semantic HTML matters because it communicates intent. For example, `<h1>` expresses a top-level heading, and `header`, `nav`, and `footer` describe page regions more clearly than generic `div` containers. Semantic markup improves readability, maintainability, and accessibility.

## Review Checklist

- Distinguish document metadata from page content.
- Prefer semantic tags when they express meaning.
```

**HTML 002：**
```mdx
---
id: "002-paths-images"
title: "Paths, Images, and Graphics"
topic: "html"
category: "资源与可访问性"
difficulty: "medium"
tags: ["week-1"]
summary: "相对/绝对路径、alt 文本职责、SVG vs 位图选择"
createdAt: "2026-09-28T12:10:00.000Z"
---

# Paths, Images, and Graphics

Asset paths are interpreted relative to either the current document location or the site root. A relative path such as `images/logo.png` depends on the current file location, while `/images/logo.png` always resolves from the root of the site.

Image authoring also includes accessibility responsibilities. `alt` text should communicate the image's purpose, not repeat vague words such as `image`. For content like a course logo, a short descriptive alternative is more helpful.

HTML also introduces the difference between vector and bitmap graphics. SVG is usually preferred for icons, logos, and simple diagrams because it scales cleanly, while raster formats such as PNG and JPG store pixel data and are better suited to photo-like content.

## Review Checklist

- Trace whether a path is relative to the current file or the site root.
- Write meaningful `alt` text for informative images.
- Choose SVG for diagrams/logos and raster formats for photographs.
```

**HTML 003：**
```mdx
---
id: "003-code-tags"
title: "Code Presentation Tags"
topic: "html"
category: "内容标记"
difficulty: "easy"
tags: ["week-1"]
summary: "<code> 与 <pre> 的分工与组合使用"
createdAt: "2026-09-28T12:20:00.000Z"
---

# Code Presentation Tags

HTML uses `<code>` to mark content as code and `<pre>` to preserve formatting such as whitespace and line breaks. They often appear together so that the browser and readers both understand that the content is code and should keep its original layout.

## Review Checklist

- Combine `<code>` with `<pre>` when preserving layout matters.
```

**CSS 001：**
```mdx
---
id: "001-specificity"
title: "CSS Matching and Specificity"
topic: "css"
category: "选择器系统"
difficulty: "medium"
tags: ["week-1"]
summary: "选择器匹配 vs 特异性；class 胜元素；id 胜 class"
createdAt: "2026-09-28T13:00:00.000Z"
---

# CSS Matching and Specificity

CSS rules only apply when the selector actually matches the element. A class selector like `.warning` will not match an element that only has `id="warning"`, and an id selector like `#warning` will not match an element with `class="warning"`.

When multiple rules match the same element, specificity determines which rule wins. A class selector usually overrides an element selector, so `.note { color: red; }` beats `p { color: blue; }` on `<p class="note">`.

## Review Checklist

- Separate selector matching from selector specificity.
```

**CSS 002：**
```mdx
---
id: "002-box-model"
title: "Box Model and Spacing"
topic: "css"
category: "盒模型"
difficulty: "easy"
tags: ["week-1"]
summary: "width 不等于渲染宽；padding vs margin 内外分工"
createdAt: "2026-09-28T13:10:00.000Z"
---

# Box Model and Spacing

The box model explains why an element with `width: 200px` may take up more than 200 pixels in the layout. By default, total width also includes horizontal padding and borders.

Spacing decisions depend on whether the problem is inside or outside the element. `padding` changes internal spacing and click target size, while `margin` changes the space around the element.

## Review Checklist

- Use `padding` for internal spacing and `margin` for external spacing.
```

**CSS 003：**
```mdx
---
id: "003-flexbox"
title: "Flexbox and Layout Stability"
topic: "css"
category: "布局系统"
difficulty: "medium"
tags: ["week-1"]
summary: "父控子的弹性布局；主轴 justify；交叉轴 align"
createdAt: "2026-09-28T13:20:00.000Z"
---

# Flexbox and Layout Stability

Flexbox is introduced as a more stable way to align a group of elements than manually forcing positions with fixed margins. `display: flex` is typically applied to the parent container so it can control the layout of its children.

Inside a flex container, `justify-content` manages distribution along the main axis, and `align-items` manages alignment on the cross axis. Understanding the axis direction comes before choosing the property.

## Review Checklist

- Treat Flexbox as a parent-controlled layout system.
- Validate layout on multiple content lengths and screen widths.
```

**CSS 004：**
```mdx
---
id: "004-stacking-context"
title: "Stacking Context and z-index"
topic: "css"
category: "层级系统"
difficulty: "hard"
tags: ["week-1"]
summary: "z-index 非全局；受祖先 stacking context 作用域；常见失效原因"
createdAt: "2026-09-28T13:30:00.000Z"
---

# Stacking Context and z-index

`z-index` does not guarantee that a large number will always place an element on top of everything else. Stacking still depends on positioning rules and stacking contexts created by ancestors.

When a `z-index` value appears to have no effect, common causes include missing positioning, different stacking contexts, or a parent element restricting how descendants layer relative to siblings.

## Review Checklist

- Remember that `z-index` is scoped by stacking context.
- Prefer external stylesheets for reusable, maintainable CSS.
```

- [ ] **步骤 1：写入 7 个 MDX 文件** 内容如上（可用 subagent 并行写入；注意每个文件 frontmatter 字段齐全（id / title / topic / category / difficulty / tags / summary / createdAt 缺一不可）
- [ ] **步骤 2：删除旧 5 个顶层 MDX 文件**，创建 javascript/react/nodejs 三个目录各加 `.gitkeep`
- [ ] **步骤 3：git status 检查** 检查目录结构符合规格 2.2
- [ ] **步骤 4：Commit**
```bash
git add content/knowledge/
git commit -m "feat(content): split html/css knowledge md into points"
```

---

## 任务 3：数据加载层重写（knowledge.ts）

**文件：**
- 修改：`src/lib/content/knowledge.ts:1-61`
- 测试：后续任务 4 补

把 knowledge.ts 替换为：

```ts
import type { ComponentType } from 'react'

import type { KnowledgePointMeta, TopicId } from '../../types/content'
import { TOPIC_META } from '../../types/content'

type MdxFixture = {
  default: ComponentType<Record<string, never>>
  frontmatter: KnowledgePointMeta
}

type KpEntry = {
  Component: ComponentType<Record<string, never>>
  meta: KnowledgePointMeta
}

export const SUPPORTED_TOPICS = Object.keys(TOPIC_META) as TopicId[]

// 双层 glob：topic 目录下的每一个 .mdx
const kpModules = import.meta.glob<MdxFixture>(
  '../../../content/knowledge/**/*.mdx',
  { eager: false },
)

export function isSupportedTopic(value: unknown): value is TopicId {
  return typeof value === 'string' && (SUPPORTED_TOPICS as string[]).includes(value)
}

export function getAllKnowledgeTopics(): TopicId[] {
  return SUPPORTED_TOPICS.slice()
}

type KpModuleKey = string
function buildKpKey(topic: TopicId, id: string): KpModuleKey {
  return `../../../content/knowledge/${topic}/${id}.mdx`
}

interface KpKeyParts { topic: TopicId; id: string }
function parseKpKey(key: KpModuleKey): KpKeyParts | null {
  const m = key.match(/\/content\/knowledge\/([^/]+)\/([^/]+)\.mdx$/)
  if (!m) return null
  const [, topic, id] = m
  if (!isSupportedTopic(topic)) return null
  return { topic, id }
}

function sortKpList(list: KnowledgePointMeta[]): KnowledgePointMeta[] {
  return list.slice().sort((a, b) => a.id.localeCompare(b.id))
}

export async function getAllTopicSummaries() {
  const counts = new Map<TopicId, number>()
  const keys = Object.keys(kpModules)
  for (const k of keys) {
    const parts = parseKpKey(k)
    if (!parts) continue
    counts.set(parts.topic, (counts.get(parts.topic) ?? 0) + 1)
  }
  return SUPPORTED_TOPICS.map((topic) => {
    const meta = TOPIC_META[topic]
    return {
      topic,
      label: meta.label,
      description: meta.description,
      accent: meta.accent,
      pointCount: counts.get(topic) ?? 0,
    }
  })
}

export async function getKnowledgePointList(topic: TopicId): Promise<KnowledgePointMeta[]> {
  if (!isSupportedTopic(topic)) throw new Error('Unsupported topic')
  const result: KnowledgePointMeta[] = []
  const prefix = `../../../content/knowledge/${topic}/`
  for (const [key, loader] of Object.entries(kpModules)) {
    if (!key.startsWith(prefix)) continue
    const parts = parseKpKey(key)
    if (!parts || parts.topic !== topic) continue
    const mod = await loader()
    result.push(mod.frontmatter)
  }
  return sortKpList(result)
}

export async function getKnowledgePoint(
  topic: TopicId,
  knowledgeId: string,
): Promise<KpEntry> {
  if (!isSupportedTopic(topic)) throw new Error('Unsupported topic')
  const key = buildKpKey(topic, knowledgeId)
  const loader = kpModules[key]
  if (!loader) throw new Error('Knowledge point not found')
  const mod = await loader()
  return { Component: mod.default, meta: mod.frontmatter }
}
```

关键点：
- 删除旧 `getKnowledgeByTopic` / `getKnowledgeList`（它们对应旧的单文件结构）
- 用 `parseKpKey` 从 glob 路径解析 `{topic}/{id}.mdx`
- `getAllTopicSummaries`：遍历一次 glob 名不加载正文（因为 eager:false，只看路径）—— 真正的"不加载正文"；pointCount 只数一下数量
- `getKnowledgePointList`：只加载 frontmatter（`frontmatter 是 MDX frontmatter，vite @mdx-js/rollup + remark-mdx-frontmatter 会在 module 上挂 `frontmatter`
- `getKnowledgePoint`：加载单个正文 + frontmatter

- [ ] **步骤 1：覆盖写入 src/lib/content/knowledge.ts 为上述内容
- [ ] **步骤 2：tsc 验证**
```bash
cd /Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs && npx tsc -b --noEmit
```
预期：仅剩 features/knowledge/KnowledgePage.tsx 报"找不到 getKnowledgeByTopic / KnowledgeFrontmatter 未定义"等（下一个任务修）。knowledge.ts 本身 OK。
- [ ] **步骤 3：Commit**
```bash
git add src/lib/content/knowledge.ts
git commit -m "feat(content): new knowledge loader: summaries / point list / point detail"
```

---

## 任务 4：加载层测试（vitest）

**文件：**
- 修改：`src/content/content-files.test.ts:18-56`（重写第一条 MDX 用例；其余两条保持)
- 新增：`src/lib/content/knowledge.test.ts`（新文件）

### 4.1 改 content-files.test.ts

用例 1「stores knowledge MDX files with required point-level frontmatter」改成：

```ts
it('stores knowledge point MDX files with required point-level frontmatter', () => {
  const html1 = readText('content/knowledge/html/001-structure-semantics.mdx')
  const css4 = readText('content/knowledge/css/004-stacking-context.mdx')

  expect(html1).toContain('id: "001-structure-semantics"')
  expect(html1).toContain('category: "文档基础"')
  expect(html1).toContain('topic: "html"')
  expect(html1).toContain('difficulty: "easy"')
  expect(html1).toContain('tags: ["week-1"]')
  expect(html1).toContain('createdAt:')
  expect(css4).toContain('difficulty: "hard"')
  expect(css4).toContain('summary:')
})
```

（it 描述换成这个，其他两个 it 不动。

### 4.2 新建 src/lib/content/knowledge.test.ts

```ts
import { describe, expect, it } from 'vitest'

import {
  getAllTopicSummaries,
  getKnowledgePoint,
  getKnowledgePointList,
  SUPPORTED_TOPICS,
} from './knowledge'

describe('knowledge content layer', () => {
  it('getAllTopicSummaries returns 5 topics with point counts', async () => {
    const list = await getAllTopicSummaries()
    expect(list).toHaveLength(5)
    expect(list.map((s) => s.topic)).toEqual(SUPPORTED_TOPICS)
    const counts = Object.fromEntries(list.map((s) => [s.topic, s.pointCount))
    expect(counts.html).toBe(3)
    expect(counts.css).toBe(4)
    expect(counts.javascript).toBe(0)
    expect(counts.react).toBe(0)
    expect(counts.nodejs).toBe(0)
    for (const s of list) {
      expect(s.label).toBeTruthy()
      expect(s.description).toBeTruthy()
      expect(s.accent).toMatch(/^from-\w+-\d+ to-\w+-\d+$/)
    }
  })

  it('getKnowledgePointList(html) returns ordered list of 3 points with full meta', async () => {
    const list = await getKnowledgePointList('html')
    expect(list).toHaveLength(3)
    expect(list.map((m) => m.id)).toEqual([
      '001-structure-semantics',
      '002-paths-images',
      '003-code-tags',
    ])
    for (const m of list) {
      expect(m.topic).toBe('html')
      expect(m.title).toBeTruthy()
      expect(['easy', 'medium', 'hard']).toContain(m.difficulty)
      expect(m.category).toBeTruthy()
      expect(m.tags.length).toBeGreaterThan(0)
      expect(m.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    }
  })

  it('getKnowledgePoint(css, 004-stacking-context) loads body and frontmatter', async () => {
    const { meta, Component } = await getKnowledgePoint(
      'css',
      '004-stacking-context',
    )
    expect(meta.id).toBe('004-stacking-context')
    expect(meta.topic).toBe('css')
    expect(meta.difficulty).toBe('hard')
    expect(typeof Component).toBe('function')
  })

  it('getKnowledgePointList("notatopic") throws unsupported', async () => {
    await expect(
      // @ts-expect-error test illegal arg
      getKnowledgePointList('notatopic'),
    ).rejects.toThrow(/Unsupported topic/)
  })

  it('getKnowledgePoint(html, no-such-id) throws not found', async () => {
    await expect(
      getKnowledgePoint('html', 'no-such-id'),
    ).rejects.toThrow(/Knowledge point not found/)
  })
})
```

- [ ] **步骤 1：写入修改 content-files.test.ts 第一个 it
- [ ] **步骤 2：新建 knowledge.test.ts
- [ ] **步骤 3：运行测试**
```bash
cd /Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs && npx vitest run src/lib/content/knowledge.test.ts src/content/content-files.test.ts
```
预期：7 条全通过。
- [ ] **步骤 4：Commit**
```bash
git add src/content/content-files.test.ts src/lib/content/knowledge.test.ts
git commit -m "test(content): knowledge loader & point-level frontmatter tests"
```

---

## 任务 5：路由 + Header 跳转微调

**文件：**
- 修改：`src/app/router.tsx:1-37`
- 修改：`src/components/Header.tsx:3-7`

### 5.1 router.tsx

把 Navigate 目标都换成 `/knowledge`：

```ts
import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppShell } from './AppShell'

const KnowledgePage = lazy(() =>
  import('../features/knowledge/KnowledgePage').then((m) => ({
    default: m.KnowledgePage,
  })),
)
const PracticePage = lazy(() =>
  import('../features/practice/PracticePage').then((m) => ({
    default: m.PracticePage,
  })),
)
const MockExamsPage = lazy(() =>
  import('../features/mock-exams/MockExamsPage').then((m) => ({
    default: m.MockExamsPage,
  })),
)

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/knowledge" replace /> },
      { path: 'knowledge/*', element: <KnowledgePage /> },
      { path: 'practice/*', element: <PracticePage /> },
      { path: 'mock-exams/*', element: <MockExamsPage /> },
      { path: '*', element: <Navigate to="/knowledge" replace /> },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
```

### 5.2 Header.tsx

知识点解析 Tab 的 `to: '/knowledge/html'` → `to: '/knowledge'`：

```ts
const navItems = [
  { label: '知识点解析', to: '/knowledge' },
  { label: '模拟题库', to: '/practice/html' },
  { label: '模拟真题', to: '/mock-exams/html' },
]
```

- [ ] **步骤 1：写 router.tsx 与 Header.tsx
- [ ] **步骤 2：tsc + lint**
```bash
cd /Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs && npx tsc -b --noEmit ; npx oxlint
```
（KnowledgePage 对 getKnowledgeByTopic 仍有引用，它未定义，但 knowledge 的错误消失）
- [ ] **步骤 3：Commit**
```bash
git add src/app/router.tsx src/components/Header.tsx
git commit -m "feat(router): root & header nav to /knowledge card page"
```

---

## 任务 6：UI 组件 1 - 卡片首页（TopicCard + TopicCardGrid）

### 文件：
- 新增：`src/features/knowledge/components/TopicCard.tsx`
- 新增：`src/features/knowledge/components/TopicCardGrid.tsx`

### TopicCard.tsx：
```tsx
import { Link } from 'react-router-dom'

import type { TopicId } from '../../../types/content'

type TopicIconName = TopicId
function TopicIcon({ name, className }: { name: TopicIconName; className: string }) {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  }
  switch (name) {
    case 'html':
      return (
        <svg {...common}>
          <path d="m8 3-5 9 5 9" />
          <path d="m16 3 5 9-5 9" />
        </svg>
      )
    case 'css':
      return (
        <svg {...common}>
          <path d="M4 4h16l-2 14-6 2-6-2-2-14Z" />
          <path d="M8 8h8l-1 6H8Z" />
          <path d="M9 18 8 16h8l-1 2-3 1-3-1Z" />
        </svg>
      )
    case 'javascript':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h3a2 2 0 0 1 0 4H9" />
          <path d="M15 9h2v4" />
          <path d="M15 15h1v2" />
        </svg>
      )
    case 'react':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      )
    case 'nodejs':
      return (
        <svg {...common}>
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
          <path d="M12 8v8" />
          <path d="M9 11h6M9 14h4" />
        </svg>
      )
  }
}

export interface TopicCardProps {
  topic: TopicId
  label: string
  description: string
  accent: string
  pointCount: number
}

export function TopicCard({ topic, label, description, accent, pointCount }: TopicCardProps) {
  return (
    <Link
      to={`/knowledge/${topic}`}
      className="group relative flex h-[160px] flex-col overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-sm`}>
        <TopicIcon name={topic} className="h-5 w-5" />
      </div>
      <div className="mt-3 text-base font-semibold text-slate-900 group-hover:text-slate-950">
        {label}
      </div>
      <div className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
        {description}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{pointCount} 篇</span>
      </div>
    </Link>
  )
}
```

### TopicCardGrid.tsx：
```tsx
import { ContentLoading } from '../../../components/ContentLoading'
import { getAllTopicSummaries } from '../../../lib/content/knowledge'
import { useAsyncContent } from '../../../lib/hooks/useAsyncContent'
import { TopicCard } from './TopicCard'

export function TopicCardGrid() {
  const { data, loading, error } = useAsyncContent(() => getAllTopicSummaries(), [])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[160px] animate-pulse rounded-xl bg-slate-100"
          />
        ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
          <h2 className="text-xl font-semibold">加载失败</h2>
          <p className="mt-2 text-sm leading-6 text-rose-700">请稍后再试。</p>
        </div>
      </div>
    )
  }

  const summaries = data ?? []

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          知识点解析
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          选择一个技术领域进入知识点讲解，按知识点颗粒度学习，结合模拟题库巩固记忆。
        </p>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {summaries.map((s) => (
          <TopicCard
            key={s.topic}
            topic={s.topic}
            label={s.label}
            description={s.description}
            accent={s.accent}
            pointCount={s.pointCount}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **步骤 1：写两个新文件**
- [ ] **步骤 2：tsc --noEmit 验证**

如果有问题立刻修
- [ ] **步骤 3：Commit**
```bash
git add src/features/knowledge/components/TopicCard.tsx src/features/knowledge/components/TopicCardGrid.tsx
git commit -m "feat(ui): topic card grid home for knowledge module"
```

---

## 任务 7：UI 组件 2 - 列表项 + 搜索面板（KnowledgeListItem + KnowledgeListPanel）

**文件：**
- 新增：`src/features/knowledge/components/KnowledgeListItem.tsx`
- 新增：`src/features/knowledge/components/KnowledgeListPanel.tsx`

### 7.1 KnowledgeListItem.tsx：
```tsx
import type { Difficulty, KnowledgePointMeta, WeekTag } from '../../../types/content'

export interface KnowledgeListItemProps {
  meta: KnowledgePointMeta
  active: boolean
  highlight?: string
  onClick: () => void
}

function formatWeekTag(tag: WeekTag) {
  const m = /week-(\d+)/i.exec(tag)
  return m ? `Week ${m[1]}` : tag
}

const DIFF_CLASS: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: '简单', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { label: '中等', cls: 'bg-amber-50 text-amber-600' },
  hard: { label: '困难', cls: 'bg-rose-50 text-rose-600' },
}

function highlightText(text: string, kw: string) {
  if (!kw) return text
  const idx = text.toLowerCase().indexOf(kw.toLowerCase())
  if (idx < 0) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + kw.length)
  const after = text.slice(idx + kw.length)
  return (
    <>
      {before}
      <mark className="rounded bg-yellow-200/70 px-0.5 text-slate-900">{match}</mark>
      {after}
    </>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function KnowledgeListItem({ meta, active, highlight, onClick }: KnowledgeListItemProps) {
  const diff = DIFF_CLASS[meta.difficulty]
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'block w-full border-b border-slate-50 px-3 py-2.5 text-left transition last:border-none',
        active
          ? 'relative bg-blue-50 ring-1 ring-blue-200 border-l-2 border-blue-500'
          : 'hover:bg-slate-50',
      ].join(' ')}
    >
      <div className="text-sm font-medium text-slate-800">
        {highlightText(meta.title, highlight ?? '')}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
          {meta.category}
        </span>
        <span className={`rounded px-1.5 py-0.5 font-medium ${diff.cls}`}>
          {diff.label}
        </span>
        {meta.tags.map((t) => (
          <span
            key={t}
            className="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-600"
          >
            {formatWeekTag(t)}
          </span>
        ))}
        <span className="ml-auto text-slate-400">{formatDate(meta.createdAt)}</span>
      </div>
    </button>
  )
}
```

### 7.2 KnowledgeListPanel.tsx：
```tsx
import { useEffect, useMemo, useState } from 'react'

import type { KnowledgePointMeta } from '../../../types/content'
import { KnowledgeListItem } from './KnowledgeListItem'

export interface KnowledgeListPanelProps {
  items: KnowledgePointMeta[]
  topicLabel: string
  activeId: string | null
  emptyHint?: string
  onSelect: (id: string) => void
}

export function KnowledgeListPanel({
  items,
  topicLabel,
  activeId,
  emptyHint,
  onSelect,
}: KnowledgeListPanelProps) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200)
    return () => clearTimeout(t)
  }, [query])

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return items
    return items.filter((m) => {
      const hay = [m.title, m.category, m.summary, m.tags.join(' ')]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [items, debounced])

  return (
    <div className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {topicLabel} 知识点
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {items.length} 项
          </span>
        </div>
        <div className="relative w-72 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="搜索标题 / 类别 / 标签"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 shrink-0 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-slate-400">
            {items.length === 0
              ? emptyHint ?? '暂无知识点，敬请期待。'
              : '暂无匹配的知识点'}
          </div>
        ) : (
          filtered.map((m) => (
            <KnowledgeListItem
              key={m.id}
              meta={m}
              active={activeId === m.id}
              highlight={debounced}
              onClick={() => onSelect(m.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **步骤 1：写入两个组件**
- [ ] **步骤 2：tsc --noEmit**
- [ ] **步骤 3：Commit**
```bash
git add src/features/knowledge/components/KnowledgeListItem.tsx src/features/knowledge/components/KnowledgeListPanel.tsx
git commit -m "feat(ui): knowledge list panel with search"
```

---

## 任务 8：UI 组件 3 - 双栏布局 + 详情面板

**文件：**
- 新增：`src/features/knowledge/components/KnowledgeSplitLayout.tsx`
- 新增：`src/features/knowledge/components/KnowledgeDetailPanel.tsx`

### 8.1 KnowledgeSplitLayout.tsx：
```tsx
import type { ReactNode } from 'react'

export interface KnowledgeSplitLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function KnowledgeSplitLayout({ left, right }: KnowledgeSplitLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-6.5rem)] gap-4 px-4 py-3">
      {left}
      {right}
    </div>
  )
}
```

### 8.2 KnowledgeDetailPanel.tsx：
```tsx
import { Link } from 'react-router-dom'

import { ContentLoading } from '../../../components/ContentLoading'
import type {
  Difficulty,
  KnowledgePointMeta,
  TopicId,
  WeekTag,
} from '../../../types/content'
import { TOPIC_META } from '../../../types/content'

export interface KnowledgeDetailPanelProps {
  topic: TopicId
  meta: KnowledgePointMeta | null
  Component: React.ComponentType<Record<string, never>> | null
  loading: boolean
  error: unknown
}

function formatWeekTag(tag: WeekTag) {
  const m = /week-(\d+)/i.exec(tag)
  return m ? `Week ${m[1]}` : tag
}

const DIFF: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: '简单', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { label: '中等', cls: 'bg-amber-50 text-amber-600' },
  hard: { label: '困难', cls: 'bg-rose-50 text-rose-600' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function MetaRow({ meta }: { meta: KnowledgePointMeta }) {
  const diff = DIFF[meta.difficulty]
  const topicLabel = TOPIC_META[meta.topic].label
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
        {meta.category}
      </span>
      <span className={`rounded px-1.5 py-0.5 font-medium ${diff.cls}`}>
        {diff.label}
      </span>
      {meta.tags.map((t) => (
        <span
          key={t}
          className="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-600"
        >
          {formatWeekTag(t)}
        </span>
      ))}
      <span className="ml-auto text-slate-400">
        创建于 {formatDate(meta.createdAt)}
      </span>
    </div>
  )
}

export function KnowledgeDetailPanel({
  topic,
  meta,
  Component,
  loading,
  error,
}: KnowledgeDetailPanelProps) {
  const topicLabel = TOPIC_META[topic].label

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-2">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-4">
          <div className="h-7 w-64 animate-pulse rounded bg-slate-200" />
          <ContentLoading rows={12} className="mt-6" />
        </div>
      </div>
    )
  }

  if (error || !meta || !Component) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-2 flex items-center gap-2">
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            返回 知识点首页
          </Link>
          <span className="ml-auto text-xs text-slate-400">
            {topicLabel}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center px-5">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              {error ? '加载失败' : '还没有知识点'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {error ? '请稍后刷新再试。' : '该技术领域内容整理中，敬请期待。'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-white/90 px-5 py-2 backdrop-blur">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回 知识点首页
        </Link>
        <div className="ml-auto text-xs text-slate-500">
          <span className="text-slate-400">{topicLabel}</span>
          <span className="mx-1 text-slate-300">/</span>
          <span className="font-medium text-slate-700">{meta.category}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {meta.title}
          </h2>
          <div className="mt-2">
            <MetaRow meta={meta} />
          </div>
        </div>
        <article className="px-5 py-4">
          <div className="prose prose-slate max-w-none prose-sm sm:prose-base">
            <Component />
          </div>
        </article>
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <div className="text-sm text-indigo-800">
              想巩固这个知识点？去 {topicLabel} 模拟题库练习。
            </div>
            <Link
              to={`/practice/${topic}`}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              进入模拟题库
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **步骤 1：写两个组件**
- [ ] **步骤 2：tsc --noEmit**
- [ ] **步骤 3：Commit**
```bash
git add src/features/knowledge/components/KnowledgeSplitLayout.tsx src/features/knowledge/components/KnowledgeDetailPanel.tsx
git commit -m "feat(ui): split layout and knowledge detail panel"
```

---

## 任务 9：KnowledgePage.tsx 重写为三段 URL 分发器

**文件：**
- 修改：`src/features/knowledge/KnowledgePage.tsx:1-155`（完整重写）

全部替换为：

```tsx
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { TopicCardGrid } from './components/TopicCardGrid'
import { KnowledgeSplitLayout } from './components/KnowledgeSplitLayout'
import { KnowledgeListPanel } from './components/KnowledgeListPanel'
import { KnowledgeDetailPanel } from './components/KnowledgeDetailPanel'
import {
  getKnowledgePoint,
  getKnowledgePointList,
  isSupportedTopic,
} from '../../lib/content/knowledge'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { TOPIC_META, type TopicId } from '../../types/content'

function extractKnowledgeSegments(rest: string | undefined): string[] {
  if (!rest) return []
  return rest.split('/').filter(Boolean)
}

export function KnowledgePage() {
  const { '*': rest } = useParams()
  const navigate = useNavigate()
  const [topicStr, knowledgeId] = extractKnowledgeSegments(rest)
  const topic: TopicId | null =
    topicStr && isSupportedTopic(topicStr) ? topicStr : null

  // 左侧列表（该 topic 所有知识点元数据）
  const {
    data: list,
    loading: listLoading,
  } = useAsyncContent(
    () => (topic ? getKnowledgePointList(topic) : Promise.resolve(null)),
    [topic],
  )

  // 缺省知识点：列表就绪后，自动跳第一条
  useEffect(() => {
    if (!topic) return
    if (knowledgeId) return
    if (!list || list.length === 0) return
    navigate(`/knowledge/${topic}/${list[0].id}`, { replace: true })
  }, [topic, knowledgeId, list, navigate])

  // 当前详情：单个知识点正文
  const {
    data: detail,
    loading: detailLoading,
    error: detailError,
  } = useAsyncContent(
    () =>
      topic && knowledgeId
        ? getKnowledgePoint(topic, knowledgeId)
        : Promise.resolve(null),
    [topic, knowledgeId],
  )

  // 场景 1：无 topic → 卡片首页
  if (!topic) {
    return <TopicCardGrid />
  }

  // 场景 2：有 topic → 双栏
  const topicLabel = TOPIC_META[topic].label
  const listData = list ?? []
  const activeId = knowledgeId ?? null

  return (
    <KnowledgeSplitLayout
      left={
        listLoading ? (
          <div className="h-full w-96 shrink-0 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <KnowledgeListPanel
            items={listData}
            topicLabel={topicLabel}
            activeId={activeId}
            onSelect={(id) => navigate(`/knowledge/${topic}/${id}`)}
          />
        )
      }
      right={
        <KnowledgeDetailPanel
          topic={topic}
          meta={detail?.meta ?? null}
          Component={detail?.Component ?? null}
          loading={
            // 只有当有 knowledgeId 且还没加载完才 loading；没 id（等待重定向）算非加载
            Boolean(knowledgeId) && detailLoading
          }
          error={detailError}
        />
      }
    />
  )
}
```

- [ ] **步骤 1：覆盖写入 KnowledgePage.tsx**
- [ ] **步骤 2：tsc -b --noEmit 验证**（全局类型全通过
- [ ] **步骤 3：vitest 全部**
```bash
cd /Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs && npx vitest run
```
- [ ] **步骤 4：Commit**
```bash
git add src/features/knowledge/KnowledgePage.tsx
git commit -m "feat(ui): knowledge page dispatcher: card home | split view"
```

---

## 任务 10：全量质量验证

- [ ] **步骤 1：Lint**
```bash
cd /Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs && npx oxlint
```
预期：0 errors（warnings 原有的不动。

- [ ] **步骤 2：TypeScript**
```bash
npx tsc -b
```
预期 0 errors

- [ ] **步骤 3：Build**
```bash
npm run build
```
检查 dist/ 中 knowledge chunk 的按需分拆出来，chunk 检查（注意看是否各 MDX 单独打包

- [ ] **步骤 4：Test**
```bash
npm test
```
全部通过。

- [ ] **步骤 5：Dev 服务器 + 浏览器检查验收清单（规格 §6.1 的 8 条），开 dev server 验证
```bash
npm run dev
```
逐条验规格 §6.1 验收项逐条过一遍

- [ ] **步骤 6：如有任何问题修完 commit**

---

## 自检

1. 规格覆盖度：
   - §1 目标范围：任务 1-10 覆盖
   - §2 数据模型：任务 1、2
   - §3 路由加载：任务 3、4、5
   - §4 UI：任务 6、7、8、9
   - §5 Header：任务 5
   - §6 验收：任务 10
   → ✅

2. 占位符扫描：无任何「TODO / 适当的错误处理」等模糊占位
3. 类型一致性：TOPIC_META、KnowledgePointMeta id/difficulty/category/tags 贯穿任务 1 定义在后续任务统一引用一致。`TopicId` isSupportedTopic 一致。列表项与详情难度 pill 都是 `easy/medium/hard` 配同一套色值。
