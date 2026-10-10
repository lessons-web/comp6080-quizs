import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const SESSION_COOKIE = 'session'
const SECRET_KEY = process.env.AUTH_SECRET || 'default-dev-secret-change-in-production-min-32chars'
const encoder = new TextEncoder()
const secretKey = encoder.encode(SECRET_KEY)

function isPublicPath(pathname: string): boolean {
  if (pathname === '/' || pathname.startsWith('/knowledge')) return true
  if (pathname.startsWith('/api/auth/')) return true
  if (pathname === '/api/setup') return true
  if (pathname === '/login') return true
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) return true
  return false
}

function isGuestRestricted(pathname: string): boolean {
  return pathname.startsWith('/admin')
}

function isGuestAllowedPath(pathname: string): boolean {
  return pathname.startsWith('/practice') || pathname.startsWith('/exams')
}

const isLocalDev = process.env.NODE_ENV === 'development' && process.env.AUTH_FORCE !== '1'

async function issueDevAdminToken(): Promise<string> {
  return new SignJWT({
    userId: 'dev-local-admin-00000000-0000-0000-0000-000000000001',
    email: 'dev@local.host',
    role: 'admin',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    if (isLocalDev && pathname === '/login') {
      const hasRedirect = request.nextUrl.searchParams.has('redirect')
      if (!hasRedirect) {
        const url = request.nextUrl.clone()
        url.pathname = '/knowledge'
        return NextResponse.redirect(url)
      }
    }
    return NextResponse.next()
  }

  let token = request.cookies.get(SESSION_COOKIE)?.value

  if (isLocalDev && !token) {
    const devToken = await issueDevAdminToken()
    const response = NextResponse.next()
    response.cookies.set(SESSION_COOKIE, devToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  }

  if (!token) {
    if (isGuestAllowedPath(pathname)) {
      return NextResponse.next()
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const verified = await jwtVerify(token, secretKey)
    const payload = verified.payload as { userId: string; email: string; role: string }

    if (payload.role === 'guest' && isGuestRestricted(pathname)) {
      const forbiddenUrl = new URL('/knowledge', request.url)
      forbiddenUrl.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(forbiddenUrl)
    }

    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      const forbiddenUrl = new URL('/knowledge', request.url)
      forbiddenUrl.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(forbiddenUrl)
    }

    return NextResponse.next()
  } catch {
    if (isLocalDev) {
      const devToken = await issueDevAdminToken()
      const response = NextResponse.next()
      response.cookies.set(SESSION_COOKIE, devToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      return response
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(SESSION_COOKIE)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
