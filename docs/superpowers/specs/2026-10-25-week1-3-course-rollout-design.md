# Week 1-3 课程内容补全设计

## 1. 目标

把 `Week 1`、`Week 2`、`Week 3` 从当前的 placeholder 骨架补全为与 `Week 4` 同一教学体系下的完整课程模块。

这次补全的范围是：

- 课程 PPT / Slide Deck
- 对应的 Live Demo
- 路由与内容注册
- 之后再统一优化前三周 mock exams

本次设计不直接改代码，而是先把前三周的内容结构、演示策略、实施顺序和后续 mock exam 策略定清楚。

## 2. 当前现状

### 2.1 课程数据

`src/lib/content/courses.ts` 中：

- `Week 1`
- `Week 2`
- `Week 3`

目前仍主要由 `placeholderLesson(...)` 生成，占位结构已经在，但还没有像 `Week 4` 那样展开成真实可讲、可翻页、可跳转 demo 的成体系 slide。

### 2.2 Demo 体系

`src/lib/content/demos.ts` 目前已经形成成熟的 `Week 4` 演示模式：

- 每个 demo 有独立 `/demos/...` 路由
- 每个 demo 有 `sourceHtmlPath`
- 每个 demo 有 `codes`
- 课程 slide 中通过 `demo` 类型页面跳往独立实验

而 `Week 1-3` 还没有同等成熟的演示地图。

### 2.3 Mock Exam 体系

`src/lib/content/mockExams.ts` 中，前三周既有正式入口，也仍然挂着旧版 `week1-sim / week2-sim / week3-sim` 入口。

这说明：

- 前三周 mock exam 仍可见
- 但内容体系还没有完全与新版课程 PPT / demo 统一
- 因此 mock exam 不适合在课程补全前先行优化

## 3. 设计原则

### 3.1 先课程，后试卷

先把 `Week 1-3` 的 PPT 和 Live Demo 补成完整课程，再统一回头优化前三周 mock exams。

原因很明确：

- 试卷应围绕稳定课纲出题
- 如果先优化试卷，后面课程 slide 或 demo 重点变化，会导致试卷和课程再度脱节

### 3.2 先按周形成闭环，再复制方法

采用“按周推进”的方式，而不是先全量做 PPT、再全量做 Demo。

推荐顺序：

1. `Week 1` 先打成母版
2. `Week 2` 复用结构并增强视觉实验
3. `Week 3` 接上浏览器行为层
4. 最后统一优化 `Week 1-3 mock exams`

### 3.3 延续 Week 4 的教学范式

前三周要和 Week 4 保持统一体验：

- slide 负责讲知识结构
- demo 负责承担真实交互实验
- 不再把复杂 demo 塞进 slide 内部
- 所有 demo 都在独立 `/demos` 路由中承载

### 3.4 Demo 必须“有观察点”

Live Demo 不是摆设。每个 demo 都必须明确：

- 这个实验让学生看见什么
- 操作哪个变量会变化
- 最终想让学生记住哪条规则

只会展示结果、没有控制变量或对照关系的页面，不算合格 demo。

### 3.5 节奏要符合课程发展顺序

前三周应形成很清晰的学习主线：

- `Week 1`：结构与语义
- `Week 2`：样式与布局
- `Week 3`：行为与浏览器交互

## 4. Week 1 设计

### 4.1 定位

Week 1 是“结构认知周”。

目标不是讲花哨效果，而是让学生建立最基本的 Web 页面和协作直觉：

- HTML 文档骨架
- 语义化结构
- 链接 / 图片 / 路径
- 列表 / 表格 / 代码展示
- 最小 Git 工作流

### 4.2 课程结构

建议为：

- `overview`：课程概览与 Git 入门
- `structure`：HTML 文档结构
- `semantics`：语义化标签与标题层级
- `links-images`：链接、图片与路径
- `lists-tables`：列表、表格与预格式文本

外加一个统一的周导览课，用于建立 Week 1 地图。

### 4.3 Slide 设计

Week 1 每节课的 slide 应以基础教学为主，建议主要使用：

