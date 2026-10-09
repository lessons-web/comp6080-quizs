'use client'

import Link from 'next/link'

import { ContentLoading } from '../../../components/ContentLoading'
import type {
  Difficulty,
  KnowledgePointMeta,
  TopicId,
  WeekTag,
} from '../../../types/content'
import { TOPIC_META } from '../../../types/content'

export interface KnowledgeDetailPanelProps {
  topic: TopicId
  meta: KnowledgePointMeta | null
  Component: React.ComponentType<Record<string, never>> | null
  loading: boolean
  error: unknown
}

function formatWeekTag(tag: WeekTag) {
  const m = /week-(\d+)/i.exec(tag)
  return m ? `Week ${m[1]}` : tag
}

const DIFF: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: '简单', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { label: '中等', cls: 'bg-amber-50 text-amber-600' },
  hard: { label: '困难', cls: 'bg-rose-50 text-rose-600' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function MetaRow({ meta }: { meta: KnowledgePointMeta }) {
  const diff = DIFF[meta.difficulty]
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
        {meta.category}
      </span>
      <span className={`rounded px-1.5 py-0.5 font-medium ${diff.cls}`}>
        {diff.label}
      </span>
      {meta.tags.map((t) => (
        <span
          key={t}
          className="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-600"
        >
          {formatWeekTag(t)}
        </span>
      ))}
      <span className="ml-auto text-slate-400">创建于 {formatDate(meta.createdAt)}</span>
    </div>
  )
}

export function KnowledgeDetailPanel({
  topic,
  meta,
  Component,
  loading,
  error,
}: KnowledgeDetailPanelProps) {
  const topicLabel = TOPIC_META[topic].label

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-8 py-3 backdrop-blur">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="flex-1 px-8 pt-6">
          <div className="h-7 w-64 animate-pulse rounded bg-slate-200" />
          <ContentLoading rows={12} className="mt-6" />
        </div>
      </div>
    )
  }

  if (error || !meta || !Component) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-white/90 px-8 py-3 backdrop-blur">
          <Link
          href="/knowledge"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回 知识点首页
        </Link>
        <span className="ml-auto text-xs text-slate-400">{topicLabel}</span>
      </div>
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {error ? '加载失败' : '还没有知识点'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {error ? '请稍后刷新再试。' : '该技术领域内容整理中，敬请期待。'}
          </p>
        </div>
      </div>
    </div>
  )
}

return (
  <div className="flex h-full w-full flex-col overflow-hidden bg-white">
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-white/90 px-8 py-3 backdrop-blur">
      <Link
        href="/knowledge"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回 知识点首页
        </Link>
        <div className="ml-auto text-xs text-slate-500">
          <span className="text-slate-400">{topicLabel}</span>
          <span className="mx-1 text-slate-300">/</span>
          <span className="font-medium text-slate-700">{meta.category}</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          <div className="px-8 pt-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {meta.title}
            </h1>
            <div className="mt-2">
              <MetaRow meta={meta} />
            </div>
          </div>
          <article className="px-8 py-5">
            <div className="prose prose-slate max-w-none prose-sm sm:prose-base">
              <Component />
            </div>
          </article>
          <div className="px-8 pb-8">
            <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <div className="text-sm text-indigo-800">
                想巩固这个知识点？去 {topicLabel} 模拟题库练习。
              </div>
              <Link
                href={`/practice/${topic}`}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                进入模拟题库
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
