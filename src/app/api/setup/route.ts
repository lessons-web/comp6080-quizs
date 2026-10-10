import { NextResponse } from 'next/server'
import { isLocalDevBypass } from '@/lib/auth/session'
import { ensureAdminUser } from '@/lib/auth/db'

async function getSqlClient() {
  const mod = await import('@vercel/postgres')
  return mod.sql
}

export async function GET() {
  try {
    if (isLocalDevBypass()) {
      return NextResponse.json({
        success: true,
        mode: 'development-bypass',
        message: '本地开发模式：已自动使用内存用户存储 + admin 角色，无需连接数据库。所有功能可直接访问。',
      })
    }

    const sql = await getSqlClient()
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'student', 'guest')) DEFAULT 'student',
        disabled BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS disabled BOOLEAN NOT NULL DEFAULT FALSE`

    await ensureAdminUser()

    return NextResponse.json({
      success: true,
      message: '数据库初始化成功，默认管理员账号已创建（rbtree@ad.unsw.edu.au）',
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '初始化失败',
      },
      { status: 500 },
    )
  }
}
