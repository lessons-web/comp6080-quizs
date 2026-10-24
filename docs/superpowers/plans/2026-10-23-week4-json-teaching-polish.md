# Week 4 JSON Teaching Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `week-4/data-interchange` 调整成更像课堂讲解的 slide 节奏：概念页后接代码解释页和 live demo 页，并补上代码高亮与重点行强调。

**Architecture:** 复用现有 `content / compare / code / demo` slide，给内容卡片补“代码例子”能力，给代码面板补语法高亮和重点行高亮，再在课程数据中重新编排 `1.3 / 1.4 / 1.5` 的页序。演示页仍使用现有本地 HTML demo，但只出现在教学上最需要的两个位置。

**Tech Stack:** React 19、TypeScript、Tailwind CSS、Vitest、Testing Library、highlight.js

---

### Task 1: 先用测试锁定新的教学节奏

**Files:**
- Modify: `src/lib/content/courses.test.ts`
- Modify: `src/features/courses/components/slides/SlideRenderer.test.tsx`

- [ ] **Step 1: 写失败测试，约束 JSON lesson 要重新出现 demo 并按教学顺序插入**
- [ ] **Step 2: 写失败测试，约束 `content` 卡片支持最小代码例子**
- [ ] **Step 3: 写失败测试，约束代码面板支持重点行高亮**
- [ ] **Step 4: 运行定向测试，确认失败原因正确**

### Task 2: 扩展 slide 数据模型与渲染能力

**Files:**
- Modify: `src/types/course.ts`
- Modify: `src/features/courses/components/slides/SlideRenderer.tsx`

- [ ] **Step 1: 给 bullet 增加可选代码例子字段**
- [ ] **Step 2: 给 code 增加重点行高亮字段**
- [ ] **Step 3: 在 SlideRenderer 中接入 highlight.js**
- [ ] **Step 4: 让 `content` 卡片能渲染标题、说明和最小代码块**
- [ ] **Step 5: 让 `code / codes / compare` 复用统一代码面板并支持重点行背景**
- [ ] **Step 6: 重跑定向测试，确认转绿**

### Task 3: 重新编排 `data-interchange` 的 slide 顺序与内容

**Files:**
- Modify: `src/lib/content/courses.ts`

- [ ] **Step 1: 把 `1.3` 改成“限制页（每条附代码） + 陷阱页”**
- [ ] **Step 2: 把 `1.4` 改成“stringify / parse 对照页 + 高亮综合代码页 + live demo 页”**
- [ ] **Step 3: 把 `1.5` 改成“规则页 + 代码页 + live demo 页”**
- [ ] **Step 4: 调整 closing 文案，和新的教学顺序保持一致**

### Task 4: 做完整验证

**Files:**
- Test: `src/lib/content/courses.test.ts`
- Test: `src/features/courses/components/slides/SlideRenderer.test.tsx`

- [ ] **Step 1: 运行 `pnpm exec tsc --noEmit`**
- [ ] **Step 2: 运行 `pnpm test`**
- [ ] **Step 3: 运行 `pnpm build`**
