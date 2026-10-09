import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/auth/db'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 },
      )
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 },
      )
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 },
      )
    }

    await createSession(user.id, user.email, user.role)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 },
    )
  }
}
