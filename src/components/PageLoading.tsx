export function PageLoading() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="h-48 w-full animate-pulse rounded-[2rem] border border-slate-200 bg-white shadow-sm" />
      <div className="h-96 w-full animate-pulse rounded-[2rem] border border-slate-200 bg-white shadow-sm" />
    </div>
  )
}
