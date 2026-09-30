import type {
  PracticeQuestion,
  PracticeQuestionCollection,
} from '../../types/content'

const practiceModules = import.meta.glob<PracticeQuestionCollection>(
  '../../../content/questions/*.json',
  { eager: false },
)

async function importWeekModule(week: number): Promise<PracticeQuestionCollection | null> {
  const key = `../../../content/questions/week-${week}.practice.json`
  const loader = practiceModules[key]
  if (!loader) return null
  return loader()
}

export async function getPracticeQuestionsByWeek(week: number) {
  return importWeekModule(week)
}

export function groupPracticeQuestions(questions: PracticeQuestion[]) {
  return questions.reduce<Record<string, PracticeQuestion[]>>((groups, question) => {
    const group = groups[question.topic] ?? []
    group.push(question)
    groups[question.topic] = group
    return groups
  }, {})
}
