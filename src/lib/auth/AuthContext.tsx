'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { UserRole } from '@/lib/auth/types'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  changePassword: (
    currentPassword: string,
    newPassword: string,
    userId?: string,
  ) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      setUser(data.user || null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || '登录失败' }
      }
      setUser(data.user)
      return { success: true }
    } catch {
      return { success: false, error: '网络错误，请稍后重试' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    setUser(null)
  }, [])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string, userId?: string) => {
      try {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            userId,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          return { success: false, error: data.error || '修改失败' }
        }
        return { success: true }
      } catch {
        return { success: false, error: '网络错误，请稍后重试' }
      }
    },
    [],
  )

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
