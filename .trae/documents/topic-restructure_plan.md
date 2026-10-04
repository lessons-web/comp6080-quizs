# 分类维度重构：Week → 技术领域 实现计划

## 仓库研究结论

### 当前架构（按 Week 维度）
- **路由层**：`/knowledge/week-1` → `/knowledge/week-4`，`/practice/week-N`，`/mock-exams/week-N`
- **内容层**：
  - `content/knowledge/week-{1..4}.mdx`（仅 week-1 有完整内容，HTML + CSS 混合在一个文件中；week-2/3/4 为占位符）
  - `content/questions/week-{1..4}.practice.json`（题目有 `topic: "HTML"` / `"CSS"` 字段，内部已按 topic 分组显示）
  - `content/exams/week-{1..4}.mock-exams.json`
- **数据层**：`src/lib/content/` 全部以 `week: number` 为查询键（`getKnowledgeByWeek`、`getPracticeQuestionsByWeek`、`getMockExamsByWeek`）
- **UI 层**：`WeekTabs` 组件 → 四个 Week 切换 Tab；标题显示「Week N 知识点解析」
- **类型层**：`WeekId = 'week-1' | 'week-2' | 'week-3' | 'week-4'`

### 关键发现
1. `week-1.mdx` 实际覆盖 **HTML**（文档结构/语义/路径/图片） + **CSS**（特异性/盒模型/Flexbox/层叠上下文）两个主题，混在同一文件中
2. `week-1.practice.json` 题目有 `topic` 字段（HTML / CSS / JS 等），说明内容天然就有技术领域归属，只是外壳用 Week 打包的
3. week-2/3/4 全是 placeholder，迁移成本低
4. Week 仍然是重要的课程维度（教学进度），但不应该是**主分类**，而应该降级为**标签（Tag）/过滤维度**

### 目标架构（按技术领域为主分类，Week 为标签）
- **主分类（5 个，可扩展）**：HTML、CSS、JavaScript、React、Node.js
- **标签维度**：Week 1、Week 2、……（一篇知识点、一道题可属于多个 Week，比如 CSS 基础是 Week 1 教的，但可能 Week 2 也会再出现）
- **路由层**：`/knowledge/html`、`/knowledge/css`、`/knowledge/javascript`、`/knowledge/react`、`/knowledge/nodejs`，practice 和 mock-exams 同
- **内容组织**：
  - `content/knowledge/html.mdx`（对应原 week-1 中 HTML 部分）
  - `content/knowledge/css.mdx`（对应原 week-1 中 CSS 部分）
  - `content/knowledge/javascript.mdx`、`react.mdx`、`nodejs.mdx`（目前是 placeholder，后续填充）
  - frontmatter 中增加 `tags: ['week-1']` 字段
- **题目组织**：
  - `content/questions/html.practice.json`、`css.practice.json`、`javascript.practice.json` …
  - 每道题增加 `weeks: ['week-1']` 字段（代替原来的 topic 作为主分类，同时保留 weeks 标签）

---

## 文件和模块

### 需要删除的文件（Week 体系产物）
- `content/knowledge/week-1.mdx`
- `content/knowledge/week-2.mdx`
- `content/knowledge/week-3.mdx`
- `content/knowledge/week-4.mdx`
- `content/questions/week-1.practice.json`
- `content/questions/week-2.practice.json`
- `content/questions/week-3.practice.json`
- `content/questions/week-4.practice.json`
- `content/exams/week-1.mock-exams.json`
- `content/exams/week-2.mock-exams.json`
- `content/exams/week-3.mock-exams.json`
- `content/exams/week-4.mock-exams.json`
- `src/lib/utils/parseWeek.ts`（不再需要解析 week 字符串）

### 需要重写/新建的文件

#### 类型层
- **`src/types/content.ts`**：重写
  - `WeekId` → `WeekTag`（string 类型，允许扩展 week-5+）
  - 新增 `TopicId = 'html' | 'css' | 'javascript' | 'react' | 'nodejs'`（字符串联合，后续可扩展）
  - `KnowledgeFrontmatter`：`week` → `tags: WeekTag[]`，新增 `topic: TopicId`
  - `PracticeQuestion`：保留 `topic` 但与 topic 对齐，新增 `weeks: WeekTag[]`
  - `PracticeQuestionCollection`：`week` → `topic: TopicId`
  - `MockExamCollection`：`week` → `topic: TopicId`（后续再加 `weeks`）

