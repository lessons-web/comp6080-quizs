# COMP6080 Week 5 知识点大纲（供校对）

> 状态：**待校对草稿** · 生成日期：2026-10-08
> 来源：`COMP6080-26T3-week5-content.zip`（6 份 PDF + 视频索引，核对日期 2026-10-14）
> 用途：确认知识点切分与优先级后，按本大纲逐篇产出 `content/knowledge/**` 的 MDX 卡片

---

## 0. 校对说明

- 每个知识点给出：**建议 ID / 标题 / 难度 / 建议 tags / 核心要点 / 术语 / 考点题型 / 易错点**
- 每个知识点末尾有 `[ ] 保留  [ ] 删除  [ ] 修改`，请直接勾选或批注
- 「建议」栏含义：`必做` = 有明确考点，务必收录；`可选` = 锦上添花；`待定` = 无 slides，需你确认

---

## 1. 来源清单与可提取性

| # | 讲座 | 讲师 | 页数 | 内容密度 | 提取状态 |
|---|---|---|---|---|---|
| 1 | UI Fundamentals | Sam Parkinson | 26 | 高 | ✅ 已解析 |
| 2 | Good & Bad UI 1 | — | 30 | 高（含 12 条清单） | ✅ 已解析 |
| 3 | Good & Bad UI 2（Recommended） | — | — | 中（纯视频） | ⚠️ 无 slides |
| 4 | ReactJS Introduction | Tom Isles | 20 | 高 | ✅ 已解析（API 过时） |
| 5 | Basic "Global CSS" Usage | Tom Isles | 13 | 中 | ✅ 已解析 |
| 6 | Lifecycle（How React Works） | Nic Barker | 48 | 极高 | ✅ 已解析 |
| 7 | useState hook | — | — | 中（纯视频） | ⚠️ 无 slides |
| 8 | Demo: Working with async | Hayden Smith | 5 | 极低 | ✅ 无考点 |

---

## 2. 主题归属决策（⚠️ 需你先拍板）

现有 Topic 体系为：`html / css / javascript / react / nodejs`，Week 5 有 **两种内容**：

- **React 部分** → 直接填入已存在但为空的 [content/knowledge/react/](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/knowledge/react) 目录 ✅
- **UI/UX 设计部分** → 现有 5 个 Topic 都放不下，建议**新增第 6 个 Topic：`ui-ux`**

> **决策 A**：是否新增 `ui-ux` topic？
> `[ ] 新增独立 topic（推荐）  [ ] 并入其他 topic  [ ] 暂不收录 UI/UX`

---

## 3. 知识点大纲 —— Topic: `ui-ux`（新增）

### ui-ux/001 · UI 与 UX 的区别

- **难度**：easy ｜ **建议**：必做 ｜ **来源**：UI Fundamentals p.2–3
- **核心要点**
  - **UX**：可用性（usability）、"用起来是否合乎逻辑"、用户研究（访谈/测试）
  - **UI**：图形与文案、视觉设计（颜色/像素/阴影）、品牌（branding）
  - UI 的终极目标：**让 app 更好用**，拆为三个子目标
    1. 让用户不害怕 → 图形基础（Part 1）
    2. 让用户容易找到东西 → 视觉层级（Part 2）
    3. 让用户容易做事 → 示能（Part 3）
- **术语**：User Experience / User Interface / usability / user research / branding
- **考点题型**：概念辨析（"下列属于 UX 还是 UI 工作？"）
- **易错点**：把"好看"等同于 UI 的全部；UX 不是"用户体验好"这种模糊说法，而是**可用性与逻辑性**

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### ui-ux/002 · 对齐与网格系统（Alignment & Grid）

- **难度**：easy–medium ｜ **建议**：必做 ｜ **来源**：UI Fundamentals p.5–12
- **核心要点**
  - 人对**对齐、一致的模式**有天然偏好 → 对齐让设计更"不吓人"
  - **网格（grid）** 是达成对齐的手段
  - BBC 案例的具体参数（常考数字）：
    - 内容区 **1200px 上限**（为了可读性）
    - **12 列**列网格
    - 列间 **16px** 间距（gutter）
  - **12 列的原因**：可被 **1 / 2 / 3 / 4 / 6** 整除
  - 内容对齐到**列边缘**，但不进入 **margin**
- **术语**：grid / column / gutter / margin / visual alignment
- **考点题型**：给出布局问用了什么原则；"为什么常用 12 列网格"
- **易错点**：混淆 "column 边缘" 与 "margin"；误以为列数越多越好

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### ui-ux/003 · 字体与和谐配色（Typography & Color）

