export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <p>© {new Date().getFullYear()} COMP6080 Quiz Hub</p>
        </div>
        <p>For teaching preview and structured quiz practice.</p>
        <div className="flex items-center gap-2">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-4 w-4 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20" />
            <path d="M12 8c0-2.2 1.8-4 4-4 2.2 0 4 1.8 4 4 0 2.2-1.8 4-4 4h-4" />
            <path d="M12 16c0-2.2-1.8-4-4-4-2.2 0-4 1.8-4 4 0 2.2 1.8 4 4 4h4" />
          </svg>
          <span>版权归属 · 红黑树课堂</span>
        </div>
      </div>
    </footer>
  )
}
