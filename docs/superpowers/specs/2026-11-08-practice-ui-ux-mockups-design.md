# Practice UI/UX HTML Mockup Design

## Status

Approved. Implementation has been completed according to this design.

## Context

The practice bank currently renders question text and code blocks in `QuestionCard`. Its detail page keeps the answer collapsed until the learner chooses to reveal it. Practice questions do not currently have a mockup field.

Mock exam questions already support static HTML mockups through `ExamQuestionMockup`. That component also owns exam-specific supporting-file selection and code panels, so using it unchanged for practice questions would require irrelevant file entries and couple the practice bank to exam presentation.

UI/UX questions often describe a visible interface state. A compact static mockup can make layout, hierarchy, labels, feedback, and accessibility evidence easier to inspect before answering.

## Goals

- Add optional HTML mockups to practice questions without changing existing question data.
- Show mockups on the question detail page, between the prompt and the answer control.
- Keep practice list cards compact and unchanged.
- Reuse the existing `.exam-ui-*` visual language and lightweight static HTML approach.
- Add mockups only where visual evidence improves the reasoning task.
- Keep mockups static; they are evidence, not interactive demos.

## Non-Goals

- Do not redesign the practice list, answer panel, or mock exam layout.
- Do not add image assets or build live interactions in mockups.
- Do not add mockups to every UI/UX question regardless of usefulness.
- Do not move or reclassify questions as part of this change.

## Approaches Considered

1. **Reuse `ExamQuestionMockup` directly.** This has the least implementation work, but practice questions would need exam-only supporting files and inherit an unnecessary code-panel interaction.
2. **Create a practice-only preview renderer.** This keeps practice simple, but duplicates HTML preview behavior and risks visual drift between practice and exams.
3. **Extract a small shared HTML preview primitive (recommended).** Practice uses a compact card with HTML, viewport, and caption; the exam component keeps its supporting-files/code-panel behavior while delegating its HTML preview to the shared primitive.

The third approach shares only the presentation behavior that is common, leaving exam-specific controls in the exam component.

## Data Model

Add an optional `mockup` field to `PracticeQuestion`:

```ts
interface PracticeQuestionMockup {
  html: string
  caption: string
  viewport?: 'desktop' | 'mobile'
}
```

`caption` is required so the visual evidence also has a concise textual description. `viewport` defaults to desktop. Existing questions remain valid without a `mockup` field.

## Rendering

- Add a shared `HtmlMockupPreview` primitive that displays trusted, repository-authored HTML within the existing `.exam-ui-root` style scope.
- Add a practice mockup card that provides the warm, bordered evidence surface and renders the required caption.
- Render the card in the practice question detail flow after the question text/code and before the answer control.
- Do not render the full preview or a thumbnail in `QuestionBankCard` or the table view.
- Keep the preview inert. Use non-interactive visual stand-ins for buttons and controls; do not add application behavior.
- Preserve the current exam supporting-files panel and code selection, using the shared primitive only for the HTML preview surface.
- Extend shared `.exam-ui-*` styles only with reusable patterns needed by multiple mockups. Avoid question-specific CSS selectors.

## Candidate Content

Add mockups to the following existing UI/UX questions. The final HTML should show only evidence needed to reason about the question.

| Question IDs | Visual evidence |
| --- | --- |
| `UIUX-Q2` | 12-column grid beside a 10-column alternative |
| `UIUX-Q3` | Same content shown with an overloaded type palette and a restrained type system |
| `UIUX-Q4` | HSL color swatches that make the shared-hue difference visible |
| `UIUX-Q5` | A page demonstrating size, contrast, spacing, and alignment hierarchy |
| `UIUX-Q6` | Three compact examples of explicit, pattern, and false affordance |
| `UIUX-Q7` | Empty form, enabled submit, and missing feedback state |
| `UIUX-Q8` | Disabled-empty-input constraint beside a post-delete undo message |
| `UIUX-Q9` | High cognitive-load versus restrained visual treatment |
| `QUIZ2-W5-Q1` | Empty form submit and delayed/no-feedback state |
| `QUIZ2-W5-Q5` | Buried enrolment action beside a visually prominent secondary link |
| `QUIZ2-W5-Q6` | Adjacent Save and destructive Delete actions without protection |
| `QUIZ2-W5-Q7` | Dense two-column signup form with low-actionability error placement |
| `QUIZ3-W5-Q1` | Edit/Delete/Like controls with equal weight and tight spacing |
| `QUIZ3-W5-Q2` | Blank dashboard with a low-salience create affordance |
| `QUIZ3-W5-Q3` | Pending submission with an enabled button and no status feedback |
| `QUIZ3-W5-Q4` | Placeholder-only fields before and after typing |
| `QUIZ3-W5-Q5` | Password rules hidden until submit versus visible, inline guidance |
| `QUIZ3-W5-Q6` | Low-contrast helper text on a form |
| `QUIZ3-W5-Q7` | Small, tightly spaced mobile edit/delete touch targets |
| `QUIZ3-W5-Q8` | Generic “Error 422” versus actionable field-level feedback |
| `QUIZ3-W5-Q9` | Destructive Reset visually louder than Save |
| `QUIZ3-W5-Q10` | Validation and online states conveyed by color alone |
| `QUIZ3-W5-Q11` | Nested navigation without selected state, title, or breadcrumbs |
| `QUIZ3-W5-Q12` | Ambiguous icon-only actions without labels |
| `QUIZ3-W5-Q13` | Keyboard focus before and after a visible focus indicator |
| `QUIZ3-W5-Q14` | Generic “Submit” compared with outcome-specific action labels |

`UIUX-Q1` (distinguishing UI from UX) remains text-only because a page mockup would not add evidence to the conceptual distinction.

## Accessibility and Content Safety

- Captions describe the relevant visual state in text.
- Mobile examples use a narrow viewport; desktop examples use the standard preview width.
- Captions should neutrally describe visible evidence without naming the design principle or giving away the answer. For example, describe the green/red borders and green status dot rather than stating that color is the only signal.
- Mockup HTML is static, repository-authored content and is not sourced from learners or external input.

## Testing

- Add type/content validation for the optional practice mockup shape and supported viewport values.
- Add practice component tests for rendering the caption and preview when present, and preserving current rendering when absent.
- Verify the preview does not appear in question-bank list cards.
- Keep and run exam mockup tests to ensure the supporting-files panel, file selection, and current exam appearance remain intact.
- Run `npx tsc --noEmit` and `npx vitest run`.

## Acceptance Criteria

- Existing practice questions without a mockup render as before.
- Candidate questions show a static mockup only on their detail pages.
- Practice list cards and table rows remain compact and unchanged.
- Exam mockups retain their current supporting-files/code behavior.
- Mockups use shared styles, have captions, and introduce no image assets or interactive business logic.
