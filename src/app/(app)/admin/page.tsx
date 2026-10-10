'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import type { PublicUser, UserRole } from '@/lib/auth/types'
import { ROLE_LABELS, ROLE_OPTIONS } from '@/lib/auth/types'

export default function AdminPage() {
  const { user, loading: authLoading, changePassword } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSuccess, setCreateSuccess] = useState<string | null>(null)
  const [createSubmitting, setCreateSubmitting] = useState(false)

  const [users, setUsers] = useState<PublicUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  const [resetUserId, setResetUserId] = useState<string | null>(null)
  const [resetUserEmail, setResetUserEmail] = useState('')
  const [resetNewPassword, setResetNewPassword] = useState('')
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetSuccess, setResetSuccess] = useState<string | null>(null)
  const [resetSubmitting, setResetSubmitting] = useState(false)

  const [actionSubmitting, setActionSubmitting] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [deleteUserEmail, setDeleteUserEmail] = useState('')
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  async function loadUsers() {
    if (!isAdmin) return
    setUsersLoading(true)
    setUsersError(null)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (!res.ok) {
        setUsersError(data.error || '获取用户列表失败')
      } else {
        setUsers(data.users || [])
      }
    } catch {
      setUsersError('网络错误，请稍后重试')
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setCreateError('请输入邮箱和密码')
      return
    }
    if (password.length < 6) {
      setCreateError('密码长度至少为 6 位')
      return
    }
    setCreateSubmitting(true)
    setCreateError(null)
    setCreateSuccess(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      const data = await res.json()
      setCreateSubmitting(false)
      if (!res.ok) {
        setCreateError(data.error || '创建用户失败')
      } else {
        setCreateSuccess('用户创建成功')
        setEmail('')
        setPassword('')
        setRole('student')
        loadUsers()
        setTimeout(() => setCreateSuccess(null), 2500)
      }
    } catch {
      setCreateSubmitting(false)
      setCreateError('网络错误，请稍后重试')
    }
  }

  function openResetModal(u: PublicUser) {
    setResetUserId(u.id)
    setResetUserEmail(u.email)
    setResetNewPassword('')
    setResetConfirmPassword('')
    setResetError(null)
    setResetSuccess(null)
  }

  function closeResetModal() {
    setResetUserId(null)
    setResetUserEmail('')
    setResetNewPassword('')
    setResetConfirmPassword('')
    setResetError(null)
    setResetSuccess(null)
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!resetNewPassword || !resetConfirmPassword) {
      setResetError('请输入新密码和确认密码')
      return
    }
    if (resetNewPassword.length < 6) {
      setResetError('新密码长度至少为 6 位')
      return
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('两次输入的密码不一致')
      return
    }
    setResetSubmitting(true)
    setResetError(null)
    setResetSuccess(null)
    const result = await changePassword('', resetNewPassword, resetUserId || undefined)
    setResetSubmitting(false)
    if (result.success) {
      setResetSuccess('密码重置成功')
      setTimeout(() => closeResetModal(), 1000)
    } else {
      setResetError(result.error || '重置密码失败')
    }
  }

  async function handleToggleDisabled(u: PublicUser) {
    setActionSubmitting(u.id)
    setActionError(null)
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: !u.disabled }),
      })
      const data = await res.json()
      if (!res.ok) {
        setActionError(data.error || '操作失败')
      } else {
        loadUsers()
      }
    } catch {
      setActionError('网络错误，请稍后重试')
    } finally {
      setActionSubmitting(null)
    }
  }

  function openDeleteModal(u: PublicUser) {
    setDeleteUserId(u.id)
    setDeleteUserEmail(u.email)
  }

  function closeDeleteModal() {
    setDeleteUserId(null)
    setDeleteUserEmail('')
    setDeleteSubmitting(false)
  }

  async function handleDelete() {
    if (!deleteUserId) return
    setDeleteSubmitting(true)
    try {
      const res = await fetch(`/api/admin/users/${deleteUserId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        setActionError(data.error || '删除失败')
      } else {
        closeDeleteModal()
        loadUsers()
      }
    } catch {
      setActionError('网络错误，请稍后重试')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  function formatDate(d: string) {
    try {
      return new Date(d).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return d
    }
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-8 py-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">管理员后台</h1>
            <p className="mt-1 text-sm text-slate-500">用户管理、创建账号、重置学员密码</p>
          </div>
        </div>

        {isAdmin && !authLoading && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit xl:sticky xl:top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">创建新用户</h2>
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    disabled={createSubmitting}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    初始密码
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 6 位"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    autoComplete="new-password"
                    disabled={createSubmitting}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    角色
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    disabled={createSubmitting}
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {createError && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
                    {createError}
                  </div>
                )}
                {createSuccess && (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 border border-green-100">
                    {createSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      创建中...
                    </>
                  ) : (
                    '创建用户'
                  )}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">用户列表</h2>
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="h-6 w-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : usersError ? (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
                  {usersError}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-500">
                  暂无用户数据
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {actionError && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
                      {actionError}
                    </div>
                  )}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">邮箱</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">角色</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">状态</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">创建时间</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-700">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className={`border-b border-slate-100 hover:bg-slate-50 ${u.disabled ? 'opacity-60' : ''}`}>
                          <td className="py-3 px-4 text-slate-900">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : u.role === 'student'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ROLE_LABELS[u.role]}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              u.disabled
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {u.disabled ? '已禁用' : '正常'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{formatDate(u.created_at)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2 justify-end flex-wrap">
                              <button
                                type="button"
                                onClick={() => openResetModal(u)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
                                disabled={actionSubmitting === u.id}
                              >
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                重置密码
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleDisabled(u)}
                                className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                                  u.disabled
                                    ? 'border-green-200 bg-white text-green-700 hover:bg-green-50 hover:border-green-300'
                                    : 'border-amber-200 bg-white text-amber-700 hover:bg-amber-50 hover:border-amber-300'
                                }`}
                                disabled={actionSubmitting === u.id}
                              >
                                {actionSubmitting === u.id ? (
                                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                ) : (
                                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {u.disabled ? (
                                      <>
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                      </>
                                    ) : (
                                      <>
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                      </>
                                    )}
                                  </svg>
                                )}
                                {u.disabled ? '启用' : '禁用'}
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(u)}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                                disabled={actionSubmitting === u.id}
                              >
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                </svg>
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {!isAdmin && !authLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <svg className="h-6 w-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">权限不足</h3>
            <p className="text-sm text-slate-500">仅管理员可访问用户管理功能</p>
          </div>
        )}

        {authLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm flex items-center justify-center">
            <svg className="h-6 w-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {resetUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">重置用户密码</h3>
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  disabled={resetSubmitting}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 rounded-lg bg-slate-50 p-3 text-sm">
                <span className="text-slate-500">目标用户：</span>
                <span className="font-medium text-slate-900">{resetUserEmail}</span>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    新密码
                  </label>
                  <input
                    type="password"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="至少 6 位"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    autoComplete="new-password"
                    disabled={resetSubmitting}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    placeholder="再次输入新密码"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    autoComplete="new-password"
                    disabled={resetSubmitting}
                  />
                </div>

                {resetError && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
                    {resetError}
                  </div>
                )}
                {resetSuccess && (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 border border-green-100">
                    {resetSuccess}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeResetModal}
                    disabled={resetSubmitting}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={resetSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetSubmitting ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        重置中...
                      </>
                    ) : (
                      '确认重置'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">确认删除用户</h3>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  disabled={deleteSubmitting}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-100">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-red-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">此操作不可撤销</p>
                    <p className="mt-1 text-sm text-red-700">
                      确定要删除用户 <span className="font-semibold">{deleteUserEmail}</span> 吗？删除后该用户的数据将永久丢失。
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteSubmitting}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      删除中...
                    </>
                  ) : (
                    '确认删除'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
