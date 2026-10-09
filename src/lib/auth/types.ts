export type UserRole = 'admin' | 'student' | 'guest'

export interface User {
  id: string
  email: string
  password_hash: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface PublicUser {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: '管理员',
  student: '学员',
  guest: '访客',
}

export const ROLE_OPTIONS = [
  { value: 'student' as UserRole, label: '学员' },
  { value: 'admin' as UserRole, label: '管理员' },
  { value: 'guest' as UserRole, label: '访客' },
]
