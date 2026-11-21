# Practice UI/UX HTML Mockups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add static, accessible HTML mockups to UI/UX practice questions that benefit from visual evidence, while keeping bank cards compact and preserving exam mockup behavior.

**Architecture:** Extend `PracticeQuestion` with an optional `PracticeQuestionMockup`; create a shared `HtmlMockupPreview` primitive for trusted repository-authored HTML; use a small practice card on detail pages and keep exam-only file selection in `ExamQuestionMockup`. Populate the 26 approved candidates listed in `docs/superpowers/specs/2026-11-08-practice-ui-ux-mockups-design.md`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, static HTML strings in JSON, Vitest, Testing Library.

---

## File Map

- Modify `src/types/content.ts` to define the optional practice mockup contract.
- Create `src/components/HtmlMockupPreview.tsx` and its test as the shared, inert HTML preview primitive.
- Create `src/features/practice/PracticeQuestionMockupCard.tsx` and its test for the practice-specific figure, viewport, and caption.
- Modify `src/features/mock-exams/ExamQuestionMockup.tsx` to use the shared HTML preview without changing supporting-file or code-panel interactions.
- Modify `src/features/practice/QuestionCard.tsx` to show an optional preview in the detail question flow.
- Modify `src/features/practice/QuestionCard.test.tsx` and create `src/features/practice/QuestionBankCard.test.tsx` to verify detail/list boundaries.
- Modify `src/app/globals.css` only for reusable `.exam-ui-*` patterns that are needed by multiple mockups.
- Modify `content/questions/week-5.practice.json` to add mockup data to the 26 approved questions.
- Modify `src/content/content-files.test.ts` to validate the candidate set, mockup shape, and the text-only exception.

## Task 1: Add Shared HTML Preview Primitive

**Files:**
- Create: `src/components/HtmlMockupPreview.tsx`
- Create: `src/components/HtmlMockupPreview.test.tsx`

- [ ] **Step 1: Write the failing preview tests**

Test that the component:
- renders its HTML inside `.exam-ui-root`;
- keeps viewport sizing under the calling card's control so exam and practice wrappers preserve their existing layout.

Example assertion:

```tsx
const { container } = render(
  <HtmlMockupPreview html='<div class="exam-ui-page-title">Settings</div>' />,
)

expect(container.querySelector('.exam-ui-root .exam-ui-page-title')).toHaveTextContent('Settings')
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npx vitest run src/components/HtmlMockupPreview.test.tsx`

Expected: FAIL because `HtmlMockupPreview` does not exist yet.

- [ ] **Step 3: Add the shared preview component**

Define props as `{ html: string }`. Render the HTML inside `.exam-ui-root` and use the existing static preview approach; do not add event handling or application controls. The practice card owns the mobile width wrapper, while the exam component keeps its existing viewport wrapper unchanged.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npx vitest run src/components/HtmlMockupPreview.test.tsx`

Expected: PASS for scoped HTML rendering; viewport behavior is covered by the practice-card tests and existing exam tests.

## Task 2: Add Practice Mockup Contract and Card

**Files:**
- Modify: `src/types/content.ts`
- Create: `src/features/practice/PracticeQuestionMockupCard.tsx`
- Create: `src/features/practice/PracticeQuestionMockupCard.test.tsx`

- [ ] **Step 1: Write the failing practice card tests**

Cover a desktop fixture with a caption and HTML evidence, a mobile fixture, and a question with no mockup. The rendered figure must expose its caption and use the shared preview; the no-mockup case must render nothing.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npx vitest run src/features/practice/PracticeQuestionMockupCard.test.tsx`

Expected: FAIL because the practice mockup type and card do not exist yet.

- [ ] **Step 3: Add the optional type and card**

Add:

```ts
export interface PracticeQuestionMockup {
  html: string
  caption: string
  viewport?: 'desktop' | 'mobile'
}
```

Add `mockup?: PracticeQuestionMockup` to `PracticeQuestion`. Render a warm, bordered `<figure>` with `HtmlMockupPreview` and a visible `<figcaption>`. Do not add exam supporting-file tabs.

- [ ] **Step 4: Run the focused tests and confirm they pass**

Run: `npx vitest run src/features/practice/PracticeQuestionMockupCard.test.tsx`

Expected: PASS for desktop, mobile, caption, and absent mockup.

## Task 3: Reuse the Shared Preview in Mock Exams

**Files:**
- Modify: `src/features/mock-exams/ExamQuestionMockup.tsx`
- Test: `src/features/mock-exams/ExamQuestionMockup.test.tsx`

- [ ] **Step 1: Keep current behavior covered**

Run: `npx vitest run src/features/mock-exams/ExamQuestionMockup.test.tsx`

Expected: PASS before refactoring, including file switching and code-panel cases.

- [ ] **Step 2: Delegate only the HTML surface to the shared primitive**

Replace the direct HTML preview wrapper with `HtmlMockupPreview`. Preserve the surrounding exam preview border, desktop/mobile width, caption locale, supporting-file buttons, and code rendering branch.

- [ ] **Step 3: Re-run exam mockup tests**

Run: `npx vitest run src/features/mock-exams/ExamQuestionMockup.test.tsx`

