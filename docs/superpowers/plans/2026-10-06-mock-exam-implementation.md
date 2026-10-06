# 模拟真题 (Mock Exam) 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将纯文本 Markdown 格式的 2026T3-QUIZ1 真题解析为结构化 JSON 数据，并在页面中以单页沉浸流卡片和内联折叠答案的形式展示。

**架构：**
1. **数据层**：更新 `src/types/content.ts` 以定义真题的多层嵌套结构（`ExamPaper` > `ExamQuestion` > `ExamSubQuestion`）。
2. **解析层**：编写一个 Node.js 脚本 `scripts/parse-exam.ts`，读取 `quizs/2026T3-QUIZ1.md`，使用正则提取题干、子题、答案和评分标准，输出到 `content/exams/week-1.mock-exams.json`（作为题库第一套试卷）。
3. **视图层**：新增 `ExamQuestionCard` 和 `ExamSubQuestionList` 组件，使用 `ReactMarkdown` 渲染内容，并替换 `ExamPaper.tsx` 和 `MockExamsPage.tsx` 中的旧渲染逻辑。

**技术栈：** React, TypeScript, Tailwind CSS, ReactMarkdown, Node.js (fs/regex)

---

### 任务 1：更新类型定义与清理旧数据

**文件：**
- 修改：`src/types/content.ts`
- 修改：`content/exams/week-2.mock-exams.json`
- 修改：`content/exams/week-3.mock-exams.json`
- 修改：`content/exams/week-4.mock-exams.json`

- [ ] **步骤 1：在 `content.ts` 中替换 MockExam 相关类型**

将 `src/types/content.ts` 底部的 `MockExamQuestion`, `MockExam` 替换为新的多层嵌套类型。

```typescript
export interface ExamSubQuestion {
  id: string
  label: string
  marks: number
  questionMdx: string
  answerMdx: string
  markingMdx?: string
}

export interface ExamQuestion {
  id: string
  title: string
  marks: number
  contentMdx: string
  subQuestions: ExamSubQuestion[]
}

export interface ExamPaper {
  id: string
  title: string
  description?: string
  totalMarks: number
  questions: ExamQuestion[]
}

export interface MockExamCollection {
  topic: TopicId
  exams: ExamPaper[]
}
```

- [ ] **步骤 2：清理其他 mock-exams.json 避免类型报错**

将 `content/exams/week-2.mock-exams.json`、`week-3.mock-exams.json`、`week-4.mock-exams.json` 的内容重置为空的集合，防止类型不匹配导致 TS 报错。例如，修改 `week-2.mock-exams.json` 为：

```json
{
  "week": "week-2",
  "exams": []
}
```
*(对 week-3 和 week-4 做同样操作)*

- [ ] **步骤 3：Commit**

```bash
git add src/types/content.ts content/exams/week-*.mock-exams.json
git commit -m "refactor: update mock exam types for nested sub-questions"
```

---

### 任务 2：实现真题解析脚本

**文件：**
- 创建：`scripts/parse-exam.ts`
- 生成：`content/exams/week-1.mock-exams.json`

- [ ] **步骤 1：编写解析脚本**

在 `scripts/parse-exam.ts` 中编写脚本，通过正则和字符串操作提取 Markdown。

