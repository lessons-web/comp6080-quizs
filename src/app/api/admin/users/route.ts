import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { createUser, findUserByEmail, listAllUsers } from '@/lib/auth/db'
import type { UserRole } from '@/lib/auth/types'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足，需要管理员身份' },
        { status: 403 },
      )
    }

    const users = await listAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('List users error:', error)
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足，需要管理员身份' },
        { status: 403 },
      )
    }

    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为 6 位' },
        { status: 400 },
      )
    }

    const validRoles: UserRole[] = ['admin', 'student', 'guest']
    const safeRole: UserRole = validRoles.includes(role) ? role : 'student'

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 },
      )
    }

    const newUser = await createUser(email, password, safeRole)
    return NextResponse.json({ success: true, user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: '创建用户失败，请稍后重试' },
      { status: 500 },
    )
  }
}
