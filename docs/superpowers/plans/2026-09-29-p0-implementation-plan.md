# P0（UX 切换 + Bundle 优化）实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 不改内容 JSON/MDX schema，完成 3 项改进：(A) 真题三态视图 (B) 题库列数切换+偏好持久化 (C) 按需加载+路由懒加载；所有现有构建/测试/lint 通过。

**架构：** P0 分两阶段落地——先做同步交互层 (A+B) 保持现有内容加载不变；再做 bundle 优化 (C) 把 `lib/content/*` 改为 `import.meta.glob` 异步，三个 Page 接入 `useAsyncContent`，路由用 `React.lazy + Suspense` 切分 chunk。自定义 hook（`useLocalStoragePref`、`useAsyncContent`）先行产出并独立测试。

**技术栈：** React 19 + TypeScript 6 + Tailwind v4 + Vite 8 + Vitest 5（jsdom）+ React Router 7。

---

## 文件结构与职责

### 新增文件（4 个源码 + 3 个测试，共 7）

| 路径 | 职责 |
|---|---|
| `src/lib/hooks/useLocalStoragePref.ts` | 通用「偏好读写 + localStorage 兜底」泛型 hook |
| `src/lib/hooks/useLocalStoragePref.test.ts` | 覆盖读写/非法值/禁用存储三场景 |
| `src/lib/hooks/useAsyncContent.ts` | 通用异步 fetcher 三态：loading / data / error |
| `src/lib/hooks/useAsyncContent.test.ts` | 覆盖成功/失败/重渲染 deps 不变三场景 |
| `src/components/PageLoading.tsx` | 路由级 Suspense fallback 骨架 |
| `src/components/ContentLoading.tsx` | 内容级（Page 内部 fetcher）加载骨架 |
| `src/features/mock-exams/ExamPaper.test.tsx` | A 阶段：三态 tab 切换行为测试 |

### 修改文件（13 个）

| 路径 | 改动点 |
|---|---|
| `src/features/mock-exams/ExamPaper.tsx` | 加 tablist（分屏/仅题/仅答）+ 条件渲染 + aria 属性 |
| `src/features/practice/PracticePage.tsx` | (B) 标题区加 w-28 列数 Segmented + 接 useLocalStoragePref + 动态 grid；(C) 后阶段再套 useAsyncContent 三态 |
| `src/features/knowledge/KnowledgePage.tsx` | (C) 套 useAsyncContent；MDX 组件改从 `data.Component` 渲染 |
| `src/features/mock-exams/MockExamsPage.tsx` | (C) 套 useAsyncContent |
| `src/lib/content/knowledge.ts` | (C) 改为 `import.meta.glob` 匹配 `knowledge/*.mdx`，导出 async + 保留 `isSupportedWeek` 同步守卫 |
| `src/lib/content/practice.ts` | (C) 改为 `import.meta.glob` 匹配 `questions/*.json`，导出 async + 保留 `groupPracticeQuestions` 纯函数 |
| `src/lib/content/mockExams.ts` | (C) 改为 `import.meta.glob` 匹配 `exams/*.json`，导出 async |
| `src/app/router.tsx` | (C) 三个 Page 改 `React.lazy(() => import(...))` |
| `src/app/AppShell.tsx` | (C) Outlet 外套 `<Suspense fallback={<PageLoading />}>` |
| `src/features/mock-exams/MockExamsPage.test.tsx` | (C) vi.mock 让 `getMockExamsByWeek` mockResolvedValue；用 findBy 等待异步渲染 |
| `src/content/content-files.test.ts` | (C) 若依赖同步导入则改为异步 await glob 模式 |
| `src/features/practice/QuestionCard.test.tsx` | 无异步行为，无需修改（仅校验仍通过） |
| `src/App.test.tsx` | 如渲染 KnowledgePage 默认路由直接断言会空白，则改为 `waitFor` 等待 Suspense 加载 |

---

## 阶段 1：同步交互层（A + B，不碰 lib/content 异步）

### 任务 1：useLocalStoragePref hook + 单元测试

**文件：**
- 创建：`src/lib/hooks/useLocalStoragePref.ts`
- 创建：`src/lib/hooks/useLocalStoragePref.test.ts`

- [ ] **步骤 1.1：编写失败的测试**

`src/lib/hooks/useLocalStoragePref.test.ts`：

```tsx
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useLocalStoragePref } from './useLocalStoragePref'

const KEY = 'comp6080:test:pref-columns'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useLocalStoragePref', () => {
  it('returns defaultValue when key is missing', () => {
    const { result } = renderHook(() => useLocalStoragePref(KEY, '2'))
    expect(result.current[0]).toBe('2')
    // 首次读空时回写一次默认值
    expect(window.localStorage.getItem(KEY)).toBe('2')
  })

  it('reads existing valid value on mount', () => {
    window.localStorage.setItem(KEY, '3')
    const { result } = renderHook(() => useLocalStoragePref(KEY, '2'))
    expect(result.current[0]).toBe('3')
  })

  it('falls back to defaultValue when stored value is invalid (accepts a validator)', () => {
    window.localStorage.setItem(KEY, '99')
    const { result } = renderHook(() =>
      useLocalStoragePref(KEY, '2', (v) => ['1', '2', '3'].includes(v)),
    )
    expect(result.current[0]).toBe('2')
    expect(window.localStorage.getItem(KEY)).toBe('2')
  })

  it('setter writes to localStorage and updates state', () => {
    const { result } = renderHook(() => useLocalStoragePref(KEY, '2'))
    act(() => {
      result.current[1]('1')
    })
    expect(result.current[0]).toBe('1')
    expect(window.localStorage.getItem(KEY)).toBe('1')
  })

  it('gracefully degrades when localStorage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    const { result } = renderHook(() => useLocalStoragePref(KEY, '2'))
    expect(result.current[0]).toBe('2')
    act(() => {
      result.current[1]('3')
    })
    expect(result.current[0]).toBe('3') // 内存 state 仍工作
    getItem.mockRestore()
    setItem.mockRestore()
  })
})
```

