type ContentLoadingProps = { rows?: number }

export function ContentLoading({ rows = 6 }: ContentLoadingProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded-full bg-slate-200"
            style={{ width: `${100 - (i % 3) * 20}%` }}
          />
        ))}
      </div>
    </div>
  )
}
