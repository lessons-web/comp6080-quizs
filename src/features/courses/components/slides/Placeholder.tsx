'use client'

const WIDTH_CLASS = {
  full: 'w-full',
  wide: 'w-5/6',
  half: 'w-1/2',
  narrow: 'w-1/3',
} as const

export type PlaceholderWidth = keyof typeof WIDTH_CLASS

export interface PlaceholderBlockProps {
  width?: PlaceholderWidth
  label?: string
  lines?: number
}

/**
 * CSS 占位块：内容尚未撰写时用它撑出真实的排版节奏。
 * 不是灰色加载骨架，而是带标签的虚线框，明确表示「这里待补充」。
 */
export function PlaceholderBlock({
  width = 'full',
  label = '内容占位',
  lines = 2,
}: PlaceholderBlockProps) {
  return (
    <div
      className={`${WIDTH_CLASS[width]} rounded-lg border border-dashed border-[#cfc8bb] bg-[#f4f1ea]/60 px-4 py-3`}
    >
      <div className="course-mono text-[10.5px] uppercase tracking-[0.14em] text-[#8b9099]">
        {label}
      </div>
      <div className="mt-2.5 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-[#e3ded4]"
            style={{ width: `${100 - i * 18}%` }}
          />
        ))}
      </div>
    </div>
  )
}
