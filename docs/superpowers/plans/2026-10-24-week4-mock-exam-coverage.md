# Week 4 Mock Exam Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补齐 Week 4 模拟试卷的 6 个主章节覆盖，并把新增知识点同步写入 Week 4 题库。

**Architecture:** 以正式数据文件 `content/exams/week-4.mock-exams.json` 作为唯一 Week 4 模拟试卷入口，把旧版 `week4-sim` 从加载注册表移除以避免重复。试卷侧新增 6 个按章节命名的大题，题库侧新增对应 practice questions，再用内容测试验证试卷与题库同时覆盖 JSON、XHR、fetch、Promise、async/await、HTTP/Express。

**Tech Stack:** JSON content files, TypeScript content loaders, Vitest

---

### Task 1: 先锁定 Week 4 覆盖面测试

**Files:**
- Modify: `src/content/content-files.test.ts`
- Test: `src/content/content-files.test.ts`

- [ ] **Step 1: 写一个失败测试，要求正式 Week 4 试卷和题库同时覆盖 6 个主章节**

```ts
it('stores week 4 exam and practice coverage for all six core sections', () => {
  const week4Exam = readJson('content/exams/week-4.mock-exams.json')
  const week4Practice = readJson('content/questions/week-4.practice.json')

  const examText = JSON.stringify(week4Exam)
  const practiceText = JSON.stringify(week4Practice)

  expect(week4Exam.exams).toBeInstanceOf(Array)
  expect((week4Exam.exams as unknown[]).length).toBeGreaterThan(0)

  for (const keyword of ['JSON', 'XHR', 'fetch', 'Promise', 'async', 'Express']) {
    expect(examText).toContain(keyword)
    expect(practiceText).toContain(keyword)
  }
})
```

- [ ] **Step 2: 运行测试，确认它先失败**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: FAIL，因为 `content/exams/week-4.mock-exams.json` 还是空的，至少会在 `length > 0` 或关键词覆盖断言上失败。

- [ ] **Step 3: 保持测试不动，进入最小实现**

```text
不要修改断言标准，后续实现必须真正补齐正式 Week 4 试卷和题库覆盖。
```

- [ ] **Step 4: 重新运行同一条测试，确认内容实现后能通过**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: PASS

### Task 2: 把 Week 4 正式试卷补成 6 章全覆盖

**Files:**
- Modify: `content/exams/week-4.mock-exams.json`
- Modify: `src/lib/content/mockExams.ts`
- Test: `src/content/content-files.test.ts`

- [ ] **Step 1: 在正式 Week 4 试卷文件里新增 1 套完整试卷**

```json
{
  "topic": "javascript",
  "exams": [
    {
      "id": "WEEK4-SIM",
      "title": "Week 4 模拟试卷",
      "description": "Week 4 知识点模拟试卷：覆盖 JSON、XHR、fetch、Promise、async/await 与 HTTP/Express 六条主线。",
      "tags": ["模拟题", "Week4"],
      "totalMarks": 44,
      "questions": []
    }
  ]
}
```

- [ ] **Step 2: 追加 6 个按章节命名的大题，确保题目文本显式出现章节关键词**

```text
新增大题标题应至少包含：
1. JSON 与本地持久化
2. XMLHttpRequest 与错误路径
3. Fetch Response 与状态判断
4. Promise 状态与链式编排
5. async / await 与并行控制
6. HTTP / Express 请求与响应
```

- [ ] **Step 3: 把旧版 `week4-sim` 从加载注册表里移除，避免列表页出现两份 Week 4**

```ts
// src/lib/content/mockExams.ts
// 删除这段 loader
// 'week4-sim': () =>
//   import('@/content/exams/week4-sim.json').then(
//     (m) => m.default as unknown as MockExamCollection,
//   ),
```

- [ ] **Step 4: 运行覆盖测试，确认正式 Week 4 试卷已生效**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: PASS

### Task 3: 把新增试卷知识点同步进 Week 4 题库

**Files:**
- Modify: `content/questions/week-4.practice.json`
- Test: `src/content/content-files.test.ts`

- [ ] **Step 1: 在 Week 4 practice question bank 里新增与 6 个新增章节题对应的练习题**

```text
新增练习题应包含这些知识点名称或关键词：
- JSON.stringify / JSON.parse / localStorage
- XHR onload / onerror / status / responseText
- fetch / Response / res.ok / res.json
- Promise pending / fulfilled / rejected / then / catch
- async function / await / Promise.all
- HTTP / Express / req.query / req.body / res.json
```

- [ ] **Step 2: 为新增 practice questions 保持现有 schema**

```json
{
  "id": "JS-Q11",
  "topic": "javascript",
  "weeks": ["week-4"],
  "difficulty": "medium",
  "tags": ["fetch", "Response"],
  "question": "示例题目",
  "knowledgePoint": "fetch Response 与状态判断",
  "answerExplanation": "示例答案",
  "codeBlocks": [],
  "images": [],
  "createdAt": "2026-10-24"
}
```

- [ ] **Step 3: 重新运行内容测试，确认题库与试卷都满足 6 章覆盖**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: PASS

### Task 4: 跑最终回归验证

**Files:**
- Modify: `src/content/content-files.test.ts`
- Test: `src/content/content-files.test.ts`

- [ ] **Step 1: 运行完整的内容测试**

Run: `pnpm vitest run src/content/content-files.test.ts`
Expected: PASS with all content file tests green.

- [ ] **Step 2: 运行 mock exam 相关页面测试，确认内容读取未被破坏**

Run: `pnpm vitest run src/features/mock-exams/MockExamsPage.test.tsx src/features/mock-exams/MockExamDetailPage.test.tsx src/features/mock-exams/ExamPaper.test.tsx`
Expected: PASS

- [ ] **Step 3: 如果上面两组测试都通过，再汇总结果**

```text
汇报内容需要明确说明：
- 正式 Week 4 试卷已不再为空
- 旧版 week4-sim 不再作为可见入口被加载
- 新增试卷题已经同步增加到 Week 4 题库
```