- [ ] **步骤 1.2：运行测试确认失败**

运行：`npm run test -- useLocalStoragePref`
预期：FAIL（`Cannot find module './useLocalStoragePref'` 或对应 `useLocalStoragePref is not a function`）

- [ ] **步骤 1.3：编写最少实现代码**

`src/lib/hooks/useLocalStoragePref.ts`：

```ts
import { useCallback, useEffect, useState } from 'react'

export function useLocalStoragePref<T extends string>(
  key: string,
  defaultValue: T,
  validator?: (value: T) => boolean,
): [T, (next: T) => void] {
  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return defaultValue
      const value = raw as T
      if (validator && !validator(value)) return defaultValue
      return value
    } catch {
      return defaultValue
    }
  }

  const write = (value: T): void => {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* ignore (private mode / quota) */
    }
  }

  const [value, setValue] = useState<T>(read)

  useEffect(() => {
    // 首次读空或非法时立即写回一次，便于后续读取一致
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null || (validator && !validator(raw as T))) {
        write(value)
      }
    } catch {
      /* ignore */
    }
    // 仅挂载期确保默认值落盘一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setPref = useCallback(
    (next: T) => {
      setValue(next)
      write(next)
    },
    // key 固定后写函数不变；依赖 key 是为同一 hook 不同 key 场景安全
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )

  return [value, setPref]
}
```

- [ ] **步骤 1.4：运行测试确认通过**

运行：`npm run test -- useLocalStoragePref`
预期：5 个 case PASS

- [ ] **步骤 1.5：Commit**

```bash
git add src/lib/hooks/useLocalStoragePref.ts src/lib/hooks/useLocalStoragePref.test.ts
git commit -m "feat(p0): add useLocalStoragePref hook for persisted preferences"
```

---

### 任务 2：ExamPaper 三态视图切换（A）

**文件：**
- 修改：`src/features/mock-exams/ExamPaper.tsx`
- 创建：`src/features/mock-exams/ExamPaper.test.tsx`

- [ ] **步骤 2.1：编写失败的测试**

`src/features/mock-exams/ExamPaper.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ExamPaper } from './ExamPaper'
import type { MockExam } from '../../types/content'

const fixture: MockExam = {
  id: 'W1-TEST',
  title: 'Test Paper',
  questions: [
    {
      id: 'Q1',
      question: 'What is HTML?',
      knowledgePoint: 'HTML basics',
      answerExplanation: 'Hypertext Markup Language.',
      codeBlocks: [],
      images: [],
    },
    {
      id: 'Q2',
      question: 'What is CSS?',
      knowledgePoint: 'CSS basics',
      answerExplanation: 'Cascading Style Sheets.',
      codeBlocks: [],
      images: [],
    },
  ],
}

describe('ExamPaper view mode tabs', () => {
  it('defaults to split view (both panels rendered)', () => {
    render(<ExamPaper exam={fixture} />)
    expect(screen.getByRole('heading', { name: '题目' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '答案' })).toBeInTheDocument()
    const split = screen.getByRole('tab', { name: '分屏对照' }) as HTMLButtonElement
    expect(split).toHaveAttribute('aria-selected', 'true')
  })

  it('hides answers when "仅题目" tab is selected', async () => {
    const user = userEvent.setup()
    render(<ExamPaper exam={fixture} />)
    await user.click(screen.getByRole('tab', { name: '仅题目' }))
    expect(screen.queryByRole('heading', { name: '答案' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '题目' })).toBeInTheDocument()
  })

  it('hides questions when "仅答案" tab is selected', async () => {
    const user = userEvent.setup()
    render(<ExamPaper exam={fixture} />)
    await user.click(screen.getByRole('tab', { name: '仅答案' }))
    expect(screen.queryByRole('heading', { name: '题目' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '答案' })).toBeInTheDocument()
  })
})
```

- [ ] **步骤 2.2：运行测试确认失败**

运行：`npm run test -- ExamPaper`
预期：FAIL —— `Unable to find role="tab"`（当前没 tab）

- [ ] **步骤 2.3：编写最少实现代码（替换 ExamPaper.tsx）**

`src/features/mock-exams/ExamPaper.tsx`：