- **难度**：medium ｜ **建议**：必做 ｜ **来源**：UI Fundamentals p.5, 13–18
- **核心要点**
  - **字体**：一致字体减少困惑；less is more；**最多 2 个 font family**；预先建立 type scale / 类型表
  - **颜色**：受限调色板（primary hue + variants、secondary hue、grayscales）= 统一感（cohesion）
  - **和谐配色核心判据**：**HUE 相同**，仅亮度/饱和度变化 → 和谐；HUE 不同 → 杂乱分散注意力
  - **RGB vs HSL**：HSL 更适合作为判断"是否同色相"的工具
    - 和谐示例 HSL：`(199,86,51) / (199,100,35) / (199,86,90)` → H 都是 199
    - 不和谐示例：`(277,96,47) / (230,100,89)`
  - 工具：Adobe Color、Colorizer.org、Paletton.com
- **术语**：typography / type scale / font family / palette / hue / saturation / lightness / HSL / RGB
- **考点题型**：给一组 RGB/HSL 值判断哪组更和谐；给出配色问题解释原因
- **易错点**：只看"亮度相近"而忽略色相；误以为颜色越多越丰富

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### ui-ux/004 · 视觉层级 6 要素（Visual Hierarchy）

- **难度**：easy ｜ **建议**：必做（高频） ｜ **来源**：UI Fundamentals p.19–22
- **核心要点**：用视觉手段让"最重要的东西最突出"，6 个手段：
  1. **Size**：越大越重要
  2. **Color**：越亮越重要
  3. **Contrast**：对比越强越吸睛
  4. **Spacing**：大 margin 制造"重要感"
  5. **Alignment**：**不对齐**反而吸睛
  6. **Repetition**：重复 = 归入同一层级／便于忽略
- **术语**：visual hierarchy / contrast / repetition / emphasis
- **考点题型**：给一个界面截图，问"哪个元素被强调、用了哪几个手段"
- **易错点**：忽略 Repetition 也可用于"降级"次要信息（让它容易被忽略）

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### ui-ux/005 · 示能性（Affordance）

- **难度**：medium ｜ **建议**：必做 ｜ **来源**：UI Fundamentals p.23–25
- **核心要点**
  - **定义**：元素的视觉属性使用户知道"可以拿它做某事"（例：门把手、网页按钮）
  - 三种类型（**核心考点**）：
    - **Explicit 显式示能**：明确告知交互方式（"Click here"）
    - **Pattern 模式示能**：用约定俗成的模式暗示（蓝色下划线文字 = 链接；面包屑 / 汉堡 = 菜单）
    - **False 虚假示能**：看起来能操作、实际不能 → **必须避免**（最易造成困惑）
- **术语**：affordance / explicit affordance / pattern affordance / false affordance
- **考点题型**：给出 UI 元素判断属于哪种示能；找出设计中的 false affordance
- **易错点**：把"示能"与"反馈（feedback）"混淆——示能是**交互前**的提示，反馈是**交互后**的响应

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### ui-ux/006 · UI 设计检查清单 12 条（★ 本模块最重）

- **难度**：medium ｜ **建议**：必做 ｜ **来源**：Good & Bad UI 1 p.9–23
- **形态建议**：**1 篇长文 + 12 个锚点章节**（若你偏好卡片化，可拆成 12 张，但会导致单卡内容过薄）
  > **决策 B**：`[ ] 1 篇长文（推荐）  [ ] 拆成多张卡片`

