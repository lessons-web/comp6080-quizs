# Task 2 Content Models Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Week 1-4 content directory structure, unified content types, Week 1 practice/mock exam data, and placeholder Week 2-4 data without building any page components.

**Architecture:** Keep all authored content at the project root under `content/` so the content layer stays independent from React UI code. Store shared TypeScript contracts in `src/types/content.ts`, validate the authored files with one focused Vitest suite that reads MDX/JSON from disk, and leave runtime loading for a later task.

**Tech Stack:** Vite, React 19, TypeScript, Vitest, Node.js `fs`

---

### Task 1: Add a failing content-structure test first

**Files:**
- Create: `src/content/content-files.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const projectRoot = join(__dirname, '..', '..')

function readText(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), 'utf8')
}

function readJson(relativePath: string) {
  return JSON.parse(readText(relativePath))
}

describe('content files', () => {
  it('stores knowledge MDX files with required frontmatter', () => {
    const week1 = readText('content/knowledge/week-1.mdx')
    const week4 = readText('content/knowledge/week-4.mdx')

    expect(week1).toContain('title:')
    expect(week1).toContain('week: "week-1"')
    expect(week4).toContain('summary:')
  })

  it('stores week 1 practice questions with the spec fields', () => {
    const practice = readJson('content/questions/week-1.practice.json')

    expect(practice.week).toBe('week-1')
    expect(practice.questions[0]).toMatchObject({
      question: expect.any(String),
      knowledgePoint: expect.any(String),
      answerExplanation: expect.any(String),
      codeBlocks: expect.any(Array),
      images: expect.any(Array),
    })
  })

  it('stores week 1 mock exams and empty later-week placeholders', () => {
    const exams = readJson('content/exams/week-1.mock-exams.json')
    const week2Practice = readJson('content/questions/week-2.practice.json')

    expect(exams.week).toBe('week-1')
    expect(exams.exams).toHaveLength(2)
    expect(exams.exams[0].questions[0]).toMatchObject({
      question: expect.any(String),
      knowledgePoint: expect.any(String),
      answerExplanation: expect.any(String),
      codeBlocks: expect.any(Array),
      images: expect.any(Array),
    })
    expect(week2Practice.questions).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/content-files.test.ts`
Expected: FAIL because the `content/knowledge`, `content/questions`, and `content/exams` files do not exist yet.

### Task 2: Add the shared content contracts

**Files:**
- Create: `src/types/content.ts`

- [ ] **Step 1: Write the shared types**

```ts
export type WeekId = 'week-1' | 'week-2' | 'week-3' | 'week-4'

export interface ContentCodeBlock {
  language: string
  code: string
}

export interface ContentImage {
  src: string
  alt: string
}

export interface KnowledgeFrontmatter {
  title: string
  week: WeekId
  summary: string
}

export interface PracticeQuestion {
  id: string
  topic: string
  question: string
  knowledgePoint: string
  answerExplanation: string
  codeBlocks: ContentCodeBlock[]
  images: ContentImage[]
}

export interface PracticeQuestionCollection {
  week: WeekId
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
  week: WeekId
  exams: MockExam[]
}
```

- [ ] **Step 2: Re-run the focused test**

Run: `npx vitest run src/content/content-files.test.ts`
Expected: Still FAIL because the content files themselves are not created yet.

### Task 3: Add the authored content files

**Files:**
- Create: `content/knowledge/week-1.mdx`
- Create: `content/knowledge/week-2.mdx`
- Create: `content/knowledge/week-3.mdx`
- Create: `content/knowledge/week-4.mdx`
- Create: `content/questions/week-1.practice.json`
- Create: `content/questions/week-2.practice.json`
- Create: `content/questions/week-3.practice.json`
- Create: `content/questions/week-4.practice.json`
- Create: `content/exams/week-1.mock-exams.json`
- Create: `content/exams/week-2.mock-exams.json`
- Create: `content/exams/week-3.mock-exams.json`
- Create: `content/exams/week-4.mock-exams.json`

- [ ] **Step 1: Add knowledge MDX files**

Create `content/knowledge/week-1.mdx` with YAML frontmatter fields `title`, `week`, and `summary`, then summarize the Week 1 HTML/CSS concepts from the provided source document in prose sections such as HTML structure, semantic tags, asset paths, accessibility, CSS specificity, box model, Flexbox, and stacking contexts.

Create `content/knowledge/week-2.mdx`, `week-3.mdx`, and `week-4.mdx` with the same three frontmatter fields plus brief placeholder body copy stating that the week content will be added later.

- [ ] **Step 2: Add practice question JSON**

Create `content/questions/week-1.practice.json` with:
- top-level `week: "week-1"`
- top-level `questions: []`
- one entry per Week 1 practice question from the source markdown
- every question object includes `id`, `topic`, `question`, `knowledgePoint`, `answerExplanation`, `codeBlocks`, and `images`
- `codeBlocks` contains extracted code snippets where the source question includes code
- `images` is an empty array for this data set

Create `content/questions/week-2.practice.json`, `week-3.practice.json`, and `week-4.practice.json` with the same top-level shape and an empty `questions` array.

- [ ] **Step 3: Add mock exam JSON**

Create `content/exams/week-1.mock-exams.json` with:
- top-level `week: "week-1"`
- top-level `exams: []`
- two exam entries matching the two Week 1 mock exams in the source markdown
- each exam includes `id`, `title`, and `questions`
- each exam question includes `id`, `question`, `knowledgePoint`, `answerExplanation`, `codeBlocks`, and `images`

Create `content/exams/week-2.mock-exams.json`, `week-3.mock-exams.json`, and `week-4.mock-exams.json` with the same top-level shape and an empty `exams` array.

- [ ] **Step 4: Run the focused test to make it pass**

Run: `npx vitest run src/content/content-files.test.ts`
Expected: PASS

### Task 4: Run full verification

**Files:**
- Test: `src/content/content-files.test.ts`

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: PASS and emit the Vite production bundle

- [ ] **Step 2: Run the test suite**

Run: `npm run test`
Expected: PASS with both the existing app smoke test and the new content-structure test

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS
