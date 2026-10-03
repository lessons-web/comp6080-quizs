export function parseWeek(weekParam?: string): number {
  if (!weekParam) return Number.NaN
  const direct = /^(\d+)$/.exec(weekParam)
  if (direct) return Number(direct[1])
  const withPrefix = /^week-(\d+)$/i.exec(weekParam)
  if (withPrefix) return Number(withPrefix[1])
  return Number.NaN
}
