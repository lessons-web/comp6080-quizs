import { Suspense } from 'react'
import { MockExamDetailPage } from '@/features/mock-exams/MockExamDetailPage'

export default function ExamDetailRoute() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">加载中...</div>}>
      <MockExamDetailPage />
    </Suspense>
  )
}
