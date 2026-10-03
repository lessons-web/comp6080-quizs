# COMP6080 题库系统 — P0 规格说明

> 阶段：P0（基础体验 + 构建优化）
> 日期：2026-09-29
> 状态：待审查

## 1. 目标与范围

### 1.1 目标

在**不新增内容字段、不改现有内容 JSON/MDX 结构**的前提下，完成 3 项纯交互/工程性改进：

| 编号 | 改进点 | 直接收益 |
|---|---|---|
| A | 真题页「题目 / 分屏 / 答案」三态视图切换 | 讲师课堂讲评更灵活 |
| B | 题库卡「1 / 2 / 3 列」布局切换，偏好持久化 | 大屏信息密度、投屏清晰度兼顾 |
| C | 内容按需加载 + 路由懒加载 | 首屏 bundle 体积下降，扩展到 Week 12 不反弹 |

### 1.2 明确不包含（本期不做）

- 不扩展题目 JSON 字段（difficulty / tags / options 等留到 P1）
- 不新增做题进度、收藏、错题本
- 不做知识点锚点 TOC、知识点与题目互链
- 不做题目搜索/筛选
- 不引入 UI 图标库（所有切换用内联 SVG 或纯文字）
- 不做全局设置面板（布局偏好仅散落在各自页面组件）

## 2. 功能规格

### 2.1 A — 真题页三态视图切换

#### 2.1.1 用户故事

作为讲师，我希望在讲评整卷时可以切换「全屏讲题 / 分屏对照 / 全屏讲答案」，这样：
- 讲题时学生看不到答案，保持思考节奏
- 对答案时一次性展示完整解析，无需滚动对照

#### 2.1.2 交互与 UI

- 触发位置：每套试卷（ExamPaper）标题行右侧，放 3 态 Segmented Control
- 选项标签（文字，不用图标）：`分屏对照` · `仅题目` · `仅答案`
- 默认态：`分屏对照`（与当前实现一致）
- 状态粒度：**每套卷独立 state**，不同试卷互不影响（用户可能同时开 Week1 卷1 讲题、卷2 讲答案）
- 不做 localStorage 持久化（课堂场景是一次性临时选择）
- 样式约束：
  - Segmented Control 容器宽度固定 `w-56 shrink-0`，放 flex 最右
  - 激活项：`bg-blue-600 text-white rounded-full`
  - 未激活：`text-slate-600 hover:text-blue-700`

#### 2.1.3 布局规则

| 模式 | 容器 class | 细节 |
|---|---|---|
| 分屏对照 | `grid gap-6 xl:grid-cols-2` | 左灰题、蓝右答，与当前完全一致 |
| 仅题目 | `grid grid-cols-1` | 单栏展示题目区，灰底卡占满宽度，答案区 `display:none` |
| 仅答案 | `grid grid-cols-1` | 单栏展示答案区，蓝底卡占满宽度，题目区 `display:none` |

#### 2.1.4 无障碍

- 容器 `role="tablist"`
- 每个按钮 `role="tab"` + `aria-selected`
- 对应内容区 `role="tabpanel"` + `aria-labelledby`

### 2.2 B — 题库列数切换（1/2/3 列，偏好存 localStorage）

#### 2.2.1 用户故事

作为学生，我在 27 寸屏幕想看到 3 列高密度题目；作为讲师投屏时想 1 列大字更清楚。我希望浏览器记住我的偏好，不要每次都手动调。

#### 2.2.2 交互与 UI

- 触发位置：PracticePage 标题卡内右上角（WeekTabs 上方 / 同一行最右）
- 控件形态：3 个小按钮组成的 Segmented Control
- 按钮内容：内联极简 SVG（不引图标库）
  - 1 列 = 一个大方块
  - 2 列 = 左右两个方块
  - 3 列 = 三个横排方块
  - SVG 尺寸：16×16，stroke-only，`currentColor`
- 激活态：蓝色实心，非激活：灰边框
- 宽度：容器固定 `w-28 shrink-0`（符合用户 UI 偏好）
- 位置：flex 布局，将标题/说明推向左侧，切换器紧贴最右

#### 2.2.3 网格映射

列数设置作用于**所有 topic 分组的 QuestionCard 网格**（不支持按分组独立设置）。

| 用户选择 | 应用到 `div.grid` 的 class |
|---|---|
| 1 列 | `grid gap-4 grid-cols-1`（移除 lg 断点 2 列） |
| 2 列（默认） | `grid gap-4 grid-cols-1 lg:grid-cols-2`（与现状一致） |
| 3 列 | `grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3` |

- 小屏（< lg）永远最多显示 1–2 列，保证可读性。

#### 2.2.4 持久化

