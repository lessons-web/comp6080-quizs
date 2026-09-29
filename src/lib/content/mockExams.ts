import week1MockExams from '../../../content/exams/week-1.mock-exams.json'
import week2MockExams from '../../../content/exams/week-2.mock-exams.json'
import week3MockExams from '../../../content/exams/week-3.mock-exams.json'
import week4MockExams from '../../../content/exams/week-4.mock-exams.json'

import type { MockExamCollection } from '../../types/content'

const mockExamCollections: Record<number, MockExamCollection> = {
  1: week1MockExams as MockExamCollection,
  2: week2MockExams as MockExamCollection,
  3: week3MockExams as MockExamCollection,
  4: week4MockExams as MockExamCollection,
}

export function getMockExamsByWeek(week: number) {
  return mockExamCollections[week] ?? null
}
