import { Suspense } from 'react'
import LoginPage from './page'

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <LoginPage />
    </Suspense>
  )
}