- localStorage key：`comp6080:pref:practice-columns`
- 值：字符串 `"1"` / `"2"` / `"3"`
- 读取策略：
  1. 页面挂载时读 key
  2. 若不存在或非法 → 回退默认 `"2"`
  3. 立即写入一次（避免后续读取空值判断）
- 写入策略：用户点击切换时立即 `localStorage.setItem`
- 封装：新建 `src/lib/hooks/useLocalStoragePref.ts`，泛型签名：
  ```
  useLocalStoragePref<T>(key: string, defaultValue: T, validators?: (v: T) => boolean): [T, (v: T) => void]
  ```
  供 PracticePage 使用，未来 P1 全局设置可复用。

#### 2.2.5 边界

- 用户禁用 localStorage / 隐私模式：`try/catch` 包裹，失败则退化为内存 state（功能正常工作，刷新不记住）

### 2.3 C — Bundle 优化（按需加载 + 路由懒加载）

#### 2.3.1 现状问题

三个 `lib/content/*.ts` 都用静态 import 直接拉 Week 1–4 所有资源（含空壳 JSON/MDX）。路由三个 Page 也同步 import。Week 12 时 bundle 会线性胀大。

#### 2.3.2 改造策略（不改变调用方 API 语义，仅变为异步）

##### C1 内容加载层（lib/content/）

- **knowledge.ts**：
  - 用 `import.meta.glob('../../../content/knowledge/*.mdx', { eager: false })` 动态匹配文件
  - `getKnowledgeByWeek(week)` 签名变为 `async`，内部 await 对应 glob 条目执行
  - 保持 `isSupportedWeek` 同步守卫不变
- **practice.ts**：
  - 用 `import.meta.glob('../../../content/questions/*.json', { eager: false })`
  - `getPracticeQuestionsByWeek(week)` 变 async
  - `groupPracticeQuestions` 保持纯函数同步（只处理已有数组）
- **mockExams.ts**：
  - 用 `import.meta.glob('../../../content/exams/*.json', { eager: false })`
  - `getMockExamsByWeek(week)` 变 async

> 选择 `import.meta.glob` 而非手写 4 个 `import()` 的原因：未来加 Week 5–12 **无需改代码**，文件丢进来即可用。

##### C2 路由层懒加载

- `router.tsx`：
  - 用 `React.lazy(() => import('../features/x/XxxPage.tsx'))` 包装 KnowledgePage / PracticePage / MockExamsPage
  - `AppShell` 内 `<Outlet />` 外层套 `<Suspense fallback={<PageLoading />}>`
- 新增 `src/components/PageLoading.tsx`：
  - 与现有卡片风格一致的圆角骨架（`rounded-[2rem]`、`border-slate-200`、`bg-white animate-pulse`）
  - 高度约 480px，宽度 `w-full max-w-6xl mx-auto`

##### C3 三个 Page 适配异步

- `KnowledgePage` / `PracticePage` / `MockExamsPage` 内部：
  - 新增一个通用 hook：`src/lib/hooks/useAsyncContent<T>(fetcher: () => Promise<T | null>, deps: unknown[])`
  - 返回 `{ data, loading, error }`
  - loading → 展示 `ContentLoading`（与 PageLoading 同风格，高度按页面平均）
  - error → 展示现有 amber 错误卡片（文案可复用「暂不支持这个周次」风格，但语义改为「加载失败，请刷新」）
  - data 正常 → 按现状渲染

#### 2.3.3 构建产物验收标准

- `npm run build` 后，在 `dist/assets/` 下观察到：
  - 至少 **6 个独立 chunk**（knowledge/practice/mock-exams 3 page + week-1/2/3/4 多块内容组合）
  - 最大首屏 chunk 不含 Week 2–4 MDX/JSON 字符串
- 开发模式下路由切换能看到 `PageLoading` 闪一下（正常）

#### 2.3.4 测试策略调整

- `MockExamsPage.test.tsx`：现有实现依赖同步 return，需调整：
  - `vi.mock('../../lib/content/mockExams', () => ({ getMockExamsByWeek: vi.fn().mockResolvedValue(mockData) }))`
  - 用 `await waitFor(...)` 或 `findByText` 断言渲染
- `QuestionCard.test.tsx`：不涉及异步，无需改动
- 新增 `useLocalStoragePref.test.ts`：覆盖读写/非法值回退/禁用 storage 场景
- 新增 `useAsyncContent.test.ts`：覆盖 loading/success/error 三态

## 3. 组件与文件改动图

### 3.1 新增文件

| 路径 | 职责 |
|---|---|
| `src/lib/hooks/useLocalStoragePref.ts` | 通用「偏好 + localStorage」hook |
| `src/lib/hooks/useAsyncContent.ts` | 通用异步加载（loading/error/data）hook |
| `src/components/PageLoading.tsx` | 路由级 Suspense 骨架屏 |
| `src/components/ContentLoading.tsx` | 内容级（Page 内部）加载骨架 |

