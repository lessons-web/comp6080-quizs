import { Suspense } from 'react'
import { CoursePage } from '@/features/courses/CoursePage'

export default function CoursesRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-[#faf8f4] text-[#8b9099]">
          正在加载课程…
        </div>
      }
    >
      <CoursePage />
    </Suspense>
  )
}
