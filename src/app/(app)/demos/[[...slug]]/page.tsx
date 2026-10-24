import { notFound } from 'next/navigation'

import { getDemoBySlug, getDemoList } from '@/lib/content/demos'
import { DemoDetailPage, DemoIndexPage } from '@/features/demos/DemoPage'

export default async function DemosRoute({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params

  if (!slug?.length) {
    return <DemoIndexPage demos={getDemoList()} />
  }

  const demo = getDemoBySlug(slug)
  if (!demo) notFound()

  return <DemoDetailPage demo={demo} />
}
