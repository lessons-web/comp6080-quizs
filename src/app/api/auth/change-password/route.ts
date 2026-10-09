import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { findUserById, updateUserPassword } from '@/lib/auth/db'
import { verifyPassword } from '@/lib/auth/password'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { currentPassword, newPassword, userId } = await request.json()

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度至少为 6 位' },
        { status: 400 },
      )
    }

    const isAdmin = session.role === 'admin'

    if (isAdmin && userId) {
      const targetUser = await findUserById(userId)
      if (!targetUser) {
        return NextResponse.json(
          { error: '目标用户不存在' },
          { status: 404 },
        )
      }
      await updateUserPassword(userId, newPassword)
      return NextResponse.json({ success: true })
    }

    if (!currentPassword) {
      return NextResponse.json(
        { error: '请输入当前密码' },
        { status: 400 },
      )
    }

    const currentUser = await findUserById(session.id)
    if (!currentUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 },
      )
    }

    const isCurrentPasswordValid = await verifyPassword(
      currentPassword,
      currentUser.password_hash,
    )
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: '当前密码错误' },
        { status: 401 },
      )
    }

    await updateUserPassword(session.id, newPassword)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: '修改密码失败，请稍后重试' },
      { status: 500 },
    )
  }
}
