'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'

function QRCodePlaceholder() {
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
    <div className="relative rounded-xl bg-white p-1.5 shadow-inner ring-1 ring-slate-200">
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: 'repeat(21, minmax(0, 1fr))', width: 112, height: 112 }}
      >
        {cells.map(({ i, filled }) => (
          <div key={i} className={filled ? 'bg-slate-900' : 'bg-white'} />
        ))}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const redirect = searchParams.get('redirect') || '/knowledge'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('请输入邮箱和密码')
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await login(email, password)
    setSubmitting(false)
    if (result.success) {
      router.push(redirect)
      router.refresh()
    } else {
      setError(result.error || '登录失败')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                  <img
                    src="/favicon.svg"
                    alt="COMP6080 Quiz Hub"
                    className="h-10 w-10"
                  />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">COMP6080 Quiz Hub</h1>
                <p className="mt-2 text-sm text-slate-500">登录账号以继续使用系统</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      邮箱地址
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      密码
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      autoComplete="current-password"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        登录中...
                      </>
                    ) : (
                      '登录'
                    )}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-sm text-slate-500">
                访客可直接浏览{' '}
                <Link href="/knowledge" className="font-medium text-blue-600 hover:text-blue-700">
                  知识点解析
                </Link>
                ，或预览{' '}
                <Link href="/practice" className="font-medium text-blue-600 hover:text-blue-700">
                  题库中心
                </Link>
                {' / '}
                <Link href="/exams" className="font-medium text-blue-600 hover:text-blue-700">
                  模拟真题
                </Link>
                {' '}前 10 题
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center">
            <div className="w-full rounded-3xl border border-blue-200 bg-white shadow-lg shadow-blue-500/10 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 text-white">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
                    <path fill="currentColor" d="M11 6V5a3 3 0 0 0-6 0v1H3.5A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h9A1.5 1.5 0 0 0 14 12.5v-5A1.5 1.5 0 0 0 12.5 6H11Zm-5-1a2 2 0 1 1 4 0v1H6V5Zm2 8.5A1.5 1.5 0 1 1 8 10.5a1.5 1.5 0 0 1 0 3Z" />
                  </svg>
                  访客预览模式
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  登录解锁完整题库与真题
                </h3>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  当前访客身份仅可预览前 10 道题目，登录后可查看全部题库、完整真题试卷及错题复盘等学习功能。
                </p>
              </div>
              <div className="space-y-4 p-6">
                <ul className="space-y-3 text-sm text-slate-700">
                  {(() => {
                    const items = [
                      { title: '完整题库中心', desc: '数百道题按领域 / 难度 / 周次多维筛选', locked: true },
                      { title: '历年模拟真题', desc: '整卷练习，训练考试节奏', locked: true },
                      { title: '答案与深度解析', desc: '关联知识点，一题多练', locked: false },
                      { title: '个人错题本（即将上线）', desc: '记录薄弱点，针对性复盘', locked: true },
                    ]
                    const list = []
                    for (let index = 0; index < items.length; index++) {
                      const item = items[index]
                      list.push(
                        <li key={item.title} className="flex items-start gap-2.5">
                          <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                              <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.5 6.5l2.5 2.5 4.5-5" />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-slate-900">{item.title}</span>
                              {item.locked ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                                  <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5">
                                    <path fill="currentColor" d="M8.5 4.5V4a2.5 2.5 0 0 0-5 0v.5H2.5A1.5 1.5 0 0 0 1 6v3.5A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 10.5 9.5V6A1.5 1.5 0 0 0 9 4.5h-.5Zm-4 0V4a1.5 1.5 0 0 1 3 0v.5h-3ZM6 9A1 1 0 1 1 6 7a1 1 0 0 1 0 2Z" />
                                  </svg>
                                  登录后解锁
                                </span>
                              ) : null}
                            </div>
                            <p className="text-[12px] text-slate-500">{item.desc}</p>
                          </div>
                        </li>,
                      )
                    }
                    return list
                  })()}
                </ul>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    或扫码咨询
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <QRCodePlaceholder />
                    <div className="flex-1 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">联系老师</p>
                      <p className="mt-1 text-[12px] leading-5 text-slate-500">
                        扫码开通完整学习权限，获取更多学习资料与答疑服务。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
