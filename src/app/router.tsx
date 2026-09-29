import type { RouteObject } from 'react-router-dom'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from './AppShell'
import { KnowledgePage } from '../features/knowledge/KnowledgePage'
import { MockExamsPage } from '../features/mock-exams/MockExamsPage'
import { PracticePage } from '../features/practice/PracticePage'

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
        element: <KnowledgePage />,
      },
      {
        path: 'practice/:week',
        element: <PracticePage />,
      },
      {
        path: 'mock-exams/:week',
        element: <MockExamsPage />,
      },
    ],
  },
]

export function createAppRouter() {
  return createBrowserRouter(appRoutes)
}

export const router = createAppRouter()
