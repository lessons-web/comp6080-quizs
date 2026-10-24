# Demos Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立独立的 `demos` 路由模块，并把 `Week 4 / JSON` 的两个实验从课程内嵌 iframe 迁到统一的实验入口与独立 demo 页面体系。

**Architecture:** 保持 `courses` 作为纯 slide 课件，新增并列的 `src/app/(app)/demos/[...slug]` 路由承载实验。课程数据中的 `demo` 从内嵌来源转为实验引用，课程页的 `demo slide` 改成 CTA 入口页；独立 `demos` 页面统一提供标题、观察目标、返回课程与实验承载区，第一阶段继续复用现有 `public/course-demos/week4/*.html` 内容。

**Tech Stack:** Next.js App Router、React 19、TypeScript、Tailwind CSS、Vitest、Testing Library

---

### Task 1: 先用测试锁定新行为

**Files:**
- Modify: `src/lib/content/courses.test.ts`
- Create: `src/lib/content/demos.test.ts`
- Create: `src/features/courses/components/slides/SlideRenderer.demo-entry.test.tsx`

- [ ] **Step 1: 写课程数据失败测试，约束 JSON lesson 的 demo slide 改为 route 引用而不是 iframe src**
- [ ] **Step 2: 写 demos 内容层失败测试，约束两个 demo route 都能解析到对应实验**
- [ ] **Step 3: 写渲染失败测试，约束 demo slide 渲染 CTA 按钮与观察目标，不再渲染 iframe**
- [ ] **Step 4: 运行定向测试，确认按预期失败**

### Task 2: 建立 demos 内容层与路由页骨架

**Files:**
- Create: `src/lib/content/demos.ts`
- Create: `src/types/demo.ts`
- Create: `src/app/(app)/demos/[...slug]/page.tsx`
- Create: `src/features/demos/DemoPage.tsx`
- Create: `src/features/demos/components/DemoFrame.tsx`

- [ ] **Step 1: 定义 demo 类型，包含 route、标题、week、lesson、objectives、sourceHtmlPath、backToCourseHref**
- [ ] **Step 2: 创建 `demos.ts`，先注册 `week-4/json/stringify-parse` 与 `week-4/json/localstorage`**
- [ ] **Step 3: 新增 `demos/[...slug]` 页面路由与解析逻辑**
- [ ] **Step 4: 实现统一的 DemoPage 骨架：返回课程、标题、副标题、观察目标、实验承载区**
- [ ] **Step 5: 在承载区内继续使用 iframe 打开 `public/course-demos/...`，但只出现在独立 demos 页面**
- [ ] **Step 6: 重跑 demos 定向测试，确认转绿**

### Task 3: 把课程里的 demo slide 改成实验入口页

**Files:**
- Modify: `src/types/course.ts`
- Modify: `src/lib/content/courses.ts`
- Modify: `src/features/courses/components/slides/SlideRenderer.tsx`
- Modify: `src/features/courses/components/SlideDeck.tsx`

- [ ] **Step 1: 扩展 `CourseSlideDemo`，支持 `route`、`ctaLabel`、`objectives`**
- [ ] **Step 2: 更新 `Week 4 / JSON` 的两个 demo slide 数据，改为 `/demos/...` 路由引用**
- [ ] **Step 3: 将 `DemoSlide` 从 iframe 渲染改为实验入口卡：标题说明、观察目标、打开实验按钮**
- [ ] **Step 4: 确保 slide 目录与顶部状态文案仍正常显示 demo 页**
- [ ] **Step 5: 重跑课程数据与 slide 渲染测试，确认通过**

### Task 4: 完整验证与收尾

**Files:**
- Test: `src/lib/content/courses.test.ts`
- Test: `src/lib/content/demos.test.ts`
- Test: `src/features/courses/components/slides/SlideRenderer.demo-entry.test.tsx`

- [ ] **Step 1: 运行 `pnpm exec tsc --noEmit`**
- [ ] **Step 2: 运行 `pnpm test`**
- [ ] **Step 3: 运行 `pnpm build`**