| # | 原则（中/英） | 核心问题 | 关键建议 |
|---|---|---|---|
| 1 | 可见性 Visibility | 控件是否可见？首次用户是否要瞎猜？ | 按钮优先于汉堡菜单；适配多屏；显示当前页面/步骤；**识别优于回忆** |
| 2 | 示能 Affordance | 每个按钮作用是否清晰？ | 链接下划线+异色；按钮 hover 变化；图标贴合现实 |
| 3 | 反馈 Feedback | 操作后如何知道系统已响应？ | 成功/失败提示；点击变色；**>1.5s** 的任务显示 loading |
| 4 | 一致性 Consistency | 不同屏幕是否一致？ | 字体/字号/配色统一；最多 2 个字体；主次两种按钮变体；无突兀变化 |
| 5 | 约束 Constraints | 是否限制了错误？ | 空输入禁用提交；非法输入不放行；未登录隐藏受限功能 |
| 6 | 有效性与实用性 Effectiveness & Utility | 用户能否完成任务？ | 关键控件可达（edit/delete/save/logout）；导航栏全页面可见 |
| 7 | 效率 Efficiency | 能否用最少步骤完成？ | 精简步骤；多步骤显示进度 |
| 8 | 安全性 Safety | 用户是否受保护、可从错误恢复？ | 可撤销；不可撤销则警告（delete/publish）；按钮别靠太近；报错两步：**平实语言解释 + 建议方案** |
| 9 | 可学习性 Learnability | 是否直观？有指引吗？ | placeholder 提示输入；复杂功能给说明 |
| 10 | 通用标准与惯例 Standards & Conventions | 界面是否眼熟？ | profile 在右上；点 logo 回首页；符号贴现实（放大镜=搜索/购物车=购买/爱心=喜欢/软盘=保存） |
| 11 | 兼顾所有人 Catering to All | 新手有支持、专家不被拖慢？ | 专家可关教程；"高级选项"收纳；平衡 learnability↔efficiency；无障碍（alt/captions/层级） |
| 12 | 美学与极简 Aesthetics & Minimalism | 只留必要信息？ | "这个信息现在相关吗？"；少用功能移走；平衡极简↔可见性；对称/平衡/对比/比例/统一 |

- **术语**：visibility / feedback / constraints / learnability / convention / minimalism / cognitive load
- **考点题型**：给一个界面/场景，指出违反/符合了哪条原则；列举某原则的改进建议
- **易错点**：**Safety vs Constraints**（约束=事前限制犯错，安全=事后可恢复）；**Efficiency vs Effectiveness**（能否做到 vs 是否省步骤）

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### ui-ux/007 · UI 进阶概念（UI Extras）｜可选

- **难度**：easy ｜ **建议**：可选 ｜ **来源**：Good & Bad UI 1 p.24–30
- **核心要点**：仅提及 4 个名词，slides 未展开
  - Dark Mode、Microinteractions、Designing for Emotions、Cognitive Load
- **形态建议**：若收录，作为 **"名词附录"** 而非独立知识卡；或直接并入 ui-ux/006 末尾

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

## 4. 知识点大纲 —— Topic: `react`（填入现有空目录）

> ⚠️ 本模块所有代码示例都涉及**版本订正**，详见第 5 节。slides 基于旧版 React，你项目为 **React 19 + Vite**。

### react/001 · 为什么需要 React：命令式 vs 声明式

- **难度**：medium ｜ **建议**：必做（概念根基） ｜ **来源**：Lifecycle p.1–31
- **核心要点**
  - 动机：纯 JS 构建 UI 冗长、难维护、多人协作易失控
  - **命令式（Imperative）**：指定**过程**，不指定结果 → `document.body.style.backgroundColor = "green"`
  - **声明式（Declarative）**：指定**结果**，不管过程 → `return <body style={{ backgroundColor: "green" }} />`
  - **为何值得**：状态机转换数量组合爆炸
    - 3 个状态 → **6** 种转换
    - 50 个页面 → 最少 **2450** 种转换
    - 声明式只需描述 **50 个状态**，转换交给 React
  - 团队问题：多人改动同一 UI，未跟踪的 DOM 变更难以维护
  - 命令式的适用边界：简单场景很方便；**一旦 DOM 之外有数据**（如服务器数组），就要同时维护 JS 与 DOM **两个状态机**，边界情况无穷
- **术语**：imperative / declarative / state transition / state machine
- **考点题型**：给两种写法判断哪种是声明式；解释为什么声明式能降低复杂度
- **易错点**：误以为声明式 = 代码更少（其实更多，但扩展性更好）

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### react/002 · JSX 语法

- **难度**：easy ｜ **建议**：必做 ｜ **来源**：ReactJS Introduction p.9–13
- **核心要点**
  - **JSX = JavaScript XML**，是 JS 的扩展，把 HTML 标记当作 JS 对象/变量
  - 可以：存进变量、配合 JS 逻辑（三元）、用 `{}` 嵌入表达式
    ```jsx
    const hello = <h1>Hello, JSX!</h1>
    const parity = isEven(n) ? <h1>Even</h1> : <h1>Odd</h1>
    const line = <h1>Value: {isOdd(n)}</h1>
    ```
  - **`className` 而非 `class`**
  - 多行 JSX 用 `()` 包裹更整洁
- **术语**：JSX / expression / interpolation / className
- **考点题型**：改错题（`class`→`className`、缺 `{}`、多根节点）
- **易错点**：`{}` 内只能是**表达式**不能是语句（不能写 `if`）；JSX 要求单一根节点

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### react/003 · 项目结构与挂载（Mounting）⚠️ 需订正

