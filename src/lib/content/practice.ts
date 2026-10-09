import type {
  Difficulty,
  PracticeQuestion,
  PracticeQuestionCollection,
  TopicId,
  WeekTag,
} from '../../types/content'

const questionLoaders: Record<string, () => Promise<PracticeQuestionCollection>> = {
  'week-1.practice': () =>
    import('@/content/questions/week-1.practice.json') as Promise<PracticeQuestionCollection>,
  'week-2.practice': () =>
    import('@/content/questions/week-2.practice.json') as Promise<PracticeQuestionCollection>,
  'week-3.practice': () =>
    import('@/content/questions/week-3.practice.json') as Promise<PracticeQuestionCollection>,
  'week-4.practice': () =>
    import('@/content/questions/week-4.practice.json') as Promise<PracticeQuestionCollection>,
  'database': () =>
    import('@/content/questions/database.json') as Promise<PracticeQuestionCollection>,
}

const DEFAULT_CREATED_AT = '2026-03-15'

const TOPIC_DEFAULT_WEEK: Record<TopicId, WeekTag> = {
  html: 'week-1',
  css: 'week-1',
  javascript: 'week-2',
  react: 'week-3',
  nodejs: 'week-4',
}

function guessDifficulty(question: string, knowledgePoint: string): Difficulty {
  const hardKeywords = ['问题', '修正', '为什么', '综合', '复杂', '两个', '哪些', '排错', '失效', '层叠']
  const easyKeywords = ['哪个', '对不对', '是否', '区别是', '有什么区别', '写在', '放在']
  const q = (question + knowledgePoint).toLowerCase()
  if (hardKeywords.some((k) => q.includes(k.toLowerCase()))) {
    if (easyKeywords.some((k) => q.includes(k.toLowerCase()))) {
      return 'medium'
    }
    return 'hard'
  }
  if (easyKeywords.some((k) => q.includes(k.toLowerCase()))) {
    return 'easy'
  }
  return 'medium'
}

