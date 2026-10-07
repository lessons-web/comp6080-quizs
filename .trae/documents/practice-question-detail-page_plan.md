# 模拟题库详情独立页面 Implementation Plan

## Repository Research

### 当前实现
- 路由层（[router.tsx](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/app/router.tsx)）：PracticePage 通过 `practice` 与 `practice/*` 双路径复用一个页面；题目详情通过 `useState(activeId)` + 底部 `sticky bottom-6` 抽屉浮层呈现，不是独立路由。
- PracticePage（[PracticePage.tsx](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/features/practice/PracticePage.tsx#L128-L430)）：
  - 使用 `getAllPracticeQuestions()` + `useAsyncContent` 异步加载全题库
  - `activeId` / `activeQuestion` 负责底部抽屉的打开关闭
  - `QuestionBankCard` 与 `QuestionBankTable` 通过 `onClick={() => setActiveId(...)` 触发详情
  - QuestionCard（[QuestionCard.tsx](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/features/practice/QuestionCard.tsx#L1-L73)）：内部管理 `useState(open)` 控制答案展开/收起，默认不展开。
- 数据层：
  - PracticeQuestion 类型（[content.ts](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/types/content.ts#L67-L79)）：包含 `id / topic / difficulty / tags / knowledgePoint / question / answerExplanation / codeBlocks / createdAt`。
  - 题库加载（[practice.ts](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/lib/content/practice.ts)）：`getAllPracticeQuestions()` 返回 Promise<PracticeQuestion[]>；缺少按 `id` 单条查询方法。
  - 知识点加载（[knowledge.ts](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/lib/content/knowledge.ts)）：通过 `topic + id` 路由定位 MDX（详情页路由格式需要与 KnowledgePage 保持一致）。

### 用户需求
1. 题目详情改为**独立路由页面**，不再使用底部 sticky 抽屉。
2. 详情页布局：左右两栏
   - **左侧（主栏）**：题目 ID、难度/领域标签、题目描述、代码块、**默认不展开**的答案解析按钮。
   - **右侧（侧栏）**：三卡片垂直堆叠（上中下）
     - 卡 1（顶部）：答题人数 / 正确率等**统计卡**，Mock 数据，暂不做真实交互。
     - 卡 2（中部）：**相关知识点**，点击跳转知识点详情页（Mock 2~3 条即可，保证链接能被解析）。
     - 卡 3（底部）：**相关试题**（与当前题 share 至少一个相同 tags 的其他题），点击跳转对应详情页，需要真实关联逻辑。
3. Practice 列表页：点击卡片 / 表格行 → `navigate('/practice/question/:id')`；旧的底部抽屉移除。

## Files and Modules

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `src/app/router.tsx` | 修改 | 新增 `/practice/question/:questionId` 路由，懒加载 QuestionDetailPage |
| `src/lib/content/practice.ts` | 修改 | 新增 `getPracticeQuestionById(id, all?)` 与 `findRelatedQuestionsByTags(currentId, tags, all, limit?)` 工具函数 |
| `src/features/practice/PracticePage.tsx` | 修改 | 移除 activeId / 底部抽屉；`onSelect / onClick` 改为 `useNavigate` 跳转；`practice/*` 路径下用 useParams 识别 questionId 或渲染列表 |
| `src/features/practice/QuestionDetailPage.tsx` | **新建** | 独立详情页：左右两栏 + 右侧三卡；调用 QuestionCard 或拆分出展示组件；Mock 统计、Mock 知识点；标签关联相关试题 |
| `src/features/practice/QuestionCard.tsx` | 修改（微调） | 可选：将外层 `p-5` 卡片边框样式改为"裸露模式"，让详情页自行套壳；或在新页面复用并覆盖样式 |

## Implementation Steps

### Step 1：新增按 ID 查询与关联试题工具函数（`src/lib/content/practice.ts`）
1. 新增 `getPracticeQuestionById(id: string, pool?: PracticeQuestion[])`：
   - 若提供 pool 则直接 find；否则调用 `getAllPracticeQuestions()` 再 find。
   - 返回 `Promise<PracticeQuestion | null>`。
2. 新增 `findRelatedQuestionsByTags(currentId: string, tags: string[], pool?: PracticeQuestion[], limit = 6)`：
   - 遍历全部题目，对每题计算 `intersection(q.tags, tags).length`；
   - 排除 `id === currentId`；
   - 按「重叠标签数降序 → createdAt 降序」排序，取前 N 条；
   - 支持无 pool 时自动 `getAllPracticeQuestions()`。

### Step 2：新增路由（`src/app/router.tsx`）
1. 在 `lazy` 区域追加：
   ```tsx
   const QuestionDetailPage = lazy(() =>
     import('../features/practice/QuestionDetailPage').then((m) => ({
       default: m.QuestionDetailPage,
     })),
   )
   ```
2. 在 `children` 中，`practice` 路由**之前**添加精确路由：
   - `{ path: 'practice/question/:questionId', element: <QuestionDetailPage /> }`
   - 保留 `{ path: 'practice', element: <PracticePage /> }`；将 `practice/*` 重定向或保留。
   - 确保顺序：`practice/question/:id` 放在 `practice/*` 之前以免被通配符吞掉。

### Step 3：实现 QuestionDetailPage（新建文件）
1. 页面壳：沿用 "上中下" Shell 规范，Main 区域 `flex-1 overflow-hidden`，内部左右两栏 `flex gap-6 h-full`。
   - 左栏：`flex-1 min-w-0 overflow-y-auto`；
   - 右栏：`w-[380px] shrink-0 overflow-y-auto`，内部三张卡 `flex flex-col gap-4`。
2. 数据获取：
   - `const { questionId } = useParams()`；
   - 并行调用 `getPracticeQuestionById(id)` 与 `getAllPracticeQuestions()`（后者用于相关试题）；
   - 复用 `useAsyncContent`。
3. 左栏内容（复用 QuestionCard 样式 + 结构）：
   - 标题行：题目 ID + 领域 chip + 难度 chip + 创建时间。
   - 题目描述、知识点 pill、代码块。
   - 「展开答案」按钮，默认 `open=false`（保留现有交互）。
   - 顶部添加一个返回按钮：`<button onClick={() => navigate(-1)}>← 返回题库</button>`。
4. 右栏三张卡：
   - **卡 1 统计卡（Mock）**：标题 `答题统计` + 大号数字「N 人已答」、正确率「M%」、难度分布条。数据写死即可。
   - **卡 2 相关知识点（Mock + 链接占位）**：标题 `相关知识点`，2~3 条条目，每条含标题、所属 topic、链接到 `/knowledge/:topic/:kpId`（kpId 暂时用 `knowledgePoint` 文本规范化/或者直接 link 到 topic 列表页 `/knowledge/:topic` 也可，不做严格存在性保证）。
   - **卡 3 相关试题（真实关联）**：标题 `相关试题 · N 项`；调用 `findRelatedQuestionsByTags`；每条含 ID、领域/难度、题目摘要、tags；`<Link to={/practice/question/${q.id}}>` 可点击；空态展示「暂无同标签题目」。

### Step 4：改造 PracticePage，移除抽屉并改为跳转
1. 删除/替换：
   - 移除 `const [activeId, setActiveId]` 和 `activeQuestion` useMemo；
   - 删除底部 `<div className="sticky bottom-6 z-20 mt-2">...</div>` 抽屉片段。
2. 引入 `useNavigate`：
   - `const navigate = useNavigate()`；
   - `onClick={() => navigate(`/practice/question/${q.id}`)}`；
   - 表格行同样处理。
3. `rest` params 仅用于初始化 topic filter，不再试图解析 questionId。

### Step 5：可选微调 QuestionCard
- 若在详情页直接使用 `<QuestionCard />` 出现多余的 `rounded border shadow` 与父容器重复，可给 QuestionCard 增加一个 `variant?: 'card' | 'bare'` 属性：
  - `card`：保留现状（默认）；
  - `bare`：去掉最外层 rounded/border/shadow/p-5，仅保留内部结构，让详情页自行包卡片容器。

## Dependencies and Considerations

1. **路由匹配顺序**：`practice/question/:questionId` 必须在 `practice/*` 之前声明，否则通配路由先命中。
2. **知识点评分卡跳转**：由于知识点 MDX id 与 question.knowledgePoint 文本不是严格一一对应，采用"尽力链接"策略 — 优先 `/knowledge/:topic`，若将来有映射表可替换成精确 id。
3. **详情页数据加载**：当前 `getAllPracticeQuestions` 是全量 + 分 chunk；详情页独立打开时也需要加载题库。可以后续优化为 `getAllPracticeQuestions()` 使用 React Query / 缓存层，但本版本不做。
4. **左栏宽度**：左侧撑满，右侧固定 380px（类似用户偏好的 320px + 增加空间容纳三卡信息）；在 < lg 断点改为上下堆叠（右栏改 `w-full`）。
5. **相关试题空态**：若 tags 完全无交集，必须优雅降级（「暂无同标签试题」）而不是报错。

## Validation

1. **路由正确性**：
   - 访问 `/practice` 显示列表；
   - 点击卡片 → 跳 `/practice/question/:id` 不被 practice/* 吞掉；
   - 浏览器回退 → 回到 `/practice`。
2. **详情页布局**：
   - 左右分栏出现；答案默认折叠；点击「展开答案」展示解析；
   - 右栏三张卡垂直排列，卡 3 展示与当前题 tags 交集 > 0 的其他题。
3. **相关试题跳转**：点击卡 3 的题目 → URL 改变 → 左栏切换为对应新题目内容；循环跳转不出现错误。
4. **构建/TS 校验**：`npm run build` 或 `npm run typecheck`（先看 package.json 脚本）通过，无类型错误。
5. **移除抽屉验证**：在列表页点击卡片后，不再出现 sticky 浮层，而是路由改变。

## Risks

| 风险 | 处置 |
|---|---|
| 路由顺序错误导致详情页 404 | 在 router.tsx 显式将精确路径放通配路径之前；完成后手动访问一条详情路径。 |
| 相关试题匹配算法与用户直觉不符 | 以"至少一个标签相同"为最低门槛，按重叠数量排序；若结果为空则展示空态。 |
| QuestionCard 样式冲突 | 通过 `variant="bare"` 或在详情页用 CSS 覆盖（例如 `[&>article]:border-none [&>article]:shadow-none [&>article]:p-0`）。 |
| knowledgePoint 找不到对应的知识点详情页 | 先跳到 `/knowledge/:topic` 作为兜底；后续建立 KP 映射表后再精确跳转。 |
