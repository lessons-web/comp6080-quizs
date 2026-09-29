# Task 1 Runnable Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Tailwind, MDX imports, and Vitest runnable in the existing Vite React TypeScript app with the smallest working surface area.

**Architecture:** Keep the existing Vite app structure and add only the missing integration points: Vite plugins for React and MDX, a Tailwind entry stylesheet, Vitest test configuration, and one MDX-backed render path in `App.tsx`. Validate the work with one smoke test that proves the app can render an imported MDX component.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS 4, MDX 3, Vitest, Testing Library

---

### Task 1: Add a failing smoke test first

**Files:**
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the starter MDX content', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 2, name: /task 1 smoke test/i }),
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx --environment jsdom`
Expected: FAIL because `App` does not render any MDX-backed heading yet.

### Task 2: Add the missing integration points

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Modify: `src/index.css`
- Modify: `src/App.tsx`
- Create: `src/content/task-1-smoke.mdx`
- Create: `src/mdx.d.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Install missing Vite integration packages**

```bash
npm install -D @mdx-js/rollup @tailwindcss/vite
```

- [ ] **Step 2: Add Vite plugins and Vitest configuration**

```ts
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [mdx(), react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 3: Add minimal MDX content and type declaration**

```mdx
## Task 1 Smoke Test

MDX imports are working.
```

```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const MDXComponent: ComponentType
  export default MDXComponent
}
```

- [ ] **Step 4: Render the imported MDX component in `App.tsx` and add Tailwind entry CSS**

```tsx
import Task1SmokeContent from './content/task-1-smoke.mdx'

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
          Quiz Hub
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Task 1 foundations
        </h1>
        <div className="prose mt-6 max-w-none">
          <Task1SmokeContent />
        </div>
      </section>
    </main>
  )
}
```

```css
@import "tailwindcss";
```

### Task 3: Verify and keep the changes green

**Files:**
- Test: `src/App.test.tsx`

- [ ] **Step 1: Run the targeted smoke test**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS

- [ ] **Step 2: Run the full requested verification commands**

Run: `npm run build`
Expected: PASS and emit a production bundle

Run: `npx vitest run`
Expected: PASS with the smoke test

Run: `npm exec tsc -b --pretty false`
Expected: PASS
