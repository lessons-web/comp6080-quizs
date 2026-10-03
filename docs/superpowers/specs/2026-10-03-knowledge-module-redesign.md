# 2026-10-03 知识点解析模块重构规格

## 1. 目标与范围

### 1.1 目标
把「知识点解析」Tab 从"按 topic 切换长文"的单页形式，重构为**两层导航的文档库形态**：
- 第一层：5 张技术领域卡片首页（HTML / CSS / JavaScript / React / Node.js）
- 第二层：双栏详情页（左侧知识点列表 + 搜索，右侧对应 Markdown 正文 + 模拟题库关联入口）

其余两个 Tab（模拟题库 / 模拟真题）**完全不改动**。

### 1.2 非目标
- 不改动模拟题库、模拟真题的 UI 或数据模型
- 不改变现有题库、真题的文件结构（`content/questions/*.json`、`content/exams/*.json` 保持原样）
- 不引入任何新的第三方依赖（图标全内联 SVG，不引 heroicons / lucide 等）
- 不做用户登录、学习进度持久化（进度/学习状态 2.0 再做）

---

## 2. 内容数据模型

### 2.1 类型变更（[content.ts](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/types/content.ts)）

**删除**：`KnowledgeFrontmatter`（原按 topic 集合级 frontmatter，不再使用）

**新增**：
```ts
export type Difficulty = 'easy' | 'medium' | 'hard'

/** 单条知识点 frontmatter（一个 MDX 文件 = 一条知识点） */
export interface KnowledgePointMeta {
  id: string            // 文件 basename（不含 .mdx），也是路由 slug
  title: string         // 知识点标题，列表和详情页展示
  topic: TopicId
  category: string      // 类别，列表 pill 显示，如 "文档基础"
  difficulty: Difficulty
  tags: WeekTag[]       // Week 标签，支持多 Week 归属
  summary: string       // 20 字内简介（列表 hover tooltip 备用）
  createdAt: string     // ISO 日期字符串
  updatedAt?: string
}
```

**扩展**：`TOPIC_META` 增加 `description` / `accent` 两个卡片展示字段：
```ts
export const TOPIC_META: Record<TopicId, {
  label: string
  defaultWeek: WeekTag
  description: string        // 卡片 20 字内简介
  accent: string             // 卡片 icon 的 Tailwind 渐变 class
}> = {
  html:       { label: 'HTML',       defaultWeek: 'week-1', description: '文档结构与语义化',   accent: 'from-orange-500 to-red-500' },
  css:        { label: 'CSS',        defaultWeek: 'week-1', description: '样式与布局系统',     accent: 'from-sky-500 to-blue-600' },
  javascript: { label: 'JavaScript', defaultWeek: 'week-2', description: '语言核心与异步模型', accent: 'from-yellow-400 to-amber-500' },
  react:      { label: 'React',      defaultWeek: 'week-3', description: '组件化与状态管理',   accent: 'from-cyan-400 to-sky-500' },
  nodejs:     { label: 'Node.js',    defaultWeek: 'week-4', description: '服务端运行时与生态', accent: 'from-emerald-500 to-green-600' },
}
```

### 2.2 目录结构
原 `content/knowledge/{topic}.mdx`（5 个长文）→ 拆分迁移为：
```
content/knowledge/
├── html/
│   ├── 001-structure-semantics.mdx    ← 从原 html.mdx H2 1 拆出
│   ├── 002-paths-images.mdx           ← 从原 html.mdx H2 2 + 3（矢量vs位图合并不拆）
│   └── 003-code-tags.mdx              ← 从原 html.mdx H2 4
├── css/
│   ├── 001-specificity.mdx            ← 从原 css.mdx H2 1
│   ├── 002-box-model.mdx              ← 从原 css.mdx H2 2
│   ├── 003-flexbox.mdx                ← 从原 css.mdx H2 3
│   └── 004-stacking-context.mdx       ← 从原 css.mdx H2 4
├── javascript/  (空目录，后续补)
├── react/       (空目录，后续补)
└── nodejs/      (空目录，后续补)
```

Review Checklist 不单独成知识点，合并入最后一条知识点文末。

### 2.3 单 MDX frontmatter 样例（`html/001-structure-semantics.mdx`）
```mdx
---
id: "001-structure-semantics"
title: "HTML Structure and Semantics"
topic: "html"
category: "文档基础"
difficulty: "easy"
tags: ["week-1"]
summary: "HTML 文档结构、head/body 分工与语义化标签"
createdAt: "2026-09-28T12:00:00.000Z"
---

# HTML Structure and Semantics
（正文沿用原 html.mdx H2 1 下的内容）
```

