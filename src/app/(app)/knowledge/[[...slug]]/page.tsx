import { Suspense } from 'react'
import { KnowledgePage } from '@/features/knowledge/KnowledgePage'

export default function KnowledgeRoute() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">加载中...</div>}>
      <KnowledgePage />
    </Suspense>
  )
}
