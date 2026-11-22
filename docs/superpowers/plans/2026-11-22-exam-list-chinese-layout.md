# 试卷列表中文与列宽 Implementation Plan

> **For agentic workers:** Execute this plan inline in the current session. Keep the changes limited to the exam list component and its tests.

**Goal:** Show Chinese exam titles and descriptions by default and rebalance the exam table so right-side columns remain readable.

**Architecture:** Keep exam data and category/sort behavior unchanged. Resolve display text from the Chinese field first with the existing English field as fallback, and define fixed table column widths with a minimum table width so narrow screens scroll instead of squeezing cells.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library.

---

### Task 1: Lock the display and table layout behavior with tests

**Files:**
- Modify: `src/features/mock-exams/MockExamsPage.test.tsx`
- Test: `src/features/mock-exams/MockExamsPage.test.tsx`

- [x] Give the three existing mock exams `titleZh` and `descriptionZh`; add one exam without Chinese fields to cover English fallback.
- [x] Assert the Chinese title and description render in the default table, the fallback exam still renders its English fields, and date-descending order and category filtering remain intact.
- [x] Assert the table uses fixed layout with widths `40%`, `25%`, `15%`, `9%`, `11%`, has a minimum width, and keeps the action button on one line.
- [x] Run `npx vitest run src/features/mock-exams/MockExamsPage.test.tsx`; verify the new localization/layout assertions fail before implementation.

### Task 2: Implement localized display and balanced responsive columns

**Files:**
- Modify: `src/features/mock-exams/MockExamsPage.tsx`

- [x] In both card and table layouts, render `titleZh || title` and `descriptionZh || description`.
- [x] Wrap the table in a horizontally scrollable rounded container; set `min-w-[1120px]`, `table-fixed`, and a `<colgroup>` with widths `40%`, `25%`, `15%`, `9%`, and `11%`.
- [x] Reduce table cell horizontal padding to `px-4` and apply `whitespace-nowrap` to the action button.
- [x] Run the focused component test and verify it passes.

### Task 3: Verify regressions and types

**Files:**
- Verify: `src/features/mock-exams/MockExamsPage.tsx`
- Verify: `src/features/mock-exams/MockExamsPage.test.tsx`

- [x] Run `npx vitest run src/features/mock-exams/MockExamsPage.test.tsx src/content/content-files.test.ts`.
- [x] Run `npx tsc --noEmit`.
- [x] Confirm existing category filtering, guest locking, and chronological sorting are unchanged.
