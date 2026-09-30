import type { MockExamCollection } from '../../types/content'

const examModules = import.meta.glob<MockExamCollection>(
  '../../../content/exams/*.json',
  { eager: false },
)

async function importWeekModule(week: number): Promise<MockExamCollection | null> {
  const key = `../../../content/exams/week-${week}.mock-exams.json`
  const loader = examModules[key]
  if (!loader) return null
  return loader()
}

export async function getMockExamsByWeek(week: number) {
  return importWeekModule(week)
}
