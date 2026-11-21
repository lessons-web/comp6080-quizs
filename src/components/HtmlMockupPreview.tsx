export function HtmlMockupPreview({ html }: { html: string }) {
  return (
    <div
      aria-hidden="true"
      className="exam-ui-root"
      dangerouslySetInnerHTML={{ __html: html }}
      inert
    />
  )
}