#### 内容层（MDX / JSON 数据）
- **`content/knowledge/html.mdx`**：从 week-1.mdx 中拆出 HTML 相关章节，frontmatter 写 `topic: 'html'`，`tags: ['week-1']`
- **`content/knowledge/css.mdx`**：从 week-1.mdx 中拆出 CSS 相关章节，frontmatter 写 `topic: 'css'`，`tags: ['week-1']`
- **`content/knowledge/javascript.mdx`**：placeholder，`topic: 'javascript'`，`tags: ['week-2']`
- **`content/knowledge/react.mdx`**：placeholder，`topic: 'react'`，`tags: ['week-3']`
- **`content/knowledge/nodejs.mdx`**：placeholder，`topic: 'nodejs'`，`tags: ['week-4']`
- **`content/questions/html.practice.json`**：从 week-1.practice.json 筛出 `topic === 'HTML'` 的题，外层改 `{"topic": "html", "questions": [...]}`，每题加 `weeks: ['week-1']`
- **`content/questions/css.practice.json`**：同上筛出 CSS 题
- **`content/questions/javascript.practice.json`**：placeholder
- **`content/questions/react.practice.json`**：placeholder
- **`content/questions/nodejs.practice.json`**：placeholder
- **`content/exams/html.mock-exams.json`** ~ **`nodejs.mock-exams.json`**：按 topic 拆分，目前空结构占位

#### 数据加载层（`src/lib/content/`）
- **`knowledge.ts`**：重写
  - 新增 `SUPPORTED_TOPICS = ['html','css','javascript','react','nodejs'] as const`，导出 `isSupportedTopic`
  - 新增 `getAllKnowledgeTopics()` 返回 topic 清单（用于 TopicTabs 硬编码问题）
  - 把 `getKnowledgeByWeek(week)` → `getKnowledgeByTopic(topic: TopicId)`，路径变成 `../../../content/knowledge/${topic}.mdx`
  - 新增 `getKnowledgeList()` 返回所有 frontmatter 清单（用于「知识点索引」或 topic 列表元数据查询）
- **`practice.ts`**：重写
  - `getPracticeQuestionsByWeek` → `getPracticeQuestionsByTopic(topic: TopicId)`
  - 路径变 `../../../content/questions/${topic}.practice.json`
  - 保留 `groupPracticeQuestions`（但现在每组应该就是 topic 本身，可能需要改成按 week 或子知识点分组？暂时保留）
- **`mockExams.ts`**：重写
  - `getMockExamsByWeek` → `getMockExamsByTopic(topic: TopicId)`
  - 路径变 `../../../content/exams/${topic}.mock-exams.json`

#### Hooks / Utils
- **删除** `src/lib/utils/parseWeek.ts`
- **更新** `useAsyncContent` 调用方（各页面），把 week 参数换成 topic

#### UI 组件层
- **重写 `src/components/WeekTabs.tsx` → 改名 `TopicTabs.tsx`**
  - props：`basePath` 不变（'knowledge' | 'practice' | 'mock-exams'）
  - 从知识清单或常量里取 topic 列表（`SUPPORTED_TOPICS`），渲染：HTML / CSS / JavaScript / React / Node.js
  - 激活态路径：`/${basePath}/html` 等
- **新增 `WeekTag.tsx`**（可选，本次可以简单点写在页面里）
  - 在知识点页面和题库页面的标题区，显示 tags 中列出的 week，比如 `Week 1` 小徽章

#### 页面层
- **`src/features/knowledge/KnowledgePage.tsx`**：重写
  - 从路由取 `topic` param，而不是 `week`
  - 标题：`{topicTitle} 知识点解析`（例如 HTML 知识点解析）
  - 右上角/标题旁显示 `Week 1` Tag
  - 标题右侧的 WeekTabs → 换成 TopicTabs
  - 侧边栏「关联入口」：`/practice/html`、`/mock-exams/html`
- **`src/features/practice/PracticePage.tsx`**：重写
  - 同样取 topic param
  - 标题：`{topicTitle} 模拟题库`
  - 关联 week 标签显示
  - 列数切换器保留（这个是纯 UI 偏好，和 topic 无关）
  - 分组逻辑：如果需要按 week 分，就改成 `weeks` 分组；暂时保留原 topic 分组逻辑（单 topic 文件里，可能只含一个 topic，分组变成无意义——所以改为按 knowledgePoint 或直接不分组、平铺，本次先平铺+计数标签即可，等后续有「子分类」需求再升级）
- **`src/features/mock-exams/MockExamsPage.tsx`**：同逻辑改造

#### 路由层
- **`src/app/router.tsx`**：
  - 默认重定向：`/` → `/knowledge/html`（而不是 `/knowledge/week-1`）
  - 路径保持通配 `knowledge/*` / `practice/*` / `mock-exams/*`，内部页面自己解析 topic（从 `/:topic` 取 param）
  - 404 重定向：`*` → `/knowledge/html`

---

## 实现步骤（按依赖顺序）

### Step 1：类型系统先行 — 改 `src/types/content.ts`
- 新增 `TopicId`、`WeekTag` 类型
- 把 `KnowledgeFrontmatter`、`PracticeQuestionCollection`、`MockExamCollection` 从 week-based 改为 topic-based
- PracticeQuestion 加 `weeks?: WeekTag[]` 可选字段

### Step 2：内容数据迁移 — content/ 目录
- 拆 week-1.mdx → html.mdx + css.mdx（**最关键一步**，手工内容保真迁移）
- 建 javascript/react/nodejs 三个 placeholder mdx
- 拆 week-1.practice.json → html.practice.json + css.practice.json
- 建其余 topic 的 questions placeholder JSON
- 建 exams 的 5 个 topic-based JSON（空结构占位）
- 删除旧的 week-*.mdx / week-*.practice.json / week-*.mock-exams.json 文件

