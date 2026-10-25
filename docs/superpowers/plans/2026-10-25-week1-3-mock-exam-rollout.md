# Week 1-3 Mock Exam 统一优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Week 1、Week 2、Week 3 的模拟试卷补齐为与 Week 4 同一体系的“按章节对齐大题卷”，并把新增试卷题同步写入对应题库，同时移除旧版重复入口。

**Architecture:** 每周以 `content/exams/week-N.mock-exams.json` 作为唯一正式入口。Week 1 保留真题 `2026T3-QUIZ1` 并新增 `WEEK1-SIM`；Week 2、Week 3 各新增一套章节对齐模拟卷。旧版 `week1-sim / week2-sim / week3-sim` 仅从 `src/lib/content/mockExams.ts` 加载注册表移除，JSON 文件保留在磁盘。题库侧在 `content/questions/week-N.practice.json` 同步新增对应练习题。

**Tech Stack:** JSON content files, TypeScript content loaders, Vitest

---

## 已确认的前置决策

1. **Week 1 真题保留**：`week-1.mock-exams.json` 同时容纳真题 `2026T3-QUIZ1` 与新增 `WEEK1-SIM`。
2. **旧版试卷仅摘除入口**：从 loader 移除 `week1-sim / week2-sim / week3-sim`，不删除 JSON。
3. **章节对齐粒度**：每节课一个大题。Week 1 = 5 大题，Week 2 = 6 大题，Week 3 = 7 大题。

---

## 章节映射表

### WEEK1-SIM（5 大题）

| 大题 | 标题 | 对应 lesson |
| --- | --- | --- |
| Q1 | Git 最小工作流 | `course-overview-git` |
| Q2 | HTML 文档结构 | `structure` |
| Q3 | 语义化标签与标题层级 | `semantics` |
| Q4 | 链接、图片与路径 | `links-images` |
| Q5 | 列表、表格与预格式化文本 | `lists-tables` |

### WEEK2-SIM（6 大题）

| 大题 | 标题 | 对应 lesson |
| --- | --- | --- |
| Q1 | 选择器与层叠优先级 | `selectors-cascade` |
| Q2 | 盒模型与单位 | `box-model` |
| Q3 | Flexbox 布局 | `flexbox` |
| Q4 | CSS Grid、框架与样式复用 | `grid-frameworks` |
| Q5 | 定位、z-index 与视觉层级 | `positioning-stacking` |
| Q6 | 响应式、媒体查询与开发者工具 | `responsive-viewport` |

### WEEK3-SIM（7 大题）

| 大题 | 标题 | 对应 lesson |
| --- | --- | --- |
| Q1 | JavaScript 语言特性与语法 | `js-intro-syntax` |
| Q2 | 高级函数与闭包 | `functions-closures` |
| Q3 | JavaScript 生态、Node 与 npm | `ecosystem-npm` |
| Q4 | DOM 查询与操作 | `dom` |
| Q5 | 事件与事件委托 | `events` |
| Q6 | 表单与客户端校验 | `forms` |
| Q7 | localStorage 与持久化 | `storage` |

---

### Task 1: 先锁定 Week 1-3 试卷结构与覆盖测试

**Files:**
- Modify: `src/content/content-files.test.ts`

- [x] **Step 1: 写失败测试**

在 `describe('content files')` 内新增：

