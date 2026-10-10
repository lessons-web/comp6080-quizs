'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'

export function useIsGuest() {
  const { user, loading } = useAuth()
  if (loading) return false
  return !user || user.role === 'guest'
}

const GUEST_LIMIT = 10

export const GUEST_OPENED_EXAM_IDS: readonly string[] = [
  'MOCK-EXAM-1',
  '2026T3-QUIZ1',
]

export function isExamAllowedForGuest(examId: string): boolean {
  return GUEST_OPENED_EXAM_IDS.includes(examId)
}

export function useGuestLimit<T>(items: T[]): { list: T[]; isGuest: boolean; hiddenCount: number } {
  const isGuest = useIsGuest()
  if (isGuest && items.length > GUEST_LIMIT) {
    return {
      list: items.slice(0, GUEST_LIMIT),
      isGuest: true,
      hiddenCount: items.length - GUEST_LIMIT,
    }
  }
  return { list: items, isGuest, hiddenCount: 0 }
}

function QRCodePlaceholder({ size = 128 }: { size?: number }) {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21
    const y = Math.floor(i / 21)
    const isCorner =
      (x < 7 && y < 7) ||
      (x >= 14 && y < 7) ||
      (x < 7 && y >= 14)
    const filled = isCorner
      ? !((x === 3 && y === 3) || (x === 17 && y === 3) || (x === 3 && y === 17))
      : (x * 7 + y * 13) % 3 === 0
    return { i, filled }
  })
  return (
    <div className="relative rounded-2xl bg-white p-2 shadow-md ring-1 ring-white/30">
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: 'repeat(21, minmax(0, 1fr))',
          width: size,
          height: size,
        }}
      >
        {cells.map(({ i, filled }) => (
          <div key={i} className={filled ? 'bg-slate-900' : 'bg-white'} />
        ))}
      </div>
    </div>
  )
}

export function GuestNoticeFloating() {
  const isGuest = useIsGuest()
  const pathname = usePathname()

  if (!isGuest) return null
  if (pathname === '/login') return null
  if (!pathname.startsWith('/practice') && !pathname.startsWith('/exams')) return null

  const loginHref = `/login${pathname ? `?redirect=${encodeURIComponent(pathname)}` : ''}`

  return (
    <div className="pointer-events-none fixed bottom-[80px] right-[30px] z-40">
      <style>{`
        @keyframes guest-notice-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes guest-notice-pulse-shadow {
          0%, 100% {
            box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
          }
          50% {
            box-shadow: 0 25px 60px -12px rgba(59, 130, 246, 0.38);
          }
        }
        .guest-notice-card {
          animation:
            guest-notice-float 1.5s ease-in-out infinite,
            guest-notice-pulse-shadow 2.5s ease-in-out infinite;
        }
      `}</style>
      <div className="pointer-events-auto guest-notice-card w-[260px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-blue-600 via-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/30">
        <div className="relative flex flex-col items-center gap-3 px-5 pt-5 pb-4">
          <div aria-hidden="true" className="absolute -top-12 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-indigo-400/20 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-10 -right-6 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative flex w-full items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-5 items-center rounded-full bg-white/20 px-2 text-[10px] font-semibold text-white ring-1 ring-white/25">
                🔒 访客预览
              </span>
            </div>
            <span className="text-[10px] font-medium text-blue-100">
              体验版
            </span>
          </div>

          <div className="relative text-center w-full">
            <h3 className="text-[15px] font-semibold tracking-tight leading-snug">
              扫码或登录
              <br />
              解锁完整学习内容
            </h3>
            <p className="mt-1.5 text-[12px] leading-5 text-blue-100">
              题库仅预览前 {GUEST_LIMIT} 题 · 真题仅开放 {GUEST_OPENED_EXAM_IDS.length} 套
            </p>
          </div>

          <div className="relative">
            <QRCodePlaceholder size={132} />
            <div className="mt-2 text-center text-[11px] text-blue-100">
              扫码咨询老师
            </div>
          </div>

          <div className="relative w-full space-y-2 pt-1">
            <Link
              href={loginHref}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-blue-700 shadow-md transition hover:bg-blue-50 active:scale-[0.98]"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                <path fill="currentColor" d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM3 17a7 7 0 0 1 14 0v1H3v-1Z" />
              </svg>
              立即登录
            </Link>
            <Link
              href="/knowledge"
              className="flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-[12px] font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              去知识点解析（无限制）
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GuestNoticeLockBanner(_props: { hiddenCount?: number }) {
  return null
}

export function GuestNoticeInline() {
  const isGuest = useIsGuest()
  if (!isGuest) return null
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
        <path fill="currentColor" d="M11 6V5a3 3 0 0 0-6 0v1H3.5A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h9A1.5 1.5 0 0 0 14 12.5v-5A1.5 1.5 0 0 0 12.5 6H11Zm-5-1a2 2 0 1 1 4 0v1H6V5Zm2 8.5A1.5 1.5 0 1 1 8 10.5a1.5 1.5 0 0 1 0 3Z" />
      </svg>
      访客预览
    </div>
  )
}
