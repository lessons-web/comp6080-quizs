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
      placeholderLesson(
        'course-overview-git',
        '课程概览与 Git 入门',
        '课程概览与 Git',
        '理解课程节奏、评估方式，以及最小可用的 Git 工作流。',
        ['课程目标与学习方式', '为什么前端课从 Git 开始', 'clone / commit / push 的最小闭环'],
        ['课程概览', 'Git'],
      ),
      placeholderLesson(
        'structure',
        'HTML 文档结构',
        '文档结构',
        'head 与 body 的分工，一份最小可用文档的骨架。',
        ['doctype / html / head / body 各自职责', 'meta 与 title 的作用', '最小可用文档骨架'],
        ['文档结构', '语义化'],
      ),
      placeholderLesson(
        'semantics',
        '语义化标签与标题层级',
        '语义化',
        'div 不是万能的：用对标签让结构与含义同时正确。',
        ['语义标签概览（header / nav / main / section）', '标题层级 h1–h6 的规范用法', 'div 与 span 何时才该用'],
        ['语义化', '标题层级'],
      ),
      placeholderLesson(
        'links-images',
        '链接、图片与路径',
        '链接与图片',
        '相对路径与绝对路径，以及图片替代文本与图像类型。',
        ['a 标签与 href 取值', '相对路径 vs 绝对路径', 'img / alt 与常见图像类型'],
        ['链接', '图片', '路径'],
      ),
      placeholderLesson(
        'lists-tables',
        '列表、表格与预格式文本',
        '列表与表格',
        '有序/无序列表、表格结构，以及代码展示标签。',
        ['ol / ul / li 的语义差异', 'table 的 thead / tbody / th', 'pre / code 与等宽文本'],
        ['列表', '表格'],
      ),
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
      placeholderLesson(
        'selectors-cascade',
        '选择器与层叠优先级',
        '选择器与层叠',
        '同一元素被多条规则命中时，谁说了算。',
        ['选择器类型与权重计算', '层叠顺序与继承', '!important 的代价'],
        ['选择器', '优先级'],
      ),
      placeholderLesson(
        'box-model',
        '盒模型与单位',
        '盒模型',
        'content / padding / border / margin 与实际占位。',
        ['盒模型的四层结构', 'box-sizing 的作用', 'px / em / rem / % 的取舍'],
        ['盒模型', '单位'],
      ),
      placeholderLesson(
        'flexbox',
        'Flexbox 布局',
        'Flexbox',
        '一维布局的首选工具：主轴、交叉轴与对齐。',
        ['主轴与交叉轴', 'justify-content / align-items', 'flex-grow / shrink / basis'],
        ['Flexbox', '布局'],
      ),
      placeholderLesson(
        'grid-frameworks',
        'CSS Grid、框架与样式复用',
        'Grid 与框架',
        '从二维布局到 CSS 框架，理解“自己写”和“借助抽象”的边界。',
        ['CSS Grid 的核心概念', '何时引入 CSS 框架', '样式复用与可维护性'],
        ['Grid', 'CSS Framework'],
      ),
      placeholderLesson(
        'positioning-stacking',
        '定位、z-index 与视觉层级',
        '定位与层叠',
        'position 的几种取值，以及 z-index 为什么有时不生效。',
        ['static / relative / absolute / fixed / sticky', '层叠上下文如何形成', 'z-index 失效的常见原因'],
        ['定位', '层叠上下文'],
      ),
      placeholderLesson(
        'responsive-viewport',
        '移动端、媒体查询与开发者工具',
        '响应式与 DevTools',
        'viewport meta、媒体查询、移动优先，以及 DevTools 的调试路径。',
        ['viewport meta 的作用', '媒体查询语法与断点', '移动优先与 DevTools 调试'],
        ['响应式', 'viewport', 'DevTools'],
      ),
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
      placeholderLesson(
        'js-intro-syntax',
        'JavaScript 语言特性与语法',
        'JS 语法基础',
        '从和 C / Python 的差异入手，建立 JS 的基本执行模型。',
        ['变量、类型与弱类型直觉', '函数、对象与数组', '语句、表达式与常见语法坑'],
        ['JavaScript', 'Syntax'],
      ),
      placeholderLesson(
        'functions-closures',
        '高级函数与闭包',
        '函数与闭包',
        '函数是一等公民，以及闭包为什么在前端里无处不在。',
        ['函数作为参数和返回值', '作用域链与闭包', '闭包的常见实际场景'],
        ['函数', '闭包'],
      ),
      placeholderLesson(
        'ecosystem-npm',
        'JavaScript 生态、Node 与 npm',
        '生态与 npm',
        '理解前端不只是语言本身，还包含运行时、包管理与工程生态。',
        ['浏览器 JS vs Node.js', 'npm 的作用', '依赖安装与 package.json'],
        ['Node.js', 'npm', '生态'],
      ),
      placeholderLesson(
        'dom',
        'DOM 查询与操作',
        'DOM 操作',
        '把页面当成一棵树来查找和修改。',
        ['querySelector / querySelectorAll', '创建与插入节点', '修改属性、类名与文本'],
        ['DOM', '查询'],
      ),
      placeholderLesson(
        'events',
        '事件与事件委托',
        '事件',
        '事件流、监听器，以及用委托处理动态列表。',
        ['事件流与冒泡', 'addEventListener 与事件对象', '事件委托的适用场景'],
        ['事件', '事件委托'],
      ),
      placeholderLesson(
        'forms',
        '表单与客户端校验',
        '表单',
        '读取输入、阻止默认提交、给出即时的错误反馈。',
        ['读取表单元素的值', 'preventDefault 与提交时机', '校验与错误提示'],
        ['表单', '校验'],
      ),
      placeholderLesson(
        'storage',
        'localStorage 与持久化',
        '本地存储',
        '只能存字符串的键值仓库，以及“读后 parse”的规律。',
        ['localStorage / sessionStorage 差异', '只能存字符串的限制', '读后 parse、写前 stringify'],
        ['localStorage', '持久化'],
      ),
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
        title: '本周导览：5 个可以当场跑起来的知识点',
        short: '本周导览',
        summary:
          '把“数据怎么从服务器来”这条主线压缩成 5 个演示，先看全局地图再逐个击破。',
        tags: ['导览', '异步', '网络'],
        status: 'ready',
        slides: [
          {
            id: 'cover',
            kind: 'cover',
            eyebrow: 'Week 4 · 异步与网络',
            title: '数据怎么从服务器来',
            points: [
              '数据交换格式（JSON）',
              'XMLHttpRequest',
              'fetch',
              'Promise',
              'async / await',
            ],
          },
          {
            id: 'demo',
            kind: 'demo',
            eyebrow: '本周目录',
            title: '五个演示，一条主线',
            subtitle: '字符串 → 请求 → Promise → 语法糖',
            demo: {
              src: `${WEEK4_DEMO}/index.html`,
              note: '演示页带本地兜底数据，课堂断网也能讲成功与失败两条路径。',
            },
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
        slides: demoDeck({
          eyebrow: 'Week 4 · 知识点 01',
          coverTitle: '数据在传出去之前，先变成字符串',
          points: ['为什么需要数据交换格式', 'JSON / YAML / XML 的取舍', 'JSON ≠ JS 对象字面量', '写前 stringify，读后 parse'],
          demoTitle: 'stringify / parse 双向转换',
          demoSrc: `${WEEK4_DEMO}/01-数据交换格式-JSON.html`,
          demoNote: '右侧演示台可现场切换尾逗号、单引号 key 等非法样例。',
          code: {
            language: 'javascript',
            filename: '01-json-basics.js',
            source: `const DATA = { names: [{ first: 'Bob', last: 'Carr' }] }

const text = JSON.stringify(DATA)     // 对象 → 字符串
console.log(typeof text)              // "string"

const back = JSON.parse(text)         // 字符串 → 对象
console.log(back.names[0].first)      // "Bob"`,
          },
        }),
      },
      {
        id: 'xhr',
        title: '远程获取数据：XMLHttpRequest',
        short: 'XMLHttpRequest',
        summary:
          '用 XHR 拉远程接口并动态插入页面，看清 readyState、onload / onerror 与状态码的分工。',
        tags: ['XHR', 'readyState', '状态码'],
        status: 'ready',
        slides: demoDeck({
          eyebrow: 'Week 4 · 知识点 02',
          coverTitle: '不刷新页面，把服务器数据插进 DOM',
          points: ['XHR 的基本用法', 'onload / onerror 的分工', '4xx / 5xx 不算 error', '状态码的含义'],
          demoTitle: 'XMLHttpRequest 请求演示',
          demoSrc: `${WEEK4_DEMO}/02-远程获取数据-XHR.html`,
          demoNote: '只有网络层失败才进 onerror；4xx/5xx 必须自己判 status。',
        }),
      },
      {
        id: 'fetch',
        title: 'fetch 与 Response',
        short: 'fetch',
        summary:
          'fetch 返回 Promise、只认网络错误，404 不 reject —— 必须自己判 res.ok。',
        tags: ['fetch', 'Response', 'res.ok', 'CORS'],
        status: 'ready',
        slides: demoDeck({
          eyebrow: 'Week 4 · 知识点 03',
          coverTitle: '有没有更好用的请求方式',
          points: ['fetch 返回 Promise', '只在网络失败时 reject', '404 要自己判 res.ok', '读取 JSON 要两步'],
          demoTitle: 'fetch 请求演示',
          demoSrc: `${WEEK4_DEMO}/03-fetch-网络请求.html`,
          demoNote: '现场访问一个不存在的地址，看它不报错、只返回 res.ok === false。',
        }),
      },
      {
        id: 'promise',
        title: 'Promise 的状态与编排',
        short: 'Promise',
        summary:
          'pending / fulfilled / rejected / settled，then / catch / finally，以及 all / race / allSettled 的差别。',
        tags: ['状态机', '链式调用', 'Promise.all'],
        status: 'ready',
        slides: demoDeck({
          eyebrow: 'Week 4 · 知识点 04',
          coverTitle: '“未来才会有的值”怎么被组织和编排',
          points: ['四种状态与不可逆性', 'then / catch / finally 的分工', 'all / race / allSettled', 'unhandledrejection'],
          demoTitle: 'Promise 状态机演示',
          demoSrc: `${WEEK4_DEMO}/04-Promise.html`,
          demoNote: '演示台可看到 pending → fulfilled / rejected 的状态流转。',
        }),
      },
      {
        id: 'async-await',
        title: 'async / await',
        short: 'async / await',
        summary:
          '本质是 Promise 的语法糖：async 总返回 Promise，await 暂停并取值，错误处理回归 try/catch。',
        tags: ['协程', 'await', 'try / catch'],
        status: 'ready',
        slides: demoDeck({
          eyebrow: 'Week 4 · 知识点 05',
          coverTitle: '能不能写得像同步代码一样',
          points: ['async 总是返回 Promise', 'await 暂停并取值', '被拒绝就在该行抛出', '错误处理回归 try/catch'],
          demoTitle: 'async / await 演示',
          demoSrc: `${WEEK4_DEMO}/05-async-await.html`,
          demoNote: '同一段请求逻辑，先写 Promise 链、再写 async/await 对照。',
        }),
      },
      placeholderLesson(
        'http-server',
        'HTTP Server 与 Express',
        'HTTP Server',
        'Network / Internet / WWW 的层级、HTTP 协议，以及 Express 最小服务与 RESTful。',
        ['Web ≠ Internet：三层概念澄清', 'HTTP 是什么协议', 'Express 最小服务器', 'RESTful 与 CRUD 的映射'],
        ['Node.js', 'Express', 'RESTful'],
      ),
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
