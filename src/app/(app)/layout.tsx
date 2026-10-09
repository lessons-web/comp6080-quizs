import { Suspense } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { AppFooter } from '@/components/AppFooter'

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
      <Suspense fallback={<div className="h-[72px] bg-white/90 border-b border-slate-200" />}>
        <AppHeader />
      </Suspense>
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 w-full flex-1 overflow-hidden">
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}