```ts
it('stores week 1 real paper plus a chapter-aligned sim', () => {
  const exams = readJson('content/exams/week-1.mock-exams.json')
  const list = exams.exams as Array<{
    id: string
    totalMarks: number
    questions: Array<{ title: string; marks: number }>
  }>

  expect(list).toHaveLength(2)
  expect(list.some((exam) => exam.id === '2026T3-QUIZ1')).toBe(true)

  const sim = list.find((exam) => exam.id === 'WEEK1-SIM')
  expect(sim).toBeTruthy()
  expect(sim!.questions.map((question) => question.title)).toEqual([
    'Git 最小工作流',
    'HTML 文档结构',
    '语义化标签与标题层级',
    '链接、图片与路径',
    '列表、表格与预格式化文本',
  ])
  expect(
    sim!.questions.reduce((sum, question) => sum + question.marks, 0),
  ).toBe(sim!.totalMarks)
})

it('stores a week 2 six-chapter sim', () => {
  const exams = readJson('content/exams/week-2.mock-exams.json')
  const list = exams.exams as Array<{
    id: string
    totalMarks: number
    questions: Array<{ title: string; marks: number }>
  }>

  expect(list).toHaveLength(1)
  const sim = list[0]
  expect(sim.id).toBe('WEEK2-SIM')
  expect(sim.questions.map((question) => question.title)).toEqual([
    '选择器与层叠优先级',
    '盒模型与单位',
    'Flexbox 布局',
    'CSS Grid、框架与样式复用',
    '定位、z-index 与视觉层级',
    '响应式、媒体查询与开发者工具',
  ])
  expect(
    sim.questions.reduce((sum, question) => sum + question.marks, 0),
  ).toBe(sim.totalMarks)
})

it('stores a week 3 seven-chapter sim', () => {
  const exams = readJson('content/exams/week-3.mock-exams.json')
  const list = exams.exams as Array<{
    id: string
    totalMarks: number
    questions: Array<{ title: string; marks: number }>
  }>

  expect(list).toHaveLength(1)
  const sim = list[0]
  expect(sim.id).toBe('WEEK3-SIM')
  expect(sim.questions.map((question) => question.title)).toEqual([
    'JavaScript 语言特性与语法',
    '高级函数与闭包',
    'JavaScript 生态、Node 与 npm',
    'DOM 查询与操作',
    '事件与事件委托',
    '表单与客户端校验',
    'localStorage 与持久化',
  ])
  expect(
    sim.questions.reduce((sum, question) => sum + question.marks, 0),
  ).toBe(sim.totalMarks)
})

it('keeps week 1-3 practice banks in sync with the sim chapters', () => {
  const week2 = JSON.stringify(readJson('content/questions/week-2.practice.json'))
  const week3 = JSON.stringify(readJson('content/questions/week-3.practice.json'))
  const week1 = JSON.stringify(readJson('content/questions/week-1.practice.json'))

  for (const keyword of ['选择器', '盒模型', 'Flexbox', 'Grid', 'z-index', '响应式']) {
    expect(week2).toContain(keyword)
  }
  for (const keyword of ['闭包', 'npm', 'DOM', '事件委托', '表单', 'localStorage']) {
    expect(week3).toContain(keyword)
  }
  expect(week1).toContain('Git')
})
```

- [x] **Step 2: 运行测试，确认先失败**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: FAIL（Week 2/3 试卷为空、Week 1 无 WEEK1-SIM）

### Task 2: 补 Week 1 模拟试卷

**Files:**
- Modify: `content/exams/week-1.mock-exams.json`

- [x] **Step 1: 在 `exams` 数组中追加 `WEEK1-SIM` 一套，5 大题 + 子题，含 `contentMdx` / `questionMdx` / `answerMdx` / `markingMdx`**

### Task 3: 补 Week 2 模拟试卷

**Files:**
- Modify: `content/exams/week-2.mock-exams.json`

- [x] **Step 1: 写入 `WEEK2-SIM` 一套，6 大题，`topic` 设为 `css`**

### Task 4: 补 Week 3 模拟试卷

**Files:**
- Modify: `content/exams/week-3.mock-exams.json`

- [x] **Step 1: 写入 `WEEK3-SIM` 一套，7 大题，`topic` 设为 `javascript`**

### Task 5: 移除旧版重复加载入口

**Files:**
- Modify: `src/lib/content/mockExams.ts`

- [x] **Step 1: 删除 `week1-sim`、`week2-sim`、`week3-sim` 三个 loader，保留 JSON 文件**

### Task 6: 同步题库

**Files:**
- Modify: `content/questions/week-1.practice.json`（补 Git 相关题）
- Modify: `content/questions/week-2.practice.json`（补 6 章题目）
- Modify: `content/questions/week-3.practice.json`（补 7 章题目）

- [x] **Step 1: 按现有 schema 追加 practice questions**

### Task 7: 回归验证

- [x] **Step 1:** `pnpm vitest run src/content/content-files.test.ts` → PASS
- [x] **Step 2:** `pnpm vitest run src/features/mock-exams` → PASS
- [x] **Step 3:** `pnpm vitest run src/lib/content` → PASS
