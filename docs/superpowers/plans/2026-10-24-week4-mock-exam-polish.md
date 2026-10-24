# Week 4 Mock Exam Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Week 4 模拟试卷从 9 道拼接式大题重排为 6 道按课程主线组织的正式模拟卷。

**Architecture:** 只调整正式试卷文件 `content/exams/week-4.mock-exams.json` 的卷面结构，不新增 schema，不恢复旧入口。先在 `src/content/content-files.test.ts` 写失败测试，锁定“6 道大题 + 44 分 + 题序符合六条主线”，再最小重排试卷 JSON，最后跑内容与 mock exam 页面回归测试。

**Tech Stack:** JSON content files, Vitest, TypeScript content tests

---

### Task 1: 锁定六大题卷结构测试

**Files:**
- Modify: `src/content/content-files.test.ts`
- Test: `src/content/content-files.test.ts`

- [ ] **Step 1: 写一个失败测试，要求 Week 4 正式试卷收束为 6 道主线题**

```ts
it('stores week 4 exam as a six-section polished paper', () => {
  const week4Exam = readJson('content/exams/week-4.mock-exams.json')
  const exam = (week4Exam.exams as Array<{
    totalMarks: number
    questions: Array<{ title: string; marks: number }>
  }>)[0]

  expect(exam.totalMarks).toBe(44)
  expect(exam.questions).toHaveLength(6)
  expect(exam.questions.map((q) => q.title)).toEqual([
    'JSON 与 localStorage',
    'XMLHttpRequest 与 AJAX',
    'fetch 与 Response',
    'Promise 状态与编排',
    'async / await 与并行控制',
    'HTTP / Express 请求与响应',
  ])
  expect(exam.questions.reduce((sum, q) => sum + q.marks, 0)).toBe(44)
})
```

- [ ] **Step 2: 运行测试，确认它先失败**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: FAIL，因为当前 Week 4 还是 9 道大题，标题和数量都不匹配。

- [ ] **Step 3: 不放宽断言，进入最小实现**

```text
保持“6 道大题 + 44 分 + 固定题序”的要求不变。
```

### Task 2: 把正式 Week 4 试卷重排为六大题卷

**Files:**
- Modify: `content/exams/week-4.mock-exams.json`
- Test: `src/content/content-files.test.ts`

- [ ] **Step 1: 用现有题料重组为 6 道大题，不继续扩题量**

```text
目标题序：
1. JSON 与 localStorage
2. XMLHttpRequest 与 AJAX
3. fetch 与 Response
4. Promise 状态与编排
5. async / await 与并行控制
6. HTTP / Express 请求与响应
```

- [ ] **Step 2: 按 44 分重新分配每道大题 marks**

```text
分值分布：
Q1 8 分
Q2 8 分
Q3 6 分
Q4 6 分
Q5 8 分
Q6 8 分
```

- [ ] **Step 3: 合并重复表达，保留覆盖，不让六章退化**

```text
合并规则：
- 把 JSON 基础 + stringify/parse + localStorage 归到 Q1
- 把 AJAX 目的 + XHR 错误路径 + responseText 归到 Q2
- 把 fetch 异步顺序 + Response + res.ok 归到 Q3
- 把 callback hell + then 链 + Promise.all/allSettled 归到 Q4
- 把 async 重写 + try/catch + Promise.all 并行归到 Q5
- 把 HTTP 协议 + req.query/req.body + res.json 归到 Q6
```

- [ ] **Step 4: 运行内容测试，确认 6 道大题卷结构通过**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: PASS

### Task 3: 做最终回归验证

**Files:**
- Modify: `src/content/content-files.test.ts`
- Test: `src/content/content-files.test.ts`
- Test: `src/features/mock-exams/MockExamsPage.test.tsx`
- Test: `src/features/mock-exams/MockExamDetailPage.test.tsx`
- Test: `src/features/mock-exams/ExamPaper.test.tsx`

- [ ] **Step 1: 跑完整内容测试**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: PASS

- [ ] **Step 2: 跑 mock exam 页面测试，确认重排后的题目数据仍能被页面读取**

Run: `pnpm vitest run src/features/mock-exams/MockExamsPage.test.tsx src/features/mock-exams/MockExamDetailPage.test.tsx src/features/mock-exams/ExamPaper.test.tsx`
Expected: PASS

- [ ] **Step 3: 汇总结果时明确说明**

```text
需要汇报：
- Week 4 已从 9 道大题重排为 6 道主线题
- 总分仍为 44 分
- 六个主章节覆盖仍在
- 题库覆盖没有退化
```
