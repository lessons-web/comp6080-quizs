'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { ROLE_LABELS } from '@/lib/auth/types'
import { ChangePasswordModal } from '@/components/ChangePasswordModal'

const navItems = [
  { label: '知识点解析', href: '/knowledge', requiresAuth: false },
  { label: '题库中心', href: '/practice', requiresAuth: true, guestNote: '仅前 10 题预览' },
  { label: '模拟真题', href: '/exams', requiresAuth: true, guestNote: '仅开放 2 套' },
]

function navClassName(isActive: boolean) {
  return [
    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
  ].join(' ')
}

function initials(email: string) {
  const name = email.split('@')[0]
  return name.slice(0, 2).toUpperCase()
}

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const [openDropdown, setOpenDropdown] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openDropdown) return
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpenDropdown(false)
      }
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', esc)
    }
  }, [openDropdown])

  const handleLogout = async () => {
    setOpenDropdown(false)
    await logout()
    router.push('/login')
    router.refresh()
  }

  const openChangePasswordModal = () => {
    setOpenDropdown(false)
    setOpenChangePassword(true)
  }

  const isNavActive = (href: string) => {
    if (href === '/knowledge') return pathname?.startsWith('/knowledge')
    if (href === '/practice') return pathname?.startsWith('/practice')
    if (href === '/exams') return pathname?.startsWith('/exams')
    return false
  }

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur shrink-0">
      <div className="mx-auto flex h-[72px] w-full items-center justify-between gap-6 px-8">
        <Link href="/knowledge" className="flex items-center gap-3 shrink-0">
          <img src="/favicon.svg" alt="COMP6080 Quiz Hub" className="h-12 w-12" />
          <span className="text-2xl font-semibold uppercase tracking-[0.1em] text-blue-600">
            COMP6080 Quiz Hub
          </span>
        </Link>

        <nav aria-label="模块导航" className="flex flex-wrap items-center justify-center gap-2">
          {navItems.map((item) => {
            const isGuest = !user || user.role === 'guest'
            const showLock = item.requiresAuth && isGuest
            const active = isNavActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={navClassName(active)}
                title={showLock && item.guestNote ? `访客模式 · ${item.guestNote}` : undefined}
              >
                <span>{item.label}</span>
                {showLock ? (
                  <span
                    className={[
                      'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      active
                        ? 'bg-white/15 text-white ring-1 ring-white/20'
                        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
                    ].join(' ')}
                  >
                    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                      <path fill="currentColor" d="M8.5 4.5V4a2.5 2.5 0 0 0-5 0v.5H2.5A1.5 1.5 0 0 0 1 6v3.5A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 10.5 9.5V6A1.5 1.5 0 0 0 9 4.5h-.5Zm-4 0V4a1.5 1.5 0 0 1 3 0v.5h-3ZM6 9A1 1 0 1 1 6 7a1 1 0 0 1 0 2Z" />
                    </svg>
                    {item.guestNote}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          {user && user.role === 'admin' && (
            <Link
              href="/admin"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 transition"
            >
              管理后台
            </Link>
          )}

          <button
            type="button"
            aria-label="消息提醒"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>

          <span aria-hidden className="h-8 w-px bg-slate-200" />

          {user ? (
            <div className="relative" ref={wrapperRef}>
              <button
                type="button"
                onClick={() => setOpenDropdown((v) => !v)}
                className="group flex items-center gap-3 rounded-full hover:bg-slate-50 transition px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-haspopup="menu"
                aria-expanded={openDropdown}
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-5 text-slate-800">
                    {user.email.split('@')[0]}
                  </p>
                  <p className="text-xs leading-4 text-slate-500">
                    {ROLE_LABELS[user.role]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-base font-semibold text-white shadow-sm ring-2 ring-white group-hover:ring-slate-100 transition"
                  >
                    {initials(user.email)}
                  </span>
                  <svg className="h-4 w-4 text-slate-400 transition group-hover:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {openDropdown && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-52 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none z-40"
                >
                  <div className="mb-1 flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 sm:hidden">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white"
                    >
                      {initials(user.email)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {user.email.split('@')[0]}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {ROLE_LABELS[user.role]}
                      </p>
                    </div>
                  </div>
                  <div className="my-1 h-px bg-slate-100" />
                  <button
                    role="menuitem"
                    type="button"
                    onClick={openChangePasswordModal}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    修改密码
                  </button>
                  <div className="my-1 h-px bg-slate-100" />
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              登录
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
      </div>
      <ChangePasswordModal open={openChangePassword} onClose={() => setOpenChangePassword(false)} />
    </header>
  )
}