### Step 3：数据加载层重写
- 重写 `knowledge.ts`：topic 维度 + SUPPORTED_TOPICS 常量
- 重写 `practice.ts`：topic 维度
- 重写 `mockExams.ts`：topic 维度
- 删除 `parseWeek.ts`

### Step 4：路由 & 页面迁移（Topic Tabs）
- 重命名 `WeekTabs.tsx` → `TopicTabs.tsx`，改渲染 HTML/CSS/JS/React/Node
- 改 `router.tsx` 的默认重定向
- 改 `KnowledgePage.tsx`：param 改 topic、标题改技术领域、加 Week Tag
- 改 `PracticePage.tsx`：同上，调整分组逻辑
- 改 `MockExamsPage.tsx`：同上
- Header 导航链接 `to='/knowledge/week-1'` → `to='/knowledge/html'`（等等 3 个链接）

### Step 5：清理 & 收尾
- 删除不再用的 week 相关导入
- 确认 `isSupportedWeek` 调用全部移除（只留 topic 校验）
- localStorage 键：`comp6080:pref:practice-columns` 不变（这个是 UI 偏好，与分类无关）

---

## 依赖和注意事项

### 内容保真（最高风险）
- week-1.mdx 拆分成 html.mdx 和 css.mdx 时必须**手动拆分**，保证章节标题层级正确、内容不丢失、summary 和 frontmatter 的 tags 正确。不能使用自动拆分脚本——语义切分质量无法保证。
- week-1.practice.json 中 CSS 题的 topic 字段是 `"CSS"`，要把这部分筛出来；**先看一下 JSON 全部内容确认有哪些 topic 值**

### 扩展友好
- `TopicId` 用字符串联合（`'html'|'css'|'javascript'|'react'|'nodejs'`），**未来新增一个 topic，只需：**
  1. 加 `TopicId` 成员（若 TS 严格）或改为 `string` + 常量列表
  2. 放 3 个内容文件（.mdx / .practice.json / .mock-exams.json）
  3. 在 `SUPPORTED_TOPICS` 常量里加一项
- `tags: 'week-1'[]` 用数组而不是单个值，允许一篇内容跨多个 week

### 向后兼容
- 旧 URL `/knowledge/week-1` 会匹配到页面但 `topic='week-1'` 无法通过 `isSupportedTopic`，会显示「不支持的 topic」卡片——**这个是有意为之**（课程整体改版，旧链接失效是合理的），不需要做重定向。如果需要可以后续再加 redirect rule。

### Header 导航链接
- `Header.tsx` 中 `navItems` 当前指向 `/knowledge/week-1` 等，Step 4 中要改成 `/knowledge/html`

---

## 验证

### 静态验证
1. `npm run lint`：0 errors（warning 可以保留 router lazy 的警告）
2. `npm run build`：tsc -b + vite build 全通过
3. `npm test`（如果有）：确保 content-files.test.ts、useAsyncContent 等测试通过；必要时更新测试 fixture

### 交互 + 内容验证（浏览器）
1. 打开首页 → 自动跳到 `/knowledge/html`
2. HTML 知识点：
   - 标题是「HTML 知识点解析」
   - 标题旁/下方有 `Week 1` 徽章
   - 右侧 TopicTabs：HTML 激活态，其他 4 个 tab 可点击
   - 内容包含 HTML 文档结构、语义、路径、图片等章节（从原 week-1 拆来）
3. CSS 知识点：
   - 点击 Tab → 跳到 `/knowledge/css`
   - 标题「CSS 知识点解析」、`Week 1` 标签
   - 内容包含特异性、盒模型、Flexbox、层叠上下文
4. JavaScript / React / Node.js：
   - 点 Tab 能进入，显示 placeholder 内容（或未填内容的空状态）
5. 题库页 `/practice/html`、`/practice/css`：
   - 对应 topic 的题目显示
   - 列数切换、卡片展开都正常
6. 真题页 `/mock-exams/html`：
   - 空结构/占位正常显示
7. localStorage 列数偏好仍然生效

---

## 风险

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 手动拆分 week-1.mdx 内容出错/遗漏 | HTML / CSS 知识点页显示残缺 | 拆分后逐节比对原文件和新文件 section 标题，确保一一对应 |
| week-1.practice.json 里 CSS 题 topic 值不是 "CSS"（比如大小写混合） | CSS 题库为空或错分 | 先 grep `topic` 字段确认所有取值，再写精确筛条件 |
| `import.meta.glob` 按新命名模式找不到文件 | 加载失败、白屏 | Step 3 后立刻跑构建，检查 glob 路径匹配 |
| TopicTabs 宽度溢出（5 个 tab 比原来 4 个更挤） | Header/页面标题区换行 | Tab 项允许换行 `flex-wrap` 已经有；必要时缩小 padding 或改小字号。当前 `rounded-full px-3 py-1.5 text-sm` 应仍能容纳 |
