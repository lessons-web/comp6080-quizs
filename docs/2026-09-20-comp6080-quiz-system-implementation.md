# COMP6080 Quiz System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个基于 React + TailwindCSS 的 COMP6080 题库系统，满足三大模块（知识点解析、模拟题库、模拟真题）与 Week 1–4 骨架要求。

**Architecture:** 采用“内容与展示分离”方案：知识点内容用 MDX，题目与套卷用 JSON。前端使用模块化路由，统一通过 `AppShell` 提供 `Header + Main + Footer`。第一版以 Week 1 完整内容落地，Week 2–4 提供可扩展占位结构。

**Tech Stack:** React 18, TypeScript, Vite, TailwindCSS, React Router, @mdx-js/react, Vitest, Testing Library

---

### Task 1: 初始化项目与基础依赖

**Files:**
- Create: `/workspace/comp6080-quiz-hub/`（项目根目录）
- Create: `/workspace/comp6080-quiz-hub/package.json`
- Create: `/workspace/comp6080-quiz-hub/tailwind.config.ts`
- Create: `/workspace/comp6080-quiz-hub/postcss.config.js`
- Create: `/workspace/comp6080-quiz-hub/src/index.css`

- [ ] **Step 1: 初始化 Vite React + TS 项目**

Run:
```bash
npm create vite@latest comp6080-quiz-hub -- --template react-ts
```
Expected: 生成 React + TS 基础项目目录。

- [ ] **Step 2: 安装依赖**

Run:
```bash
cd /workspace/comp6080-quiz-hub
npm install react-router-dom @mdx-js/react @mdx-js/mdx
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npx tailwindcss init -p
```
Expected: 路由、MDX、Tailwind、测试依赖安装完成。

- [ ] **Step 3: 配置 Tailwind 和基础样式**

`/workspace/comp6080-quiz-hub/tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
```

`/workspace/comp6080-quiz-hub/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-50 text-slate-900 antialiased;
}
```
Expected: 全局为 Light 模式与科技蓝主题基调。

### Task 2: 建立目录与数据模型

**Files:**
- Create: `/workspace/comp6080-quiz-hub/src/types/content.ts`
- Create: `/workspace/comp6080-quiz-hub/content/knowledge/week-1.mdx`
- Create: `/workspace/comp6080-quiz-hub/content/knowledge/week-2.mdx`
- Create: `/workspace/comp6080-quiz-hub/content/knowledge/week-3.mdx`
- Create: `/workspace/comp6080-quiz-hub/content/knowledge/week-4.mdx`
- Create: `/workspace/comp6080-quiz-hub/content/questions/week-1.practice.json`
- Create: `/workspace/comp6080-quiz-hub/content/questions/week-2.practice.json`
- Create: `/workspace/comp6080-quiz-hub/content/questions/week-3.practice.json`
- Create: `/workspace/comp6080-quiz-hub/content/questions/week-4.practice.json`
- Create: `/workspace/comp6080-quiz-hub/content/exams/week-1.mock-exams.json`
- Create: `/workspace/comp6080-quiz-hub/content/exams/week-2.mock-exams.json`
- Create: `/workspace/comp6080-quiz-hub/content/exams/week-3.mock-exams.json`
- Create: `/workspace/comp6080-quiz-hub/content/exams/week-4.mock-exams.json`

- [ ] **Step 1: 定义统一类型（含 images 字段）**

`/workspace/comp6080-quiz-hub/src/types/content.ts`:
```ts
export type QuestionImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type QuestionCodeBlock = {
  language: string;
  code: string;
};

export type PracticeQuestion = {
  id: string;
  week: number;
  module: "practice";
  category: "HTML" | "CSS" | string;
  questionNo: number;
  question: string;
  codeBlocks?: QuestionCodeBlock[];
  images?: QuestionImage[];
  knowledgePoint: string;
  answerExplanation: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
};

export type MockExamQuestion = {
  id: string;
  questionNo: number;
  question: string;
  knowledgePoint: string;
  answerExplanation: string;
  codeBlocks?: QuestionCodeBlock[];
  images?: QuestionImage[];
};
```
Expected: 题目对象具备可扩展 `images` 能力。

- [ ] **Step 2: 填充 Week 1 样板内容，Week 2–4 先占位**

Run:
```bash
mkdir -p /workspace/comp6080-quiz-hub/content/{knowledge,questions,exams}
```

`week-1.practice.json` 与 `week-1.mock-exams.json` 使用已确认题库内容；Week 2–4 暂放空数组结构：
```json
{
  "week": 2,
  "questions": []
}
```
Expected: 内容目录结构与 spec 一致，后续可直接扩充。

### Task 3: 搭建全局布局与路由

**Files:**
- Create: `/workspace/comp6080-quiz-hub/src/app/AppShell.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/components/Header.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/components/Footer.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/components/WeekTabs.tsx`
- Modify: `/workspace/comp6080-quiz-hub/src/main.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/app/router.tsx`

- [ ] **Step 1: 写布局组件**

`/workspace/comp6080-quiz-hub/src/app/AppShell.tsx`:
```tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
```
Expected: 固定 `Header + Main + Footer` 结构。

