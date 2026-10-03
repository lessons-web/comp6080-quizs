export function parseWeek(weekParam?: string): number {
  const match = weekParam?.match(/^week-(\d)$/)
  const value = Number(match?.[1])
  return Number.isInteger(value) ? value : Number.NaN
}
