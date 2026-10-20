import { Suspense } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { AppFooter } from '@/components/AppFooter'
import { GuestNoticeFloating } from '@/components/GuestNotice'

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--paper-bg)] text-slate-900">
      <Suspense fallback={<div className="h-[72px] border-b border-[var(--paper-border)] bg-[color:rgba(255,253,250,0.92)]" />}>
        <AppHeader />
      </Suspense>
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 w-full flex-1 overflow-hidden">
          {children}
        </div>
      </main>
      <AppFooter />
      <GuestNoticeFloating />
    </div>
  )
}
