import type {
  CourseAccentKey,
  CourseLesson,
  CourseSlide,
  CourseSlideCode,
  CourseWeek,
  CourseWeekId,
} from '../../types/course'

/**
 * 课程数据注册表 —— 参考课程大纲后，重组为更连续的 8 周学习路径。
 *
 * 学生按周推进，每周的知识点由若干张「幻灯片」组成。
 * Week 4 已接入 `courses/week4` 的原生 HTML 演示（现托管于
 * `public/course-demos/week4/`），其余 Week 目前为 CSS 占位骨架。
 */

export const WEEK_ACCENT: Record<
  CourseAccentKey,
  { gradient: string; text: string; softBg: string; ring: string; dot: string }
> = {
  amber: {
    gradient: 'from-amber-500 to-orange-600',
    text: 'text-amber-700',
    softBg: 'bg-amber-50',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
  },
  sky: {
    gradient: 'from-sky-500 to-blue-600',
    text: 'text-sky-700',
    softBg: 'bg-sky-50',
    ring: 'ring-sky-200',
    dot: 'bg-sky-500',
  },
  yellow: {
    gradient: 'from-yellow-400 to-amber-500',
    text: 'text-yellow-700',
    softBg: 'bg-yellow-50',
    ring: 'ring-yellow-200',
    dot: 'bg-yellow-400',
  },
  emerald: {
    gradient: 'from-emerald-500 to-green-600',
    text: 'text-emerald-700',
    softBg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  violet: {
    gradient: 'from-violet-500 to-purple-600',
    text: 'text-violet-700',
    softBg: 'bg-violet-50',
    ring: 'ring-violet-200',
    dot: 'bg-violet-500',
  },
  rose: {
    gradient: 'from-rose-500 to-red-500',
    text: 'text-rose-700',
    softBg: 'bg-rose-50',
    ring: 'ring-rose-200',
    dot: 'bg-rose-500',
  },
}

/** 生成一套纯占位幻灯片：封面 → 导览 → 逐知识点讲解 → 小结 */
function placeholderDeck(outline: string[]): CourseSlide[] {
  const slides: CourseSlide[] = [
    {
      id: 'cover',
      kind: 'cover',
      eyebrow: '本节知识点',
      title: outline[0] ?? '待补充',
      points: outline,
    },
    {
      id: 'outline',
      kind: 'outline',
      title: '这一节回答这些问题',
      points: outline,
    },
  ]

  outline.forEach((point, i) => {
    slides.push({
      id: `content-${i + 1}`,
      kind: 'content',
      eyebrow: `知识点 ${i + 1}`,
      title: point,
      columns: i % 2 === 0 ? 1 : 2,
      placeholderCount: 4,
    })
  })

  slides.push({
    id: 'closing',
    kind: 'closing',
    title: '本节小结',
    points: [
      '待补充：三条必背要点',
      '待补充：最容易踩的坑',
      '待补充：回到本周题库巩固',
    ],
  })

  return slides
}

/** 生成一套「讲解 + 可运行演示」的幻灯片（Week 4 使用） */
function demoDeck(params: {
  eyebrow: string
  coverTitle: string
  points: string[]
  demoTitle: string
  demoSrc: string
  demoNote: string
  code?: CourseSlideCode
}): CourseSlide[] {
  const slides: CourseSlide[] = [
    {
      id: 'cover',
      kind: 'cover',
      eyebrow: params.eyebrow,
      title: params.coverTitle,
      points: params.points,
    },
    {
      id: 'outline',
      kind: 'outline',
      title: '这一节回答这些问题',
      points: params.points,
    },
    {
      id: 'demo',
      kind: 'demo',
      eyebrow: '可运行演示',
      title: params.demoTitle,
      subtitle: params.demoNote,
      demo: { src: params.demoSrc, note: params.demoNote },
    },
  ]

  if (params.code) {
    slides.push({
      id: 'code',
      kind: 'code',
      eyebrow: '核心 API',
      title: params.code.filename ?? '示例代码',
      code: params.code,
    })
  }

  slides.push({
    id: 'closing',
    kind: 'closing',
    title: '带走这几句话',
    points: params.points.slice(0, 3),
  })

  return slides
}

/** 生成一套更适合理论/结构化讲授的幻灯片 */
function structuredDeck(params: {
  eyebrow: string
  coverTitle: string
  points: string[]
  sections?: Array<{
    title: string
    subtitle?: string
    columns?: 1 | 2
    placeholderCount?: number
  }>
  compare?: {
    title: string
    subtitle?: string
    leftTitle: string
    rightTitle: string
  }
  code?: CourseSlideCode & {
    title?: string
    eyebrow?: string
    subtitle?: string
  }
  closingTitle?: string
  closingPoints?: string[]
}): CourseSlide[] {
  const slides: CourseSlide[] = [
    {
      id: 'cover',
      kind: 'cover',
      eyebrow: params.eyebrow,
      title: params.coverTitle,
      points: params.points,
    },
    {
      id: 'outline',
      kind: 'outline',
      title: '这一节回答这些问题',
      points: params.points,
    },
  ]

  params.sections?.forEach((section, i) => {
    slides.push({
      id: `content-${i + 1}`,
      kind: 'content',
      eyebrow: `知识点 ${i + 1}`,
      title: section.title,
      subtitle: section.subtitle,
      columns: section.columns ?? 1,
      placeholderCount: section.placeholderCount ?? 4,
    })
  })

  if (params.compare) {
    slides.push({
      id: 'compare',
      kind: 'compare',
      eyebrow: '对比辨析',
      title: params.compare.title,
      subtitle: params.compare.subtitle,
      compare: {
        leftTitle: params.compare.leftTitle,
        rightTitle: params.compare.rightTitle,
      },
    })
  }

  if (params.code) {
    slides.push({
      id: 'code',
      kind: 'code',
      eyebrow: params.code.eyebrow ?? '核心代码',
      title: params.code.title ?? params.code.filename ?? '示例代码',
      subtitle: params.code.subtitle,
      code: {
        language: params.code.language,
        filename: params.code.filename,
        source: params.code.source,
      },
    })
  }

  slides.push({
    id: 'closing',
    kind: 'closing',
    title: params.closingTitle ?? '本节小结',
    points:
      params.closingPoints ?? [
        '待补充：三条必背要点',
        '待补充：一个高频误区',
        '待补充：回到题库巩固',
      ],
  })

  return slides
}

function placeholderLesson(
  id: string,
  title: string,
  short: string,
  summary: string,
  outline: string[],
  tags: string[] = [],
): CourseLesson {
  return {
    id,
    title,
    short,
    summary,
    tags,
    status: 'placeholder',
    slides: placeholderDeck(outline),
  }
}

function structuredLesson(params: {
  id: string
  title: string
  short: string
  summary: string
  tags?: string[]
  eyebrow: string
  coverTitle: string
  points: string[]
  sections?: Array<{
    title: string
    subtitle?: string
    columns?: 1 | 2
    placeholderCount?: number
  }>
  compare?: {
    title: string
    subtitle?: string
    leftTitle: string
    rightTitle: string
  }
  code?: CourseSlideCode & {
    title?: string
    eyebrow?: string
    subtitle?: string
  }
  closingTitle?: string
  closingPoints?: string[]
}): CourseLesson {
  return {
    id: params.id,
    title: params.title,
    short: params.short,
    summary: params.summary,
    tags: params.tags ?? [],
    status: 'placeholder',
    slides: structuredDeck({
      eyebrow: params.eyebrow,
      coverTitle: params.coverTitle,
      points: params.points,
      sections: params.sections,
      compare: params.compare,
      code: params.code,
      closingTitle: params.closingTitle,
      closingPoints: params.closingPoints,
    }),
  }
}

const WEEK4_DEMO = '/course-demos/week4'

export const COURSE_WEEKS: CourseWeek[] = [
  {
    id: 'week-1',
    index: 1,
    title: 'HTML 与 Git 起步',
    theme: '先把页面骨架和工作流搭起来',
    description:
      '课程概览、Git 基本协作与 HTML 文档结构，先把“页面写什么”和“怎么开始做”这两件事建立起来。',
    accent: 'amber',
    topics: ['html'],
    lessons: [
      {
        id: 'overview',
        title: '本周导览：从 Git 到 HTML 语义结构',
        short: '本周导览',
        summary:
          '先看 Week 1 的学习地图：工作流怎么启动、页面骨架怎么写、结构为什么要讲语义。',
        tags: ['导览', 'Git', 'HTML'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 1 · HTML 与 Git 起步',
            title: '先把页面骨架和工作流搭起来',
            subtitle:
              '这一周先别追求花哨效果。我们先解决两件最根本的事：怎么开始协作，页面到底由哪些最小结构组成。',
            points: [
              '先建立最小 Git 闭环',
              '写出合法的 HTML 文档骨架',
              '知道什么叫“有语义的结构”',
              '能正确处理链接、图片、列表、表格和代码文本',
            ],
          },
          {
            id: 'roadmap',
            kind: 'roadmap',
            eyebrow: 'Week 1 · 主线地图',
            title: '五个节点，搭起第一张网页',
            subtitle:
              'Git 负责工作流，HTML 负责结构。Week 1 的目标不是好看，而是写得对、读得懂、能持续往上加。',
            roadmap: [
              {
                label: '01',
                title: '课程概览与 Git',
                description: '把 clone -> edit -> commit -> push 这条最小协作线走通。',
              },
              {
                label: '02',
                title: 'HTML 文档结构',
                description: '按 doctype -> html -> head -> body 读懂一份完整页面。',
              },
              {
                label: '03',
                title: '结构表达与语义化',
                description: '在知道骨架后，再学会用标题层级和语义标签表达结构。',
              },
              {
                label: '04',
                title: '链接、图片与路径',
                description: '知道页面怎么互相跳转、资源怎么被正确引用。',
              },
              {
                label: '05',
                title: '列表、表格与代码标签',
                description: '掌握最常见的结构化内容表达方式。',
              },
            ],
          },
          {
            id: 'cards',
            kind: 'cards',
            eyebrow: 'Week 1 · 目录',
            title: '这一周每节都在补一个基础洞',
            subtitle:
              'Week 1 的知识点看起来很碎，但它们共同决定了你写出的页面是不是“合法、可维护、能继续往上长”。',
            cards: [
              {
                eyebrow: 'Lesson 1',
                title: '课程概览与 Git 入门',
                description: '理解评估方式、仓库协作和最小提交流程。',
                meta: '重点：clone / commit / push',
              },
              {
                eyebrow: 'Lesson 2',
                title: 'HTML 文档结构',
                description: '从 html 根节点一路看到 head、body 和页面语义骨架。',
                meta: '重点：doctype / html / head / body / meta',
              },
              {
                eyebrow: 'Lesson 3',
                title: '结构表达与语义化',
                description: '不要只会堆 div，要学会用标题层级和语义边界组织内容。',
                meta: '重点：h1-h6 / section / article / div / span',
              },
              {
                eyebrow: 'Lesson 4',
                title: '链接、图片与路径',
                description: '让页面和资源都能被正确找到。',
                meta: '重点：href / src / alt / 相对路径',
              },
              {
                eyebrow: 'Lesson 5',
                title: '列表、表格与代码标签',
                description: '把常见内容表达成规范结构，而不是乱堆文本。',
                meta: '重点：ul / ol / table / pre / code',
              },
            ],
          },
          {
            id: 'closing',
            kind: 'closing',
            eyebrow: '本周带走什么',
            title: '先把页面写对，再谈做漂亮',
            points: [
              'Git 让你能持续提交和协作；HTML 让你写出有结构的页面。',
              'Week 1 的所有内容都在为后面的 CSS 和 JavaScript 打地基。',
              '会写并不够，关键是写得合法、清晰、可维护。',
            ],
          },
        ],
      },
      {
        id: 'course-overview-git',
        title: '课程概览与 Git 入门',
        short: '课程概览与 Git',
        summary:
          '理解课程节奏、评估方式，以及最小可用的 Git 工作流，先把开发起点打通。',
        tags: ['课程概览', 'Git'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 1 · Lesson 1',
            title: '先建立最小开发闭环',
            subtitle:
              '第一节先回答两个问题：这门课到底怎么学，以及为什么所有网页开发都要从版本管理开始。',
            points: [
              '课程目标与学习方式',
              '为什么前端课从 Git 开始',
              '先把 pull / edit / add / commit / push 这套日常闭环走顺',
            ],
          },
          {
            id: 'workflow',
            kind: 'content',
            eyebrow: 'Lesson 1 · 工作流',
            title: '日常 Git 闭环长这样',
            subtitle:
              '第一次会先 clone 仓库；真正进入日常协作后，更常见的节奏是先 pull 最新代码，再修改、提交，最后 push 回去。',
            flow: [
              {
                label: '01',
                title: 'clone',
                description: '第一次把老师或团队的远端仓库复制到本地，得到一个可编辑工作区。',
              },
              {
                label: '02',
                title: 'pull',
                description: '开始动手前先同步远端最新版本，避免你在旧代码上继续改。',
              },
              {
                label: '03',
                title: 'edit',
                description: '修改 HTML、CSS 或 JS 文件，形成这次学习任务的最小变更。',
              },
              {
                label: '04',
                title: 'commit',
                description: '先 add 再 commit，给这次变更一个清晰快照，让你和别人都知道“为什么改了它”。',
              },
              {
                label: '05',
                title: 'push',
                description: '把本地提交同步回远端，形成可以共享和备份的版本记录。',
              },
            ],
            note: {
              tone: 'rule',
              label: '先记住',
              text: 'clone 通常只做一次；平时真正高频的是 pull -> edit -> add -> commit -> push 这条日常闭环。',
            },
          },
          {
            id: 'good-vs-bad-commit',
            kind: 'compare',
            eyebrow: 'Lesson 1 · 提交信息',
            title: '同样是提交，信息密度可以差很多',
            subtitle:
              'commit message 的价值，不在于“写了点什么”，而在于让未来的你和队友能快速知道为什么改。',
            compare: {
              leftTitle: '✗ 不好的提交',
              rightTitle: '✓ 更好的提交',
              left: {
                items: ['update', 'fix bug', 'final version', '改了一下'],
              },
              right: {
                items: [
                  'add week 1 html skeleton slides',
                  'fix broken image path in links demo',
                  'update table markup example for semantic headers',
                ],
              },
            },
          },
          {
            id: 'minimum-commands',
            kind: 'cards',
            eyebrow: 'Lesson 1 · 最小命令集',
            title: '现在先会这六个命令就够用了',
            subtitle:
              '这一节不追求背全 Git，而是先把最常用、最容易真的在作业里用到的 6 个命令分清楚。',
            cards: [
              {
                eyebrow: '同步远端',
                title: 'git pull',
                description: '开工前先拉最新版本，先对齐仓库，再开始改。',
                meta: '减少和远端脱节的概率。',
              },
              {
                eyebrow: '仓库状态',
                title: 'git status',
                description: '看哪些文件被改了、哪些还没被提交。',
                meta: '先看状态，再做下一步。',
              },
              {
                eyebrow: '查看差异',
                title: 'git diff',
                description: '看这次到底改了什么，不靠记忆。',
                meta: '提交前最好先看一眼。',
              },
              {
                eyebrow: '暂存改动',
                title: 'git add',
                description: '先把这次准备提交的文件放进暂存区，告诉 Git “这些要进下一次提交”。',
                meta: '它不是提交，只是先选中改动。',
              },
              {
                eyebrow: '创建提交',
                title: 'git commit',
                description: '把暂存区里的内容做成一次正式提交，并写清楚这次为什么改。',
                meta: '提交信息要说明“为什么”。',
              },
              {
                eyebrow: '同步远端',
                title: 'git push',
                description: '把本地提交同步回仓库。',
                meta: '形成共享版本记录。',
              },
            ],
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节先带走三句话',
            points: [
              '课程真正的目标不是“写完页面”，而是持续做出可解释、可维护的网页作品。',
              '第一次拿仓库会用 clone；日常协作更常走的是 pull -> edit -> add -> commit -> push。',
              '现在先掌握最小工作流，不必一开始就把 Git 学成命令百科全书。',
            ],
          },
        ],
      },
      {
        id: 'structure',
        title: 'HTML 文档结构',
        short: '文档结构',
        summary:
          '按 doctype、html、head、body 的真实顺序，自上而下拆开一份 HTML 文档，并建立 head 配置与 body 语义骨架的完整直觉。',
        tags: ['文档结构', 'head/body', '语义骨架'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 1 · Lesson 2',
            title: '先把整份 HTML 文档从上到下看一遍',
            subtitle:
              '学 HTML 不是背一串零散标签，而是先知道浏览器拿到文档后，会先看到什么、再理解什么、最后显示什么。',
            points: [
              'doctype / html / head / body 的顺序和职责',
              'head 里最基础的 meta / link / title',
              'body 里的常见结构、语义地标与元素类别',
            ],
          },
          {
            id: 'outline',
            kind: 'outline',
            title: '这一节回答这些问题',
            points: [
              '浏览器如何从 doctype 一路读到 body',
              'head 里最常见的 meta / link / title 各做什么',
              'body 里如何组织内容、地标和块级 / 行内元素',
            ],
          },
          {
            id: 'document-order',
            kind: 'content',
            eyebrow: 'Lesson 2 · 阅读顺序',
            title: '浏览器理解一份 HTML 文档，大致按这个顺序',
            flow: [
              {
                label: '01',
                title: '<!doctype html>',
                description: '先声明这是现代 HTML 文档，避免浏览器掉回旧时代的怪异模式。',
              },
              {
                label: '02',
                title: '<html>',
                description: '这是整份文档的根节点，所有 head 和 body 内容都被它包起来，lang 也通常写在这里。',
              },
              {
                label: '03',
                title: '<head>',
                description: '这部分主要放元信息，帮助浏览器、搜索引擎和设备理解这页怎么被解释和展示。',
              },
              {
                label: '04',
                title: '<body>',
                description: '页面真正呈现给用户看的内容都在这里，包括标题、段落、导航、主内容和页脚。',
              },
            ],
            note: {
              tone: 'rule',
              label: '先建立主线',
              text: '先分清“head 负责配置和说明”与“body 负责真实内容”，后面学到的很多标签才不会碎成记忆点。',
            },
          },
          {
            id: 'head-essentials',
            kind: 'content',
            eyebrow: 'Lesson 2 · head',
            title: '先看 head：它不是给用户读的，而是给浏览器读的',
            table: {
              headers: ['标签', '最常见写法', '它在解决什么问题'],
              rows: [
                ['meta charset', '<meta charset="utf-8" />', '告诉浏览器按什么编码读这份文档，避免乱码'],
                ['meta viewport', '<meta name="viewport" content="width=device-width, initial-scale=1" />', '让移动端按设备宽度渲染，而不是假装桌面页面'],
                ['title', '<title>Page title</title>', '定义浏览器标签名，也是搜索和收藏时最先看到的标题'],
                ['link', '<link rel="stylesheet" href="./styles.css" />', '把外部样式表等资源接进这份文档'],
              ],
            },
            note: {
              tone: 'tip',
              label: '先记这四个',
              text: 'Week 1 不需要把 head 所有标签背成百科，但 `charset`、`viewport`、`title`、`link` 这四个要先形成直觉。',
            },
          },
          {
            id: 'body-structure',
            kind: 'content',
            eyebrow: 'Lesson 2 · body',
            title: '再看 body：用户真正看到的内容，从这里开始',
            bullets: [
              {
                title: 'body 是显示区',
                text: '标题、段落、列表、图片、表单、表格和按钮等真正呈现在页面上的内容，都应该写在 body 里。',
              },
              {
                title: '先搭大结构',
                text: '常见页面会先分出 `header`、`nav`、`main`、`aside`、`footer` 这些大区域，再继续往里放内容。',
              },
              {
                title: '再分主题块',
                text: '`section` 常用来表达一个主题分区，`article` 常用来表达一块可以独立存在的内容。',
              },
              {
                title: '最后才回到通用容器',
                text: '当没有更准确语义时，再使用 `div` 和 `span` 这类通用容器，而不是一开始就全部用它们堆。',
              },
            ],
            note: {
              tone: 'rule',
              label: '阅读顺序',
              text: '先想“页面被切成哪些区域”，再想“每个区域里放哪些元素”，最后才考虑样式类名。',
            },
          },
          {
            id: 'block-inline',
            kind: 'content',
            eyebrow: 'Lesson 2 · 元素类别',
            title: 'body 里的元素，先建立块级和行内的基本直觉',
            table: {
              headers: ['类别', '常见标签', '默认表现', '最常承载什么'],
              rows: [
                ['块级元素', 'h1, p, div, section, article, ul', '默认独占一行，从上到下排开', '页面结构块、段落、列表、分区'],
                ['行内元素', 'a, span, strong, em, code', '默认和文字排在同一行', '词语强调、链接、局部说明、短代码'],
              ],
            },
            note: {
              tone: 'warn',
              label: '先有直觉就够',
              text: '这里先掌握“块级更像结构块、行内更像句子里的局部片段”。后面学 CSS 时，你会知道 `display` 可以改变它们的视觉表现。',
            },
          },
          {
            id: 'minimum-skeleton',
            kind: 'code',
            eyebrow: 'Lesson 2 · 完整骨架',
            title: '一份更像真实页面的 HTML 骨架，通常长这样',
            code: {
              language: 'html',
              filename: 'week1-structure.html',
              source: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>COMP6080 Week 1</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <header>
      <h1>HTML Structure Notes</h1>
      <nav>
        <a href="./index.html">Home</a>
        <a href="./week1.html">Week 1</a>
      </nav>
    </header>

    <main>
      <section>
        <h2>Document overview</h2>
        <p>This page has a valid HTML document structure.</p>
      </section>

      <article>
        <h2>Key takeaway</h2>
        <p>Head configures the page, body presents the page.</p>
      </article>
    </main>
  </body>
</html>`,
              highlightLines: [1, 2, 4, 5, 6, 8, 9, 16, 18],
            },
          },
          {
            id: 'structure-demo',
            kind: 'demo',
            eyebrow: 'Lesson 2 · live demo',
            title: 'live demo · HTML 文档骨架观察器',
            subtitle:
              '点几组预设，观察 doctype、title、head、body 缺失或简化后浏览器到底少了什么，再回到代码里把它补回来。',
            demo: {
              route: '/demos/week-1/html/document-skeleton',
              ctaLabel: '打开实验',
              objectives: [
                '观察 doctype / title / body 缺失时的差异',
                '建立从 head 到 body 的完整骨架直觉',
              ],
              note: '建议先点“移除 title”和“只保留 body”，再观察右侧结构提示卡，看哪些信息属于 head，哪些属于 body。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'HTML 文档不是一堆散标签，而是从 doctype 到 body 有明确层级顺序。',
              'head 负责配置和说明，body 负责真实内容与页面结构。',
              '写 body 时，先想区域和语义，再想块级 / 行内，再想样式。',
            ],
          },
        ],
      },
      {
        id: 'semantics',
        title: '结构表达与标题层级',
        short: '结构表达',
        summary:
          '在知道文档骨架之后，继续学习如何用标题层级、section/article 边界和 div/span 兜底策略，把结构写得更清楚。',
        tags: ['语义化', '标题层级', '结构表达'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 1 · Lesson 3',
            title: '结构写对之后，还要继续写清楚',
            subtitle:
              '上一节解决“页面由什么组成”，这一节继续解决“这些部分之间的层级和边界该怎么表达”。',
            points: [
              '标题层级 h1-h6 怎么组织',
              'section 和 article 分别在表达什么',
              '什么时候该优先用语义标签，什么时候退回 div / span',
            ],
          },
          {
            id: 'semantic-map',
            kind: 'content',
            eyebrow: 'Lesson 3 · 结构表达',
            title: '先把“页面区域”和“内容层级”两条线分开看',
            bullets: [
              {
                title: '区域线索',
                text: '`header`、`nav`、`main`、`aside`、`footer` 更像页面地标，帮助你切出大区域。',
              },
              {
                title: '层级线索',
                text: '`h1-h6` 表达的是标题层级，告诉读者和机器“谁是谁的上级标题”。',
              },
              {
                title: '主题线索',
                text: '`section` 用来组织一个主题块，`article` 用来表达一块可以独立存在或复用的内容。',
              },
              {
                title: '兜底线索',
                text: '如果真的找不到更准确的语义，再回到 `div` 和 `span` 这类通用容器。',
              },
            ],
          },
          {
            id: 'headings',
            kind: 'content',
            eyebrow: 'Lesson 3 · 标题层级',
            title: 'h1-h6 写的是结构层级，不是视觉大小',
            table: {
              headers: ['标签', '应该表达什么', '不要误用成什么'],
              rows: [
                ['h1', '整页或整块最核心标题', '只是想让字变大'],
                ['h2', 'h1 下一级主题', '跳过层级乱写'],
                ['h3-h6', '继续向下分层', '纯粹为了样式改层级'],
              ],
            },
            note: {
              tone: 'trap',
              label: '常见误会',
              text: '标题标签表达的是文档结构层级，不是视觉字号。字号应该交给 CSS 处理。',
            },
          },
          {
            id: 'section-article',
            kind: 'compare',
            eyebrow: 'Lesson 3 · 边界判断',
            title: 'section 和 article 很像，但表达的边界不同',
            subtitle:
              '`section` 更像“这个主题下的一块内容”，`article` 更像“单独拿出去也说得通的一篇内容或一个卡片单元”。',
            compare: {
              leftTitle: 'section 更像主题分区',
              rightTitle: 'article 更像独立内容',
              left: {
                items: [
                  '常见于课程页面中的“本周目标”“作业要求”“FAQ”分块',
                  '通常依附于整页上下文来理解',
                  '内部常常会再配一个 h2 / h3 标题',
                ],
              },
              right: {
                items: [
                  '常见于博客文章、新闻卡片、论坛帖子、商品卡片',
                  '单独摘出来通常仍然说得通',
                  '更强调“这是一个独立内容单元”',
                ],
              },
            },
          },
          {
            id: 'semantic-compare',
            kind: 'compare',
            eyebrow: 'Lesson 3 · 好坏对照',
            title: '同样的页面，用 div soup 和语义标签写出来差很多',
            subtitle:
              '“能显示出来”不代表“结构写对了”。更好的写法能让读代码、改代码、做无障碍都更轻松。',
            compare: {
              leftTitle: '✗ 全部用 div 堆起来',
              rightTitle: '✓ 用语义标签表达结构角色',
              left: {
                code: {
                  language: 'html',
                  source: `<div class="page">
  <div class="top">Quiz Hub</div>
  <div class="menu">Home · Courses · Practice</div>
  <div class="content">
    <div class="block">Week 1 notes</div>
  </div>
</div>`,
                },
              },
              right: {
                code: {
                  language: 'html',
                  source: `<header>Quiz Hub</header>
<nav>Home · Courses · Practice</nav>
<main>
  <section>
    <h1>Week 1 notes</h1>
  </section>
</main>`,
                },
              },
            },
          },
          {
            id: 'div-span-fallback',
            kind: 'content',
            eyebrow: 'Lesson 3 · 兜底策略',
            title: '什么时候该优先用语义标签，什么时候退回 div / span',
            table: {
              headers: ['场景', '优先考虑什么', '什么时候退回 div / span'],
              rows: [
                ['站点头部或栏目头部', 'header', '只是为了排版包一层，没有额外语义时可用 div'],
                ['导航链接区', 'nav', '只是局部按钮组、并非导航时可用 div'],
                ['页面主内容', 'main', '整页只应有一个 main，不要随便用 div 代替'],
                ['主题分块 / 独立内容', 'section / article', '单纯为了布局切列时可回到 div'],
                ['句子中的局部强调', 'a / strong / em / code', '没有更明确含义、只想包一小段文字时可用 span'],
              ],
            },
            note: {
              tone: 'tip',
              label: '一个判断口诀',
              text: '先问“它是什么角色”，再问“它长什么样子”。角色由 HTML 表达，样子交给 CSS。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '语义化不是装饰，而是在表达页面结构关系和内容边界。',
              '标题层级表达结构关系，字号和样式交给 CSS。',
              '有更合适标签时优先用语义标签，没有明确语义时再退回 div / span。',
            ],
          },
        ],
      },
      {
        id: 'links-images',
        title: '链接、图片与路径',
        short: '链接与图片',
        summary:
          '理解 a / img 的基本职责，搞清相对路径与绝对路径，并记住 alt 是图片语义的一部分。',
        tags: ['链接', '图片', '路径'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 1 · Lesson 4',
            title: '页面不仅要显示内容，还要能跳、能找、能说明',
            subtitle:
              '一张网页不是孤岛。链接负责把页面串起来，路径负责把资源找对，图片还要告诉读屏和加载失败时“它本来是什么”。',
            points: [
              'a 标签与 href 的基本写法',
              '相对路径 vs 绝对路径',
              'img / alt 与常见图像类型',
            ],
          },
          {
            id: 'link-basics',
            kind: 'content',
            eyebrow: 'Lesson 4 · 基础规则',
            title: '先分清链接和资源引用',
            bullets: [
              {
                title: 'a[href]',
                text: '告诉浏览器“点这里要跳去哪里”，它连的是页面或资源地址。',
              },
              {
                title: 'img[src]',
                text: '告诉浏览器“去哪里把图片取过来”，它连的是图像资源地址。',
              },
              {
                title: 'alt',
                text: '不是可有可无的备注，而是图片语义的一部分：加载失败和无障碍场景都依赖它。',
              },
            ],
          },
          {
            id: 'path-compare',
            kind: 'compare',
            eyebrow: 'Lesson 4 · 路径对照',
            title: '相对路径和绝对路径都能用，但语境完全不同',
            subtitle:
              '静态站点和课程作业里最常见的问题不是“不会写 img”，而是路径一旦移动目录就全断。',
            compare: {
              leftTitle: '相对路径：跟着当前文件走',
              rightTitle: '绝对路径：从站点根开始找',
              left: {
                code: {
                  language: 'html',
                  source: `<a href="./week-1.html">Week 1</a>
<img src="./images/hero.png" alt="课程封面" />`,
                },
                items: ['目录一变，引用关系也会变。', '更适合课程静态资源与 GitHub Pages 子路径环境。'],
              },
              right: {
                code: {
                  language: 'html',
                  source: `<a href="/courses/week-1">Week 1</a>
<img src="/assets/hero.png" alt="课程封面" />`,
                },
                items: ['永远从站点根开始找。', '在子路径部署里如果配置不对，最容易 404。'],
              },
            },
          },
          {
            id: 'links-code',
            kind: 'code',
            eyebrow: 'Lesson 4 · 最小证据',
            title: '链接、图片与说明文本',
            code: {
              language: 'html',
              filename: 'week1-links-images.html',
              source: `<nav>
  <a href="./practice.html">进入题库</a>
</nav>

<figure>
  <img src="./images/html-structure.png" alt="HTML 文档结构示意图" />
  <figcaption>Week 1 的页面骨架示意图。</figcaption>
</figure>`,
              highlightLines: [2, 6, 7],
            },
          },
          {
            id: 'links-demo',
            kind: 'demo',
            eyebrow: 'Lesson 4 · live demo',
            title: 'live demo · 路径与图片实验',
            subtitle:
              '切换相对路径、站点根路径和错误路径，直接看哪种能命中、哪种会 404，并观察 alt 在图片失效时怎样兜底。',
            demo: {
              route: '/demos/week-1/html/paths-and-images',
              ctaLabel: '打开实验',
              objectives: [
                '观察相对路径与绝对路径的差别',
                '观察图片加载失败时 alt 的作用',
              ],
              note: '建议先切换到“错误路径”，再看右侧资源状态面板。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '链接是页面之间的跳转关系，图片是资源引用关系，它们都依赖正确路径。',
              '相对路径更适合课程静态资源和子路径部署环境。',
              'alt 不是摆设，它决定图片失效或读屏时页面还能不能表达清楚。',
            ],
          },
        ],
      },
      {
        id: 'lists-tables',
        title: '列表、表格与预格式文本',
        short: '列表与表格',
        summary:
          '掌握最常见的结构化内容标签：什么时候用列表，什么时候用表格，什么时候用 pre / code 展示代码。',
        tags: ['列表', '表格'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 1 · Lesson 5',
            title: '让内容自己带结构，而不是靠排版凑出来',
            subtitle:
              '清单、成绩、代码片段都不是普通段落。HTML 里已经有现成的结构标签，关键是知道该用谁。',
            points: [
              'ol / ul / li 的语义差异',
              'table / thead / tbody / th 的职责',
              'pre / code 与等宽文本展示',
            ],
          },
          {
            id: 'list-rules',
            kind: 'content',
            eyebrow: 'Lesson 5 · 列表',
            title: '列表表达的是“同类项目的集合”',
            bullets: [
              {
                title: 'ul',
                text: '适合没有先后顺序的项目，例如功能点、标签、知识点清单。',
              },
              {
                title: 'ol',
                text: '适合有明确先后顺序的步骤，例如安装流程、提交流程。',
              },
              {
                title: 'li',
                text: '列表项必须包在 ul 或 ol 里，而不是单独散在页面上。',
              },
            ],
          },
          {
            id: 'table-compare',
            kind: 'compare',
            eyebrow: 'Lesson 5 · 表格',
            title: '表格用来表达“行列关系”，不是用来做页面布局',
            subtitle:
              '只要内容本质上不是二维表，就不要硬塞到 table 里。table 的价值在于明确表头和数据格的关系。',
            compare: {
              leftTitle: '✗ 把表格当布局工具',
              rightTitle: '✓ 用表头表达二维数据关系',
              left: {
                code: {
                  language: 'html',
                  source: `<table>
  <tr>
    <td>左边导航</td>
    <td>右边正文</td>
  </tr>
</table>`,
                },
              },
              right: {
                code: {
                  language: 'html',
                  source: `<table>
  <thead>
    <tr><th>Week</th><th>Topic</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>HTML</td></tr>
  </tbody>
</table>`,
                },
              },
            },
          },
          {
            id: 'lists-tables-code',
            kind: 'codes',
            eyebrow: 'Lesson 5 · 最小证据',
            title: '三种内容，三种最适合的标签',
            subtitle: '清单用列表，成绩用表格，代码片段用 pre / code。',
            codes: [
              {
                language: 'html',
                filename: 'week1-list.html',
                source: `<ol>
  <li>git clone</li>
  <li>edit files</li>
  <li>git commit</li>
</ol>`,
              },
              {
                language: 'html',
                filename: 'week1-table.html',
                source: `<table>
  <thead>
    <tr><th>Tag</th><th>Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td>h1</td><td>Main heading</td></tr>
  </tbody>
</table>`,
              },
              {
                language: 'html',
                filename: 'week1-code.html',
                source: `<pre><code>&lt;h1&gt;Hello&lt;/h1&gt;
&lt;p&gt;Week 1&lt;/p&gt;</code></pre>`,
              },
            ],
          },
          {
            id: 'lists-tables-demo',
            kind: 'demo',
            eyebrow: 'Lesson 5 · live demo',
            title: 'live demo · 列表、表格与代码标签实验',
            subtitle:
              '切换“清单 / 二维数据 / 代码片段”三种场景，观察哪种标签最贴切，以及结构不对时页面为什么会显得别扭。',
            demo: {
              route: '/demos/week-1/html/lists-tables-code',
              ctaLabel: '打开实验',
              objectives: [
                '区分列表、表格与代码片段的适用场景',
                '理解 table 的价值是表头与数据关系，而不是布局',
              ],
              note: '建议依次点击“流程清单”“成绩表”“代码片段”，再看结构说明。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '列表、表格和代码块分别表达三种完全不同的结构。',
              'table 的职责是表达二维数据，不是拿来做页面布局。',
              'pre / code 让代码展示保留格式，也让语义更准确。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'week-2',
    index: 2,
    title: 'CSS：样式、布局与响应式',
    theme: '让页面真正像一个产品',
    description:
      '从选择器、盒模型到 Flexbox、Grid、定位与响应式，把静态结构变成有层次的界面。',
    accent: 'sky',
    topics: ['css'],
    lessons: [
      {
        id: 'overview',
        title: '本周导览：从层叠到响应式',
        short: '本周导览',
        summary:
          'Week 2 讲的不是“背属性”，而是理解 CSS 如何决定谁生效、占多大、怎么排、怎么适配。',
        tags: ['导览', 'CSS', '布局'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 2 · CSS：样式、布局与响应式',
            title: '让页面真正像一个产品',
            subtitle:
              'Week 1 写出了结构，Week 2 开始让界面变得有层级、可阅读、能适配屏幕。重点不是背属性，而是理解浏览器怎么做样式决策。',
            points: [
              '知道哪条规则最终生效',
              '理解盒模型和尺寸占位',
              '掌握 Flex / Grid / 定位三种布局思路',
              '建立响应式和 DevTools 的调试直觉',
            ],
          },
          {
            id: 'roadmap',
            kind: 'roadmap',
            eyebrow: 'Week 2 · 主线地图',
            title: 'CSS 周的六个关键问题',
            subtitle:
              '如果把 CSS 看成“谁生效、占多大、怎么排、怎么适配”的连续回答，这一周的结构会清楚很多。',
            roadmap: [
              {
                label: '01',
                title: '选择器与层叠',
                description: '同一个元素被多条规则命中时，到底谁说了算。',
              },
              {
                label: '02',
                title: '盒模型与单位',
                description: '元素实际占多大，为什么加了 padding 会把布局撑开。',
              },
              {
                label: '03',
                title: 'Flexbox',
                description: '一维布局如何在主轴和交叉轴上对齐分配空间。',
              },
              {
                label: '04',
                title: 'Grid 与样式复用',
                description: '二维布局和抽象层带来的效率与边界。',
              },
              {
                label: '05',
                title: '定位与层叠',
                description: 'position、stacking context 和 z-index 如何共同决定视觉层级。',
              },
              {
                label: '06',
                title: '响应式与 DevTools',
                description: '让页面在不同屏幕宽度下持续可用。',
              },
            ],
          },
          {
            id: 'cards',
            kind: 'cards',
            eyebrow: 'Week 2 · 目录',
            title: '这一周每一课都在回答一个“样式决策”问题',
            cards: [
              {
                eyebrow: 'Lesson 1',
                title: '选择器与层叠优先级',
                description: '理解匹配命中后到底谁覆盖谁。',
                meta: '重点：specificity / cascade / inheritance',
              },
              {
                eyebrow: 'Lesson 2',
                title: '盒模型与单位',
                description: '理解元素真实占位与尺寸单位。',
                meta: '重点：content-box / border-box / rem / %',
              },
              {
                eyebrow: 'Lesson 3',
                title: 'Flexbox',
                description: '掌握最常用的一维布局方案。',
                meta: '重点：main axis / cross axis / flex-grow',
              },
              {
                eyebrow: 'Lesson 4',
                title: 'Grid 与样式复用',
                description: '知道什么时候自己写布局，什么时候借助框架。',
                meta: '重点：grid tracks / utility classes / trade-offs',
              },
              {
                eyebrow: 'Lesson 5',
                title: '定位与层叠',
                description: '解释看似“浮起来”的元素为什么会重叠或失效。',
                meta: '重点：position / z-index / stacking context',
              },
              {
                eyebrow: 'Lesson 6',
                title: '响应式与 DevTools',
                description: '把页面调到不同宽度下仍然清楚可用。',
                meta: '重点：viewport / media query / mobile first',
              },
            ],
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一周先带走三句话',
            points: [
              'CSS 的关键不是属性多，而是搞清浏览器如何做样式决策。',
              '布局能力来自盒模型、Flex/Grid 和定位三套机制的协同。',
              '响应式不是“最后补一个断点”，而是从一开始就考虑不同屏幕。',
            ],
          },
        ],
      },
      {
        id: 'selectors-cascade',
        title: '选择器与层叠优先级',
        short: '选择器与层叠',
        summary:
          '同一元素被多条规则命中时，先看匹配，再看优先级、来源顺序和继承。',
        tags: ['选择器', '优先级'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 2 · Lesson 1',
            title: '同一个元素，为什么最后长成这个样子',
            subtitle:
              '很多 CSS 问题不是“属性不会写”，而是写了多条规则却不知道最终哪条生效。先搞清 cascade，后面的调样式才会稳。',
            points: [
              '选择器类型与匹配范围',
              'specificity 和后写覆盖',
              '继承与 !important 的代价',
            ],
          },
          {
            id: 'selector-types',
            kind: 'content',
            eyebrow: 'Lesson 1 · 匹配入口',
            title: '先问：这条规则有没有命中',
            bullets: [
              { title: 'element selector', text: '直接匹配标签名，范围最大，约束最弱。' },
              { title: 'class selector', text: '最常见也最稳妥，表达“这个元素扮演某种样式角色”。' },
              { title: 'id selector', text: '优先级高，但复用性差，通常不适合作为通用样式入口。' },
              { title: 'compound selector', text: '选择器越具体，命中的条件越严，也更容易难以覆盖。' },
            ],
          },
          {
            id: 'cascade-rules',
            kind: 'content',
            eyebrow: 'Lesson 1 · 决策顺序',
            title: '浏览器决定谁生效，通常按这条线走',
            flow: [
              { label: '01', title: '先匹配', description: '规则没命中，后面优先级再高也没意义。' },
              { label: '02', title: '比 specificity', description: '越具体的选择器通常越难被覆盖。' },
              { label: '03', title: '看来源顺序', description: '优先级相同，就看谁写在后面。' },
              { label: '04', title: '最后才是继承', description: '没有直接声明时，部分属性才会继承父元素。' },
            ],
            note: {
              tone: 'rule',
              label: '调试口诀',
              text: '先确认命中，再比优先级，最后再看顺序和继承。',
            },
          },
          {
            id: 'cascade-compare',
            kind: 'compare',
            eyebrow: 'Lesson 1 · 对照',
            title: '写法越“用力”，后面越难维护',
            compare: {
              leftTitle: '✗ 过度依赖 id 与 !important',
              rightTitle: '✓ 以类名为主，保持可覆盖',
              left: {
                code: {
                  language: 'css',
                  source: `#hero-title {
  color: red !important;
}`,
                },
                items: ['短期有效，长期很难覆盖。'],
              },
              right: {
                code: {
                  language: 'css',
                  source: `.hero-title {
  color: var(--ink-strong);
}`,
                },
                items: ['默认更容易复用，也更容易在局部覆盖。'],
              },
            },
          },
          {
            id: 'cascade-demo',
            kind: 'demo',
            eyebrow: 'Lesson 1 · live demo',
            title: 'live demo · 选择器与层叠检视器',
            subtitle:
              '切换不同规则顺序和选择器强度，直接看同一个按钮最后为什么变成那种颜色和边框。',
            demo: {
              route: '/demos/week-2/css/cascade-inspector',
              ctaLabel: '打开实验',
              objectives: [
                '观察 specificity 与后写覆盖的差异',
                '确认 !important 为什么会把后续维护变难',
              ],
              note: '建议先保持同类选择器，只改顺序；再切换到 id / !important 观察跳变。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'CSS 先看命中，再比优先级，最后看顺序和继承。',
              '类名通常是最稳妥的样式入口，id 和 !important 要谨慎。',
              '调样式时先定位“哪条规则赢了”，再决定怎么改。',
            ],
          },
        ],
      },
      {
        id: 'box-model',
        title: '盒模型与单位',
        short: '盒模型',
        summary:
          '元素的真实占位由 content、padding、border、margin 共同决定，单位选择会直接影响响应式表现。',
        tags: ['盒模型', '单位'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 2 · Lesson 2',
            title: '元素到底占多大，不是只看 width',
            subtitle:
              '很多布局被撑坏，根因都是盒模型没想清楚。写了 width 只是开始，真正占位还要算 padding、border 和 margin。',
            points: [
              '盒模型四层结构',
              'box-sizing 的作用',
              'px / rem / % 的取舍',
            ],
          },
          {
            id: 'box-layers',
            kind: 'content',
            eyebrow: 'Lesson 2 · 四层结构',
            title: '从里到外看一层层加出来的空间',
            bullets: [
              { title: 'content', text: '真正承载文字或图片的内容区。' },
              { title: 'padding', text: '内容和边框之间的内边距，会把视觉盒子撑大。' },
              { title: 'border', text: '边框宽度同样会计入最终占位。' },
              { title: 'margin', text: '和外部元素拉开的距离，不属于盒子本体但影响排布。' },
            ],
          },
          {
            id: 'box-sizing-compare',
            kind: 'compare',
            eyebrow: 'Lesson 2 · 对照',
            title: 'content-box 与 border-box 的思维方式完全不同',
            compare: {
              leftTitle: 'content-box',
              rightTitle: 'border-box',
              left: {
                code: {
                  language: 'css',
                  source: `.card {
  width: 320px;
  padding: 24px;
  border: 2px solid #0f766e;
}`,
                },
                items: ['最终宽度会超过 320px。'],
              },
              right: {
                code: {
                  language: 'css',
                  source: `.card {
  box-sizing: border-box;
  width: 320px;
  padding: 24px;
}`,
                },
                items: ['padding / border 被算进 320px，更适合产品级布局。'],
              },
            },
          },
          {
            id: 'units',
            kind: 'content',
            eyebrow: 'Lesson 2 · 单位',
            title: '选单位，其实是在决定“谁跟着谁变”',
            table: {
              headers: ['单位', '适合什么', '常见提醒'],
              rows: [
                ['px', '精确控制边框、阴影、细节尺寸', '非常稳定，但适配弹性弱。'],
                ['rem', '全局字号与间距体系', '跟着根字号变，适合设计系统。'],
                ['%', '相对父容器占比', '很适合流式布局，但依赖父级尺寸。'],
              ],
            },
          },
          {
            id: 'box-demo',
            kind: 'demo',
            eyebrow: 'Lesson 2 · live demo',
            title: 'live demo · 盒模型实验室',
            subtitle:
              '拖动 padding、border 和 box-sizing，直接看卡片宽度、内容区和外部占位如何一起变化。',
            demo: {
              route: '/demos/week-2/css/box-model-lab',
              ctaLabel: '打开实验',
              objectives: [
                '观察 padding / border 如何改变最终占位',
                '理解 border-box 为什么更适合稳定布局',
              ],
              note: '建议先固定 width，只改 padding 和 box-sizing。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '真实占位从来不只看 width，还要看 padding、border 和 margin。',
              '大多数产品布局更适合用 border-box。',
              '选单位时要想清楚它应该跟谁联动变化。',
            ],
          },
        ],
      },
      {
        id: 'flexbox',
        title: 'Flexbox 布局',
        short: 'Flexbox',
        summary:
          '一维布局优先考虑 Flexbox，重点理解主轴、交叉轴、对齐方式和剩余空间分配。',
        tags: ['Flexbox', '布局'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 2 · Lesson 3',
            title: '一排东西怎么排整齐，Flexbox 是首选',
            subtitle:
              '按钮条、卡片行、工具栏、表单行，很多常见 UI 都是“一维布局”问题。Flexbox 正是为这种场景准备的。',
            points: [
              '主轴与交叉轴',
              'justify-content / align-items',
              'flex-grow / shrink / basis',
            ],
          },
          {
            id: 'axes',
            kind: 'content',
            eyebrow: 'Lesson 3 · 两根轴',
            title: '先认清主轴和交叉轴',
            bullets: [
              { title: 'main axis', text: '元素默认沿主轴排布，row 时是横向，column 时是纵向。' },
              { title: 'cross axis', text: '与主轴垂直的那根轴，决定另一方向上的对齐。' },
              { title: 'justify-content', text: '控制主轴上怎么分配剩余空间。' },
              { title: 'align-items', text: '控制交叉轴上的对齐。' },
            ],
          },
          {
            id: 'flex-compare',
            kind: 'compare',
            eyebrow: 'Lesson 3 · 常见误区',
            title: '别把“横向分布”和“纵向对齐”弄反',
            compare: {
              leftTitle: '✗ 混淆轴向',
              rightTitle: '✓ 先定 flex-direction 再想对齐',
              left: {
                items: [
                  'row 下 justify-content 控制左右分布。',
                  'row 下 align-items 控制上下对齐。',
                  'column 时这两个概念会反过来。',
                ],
              },
              right: {
                code: {
                  language: 'css',
                  source: `.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
                },
              },
            },
          },
          {
            id: 'flex-growth',
            kind: 'code',
            eyebrow: 'Lesson 3 · 最小证据',
            title: '剩余空间如何分配',
            code: {
              language: 'css',
              filename: 'week2-flex.css',
              source: `.sidebar {
  flex: 0 0 240px;
}

.content {
  flex: 1 1 auto;
}`,
              highlightLines: [2, 6],
            },
          },
          {
            id: 'flex-demo',
            kind: 'demo',
            eyebrow: 'Lesson 3 · live demo',
            title: 'live demo · Flex 对齐工作台',
            subtitle:
              '切换 justify-content、align-items、flex-grow 和 shrink，直接看工具栏和卡片行如何重新分配空间。',
            demo: {
              route: '/demos/week-2/css/flex-alignment',
              ctaLabel: '打开实验',
              objectives: [
                '比较 justify-content / align-items 的差异',
                '观察 flex-grow / shrink 带来的布局变化',
              ],
              note: '建议先保持 row，只切对齐；再慢慢改 grow / shrink 看剩余空间分配。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'Flexbox 解决的是一维布局问题，先想“沿哪根轴排”。',
              'justify-content 管主轴，align-items 管交叉轴。',
              'grow / shrink / basis 决定剩余空间如何分配和压缩。',
            ],
          },
        ],
      },
      {
        id: 'grid-frameworks',
        title: 'CSS Grid、框架与样式复用',
        short: 'Grid 与框架',
        summary:
          'Grid 更擅长二维布局，而样式复用与框架引入则是在讨论抽象层的收益和边界。',
        tags: ['Grid', 'CSS Framework'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 2 · Lesson 4',
            title: '二维布局和样式抽象，什么时候值得上',
            subtitle:
              '不是所有布局都该用 Grid，也不是所有项目都该引框架。这一节核心是判断“什么时候值得”。',
            points: [
              'Grid 的行列思维',
              '什么时候用 Grid，什么时候用 Flex',
              '框架与样式复用的收益和代价',
            ],
          },
          {
            id: 'grid-core',
            kind: 'content',
            eyebrow: 'Lesson 4 · Grid',
            title: 'Grid 适合同时控制行和列',
            bullets: [
              { title: 'grid container', text: '先定义行列轨道，再把子项放进网格。' },
              { title: 'tracks and gaps', text: '轨道大小和间距一起决定整体节奏。' },
              { title: 'use cases', text: '看板、卡片墙、仪表盘这类二维排布更适合 Grid。' },
            ],
            note: {
              tone: 'tip',
              label: '经验',
              text: '如果你主要在想“一排元素怎么对齐”，优先用 Flex；如果你同时在想“几行几列怎么安排”，再考虑 Grid。',
            },
          },
          {
            id: 'grid-code',
            kind: 'code',
            eyebrow: 'Lesson 4 · 最小证据',
            title: '一个最小 Grid 例子',
            code: {
              language: 'css',
              filename: 'week2-grid.css',
              source: `.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}`,
              highlightLines: [1, 2, 3],
            },
          },
          {
            id: 'grid-framework-compare',
            kind: 'compare',
            eyebrow: 'Lesson 4 · 抽象取舍',
            title: '自己写样式和借助框架，各赢在哪',
            compare: {
              leftTitle: '自己写 CSS',
              rightTitle: '借助框架 / utility',
              left: {
                items: ['控制力强，更贴项目语义。', '前期更慢，但长期可塑性更高。'],
              },
              right: {
                items: ['起步更快，组合速度高。', '抽象层会带来约束，需要理解它的规则。'],
              },
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'Grid 适合二维布局，Flex 更适合一维布局。',
              '框架不是魔法，它是在速度和控制力之间做取舍。',
              '样式复用的目标是减少重复，而不是让类名越堆越多。',
            ],
          },
        ],
      },
      {
        id: 'positioning-stacking',
        title: '定位、z-index 与视觉层级',
        short: '定位与层叠',
        summary:
          'position 改变的是元素脱离普通文档流的方式，而 z-index 只有在合适的上下文里才会生效。',
        tags: ['定位', '层叠上下文'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 2 · Lesson 5',
            title: '元素为什么浮起来了，又为什么压不过去',
            subtitle:
              '定位与层叠问题看起来像“玄学”，其实都有固定原因：先看 position， 再看 stacking context。',
            points: [
              '五种 position 的差异',
              'stacking context 如何形成',
              'z-index 为什么有时看起来失效',
            ],
          },
          {
            id: 'position-types',
            kind: 'content',
            eyebrow: 'Lesson 5 · 定位类型',
            title: '先分清元素有没有脱离普通流',
            table: {
              headers: ['position', '发生了什么', '最常见场景'],
              rows: [
                ['static', '默认文档流', '普通内容块'],
                ['relative', '保留原位置，再做相对偏移', '给 absolute 子元素提供定位参考'],
                ['absolute', '脱离普通流，相对最近定位祖先定位', '徽标、角标、浮层'],
                ['fixed', '相对视口固定', '固定操作按钮、吸顶工具'],
                ['sticky', '在阈值前后切换文档流 / 固定感', '分组标题、粘性栏'],
              ],
            },
          },
          {
            id: 'stacking-flow',
            kind: 'content',
            eyebrow: 'Lesson 5 · 层叠路径',
            title: 'z-index 不是全局开战，而是在上下文里比赛',
            flow: [
              { label: '01', title: '元素先有定位或新上下文', description: '没有合适上下文时，z-index 常常没有你以为的效果。' },
              { label: '02', title: '比较同一 stacking context 内的层级', description: '只在同一上下文里直接比较大小。' },
              { label: '03', title: '父级上下文会整体参与排序', description: '子元素再高，也跳不出父级被压住的命运。' },
            ],
            note: {
              tone: 'trap',
              label: '典型误会',
              text: 'z-index: 9999 也不代表一定在最上层，先看它是不是被困在更低的 stacking context 里。',
            },
          },
          {
            id: 'position-compare',
            kind: 'compare',
            eyebrow: 'Lesson 5 · 对照',
            title: '同样是“浮层”，不同定位方式的参考系完全不同',
            compare: {
              leftTitle: 'absolute',
              rightTitle: 'fixed / sticky',
              left: {
                items: ['跟着最近定位祖先走。', '父容器一变，位置也会跟着变。'],
              },
              right: {
                items: ['fixed 相对视口，sticky 介于流内和固定之间。', '更适合工具栏、粘性标题和悬浮操作。'],
              },
            },
          },
          {
            id: 'position-demo',
            kind: 'demo',
            eyebrow: 'Lesson 5 · live demo',
            title: 'live demo · 定位与层叠实验',
            subtitle:
              '切换 relative / absolute / sticky 和不同 z-index 组合，直接看元素为什么会遮住彼此，或者为什么压不过去。',
            demo: {
              route: '/demos/week-2/css/position-stacking',
              ctaLabel: '打开实验',
              objectives: [
                '观察不同 position 的参考系差异',
                '理解 z-index 需要放回 stacking context 里看',
              ],
              note: '建议先只改 position，再开始改 z-index，避免把两个变量混在一起看。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'position 决定元素怎样脱离或保留在普通文档流里。',
              'z-index 只在合适的上下文里比较，不能脱离 stacking context 单独看。',
              '定位问题要先看参考系，再看层叠顺序。',
            ],
          },
        ],
      },
      {
        id: 'responsive-viewport',
        title: '移动端、媒体查询与开发者工具',
        short: '响应式与 DevTools',
        summary:
          '响应式不是最后补救，而是从视口、断点和内容优先级一起考虑；DevTools 则是最快的验证现场。',
        tags: ['响应式', 'viewport', 'DevTools'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 2 · Lesson 6',
            title: '页面在不同宽度下还能不能继续好用',
            subtitle:
              '响应式的本质不是“手机上别炸”，而是让内容层级、布局方式和操作路径在不同屏幕下都保持清楚。',
            points: [
              'viewport meta 的作用',
              '媒体查询与断点命中',
              '移动优先与 DevTools 调试',
            ],
          },
          {
            id: 'viewport-basics',
            kind: 'content',
            eyebrow: 'Lesson 6 · 入口',
            title: '没有 viewport，移动端起点就不对',
            bullets: [
              { title: 'meta viewport', text: '告诉移动端浏览器按设备宽度解释页面，而不是先缩小整页。' },
              { title: 'breakpoints', text: '断点不是设备清单，而是内容什么时候撑不下去。' },
              { title: 'mobile first', text: '先保证窄屏成立，再逐步加宽屏增强。' },
            ],
          },
          {
            id: 'breakpoint-flow',
            kind: 'content',
            eyebrow: 'Lesson 6 · 断点逻辑',
            title: '媒体查询命中时，浏览器大致按这个思路工作',
            flow: [
              { label: '01', title: '先应用基础样式', description: '不在媒体查询里的规则默认先成立。' },
              { label: '02', title: '检查当前 viewport 宽度', description: '浏览器判断哪些断点条件被命中。' },
              { label: '03', title: '命中的规则继续覆盖', description: '后写且命中的断点规则会在基础样式之上生效。' },
            ],
          },
          {
            id: 'responsive-code',
            kind: 'code',
            eyebrow: 'Lesson 6 · 最小证据',
            title: '从单列到双列的最小媒体查询',
            code: {
              language: 'css',
              filename: 'week2-responsive.css',
              source: `.cards {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}`,
              highlightLines: [1, 2, 5, 7],
            },
          },
          {
            id: 'responsive-demo',
            kind: 'demo',
            eyebrow: 'Lesson 6 · live demo',
            title: 'live demo · 响应式断点实验',
            subtitle:
              '切换不同 viewport 宽度和断点规则，观察卡片列表什么时候换列、字号什么时候收缩，以及 DevTools 应该盯哪里看。',
            demo: {
              route: '/demos/week-2/css/responsive-breakpoints',
              ctaLabel: '打开实验',
              objectives: [
                '观察断点命中前后布局如何变化',
                '理解移动优先为什么更容易维护',
              ],
              note: '建议先保持默认窄屏，再切到 768 / 1024 宽度观察布局切换。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '响应式从 viewport 起步，不是最后硬补几个断点。',
              '断点应该跟内容压力走，而不是死背设备型号。',
              'DevTools 是最快的断点验证现场，要学会用它看宽度、盒模型和命中规则。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'week-3',
    index: 3,
    title: 'JavaScript 与浏览器基础',
    theme: '让页面开始响应用户',
    description:
      '先建立 JavaScript 语言直觉，再进入 DOM、事件、表单与本地存储，完成浏览器端的第一轮闭环。',
    accent: 'yellow',
    topics: ['javascript'],
    lessons: [
      {
        id: 'overview',
        title: '本周导览：让页面开始响应用户',
        short: '本周导览',
        summary:
          'Week 3 把页面从“静态结构”推进到“会响应、会记住、会处理输入”的状态。',
        tags: ['导览', 'JavaScript', '浏览器'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · JavaScript 与浏览器基础',
            title: '让页面开始响应用户',
            subtitle:
              '这一周的主线不是背语法点，而是建立浏览器行为层：写 JS、找 DOM、绑事件、处理表单、把状态存起来。',
            points: [
              '先建立 JavaScript 基础直觉',
              '理解函数、闭包和浏览器生态',
              '进入 DOM / events / forms / storage 闭环',
              '为 Week 4 的异步和网络打前置基础',
            ],
          },
          {
            id: 'roadmap',
            kind: 'roadmap',
            eyebrow: 'Week 3 · 主线地图',
            title: '从语言基础一路走到浏览器交互',
            roadmap: [
              {
                label: '01',
                title: 'JS 语法',
                description: '建立变量、类型、表达式和对象数组的基础执行直觉。',
              },
              {
                label: '02',
                title: '函数与闭包',
                description: '理解函数是一等公民，以及闭包为什么能“记住”外部变量。',
              },
              {
                label: '03',
                title: 'Node / npm',
                description: '理解浏览器 JS、运行时和包管理之间的关系。',
              },
              {
                label: '04',
                title: 'DOM',
                description: '把页面当成一棵树来查询和修改。',
              },
              {
                label: '05',
                title: 'Events',
                description: '理解点击、冒泡和事件委托。',
              },
              {
                label: '06',
                title: 'Forms',
                description: '读取输入、阻止默认提交并给出即时反馈。',
              },
              {
                label: '07',
                title: 'localStorage',
                description: '让页面在刷新后还能记住状态。',
              },
            ],
          },
          {
            id: 'cards',
            kind: 'cards',
            eyebrow: 'Week 3 · 目录',
            title: '这一周从语言层走到页面行为层',
            cards: [
              {
                eyebrow: 'Lesson 1',
                title: 'JavaScript 语法',
                description: '建立变量、类型、对象和数组的基本读写直觉。',
                meta: '重点：表达式、对象、数组、弱类型',
              },
              {
                eyebrow: 'Lesson 2',
                title: '函数与闭包',
                description: '理解函数作为参数 / 返回值，以及闭包如何记住外部变量。',
                meta: '重点：scope / closure / callback',
              },
              {
                eyebrow: 'Lesson 3',
                title: 'Node 与 npm',
                description: '建立运行时、包管理和工程生态认知。',
                meta: '重点：browser vs node / package.json',
              },
              {
                eyebrow: 'Lesson 4-7',
                title: 'DOM、事件、表单与存储',
                description: '把 JS 真正接到浏览器页面上，让内容动起来并能记住状态。',
                meta: '重点：query / listen / validate / persist',
              },
            ],
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一周先带走三句话',
            points: [
              'JavaScript 不只是语法，而是页面行为层。',
              '浏览器里的交互闭环大致是：查 DOM -> 绑事件 -> 处理输入 -> 更新状态。',
              '学完 Week 3，页面不再只是“显示内容”，而会真正响应用户。',
            ],
          },
        ],
      },
      {
        id: 'js-intro-syntax',
        title: 'JavaScript 语言特性与语法',
        short: 'JS 语法基础',
        summary:
          '从变量、类型、对象、数组和表达式入手，建立 JavaScript 与其他语言不同的执行直觉。',
        tags: ['JavaScript', 'Syntax'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · Lesson 1',
            title: '先别急着碰 DOM，先会读 JavaScript',
            subtitle:
              '很多浏览器交互问题，根因其实不是 DOM 不会，而是 JavaScript 数据和语句模型没建立起来。',
            points: [
              '变量、类型与弱类型直觉',
              '对象、数组和函数值',
              '语句、表达式与常见语法坑',
            ],
          },
          {
            id: 'types',
            kind: 'content',
            eyebrow: 'Lesson 1 · 类型',
            title: 'JavaScript 的“灵活”常常也是坑点来源',
            bullets: [
              { title: 'dynamic typing', text: '变量本身不固定类型，值才携带类型。' },
              { title: 'truthy / falsy', text: '条件判断里不只是真假布尔值在起作用。' },
              { title: 'objects and arrays', text: '对象和数组都是引用值，改动时要有共享意识。' },
            ],
            note: {
              tone: 'trap',
              label: '常见误会',
              text: '“看起来像数字的字符串”并不会自动变成你想要的数字，比较和拼接时尤其容易出事。',
            },
          },
          {
            id: 'syntax-compare',
            kind: 'compare',
            eyebrow: 'Lesson 1 · 对照',
            title: '语句能跑，不代表表达式就清楚',
            compare: {
              leftTitle: '✗ 混着写，读起来很难',
              rightTitle: '✓ 先拆出中间值，再表达意图',
              left: {
                code: {
                  language: 'javascript',
                  source: `if (input.value && Number(input.value) > 0) {
  total = total + Number(input.value)
}`,
                },
              },
              right: {
                code: {
                  language: 'javascript',
                  source: `const amount = Number(input.value)

if (Number.isFinite(amount) && amount > 0) {
  total += amount
}`,
                },
              },
            },
          },
          {
            id: 'syntax-code',
            kind: 'code',
            eyebrow: 'Lesson 1 · 最小证据',
            title: '对象和数组是浏览器状态管理的基础材料',
            code: {
              language: 'javascript',
              filename: 'week3-syntax.js',
              source: `const user = {
  name: 'Ada',
  skills: ['HTML', 'CSS', 'JavaScript'],
}

const firstSkill = user.skills[0]`,
              highlightLines: [1, 3, 6],
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'JavaScript 变量是动态的，值的类型才决定后续行为。',
              '对象和数组会在后面的 DOM、表单和存储里反复出现。',
              '先把中间值拆清楚，代码会比一口气写到底更稳。',
            ],
          },
        ],
      },
      {
        id: 'functions-closures',
        title: '高级函数与闭包',
        short: '函数与闭包',
        summary:
          '函数可以作为参数和返回值，而闭包会把外层作用域中的变量一起记住。',
        tags: ['函数', '闭包'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · Lesson 2',
            title: '函数不只是“写一段逻辑”，它还能被传来传去',
            subtitle:
              '一旦理解函数是一等公民，回调、事件监听、Promise 和闭包都会顺很多。',
            points: [
              '函数作为参数和返回值',
              '作用域链与闭包',
              '闭包的实际使用场景',
            ],
          },
          {
            id: 'function-values',
            kind: 'content',
            eyebrow: 'Lesson 2 · 函数值',
            title: '函数可以像其他值一样被传递',
            bullets: [
              { title: 'as argument', text: '事件监听和数组方法都会把函数当参数传进去。' },
              { title: 'as return value', text: '一个函数可以返回另一个函数，常见于工厂函数和封装状态。' },
              { title: 'closure', text: '返回出来的函数会连同外层变量一起被保留下来。' },
            ],
          },
          {
            id: 'closure-flow',
            kind: 'content',
            eyebrow: 'Lesson 2 · 闭包路径',
            title: '闭包不是魔法，只是函数把环境也一起带走了',
            flow: [
              { label: '01', title: '创建外层变量', description: '比如 count、prefix 或某个配置值。' },
              { label: '02', title: '定义内层函数', description: '内层函数引用了这些外层变量。' },
              { label: '03', title: '把内层函数返回或保存出去', description: '函数离开了原来的定义位置。' },
              { label: '04', title: '后续调用时仍能访问旧变量', description: '这就是“记住了外部环境”。' },
            ],
          },
          {
            id: 'closure-demo',
            kind: 'demo',
            eyebrow: 'Lesson 2 · live demo',
            title: 'live demo · 闭包快照实验',
            subtitle:
              '点几次按钮，观察同一个外层变量怎样被多次调用的内层函数持续记住。',
            demo: {
              route: '/demos/week-3/javascript/closure-snapshot',
              ctaLabel: '打开实验',
              objectives: [
                '观察闭包如何记住外层变量',
                '区分“重新创建函数”和“继续调用旧函数”的差别',
              ],
              note: '建议先连续点“继续调用”，再点“重置计数器”看环境切换。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '函数可以像值一样传递，这是很多浏览器 API 的基础。',
              '闭包本质上是“函数 + 它记住的外层环境”。',
              '理解闭包后，事件监听、回调和模块封装都会更容易读懂。',
            ],
          },
        ],
      },
      {
        id: 'ecosystem-npm',
        title: 'JavaScript 生态、Node 与 npm',
        short: '生态与 npm',
        summary:
          '理解浏览器 JS、Node.js、npm 与 package.json 各自处于什么位置，建立最小工程生态认知。',
        tags: ['Node.js', 'npm', '生态'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · Lesson 3',
            title: '前端不只有语言，还有运行时和工程生态',
            subtitle:
              '浏览器能跑 JavaScript，但项目为什么还要 Node、npm、package.json？这一节先把角色分清。',
            points: [
              '浏览器 JS vs Node.js',
              'npm 的作用',
              '依赖安装与 package.json',
            ],
          },
          {
            id: 'runtime-flow',
            kind: 'content',
            eyebrow: 'Lesson 3 · 角色地图',
            title: '从写代码到跑起来，中间其实经过这些角色',
            flow: [
              { label: '01', title: '你写源代码', description: '项目里会有自己的 JS、CSS、配置和依赖声明。' },
              { label: '02', title: 'npm 管理依赖', description: '根据 package.json 安装和记录外部包。' },
              { label: '03', title: 'Node 跑工具链', description: '构建、测试、打包通常都在 Node 环境里执行。' },
              { label: '04', title: '浏览器运行最终页面', description: '用户真正交互的是浏览器里的输出结果。' },
            ],
          },
          {
            id: 'browser-node-compare',
            kind: 'compare',
            eyebrow: 'Lesson 3 · 对照',
            title: '浏览器 JS 和 Node.js 都跑 JavaScript，但职责不同',
            compare: {
              leftTitle: '浏览器',
              rightTitle: 'Node.js',
              left: {
                items: ['直接操作 DOM、事件、表单和网络请求。', '面向用户交互。'],
              },
              right: {
                items: ['跑构建工具、测试脚本和服务器程序。', '面向开发流程与服务端环境。'],
              },
            },
          },
          {
            id: 'package-code',
            kind: 'code',
            eyebrow: 'Lesson 3 · 最小证据',
            title: '一个最小 package.json 在声明什么',
            code: {
              language: 'json',
              filename: 'package.json',
              source: `{
  "name": "comp6080-quizs",
  "scripts": {
    "dev": "vite",
    "test": "vitest run"
  }
}`,
              highlightLines: [2, 4, 5],
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '浏览器 JS 面向交互，Node.js 面向运行工具链和服务。',
              'npm 的价值是管理依赖和脚本，而不是“只是一个安装命令”。',
              '理解这层生态后，前端项目目录和脚本就不会再显得神秘。',
            ],
          },
        ],
      },
      {
        id: 'dom',
        title: 'DOM 查询与操作',
        short: 'DOM 操作',
        summary:
          '把页面看成树，通过 querySelector、classList、textContent 等 API 查找和修改节点。',
        tags: ['DOM', '查询'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · Lesson 4',
            title: '页面不是一张图片，而是一棵可被修改的树',
            subtitle:
              '一旦把 DOM 看成节点树，查找、修改、插入这些操作就会比“记 API”容易得多。',
            points: [
              'querySelector / querySelectorAll',
              '创建与插入节点',
              '修改属性、类名与文本',
            ],
          },
          {
            id: 'dom-queries',
            kind: 'content',
            eyebrow: 'Lesson 4 · 查询',
            title: '先找到节点，再谈修改',
            bullets: [
              { title: 'querySelector', text: '只拿第一项，适合明确知道只要一个目标元素。' },
              { title: 'querySelectorAll', text: '返回节点列表，适合批量处理一组元素。' },
              { title: 'textContent / classList', text: '是最常见的“改文字”和“改状态”入口。' },
            ],
          },
          {
            id: 'dom-compare',
            kind: 'compare',
            eyebrow: 'Lesson 4 · 对照',
            title: '先拿准对象，再改内容会更稳',
            compare: {
              leftTitle: '✗ 选择太宽泛',
              rightTitle: '✓ 用更明确的选择器和变量名',
              left: {
                code: {
                  language: 'javascript',
                  source: `const el = document.querySelector('div')
el.textContent = 'Updated'`,
                },
              },
              right: {
                code: {
                  language: 'javascript',
                  source: `const titleEl = document.querySelector('.profile-title')
titleEl.textContent = 'Updated'`,
                },
              },
            },
          },
          {
            id: 'dom-demo',
            kind: 'demo',
            eyebrow: 'Lesson 4 · live demo',
            title: 'live demo · DOM 查询实验',
            subtitle:
              '分别切换单个查询、批量查询和 classList 修改，直接看页面节点状态如何被改写。',
            demo: {
              route: '/demos/week-3/javascript/dom-query',
              ctaLabel: '打开实验',
              objectives: [
                '比较 querySelector / querySelectorAll 的返回值',
                '观察 classList / textContent 的修改结果',
              ],
              note: '建议先点“单个标题”，再点“全部项目”看批量修改差异。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'DOM 是一棵节点树，先找准节点，再决定如何修改。',
              'querySelector 和 querySelectorAll 的差别会直接影响后续代码写法。',
              'textContent、classList 和属性修改是最常用的页面更新入口。',
            ],
          },
        ],
      },
      {
        id: 'events',
        title: '事件与事件委托',
        short: '事件',
        summary:
          '理解点击、输入和冒泡流程，以及为什么动态列表里经常用事件委托。',
        tags: ['事件', '事件委托'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · Lesson 5',
            title: '页面为什么能“听到”点击和输入',
            subtitle:
              '用户操作不是神秘触发的，它们会以事件的形式沿着页面结构传播，监听器只是把某一步拦下来处理。',
            points: [
              '事件流与冒泡',
              'addEventListener 与事件对象',
              '事件委托的适用场景',
            ],
          },
          {
            id: 'event-flow',
            kind: 'content',
            eyebrow: 'Lesson 5 · 传播路径',
            title: '点击一个子元素时，事件会一路往外冒',
            flow: [
              { label: '01', title: '事件发生在目标元素', description: '比如点击某个按钮或列表项。' },
              { label: '02', title: '事件对象被传进监听器', description: '可以读取 target、currentTarget 等信息。' },
              { label: '03', title: '事件继续向外冒泡', description: '父级监听器也有机会收到这次事件。' },
              { label: '04', title: '必要时可阻止传播', description: '但通常应该先理解传播，再决定要不要阻止。' },
            ],
          },
          {
            id: 'delegation-compare',
            kind: 'compare',
            eyebrow: 'Lesson 5 · 委托',
            title: '列表项很多时，委托通常比逐个绑更轻',
            compare: {
              leftTitle: '逐个监听',
              rightTitle: '事件委托',
              left: {
                items: ['每个子项单独绑定。', '动态新增项目时还得再补一次监听。'],
              },
              right: {
                items: ['监听绑在父容器上。', '通过 event.target 判断用户点到了哪个子元素。'],
              },
            },
          },
          {
            id: 'events-demo',
            kind: 'demo',
            eyebrow: 'Lesson 5 · live demo',
            title: 'live demo · 事件传播实验',
            subtitle:
              '点不同层级的区域，观察 target、currentTarget 和冒泡日志，再看事件委托如何在列表里工作。',
            demo: {
              route: '/demos/week-3/javascript/event-propagation',
              ctaLabel: '打开实验',
              objectives: [
                '观察事件从目标元素向外冒泡的顺序',
                '理解事件委托为什么适合动态列表',
              ],
              note: '建议先点最里面的按钮，再看日志里哪几层都收到了事件。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '事件监听的本质是：在传播路径上某一层拦住并处理用户动作。',
              'event.target 和 currentTarget 不是一回事，读错很容易误判。',
              '事件委托对动态列表尤其有价值。',
            ],
          },
        ],
      },
      {
        id: 'forms',
        title: '表单与客户端校验',
        short: '表单',
        summary:
          '读取输入值、阻止默认提交、给出即时错误提示，让表单从“能填”升级成“能正确反馈”。',
        tags: ['表单', '校验'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · Lesson 6',
            title: '表单不只是收值，还要给用户明确反馈',
            subtitle:
              '浏览器能帮你提交表单，但真实产品往往还要先读值、校验、提示，再决定是否继续。',
            points: [
              '读取表单元素的值',
              'preventDefault 与提交时机',
              '校验与错误提示',
            ],
          },
          {
            id: 'form-rules',
            kind: 'content',
            eyebrow: 'Lesson 6 · 基本动作',
            title: '处理表单时，通常会先做这三步',
            bullets: [
              { title: '读值', text: '从 input、textarea、select 等元素里拿到当前内容。' },
              { title: '校验', text: '检查空值、长度、格式或业务规则是否满足。' },
              { title: '反馈', text: '通过错误提示、成功状态或按钮禁用告诉用户当前结果。' },
            ],
          },
          {
            id: 'prevent-default',
            kind: 'code',
            eyebrow: 'Lesson 6 · 最小证据',
            title: '提交前先截住默认行为',
            code: {
              language: 'javascript',
              filename: 'week3-form.js',
              source: `formEl.addEventListener('submit', function (event) {
  event.preventDefault()

  const email = emailInput.value.trim()
  if (!email.includes('@')) {
    errorEl.textContent = '请输入合法邮箱'
  }
})`,
              highlightLines: [1, 2, 4, 5],
            },
          },
          {
            id: 'forms-demo',
            kind: 'demo',
            eyebrow: 'Lesson 6 · live demo',
            title: 'live demo · 表单校验工作台',
            subtitle:
              '切换“空值 / 格式错误 / 校验通过”三种输入，观察提交是否被拦住以及页面反馈怎样变化。',
            demo: {
              route: '/demos/week-3/javascript/form-validation',
              ctaLabel: '打开实验',
              objectives: [
                '观察 preventDefault 如何阻止默认提交',
                '比较错误提示和成功提示的反馈节奏',
              ],
              note: '建议先试空值，再试不含 @ 的邮箱，最后输入合法值。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              '表单处理通常是读值 -> 校验 -> 反馈，而不是直接提交。',
              'preventDefault 让你能在浏览器默认提交前接管流程。',
              '好的表单反馈要清楚、及时，而且和输入错误一一对应。',
            ],
          },
        ],
      },
      {
        id: 'storage',
        title: 'localStorage 与持久化',
        short: '本地存储',
        summary:
          '理解 localStorage 为什么只能存字符串，以及“写前 stringify、读后 parse”的闭环。',
        tags: ['localStorage', '持久化'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 3 · Lesson 7',
            title: '刷新页面后还记得刚才的状态，靠的是本地存储',
            subtitle:
              '浏览器默认不会帮你记住内存里的对象。想跨刷新保留状态，就要借助 localStorage 这类持久化容器。',
            points: [
              'localStorage / sessionStorage 差异',
              '只能存字符串的限制',
              '读后 parse、写前 stringify',
            ],
          },
          {
            id: 'storage-table',
            kind: 'content',
            eyebrow: 'Lesson 7 · 存储边界',
            title: '本地存储先记住这几个边界',
            table: {
              headers: ['能力', 'localStorage', 'sessionStorage'],
              rows: [
                ['存储周期', '长期保留，除非主动清掉', '标签页关闭后通常失效'],
                ['数据类型', '字符串', '字符串'],
                ['适合什么', '偏好、草稿、小型本地状态', '短会话临时状态'],
              ],
            },
          },
          {
            id: 'storage-code',
            kind: 'code',
            eyebrow: 'Lesson 7 · 最小证据',
            title: '对象想存进去，先得变成字符串',
            code: {
              language: 'javascript',
              filename: 'week3-storage.js',
              source: `const notes = [{ id: 'n1', text: 'review DOM' }]

localStorage.setItem('week3:notes', JSON.stringify(notes))

const raw = localStorage.getItem('week3:notes')
const parsed = raw ? JSON.parse(raw) : []`,
              highlightLines: [3, 5, 6],
            },
          },
          {
            id: 'storage-demo',
            kind: 'demo',
            eyebrow: 'Lesson 7 · live demo',
            title: 'live demo · localStorage 笔记实验',
            subtitle:
              '现场添加一条笔记、刷新后再读回来，完整看一遍 stringify -> setItem -> getItem -> parse。',
            demo: {
              route: '/demos/week-3/javascript/localstorage-notes',
              ctaLabel: '打开实验',
              objectives: [
                '观察 localStorage 里实际保存的是字符串',
                '理解写前 stringify、读后 parse 的闭环',
              ],
              note: '建议先新增一条笔记，再刷新页面继续读取。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节带走什么',
            points: [
              'localStorage 很适合保存小型本地状态，但它只能存字符串。',
              '对象和数组要先 stringify，再在读取后 parse 回来。',
              '持久化的目标不是“把所有东西都存起来”，而是保留真正有价值的本地状态。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'week-4',
    index: 4,
    title: '异步与网络',
    theme: '数据从服务器来',
    description:
      '数据交换格式 → XHR → fetch → Promise → async/await，最后落到 HTTP 与 Express 服务端。',
    accent: 'emerald',
    topics: ['javascript', 'nodejs'],
    lessons: [
      {
        id: 'overview',
        title: '本周导览：6 个串起来的知识点',
        short: '本周导览',
        summary:
          '把“数据怎么从服务器来”这条主线压缩成 6 个知识节点，先看全局地图再逐个击破。',
        tags: ['导览', '异步', '网络'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 异步与网络',
            title: '数据怎么从服务器来',
            subtitle:
              '这周不是背 API 名字，而是先理解数据回来之前，前端到底在经历什么。',
            points: [
              '字符串 -> 发请求 -> 等结果 -> 处理异步 -> 写得更顺 -> 服务端接住请求',
              '先看主线地图，再逐节跑演示',
              '每一节都对应一个能现场跑起来的知识点',
            ],
          },
          {
            id: 'roadmap',
            kind: 'roadmap',
            eyebrow: 'Week 4 · 主线地图',
            title: '从 JSON 一路走到 Express',
            subtitle:
              'JSON、XHR、fetch、Promise、async / await，再到 HTTP / Express，不是 6 个孤立知识点，而是一条连续的异步链路。',
            roadmap: [
              {
                label: '01',
                title: 'JSON',
                description: '对象怎么先变成可传输的字符串',
              },
              {
                label: '02',
                title: 'XHR',
                description: '浏览器最早怎么发异步请求',
              },
              {
                label: '03',
                title: 'fetch',
                description: '现代请求 API 怎么拿到响应',
              },
              {
                label: '04',
                title: 'Promise',
                description: '异步结果怎么被组织和编排',
              },
              {
                label: '05',
                title: 'async / await',
                description: '怎么把异步流程写得更像同步代码',
              },
              {
                label: '06',
                title: 'HTTP / Express',
                description: '服务端怎么接住请求并回响应',
              },
            ],
          },
          {
            id: 'cards',
            kind: 'cards',
            eyebrow: '本周目录',
            title: '6 个知识点总览',
            subtitle:
              '这一页只做索引，不讲细节。后面的 6 节会把每个节点分别展开成可运行演示。',
            cards: [
              {
                eyebrow: '知识点 01',
                title: 'JSON',
                description: '对象怎么变成字符串，以及为什么网络上传的往往不是对象本身。',
                meta: '对应：数据交换格式与 JSON',
              },
              {
                eyebrow: '知识点 02',
                title: 'XMLHttpRequest',
                description: '浏览器最早怎么不刷新页面去拿服务器数据，以及 status 和 error 各看什么。',
                meta: '对应：远程获取数据：XMLHttpRequest',
              },
              {
                eyebrow: '知识点 03',
                title: 'fetch',
                description: '现代请求 API 怎么拿响应，以及为什么 404 不会自动 reject。',
                meta: '对应：fetch 与 Response',
              },
              {
                eyebrow: '知识点 04',
                title: 'Promise',
                description: '异步结果如何从 pending 走向 fulfilled / rejected，并继续链式组织。',
                meta: '对应：Promise 的状态与编排',
              },
              {
                eyebrow: '知识点 05',
                title: 'async / await',
                description: '如何把 Promise 流程收束成更顺的写法，让错误处理回到 try / catch。',
                meta: '对应：async / await',
              },
              {
                eyebrow: '知识点 06',
                title: 'HTTP / Express',
                description: '请求到服务端后怎样被解析、路由匹配，并按 RESTful 习惯返回响应。',
                meta: '对应：HTTP Server 与 Express',
              },
            ],
          },
          {
            id: 'closing',
            kind: 'closing',
            eyebrow: '本周带走什么',
            title: '先建立地图，再逐个击破',
            subtitle: '先看总览 -> 再逐节跑演示 -> 最后回题库',
            points: [
              '这一周的核心不是 API 名字，而是理解数据回来之前前端一直在等。',
              'fetch、Promise、async / await 是同一条链上的不同层次，最后还要接到服务端的 HTTP / Express。',
              '学完本周后，要能从“读字符串”一路走到“发请求并处理结果，再理解服务端如何回应”。',
            ],
          },
        ],
      },
      {
        id: 'data-interchange',
        title: '数据交换格式与 JSON',
        short: '数据交换格式',
        summary:
          'JSON / YAML / XML 的取舍，以及 JSON.stringify、JSON.parse 与 localStorage 的配合。',
        tags: ['JSON', 'stringify', 'parse', 'localStorage'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 知识点 01',
            title: '数据在传出去之前，先变成字符串',
            subtitle:
              '这一节先把“数据怎么交换”说清楚，再落到 JSON.stringify 与 JSON.parse。',
            points: [
              '为什么需要数据交换格式',
              'JSON / YAML / XML 的取舍',
              'JSON ≠ JS 对象字面量',
              '写前 stringify，读后 parse',
            ],
          },
          {
            id: 'outline',
            kind: 'outline',
            title: '这一节回答这些问题',
            points: [
              '为什么需要数据交换格式',
              'JSON / YAML / XML 的取舍',
              'JSON ≠ JS 对象字面量',
              '写前 stringify，读后 parse',
            ],
          },
          {
            id: 'why-format',
            kind: 'content',
            eyebrow: '知识点 01 · 1.1',
            title: '为什么需要「数据交换格式」',
            subtitle:
              'C 有结构体，JS 有对象，Python 有字典 —— 三套内存模型互不认识，所以需要一个双方都认的中间格式。',
            bullets: [
              {
                title: '物理世界：插座 / USB',
                text: '插头形状被事先约定好，任何厂家都能互通。',
              },
              {
                title: '数据世界：数据交换格式',
                text: '一种极简的标记语言，内容只是数组、对象、数字、字符串、布尔值的组合。',
              },
              {
                title: '关键动作：结构化 → 字符串',
                text: '先序列化成纯文本才能传输，接收方再反序列化回自己的数据结构。',
              },
            ],
            note: {
              tone: 'rule',
              label: '一句话',
              text: '数据交换格式的本质，是把「结构化数据」变成「可以传输的字符串」——传输通道只能搬字节，搬不了内存里的对象。',
            },
          },
          {
            id: 'formats-compare',
            kind: 'content',
            eyebrow: '知识点 01 · 1.2',
            title: 'JSON / YAML / XML 三者的取舍',
            subtitle: '同一份数据，三种格式各有代价。选格式看场景，不是看新旧。',
            table: {
              headers: ['格式', '可读性', '体积', '解析成本', '典型用途'],
              rows: [
                ['JSON', '不错', '小', '低（原生支持）', '前后端 API 通信，事实标准'],
                ['YAML', '最好（可写注释）', '小', '中（需第三方库）', '各种配置文件（CI、K8s）'],
                ['XML', '差（开闭标签太吵）', '大', '高', '遗留系统、RSS、部分企业接口'],
              ],
            },
            note: {
              tone: 'tip',
              label: '取舍',
              text: 'XML 的现实问题：更啰嗦（开闭标签）、更费力（属性 / 命名空间 / DTD）、更多字节（占带宽）。所以前后端通信选 JSON；写配置选 YAML；遇到老旧系统才用 XML。',
            },
          },
          {
            id: 'formats-code',
            kind: 'codes',
            eyebrow: '知识点 01 · 1.2',
            title: '同一份数据，三种写法',
            subtitle:
              '三个地点的 suburb 与 postcode，分别用 JSON / YAML / XML 写一遍。',
            codes: [
              {
                language: 'json',
                filename: 'locations.json',
                source: `{
  "locations": [
    { "suburb": "Kensington", "postcode": 2033 },
    { "suburb": "Mascot",     "postcode": 2020 },
    { "suburb": "Sydney CBD", "postcode": 2000 }
  ]
}`,
              },
              {
                language: 'yaml',
                filename: 'locations.yaml',
                source: `---
locations:
- suburb: Kensington
  postcode: 2033
- suburb: Mascot
  postcode: 2020
- suburb: Sydney CBD
  postcode: 2000`,
              },
              {
                language: 'xml',
                filename: 'locations.xml',
                source: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <locations>
    <element>
      <postcode>2033</postcode>
      <suburb>Kensington</suburb>
    </element>
    <element>
      <postcode>2020</postcode>
      <suburb>Mascot</suburb>
    </element>
  </locations>
</root>`,
              },
            ],
          },
          {
            id: 'json-vs-js-literal',
            kind: 'compare',
            eyebrow: '知识点 01 · 1.3',
            title: 'JSON 不等于 JS 对象字面量',
            subtitle:
              'JSON 的语法是 JavaScript 对象字面量的一个严格子集：JS 里能写的，JSON 里不一定能写。',
            compare: {
              leftTitle: '✗ 合法 JS，但不是合法 JSON',
              rightTitle: '✓ 同一份数据的合法 JSON',
              left: {
                code: {
                  language: 'js',
                  filename: 'bad.js',
                  source: `const bad = {
  name: 'Bob',        // key 没加引号
  age: 23,            // 尾逗号
  // 这里有一行注释
  nickname: undefined,
  greet: () => 'hi',
};`,
                },
              },
              right: {
                code: {
                  language: 'json',
                  filename: 'good.json',
                  source: `{
  "name": "Bob",
  "age": 23
}`,
                },
              },
            },
          },
          {
            id: 'json-limits',
            kind: 'content',
            eyebrow: '知识点 01 · 1.3',
            title: '四条必须记住的语法限制',
            bullets: [
              {
                title: 'key 必须是双引号字符串',
                text: `"name" 可以，name 与 'name' 都不行。`,
                code: {
                  language: 'json',
                  source: `{
  "name": "Bob"
}`,
                },
              },
              {
                title: '不能有尾逗号',
                text: '最后一个成员后面不能多一个逗号。',
                code: {
                  language: 'json',
                  source: `{
  "name": "Bob",
}`,
                },
              },
              {
                title: '不能写注释',
                text: 'JSON 没有任何注释语法，这也是 YAML 在配置文件里更受欢迎的原因。',
                code: {
                  language: 'json',
                  source: `{
  "name": "Bob" // 这里不能写注释
}`,
                },
              },
              {
                title: '不支持 undefined / 函数 / NaN',
                text: '这些值在序列化时会被丢掉或被强制转换。',
                code: {
                  language: 'js',
                  source: `JSON.stringify({
  nickname: undefined,
  greet: () => 'hi',
  score: NaN,
})`,
                },
              },
            ],
            note: {
              tone: 'warn',
              label: '观察',
              text: '这一页先记“什么不能写”，下一页再看为什么 parse 失败时一定要 try / catch。',
            },
          },
          {
            id: 'json-parse-trap',
            kind: 'compare',
            eyebrow: '知识点 01 · 1.3',
            title: 'JSON.parse 的陷阱：语法错误会直接抛异常',
            subtitle:
              '这不是返回 null，也不是 quietly fail，而是会直接打断当前执行流程。',
            compare: {
              leftTitle: '✗ 不兜底：一旦输入非法 JSON 就直接炸掉',
              rightTitle: '✓ 正确做法：任何外部 JSON 都进 try / catch',
              left: {
                code: {
                  language: 'js',
                  source: `const raw = "{ name: 'Bob' }"
const data = JSON.parse(raw)
console.log(data.name)`,
                },
              },
              right: {
                code: {
                  language: 'js',
                  source: `const raw = '{ "name": "Bob" }'

try {
  const data = JSON.parse(raw)
  console.log(data.name)
} catch (err) {
  console.error('JSON 不合法：', err)
}`,
                },
              },
            },
          },
          {
            id: 'stringify-parse-compare',
            kind: 'compare',
            eyebrow: '知识点 01 · 1.4',
            title: '前端最常用的两个方法',
            subtitle:
              'JSON.stringify 负责序列化（对象 → 字符串），JSON.parse 负责反序列化（字符串 → 对象）。',
            compare: {
              leftTitle: 'JSON.stringify：对象 -> 字符串',
              rightTitle: 'JSON.parse：字符串 -> 对象',
              left: {
                items: [
                  '把对象、数组等结构化数据序列化成纯文本',
                  '常见于请求体、localStorage、cookie 等只能存文本的介质',
                  'JSON.stringify(v, null, 2) 只是为了可读，不适合传输',
                ],
                code: {
                  language: 'js',
                  source: `const text = JSON.stringify({
  name: 'Bob',
  skills: ['HTML', 'CSS'],
})

console.log(typeof text) // "string"`,
                },
              },
              right: {
                items: [
                  '把合法 JSON 字符串反序列化回对象或数组',
                  '解析后的结果才能用 .key、遍历、Array.isArray 等对象操作',
                  '面对外部输入时一定要用 try / catch 兜底',
                ],
                code: {
                  language: 'js',
                  source: `const raw = '{ "name": "Bob" }'
const data = JSON.parse(raw)

console.log(typeof data) // "object"
console.log(data.name)   // "Bob"`,
                },
              },
            },
          },
          {
            id: 'stringify-parse-code',
            kind: 'code',
            eyebrow: '知识点 01 · 1.4',
            title: '01-json-basics.js',
            code: {
              language: 'javascript',
              filename: '01-json-basics.js',
              source: `const DATA = {
  names: [{ first: 'Bob', last: 'Carr' }],
}

// ① 对象 → 字符串（序列化）
const text = JSON.stringify(DATA)
console.log(typeof text)        // "string"

// ② 加缩进只为好看，服务器收到的还是同一份数据
const pretty = JSON.stringify(DATA, null, 2)

// ③ 字符串 → 对象（反序列化）
const back = JSON.parse(text)
console.log(back.names[0].first) // "Bob"`,
              highlightLines: [6, 7, 10, 13, 14],
            },
          },
          {
            id: 'stringify-parse-demo',
            kind: 'demo',
            eyebrow: '知识点 01 · 1.4',
            title: 'live demo · stringify / parse 双向转换',
            subtitle:
                '这一页不再直接承载实验，而是给你一个明确的实验入口：去独立 demos 页面里观察 parse 成功与抛错，以及 stringify 会丢掉什么。',
            demo: {
                route: '/demos/week-4/json/stringify-parse',
                ctaLabel: '打开实验',
                objectives: [
                  '观察 parse 成功与失败的区别',
                  '比较紧凑字符串和格式化字符串',
                  '验证 stringify 会丢掉哪些值',
                ],
                note: '建议先点击非法 JSON 样例按钮，再回到合法 JSON 观察 parse 与 stringify 的差异。',
            },
          },
          {
            id: 'localstorage',
            kind: 'content',
            eyebrow: '知识点 01 · 1.5',
            title: '为什么 JSON 总和 localStorage 一起出现',
            subtitle:
              'localStorage 是浏览器给的键值存储，但它有一个硬限制：只能存字符串。',
            bullets: [
              {
                title: '直接存对象会丢数据',
                text: `setItem(key, { name: 'Bob' }) 会先调用 String(obj)，读回来是 '[object Object]'。`,
              },
              {
                title: '写前 stringify',
                text: 'localStorage.setItem(key, JSON.stringify(list))',
              },
              {
                title: '读后 parse 回对象',
                text: 'JSON.parse(raw)，并包一层 try / catch 兜底。',
              },
            ],
            note: {
              tone: 'tip',
              label: '规律',
              text: '凡是只能存文本的介质（localStorage、cookie、URL query、请求体），都遵循同一套动作：写之前 stringify，读之后 parse。',
            },
          },
          {
            id: 'localstorage-code',
            kind: 'code',
            eyebrow: '知识点 01 · 1.5',
            title: '01-localstorage.js',
            code: {
              language: 'javascript',
              filename: '01-localstorage.js',
              source: `const KEY = 'w4:members'

// ✗ 直接存对象：浏览器会先调用 String(obj)
localStorage.setItem(KEY, { name: 'Bob' })
localStorage.getItem(KEY)   // "[object Object]" —— 数据已经丢了

// ✓ 正确做法：对象 → 字符串 → 存
localStorage.setItem(KEY, JSON.stringify([{ name: 'Bob' }]))

// ✓ 读出来必须 parse 回对象，并兜住 parse 失败
function loadMembers() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch (err) {
    console.warn('本地数据损坏，已重置：', err)
    localStorage.removeItem(KEY)
    return []
  }
}`,
            },
          },
          {
            id: 'localstorage-demo',
            kind: 'demo',
            eyebrow: '知识点 01 · 1.5',
            title: 'live demo · JSON + localStorage 持久化',
            subtitle:
                '这一页是 localStorage 实验入口。去独立 demos 页面里沿着 stringify -> setItem -> getItem -> parse 走完整个持久化闭环。',
            demo: {
                route: '/demos/week-4/json/localstorage',
                ctaLabel: '打开实验',
                objectives: [
                  '观察 localStorage 里真实存着的字符串',
                  '理解写前 stringify、读后 parse 的闭环',
                  '验证刷新页面后数据仍然存在',
                ],
                note: '建议依次执行添加、重新读取、清空，观察日志与字符串存储内容如何变化。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节要带走的三句话',
            points: [
              'JSON 是字符串，不是对象：看到双引号包住整个结构，它就是 string。',
              'key 必须双引号、不能有尾逗号、不能写注释，而且 parse 遇到语法错误会直接抛异常。',
              '写前 stringify，读后 parse：所有只能存文本的介质都遵循这一条，localStorage 只是最直观的一个例子。',
            ],
          },
        ],
      },
      {
        id: 'xhr',
        title: '远程获取数据：XMLHttpRequest',
        short: 'XMLHttpRequest',
        summary:
          '用 XHR 拉远程接口并动态插入页面，看清 readyState、onload / onerror 与状态码的分工。',
        tags: ['XHR', 'readyState', '状态码'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 知识点 02',
            title: '不刷新页面，把服务器数据插进 DOM',
            subtitle:
              '上一节解决「数据长什么样」，这一节解决「怎么把它拿回来」。',
            points: [
              '一次请求-响应循环',
              'XHR 是什么',
              'readyState 与 status 的分工',
              '4xx / 5xx 不算 error',
              '回调地狱与规避',
            ],
          },
          {
            id: 'outline',
            kind: 'outline',
            title: '这一节回答这些问题',
            points: [
              '浏览器是怎么把远程数据拿回来的',
              'readyState 和 status 到底各看什么',
              '什么时候走 onerror，什么时候只是 status 不对',
              '为什么 XHR 已经被 fetch 取代',
            ],
          },
          {
            id: 'request-response',
            kind: 'content',
            eyebrow: '知识点 02 · 2.1',
            title: '一次「请求-响应循环」',
            subtitle:
              '客户端发请求、服务器处理并回响应，这个过程页面不需要整页刷新。',
            flow: [
              {
                label: '01',
                title: '浏览器发起请求',
                description: '前端把 URL、方法、参数打包好，交给浏览器发出去。',
                meta: 'request',
              },
              {
                label: '02',
                title: '服务器接收并处理',
                description: '校验参数、执行业务逻辑、查询数据库，准备本次结果。',
                meta: 'validate + query',
              },
              {
                label: '03',
                title: '服务器返回响应',
                description: '把状态码、响应头、响应体一起送回浏览器。',
                meta: 'response',
              },
              {
                label: '04',
                title: '前端更新界面',
                description: '拿到数据后渲染 DOM，所以页面可以局部更新而不是整页刷新。',
                meta: 'render',
              },
            ],
            paragraphs: [
              '先把这条链记死：浏览器没有权威数据，真正的数据在服务器上；前端只能发请求、收响应、再把结果画出来。',
            ],
            bullets: [
              {
                title: '客户端更关心延迟 latency',
                text: '一次请求从发出到看到结果花了多久，决定你体感上的“快不快”。',
              },
              {
                title: '服务器更关心吞吐 throughput',
                text: '单位时间能扛多少请求，决定它一秒钟能处理多少人同时访问。',
              },
            ],
            note: {
              tone: 'rule',
              label: '定义',
              text: 'AJAX 不是一项具体技术，而是一组「不整页刷新即可局部更新」的技术集合：Asynchronous（不阻塞页面）+ JavaScript（发起语言）+ XML（早期数据格式，今天基本已被 JSON 取代）。',
            },
          },
          {
            id: 'xhr-what',
            kind: 'content',
            eyebrow: '知识点 02 · 2.2',
            title: 'XMLHttpRequest 是什么',
            subtitle:
              '浏览器内置、不装库就能用的请求句柄；今天已不那么流行，但心智模型在 fetch 时代依然成立。',
            flow: [
              {
                label: '01',
                title: '创建请求句柄',
                description: '先 new XMLHttpRequest()，拿到一个代表“这次请求”的对象。',
                meta: 'new',
              },
              {
                label: '02',
                title: '配置请求',
                description: '用 open(method, url) 说明要去哪里、用什么方法发。',
                meta: 'open()',
              },
              {
                label: '03',
                title: '挂回调',
                description: '提前定义 onload / onerror，约定“回来以后怎么处理”。',
                meta: 'callbacks',
              },
              {
                label: '04',
                title: 'send 发出去',
                description: '请求离开主线程开始飞行；默认异步，所以页面不会被卡住。',
                meta: 'send()',
              },
              {
                label: '05',
                title: '响应回来再通知你',
                description: '服务器回话后再进入回调，因此你看到的是“先发出、后处理”的异步节奏。',
                meta: 'notify',
              },
            ],
            paragraphs: [
              '大量遗留代码、老教程、老面试题里到处是它，所以必须看得懂，而不是推荐用它写新代码。',
            ],
            bullets: [
              {
                title: '默认异步',
                text: 'xhr.open() 不传第三个参数就是异步：请求发出后主线程不等待，继续往下跑。',
              },
              {
                title: '靠回调定制行为',
                text: '主要是 xhr.onload（拿到响应）与 xhr.onerror（网络失败）两个回调。',
              },
              {
                title: '靠状态码报错',
                text: 'HTTP 层面的失败（404、500）会落在 xhr.status 上，得你自己判断。',
              },
            ],
          },
          {
            id: 'readystate',
            kind: 'content',
            eyebrow: '知识点 02 · 2.3',
            title: 'readyState：一次请求的生命周期',
            subtitle: '它描述「请求走到哪一步了」，每次变化都会触发 readystatechange。',
            table: {
              headers: ['值', '常量名', '含义'],
              rows: [
                ['0', 'UNSENT', '尚未调用 open()'],
                ['1', 'OPENED', '已调用 open()，请求已建立'],
                ['2', 'HEADERS_RECEIVED', '已收到响应头（还没拿到响应体）'],
                ['3', 'LOADING', '正在下载响应体'],
                ['4', 'DONE', '完成，响应体已经收全'],
              ],
            },
            note: {
              tone: 'tip',
              label: '要点',
              text: '只有 readyState === 4 的时候，responseText 才是完整的、可以读的；但 4 只代表「通信结束」，不代表「成功」。',
            },
          },
          {
            id: 'status',
            kind: 'content',
            eyebrow: '知识点 02 · 2.3',
            title: 'status：服务器是怎么回答的',
            subtitle: '它描述「本次业务成没成」，和 readyState 是两个完全不同的数字。',
            table: {
              headers: ['状态码', '归类', '含义'],
              rows: [
                ['200', '成功', '请求正常完成，响应体就是你要的数据'],
                ['4xx', '客户端错误', '你把 API 用错了：404 资源不存在、400 参数不对、401 没登录'],
                ['5xx', '服务端错误', '服务器自己内部出错：500、502、503'],
              ],
            },
            note: {
              tone: 'warn',
              label: '区分',
              text: 'readyState === 4 说的是「通信结束了」；status === 200 说的才是「业务成功了」。两个数字都要各自检查一次，缺一个都会写出 bug。',
            },
          },
          {
            id: 'request-demo',
            kind: 'demo',
            eyebrow: '知识点 02 · 2.3',
            title: 'live demo · 最小 XHR GET 请求',
            subtitle:
              '这一页是实验入口。去独立 demos 页面里真的发一次请求，沿 readyState 观察请求走到哪一步、status 怎么决定成败。',
            demo: {
              route: '/demos/week-4/xhr/request',
              ctaLabel: '打开实验',
              objectives: [
                '盯住 readyState 从 0 到 4 的变化',
                '对照 status 判断业务成败',
                '看远程失败时如何切到本地兜底',
              ],
              note: '建议先点「远程 API」看成功路径，再点「请求不存在的路径（404）」看 onload 里 status 不为 2xx 时怎么处理。',
            },
          },
          {
            id: 'error-classes',
            kind: 'content',
            eyebrow: '知识点 02 · 2.4',
            title: '★ 错误处理的分工',
            subtitle: '这是最容易考倒的一点：要把错误分成两类，分别处理。',
            paragraphs: [
              '处理「预期外错误」（网络抖动、超时）的常见策略是重试 + 指数退避：失败后等一个越来越长的时间再重试（0.5s → 1s → 2s → 4s），既能扛过短暂抖动，又不会一窝蜂重试把服务器打垮。',
            ],
            table: {
              headers: ['类别', '例子', '如何发现', '走哪个回调'],
              rows: [
                [
                  '预期内的错误 Expected',
                  '认证失败、参数错误、资源不存在',
                  '服务器已回话，自己检查 xhr.status',
                  'onload',
                ],
                [
                  '预期外的错误 Unexpected',
                  '网络不通、连接中断、超时',
                  '根本没拿到响应，xhr.status 为 0',
                  'onerror',
                ],
              ],
            },
            note: {
              tone: 'trap',
              label: '最容易错',
              text: '4xx / 5xx 不会触发 onerror，fetch 也一样。onerror 只负责网络层的失败；只要服务器回了 HTTP 响应（哪怕是 404、500），对 XHR 来说这也是一次「成功通信」，一定会走 onload。',
            },
          },
          {
            id: 'error-paths-demo',
            kind: 'demo',
            eyebrow: '知识点 02 · 2.4',
            title: 'live demo · 两条错误路径对照',
            subtitle:
              '这一页是错误处理实验入口。去独立 demos 页面里对照发一次 4xx 与一次网络错误，看它们分别走了哪个回调。',
            demo: {
              route: '/demos/week-4/xhr/error-paths',
              ctaLabel: '打开实验',
              objectives: [
                '确认 4xx 走 onload 而不是 onerror',
                '确认网络错误走 onerror 且 status 为 0',
                '记住只有连不上才叫 error',
              ],
              note: '建议两个按钮各点一次，对照日志里「走了 onload 还是 onerror」以及 status 的取值。',
            },
          },
          {
            id: 'xhr-complete-code',
            kind: 'code',
            eyebrow: '知识点 02 · 2.5',
            title: '02-xhr-basic.js',
            code: {
              language: 'javascript',
              filename: '02-xhr-basic.js',
              source: `// ① 创建一个请求句柄
const xhr = new XMLHttpRequest();

// ② 配置请求：GET，默认异步（第三个参数省略即为 true）
xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');

// ③ 定制回调：load = 收到响应；error = 网络层失败
xhr.onload = function () {
  // 关键：onload 只代表「通信结束」，不代表「业务成功」
  if (xhr.status >= 200 && xhr.status < 300) {
    const users = JSON.parse(xhr.responseText);   // 响应体是字符串
    render(users);                                // 把数据渲染进页面
  } else {
    // 4xx / 5xx：属于「预期内错误」，onerror 根本不会来
    console.warn('业务失败，HTTP ' + xhr.status);
    loadFallback();                               // 改用本地兜底数据
  }
};

xhr.onerror = function () {
  // 网络层失败：连不上 / 中断 / 超时，此时 status 是 0
  console.error('网络失败，status = ' + xhr.status);  // 0
  loadFallback();
};

// ④ 真正把请求发出去
xhr.send();`,
              highlightLines: [10, 13, 20],
            },
          },
          {
            id: 'callback-hell',
            kind: 'compare',
            eyebrow: '知识点 02 · 2.6',
            title: '回调地狱与规避',
            subtitle:
              '异步操作按顺序串起来时，每一层都往回调里再塞一个回调，代码就向右「长成一棵圣诞树」。',
            compare: {
              leftTitle: '✗ 嵌套写法：越写越深',
              rightTitle: '✓ 扁平化写法：具名函数，一层一个职责',
              left: {
                code: {
                  language: 'js',
                  source: `getUser(1, function (user) {
  getOrders(user.id, function (orders) {
    getDetail(orders[0].id, function (detail) {
      render(detail, function () {
        // 出错时根本不知道该在哪一层处理
      });
    });
  });
});`,
                },
              },
              right: {
                code: {
                  language: 'js',
                  source: `function onDetail(detail) { render(detail); }
function onOrders(orders) { getDetail(orders[0].id, onDetail); }
function onUser(user)    { getOrders(user.id, onOrders); }

getUser(1, onUser);   // 读起来是从上往下的直线`,
                },
              },
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节要带走的三句话',
            points: [
              '客户端不持有权威数据：数据在服务器上，前端只负责发起请求、渲染响应。',
              'readyState 到 4 之后 responseText 才完整可读，但 4 只代表通信结束，不代表成功。',
              '4xx / 5xx 走 status、不走 onerror：只有连不上才叫 error，这条规则 fetch 也一样。',
            ],
          },
        ],
      },
      {
        id: 'fetch',
        title: 'fetch 与 Response',
        short: 'fetch',
        summary:
          'fetch 返回 Promise、只认网络错误，404 不 reject —— 必须自己判 res.ok。',
        tags: ['fetch', 'Response', 'res.ok', 'CORS'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 知识点 03',
            title: '有没有更好用的请求方式',
            subtitle:
              'fetch 把“发请求”这一步 Promise 化了，但它也带来一个非常容易误判的坑：404 默认不会报错。',
            points: [
              'fetch(url) 返回 Promise',
              'resolve 出来的是 Response',
              '404 / 500 默认不会 reject',
              '必须自己检查 res.ok',
              '响应体只能读一次',
            ],
          },
          {
            id: 'outline',
            kind: 'outline',
            title: '这一节回答这些问题',
            points: [
              'fetch 相比 XHR 到底简化了什么',
              '为什么拿到的不是数据，而是 Response',
              '为什么 404 看起来像“成功”',
              'POST 与 body 应该怎么写才对',
            ],
          },
          {
            id: 'why-fetch',
            kind: 'compare',
            eyebrow: '知识点 03 · 3.1',
            title: '为什么会有 fetch',
            subtitle:
              '它不是换了个名字而已，而是把“发请求”这件事直接建模成一个 Promise，让异步流程更容易往下串。',
            compare: {
              leftTitle: '✗ XHR：命令式，一堆手动步骤',
              rightTitle: '✓ fetch：Promise 化，一条链读完',
              left: {
                code: {
                  language: 'js',
                  source: `const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/users');
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300) {
    render(JSON.parse(xhr.responseText));
  } else {
    showError(xhr.status);
  }
};
xhr.onerror = function () {
  showError('网络错误');
};
xhr.send();`,
                },
              },
              right: {
                code: {
                  language: 'js',
                  source: `fetch('/api/users')
  .then((res) => res.json())
  .then((data) => render(data))
  .catch((err) => showError(err));

// 注意：状态码仍然要自己判，见下一页`,
                },
              },
            },
          },
          {
            id: 'response-flow',
            kind: 'content',
            eyebrow: '知识点 03 · 3.2',
            title: 'fetch 的两段式读取流程',
            subtitle:
              '第一段等到的是 Response，第二段才是把 body 读成真正的数据对象。这个“两段式”一定要在脑子里分开。',
            flow: [
              {
                label: '01',
                title: 'fetch(url)',
                description: '先发起请求，立刻拿到一个 Promise。',
                meta: 'Promise',
              },
              {
                label: '02',
                title: 'await fetch(url)',
                description: 'Promise resolve 后，拿到的是 Response，不是 JSON 数据本身。',
                meta: 'Response',
              },
              {
                label: '03',
                title: '检查 res.ok / res.status',
                description: '先判断 HTTP 是否真的成功，再决定要不要继续读 body。',
                meta: 'guard',
              },
              {
                label: '04',
                title: 'await res.json()',
                description: '这一步才真正把响应体读成对象；它本身也是异步的。',
                meta: 'read body',
              },
            ],
            note: {
              tone: 'tip',
              label: '一句话',
              text: 'fetch 解决的是“怎么拿到 Response”；而不是“自动帮你拿到最终 JSON 数据”。Response 和 data 是两层不同的东西。',
            },
          },
          {
            id: 'reject-rules',
            kind: 'content',
            eyebrow: '知识点 03 · 3.3',
            title: '最关键的一条：只在网络失败时 reject',
            subtitle:
              '这条规则和很多人的直觉完全相反，所以必须单独拎出来背：404 / 500 不会进 catch。',
            table: {
              headers: ['场景', 'Promise 结果', '你该怎么处理'],
              rows: [
                ['200 / 201', 'resolve', '正常检查后读取 body'],
                ['404 / 500', '仍然 resolve', '自己检查 res.ok，然后主动 throw'],
                ['断网 / CORS / 域名失败', 'reject', '直接进入 catch'],
              ],
            },
            note: {
              tone: 'trap',
              label: '口诀',
              text: 'fetch 不认 404，自己判 res.ok。拿到 Response 后、读 body 前，先写 if (!res.ok) throw new Error(...)。',
            },
          },
          {
            id: 'response-demo',
            kind: 'demo',
            eyebrow: '知识点 03 · 3.3',
            title: 'live demo · fetch 与 Response 检视器',
            subtitle:
              '去独立 demos 页面里对照点远程 API、本地兜底和 404，再切换是否开启 res.ok 检查，看 fetch 对 404 的态度到底有多“反直觉”。',
            demo: {
              route: '/demos/week-4/fetch/response-inspector',
              ctaLabel: '打开实验',
              objectives: [
                '确认 fetch 先拿到的是 Response 而不是数据',
                '确认 404 默认不会进入 catch',
                '学会用 res.ok 把 HTTP 错误显式转成异常',
              ],
              note: '建议先不勾 res.ok 检查点 404，再勾上同一个按钮重试一次，两次的结果会完全不同。',
            },
          },
          {
            id: 'response-object',
            kind: 'content',
            eyebrow: '知识点 03 · 3.4',
            title: 'Response 上最常用的几个东西',
            subtitle:
              '排查 fetch 问题时，基本都绕不开这些属性和方法。熟悉它们，比死记语法更重要。',
            table: {
              headers: ['属性 / 方法', '含义'],
              rows: [
                ['res.status', '数字状态码（200 / 404 / 500 …）'],
                ['res.statusText', '状态码对应的文本，如 OK / Not Found'],
                ['res.ok', 'status 在 200~299 时为 true'],
                ["res.headers.get('content-type')", '读响应头，判断返回的是 JSON 还是 HTML'],
                ['res.url', '实际请求到的最终地址'],
                ['res.redirected', '是否发生过重定向'],
                ['res.json()', '把 body 读成 JSON（返回 Promise）'],
                ['res.text()', '把 body 读成文本（返回 Promise）'],
                ['res.clone()', '克隆一份 Response，用于确实需要读两次的场景'],
              ],
            },
            note: {
              tone: 'warn',
              label: '注意',
              text: '调用过 res.json() 之后，再调 res.text() 会报 body stream already read。响应体是一条流，不是一个可无限重复读取的字符串变量。',
            },
          },
          {
            id: 'post-body-demo',
            kind: 'demo',
            eyebrow: '知识点 03 · 3.5',
            title: 'live demo · POST 请求与 body 读取规则',
            subtitle:
              '这页实验同时演示两件事：fetch(url, options) 如何发 POST，以及为什么同一个 Response 的 body 不能连续读取两次。',
            demo: {
              route: '/demos/week-4/fetch/post-and-body',
              ctaLabel: '打开实验',
              objectives: [
                '理解 body 里的对象要先 JSON.stringify',
                '看清 fetch(url, options) 如何发 POST',
                '记住同一个 Response 的 body 不能连续读两次',
              ],
              note: '建议先点 POST，再点“body 只能读一次”，一个看请求体怎么发，一个看 Response body 的使用约束。',
            },
          },
          {
            id: 'robust-wrapper',
            kind: 'code',
            eyebrow: '知识点 03 · 3.6',
            title: '03-fetch-json.js',
            code: {
              language: 'javascript',
              filename: '03-fetch-json.js',
              source: `async function fetchJSON(url, options = {}) {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });

    if (!res.ok) {
      throw new Error('HTTP ' + res.status + ' ' + res.statusText);
    }

    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('请求超时（>' + timeout + 'ms），已中断');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}`,
              highlightLines: [6, 8, 9, 12, 14],
            },
          },
          {
            id: 'xhr-vs-fetch',
            kind: 'content',
            eyebrow: '知识点 03 · 3.7',
            title: 'XHR 与 fetch 怎么取舍',
            subtitle:
              '不是“谁彻底淘汰谁”，而是看你当前处在什么代码环境、要解决什么问题。',
            table: {
              headers: ['维度', 'XHR', 'fetch'],
              rows: [
                ['语法组织', 'open / send + 回调', 'Promise / async-await，更顺'],
                ['老浏览器支持', '更好', '现代环境更友好，老环境需 polyfill'],
                ['上传下载进度', '原生直接支持', '通常要配 Streams，心智更重'],
                ['取消请求', 'xhr.abort()', 'AbortController + signal'],
                ['新项目默认选择', '读老代码必须会看', '大多数新代码优先选它'],
              ],
            },
            note: {
              tone: 'rule',
              label: '结论',
              text: '新项目一般用 fetch + async/await；但读遗留系统、处理进度条或某些底层交互时，你还是会遇到 XHR。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节要带走的三句话',
            points: [
              'fetch(url) 先拿到的是 Promise<Response>；真正的数据要再 await res.json() 一次。',
              '404 / 500 默认不会让 fetch reject，所以必须自己检查 res.ok。',
              'Response body 是流，只能读一次；需要读两遍时先 clone。',
            ],
          },
        ],
      },
      {
        id: 'promise',
        title: 'Promise 的状态与编排',
        short: 'Promise',
        summary:
          'pending / fulfilled / rejected / settled，then / catch / finally，以及 all / race / allSettled 的差别。',
        tags: ['状态机', '链式调用', 'Promise.all'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 知识点 04',
            title: '“未来才会有的值”怎么被组织和编排',
            subtitle:
              'Promise 把“未来值”变成一个可以传递、可以组合、可以统一处理错误的对象。先搞懂状态机，再看链式和多任务编排。',
            points: [
              'pending / fulfilled / rejected / settled',
              '状态一旦定型就不可逆',
              'then / catch / finally 的分工',
              'all / allSettled / race / any 的差别',
              'unhandledrejection 是最后一道兜底',
            ],
          },
          {
            id: 'outline',
            kind: 'outline',
            title: '这一节回答这些问题',
            points: [
              'Promise 相比 callback 到底解决了什么',
              '为什么说 Promise 是一个状态机',
              'then 链式和多个分支有什么区别',
              '多个 Promise 一起跑时到底谁决定整体结果',
            ],
          },
          {
            id: 'why-promise',
            kind: 'compare',
            eyebrow: '知识点 04 · 4.1',
            title: '为什么要从 callback 走向 Promise',
            subtitle:
              '本质不是语法喜好，而是 Promise 给“未来值”起了名字，让它可以被继续传递、统一收口错误。',
            compare: {
              leftTitle: '✗ 回调嵌套：值被困在括号里',
              rightTitle: '✓ Promise 链：未来值可以继续往下传',
              left: {
                code: {
                  language: 'js',
                  source: `getUser(1, function (err, user) {
  if (err) return handle(err);
  getOrders(user.id, function (err, orders) {
    if (err) return handle(err);
    getDetail(orders[0].id, function (err, detail) {
      if (err) return handle(err);
      render(detail);
    });
  });
});`,
                },
              },
              right: {
                code: {
                  language: 'js',
                  source: `getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getDetail(orders[0].id))
  .then((detail) => render(detail))
  .catch((err) => handle(err));`,
                },
              },
            },
          },
          {
            id: 'state-machine',
            kind: 'content',
            eyebrow: '知识点 04 · 4.2',
            title: 'Promise 是一个单向定型的状态机',
            subtitle:
              '状态图一定要像流程图一样背下来：从 pending 出发，只能走向 fulfilled 或 rejected；一旦定型，就归入 settled，后面不会再变。',
            flow: [
              {
                label: '01',
                title: 'pending',
                description: '刚创建，结果未知。这是 Promise 唯一的起点。',
                meta: 'start',
              },
              {
                label: '02',
                title: 'resolve(value)',
                description: '第一次成功定型，进入 fulfilled，并带上兑现值。',
                meta: 'success',
              },
              {
                label: '03',
                title: 'reject(error)',
                description: '第一次失败定型，进入 rejected，并带上拒绝原因。',
                meta: 'failure',
              },
              {
                label: '04',
                title: 'settled',
                description: 'fulfilled 与 rejected 的统称。只要定型了，就不能再跳回 pending 或切换到另一边。',
                meta: 'final',
              },
            ],
            note: {
              tone: 'trap',
              label: '必须记住',
              text: '状态只能单向定型一次。后续重复调用 resolve / reject 不会报错，但会被静默忽略。这是 Promise 链能够稳定成立的前提。',
            },
          },
          {
            id: 'methods',
            kind: 'content',
            eyebrow: '知识点 04 · 4.3',
            title: 'then / catch / finally 各自负责什么',
            subtitle:
              '这三个方法不是并列记忆点，而是一条完整流程：成功走 then，失败走 catch，最后无论如何都会进 finally。',
            bullets: [
              {
                title: '.then(onFulfilled)',
                text: '处理成功结果，并且返回一个新的 Promise，所以能继续链下去。',
                code: {
                  language: 'js',
                  source: `Promise.resolve(1)
  .then((v) => v + 1)`,
                },
              },
              {
                title: '.catch(onRejected)',
                text: '接住最近一次 rejection，也可以返回兜底值，把流程恢复给后续 then。',
                code: {
                  language: 'js',
                  source: `fetchData()
  .catch(() => '默认数据')`,
                },
              },
              {
                title: '.finally(onFinally)',
                text: '不关心成功值或失败原因，只负责关 loading、断开连接、做善后。',
                code: {
                  language: 'js',
                  source: `load()
  .finally(() => hideLoading())`,
                },
              },
            ],
            note: {
              tone: 'rule',
              label: '顺序',
              text: '成功路径通常是 then -> finally，失败路径通常是 catch -> finally。finally 放的是“无论成败都必须做”的收尾逻辑。',
            },
          },
          {
            id: 'state-demo',
            kind: 'demo',
            eyebrow: '知识点 04 · 4.3',
            title: 'live demo · Promise 状态机与链式',
            subtitle:
              '去独立实验里手动点击 resolve / reject，看状态怎样从 pending 定型；再跑链式与分支，亲眼看到“每个 then 返回新 Promise”和“同一个 Promise 可以挂多个 then”。',
            demo: {
              route: '/demos/week-4/promise/state-and-chain',
              ctaLabel: '打开实验',
              objectives: [
                '确认 Promise 只能从 pending 单向定型',
                '理解状态一旦定型就不可逆',
                '区分 then 链式与同一个 Promise 的多个分支',
              ],
              note: '建议先点 resolve，再点一次 resolve 或 reject，确认状态不会再变化；然后再跑链式和分支。',
            },
          },
          {
            id: 'chain-branch',
            kind: 'compare',
            eyebrow: '知识点 04 · 4.4',
            title: '链式和分支不是一回事',
            subtitle:
              '链式是“前一个 then 的返回值交给后一个 then”；分支是“同一个 Promise 定型后，多个 then 都收到同一份值”。',
            compare: {
              leftTitle: '链式：值一路往下传',
              rightTitle: '分支：同一份值发给多个监听者',
              left: {
                code: {
                  language: 'js',
                  source: `Promise.resolve(1)
  .then((v) => v + 1)
  .then((v) => v * 10)
  .then(console.log);`,
                },
              },
              right: {
                code: {
                  language: 'js',
                  source: `const shared = Promise.resolve('同一个值');
shared.then((v) => console.log('A', v));
shared.then((v) => console.log('B', v));
shared.then((v) => console.log('C', v));`,
                },
              },
            },
          },
          {
            id: 'error-rules',
            kind: 'content',
            eyebrow: '知识点 04 · 4.5',
            title: '错误会怎么传播',
            subtitle:
              'Promise 最大的好处之一，是错误能沿着链自动往下冒泡，不需要每一层都手写 if (err) return。',
            table: {
              headers: ['场景', '结果', '你该怎么记'],
              rows: [
                ['executor 里同步 throw', '自动变成 rejection', '会被最近的 catch 接住'],
                ['catch 返回普通值', '后面的 then 继续收到这个值', '这叫“恢复流程”'],
                ['异步回调里稍后 throw', '当前 Promise 的 catch 接不住', '因为抛错时 Promise 执行上下文早结束了'],
                ['没人处理的 rejection', '落到 unhandledrejection', '这是最后一道全局兜底'],
              ],
            },
            note: {
              tone: 'trap',
              label: '最容易丢分',
              text: 'catch 只能接住当前 Promise 链里的 rejection。异步回调里更晚发生的 throw，不会自动回到前面的 catch，需要你自己 reject 或交给全局兜底。',
            },
          },
          {
            id: 'combinators-demo',
            kind: 'demo',
            eyebrow: '知识点 04 · 4.6',
            title: 'live demo · Promise 编排与错误兜底',
            subtitle:
              '这页实验同时看两件事：多任务编排时谁决定整体成败，以及没人接住的 rejection 什么时候会落到全局 unhandledrejection。',
            demo: {
              route: '/demos/week-4/promise/combinators-and-errors',
              ctaLabel: '打开实验',
              objectives: [
                '区分 all、allSettled、race、any 的整体判定规则',
                '理解 catch 可以把流程恢复给后续 then',
                '记住没人接住的 rejection 会落到全局兜底',
              ],
              note: '建议先各点一次 all / allSettled / race / any，再点“catch 接住并继续往下走”和“触发未处理 rejection”。',
            },
          },
          {
            id: 'combinators-table',
            kind: 'content',
            eyebrow: '知识点 04 · 4.6',
            title: '四个最常考的编排工具',
            subtitle:
              '考试里最容易混的是“最先定型”和“最先成功”的区别。把这张表记清，做题就会很稳。',
            table: {
              headers: ['方法', '整体何时成功 / 失败', '一句话记忆'],
              rows: [
                ['Promise.all(list)', '全部成功才成功；一个失败就整体失败', '一个都不能少'],
                ['Promise.allSettled(list)', '等全部结束后统一返回，不管成功失败', '有几个算几个'],
                ['Promise.race(list)', '最先定型的那个决定整体结果', '比“谁先结束”'],
                ['Promise.any(list)', '最先成功的那个决定整体结果；全部失败才失败', '比“谁先成功”'],
              ],
            },
            note: {
              tone: 'tip',
              label: '口诀',
              text: 'all 看“全员成功”，allSettled 看“全员结束”，race 看“谁先定型”，any 看“谁先成功”。',
            },
          },
          {
            id: 'wrapper-code',
            kind: 'code',
            eyebrow: '知识点 04 · 4.7',
            title: '04-promise-timeout.js',
            code: {
              language: 'javascript',
              filename: '04-promise-timeout.js',
              source: `function withTimeout(promise, ms) {
  const timer = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout after ' + ms + 'ms')), ms);
  });

  return Promise.race([promise, timer]);
}

withTimeout(fetchJSON('/api/users'), 3000)
  .then((data) => render(data))
  .catch((err) => showError(err.message))
  .finally(() => hideLoading());`,
              highlightLines: [2, 3, 6, 9, 10, 11],
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节要带走的三句话',
            points: [
              'Promise 只能从 pending 单向定型到 fulfilled 或 rejected，且一旦定型就不可逆。',
              '每个 then 都返回新的 Promise，所以链式能成立；同一个 Promise 挂多个 then 则是分支。',
              'all 是“一个都不能少”，allSettled 是“有几个算几个”，race 比谁先定型，any 比谁先成功。',
            ],
          },
        ],
      },
      {
        id: 'async-await',
        title: 'async / await',
        short: 'async / await',
        summary:
          '本质是 Promise 的语法糖：async 总返回 Promise，await 暂停并取值，错误处理回归 try/catch。',
        tags: ['协程', 'await', 'try / catch'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 知识点 05',
            title: '能不能写得像同步代码一样',
            subtitle:
              'async / await 没有把异步变成同步，它只是把 Promise 的使用方式换成了更顺眼的“从上往下读”。',
            points: [
              'async 总返回 Promise',
              'await 会暂停当前 async 函数',
              'await 失败时会在该行抛出异常',
              '错误处理重新回到 try / catch / finally',
              '互不依赖的任务别连续 await',
            ],
          },
          {
            id: 'outline',
            kind: 'outline',
            title: '这一节回答这些问题',
            points: [
              'async / await 和 Promise 链到底是什么关系',
              '为什么说 async 总返回 Promise',
              'await 到底暂停了什么，又在哪里恢复',
              '什么时候该串行，什么时候该 Promise.all 并行',
            ],
          },
          {
            id: 'three-styles',
            kind: 'compare',
            eyebrow: '知识点 05 · 5.1',
            title: '同一段逻辑的三种写法',
            subtitle:
              'callback、Promise、async / await 解决的是同一类异步问题。进化方向是可读性，不是能力增强。',
            compare: {
              leftTitle: 'Promise 链：异步流程显式挂在 .then 上',
              rightTitle: 'async / await：顺序写法，更像同步',
              left: {
                code: {
                  language: 'js',
                  source: `getData(url)
  .then((data) => render(data))
  .catch((err) => console.error(err));`,
                },
              },
              right: {
                code: {
                  language: 'js',
                  source: `async function main() {
  try {
    const data = await getData(url);
    render(data);
  } catch (err) {
    console.error(err);
  }
}`,
                },
              },
            },
          },
          {
            id: 'async-rules',
            kind: 'content',
            eyebrow: '知识点 05 · 5.2',
            title: '先背两条核心规则',
            subtitle:
              '理解 async / await，不需要背一堆零散语法。只要把这两条规则牢牢记住，其他结论都能顺着推出来。',
            flow: [
              {
                label: '01',
                title: 'async function',
                description: '调用 async 函数时，永远先得到一个 Promise；return 普通值会自动包装成 fulfilled Promise。',
                meta: 'always promise',
              },
              {
                label: '02',
                title: 'throw inside async',
                description: '在 async 函数里抛出的错误，会自动变成 rejected Promise。',
                meta: 'reject',
              },
              {
                label: '03',
                title: 'await promise',
                description: 'await 会暂停当前 async 函数，等 Promise 定型后再从这一行后面继续执行。',
                meta: 'pause',
              },
              {
                label: '04',
                title: 'await rejected promise',
                description: '如果 Promise 被拒绝，就会在 await 这一行抛出异常，因此能被外层 try/catch 接住。',
                meta: 'throw here',
              },
            ],
            note: {
              tone: 'rule',
              label: '口诀',
              text: 'async 总返回 Promise；await 成功就取值，失败就抛出。所以 async / await 的错误处理可以回归 try / catch。',
            },
          },
          {
            id: 'await-model',
            kind: 'content',
            eyebrow: '知识点 05 · 5.3',
            title: 'await 的暂停与恢复到底发生在哪里',
            subtitle:
              '暂停的不是整个 JavaScript 世界，而只是“当前这个 async 函数”。外面的同步代码会继续跑，Promise 定型后再把后半段排进微任务队列恢复。',
            table: {
              headers: ['写法', '真实发生的事'],
              rows: [
                ['async function f() { return 1 }', '返回 fulfilled Promise，兑现值是 1'],
                ['async function f() { throw err }', '返回 rejected Promise，拒绝原因是 err'],
                ['await 123', '非 Promise 值会被当成已兑现 Promise，立刻取出 123'],
                ['await fetch(url)', '暂停当前 async 函数，等 fetch Promise 定型后再恢复'],
                ['await Promise.reject(err)', '在 await 这一行抛出异常，交给 try/catch'],
              ],
            },
            note: {
              tone: 'tip',
              label: '术语',
              text: '这就是“协程”的直觉：函数可以在 await 处挂起，等条件满足后从同一位置继续，而不是从头重跑。',
            },
          },
          {
            id: 'serial-parallel-demo',
            kind: 'demo',
            eyebrow: '知识点 05 · 5.4',
            title: 'live demo · 串行 await 与 Promise.all',
            subtitle:
              '去独立实验里直接比较三次连续 await 和 Promise.all 的总耗时，再顺手看同步 / 微任务 / 宏任务的执行顺序。',
            demo: {
              route: '/demos/week-4/async-await/serial-vs-parallel',
              ctaLabel: '打开实验',
              objectives: [
                '比较串行 await 与 Promise.all 的总耗时差别',
                '理解互不依赖的任务为什么应该并行',
                '看清同步、微任务、宏任务的执行先后',
              ],
              note: '建议先跑串行，再跑并行，最后点执行顺序演示，把“等待时间”和“执行队列”两件事分开理解。',
            },
          },
          {
            id: 'pitfalls',
            kind: 'content',
            eyebrow: '知识点 05 · 5.5',
            title: '四个最常见的 async / await 坑',
            subtitle:
              '这四类错法都很常见，而且都不是“语法细节”，而是会直接导致逻辑跑偏或性能变差。',
            bullets: [
              {
                title: 'await 只能写在 async 函数里',
                text: '普通函数里直接写 await 会 SyntaxError；想用 await，先把函数声明成 async。',
                code: {
                  language: 'js',
                  source: `async function good() {
  const res = await fetch(url);
}`,
                },
              },
              {
                title: '忘记 await，拿到的是 Promise',
                text: '变量类型会立刻错掉。你以为自己拿到的是 data，其实只是一个还没展开的 Promise。',
                code: {
                  language: 'js',
                  source: `const data = fetch(url);
console.log(data.name); // undefined`,
                },
              },
              {
                title: 'forEach + await 不会顺序等待',
                text: 'forEach 不会等待 async 回调结束；需要顺序时用 for...of，需要并行时用 Promise.all。',
                code: {
                  language: 'js',
                  source: `for (const id of ids) {
  await fetchUser(id);
}`,
                },
              },
              {
                title: '互不依赖的请求别连续 await',
                text: '连续 await 会把耗时相加；互不依赖时应该同时发出，再用 Promise.all 汇总。',
                code: {
                  language: 'js',
                  source: `const [a, b, c] = await Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3),
]);`,
                },
              },
            ],
            note: {
              tone: 'trap',
              label: '判断题',
              text: '问自己一句：后一个任务需不需要前一个结果？需要就串行；不需要就并行。很多“async 写慢了”的根因，其实只是错误地连续 await。',
            },
          },
          {
            id: 'errors-demo',
            kind: 'demo',
            eyebrow: '知识点 05 · 5.5',
            title: 'live demo · try / catch / finally 与 async 坑点',
            subtitle:
              '这页实验把 try/catch/finally、忘记 await、forEach + await 放在一起做对照，专门强化“错误会在哪里出现、为什么会出现”。',
            demo: {
              route: '/demos/week-4/async-await/errors-and-pitfalls',
              ctaLabel: '打开实验',
              objectives: [
                '理解 await 被拒绝时为什么会直接跳进 catch',
                '确认忘记 await 拿到的是 Promise 而不是数据',
                '记住 forEach 不会等待 async 回调',
              ],
              note: '建议按按钮从左到右看：先看 try/catch/finally，再看忘记 await，最后看 forEach + await。',
            },
          },
          {
            id: 'promise-vs-async',
            kind: 'content',
            eyebrow: '知识点 05 · 5.6',
            title: 'Promise 还是 async / await',
            subtitle:
              '它们不是替代关系，而是不同层级的表达方式。日常业务更常写 async / await，但底层模型仍然是 Promise。',
            table: {
              headers: ['维度', 'Promise 链', 'async / await'],
              rows: [
                ['可读性', 'then / catch 链式，长了会拐弯', '从上往下读，更接近同步代码'],
                ['错误处理', '集中在 catch', 'try / catch / finally 更自然'],
                ['并发表达', 'Promise.all / race 等直接写在链外', '通常 await Promise.all(...)'],
                ['复用未来值', 'Promise 对象可以随意传递、挂多个处理器', 'await 后拿到的是普通值，复用层次更靠后'],
                ['本质', '底层模型', 'Promise 的语法糖'],
              ],
            },
            note: {
              tone: 'tip',
              label: '结论',
              text: '业务代码通常优先 async / await；当你在设计底层 API、处理并发工具或需要传递“未来值对象”本身时，仍然要直接思考 Promise。',
            },
          },
          {
            id: 'wrapper-code',
            kind: 'code',
            eyebrow: '知识点 05 · 5.7',
            title: '05-fetch-json-async.js',
            code: {
              language: 'javascript',
              filename: '05-fetch-json-async.js',
              source: `async function fetchJSON(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (err) {
    throw new Error('网络错误：' + err.message);
  }

  if (!res.ok) {
    throw new Error('HTTP ' + res.status + ' ' + res.statusText);
  }

  const type = res.headers.get('content-type') || '';
  if (!type.includes('application/json')) {
    throw new Error('响应不是 JSON：' + type);
  }

  return await res.json();
}`,
              highlightLines: [4, 5, 8, 9, 12, 13, 16],
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节要带走的三句话',
            points: [
              'async 总返回 Promise；await 成功就取值，失败就在该行抛出异常。',
              'async / await 的最大收益不是“更高级”，而是错误处理重新回到 try / catch / finally。',
              '互不依赖的任务别连续 await；该并行时就用 Promise.all，把等待时间压到最短。',
            ],
          },
        ],
      },
      {
        id: 'http-server',
        title: 'HTTP Server 与 Express',
        short: 'HTTP Server',
        summary:
          '从 Web / Internet / WWW 的层级，到 HTTP 请求-响应，再到 Express 最小服务器与 RESTful 路由。',
        tags: ['Node.js', 'Express', 'RESTful'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 知识点 06',
            title: '前端拿数据的另一头，到底是谁在回话',
            subtitle:
              '前面几章讲的是浏览器如何发请求；这一章把镜头转到服务器端，看 HTTP 请求怎么被接住、路由怎么被匹配、响应怎么被组装出来。',
            points: [
              'Web / Internet / WWW 不是一个概念',
              'HTTP 的基本单位是 request / response',
              '服务器按 method + path 处理请求',
              'Express 帮我们更轻松地写路由',
              'RESTful 把 CRUD 映射成统一的 URL + Method 约定',
            ],
          },
          {
            id: 'outline',
            kind: 'outline',
            title: '这一节回答这些问题',
            points: [
              'Internet、Web、WWW 到底分别指什么',
              'HTTP 请求和响应里到底装了哪些信息',
              'Express 最小服务器长什么样',
              'RESTful 为什么总在讲 GET / POST / PUT / DELETE',
            ],
          },
          {
            id: 'layers',
            kind: 'content',
            eyebrow: '知识点 06 · 6.1',
            title: '先把三个词分清：Internet、Web、WWW',
            subtitle:
              '这三个词经常被混说，但它们不是一层东西。考试里很喜欢用这个来做概念辨析。',
            table: {
              headers: ['名词', '它是什么', '例子'],
              rows: [
                ['Internet', '底层网络基础设施，负责把机器连起来', '光纤、路由器、IP、TCP'],
                ['Web', '基于 Internet 构建的一套信息访问系统', '浏览器访问网站、点击链接、提交表单'],
                ['WWW', 'World Wide Web，Web 上由网页和链接组成的内容网络', 'HTML 页面、超链接、站点之间跳转'],
              ],
            },
            note: {
              tone: 'rule',
              label: '一句话',
              text: 'Internet 是基础设施，Web 是使用方式，WWW 是 Web 上那张由网页组成的内容网络。',
            },
          },
          {
            id: 'request-response-flow',
            kind: 'content',
            eyebrow: '知识点 06 · 6.2',
            title: 'HTTP 是一次请求-响应循环',
            subtitle:
              '浏览器和服务器的对话不是“实时心灵感应”，而是一问一答：请求发过去，服务器处理完，再回一个响应。',
            flow: [
              {
                label: '01',
                title: '浏览器组装请求',
                description: '把 method、path、headers、body 拼成一条 HTTP 请求报文。',
                meta: 'request',
              },
              {
                label: '02',
                title: '服务器接收请求',
                description: 'HTTP Server 读到请求行后，决定交给哪个处理逻辑。',
                meta: 'server',
              },
              {
                label: '03',
                title: '执行业务逻辑',
                description: '查询数据库、校验参数、调用服务、生成返回数据。',
                meta: 'logic',
              },
              {
                label: '04',
                title: '返回响应',
                description: '服务器回状态码、响应头和响应体，浏览器再据此渲染界面。',
                meta: 'response',
              },
            ],
            note: {
              tone: 'tip',
              label: '连接前文',
              text: 'XHR、fetch、async / await 讲的是“客户端如何发起这次对话”；HTTP Server 与 Express 讲的是“服务端如何接住并回应这次对话”。',
            },
          },
          {
            id: 'http-shape',
            kind: 'content',
            eyebrow: '知识点 06 · 6.3',
            title: '一条 HTTP 消息里最常见的部分',
            subtitle:
              '不用背报文格式的每个字符，但一定要知道 method、path、status、headers、body 分别是什么。',
            table: {
              headers: ['部分', '请求里是什么', '响应里是什么'],
              rows: [
                ['起始行', 'GET /api/users HTTP/1.1', 'HTTP/1.1 200 OK'],
                ['Headers', 'Host / Accept / Content-Type', 'Content-Type / Cache-Control / Set-Cookie'],
                ['Body', 'POST / PUT 常见，装提交数据', '装返回给前端的数据，如 JSON / HTML'],
                ['Status', '请求里没有状态码', '200 / 201 / 404 / 500 等状态码'],
              ],
            },
            note: {
              tone: 'warn',
              label: '别混',
              text: '404 这种状态码只会出现在响应里，不会出现在请求里。它表示“服务器已经收到请求，但没找到对应资源或路由”。',
            },
          },
          {
            id: 'http-demo',
            kind: 'demo',
            eyebrow: '知识点 06 · 6.3',
            title: 'live demo · HTTP 请求-响应检视器',
            subtitle:
              '去实验里直接看 GET、POST、404 三种场景下，请求报文和响应报文到底长什么样，把抽象名词变成可以对照的文本。',
            demo: {
              route: '/demos/week-4/http-server/request-response',
              ctaLabel: '打开实验',
              objectives: [
                '看清请求行、请求头、请求体分别是什么',
                '理解响应状态码与响应体如何一起构成结果',
                '区分“404 路由不存在”和“网络错误”不是一回事',
              ],
              note: '建议按 GET -> POST -> 404 的顺序点一遍，先看正常读取，再看带请求体的创建，最后看服务端返回 404。',
            },
          },
          {
            id: 'node-vs-express',
            kind: 'compare',
            eyebrow: '知识点 06 · 6.4',
            title: '为什么大家常说 Node.js + Express',
            subtitle:
              'Node.js 提供运行 JavaScript 服务器的环境；Express 则在这个环境上，帮你把路由、请求体、响应封装得更顺手。',
            compare: {
              leftTitle: 'Node 原生 http：能做，但更底层',
              rightTitle: 'Express：常见 Web 任务更省力',
              left: {
                code: {
                  language: 'js',
                  source: `import http from 'node:http';

http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
}).listen(3000);`,
                },
              },
              right: {
                code: {
                  language: 'js',
                  source: `import express from 'express';

const app = express();
app.get('/api/ping', (req, res) => {
  res.status(200).json({ ok: true });
});
app.listen(3000);`,
                },
              },
            },
          },
          {
            id: 'express-minimal',
            kind: 'code',
            eyebrow: '知识点 06 · 6.5',
            title: '06-express-minimal.js',
            code: {
              language: 'javascript',
              filename: '06-express-minimal.js',
              source: `import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.status(200).json([{ id: 1, name: 'Amy' }]);
});

app.post('/api/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  res.status(201).json(user);
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});`,
              highlightLines: [3, 4, 6, 7, 10, 11, 14],
            },
          },
          {
            id: 'express-demo',
            kind: 'demo',
            eyebrow: '知识点 06 · 6.6',
            title: 'live demo · Express 路由与 RESTful',
            subtitle:
              '这页实验把 method + path 的组合拉出来单独看，帮助你建立“路由匹配”和“CRUD 映射”的直觉。',
            demo: {
              route: '/demos/week-4/http-server/express-routing',
              ctaLabel: '打开实验',
              objectives: [
                '理解 Express 如何按 method + path 匹配路由',
                '理解 req.params、req.body、res.status().json() 的基本位置',
                '把 RESTful 的 CRUD 映射记成可运行的直觉',
              ],
              note: '建议先点 GET / POST / PUT / DELETE 四种正常路径，再点一次没有注册过的 GET /api/posts 看 404。',
            },
          },
          {
            id: 'restful-crud',
            kind: 'content',
            eyebrow: '知识点 06 · 6.6',
            title: 'RESTful 最常见的 CRUD 映射',
            subtitle:
              '它不是强制法条，而是一套广泛采用的命名约定。越熟悉这套约定，看接口文档就越快。',
            table: {
              headers: ['操作意图', 'Method + Path', '常见含义'],
              rows: [
                ['读取列表', 'GET /api/users', '返回全部或一批用户'],
                ['读取单个', 'GET /api/users/:id', '返回某个 id 对应的用户'],
                ['创建', 'POST /api/users', '根据 req.body 创建新用户'],
                ['更新', 'PUT /api/users/:id', '整体更新某个已有用户'],
                ['删除', 'DELETE /api/users/:id', '删除某个已有用户'],
              ],
            },
            note: {
              tone: 'tip',
              label: '记法',
              text: '别把“动作”写进 path 里，比如 /getUsers、/deleteUser。RESTful 更倾向于把“动作”放在 method，把“资源”放在 path。',
            },
          },
          {
            id: 'status-summary',
            kind: 'content',
            eyebrow: '知识点 06 · 6.7',
            title: '这章最常见的几个状态码',
            subtitle:
              '前端看到状态码时，脑子里应该能立刻对应到服务器大概发生了什么。',
            table: {
              headers: ['状态码', '含义', '常见场景'],
              rows: [
                ['200 OK', '请求成功', 'GET 成功返回数据'],
                ['201 Created', '创建成功', 'POST 成功创建资源'],
                ['204 No Content', '成功但无响应体', 'DELETE 删除成功'],
                ['404 Not Found', '没找到资源或路由', '请求路径不存在'],
                ['500 Internal Server Error', '服务器内部异常', '后端代码报错或依赖故障'],
              ],
            },
            note: {
              tone: 'trap',
              label: '别误会',
              text: '404 表示服务器收到了请求，但没有匹配内容；真正“连服务器都没联系上”的情况，通常连 HTTP 状态码都拿不到。',
            },
          },
          {
            id: 'closing',
            kind: 'closing',
            title: '这一节要带走的三句话',
            points: [
              'HTTP 的基本单位是一条 request 和一条 response；method、path、status、body 是最常见的关键信息。',
              'Node.js 是运行环境，Express 是更顺手的 Web 服务器框架，负责帮你组织路由与响应。',
              'RESTful 的核心不是背单词，而是把 CRUD 映射成稳定的 Method + Path 习惯。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'week-5',
    index: 5,
    title: 'UI/UX 与可用性',
    theme: '不只是能用，还要清晰好用',
    description:
      '把界面的“看起来像样”升级成“信息有层级、交互有示能、用户知道怎么用”。',
    accent: 'violet',
    topics: ['ui-ux'],
    lessons: [
      structuredLesson({
        id: 'ui-vs-ux',
        title: 'UI 与 UX 的区别',
        short: 'UI 与 UX',
        summary:
          'UX 管“用起来合不合理”，UI 管“看起来清不清楚”，但两者最终都服务于可用性。',
        tags: ['UI/UX', '概念辨析'],
        eyebrow: 'Week 5 · 知识点 01',
        coverTitle: 'UI 和 UX 不是一回事，但它们必须一起工作',
        points: [
          'UX 关心逻辑、流程与用户研究',
          'UI 关心视觉、图形与品牌表达',
          'UI 的目标不是好看，而是让 app 更好用',
        ],
        sections: [
          {
            title: 'UX：用户如何顺利完成目标',
            subtitle:
              '可用性、逻辑性、用户研究是 UX 的三条主线。学生要能区分“流程有问题”和“样式不好看”。',
          },
          {
            title: 'UI：用户眼前看到与点到的那一层',
            subtitle:
              '图形、文案、颜色、间距、品牌，都属于 UI 的职责范围，但不是孤立的装饰。',
            columns: 2,
          },
          {
            title: 'UI 的三层目标：不害怕 → 找到东西 → 会做事',
            subtitle:
              '从图形基础，到视觉层级，再到示能，三层是递进关系，而不是三个平行清单。',
          },
        ],
        compare: {
          title: '辨析一个任务到底偏 UX 还是偏 UI',
          subtitle: '比如“重新设计结账流程”偏 UX；“提高主按钮对比度”偏 UI。',
          leftTitle: 'UX 任务',
          rightTitle: 'UI 任务',
        },
        closingPoints: [
          'UX 解决“顺不顺”，UI 解决“清不清楚”。',
          'UI 的终极目标不是审美，而是帮助用户完成任务。',
          '后面的对齐、层级、示能，都是 UI 为“可用”服务的具体手段。',
        ],
      }),
      structuredLesson({
        id: 'grid-hierarchy',
        title: '对齐、配色与视觉层级',
        short: '对齐与层级',
        summary:
          '1200 / 12 / 16 三个数字，以及让重要元素突出的六种手段。',
        tags: ['对齐', '配色', '视觉层级'],
        eyebrow: 'Week 5 · 知识点 02',
        coverTitle: '一个界面先要“稳”，用户才看得懂',
        points: [
          '对齐和网格决定秩序感',
          '字体与配色决定可读性和品牌感',
          '视觉层级决定用户先看到什么',
        ],
        sections: [
          {
            title: '对齐与网格：1200 / 12 / 16 的工程直觉',
            subtitle:
              '控制内容宽度、列结构和基础间距，先把页面从“乱”变成“稳”。',
          },
          {
            title: '字体与配色：不要只追求好看，要先读得清',
            subtitle:
              '标题、正文、辅助信息必须有清晰区分；配色优先服务信息分组与状态表达。',
            columns: 2,
          },
          {
            title: '视觉层级：位置、大小、颜色、对比、留白、运动',
            subtitle:
              '同一页面里，不同层级的信息要在第一眼就被分出来，不能全都像“一级重点”。',
            columns: 2,
          },
        ],
        compare: {
          title: '坏 UI vs 好 UI',
          subtitle: '左边是“信息一起喊”，右边是“重要内容先被看到”。',
          leftTitle: '❌ 层级混乱',
          rightTitle: '✅ 层级清晰',
        },
        closingPoints: [
          '对齐先解决秩序，层级再解决重点。',
          '视觉设计不是堆效果，而是帮用户更快找到东西。',
          '当页面很挤时，先删掉次要视觉，再谈精修。',
        ],
      }),
      structuredLesson({
        id: 'affordance-checklist',
        title: '示能性与 UI 检查清单',
        short: '示能与清单',
        summary:
          '示能的三种类型，以及 12 条设计检查清单。',
        tags: ['示能', '检查清单'],
        eyebrow: 'Week 5 · 知识点 03',
        coverTitle: '用户会不会点，往往在点击前就决定了',
        points: [
          '示能是“看起来像能做什么”',
          '示能和反馈不是同一个概念',
          '12 条清单是界面走查时的最小框架',
        ],
        sections: [
          {
            title: 'Affordance：交互前的提示，不是交互后的反馈',
            subtitle:
              '示能发生在点击前，反馈发生在点击后。很多学生会把 hover / toast 误说成示能。',
          },
          {
            title: '三种示能：Explicit / Pattern / False',
            subtitle:
              'Explicit 最直接，Pattern 靠经验迁移，False Affordance 最危险，因为它在诱导用户犯错。',
            columns: 2,
          },
          {
            title: 'UI 12 条检查清单',
            subtitle:
              '可见性、示能、反馈、一致性、约束、有效性、效率等，是快速评估一个界面的最小检查表。',
            columns: 2,
            placeholderCount: 6,
          },
        ],
        compare: {
          title: '哪一种示能必须尽量避免',
          subtitle: 'False Affordance 会让用户“以为能做”，但实际不能做。',
          leftTitle: '❌ False Affordance',
          rightTitle: '✅ Explicit / Pattern',
        },
        closingPoints: [
          '示能是交互前，反馈是交互后。',
          'False Affordance 是高频扣分点，必须优先避免。',
          '不会走查界面时，就回到这 12 条清单。',
        ],
      }),
      placeholderLesson(
        'accessibility-basics',
        '可访问性基础：POUR 与常见误区',
        '可访问性基础',
        '把“所有人都能用”从口号变成具体的界面约束。',
        ['Perceivable / Operable / Understandable / Robust', '颜色、焦点、语义与键盘访问', 'A11y 不等于加 aria 标签'],
        ['A11y', 'POUR'],
      ),
      placeholderLesson(
        'usability-testing',
        '可用性测试与真实反馈',
        '可用性测试',
        '让设计不再只靠直觉，而是通过任务观察与迭代来改进。',
        ['可用性测试的最小流程', '任务脚本与观察点', '从反馈回到设计修改'],
        ['Usability Testing', '反馈'],
      ),
      placeholderLesson(
        'figma-components',
        'Figma 与组件库思维',
        'Figma 与组件库',
        '把页面从“单次设计”提升为“可复用系统”。',
        ['组件、变体与设计系统', 'Figma 与前端组件的映射', '从样式到规范的抽象'],
        ['Figma', 'Component Library'],
      ),
    ],
  },
  {
    id: 'week-6',
    index: 6,
    title: 'React 入门与组件思维',
    theme: '从声明式渲染开始',
    description:
      '先理解 React 为什么存在，再掌握 JSX、挂载、组件拆分、样式作用域与虚拟 DOM。',
    accent: 'rose',
    topics: ['react'],
    lessons: [
      structuredLesson({
        id: 'declarative',
        title: '命令式 vs 声明式',
        short: '命令式 vs 声明式',
        summary:
          '为什么需要 React：状态转换会组合爆炸。',
        tags: ['React', '声明式'],
        eyebrow: 'Week 6 · 知识点 01',
        coverTitle: 'React 最重要的变化，不是语法，而是思维方式',
        points: [
          '命令式指定过程，声明式只描述结果',
          '状态一多，命令式转换会组合爆炸',
          'React 把“怎么改 DOM”关进了框架内部',
        ],
        sections: [
          {
            title: '命令式：你自己负责每一步 DOM 操作',
            subtitle:
              '先找节点、再改样式、再删元素。逻辑简单时直观，但状态一多就难维护。',
          },
          {
            title: '声明式：你只负责描述“这个状态下界面长什么样”',
            subtitle:
              'React 接管状态到视图的映射，让你不再穷举每一种转换路径。',
          },
          {
            title: '组合爆炸：为什么 50 个页面会膨胀出 2450 种转换',
            subtitle:
              '这节要让学生明确：React 解决的不是“代码少写一点”，而是复杂度增长方式。',
          },
        ],
        compare: {
          title: '同一件事：改背景色',
          subtitle: '左边是一步步命令浏览器，右边是描述状态下的结果。',
          leftTitle: '命令式',
          rightTitle: '声明式',
        },
        code: {
          language: 'jsx',
          filename: 'declarative-vs-imperative.jsx',
          title: '从 DOM 操作到 JSX 描述',
          source: `// 命令式：指定过程\n document.body.style.backgroundColor = 'green'\n\n// 声明式：指定结果\nfunction Page() {\n  return <main style={{ backgroundColor: 'green' }}>Hello</main>\n}`,
        },
        closingPoints: [
          '命令式管“怎么做”，声明式管“最终长什么样”。',
          'React 的价值不在于更短，而在于复杂度可控。',
          '后面的虚拟 DOM 和 state，都是为了支撑这套声明式模型。',
        ],
      }),
      structuredLesson({
        id: 'jsx',
        title: 'JSX 语法',
        short: 'JSX',
        summary:
          'JavaScript 的语法扩展：className、单一根节点、表达式插值。',
        tags: ['JSX', '语法'],
        eyebrow: 'Week 6 · 知识点 02',
        coverTitle: 'JSX 不是模板语言，它本质还是 JavaScript',
        points: [
          'JSX 是 JS 的语法扩展，不是字符串模板',
          '属性和表达式规则必须讲清楚',
          '旧 slides 里的写法要统一订正到 React 19 语境',
        ],
        sections: [
          {
            title: '单一根节点、花括号表达式与属性规则',
            subtitle:
              '根节点限制、`{}` 插值、布尔属性与普通 HTML 写法的差异，是 JSX 最容易混淆的起点。',
          },
          {
            title: '为什么是 className 而不是 class',
            subtitle:
              'JSX 在 JS 语境里工作，所以保留字与属性名需要遵循 React 的命名约定。',
            columns: 2,
          },
          {
            title: 'JSX 最终会被转译成 JS 调用',
            subtitle:
              '学生至少要知道 JSX 不是浏览器原生能力，它需要编译工具参与。',
          },
        ],
        code: {
          language: 'tsx',
          filename: 'hello-jsx.tsx',
          title: '一个最小 JSX 例子',
          source: `function App() {\n  const name = 'COMP6080'\n\n  return (\n    <section className=\"card\">\n      <h1>Hello, {name}</h1>\n      <p>JSX lets us describe UI with JavaScript.</p>\n    </section>\n  )\n}`,
        },
        closingPoints: [
          'JSX 不是 HTML 文件，它运行在 JavaScript 里。',
          '`class` 要写成 `className`，插值要用 `{}`。',
          '看到 JSX，就要想到“它最后会被转译”。',
        ],
      }),
      placeholderLesson(
        'mounting',
        '项目结构、转译与挂载',
        '项目结构与挂载',
        'React 19 的挂载方式、Transpilation，以及旧版 API 的订正。',
        ['挂载容器 #root', 'createRoot(...).render(...)', 'JSX 为什么需要转译'],
        ['挂载', 'createRoot', 'Transpilation'],
      ),
      placeholderLesson(
        'components-props',
        '组件与 Props',
        '组件与 Props',
        '把界面拆成可复用的最小单元，并让数据单向流动。',
        ['组件拆分的依据', 'Props 的输入输出关系', '单向数据流与复用'],
        ['组件', 'Props'],
      ),
      placeholderLesson(
        'styling',
        'React 中的样式与 CSS 作用域',
        '样式与作用域',
        'inline style 的双花括号、camelCase，以及“import 不管隔离”。',
        ['inline style 接收对象', 'camelCase 属性名', 'CSS 全局污染与隔离方案'],
        ['样式', 'CSS Modules'],
      ),
      structuredLesson({
        id: 'virtual-dom',
        title: '虚拟 DOM 与 Diff',
        short: '虚拟 DOM',
        summary:
          '虚拟 DOM 没有让 DOM 变快，只是减少了不必要的 DOM 操作。',
        tags: ['虚拟 DOM', 'Diff'],
        eyebrow: 'Week 6 · 知识点 06',
        coverTitle: '声明式的简单，背后靠的是一套更新策略',
        points: [
          '真实 DOM 更新昂贵，根源在 layout / reflow',
          '虚拟 DOM 的四步必须能背出来',
          '两个误区：它没让 DOM 变快，也不是浏览器原生能力',
        ],
        sections: [
          {
            title: '为什么频繁改真实 DOM 会慢',
            subtitle:
              '真正昂贵的是 layout 和 reflow，不是“写几行 JS”本身；这一层必须先讲清。',
          },
          {
            title: '虚拟 DOM 四步：副本 → 改副本 → Diff → 外科式更新',
            subtitle:
              '学生要能把完整流程口头复述出来，而不是只会说“React 会优化”。',
            columns: 2,
          },
          {
            title: 'key 与启发式 Diff',
            subtitle:
              'React 不是求理论最优解，而是在工程上做同层比较；列表渲染要给稳定 key。',
          },
        ],
        compare: {
          title: '两个高频误解',
          subtitle: '考试时经常会把“减少 DOM 更新”和“DOM 变快”混为一谈。',
          leftTitle: '❌ 常见误解',
          rightTitle: '✅ 正确认知',
        },
        code: {
          language: 'tsx',
          filename: 'list-with-key.tsx',
          title: 'key 帮助 Diff 识别谁是谁',
          source: `function TodoList({ items }: { items: { id: string; name: string }[] }) {\n  return (\n    <ul>\n      {items.map((item) => (\n        <li key={item.id}>{item.name}</li>\n      ))}\n    </ul>\n  )\n}`,
        },
        closingPoints: [
          '虚拟 DOM 解决的是“少做无谓更新”，不是“让 DOM 本身更快”。',
          '四步流程是理论题高频考点。',
          '列表没有稳定 key，Diff 就很容易出问题。',
        ],
      }),
    ],
  },
  {
    id: 'week-7',
    index: 7,
    title: 'React 状态、数据与应用结构',
    theme: '从交互组件走向小型应用',
    description:
      '把状态、Effect、Fetch、路由与应用拆分串起来，完成从“组件”到“应用”的过渡。',
    accent: 'sky',
    topics: ['react'],
    lessons: [
      structuredLesson({
        id: 'usestate',
        title: 'useState 与渲染循环',
        short: 'useState',
        summary:
          'render → 改 state → 再 render 的完整闭环。',
        tags: ['useState', '渲染循环'],
        eyebrow: 'Week 7 · 知识点 01',
        coverTitle: '函数组件不是模板，state 会驱动它一遍遍重新执行',
        points: [
          'useState 返回当前值和 setter',
          'setter 是异步请求，不是同步赋值',
          '关键闭环：render → 改 state → 再 render',
        ],
        sections: [
          {
            title: '语法拆解：const [count, setCount] = useState(0)',
            subtitle:
              '当前值、更新函数、初始值各自负责什么，需要能当场说清楚。',
          },
          {
            title: '为什么说 state 更新是异步的',
            subtitle:
              '调用 setter 后，这一轮执行上下文里看到的还是旧值，不能指望下一行立即读到新值。',
          },
          {
            title: '条件渲染与函数式更新',
            subtitle:
              '从 `&&`、三元，到 `setCount(prev => prev + 1)`，都属于 useState 的最小实战闭环。',
            columns: 2,
          },
        ],
        code: {
          language: 'tsx',
          filename: 'counter.tsx',
          title: '一个最小的 state 驱动例子',
          source: `function Counter() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <button onClick={() => setCount((prev) => prev + 1)}>\n      点了 {count} 次\n    </button>\n  )\n}`,
        },
        closingPoints: [
          'useState 让组件从静态模板变成可交互界面。',
          'state 必须通过 setter 改，不能直接赋值。',
          '只要记住 render → state update → re-render，这节就稳了。',
        ],
      }),
      structuredLesson({
        id: 'lifecycle-effects',
        title: 'useEffect 与“生命周期思维”',
        short: 'useEffect',
        summary:
          '用 effect 处理副作用，但不过度把所有逻辑都塞进 effect。',
        tags: ['useEffect', '副作用'],
        eyebrow: 'Week 7 · 知识点 02',
        coverTitle: '函数组件里不再讲 class 生命周期，但副作用仍然存在',
        points: [
          'useEffect 不是“生命周期替身”，它是副作用容器',
          '依赖数组决定 effect 何时重新运行',
          '获取数据、订阅、清理，都属于 effect 典型场景',
        ],
        sections: [
          {
            title: '什么叫副作用：不是 render 结果本身的事',
            subtitle:
              '网络请求、事件监听、定时器、手动改 document title，这些都不属于纯渲染逻辑。',
          },
          {
            title: '依赖数组：不写、空数组、带依赖，分别意味着什么',
            subtitle:
              '学生常见误区是把依赖数组当“可选装饰”，这节要明确它决定了 effect 的执行时机。',
            columns: 2,
          },
          {
            title: '清理函数：为什么订阅和定时器必须收尾',
            subtitle:
              'effect 返回函数是为了撤销旧副作用，避免重复订阅、内存泄漏和逻辑叠加。',
          },
        ],
        code: {
          language: 'tsx',
          filename: 'fetch-users.tsx',
          title: '一个最小的数据获取 effect',
          source: `function Users() {\n  const [users, setUsers] = useState<string[]>([])\n\n  useEffect(() => {\n    fetch('/api/users')\n      .then((res) => res.json())\n      .then((data) => setUsers(data))\n  }, [])\n\n  return <pre>{JSON.stringify(users, null, 2)}</pre>\n}`,
        },
        closingPoints: [
          'useEffect 处理的是副作用，不是普通计算。',
          '依赖数组本质上在声明“我依赖哪些输入”。',
          '讲 effect 时，要主动和旧版 class 生命周期切开。',
        ],
      }),
      placeholderLesson(
        'fetch-hooks',
        'Using Fetch & Hooks',
        'Fetch 与 Hooks',
        '把网络请求放进 React 的数据流里，而不是写成散落的副作用。',
        ['请求状态建模', 'loading / error / success', 'fetch 与 hook 的组合方式'],
        ['Fetch', 'Hooks'],
      ),
      placeholderLesson(
        'multiple-files',
        '多文件组织与组件边界',
        '多文件组织',
        '从单文件 demo 过渡到真实项目结构。',
        ['按功能拆文件', '组件、hooks、utils 的边界', '“Before you code”的结构化思维'],
        ['架构', '文件组织'],
      ),
      placeholderLesson(
        'routing-spa',
        'Routing 与 SPA',
        'Routing 与 SPA',
        '多页面心智如何迁移到单页应用。',
        ['路由的作用', '页面切换 vs 组件切换', 'SPA 的收益与代价'],
        ['Routing', 'SPA'],
      ),
      placeholderLesson(
        'context-state',
        'useContext 与状态管理',
        'Context 与状态管理',
        '什么时候只用 props，什么时候该引入上下文。',
        ['props drilling 的边界', 'Context 的使用场景', '状态管理不要过早复杂化'],
        ['useContext', 'State Management'],
      ),
    ],
  },
  {
    id: 'week-8',
    index: 8,
    title: '测试、工程化与期末整合',
    theme: '把产品质量和考试能力一起收束',
    description:
      '补齐 UI 测试、预渲染、工程化、综合实战与真题串讲，把课程内容收束成期末视角。',
    accent: 'amber',
    topics: ['react', 'ui-ux', 'javascript'],
    lessons: [
      placeholderLesson(
        'ui-testing-a11y',
        'UI Testing 与可访问性验证',
        'UI Testing',
        '把“看起来对”变成“可验证地对”。',
        ['界面测试关注什么', '交互、可访问性与回归验证', 'Demo 驱动的测试思维'],
        ['Testing', 'A11y'],
      ),
      placeholderLesson(
        'pre-rendering',
        'Pre-rendering 与交付方式',
        'Pre-rendering',
        '理解 CSR、预渲染与不同交付方式的权衡。',
        ['为什么需要预渲染', 'CSR / SSR / SSG 的直觉', '性能与 SEO 的基本权衡'],
        ['Pre-rendering', 'Delivery'],
      ),
      placeholderLesson(
        'engineering',
        'Linting、工程化与部署',
        '工程化与部署',
        '构建、检查、打包与静态托管的基本流程。',
        ['Linting 的意义', '构建工具与开发服务器', '静态托管与子路径部署'],
        ['工程化', '部署', 'Linting'],
      ),
      placeholderLesson(
        'capstone',
        '综合实战项目',
        '综合实战',
        '从静态页面到数据驱动的完整小项目。',
        ['需求拆解与结构设计', '样式系统与响应式', '数据获取与状态管理'],
        ['实战', '综合'],
      ),
      placeholderLesson(
        'past-papers',
        '期末真题串讲',
        '真题串讲',
        '按考点密度排序，把最容易丢分的地方过一遍。',
        ['事件循环四步', '虚拟 DOM 四步', 'UI 12 条清单'],
        ['真题', '复习'],
      ),
      placeholderLesson(
        'exam-overview',
        '期末考试总复盘',
        '考试总复盘',
        '回到理论考试的视角，把“会做”收束成“会说清楚”。',
        ['高频理论题型', '如何组织短答题', '从项目经验抽象成考试答案'],
        ['Exam', 'Theory'],
      ),
    ],
  },
]

const WEEK_IDS = COURSE_WEEKS.map((w) => w.id)

export function isCourseWeekId(value: unknown): value is CourseWeekId {
  return typeof value === 'string' && (WEEK_IDS as string[]).includes(value)
}

export function getAllCourseWeeks(): CourseWeek[] {
  return COURSE_WEEKS
}

export function getCourseWeek(weekId: string): CourseWeek | null {
  if (!isCourseWeekId(weekId)) return null
  return COURSE_WEEKS.find((w) => w.id === weekId) ?? null
}

export function getCourseLesson(
  weekId: string,
  lessonId: string,
): { week: CourseWeek; lesson: CourseLesson } | null {
  const week = getCourseWeek(weekId)
  if (!week) return null
  const lesson = week.lessons.find((l) => l.id === lessonId)
  if (!lesson) return null
  return { week, lesson }
}

export function getFirstLessonId(weekId: string): string | null {
  const week = getCourseWeek(weekId)
  return week?.lessons[0]?.id ?? null
}

export function getCourseStats() {
  const lessonCount = COURSE_WEEKS.reduce((n, w) => n + w.lessons.length, 0)
  const readyCount = COURSE_WEEKS.reduce(
    (n, w) => n + w.lessons.filter((l) => l.status === 'ready').length,
    0,
  )
  return { weekCount: COURSE_WEEKS.length, lessonCount, readyCount }
}