- `cover`
- `outline`
- `content`
- `compare`
- `codes`
- `flow`
- `demo`
- `closing`

其中：

- `Git` 更适合 `flow + compare + cards`
- `HTML` 知识点更适合 `codes + compare + demo`

### 4.4 Demo 设计

建议先做 4 个 demo：

1. `HTML Skeleton Builder`
2. `Semantic Landmarks Demo`
3. `Paths & Images Playground`
4. `Lists / Tables / Code Tags Demo`

### 4.5 特殊处理：Git

`Git` 这节不做浏览器假 demo。

原因：

- Git 的价值在于命令与协作流
- 浏览器伪交互很容易看起来可点，但不贴近真实使用
- 更适合用 `flow` slide 讲清楚 `clone -> edit -> commit -> push`

因此 Week 1 的 demo 重点全部放在 HTML 相关知识点上。

## 5. Week 2 设计

### 5.1 定位

Week 2 是“视觉与布局实验周”。

目标是让学生理解：CSS 不是记属性，而是在回答 4 个问题：

- 谁生效
- 占多大
- 怎么排
- 怎么适配不同屏幕

### 5.2 课程结构

建议为：

- `selectors-cascade`：选择器与层叠优先级
- `box-model`：盒模型与单位
- `flexbox`：Flexbox 布局
- `grid-frameworks`：CSS Grid、框架与样式复用
- `positioning-stacking`：定位、z-index 与视觉层级
- `responsive-viewport`：移动端、媒体查询与 DevTools

外加一个统一的周导览课。

### 5.3 Slide 设计

Week 2 应比 Week 1 更高频使用：

- `compare`
- `codes`
- `demo`

并把 `错误写法 vs 正确写法` 作为主要教学节奏。

适合补充 `flow` 的点有：

- 层叠优先级命中逻辑
- 响应式断点命中顺序
- 层叠上下文形成路径

### 5.4 Demo 设计

建议先做 5 个 demo：

1. `Cascade Inspector`
2. `Box Model Lab`
3. `Flex Alignment Workbench`
4. `Position & Stacking Context Demo`
5. `Responsive Breakpoint Playground`

### 5.5 特殊处理：Grid / Frameworks

`CSS Grid、框架与样式复用` 这节不应做成重型交互编辑器。

推荐策略：

- 做一个轻量 Grid demo 观察行列布局
- 把“框架与样式复用”的重点放在 slide 的取舍讲解里

原因是这节的核心并不是“玩布局工具”，而是理解抽象层带来的收益和边界。

## 6. Week 3 设计

### 6.1 定位

Week 3 是“行为与浏览器交互周”。

目标是建立浏览器端第一轮闭环：

- 写 JavaScript
- 查询 DOM
- 绑定事件
- 处理表单
- 使用 localStorage

### 6.2 课程结构

建议为：

- `js-intro-syntax`：JavaScript 语言特性与语法
- `functions-closures`：高级函数与闭包
- `ecosystem-npm`：JavaScript 生态、Node 与 npm
- `dom`：DOM 查询与操作
- `events`：事件与事件委托
- `forms`：表单与客户端校验
- `storage`：localStorage 与持久化

外加一个统一的周导览课。

### 6.3 Slide 设计

Week 3 应分成两种教学节奏：

#### A. 概念课

适用于：

- JS 语法
- 闭包
- Node / npm

优先使用：

- `cover`
- `compare`
- `codes`
- `flow`

#### B. 浏览器行为课

适用于：

- DOM
- events
- forms
- storage

优先使用：

- `cover`
- `codes`
- `compare`
- `demo`

### 6.4 Demo 设计

建议先做 5 个 demo：

1. `DOM Query Playground`
2. `Event Propagation Lab`
3. `Form Validation Workbench`
4. `Closure Snapshot Demo`
5. `localStorage Notes Demo`

### 6.5 特殊处理：Node / npm

`Node / npm` 不做浏览器假 demo。

原因：

- 它的核心是运行时与工程生态认知
- 更适合通过流程图、命令结构和 package.json 示例建立理解