---

## 3. 路由与数据加载

### 3.1 路由表变更（[router.tsx](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/app/router.tsx)）

| 路由 | 目标 | 说明 |
|---|---|---|
| `/` | Navigate → `/knowledge`（原为 `/knowledge/html`） | |
| `/knowledge` | 卡片首页 | 5 张 topic 卡片 |
| `/knowledge/:topic` | Navigate → `/knowledge/:topic/{首个知识点id}` | 缺省知识点自动补全 |
| `/knowledge/:topic/:knowledgeId` | 双栏页 | 左侧列表高亮 + 右侧详情 |
| `/practice/*` / `/mock-exams/*` | 保持不变 | |
| `*` | Navigate → `/knowledge`（原为 `/knowledge/html`） | |

所有 knowledge 子路由继续由 `KnowledgePage.tsx` 一个组件统一分发（不拆多路由组件，保持简洁）。

### 3.2 数据加载层 API（[knowledge.ts](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/lib/content/knowledge.ts)）

glob 从 `'*.mdx'` 改为 `'**/*.mdx'`，按 topic 子目录扫描。

```ts
export const SUPPORTED_TOPICS = ... (不变)
export function isSupportedTopic(value): value is TopicId (不变)
export function getAllKnowledgeTopics() (不变)

/** 卡片首页用：返回各 topic 摘要（只取 frontmatter 摘要，不加载正文） */
export async function getAllTopicSummaries(): Promise<Array<{
  topic: TopicId
  label: string
  description: string
  accent: string
  pointCount: number
}>>

/** 左侧列表用：某 topic 下全部知识点元数据列表（只取 frontmatter，不加载正文） */
export async function getKnowledgePointList(topic: TopicId): Promise<KnowledgePointMeta[]>

/** 右侧详情用：单个知识点（frontmatter + 正文 Component） */
export async function getKnowledgePoint(
  topic: TopicId,
  knowledgeId: string,
): Promise<{ meta: KnowledgePointMeta; Component: ComponentType }>
```

**加载原则**：
- 列表 / 卡片永不加载 MDX 正文（glob query 只拿 frontmatter）
- 只有 `getKnowledgePoint` 会加载正文 → 保证首屏轻量
- 非法 topic / knowledgeId → throw `NotFoundError`（ErrorBoundary 友好）

---

## 4. UI 组件与视觉

### 4.1 组件文件新增 / 变更

```
features/knowledge/
├── KnowledgePage.tsx          ← 改造：三段 URL 分发 + 缺省路由跳转
└── components/ (新增目录)
    ├── TopicCardGrid.tsx      ← 卡片首页网格
    ├── TopicCard.tsx          ← 单张 topic 卡
    ├── KnowledgeSplitLayout.tsx ← 双栏外容器（sticky 100vh 内部滚动）
    ├── KnowledgeListPanel.tsx  ← 左栏：搜索栏 + 列表
    ├── KnowledgeListItem.tsx   ← 单条列表项（两行）
    └── KnowledgeDetailPanel.tsx ← 右栏：返回条 + 元数据 + MDX + 关联入口
```

**删除**：现有知识详情直接长文渲染的逻辑（拆到组件内）

### 4.2 视觉规格

#### ① 卡片首页 (`/knowledge`)
- 容器：`max-w-7xl mx-auto px-6 py-8`
- 网格：`grid grid-cols-4 gap-5`
- TopicCard：
  - `bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5 h-[160px]`
  - `hover:shadow-md hover:ring-slate-300 hover:-translate-y-0.5 transition-all duration-200`
  - 左上 36×36 渐变圆角块 `rounded-lg bg-gradient-to-br {accent}`，内联极简 SVG（每个 topic 独立：`<>|{}|JS|atom|hexagon-N`）
  - 右下部 `{N} 篇` 文字徽章

#### ② 双栏页（全屏高内部滚动，避免外部滚动条 — 贴合紧凑偏好）
- 外容器：`h-[calc(100vh-6.5rem)] flex gap-4 px-4 py-3`
- 左栏宽 `w-96 shrink-0`，右栏 `flex-1 min-w-0`
- 两栏都使用白底 `rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden` 卡片包一层，产生悬浮脱离感