- **难度**：easy ｜ **建议**：必做（需重写） ｜ **来源**：ReactJS Introduction p.5–8, 17–20
- **核心要点（订正后应讲）**
  - 入口 HTML 中有一个挂载容器（`#root` / `<div id="root">`）
  - 入口 JS/TS 负责把根组件**挂载**到该容器
  - **HMR（Hot Module Reloading）**：保存即刷新页面
  - 项目结构（按你项目实际情况）：`index.html` / `src/main.tsx` / `src/App.tsx` / 全局 CSS
- **考点题型**：指出挂载点在哪；解释 render 的两个参数分别是什么
- **⚠️ 订正清单**
  - slides 用 `npx create-react-app` → 你项目用 **Vite**（`npm create vite`）
  - slides 用 `ReactDOM.render(<App/>, el)` → React 18+ 已废弃，应改为
    ```tsx
    createRoot(document.getElementById('root')!).render(<App />)
    ```
  - slides 文件名 `.js` → 你项目用 **`.tsx` / `.ts`**

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### react/004 · React 中引入 CSS：Inline Style 与 className

- **难度**：easy ｜ **建议**：必做 ｜ **来源**：Basic "Global CSS" Usage p.4–10
- **核心要点**
  - **Inline style**：`style` 接收 **JS 对象**；属性名 **camelCase**；双花括号
    ```jsx
    <div style={{ color: 'red' }}>…</div>
    ```
  - **CSS class**：`className="App"` + `import './App.css'`
  - 两者可**组合**使用（如外层 className、内层 inline style）
- **术语**：inline style / camelCase / className / global CSS
- **考点题型**：写出正确 inline style 语法（常错：写成字符串、用 kebab-case）
- **易错点**：`style="color: red"`（字符串）✗；`{'font-size': '12px'}` 应为 `{ fontSize: '12px' }`

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### react/005 · CSS 作用域陷阱与隔离方案

- **难度**：medium ｜ **建议**：必做 ｜ **来源**：Basic "Global CSS" Usage p.11–13
- **核心要点**
  - **核心陷阱**：在某个文件里 `import './App.css'` **并不代表**只有该文件能用它的 class
  - 只要该 CSS **被任何地方 import 过**，它的所有 class 就是**全局可用**的 → 全局污染
  - 后果：A 组件的样式可能意外影响 B 组件
  - **解决方向**：**CSS Modules**、**CSS-in-JS** 等（本讲座仅引出，后续展开）
- **术语**：scoping / global stylesheet / CSS Modules / CSS-in-JS
- **考点题型**：解释"为什么 import 了 CSS 却影响了其他组件"
- **易错点**：误以为 ES module 的 import 会给 CSS 带来隔离作用域

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### react/006 · 虚拟 DOM 与 Diff（★ 本模块最重）

- **难度**：hard ｜ **建议**：必做 ｜ **来源**：Lifecycle p.32–43
- **核心要点**
  - **朴素方案**：任何变化都"删掉整个 DOM 重建" —— 逻辑正确（无需考虑状态转换），但**开销过大**
  - **为何 DOM 更新昂贵**：HTML/CSS 的 layout 引擎擅长自适应，但频繁改动会触发**大量 layout 重算**，累加起来很慢
  - **关键洞察**：更新时其实**不关心布局**，可让浏览器最后统一计算
  - **解决方案 = 虚拟 DOM（Virtual DOM）**
    1. 在 JS 中保留一份 HTML 层级**副本**
    2. 在副本上做改动（避免真实 layout 开销）
    3. **Diff** 新旧两棵树
    4. 用差异**外科式**更新真实 DOM
  - **示例**：State1→State2 只多了一个 `<div>`，React 读 diff 后"只调用一次删除/插入"，而非重建整棵树
- **术语**：virtual DOM / diff / reconciliation / layout reflow / surgical update
- **考点题型**：解释 virtual DOM 解决的核心问题；描述"变化→diff→更新真实 DOM"的流程
- **易错点**：误以为 virtual DOM 让 DOM 变快（本质是**减少不必要的 DOM 操作**）；误以为它是浏览器的能力（是框架自建的一层）

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### react/007 · useState 与渲染循环

