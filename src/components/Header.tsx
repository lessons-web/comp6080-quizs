import { NavLink } from 'react-router-dom'

const navItems = [
  { label: '知识点解析', to: '/knowledge' },
  { label: '模拟题库', to: '/practice/week-1' },
  { label: '模拟真题', to: '/mock-exams/week-1' },
]

function navClassName(isActive: boolean) {
  return [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
  ].join(' ')
}

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 4 5.5z" />
              <path d="M4 9.5A2.5 2.5 0 0 1 6.5 7h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 4 9.5z" />
              <path d="M4 13.5A2.5 2.5 0 0 1 6.5 11h5a2.5 2.5 0 0 1 0 5h-5A2.5 2.5 0 0 1 4 13.5z" />
              <path d="M16 10h3.5A2.5 2.5 0 0 1 22 12.5V21a1 1 0 0 1-1.6.8L18 19.2l-2.4 2.6A1 1 0 0 1 14 21v-8.5A2.5 2.5 0 0 1 16.5 10H16z" />
            </svg>
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            COMP6080 Quiz Hub
          </span>
        </div>

        <nav aria-label="模块导航" className="flex flex-wrap items-center justify-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => navClassName(isActive)}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            aria-label="消息提醒"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
            />
          </button>

          <span aria-hidden className="h-8 w-px bg-slate-200" />

          <button
            type="button"
            aria-label="个人中心"
            className="flex items-center gap-3 rounded-full px-1 py-1 transition hover:bg-slate-50"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-5 text-slate-800">Learner</p>
              <p className="text-xs leading-4 text-slate-500">COMP6080 Student</p>
            </div>
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-base font-semibold text-white shadow-sm"
            >
              L
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
