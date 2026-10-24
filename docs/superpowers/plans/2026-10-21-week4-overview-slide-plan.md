# Week 4 Overview Slide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `week-4/overview` 从 iframe 长网页导览改成 4 页纯 slide 导览，并为其补齐最小必要的渲染能力与回归测试。

**Architecture:** 先用测试锁定 `overview` 的课程数据形状，再为 SlideRenderer 增加 2 个专用于导览的轻量 slide 版式，最后把 Week 4 导览数据改写为 `cover -> roadmap -> cards -> closing` 四页结构。其他 lesson 保持不变。

**Tech Stack:** TypeScript、React 19、Next.js、Tailwind CSS、Vitest、Testing Library

---

### Task 1: 用测试锁定 Week 4 导览数据

**Files:**
- Create: `src/lib/content/courses.test.ts`
- Modify: `src/lib/content/courses.ts`

- [ ] **Step 1: 写失败测试，约束 overview 必须是 4 页纯 slide**

```ts
import { describe, expect, it } from 'vitest'

import { getCourseLesson } from './courses'

describe('course week 4 overview', () => {
  it('uses four pure slides without demo iframe slide', () => {
    const result = getCourseLesson('week-4', 'overview')

    expect(result).not.toBeNull()
    expect(result?.lesson.slides).toHaveLength(4)
    expect(result?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])
    expect(result?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(
      false,
    )
  })
})
```

- [ ] **Step 2: 运行测试，确认当前实现失败**

Run: `pnpm test src/lib/content/courses.test.ts`

Expected: 失败，因为当前 `overview` 仍是 `cover + demo`

- [ ] **Step 3: 后续实现完成后重跑这个测试**

Run: `pnpm test src/lib/content/courses.test.ts`

Expected: PASS

### Task 2: 为导览补齐纯 slide 渲染能力

**Files:**
- Create: `src/features/courses/components/slides/SlideRenderer.test.tsx`
- Modify: `src/types/course.ts`
- Modify: `src/features/courses/components/slides/SlideRenderer.tsx`

- [ ] **Step 1: 写失败测试，约束 roadmap 与 cards 版式能渲染内容且不产生 iframe**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SlideRenderer } from './SlideRenderer'

const accent = {
  gradient: 'from-emerald-500 to-green-600',
  text: 'text-emerald-700',
}

describe('SlideRenderer', () => {
  it('renders roadmap slides as pure content without iframe', () => {
    render(
      <SlideRenderer
        accent={accent}
        slide={{
          id: 'roadmap',
          kind: 'roadmap',
          title: 'Week 4 主线地图',
          roadmap: [
            { label: '01', title: 'JSON', description: '对象如何变成字符串' },
            { label: '02', title: 'XHR', description: '浏览器最早如何发请求' },
          ],
        }}
      />,
    )

    expect(screen.getByText('Week 4 主线地图')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()
    expect(screen.queryByTitle(/roadmap/i)).not.toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
  })
})
```

- [ ] **Step 2: 运行测试，确认当前实现失败**

Run: `pnpm test src/features/courses/components/slides/SlideRenderer.test.tsx`

Expected: 失败，因为 `roadmap` / `cards` 还不是合法 slide kind

- [ ] **Step 3: 扩展 course 类型与 SlideRenderer**

实现要点：

```ts
export type CourseSlideKind =
  | 'cover'
  | 'outline'
  | 'content'
  | 'demo'
  | 'code'
  | 'compare'
  | 'closing'
  | 'roadmap'
  | 'cards'
```

```ts
roadmap?: Array<{
  label: string
  title: string
  description: string
}>
cards?: Array<{
  eyebrow?: string
  title: string
  description: string
  meta?: string
}>
```

- [ ] **Step 4: 重跑渲染测试**

Run: `pnpm test src/features/courses/components/slides/SlideRenderer.test.tsx`

Expected: PASS

### Task 3: 改写 Week 4 overview 为 4 页纯 slide

**Files:**
- Modify: `src/lib/content/courses.ts`
- Test: `src/lib/content/courses.test.ts`
- Test: `src/features/courses/components/slides/SlideRenderer.test.tsx`

- [ ] **Step 1: 把 overview 的 slide 数据改成 4 页**

目标结构：

```ts
slides: [
  { id: 'cover', kind: 'cover', ... },
  { id: 'roadmap', kind: 'roadmap', ... },
  { id: 'cards', kind: 'cards', ... },
  { id: 'closing', kind: 'closing', ... },
]
```

- [ ] **Step 2: 跑定向测试**

Run: `pnpm test src/lib/content/courses.test.ts src/features/courses/components/slides/SlideRenderer.test.tsx`

Expected: PASS

- [ ] **Step 3: 跑完整测试与构建验证**

Run: `pnpm test && pnpm build`

Expected: 测试通过，生产构建成功
