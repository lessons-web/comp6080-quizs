import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { RouteErrorBoundary } from '../components/RouteErrorBoundary'
import { PageLoading } from '../components/PageLoading'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export function AppShell() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
      <Header />
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 w-full flex-1 overflow-hidden">
          <RouteErrorBoundary>
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </RouteErrorBoundary>
        </div>
      </main>
      <Footer />
    </div>
  )
}