- [ ] **Step 2: 配置三大模块路由**

`/workspace/comp6080-quiz-hub/src/app/router.tsx` 定义：
```tsx
<Route path="/knowledge/week-:week" element={<KnowledgePage />} />
<Route path="/practice/week-:week" element={<PracticePage />} />
<Route path="/mock-exams/week-:week" element={<MockExamsPage />} />
```
Expected: 模块导航与周路由可直接访问。

### Task 4: 实现知识点解析模块（MDX）

**Files:**
- Create: `/workspace/comp6080-quiz-hub/src/features/knowledge/KnowledgePage.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/features/knowledge/KnowledgeSection.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/lib/content/knowledge.ts`

- [ ] **Step 1: 实现 Week 内容加载逻辑**

`/workspace/comp6080-quiz-hub/src/lib/content/knowledge.ts`:
```ts
export async function getKnowledgeByWeek(week: number) {
  switch (week) {
    case 1:
      return import("../../../content/knowledge/week-1.mdx");
    case 2:
      return import("../../../content/knowledge/week-2.mdx");
    case 3:
      return import("../../../content/knowledge/week-3.mdx");
    case 4:
      return import("../../../content/knowledge/week-4.mdx");
    default:
      throw new Error("Unsupported week");
  }
}
```
Expected: 模块内可切换 Week 1–4。

- [ ] **Step 2: 落地“混合型知识点页面”**

在 `KnowledgePage` 中分区展示：
- 核心讲解
- 易错点
- 例子
- 关联题入口

Expected: 与 spec 的知识点页面形态一致。

### Task 5: 实现模拟题库模块（一题一卡片）

**Files:**
- Create: `/workspace/comp6080-quiz-hub/src/features/practice/PracticePage.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/features/practice/QuestionCard.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/lib/content/practice.ts`

- [ ] **Step 1: 实现题库读取与分类展示**

`/workspace/comp6080-quiz-hub/src/lib/content/practice.ts` 按周读取 JSON，并按 `category` 分组。

Expected: 页面可按 HTML/CSS 分类浏览。

- [ ] **Step 2: 实现“先做题后展开答案”交互**

`QuestionCard` 默认只显示题目，点击展开后显示：
- 知识点
- 答案解析
- codeBlocks
- images

关键结构：
```tsx
{open && (
  <div>
    <p>知识点：{question.knowledgePoint}</p>
    <p>答案解析：{question.answerExplanation}</p>
  </div>
)}
```
Expected: 完全符合已确认交互方式。

### Task 6: 实现模拟真题模块（整卷题目 + 答案）

**Files:**
- Create: `/workspace/comp6080-quiz-hub/src/features/mock-exams/MockExamsPage.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/features/mock-exams/ExamPaper.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/lib/content/mockExams.ts`

- [ ] **Step 1: 读取并渲染套卷列表**

Expected: Week 1 至少展示两套真题，Week 2–4 可显示空状态。

- [ ] **Step 2: 按“上题下答”渲染整套卷**

`ExamPaper` 页面结构：
- 上半：题目 `Q1~Q10`
- 下半：答案 `Q1~Q10`

Expected: 与当前教学使用习惯一致。

### Task 7: 样式细化与可用性收尾

**Files:**
- Modify: `/workspace/comp6080-quiz-hub/src/components/*.tsx`
- Modify: `/workspace/comp6080-quiz-hub/src/features/**/*.tsx`

- [ ] **Step 1: 统一 Light + 科技蓝样式**

检查并统一：
- 导航高亮色
- 卡片边框与阴影
- 标题层级与间距
- 空状态样式

Expected: 页面视觉统一、现代、清晰。

- [ ] **Step 2: 添加基础可访问性属性**

示例：
```tsx
<button aria-expanded={open} aria-controls={`answer-${question.id}`} />
```
Expected: 基础键盘/读屏可用性达标。

### Task 8: 测试与验收验证

**Files:**
- Create: `/workspace/comp6080-quiz-hub/src/features/practice/QuestionCard.test.tsx`
- Create: `/workspace/comp6080-quiz-hub/src/features/mock-exams/MockExamsPage.test.tsx`
- Modify: `/workspace/comp6080-quiz-hub/package.json`

- [ ] **Step 1: 写最小可用测试**

测试点：
- QuestionCard 默认不显示答案，点击后显示知识点与答案解析
- MockExamsPage 能渲染套卷标题和题目列表

Expected: 核心交互行为可自动验证。

- [ ] **Step 2: 执行完整验证命令**

Run:
```bash
cd /workspace/comp6080-quiz-hub
npm run test
npm run build
```
Expected:
- `test` 全通过
- `build` 成功

- [ ] **Step 3: 本地运行并人工验收**

Run:
```bash
npm run dev
```
人工检查：
- Header/Main/Footer 是否符合要求
- 三模块与 Week 1–4 切换是否正常
- Week 1 内容是否完整可读
- 题目卡片展开逻辑是否正确
- 套卷是否为“上题下答”布局

Expected: 与 spec 验收标准逐条对齐。

