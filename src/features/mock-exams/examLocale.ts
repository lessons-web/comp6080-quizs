'use client'

import type {
  ExamPaper,
  ExamQuestion,
  ExamQuestionMockup,
  ExamSubQuestion,
} from '../../types/content'

export type ExamLocale = 'en' | 'zh'

const CATEGORY_LABEL_ZH: Record<string, string> = {
  'HTML/CSS Layout and Responsive Behaviour': 'HTML/CSS 布局与响应式行为',
  'JavaScript and the DOM': 'JavaScript 与 DOM',
  'Async JavaScript: Event Loop and Promises': '异步 JavaScript：事件循环与 Promise',
  'Requests: Fetch, Combining and Recovery': '请求：fetch、组合与恢复',
  'Application State: Async UI, Auth and Storage': '应用状态：异步 UI、鉴权与存储',
  'UI Design Principles and User Experience Reasoning': 'UI 设计原则与用户体验推理',
}

export function getExamText(exam: ExamPaper, locale: ExamLocale) {
  return {
    title: locale === 'zh' ? exam.titleZh ?? exam.title : exam.title,
    description: locale === 'zh' ? exam.descriptionZh ?? exam.description : exam.description,
  }
}

export function getQuestionText(question: ExamQuestion, locale: ExamLocale) {
  return {
    title: locale === 'zh' ? question.titleZh ?? question.title : question.title,
    contentMdx: locale === 'zh' ? question.contentMdxZh ?? question.contentMdx : question.contentMdx,
    categoryLabel:
      locale === 'zh'
        ? question.categoryLabelZh ?? (question.categoryLabel ? CATEGORY_LABEL_ZH[question.categoryLabel] ?? question.categoryLabel : question.categoryLabel)
        : question.categoryLabel,
  }
}

export function getSubQuestionText(subQuestion: ExamSubQuestion, locale: ExamLocale) {
  return {
    questionMdx:
      locale === 'zh' ? subQuestion.questionMdxZh ?? subQuestion.questionMdx : subQuestion.questionMdx,
    answerMdx:
      locale === 'zh' ? subQuestion.answerMdxZh ?? subQuestion.answerMdx : subQuestion.answerMdx,
    markingMdx:
      locale === 'zh' ? subQuestion.markingMdxZh ?? subQuestion.markingMdx : subQuestion.markingMdx,
  }
}

export function getMockupText(mockup: ExamQuestionMockup, locale: ExamLocale) {
  return {
    html: locale === 'zh' ? mockup.htmlZh ?? mockup.html : mockup.html,
    caption: locale === 'zh' ? mockup.captionZh ?? mockup.caption : mockup.caption,
  }
}

export function examSupportsChinese(exam: ExamPaper): boolean {
  return Boolean(
    exam.titleZh
    || exam.descriptionZh
    || exam.questions.some((question) => (
      question.titleZh
      || question.contentMdxZh
      || question.categoryLabelZh
      || question.mockup?.htmlZh
      || question.mockup?.captionZh
      || question.subQuestions.some((subQuestion) => (
        subQuestion.questionMdxZh
        || subQuestion.answerMdxZh
        || subQuestion.markingMdxZh
      ))
    )),
  )
}

export const EXAM_LOCALE_LABELS = {
  en: {
    total: 'Total',
    marks: 'marks',
    previewMode: 'Guest Preview',
    previewSuffix: (count: number) => `Showing first ${count} questions`,
    modelAnswer: 'Model Answer',
    markingCriteria: 'Marking Criteria',
    revealAnswer: 'View Answer and Notes',
    hideAnswer: 'Hide Answer and Notes',
    supportingFiles: 'Supporting files',
    language: 'Language',
    expandPreview: 'Expand preview',
  },
  zh: {
    total: '总分',
    marks: '分',
    previewMode: '访客预览',
    previewSuffix: (count: number) => `已展示前 ${count} 题`,
    modelAnswer: '参考答案',
    markingCriteria: '给分点',
    revealAnswer: '查看答案与解析',
    hideAnswer: '收起答案与解析',
    supportingFiles: '支持文件',
    language: '语言',
    expandPreview: '放大预览',
  },
} as const
