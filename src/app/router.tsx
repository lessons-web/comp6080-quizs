import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppShell } from './AppShell'

const KnowledgePage = lazy(() =>
  import('../features/knowledge/KnowledgePage').then((m) => ({
    default: m.KnowledgePage,
  })),
)
const PracticePage = lazy(() =>
  import('../features/practice/PracticePage').then((m) => ({
    default: m.PracticePage,
  })),
)
const MockExamsPage = lazy(() =>
  import('../features/mock-exams/MockExamsPage').then((m) => ({
    default: m.MockExamsPage,
  })),
)

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/knowledge" replace /> },
      { path: 'knowledge/*', element: <KnowledgePage /> },
      { path: 'practice/*', element: <PracticePage /> },
      { path: 'mock-exams/*', element: <MockExamsPage /> },
      { path: '*', element: <Navigate to="/knowledge" replace /> },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