- **难度**：medium ｜ **建议**：必做 ｜ **来源**：Lifecycle p.44–48（slides）+ useState 视频
- **核心要点**
  - 语法：`const [count, setCount] = useState(0)`
  - 触发：`setCount(count + 1)` → 状态**异步**更新 → 更新完成后**重新执行 render**（携带新值）
  - **render 的返回值 = 你要求 React 呈现到屏幕上的内容**
  - 完整闭环：`render → 改 state → 再 render`
  - 条件渲染示例（dropdown 可见性）：
    ```jsx
    {dropdownVisible && <ul>…</ul>}
    ```
- **术语**：state / hook / useState / re-render / asynchronous update / conditional rendering
- **考点题型**：预测点击两次后的 `count` 值；解释"改了 state 页面为什么会变"
- **易错点**：以为 `setState` 是同步的；以为可以直接改 state 变量（必须用 setter）

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

### react/008 · 组件树与 Props（待定 / 可选）

- **难度**：easy ｜ **建议**：待定 ｜ **来源**：ReactJS Introduction p.4, 15（仅提及）
- **核心要点**：React 应用是**树结构**，由组件组成；`function App(props)` 中通过 props 接收外部数据
- **说明**：slides 仅一带而过，**未展开** props 传递/单向数据流。若 Week 6 会深入，此处**建议只做名词铺垫或直接跳过**
  > **决策 C**：`[ ] 收录为独立卡  [ ] 并入 react/001  [ ] 跳过（推荐，留给后续周）`

```
[ ] 保留  [ ] 删除  [ ] 修改
```

---

## 5. ⚠️ 技术订正清单（务必执行）

slides 诞生于旧版 React 生态，与项目实际技术栈存在偏差，**不可照抄**：

| 讲座原文 | 应订正为 | 影响知识点 |
|---|---|---|
| `npx create-react-app my-first-app` | Vite 脚手架（`npm create vite@latest`） | react/003 |
| `ReactDOM.render(<App/>, el)` | `createRoot(el).render(<App/>)` | react/003 |
| `src/index.js` / `App.js` / `App.css` | `src/main.tsx` / `App.tsx` + 对应样式方案 | react/003, 004 |
| `import React from 'react'`（必须） | React 17+ JSX 转换后可省略 | react/002 |
| 未提及函数组件生命周期 | 项目用 Hooks 范式，不引入 class 生命周期 | react/007 |

> **补充提醒**：讲座 6 标题叫 **"Lifecycle"**，但内容实际是 **"How React Works"**（命令式/声明式/虚拟 DOM/state），**并非** class 组件的 `componentDidMount` 那套生命周期。命名容易误导，建议在卡片中明确澄清。

---

## 6. 无 slides 内容的处理

| 讲座 | 现状 | 建议 |
|---|---|---|
| **Good & Bad UI 2** | 纯视频，无 slides | 可作为 ui-ux/006 的"案例演示"补充，不单独出卡 |
| **useState hook** | 纯视频，无 slides | 与 react/007 合并；若视频有额外细节（如函数式更新）你再补充 |
| **Demo: Working with async** | 5 页，讲旧作业起步 | **不收录**，无考点 |

---

## 7. 统计与优先级汇总

| 优先级 | 数量 | 知识点 |
|---|---|---|
| **必做** | 12 | ui-ux/001–006、react/001–007 |
| **可选** | 1 | ui-ux/007（UI Extras） |
| **待定** | 1 | react/008（组件树与 Props） |
| **不收录** | 2 | Demo 讲座、Good & Bad UI 2（转为案例） |

**考点密度 Top 3**（若时间有限，优先做这三篇）：
1. **ui-ux/006** —— UI 检查清单 12 条
2. **react/006** —— 虚拟 DOM 与 Diff
3. **ui-ux/004 + ui-ux/005** —— 视觉层级 6 要素 + 示能三分类

---

## 8. 待你拍板的决策点

| 编号 | 决策 | 选项 |
|---|---|---|
| **A** | UI/UX 主题归属 | 新增 `ui-ux` topic ✅推荐 / 并入现有 / 暂不收录 |
| **B** | 12 条清单形态 | 1 篇长文 ✅推荐 / 拆 12 张卡 |
| **C** | 组件树与 Props | 独立卡 / 并入 react/001 / 跳过 ✅推荐 |
| **D** | React 过时 API | 按 React 19 订正 ✅推荐 / 保留原样 |
| **E** | UI Extras | 收录为附录 / 不收录 |
| **F** | 后续产出范围 | 仅知识点 / 知识点 + 练习题 / 知识点 + 练习题 + 真题 |

> 校对完成后告诉我结论，我就按定稿大纲开始产出 MDX 卡片。
