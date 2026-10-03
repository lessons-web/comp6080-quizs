import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { RouteErrorBoundary } from '../components/RouteErrorBoundary'
import { PageLoading } from '../components/PageLoading'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <RouteErrorBoundary>
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
