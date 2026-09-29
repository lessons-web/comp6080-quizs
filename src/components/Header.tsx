import { NavLink } from 'react-router-dom'

const navItems = [
  { label: '知识点解析', to: '/knowledge/week-1' },
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              COMP6080 Quiz Hub
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Web Foundations 题库系统
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            按模块学习知识点、练习单题，再用整卷模拟题做期末前复盘。
          </p>
        </div>

        <nav aria-label="模块导航" className="flex flex-wrap gap-2">
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
      </div>
    </header>
  )
}