Expected: PASS with existing visible behavior unchanged.

## Task 4: Render Mockups on Practice Question Details Only

**Files:**
- Modify: `src/features/practice/QuestionCard.tsx`
- Modify: `src/features/practice/QuestionCard.test.tsx`
- Create: `src/features/practice/QuestionBankCard.test.tsx`

- [ ] **Step 1: Add failing detail and list-boundary tests**

Add a fixture with a mockup to `QuestionCard.test.tsx`; assert the caption appears in question-only detail mode after the question content. In `QuestionBankCard.test.tsx`, render the same fixture and assert the mockup HTML/caption is not rendered in the list card.

- [ ] **Step 2: Run focused tests and confirm the missing detail behavior**

Run: `npx vitest run src/features/practice/QuestionCard.test.tsx src/features/practice/QuestionBankCard.test.tsx`

Expected: the detail preview assertion fails; the list-card boundary assertion passes.

- [ ] **Step 3: Integrate the optional card into `QuestionCard`**

Render `PracticeQuestionMockupCard` after the question text and code blocks. Leave `QuestionBankCard` and `QuestionBankTable` unchanged.

- [ ] **Step 4: Run practice component tests**

Run: `npx vitest run src/features/practice/QuestionCard.test.tsx src/features/practice/QuestionBankCard.test.tsx src/features/practice/PracticeQuestionMockupCard.test.tsx`

Expected: PASS; questions without mockups retain their current layout.

## Task 5: Add Reusable Mockup Styles and Candidate Content

**Files:**
- Modify: `src/app/globals.css`
- Modify: `content/questions/week-5.practice.json`

- [ ] **Step 1: Add only reusable preview patterns**

Review the candidate evidence list in the approved design document. Reuse existing `.exam-ui-*` classes first. Add generic classes only where repeated patterns need them, such as breadcrumb/navigation states, inline field errors, focus indicators, and mobile action targets. Do not add selectors keyed to question IDs or one-off question layouts.

- [ ] **Step 2: Add mockup data to the 26 approved questions**

Add a `mockup` object with `html`, `caption`, and `viewport` where appropriate to:

`UIUX-Q2` through `UIUX-Q9`; `QUIZ2-W5-Q1`, `QUIZ2-W5-Q5` through `QUIZ2-W5-Q7`; and `QUIZ3-W5-Q1` through `QUIZ3-W5-Q14`.

Use desktop viewports by default and set mobile for the touch-target example. Captions must describe visible evidence neutrally, without naming the answer principle. Leave `UIUX-Q1`, all non-UI/UX questions, and existing question explanations unchanged. Do not add image files.

- [ ] **Step 3: Validate the content JSON and candidate set**

Run:

```bash
python3 -c 'import json; d=json.load(open("content/questions/week-5.practice.json")); qs={q["id"]:q for q in d["questions"]}; ids=[f"UIUX-Q{i}" for i in range(2,10)]+["QUIZ2-W5-Q1","QUIZ2-W5-Q5","QUIZ2-W5-Q6","QUIZ2-W5-Q7"]+[f"QUIZ3-W5-Q{i}" for i in range(1,15)]; assert all(i in qs and qs[i]["topic"]=="ui-ux" and "mockup" in qs[i] for i in ids); assert "mockup" not in qs["UIUX-Q1"]; print(f"validated {len(ids)} UI/UX mockups")'
```

Expected: `validated 26 UI/UX mockups`.

## Task 6: Add Content and Regression Tests

**Files:**
- Modify: `src/content/content-files.test.ts`
- Test: `src/features/practice/PracticeQuestionMockupCard.test.tsx`
- Test: `src/features/mock-exams/ExamQuestionMockup.test.tsx`

- [ ] **Step 1: Add content assertions**

In `content-files.test.ts`, assert that all 26 approved candidate IDs contain a mockup with non-empty `html` and `caption`, that viewport is absent or `desktop`/`mobile`, and that `UIUX-Q1` has no mockup.

- [ ] **Step 2: Run all focused regression tests**

Run:

```bash
npx vitest run src/content/content-files.test.ts src/components/HtmlMockupPreview.test.tsx src/features/practice/PracticeQuestionMockupCard.test.tsx src/features/practice/QuestionCard.test.tsx src/features/practice/QuestionBankCard.test.tsx src/features/mock-exams/ExamQuestionMockup.test.tsx
```

Expected: all listed test files pass; exam file selection and code-panel tests remain green.

- [ ] **Step 3: Run repository-wide verification**

Run: `npx tsc --noEmit`

Expected: exit code 0.

Run: `npx vitest run`

Expected: all test files and tests pass.

## Completion Checklist

- [ ] Only the approved 26 UI/UX questions gain practice mockups; `UIUX-Q1` remains text-only.
- [ ] Mockups render on question details and do not render on question-bank cards or rows.
- [ ] Every mockup is static, captioned, and uses the shared `.exam-ui-*` styling language.
- [ ] No raster image assets or interactive business logic are added.
- [ ] Existing mock exam HTML, file tabs, and code panels continue to pass their tests.
- [ ] TypeScript and the complete Vitest suite pass.
