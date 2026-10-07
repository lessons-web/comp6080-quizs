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
const QuestionDetailPage = lazy(() =>
  import('../features/practice/QuestionDetailPage').then((m) => ({
    default: m.QuestionDetailPage,
  })),
)
const MockExamsPage = lazy(() =>
  import('../features/mock-exams/MockExamsPage').then((m) => ({
    default: m.MockExamsPage,
  })),
)
const MockExamDetailPage = lazy(() =>
  import('../features/mock-exams/MockExamDetailPage').then((m) => ({
    default: m.MockExamDetailPage,
  })),
)

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/knowledge" replace /> },
      { path: 'knowledge/*', element: <KnowledgePage /> },
      {
        path: 'practice/week-:weekN',
        element: <Navigate to="/practice" replace />,
      },
      { path: 'practice/question/:questionId', element: <QuestionDetailPage /> },
      { path: 'practice', element: <PracticePage /> },
      {
        path: 'practice/*',
        element: <Navigate to="/practice" replace />,
      },
      { path: 'mock-exams/:id', element: <MockExamDetailPage /> },
      { path: 'mock-exams', element: <MockExamsPage /> },
      { path: 'mock-exams/*', element: <Navigate to="/mock-exams" replace /> },
      { path: '*', element: <Navigate to="/knowledge" replace /> },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
