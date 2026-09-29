import week1Practice from '../../../content/questions/week-1.practice.json'
import week2Practice from '../../../content/questions/week-2.practice.json'
import week3Practice from '../../../content/questions/week-3.practice.json'
import week4Practice from '../../../content/questions/week-4.practice.json'

import type {
  PracticeQuestion,
  PracticeQuestionCollection,
} from '../../types/content'

const practiceCollections: Record<number, PracticeQuestionCollection> = {
  1: week1Practice as PracticeQuestionCollection,
  2: week2Practice as PracticeQuestionCollection,
  3: week3Practice as PracticeQuestionCollection,
  4: week4Practice as PracticeQuestionCollection,
}

export function getPracticeQuestionsByWeek(week: number) {
  return practiceCollections[week] ?? null
}

export function groupPracticeQuestions(questions: PracticeQuestion[]) {
  return questions.reduce<Record<string, PracticeQuestion[]>>((groups, question) => {
    const group = groups[question.topic] ?? []
    group.push(question)
    groups[question.topic] = group
    return groups
  }, {})
}