function inferTags(question: string, knowledgePoint: string): string[] {
  const pool: Array<[RegExp, string[]]> = [
    [/flex|flexbox|justify-content|align-items/i, ['Flexbox', '布局']],
    [/z-index|层叠|stacking/i, ['z-index', '层叠上下文']],
    [/margin|padding|盒模型|box.?model|width/i, ['盒模型', '布局基础']],
    [/选择器|selector|优先级|specificity|class|#|\.note/i, ['选择器', '优先级']],
    [/font|text|文本|字体|段落/i, ['文本', '字体']],
    [/svg|png|jpg|jpeg|图片|位图|矢量|img/i, ['图片', '格式']],
    [/路径|path|src|href|相对|根路径|link/i, ['路径', '链接']],
    [/语义|semantic|header|nav|footer|h1|div|title|head|body|meta/i, ['语义化', '结构']],
    [/pre\b|code\b|代码标签/i, ['代码标签', '格式']],
    [/alt|可访问|a11y|accessibility/i, ['可访问性', 'a11y']],
    [/预处理器|preprocessor|sass|less|变量|嵌套/i, ['预处理器', '工程化']],
    [/响应式|responsive|屏幕|布局稳定/i, ['响应式', '布局']],
  ]
  const text = `${question} ${knowledgePoint}`
  const found = new Set<string>()
  for (const [regex, tags] of pool) {
    if (regex.test(text)) {
      tags.forEach((t) => found.add(t))
    }
  }
  if (found.size === 0) found.add('基础概念')
  return [...found].slice(0, 4)
}

function normalizeTopic(raw: string): TopicId {
  const low = raw.toLowerCase()
  if (low === 'javascript') return 'javascript'
  if (low === 'node.js' || low === 'nodejs') return 'nodejs'
  if (low in TOPIC_DEFAULT_WEEK) return low as TopicId
  return 'html'
}

export function normalizeQuestion(raw: any): PracticeQuestion {
  const topic = normalizeTopic(String(raw.topic ?? 'html'))
  const weeks: WeekTag[] =
    Array.isArray(raw.weeks) && raw.weeks.length > 0
      ? raw.weeks
      : [TOPIC_DEFAULT_WEEK[topic]]
  const difficulty: Difficulty =
    raw.difficulty === 'easy' || raw.difficulty === 'medium' || raw.difficulty === 'hard'
      ? raw.difficulty
      : guessDifficulty(String(raw.question ?? ''), String(raw.knowledgePoint ?? ''))
  const tags: string[] = Array.isArray(raw.tags) && raw.tags.length > 0
    ? raw.tags
    : inferTags(String(raw.question ?? ''), String(raw.knowledgePoint ?? ''))
  const createdAt: string = typeof raw.createdAt === 'string' && raw.createdAt.length > 0
    ? raw.createdAt
    : DEFAULT_CREATED_AT
  return {
    id: String(raw.id ?? `q-${Math.random().toString(36).slice(2, 9)}`),
    topic,
    weeks,
    difficulty,
    tags,
    question: String(raw.question ?? ''),
    knowledgePoint: String(raw.knowledgePoint ?? ''),
    answerExplanation: String(raw.answerExplanation ?? ''),
    codeBlocks: Array.isArray(raw.codeBlocks) ? raw.codeBlocks : [],
    images: Array.isArray(raw.images) ? raw.images : [],
    createdAt,
  }
}

export function normalizeCollection(raw: any): PracticeQuestionCollection | null {
  if (!raw || typeof raw !== 'object') return null
  const topic = normalizeTopic(String(raw.topic ?? 'html'))
  const questions = Array.isArray(raw.questions)
    ? raw.questions.map(normalizeQuestion)
    : []
  return { topic, questions }
}

async function importWeekModule(week: number): Promise<PracticeQuestionCollection | null> {
  const key = `week-${week}.practice`
  const loader = questionLoaders[key]
  if (!loader) return null
  const raw = await loader()
  return normalizeCollection({
    topic: raw.topic,
    questions: (raw as any).questions ?? [],
  })
}

export async function getPracticeQuestionsByWeek(week: number) {
  return importWeekModule(week)
}

export async function getAllPracticeQuestions(): Promise<PracticeQuestion[]> {
  const keys = Object.keys(questionLoaders)
  const results = await Promise.all(
    keys.map(async (key) => {
      try {
        const loader = questionLoaders[key]
        const raw = await loader()
        return Array.isArray((raw as any).questions)
          ? (raw as any).questions.map(normalizeQuestion)
          : []
      } catch {
        return []
      }
    }),
  )
  const flatQuestions = results.flat()
  flatQuestions.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return flatQuestions
}

export function groupPracticeQuestions(questions: PracticeQuestion[]) {
  return questions.reduce<Record<string, PracticeQuestion[]>>((groups, question) => {
    const group = groups[question.topic] ?? []
    group.push(question)
    groups[question.topic] = group
    return groups
  }, {})
}

export function collectUniqueTags(questions: PracticeQuestion[]): string[] {
  const set = new Set<string>()
  questions.forEach((q) => q.tags.forEach((t) => set.add(t)))
  return [...set].sort((a, b) => a.localeCompare(b))
}

export function collectUniqueWeeks(questions: PracticeQuestion[]): WeekTag[] {
  const set = new Set<WeekTag>()
  questions.forEach((q) => q.weeks.forEach((w) => set.add(w)))
  return [...set].sort()
}

export async function getPracticeQuestionById(
  id: string,
  pool?: PracticeQuestion[],
): Promise<PracticeQuestion | null> {
  const questions = pool ?? (await getAllPracticeQuestions())
  return questions.find((q) => q.id === id) ?? null
}

export function findRelatedQuestionsByTags(
  currentId: string,
  tags: string[],
  pool: PracticeQuestion[],
  limit = 6,
): PracticeQuestion[] {
  if (!Array.isArray(tags) || tags.length === 0) return []
  const tagSet = new Set(tags)
  const scored: Array<{ q: PracticeQuestion; overlap: number }> = []
  for (const q of pool) {
    if (q.id === currentId) continue
    let overlap = 0
    for (const t of q.tags) {
      if (tagSet.has(t)) overlap += 1
    }
    if (overlap > 0) scored.push({ q, overlap })
  }
  scored.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap
    return (b.q.createdAt ?? '').localeCompare(a.q.createdAt ?? '')
  })
  return scored.slice(0, limit).map((s) => s.q)
}
