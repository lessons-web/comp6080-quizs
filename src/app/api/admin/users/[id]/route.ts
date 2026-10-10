import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { toggleUserDisabled, deleteUser, findUserById } from '@/lib/auth/db'
import { DEV_ADMIN_USER } from '@/lib/auth/session'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足，需要管理员身份' },
        { status: 403 },
      )
    }

    const { id } = await params
    const targetUser = await findUserById(id)
    if (!targetUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 },
      )
    }

    if (targetUser.email === DEV_ADMIN_USER.email || targetUser.id === DEV_ADMIN_USER.id) {
      return NextResponse.json(
        { error: '不能禁用默认管理员账号' },
        { status: 400 },
      )
    }

    const { disabled } = await request.json()
    if (typeof disabled !== 'boolean') {
      return NextResponse.json(
        { error: 'disabled 参数必须是布尔值' },
        { status: 400 },
      )
    }

    const updatedUser = await toggleUserDisabled(id, disabled)
    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Toggle user disabled error:', error)
    return NextResponse.json(
      { error: '操作用户状态失败，请稍后重试' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足，需要管理员身份' },
        { status: 403 },
      )
    }

    const { id } = await params
    const targetUser = await findUserById(id)
    if (!targetUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 },
      )
    }

    if (targetUser.email === DEV_ADMIN_USER.email || targetUser.id === DEV_ADMIN_USER.id) {
      return NextResponse.json(
        { error: '不能删除默认管理员账号' },
        { status: 400 },
      )
    }

    if (session.id === id) {
      return NextResponse.json(
        { error: '不能删除当前登录的账号' },
        { status: 400 },
      )
    }

    const success = await deleteUser(id)
    if (!success) {
      return NextResponse.json(
        { error: '删除用户失败' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: '删除用户失败，请稍后重试' },
      { status: 500 },
    )
  }
}