因此这节应该以 `PPT + flow + codes` 为主，而不是做成表面可交互的网页实验。

## 7. 三周统一设计规则

### 7.1 Slide 类型统一

前三周统一沿用 Week 4 的 slide 体系，不新增新的 slide schema。

优先使用现有类型：

- `cover`
- `roadmap`
- `cards`
- `outline`
- `content`
- `codes`
- `compare`
- `flow`
- `demo`
- `closing`

### 7.2 Demo 入口统一

所有 demo 都要：

- 注册到 `src/lib/content/demos.ts`
- 有独立路由
- 有 `sourceHtmlPath`
- 有 `codes`
- 在课程 slide 中通过 `demo` 类型 slide 打开

### 7.3 课程体验统一

前三周要和 Week 4 保持一致体验：

- PPT 只讲结构，不承载复杂 iframe 实验
- demo 在新窗口或独立工作台中完成
- slide 节奏遵循“知识点讲解 -> 代码证据 -> 实验入口”

## 8. 实施顺序

### P0：Week 1 PPT + Demo

先把 Week 1 做成前三周母版。

目标：

- 定 slide 节奏
- 定 demo 粒度
- 定课程入口与实验入口之间的关系

### P1：Week 2 PPT + Demo

在 Week 1 骨架稳定后做 Week 2。

目标：

- 形成最强的视觉实验周
- 验证 demo 密度更高时的体验是否仍然流畅

### P2：Week 3 PPT + Demo

在 Week 2 之后做 Week 3。

目标：

- 建立浏览器交互闭环
- 把前三周和 Week 4 的异步 / 网络周自然接上

### P3：Week 1-3 Mock Exams

在前三周课程与 demo 全部稳定后，再统一优化 mock exams。

目标：

- 让试卷与最终课纲对齐
- 避免重复围绕未稳定内容出题
- 用统一风格重整前三周 mock exam

## 9. Mock Exam 后置策略

前三周 mock exam 的优化原则是：

### 9.1 不抢跑

在 `Week 1-3 PPT + Demo` 未稳定前，不先大改 mock exam。

### 9.2 围绕最终课纲重写

每周 mock exam 应直接对齐当周正式课程结构，而不是继续延续旧版 `week1-sim / week2-sim / week3-sim` 的偶然题型拼法。

### 9.3 统一升级路径

等 `Week 1-3` 课程完成后，mock exam 优化建议按下面顺序做：

1. 明确每周主章节覆盖
2. 明确每周题库映射
3. 去掉旧版重复入口
4. 把试卷重排成“正式模拟卷”结构

## 10. 验证要求

实现时至少要验证这些点：

### 10.1 课程层

- Week 1-3 不再是 placeholder 结构
- 每周都能正常进入 slide
- slide 中的 demo 入口可正确打开

### 10.2 Demo 层

- 每个新 demo 都有对应 route
- 每个新 demo 都有 `codes`
- DemoPage 可正确读取并展示 Live / Code 两种视图

### 10.3 内容层

- `courses.ts`、`demos.ts`、`mockExams.ts` 的数据注册互相一致
- 新增内容通过现有内容测试与相关页面测试

### 10.4 后续试卷层

- mock exam 优化时不退化前三周课程覆盖
- 题库与试卷继续保持同步覆盖关系

## 11. 非目标

本次设计不包含：

- 直接实现 Week 1-3 mock exams
- 改造 mock exam 页面 UI
- 重新设计 slide schema
- 把 Git / Node / npm 做成伪浏览器 demo
- 扩展到 Week 5+

## 12. 预期结果

完成后，项目会形成一条完整的教学主线：

- `Week 1`：结构与语义
- `Week 2`：样式与布局
- `Week 3`：行为与浏览器交互
- `Week 4`：异步与网络

用户进入课程后，会获得统一的体验：

- 每周都有完整 slide deck
- 关键知识点都有独立 demo
- demo 和课程讲解彼此映照
- mock exam 在课程稳定后再统一升级，不会与课纲脱节
