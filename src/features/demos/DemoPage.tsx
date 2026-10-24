import Link from 'next/link'

import type { DemoDefinition } from '../../types/demo'
import { DemoFrame } from './components/DemoFrame'

export function DemoIndexPage({ demos }: { demos: DemoDefinition[] }) {
  return (
    <div className="flex h-full w-full bg-[#faf8f4]">
      <section className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5 lg:px-6">
        <header className="rounded-3xl border border-[#e3ded4] bg-[#fffdfa] px-6 py-6 shadow-[0_24px_48px_-24px_rgba(22,24,29,.15)]">
          <div className="course-mono text-[11px] uppercase tracking-[0.16em] text-[#8b9099]">
            Demos
          </div>
          <h1 className="course-serif mt-3 text-[30px] font-semibold tracking-[-0.02em] text-[#16181d]">
            可运行实验模块
          </h1>
          <p className="mt-3 max-w-[70ch] text-[15px] leading-7 text-[#4c5159]">
            这里集中承载课程里的实验台。课件页负责讲解，demos 页负责动手验证。
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          {demos.map((demo) => (
            <article
              key={demo.route}
              className="rounded-2xl border border-[#e3ded4] bg-[#fffdfa] p-5 shadow-[0_12px_28px_-22px_rgba(22,24,29,.2)]"
            >
              <div className="course-mono text-[11px] uppercase tracking-[0.14em] text-[#8b9099]">
                {demo.topicLabel}
              </div>
              <h2 className="course-serif mt-2 text-[24px] font-semibold tracking-[-0.02em] text-[#16181d]">
                {demo.title}
              </h2>
              <p className="mt-2 text-[14.5px] leading-7 text-[#4c5159]">
                {demo.subtitle}
              </p>
              <ul className="mt-4 space-y-2">
                {demo.objectives.map((objective) => (
                  <li
                    key={objective}
                    className="rounded-xl border border-[#e3ded4] bg-white px-4 py-2.5 text-[13.5px] leading-6 text-[#4c5159]"
                  >
                    {objective}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href={demo.route}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#b3470f] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#9b3c0c]"
                >
                  打开实验
                </Link>
                <Link
                  href={demo.backToCourseHref}
                  className="inline-flex items-center rounded-full border border-[#cfc8bb] bg-white px-4 py-2 text-[13px] font-medium text-[#4c5159] transition hover:border-[#b3470f] hover:text-[#b3470f]"
                >
                  返回课件
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export function DemoDetailPage({ demo }: { demo: DemoDefinition }) {
  return (
    <div
      data-testid="demo-detail-root"
      className="flex h-full w-full overflow-y-auto bg-[#faf8f4]"
    >
      <section
        data-testid="demo-detail-split"
        className="grid w-full flex-1 grid-cols-1 gap-4 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
      >
        <aside
          data-testid="demo-detail-info"
          className="flex flex-col gap-4 px-4 md:pl-4 md:pr-0 lg:pl-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={demo.backToCourseHref}
              className="inline-flex items-center rounded-full border border-[#cfc8bb] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#4c5159] transition hover:border-[#b3470f] hover:text-[#b3470f]"
            >
              返回课件
            </Link>
            <span className="course-mono text-[11px] uppercase tracking-[0.14em] text-[#8b9099]">
              {demo.topicLabel}
            </span>
          </div>

          <div className="rounded-3xl border border-[#e3ded4] bg-[#fffdfa] p-5 shadow-[0_24px_48px_-24px_rgba(22,24,29,.15)]">
            <div className="course-mono text-[11px] uppercase tracking-[0.14em] text-[#8b9099]">
              {demo.lessonTitle}
            </div>
            <h1 className="course-serif mt-2 text-[24px] font-semibold tracking-[-0.02em] text-[#16181d]">
              {demo.title}
            </h1>
            <p className="mt-3 text-[14px] leading-7 text-[#4c5159]">
              {demo.subtitle}
            </p>
          </div>

          <ul className="space-y-3">
            {demo.objectives.map((objective, index) => (
              <li
                key={objective}
                className="rounded-2xl border border-[#e3ded4] bg-white px-4 py-3"
              >
                <div className="course-mono text-[11px] uppercase tracking-[0.14em] text-[#8b9099]">
                  观察点 {index + 1}
                </div>
                <p className="mt-2 text-[13.5px] leading-6 text-[#4c5159]">
                  {objective}
                </p>
              </li>
            ))}
          </ul>
        </aside>

        <div
          data-testid="demo-detail-stage"
          className="min-w-0 p-4 md:p-0 md:p-4 lg:p-6"
        >
          <DemoFrame demo={demo} />
        </div>
      </section>
    </div>
  )
}
