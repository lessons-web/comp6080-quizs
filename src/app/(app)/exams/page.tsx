import { Suspense } from 'react'
import { MockExamsPage } from '@/features/mock-exams/MockExamsPage'

export default function ExamsRoute() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">加载中...</div>}>
      <MockExamsPage />
    </Suspense>
  )
}