### 3.2 修改文件

| 路径 | 改动内容 |
|---|---|
| `src/features/mock-exams/ExamPaper.tsx` | 加 3 态 Segmented Control + 布局条件渲染 |
| `src/features/practice/PracticePage.tsx` | 加列数切换器 + 接入 useLocalStoragePref + 动态 grid class；C 阶段再改为 useAsyncContent |
| `src/features/knowledge/KnowledgePage.tsx` | 接入 useAsyncContent（C 阶段） |
| `src/features/mock-exams/MockExamsPage.tsx` | 接入 useAsyncContent（C 阶段） |
| `src/lib/content/knowledge.ts` | 改为 import.meta.glob + async（C 阶段） |
| `src/lib/content/practice.ts` | 改为 import.meta.glob + async（C 阶段） |
| `src/lib/content/mockExams.ts` | 改为 import.meta.glob + async（C 阶段） |
| `src/app/router.tsx` | React.lazy + Suspense（C 阶段） |
| `src/app/AppShell.tsx` | Outlet 外套 Suspense fallback（C 阶段） |
| `src/features/mock-exams/MockExamsPage.test.tsx` | mock 异步 getMockExamsByWeek |
| `src/content/content-files.test.ts` | 若依赖同步导入则改为异步 |

## 4. 实施顺序

按「互不冲突文件 → 共享 hook → 最后 bundle 重构」排序：

**阶段 1（独立）**：A + B 的公共 hook 先行
1. useLocalStoragePref 实现 + 测试
2. ExamPaper 改三态视图（A）
3. PracticePage 加列数切换（B）

**阶段 2（需改动同步→异步，影响面最大）**：C
4. useAsyncContent 实现 + 测试
5. PageLoading / ContentLoading 组件
6. lib/content 三层改 import.meta.glob + async
7. 三个 Page 接入 useAsyncContent
8. router.tsx + AppShell.tsx 加 React.lazy + Suspense
9. 调整现有测试 mock

> 顺序约束：A、B 与 C 的 PracticePage 有修改重叠，故先 A/B 完成、再合入 C。

## 5. 验收清单（P0 完成判定）

### 5.1 功能验收

1. 打开 `/mock-exams/week-1`，每套试卷右上角可见 `分屏对照 / 仅题目 / 仅答案` 切换器
2. 三态切换后：
   - 分屏：左右两栏（≥xl）
   - 仅题目：左灰卡单栏，右蓝答消失
   - 仅答案：右蓝卡单栏，左题消失
3. 打开 `/practice/week-1`，标题卡右上角可见 1/2/3 列切换器，默认选中 2 列
4. 切换 3 列 → 刷新页面 → 仍为 3 列（localStorage 生效）
5. 切换 1 列 → 所有 topic 分组 QuestionCard 均单列
6. DevTools Network 观察：
   - 首次进入 `/knowledge/week-1`，未请求 Week 2/3/4 MDX
   - 切到 `/practice/week-1`，异步拉取 week-1.practice.json（不是首屏内联）
7. 控制台无警告、无未捕获 Promise reject

### 5.2 工程验收

8. `npm run build` 通过（tsc + vite build）
9. `npm run test` 通过（vitest run）
10. `npm run lint` 通过（oxlint）
11. dist/assets 目录 chunk 数 ≥ 6 个，最大单个 < 150KB（gzip 后）

## 6. 风险与回滚策略

| 风险 | 影响 | 缓解 |
|---|---|---|
| C 阶段把同步签名改异步时遗漏调用方 | 页面白屏 / 报 data is undefined | 先改 lib 再逐个 Page，每改完一个 `npm run build` 一次，及时定位 |
| `import.meta.glob` glob 匹配路径在 Windows 有差异 | 构建找不到内容 | 统一正斜杠写法，在 vite 插件中已标准化；vitest 下跑 CI 前本地 mac 先验 |
| localStorage 偏好 key 未来与 P1 设置中心冲突，需要 migrate | 旧值丢失 | P0 key 明确加 `comp6080:pref:` 前缀，P1 写迁移时按前缀统一 scan；迁移文档写进 P1 Spec |
| `React.lazy` 在 vitest jsdom 下偶发未 act 包裹的警告 | 测试 fail | vitest `vi.mock` 直接同步返回组件，不走 lazy 路径；或 act 包裹 flush |

## 7. 向后兼容声明

- P0 结束后，Week 2–4 内容填充仍可按现有「丢文件到 content/」流程操作，无需改任何 src 代码（C 阶段已用 glob 自动识别）
- 题目 JSON schema 无变化
- MDX frontmatter 无变化
- 路由路径 `/knowledge/:week`、`/practice/:week`、`/mock-exams/:week` 完全不变