```typescript
import * as fs from 'fs'
import * as path from 'path'

const inputPath = path.join(process.cwd(), 'quizs/2026T3-QUIZ1.md')
const outputPath = path.join(process.cwd(), 'content/exams/week-1.mock-exams.json')

const content = fs.readFileSync(inputPath, 'utf-8')

// Split by '---' or '### Q.' to get main questions
const blocks = content.split(/\n---\n+/).filter(Boolean)

const questions = []
let qIndex = 1

for (const block of blocks) {
  if (!block.trim()) continue
  
  // Extract main question title and marks
  const mainMatch = block.match(/### Q\. (.*?)\s+\((\d+) marks\)/)
  if (!mainMatch) continue
  
  const title = mainMatch[1]
  const marks = parseInt(mainMatch[2], 10)
  
  // Extract content before the first sub-question
  const contentMdx = block
    .replace(/### Q\..*/, '')
    .split(/\*\*\(.\)\*\*/)[0]
    .trim()
    
  // Extract sub-questions
  const subQuestions = []
  const subBlocks = block.split(/\*\*\(([a-z])\)\*\*/).slice(1)
  
  for (let i = 0; i < subBlocks.length; i += 2) {
    const label = `(${subBlocks[i]})`
    const subContent = subBlocks[i + 1]
    
    // Extract marks
    const marksMatch = subContent.match(/\[(\d+) marks\]/)
    const subMarks = marksMatch ? parseInt(marksMatch[1], 10) : 0
    
    // Extract questionMdx
    const questionMdx = subContent
      .replace(/\[\d+ marks\]/, '')
      .split('**Model answer:**')[0]
      .trim()
      
    // Extract answer and marking
    const answerSection = subContent.split('**Model answer:**')[1] || ''
    
    // The answer is in the first code block, marking in the second
    const codeBlocks = answerSection.match(/```[\s\S]*?```/g) || []
    
    const answerMdx = codeBlocks[0] ? codeBlocks[0].replace(/```/g, '').trim() : ''
    const markingMdx = codeBlocks[1] ? codeBlocks[1].replace(/```/g, '').trim() : ''
    
    subQuestions.push({
      id: `Q${qIndex}-${subBlocks[i]}`,
      label,
      marks: subMarks,
      questionMdx,
      answerMdx,
      markingMdx
    })
  }
  
  questions.push({
    id: `Q${qIndex}`,
    title,
    marks,
    contentMdx,
    subQuestions
  })
  
  qIndex++
}

const paper = {
  id: "2026T3-QUIZ1",
  title: "2026 Term 3 Quiz 1",
  description: "Comprehensive mock exam covering HTML, CSS, and JS.",
  totalMarks: questions.reduce((acc, q) => acc + q.marks, 0),
  questions
}

const collection = {
  topic: "html",
  exams: [paper]
}

fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2))
console.log('Successfully parsed exam to', outputPath)
```

- [ ] **步骤 2：运行脚本生成 JSON**

运行：`npx tsx scripts/parse-exam.ts` 或 `npx ts-node scripts/parse-exam.ts`
验证 `content/exams/week-1.mock-exams.json` 已正确生成，并包含 `questions` 和 `subQuestions`。

- [ ] **步骤 3：Commit**

```bash
git add scripts/parse-exam.ts content/exams/week-1.mock-exams.json
git commit -m "feat: parse 2026T3-QUIZ1 to JSON data"
```

---

### 任务 3：实现子题与答案折叠组件

**文件：**
- 创建：`src/features/mock-exams/ExamSubQuestionList.tsx`

- [x] **步骤 1：实现组件**

```tsx
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamSubQuestion } from '../../types/content'

function SubQuestionItem({ sub }: { sub: ExamSubQuestion }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-slate-100 py-4">
      <div className="flex gap-3">
        <span className="font-semibold text-slate-700 shrink-0">{sub.label}</span>
        <div className="flex-1">
          <div className="prose prose-sm prose-slate max-w-none mb-3">
            <span className="text-slate-500 font-medium mr-2">[{sub.marks} marks]</span>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sub.questionMdx}</ReactMarkdown>
          </div>
          
          <button
            onClick={() => setOpen(!open)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            {open ? '收起答案与解析' : '查看答案与解析'}
            <span className="text-[10px]">{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <div className="mt-4 p-4 bg-slate-50 border-l-4 border-blue-500 rounded-r-lg space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Model Answer</h4>
                <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                  {sub.answerMdx}
                </div>
              </div>
              {sub.markingMdx && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Marking Criteria</h4>
                  <div className="prose prose-sm prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                    {sub.markingMdx}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ExamSubQuestionList({ subQuestions }: { subQuestions: ExamSubQuestion[] }) {
  if (!subQuestions || subQuestions.length === 0) return null
  
  return (
    <div className="mt-4 flex flex-col">
      {subQuestions.map((sub) => (
        <SubQuestionItem key={sub.id} sub={sub} />
      ))}
    </div>
  )
}
```

- [x] **步骤 2：Commit**

```bash
git add src/features/mock-exams/ExamSubQuestionList.tsx
git commit -m "feat: add ExamSubQuestionList with inline accordion"
```

---

### 任务 4：实现主考题卡片与更新试卷视图

**文件：**
- 创建：`src/features/mock-exams/ExamQuestionCard.tsx`
- 修改：`src/features/mock-exams/ExamPaper.tsx`

- [x] **步骤 1：实现 ExamQuestionCard**

```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ExamQuestion } from '../../types/content'
import { ExamSubQuestionList } from './ExamSubQuestionList'

export function ExamQuestionCard({ question }: { question: ExamQuestion }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-semibold text-slate-950">
            {question.title}
          </h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {question.marks} marks
          </span>
        </div>

        {question.contentMdx && (
          <div className="prose prose-sm prose-slate max-w-none bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {question.contentMdx}
            </ReactMarkdown>
          </div>
        )}

        <ExamSubQuestionList subQuestions={question.subQuestions} />
      </div>
    </article>
  )
}
```

- [x] **步骤 2：更新 ExamPaper.tsx**

替换旧的 `ExamPaper.tsx` 实现，以适配新的类型。

```tsx
import type { ExamPaper as ExamPaperType } from '../../types/content'
import { ExamQuestionCard } from './ExamQuestionCard'

type ExamPaperProps = {
  exam: ExamPaperType
}

export function ExamPaper({ exam }: ExamPaperProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
        <div>
          <h3 className="text-2xl font-bold">{exam.title}</h3>
          {exam.description && (
            <p className="mt-1 text-sm text-slate-400">{exam.description}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400 uppercase tracking-wider">Total</div>
          <div className="text-2xl font-bold text-blue-400">{exam.totalMarks} marks</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {exam.questions.map((question) => (
          <ExamQuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  )
}
```

- [x] **步骤 3：验证类型无误**

运行 `npx tsc --noEmit` 检查 `MockExamsPage.tsx` 是否存在因为 `ExamPaper` 类型变更而引起的报错（理论上直接遍历 `collection.exams` 并传递给 `ExamPaper` 不会报错）。

- [x] **步骤 4：Commit**

```bash
git add src/features/mock-exams/ExamQuestionCard.tsx src/features/mock-exams/ExamPaper.tsx
git commit -m "feat: render mock exam using single-page card flow"
```
