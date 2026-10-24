'use client'

import { useCallback, useEffect, useRef } from 'react'

import type { DemoDefinition } from '../../../types/demo'

export function DemoFrame({ demo }: { demo: DemoDefinition }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const syncHeight = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    try {
      const doc = iframe.contentDocument
      if (!doc) return

      const nextHeight = Math.max(
        doc.documentElement?.scrollHeight ?? 0,
        doc.body?.scrollHeight ?? 0,
      )

      if (nextHeight > 0) {
        iframe.style.height = `${nextHeight}px`
      }
    } catch {
      // 同源静态页正常可读；如果未来切到跨域资源，这里静默降级。
    }
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let resizeObserver: ResizeObserver | null = null
    let mutationObserver: MutationObserver | null = null

    const bindObservers = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc?.body) return

        syncHeight()

        resizeObserver = new ResizeObserver(() => syncHeight())
        resizeObserver.observe(doc.body)
        if (doc.documentElement) {
          resizeObserver.observe(doc.documentElement)
        }

        mutationObserver = new MutationObserver(() => syncHeight())
        mutationObserver.observe(doc.body, {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: true,
        })
      } catch {
        // 同源访问失败时维持默认高度。
      }
    }

    const handleLoad = () => {
      bindObservers()
      syncHeight()
    }

    iframe.addEventListener('load', handleLoad)
    handleLoad()

    return () => {
      iframe.removeEventListener('load', handleLoad)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [syncHeight])

  return (
    <iframe
      ref={iframeRef}
      src={demo.sourceHtmlPath}
      title={demo.title}
      loading="lazy"
      scrolling="no"
      className="block w-full border-0 bg-transparent"
      style={{ height: 'auto', borderRadius: '20px' }}
    />
  )
}