```tsx
import { useState } from 'react'

import type { MockExam } from '../../types/content'

type ViewMode = 'split' | 'questions' | 'answers'

type ExamPaperProps = {
  exam: MockExam
}

const TABS: { value: ViewMode; label: string }[] = [
  { value: 'split', label: '分屏对照' },
  { value: 'questions', label: '仅题目' },
  { value: 'answers', label: '仅答案' },
]

export function ExamPaper({ exam }: ExamPaperProps) {
  const [mode, setMode] = useState<ViewMode>('split')

  const questionsId = `questions-${exam.id}`
  const answersId = `answers-${exam.id}`

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {exam.title}
        </h2>

        <div
          role="tablist"
          aria-label="试卷视图切换"
          className="inline-flex w-56 shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 p-1"
        >
          {TABS.map((tab) => {
            const active = mode === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={tab.value === 'answers' ? answersId : questionsId}
                onClick={() => setMode(tab.value)}
                className={[
                  'flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition',
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-700',
                ].join(' ')}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className={[
          'mt-6 gap-6',
          mode === 'split' ? 'grid xl:grid-cols-2' : 'grid grid-cols-1',
        ].join(' ')}
      >
        {mode !== 'answers' ? (
          <section
            id={questionsId}
            role="tabpanel"
            aria-labelledby={`${questionsId}-tab`}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
          >
            <h3 className="text-lg font-semibold text-slate-950">题目</h3>
            <ol className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              {exam.questions.map((question, index) => (
                <li key={question.id}>
                  <span className="font-semibold text-slate-950">{`${index + 1}. `}</span>
                  {question.question}
                  {question.codeBlocks.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {question.codeBlocks.map((block, bi) => (
                        <div
                          key={`${question.id}-${bi}`}
                          className="overflow-hidden rounded-2xl border border-slate-200"
                        >
                          <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {block.language}
                          </div>
                          <pre className="overflow-x-auto bg-slate-950 px-4 py-4 text-sm leading-6 text-slate-100">
                            <code>{block.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {mode !== 'questions' ? (
          <section
            id={answersId}
            role="tabpanel"
            aria-labelledby={`${answersId}-tab`}
            className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5"
          >
            <h3 className="text-lg font-semibold text-slate-950">答案</h3>
            <ol className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              {exam.questions.map((question, index) => (
                <li key={`${question.id}-answer`}>
                  <p>
                    <span className="font-semibold text-slate-950">{`${index + 1}. `}</span>
                    <span className="font-semibold text-slate-950">知识点：</span>
                    {question.knowledgePoint}
                  </p>
                  <p className="mt-1">{question.answerExplanation}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </article>
  )
}
```

> 备注：题目区的 codeBlocks 渲染是顺带补齐（真题有 codeBlocks 字段原实现未渲染，属 MVP 遗漏）；若不希望本任务带此改动，可移除该 code block 块，保持与原实现一致。

- [ ] **步骤 2.4：运行测试确认通过**

运行：`npm run test -- ExamPaper`
预期：3 个 case PASS

- [ ] **步骤 2.5：Commit**

```bash
git add src/features/mock-exams/ExamPaper.tsx src/features/mock-exams/ExamPaper.test.tsx
git commit -m "feat(p0-A): add split/questions-only/answers-only tabs to ExamPaper"
```

---

### 任务 3：PracticePage 列数切换（B）

**文件：**
- 修改：`src/features/practice/PracticePage.tsx`
- 验证：`src/features/practice/QuestionCard.test.tsx`（不改）

- [ ] **步骤 3.1：先快速跑现有 Practice 测试，确保基线**

运行：`npm run test -- QuestionCard`
预期：PASS（已有测试不依赖 PracticePage）

- [ ] **步骤 3.2：替换 PracticePage 加入列数切换器 + 偏好持久化**

`src/features/practice/PracticePage.tsx`：

```tsx
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { useLocalStoragePref } from '../../lib/hooks/useLocalStoragePref'
import {
  getPracticeQuestionsByWeek,
  groupPracticeQuestions,
} from '../../lib/content/practice'
import { QuestionCard } from './QuestionCard'

const COLUMN_KEY = 'comp6080:pref:practice-columns'
type ColumnPref = '1' | '2' | '3'
const isValidColumn = (v: string): v is ColumnPref => ['1', '2', '3'].includes(v)

function parseWeek(weekParam?: string) {
  const match = weekParam?.match(/^week-(\d)$/)
  const value = Number(match?.[1])
  return Number.isInteger(value) ? value : Number.NaN
}

const COL_ICON = {
  1: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.5" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6.25" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
} as const

function gridClassFor(pref: ColumnPref) {
  switch (pref) {
    case '1':
      return 'grid gap-4 grid-cols-1'
    case '2':
      return 'grid gap-4 grid-cols-1 lg:grid-cols-2'
    case '3':
      return 'grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  }
}

export function PracticePage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const collection = getPracticeQuestionsByWeek(week)
  const [colPref, setColPref] = useLocalStoragePref<ColumnPref>(
    COLUMN_KEY,
    '2',
    isValidColumn,
  )
  const gridClass = gridClassFor(colPref)

  const grouped = useMemo(() => {
    if (!collection) return {}
    return groupPracticeQuestions(collection.questions)
  }, [collection])

  if (!collection) {
    return (
      <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <h2 className="text-xl font-semibold">暂不支持这个周次</h2>
        <p className="mt-2 text-sm leading-6">
          请选择 `Week 1` 到 `Week 4` 之间的内容。
        </p>
      </section>
    )
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Practice
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {`Week ${week} 模拟题库`}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                每次先独立判断，再展开答案，训练“概念 + 解释”一体化输出。
              </p>
            </div>

            <div className="inline-flex w-28 shrink-0 items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1 text-slate-500">
              {(['1', '2', '3'] as const).map((n) => {
                const active = colPref === n
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`题库 ${n} 列`}
                    aria-pressed={active}
                    onClick={() => setColPref(n)}
                    className={[
                      'flex h-7 flex-1 items-center justify-center rounded-full transition',
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-blue-700',
                    ].join(' ')}
                  >
                    {COL_ICON[n as 1 | 2 | 3]}
                  </button>
                )
              })}
            </div>
          </div>

          <WeekTabs basePath="practice" />
        </div>
      </div>

      {collection.questions.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
          当前周题库还未填充，后续会补充这一周的分类练习题。
        </div>
      ) : null}

      {Object.entries(grouped).map(([topic, questions]) => (
        <div key={topic} className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
            {topic}
          </h3>
          <div className={gridClass}>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **步骤 3.3：跑 lint + build 验证无类型错误**

```bash
npm run lint
npm run build
```
预期：oxlint 0 errors；tsc 无报错；vite build 正常结束。

- [ ] **步骤 3.4：Commit**

```bash
git add src/features/practice/PracticePage.tsx
git commit -m "feat(p0-B): practice grid column toggle with persisted preference"
```

---

## 阶段 2：Bundle 优化（C）—— 按需加载 + 路由懒加载

### 任务 4：useAsyncContent hook + 测试

**文件：**
- 创建：`src/lib/hooks/useAsyncContent.ts`
- 创建：`src/lib/hooks/useAsyncContent.test.ts`

- [ ] **步骤 4.1：编写失败的测试**

`src/lib/hooks/useAsyncContent.test.ts`：

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAsyncContent } from './useAsyncContent'

describe('useAsyncContent', () => {
  it('emits loading then data on success', async () => {
    const fetcher = vi.fn().mockResolvedValue('hello')
    const { result } = renderHook(() => useAsyncContent(() => fetcher(), []))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe('hello')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('captures error without throwing to render', async () => {
    const err = new Error('boom')
    const fetcher = vi.fn().mockRejectedValue(err)
    const { result } = renderHook(() => useAsyncContent(() => fetcher(), []))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe(err)
    expect(result.current.data).toBeNull()
  })

  it('does not re-fetch when deps are referentially stable', async () => {
    const fetcher = vi.fn().mockResolvedValue(1)
    const { rerender } = renderHook(
      ({ d }: { d: number[] }) => useAsyncContent(() => fetcher().then((v) => v + d[0]), d),
      { initialProps: { d: [0] as number[] } },
    )
    await waitFor(() => expect(resultRefData()).toBe(1))
    rerender({ d: [0] }) // same reference or same values → useEffect([]) still only fired once
    // Wait a tiny tick to ensure no extra call happened
    await new Promise((r) => setTimeout(r, 30))
    expect(fetcher).toHaveBeenCalledTimes(1)

    function resultRefData() {
      // hack to reference result inside renderHook
      return (globalThis as unknown as { __r: unknown }).__r
    }
  })
})
```

