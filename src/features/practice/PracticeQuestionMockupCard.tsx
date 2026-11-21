import type { PracticeQuestionMockup } from '../../types/content'
import { HtmlMockupPreview } from '../../components/HtmlMockupPreview'

export function PracticeQuestionMockupCard({
  mockup,
}: {
  mockup?: PracticeQuestionMockup
}) {
  if (!mockup) return null

  const viewportClass =
    mockup.viewport === 'mobile'
      ? 'mx-auto max-w-[320px]'
      : 'w-full'

  return (
    <figure className="overflow-hidden rounded-[1.5rem] border border-[#e4dfd5] bg-[#f5f3ee] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <div className="p-3 sm:p-4">
        <div
          className={`${viewportClass} rounded-[1rem] border border-[#e3e6ea] bg-white p-4 shadow-[0_1px_2px_rgba(22,24,29,.05)]`}
          data-viewport={mockup.viewport ?? 'desktop'}
        >
          <HtmlMockupPreview html={mockup.html} />
        </div>
      </div>
      <figcaption className="border-t border-[#e2ddd3] px-4 py-3 text-xs leading-5 text-[#667085]">
        {mockup.caption}
      </figcaption>
    </figure>
  )
}
