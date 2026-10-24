import type { DemoDefinition } from '../../types/demo'

const DEMOS: DemoDefinition[] = [
  {
    route: '/demos/week-4/json/stringify-parse',
    slug: ['week-4', 'json', 'stringify-parse'],
    title: 'stringify / parse 双向转换',
    subtitle:
      '现场观察 JSON.parse 成功与失败的区别，并比较 JSON.stringify 的紧凑输出与格式化输出。',
    weekId: 'week-4',
    lessonId: 'data-interchange',
    lessonTitle: '数据交换格式与 JSON',
    objectives: [
      '观察 parse 成功与失败的区别',
      '比较紧凑字符串和格式化字符串',
      '验证 stringify 会丢掉哪些值',
    ],
    sourceHtmlPath: '/course-demos/week4/01a-stringify-parse-demo.html',
    backToCourseHref: '/courses/week-4/data-interchange',
    topicLabel: 'Week 4 · JSON',
  },
  {
    route: '/demos/week-4/json/localstorage',
    slug: ['week-4', 'json', 'localstorage'],
    title: 'JSON + localStorage 持久化',
    subtitle:
      '沿着 stringify -> setItem -> getItem -> parse 这条链，理解为什么 localStorage 里真正存放的是字符串。',
    weekId: 'week-4',
    lessonId: 'data-interchange',
    lessonTitle: '数据交换格式与 JSON',
    objectives: [
      '观察 localStorage 里真实存着的字符串',
      '理解写前 stringify、读后 parse 的闭环',
      '验证刷新页面后数据仍然存在',
    ],
    sourceHtmlPath: '/course-demos/week4/01b-localstorage-demo.html',
    backToCourseHref: '/courses/week-4/data-interchange',
    topicLabel: 'Week 4 · JSON',
  },
]

export function getDemoList() {
  return DEMOS
}

export function getDemoBySlug(slug: string[]) {
  return DEMOS.find((demo) =>
    demo.slug.length === slug.length &&
    demo.slug.every((segment, index) => segment === slug[index]),
  ) ?? null
}
