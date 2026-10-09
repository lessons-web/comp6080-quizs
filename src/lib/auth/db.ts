import type { User, UserRole, PublicUser } from './types'
import { hashPassword } from './password'
import { DEV_ADMIN_USER, isLocalDevBypass } from './session'

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  }
}

let sql: typeof import('@vercel/postgres').sql
async function getSqlClient() {
  if (!sql) {
    const mod = await import('@vercel/postgres')
    sql = mod.sql
  }
  return sql
}

const mockUsersStore: User[] = []

function mockUserFromPublic(pub: PublicUser, passwordHash: string): User {
  return {
    ...pub,
    password_hash: passwordHash,
    updated_at: pub.created_at ?? new Date().toISOString(),
  } as User
}

export async function findUserByEmail(email: string): Promise<User | null> {
  if (isLocalDevBypass()) {
    return mockUsersStore.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  }
  const client = await getSqlClient()
  const result = await client<User>`
    SELECT id, email, password_hash, role, created_at, updated_at
    FROM users
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `
  return result.rows[0] || null
}

export async function findUserById(id: string): Promise<User | null> {
  if (isLocalDevBypass()) {
    if (id === DEV_ADMIN_USER.id) {
      return {
        id: DEV_ADMIN_USER.id,
        email: DEV_ADMIN_USER.email,
        password_hash: '',
        role: DEV_ADMIN_USER.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    return mockUsersStore.find((u) => u.id === id) || null
  }
  const client = await getSqlClient()
  const result = await client<User>`
    SELECT id, email, password_hash, role, created_at, updated_at
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `
  return result.rows[0] || null
}

export async function listAllUsers(): Promise<PublicUser[]> {
  if (isLocalDevBypass()) {
    const all: User[] = []
    all.push({
      id: DEV_ADMIN_USER.id,
      email: DEV_ADMIN_USER.email,
      password_hash: '',
      role: DEV_ADMIN_USER.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    for (const u of mockUsersStore) all.push(u)
    return all.map(toPublicUser)
  }
  const client = await getSqlClient()
  const result = await client<User>`
    SELECT id, email, password_hash, role, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `
  return result.rows.map(toPublicUser)
}

export async function createUser(
  email: string,
  password: string,
  role: UserRole = 'student',
): Promise<PublicUser> {
  const passwordHash = await hashPassword(password)

  if (isLocalDevBypass()) {
    const id = 'dev-user-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
    const now = new Date().toISOString()
    const user: User = {
      id,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role,
      created_at: now,
      updated_at: now,
    }
    mockUsersStore.unshift(user)
    return toPublicUser(user)
  }

  const client = await getSqlClient()
  const result = await client<User>`
    INSERT INTO users (email, password_hash, role)
    VALUES (${email.toLowerCase()}, ${passwordHash}, ${role})
    RETURNING id, email, password_hash, role, created_at, updated_at
  `
  return toPublicUser(result.rows[0])
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword)

  if (isLocalDevBypass()) {
    const idx = mockUsersStore.findIndex((u) => u.id === userId)
    if (idx >= 0) {
      mockUsersStore[idx] = {
        ...mockUsersStore[idx],
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      }
    }
    return
  }

  const client = await getSqlClient()
  await client`
    UPDATE users
    SET password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `
}

export async function ensureAdminUser(): Promise<void> {
  if (isLocalDevBypass()) return
  const existing = await findUserByEmail('rbtree@ad.unsw.edu.au')
  if (existing) return

  await createUser('rbtree@ad.unsw.edu.au', 'Admin123456!@#$', 'admin')
}