> 注：上述 `resultRefData` hack 仅为演示；**推荐在真实实现测试中直接在作用域里拿 result**：

修正后的真实测试（推荐替换上面的完整文件内容）：

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAsyncContent } from './useAsyncContent'

describe('useAsyncContent', () => {
  it('emits loading then data on success', async () => {
    const fetcher = vi.fn(async () => 'hello')
    const { result } = renderHook(() => useAsyncContent(fetcher, []))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe('hello')
    expect(result.current.error).toBeNull()
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('captures rejection as error state', async () => {
    const boom = new Error('network')
    const fetcher = vi.fn(async () => {
      throw boom
    })
    const { result } = renderHook(() => useAsyncContent(fetcher, []))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe(boom)
    expect(result.current.data).toBeNull()
  })

  it('refetches when dep value changes', async () => {
    const fetcher = vi.fn(async (n: number) => n * 2)
    const { result, rerender } = renderHook(
      ({ n }: { n: number }) => useAsyncContent(() => fetcher(n), [n]),
      { initialProps: { n: 1 } },
    )
    await waitFor(() => expect(result.current.data).toBe(2))
    expect(fetcher).toHaveBeenCalledTimes(1)
    rerender({ n: 3 })
    await waitFor(() => expect(result.current.data).toBe(6))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
```

- [ ] **步骤 4.2：运行测试确认失败**

运行：`npm run test -- useAsyncContent`
预期：FAIL（模块不存在）

- [ ] **步骤 4.3：编写最少实现代码**

`src/lib/hooks/useAsyncContent.ts`：

```ts
import { useEffect, useState } from 'react'

export type AsyncContentState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useAsyncContent<T>(
  fetcher: () => Promise<T | null>,
  deps: unknown[],
): AsyncContentState<T> {
  const [state, setState] = useState<AsyncContentState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let alive = true
    setState((prev) => ({ ...prev, loading: true, error: null }))

    const run = async () => {
      try {
        const value = await fetcher()
        if (!alive) return
        setState({ data: value, loading: false, error: null })
      } catch (err) {
        if (!alive) return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }

    void run()

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
```

- [ ] **步骤 4.4：运行测试确认通过**

运行：`npm run test -- useAsyncContent`
预期：3 个 case PASS

- [ ] **步骤 4.5：Commit**

```bash
git add src/lib/hooks/useAsyncContent.ts src/lib/hooks/useAsyncContent.test.ts
git commit -m "feat(p0-C): add useAsyncContent hook for loading/error/data"
```

---

### 任务 5：两个骨架屏组件（PageLoading + ContentLoading）

**文件：**
- 创建：`src/components/PageLoading.tsx`
- 创建：`src/components/ContentLoading.tsx`

- [ ] **步骤 5.1：编写 PageLoading（路由级 Suspense fallback）**

`src/components/PageLoading.tsx`：

```tsx
export function PageLoading() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="h-48 w-full animate-pulse rounded-[2rem] border border-slate-200 bg-white shadow-sm" />
      <div className="h-96 w-full animate-pulse rounded-[2rem] border border-slate-200 bg-white shadow-sm" />
    </div>
  )
}
```

- [ ] **步骤 5.2：编写 ContentLoading（页面内部加载骨架）**

`src/components/ContentLoading.tsx`：

```tsx
type ContentLoadingProps = {
  rows?: number
}

export function ContentLoading({ rows = 6 }: ContentLoadingProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded-full bg-slate-200"
            style={{ width: `${100 - (i % 3) * 20}%` }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **步骤 5.3：快速通过 lint + Commit**

```bash
npm run lint
git add src/components/PageLoading.tsx src/components/ContentLoading.tsx
git commit -m "feat(p0-C): add route-level and content-level loading skeletons"
```

---

### 任务 6：lib/content 三层改为 import.meta.glob + async

**文件：**
- 修改：`src/lib/content/knowledge.ts`
- 修改：`src/lib/content/practice.ts`
- 修改：`src/lib/content/mockExams.ts`

- [ ] **步骤 6.1：重写 knowledge.ts**

`src/lib/content/knowledge.ts`：

```ts
import type { ComponentType } from 'react'

import type { KnowledgeFrontmatter } from '../../types/content'

type MdxFixture = {
  default: ComponentType<Record<string, never>>
  frontmatter: KnowledgeFrontmatter
}

type KnowledgeEntry = {
  Component: ComponentType<Record<string, never>>
  frontmatter: KnowledgeFrontmatter
}

const knowledgeModules = import.meta.glob<MdxFixture>(
  '../../../content/knowledge/*.mdx',
  { eager: false },
)

export function isSupportedWeek(value: number): value is 1 | 2 | 3 | 4 {
  return value >= 1 && value <= 4
}

async function importWeekModule(week: number): Promise<KnowledgeEntry | null> {
  const key = `../../../content/knowledge/week-${week}.mdx`
  const loader = knowledgeModules[key]
  if (!loader) return null
  const mod = await loader()
  return { Component: mod.default, frontmatter: mod.frontmatter }
}

export async function getKnowledgeByWeek(week: number) {
  if (!isSupportedWeek(week)) {
    throw new Error('Unsupported week')
  }
  const entry = await importWeekModule(week)
  if (!entry) {
    throw new Error(`Knowledge content not found for week ${week}`)
  }
  return entry
}
```

- [ ] **步骤 6.2：重写 practice.ts**

`src/lib/content/practice.ts`：

```ts
import type {
  PracticeQuestion,
  PracticeQuestionCollection,
} from '../../types/content'

const practiceModules = import.meta.glob<PracticeQuestionCollection>(
  '../../../content/questions/*.json',
  { eager: false },
)

async function importWeekModule(week: number): Promise<PracticeQuestionCollection | null> {
  const key = `../../../content/questions/week-${week}.practice.json`
  const loader = practiceModules[key]
  if (!loader) return null
  return loader()
}

export async function getPracticeQuestionsByWeek(week: number) {
  return importWeekModule(week)
}

export function groupPracticeQuestions(questions: PracticeQuestion[]) {
  return questions.reduce<Record<string, PracticeQuestion[]>>((groups, question) => {
    const group = groups[question.topic] ?? []
    group.push(question)
    groups[question.topic] = group
    return groups
  }, {})
}
```

- [ ] **步骤 6.3：重写 mockExams.ts**

`src/lib/content/mockExams.ts`：

```ts
import type { MockExamCollection } from '../../types/content'

const examModules = import.meta.glob<MockExamCollection>(
  '../../../content/exams/*.json',
  { eager: false },
)

async function importWeekModule(week: number): Promise<MockExamCollection | null> {
  const key = `../../../content/exams/week-${week}.mock-exams.json`
  const loader = examModules[key]
  if (!loader) return null
  return loader()
}

export async function getMockExamsByWeek(week: number) {
  return importWeekModule(week)
}
```

- [ ] **步骤 6.4：lint + typecheck（三个 Page 此时还未适配会 TS 报错是预期，先修 Page 再 build）**

```bash
npm run lint
npx tsc -b --pretty false 2>&1 | head -40
```
预期：knowledge.ts / practice.ts / mockExams.ts 本身无错误；三个调用方 Page 报错 `Type 'Promise<...>' is not assignable` 是正常的，下一步修。

- [ ] **步骤 6.5：Commit**

```bash
git add src/lib/content/knowledge.ts src/lib/content/practice.ts src/lib/content/mockExams.ts
git commit -m "feat(p0-C): lib/content async via import.meta.glob"
```

---

### 任务 7：三个 Page 接入 useAsyncContent

**文件（按顺序修改）：**
1. 修改：`src/features/knowledge/KnowledgePage.tsx`
2. 修改：`src/features/practice/PracticePage.tsx`
3. 修改：`src/features/mock-exams/MockExamsPage.tsx`

#### 7a. KnowledgePage

- [ ] **步骤 7a：重写 KnowledgePage**

`src/features/knowledge/KnowledgePage.tsx`：

```tsx
import { Link, useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { ContentLoading } from '../../components/ContentLoading'
import {
  getKnowledgeByWeek,
  isSupportedWeek,
} from '../../lib/content/knowledge'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'

function parseWeek(weekParam?: string) {
  const match = weekParam?.match(/^week-(\d)$/)
  const value = Number(match?.[1])
  return Number.isInteger(value) ? value : Number.NaN
}

function UnsupportedWeekCard() {
  return (
    <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-xl font-semibold">暂不支持这个周次</h2>
      <p className="mt-2 text-sm leading-6">
        请选择 `Week 1` 到 `Week 4` 之间的内容。
      </p>
    </section>
  )
}

function LoadErrorCard() {
  return (
    <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h2 className="text-xl font-semibold">知识点内容加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

export function KnowledgePage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const supported = isSupportedWeek(week)

  const { data: knowledge, loading, error } = useAsyncContent(
    () => (supported ? getKnowledgeByWeek(week) : Promise.resolve(null)),
    [supported, week],
  )

  if (!supported) {
    return <UnsupportedWeekCard />
  }

  if (loading) {
    return (
      <section className="flex w-full flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl flex-1">
              <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-9 w-60 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
        <ContentLoading rows={10} />
      </section>
    )
  }

  if (error || !knowledge) {
    return error ? <LoadErrorCard /> : <UnsupportedWeekCard />
  }

  const KnowledgeContent = knowledge.Component

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Knowledge
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {`Week ${week} 知识点解析`}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              先读核心概念，再跳到单题训练和整卷模拟，形成“理解 -
              练习 - 复盘”的学习闭环。
            </p>
          </div>
          <WeekTabs basePath="knowledge" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <KnowledgeContent />
        </article>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-semibold text-slate-950">本页使用方式</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>先看概念和易错点，建立答题语言。</li>
              <li>再去做分类题库，检查是否能独立判断。</li>
              <li>最后用整卷模拟题训练输出节奏。</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">关联入口</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                to={`/practice/week-${week}`}
              >
                进入模拟题库
              </Link>
              <Link
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                to={`/mock-exams/week-${week}`}
              >
                查看模拟真题
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
```

#### 7b. PracticePage（套上 useAsyncContent，保留列数切换）

- [ ] **步骤 7b：重写 PracticePage**

`src/features/practice/PracticePage.tsx`：

```tsx
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { ContentLoading } from '../../components/ContentLoading'
import { useLocalStoragePref } from '../../lib/hooks/useLocalStoragePref'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import {
  getPracticeQuestionsByWeek,
  groupPracticeQuestions,
} from '../../lib/content/practice'
import { QuestionCard } from './QuestionCard'

const COLUMN_KEY = 'comp6080:pref:practice-columns'
type ColumnPref = '1' | '2' | '3'
const isValidColumn = (v: string): v is ColumnPref => ['1', '2', '3'].includes(v)

function parseWeek(weekParam?: string) {
  const match = weekParam?.match(/^week-(\d)$/)
  const value = Number(match?.[1])
  return Number.isInteger(value) ? value : Number.NaN
}

const COL_ICON = {
  1: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.5" y="2" width="5.5" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6.25" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="2" width="3.5" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
} as const

function gridClassFor(pref: ColumnPref) {
  switch (pref) {
    case '1':
      return 'grid gap-4 grid-cols-1'
    case '2':
      return 'grid gap-4 grid-cols-1 lg:grid-cols-2'
    case '3':
      return 'grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  }
}

function UnsupportedWeekCard() {
  return (
    <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-xl font-semibold">暂不支持这个周次</h2>
      <p className="mt-2 text-sm leading-6">
        请选择 `Week 1` 到 `Week 4` 之间的内容。
      </p>
    </section>
  )
}

function LoadErrorCard() {
  return (
    <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h2 className="text-xl font-semibold">题库加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

export function PracticePage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const supported = Number.isFinite(week) && week >= 1 && week <= 4

  const { data: collection, loading, error } = useAsyncContent(
    () => (supported ? getPracticeQuestionsByWeek(week) : Promise.resolve(null)),
    [supported, week],
  )

  const [colPref, setColPref] = useLocalStoragePref<ColumnPref>(
    COLUMN_KEY,
    '2',
    isValidColumn,
  )
  const gridClass = gridClassFor(colPref)

  const grouped = useMemo(() => {
    if (!collection) return {}
    return groupPracticeQuestions(collection.questions)
  }, [collection])

  if (!supported) {
    return <UnsupportedWeekCard />
  }

  if (loading) {
    return (
      <section className="flex w-full flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl flex-1">
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-slate-200" />
              </div>
              <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="h-9 w-60 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
        <ContentLoading rows={8} />
      </section>
    )
  }

  if (error || !collection) {
    return error ? <LoadErrorCard /> : <UnsupportedWeekCard />
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Practice
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {`Week ${week} 模拟题库`}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                每次先独立判断，再展开答案，训练“概念 + 解释”一体化输出。
              </p>
            </div>

            <div className="inline-flex w-28 shrink-0 items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1 text-slate-500">
              {(['1', '2', '3'] as const).map((n) => {
                const active = colPref === n
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`题库 ${n} 列`}
                    aria-pressed={active}
                    onClick={() => setColPref(n)}
                    className={[
                      'flex h-7 flex-1 items-center justify-center rounded-full transition',
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-blue-700',
                    ].join(' ')}
                  >
                    {COL_ICON[n as 1 | 2 | 3]}
                  </button>
                )
              })}
            </div>
          </div>

          <WeekTabs basePath="practice" />
        </div>
      </div>

      {collection.questions.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
          当前周题库还未填充，后续会补充这一周的分类练习题。
        </div>
      ) : null}

      {Object.entries(grouped).map(([topic, questions]) => (
        <div key={topic} className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
            {topic}
          </h3>
          <div className={gridClass}>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
```

#### 7c. MockExamsPage

- [ ] **步骤 7c：重写 MockExamsPage**

`src/features/mock-exams/MockExamsPage.tsx`：

```tsx
import { useParams } from 'react-router-dom'

import { WeekTabs } from '../../components/WeekTabs'
import { ContentLoading } from '../../components/ContentLoading'
import { getMockExamsByWeek } from '../../lib/content/mockExams'
import { useAsyncContent } from '../../lib/hooks/useAsyncContent'
import { ExamPaper } from './ExamPaper'

function parseWeek(weekParam?: string) {
  const match = weekParam?.match(/^week-(\d)$/)
  const value = Number(match?.[1])
  return Number.isInteger(value) ? value : Number.NaN
}

function UnsupportedWeekCard() {
  return (
    <section className="w-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-xl font-semibold">暂不支持这个周次</h2>
      <p className="mt-2 text-sm leading-6">
        请选择 `Week 1` 到 `Week 4` 之间的内容。
      </p>
    </section>
  )
}

function LoadErrorCard() {
  return (
    <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
      <h2 className="text-xl font-semibold">真题加载失败</h2>
      <p className="mt-2 text-sm leading-6">请稍后刷新；若持续失败，请检查网络与构建产物。</p>
    </section>
  )
}

export function MockExamsPage() {
  const { week: weekParam } = useParams()
  const week = parseWeek(weekParam)
  const supported = Number.isFinite(week) && week >= 1 && week <= 4

  const { data: collection, loading, error } = useAsyncContent(
    () => (supported ? getMockExamsByWeek(week) : Promise.resolve(null)),
    [supported, week],
  )

  if (!supported) {
    return <UnsupportedWeekCard />
  }

  if (loading) {
    return (
      <section className="flex w-full flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl flex-1">
              <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-9 w-60 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
        <ContentLoading rows={8} />
      </section>
    )
  }

  if (error || !collection) {
    return error ? <LoadErrorCard /> : <UnsupportedWeekCard />
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Mock Exams
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {`Week ${week} 模拟真题`}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              先完成整卷题目，再对照下方答案进行复盘，训练考试节奏与表达完整度。
            </p>
          </div>
          <WeekTabs basePath="mock-exams" />
        </div>
      </div>

      {collection.exams.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
          当前周模拟真题还未录入，后续会补充历史题与模拟卷。
        </div>
      ) : null}

      <div className="space-y-6">
        {collection.exams.map((exam) => (
          <ExamPaper key={exam.id} exam={exam} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **步骤 7d：lint + tsc**

```bash
npm run lint
npx tsc -b --pretty false
```
预期：0 errors。

- [ ] **步骤 7e：Commit**

```bash
git add \
  src/features/knowledge/KnowledgePage.tsx \
  src/features/practice/PracticePage.tsx \
  src/features/mock-exams/MockExamsPage.tsx
git commit -m "feat(p0-C): adopt useAsyncContent in three pages"
```

---

### 任务 8：路由懒加载（React.lazy + Suspense in AppShell）

**文件：**
- 修改：`src/app/router.tsx`
- 修改：`src/app/AppShell.tsx`

- [ ] **步骤 8.1：重写 router.tsx**

`src/app/router.tsx`：

```tsx
import { lazy, type ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from './AppShell'

const KnowledgePage = lazy(async () => ({
  default: (await import('../features/knowledge/KnowledgePage')).KnowledgePage,
}))

const PracticePage = lazy(async () => ({
  default: (await import('../features/practice/PracticePage')).PracticePage,
}))

const MockExamsPage = lazy(async () => ({
  default: (await import('../features/mock-exams/MockExamsPage')).MockExamsPage,
}))

function asLazyEl(node: ReactNode) {
  return node
}

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/knowledge/week-1" />,
      },
      {
        path: 'knowledge/:week',
        element: asLazyEl(<KnowledgePage />),
      },
      {
        path: 'practice/:week',
        element: asLazyEl(<PracticePage />),
      },
      {
        path: 'mock-exams/:week',
        element: asLazyEl(<MockExamsPage />),
      },
    ],
  },
]

export function createAppRouter() {
  return createBrowserRouter(appRoutes)
}

export const router = createAppRouter()
```

> 说明：`asLazyEl` 仅为让 React Router 的 `element` 字段不因为 `LazyExoticComponent` 类型报错——如果 TS 无此报错（React Router v7 的 element 类型宽松），可以删除该包装函数直接写 `<KnowledgePage />`。

- [ ] **步骤 8.2：重写 AppShell.tsx**

`src/app/AppShell.tsx`：

```tsx
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { PageLoading } from '../components/PageLoading'

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **步骤 8.3：Commit**

```bash
git add src/app/router.tsx src/app/AppShell.tsx
git commit -m "feat(p0-C): route-level code splitting with React.lazy + Suspense"
```

---

### 任务 9：测试调整（异步 mock + App.test 兼容）

**文件：**
- 修改：`src/features/mock-exams/MockExamsPage.test.tsx`
- 修改：`src/content/content-files.test.ts`
- （如需要）修改：`src/App.test.tsx`

#### 9a. MockExamsPage.test.tsx — 异步化

- [ ] **步骤 9a：先读现有测试，替换为 vi.mock + mockResolvedValue**

参考模板（**直接替换** `MockExamsPage.test.tsx` 内容，按文件实际内容按等价断言改写）：

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MockExamsPage } from './MockExamsPage'

const mockGet = vi.hoisted(() => vi.fn())
vi.mock('../../lib/content/mockExams', () => ({
  getMockExamsByWeek: mockGet,
}))

const fixture = {
  week: 'week-1' as const,
  exams: [
    {
      id: 'w1-m1',
      title: 'Week 1 真题套卷 1',
      questions: [
        {
          id: 'q1',
          question: 'Q body',
          knowledgePoint: 'KP',
          answerExplanation: 'A body',
          codeBlocks: [],
          images: [],
        },
      ],
    },
  ],
}

beforeEach(() => {
  mockGet.mockClear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="mock-exams/:week" element={<MockExamsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MockExamsPage', () => {
  it('shows exam title after data loads', async () => {
    mockGet.mockResolvedValue(fixture)
    renderAt('/mock-exams/week-1')
    await waitFor(() => {
      expect(screen.getByText('Week 1 真题套卷 1')).toBeInTheDocument()
    })
    expect(mockGet).toHaveBeenCalledWith(1)
  })

  it('shows unsupported card for week-99', async () => {
    renderAt('/mock-exams/week-99')
    await waitFor(() => {
      expect(screen.getByText('暂不支持这个周次')).toBeInTheDocument()
    })
    expect(mockGet).not.toHaveBeenCalled()
  })
})
```

#### 9b. content-files.test.ts — 如有同步 assert glob 存在 → 改为 await 异步断言

- [ ] **步骤 9b：读 `src/content/content-files.test.ts` 原文，根据断言类型改写**

策略：若该测试当前直接 `import x from 'content/...json'` 并断言 schema 没问题 → 改为 `import.meta.glob` + `Promise.all` 逐个 await 后断言（Vitest 原生支持 `import.meta.glob`）。

通用模板（根据实际断言替换内部 assert）：

```ts
import { describe, expect, it } from 'vitest'

const questions = import.meta.glob('../../content/questions/*.json', { eager: false })
const exams = import.meta.glob('../../content/exams/*.json', { eager: false })

describe('content file contracts', () => {
  it('all week-N.practice.json shape validates', async () => {
    const entries = Object.entries(questions)
    expect(entries.length).toBeGreaterThanOrEqual(4)
    for (const [name, loader] of entries) {
      const data = (await loader()) as unknown as {
        week: string
        questions: unknown[]
      }
      expect(name).toMatch(/week-\d\.practice\.json$/)
      expect(typeof data.week).toBe('string')
      expect(Array.isArray(data.questions)).toBe(true)
    }
  })

  it('all week-N.mock-exams.json shape validates', async () => {
    for (const [name, loader] of Object.entries(exams)) {
      const data = (await loader()) as unknown as {
        week: string
        exams: unknown[]
      }
      expect(name).toMatch(/week-\d\.mock-exams\.json$/)
      expect(typeof data.week).toBe('string')
      expect(Array.isArray(data.exams)).toBe(true)
    }
  })
})
```

#### 9c. App.test.tsx（如存在渲染默认路由断言）

- [ ] **步骤 9c：如 `src/App.test.tsx` 有同步断言 → 包 waitFor**

典型修正：

```tsx
await waitFor(() => {
  expect(screen.getByText(/Week 1/)).toBeInTheDocument()
})
```

- [ ] **步骤 9d：最终跑全套测试**

```bash
npm run test
```
预期：全 PASS。

- [ ] **步骤 9e：Commit**

```bash
git add \
  src/features/mock-exams/MockExamsPage.test.tsx \
  src/content/content-files.test.ts \
  src/App.test.tsx
git commit -m "test(p0-C): adapt tests to async lib/content and Suspense routes"
```

---

### 任务 10：最终 Build / Lint / 人工验收

- [ ] **步骤 10.1：跑构建**

```bash
npm run lint
npm run build
```
预期：oxlint 0 errors；tsc 0 errors；vite build 成功。

- [ ] **步骤 10.2：构建产物肉眼检查 chunk 数**

```bash
ls dist/assets | grep -E '\.(js|mjs)$' | wc -l
```
预期：≥ 6（即路由 3 块 + 内容块多块）。

```bash
ls -lh dist/assets
```
检查：单文件最大（gzip 前）< 150KB 为合格；可 `gzip -9 -c dist/assets/index-*.js | wc -c` 换算。

- [ ] **步骤 10.3：本地预览 + 11 条人工验收走查**

```bash
npm run preview -- --port 4173
```
打开 `http://localhost:4173/`，依次对照规格 §5.1 功能验收 7 条 + §5.2 工程 4 条（共 11）打勾：

| # | 检查点 | ✅/❌ |
|---|---|---|
| 1 | `/mock-exams/week-1` 每套试卷有「分屏对照/仅题目/仅答案」切换器 | |
| 2 | 三态切换后对应面板展示正确（分屏两栏、仅题一题、仅答一答） | |
| 3 | `/practice/week-1` 有列数切换器，默认 2 | |
| 4 | 选 3 列 → 刷新 → 仍 3 列 | |
| 5 | 选 1 列 → 所有分组 1 列 | |
| 6 | DevTools Network：首屏不拉 Week 2–4 MDX | |
| 7 | 控制台无红色报错 / 未处理 reject | |
| 8 | build 通过 | |
| 9 | test 通过 | |
| 10 | lint 通过 | |
| 11 | 最大 chunk gzip 后 < 150KB（或未 gzip < 150KB 也可接受，按实际内容量） | |

- [ ] **步骤 10.4：Commit（如本步骤期间有修复）并产出汇总 tag 级 commit**

```bash
git add -A
git diff --cached --stat
git commit -m "chore(p0): final build + acceptance checklist pass"
```

---

## 验收完成判定

11 条人工检查全 ✅ + 工程三项（lint/build/test）0 错误 → **P0 阶段完成，可进入 P1 规格讨论。**

## 回滚策略

任何一步出现不可恢复冲突：

```bash
git reset --hard HEAD~N   # 回退到 P0 前的 commit（执行前先用 git log 找对应 sha）
```

hook（任务 1/4）和 ExamPaper（任务 2）独立可单独 `git revert`；bundle 改造（任务 6–8）联动较多，如出问题建议整体 revert 任务 6–9 四个 commit。
