import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export type UserRole = 'admin' | 'student' | 'guest'

export interface SessionUser {
  id: string
  email: string
  role: UserRole
}

const SESSION_COOKIE = 'session'
const SECRET_KEY = process.env.AUTH_SECRET || 'default-dev-secret-change-in-production-min-32chars'

const encoder = new TextEncoder()
const secretKey = encoder.encode(SECRET_KEY)

export const DEV_ADMIN_USER: SessionUser = {
  id: 'dev-local-admin-00000000-0000-0000-0000-000000000001',
  email: 'dev@local.host',
  role: 'admin',
}

export function isLocalDevBypass(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.AUTH_FORCE !== '1'
}

export async function createSession(userId: string, email: string, role: UserRole) {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    if (isLocalDevBypass()) {
      return DEV_ADMIN_USER
    }
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const verified = await jwtVerify(token, secretKey)
    const payload = verified.payload as { userId: string; email: string; role: UserRole }

    return {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    }
  } catch {
    if (isLocalDevBypass()) return DEV_ADMIN_USER
    return null
  }
}