**左栏（KnowledgeListPanel）：**
- 顶部 `p-3 border-b border-slate-100` 放搜索 Input：`w-72 shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-sm`，trailing 内联放大镜 SVG
- 列表区 `flex-1 overflow-y-auto`
- 每条（KnowledgeListItem）：
  - `px-3 py-2.5 border-b border-slate-50 last:border-none cursor-pointer`
  - **激活态**：`bg-blue-50 ring-1 ring-blue-200` + 左侧 `border-l-2 border-blue-500` 竖条
  - 行1：`text-sm font-medium text-slate-800`（命中关键词 `<mark>` 高亮）
  - 行2：`mt-1 flex items-center gap-1.5 flex-wrap text-[11px]`：
    - `{类别}` `bg-slate-100 text-slate-600 rounded px-1.5 py-0.5`
    - `{难度}` easy/medium/hard → 绿/琥珀/红
    - `{Week 1}` 天蓝
    - `{YYYY-MM-DD}` 灰色，`ml-auto` 靠右

**右栏（KnowledgeDetailPanel）：**
- 溢出：`overflow-y-auto` 独立滚动
- Sticky 返回条（top-0，`border-b border-slate-100`，白底，防止迷路）：
  - 左：`← 返回 知识点首页` 按钮 → `/knowledge`
  - 右：`{TopicLabel} / {类别}` 面包屑
- 元数据 header（`px-5 pt-4`）：`h2 text-xl font-semibold` + 难度/类别/Week/创建时间 行
- MDX 正文（`px-5 py-4 prose prose-slate`）
- 底部关联入口（`mx-5 mb-5 mt-6 p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-between`）：
  - 左：想巩固？去模拟题库练习
  - 右：Cta 按钮 → `/practice/{topic}`

### 4.3 搜索行为
- 范围：frontmatter 的 `title` + `category` + `tags[]`（join）+ `summary`
- 机制：客户端 `includes` 忽略大小写，200ms 防抖，无需服务端
- 空结果：列表中间 `text-sm text-slate-400 text-center py-8`：「暂无匹配的知识点」

### 4.4 图标（全内联 SVG）
5 个 topic 渐变块 icon + 放大镜 + 返回箭头 + Cta 按钮箭头，全手写内联。

---

## 5. Header 关联跳转

Header 里第一个 Tab「知识点解析」的 `to` 从 `/knowledge/html` → `/knowledge`。其余两个 Tab 保持不变。

---

## 6. 验收标准

### 6.1 功能验收
1. `/` 自动跳 `/knowledge`，5 张卡片按 4 列排布
2. 点 HTML 卡 → 跳 `/knowledge/html/{首个id}`，左栏列表 3 条，右栏显示对应 MDX
3. 点 CSS 卡 → 跳 `/knowledge/css/{首个id}`，4 条知识点
4. 搜索：输入 `语义` → HTML 列表只剩 1 条（且关键词高亮）
5. 点某条列表 → 右侧内容更新 + URL `knowledgeId` 更新 + 左侧高亮竖条同步
6. 关联入口按钮 → 正确跳 `/practice/{topic}`
7. JS / React / Node 空 topic：左栏空态「暂无知识点，敬请期待」，详情区同理空态
8. 刷新后位置保持（URL 含 topic + id，刷新仍在同一知识点）

### 6.2 质量验收
1. `oxlint`：0 errors
2. `tsc -b`：0 errors
3. `vite build`：通过，knowledge MDX 正文独立为按需 chunk（不在首屏 bundle）
4. `vitest run`：全部用例通过
   - 原 knowledge 测试删除或迁移为新 frontmatter 断言
   - 新增 1-2 个单测：`getKnowledgePointList('html')` 返回 3 条；卡片首页 `getAllTopicSummaries` 返回 5 条，pointCount 对应
5. Lint 检查无遗留 `import` 旧 frontmatter 类型 / 旧 MDX 路径

---

## 7. 规格自检

- 占位符：✅ 无「TODO / 待定」；HTML/CSS 的拆分数量已明确
- 一致性：✅ 路由与加载层一致（topic + knowledgeId 两段 slug 贯穿类型、API、URL）
- 范围：✅ 仅知识点解析模块，practice / mock-exams 写明不改动
- 模糊点：✅ 搜索范围、难度配色、空态文案、图标方案（内联 SVG）均已指定；topic 缺省跳转行为写明；`JS/React/Nodejs` 空目录的空态处理明确
