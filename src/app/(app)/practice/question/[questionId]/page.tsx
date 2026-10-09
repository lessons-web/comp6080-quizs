import { Suspense } from 'react'
import { QuestionDetailPage } from '@/features/practice/QuestionDetailPage'

export default function QuestionDetailRoute() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">加载中...</div>}>
      <QuestionDetailPage />
    </Suspense>
  )
}
