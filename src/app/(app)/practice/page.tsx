import { Suspense } from 'react'
import { PracticePage } from '@/features/practice/PracticePage'

export default function PracticeRoute() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">加载中...</div>}>
      <PracticePage />
    </Suspense>
  )
}
