# COMP6080 Quiz Hub 项目概览与内容维护说明

## 0. 当前协作规则

> 本节用于给人类协作者和 AI 协作者一个统一入口。  
> 当前项目级约束以 [AGENTS.md](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/AGENTS.md) 为准；若 README 中较早的设计描述与其冲突，以 `AGENTS.md` 的最新规则为准。

### 0.1 题库维护的两条硬规则

- **新增到 Quiz / Mock Exam 的题目，必须同步进入对应的 Practice Bank。**
  - 通常需要同时更新：
    - `content/exams/*.json`
    - `content/questions/week-*.practice.json`
- **老师样本里那种“Supporting files + 右侧页面截图”的题面，默认使用 HTML Mockup 还原，不新增重图片资源。**
  - 优先用结构化 DOM + CSS 还原题面证据
  - 不默认引入 `png / jpg / webp` 等重资源

### 0.2 HTML Mockup 使用原则

- HTML Mockup 的职责是还原**判题所需的视觉证据**，而不是做真实交互 demo。
- 优先保留这些信息：
  - 左侧 `Supporting files`
  - 右侧页面预览
  - 顶部深色 top bar
  - 表单、卡片、列表、空状态、按钮层级
  - 题目推理真正依赖的局部文案和布局关系
- 不要为“像截图”而过度堆砌细节。
- 不实现真实业务逻辑，静态结构优先。
- 能复用统一 mockup 样式时，不要为单题写私有碎片实现。

### 0.3 出题同步要求

- 一次完整的试卷更新，通常要同步以下三个层面：
  1. `content/exams/*.json`
  2. `content/questions/week-*.practice.json`
  3. `quizs/*.md`
- 三者至少要保持以下内容一致：
  - 题目标题
  - 核心考点
  - 范围边界
  - 总分 / 题量（如有展示）

### 0.4 Quiz 2 当前专项规则

- 生成当前项目中的 `Quiz 2` 模拟题时：
  - 覆盖 `Weeks 1-5 lectures and tutorials + assignment 3`
  - **明确排除 `Week 5 React lectures`**
- `Week 5 UI/UX` 的非 React 内容仍然在范围内，可以正常出题。

### 0.5 推荐工作顺序

1. 先更新或新增 `content/exams/*.json`
2. 再同步 `content/questions/week-*.practice.json`
3. 若题面需要截图感，优先补 `mockup`
4. 再同步 `quizs/*.md`
5. 最后更新测试并运行验证

### 0.6 常见禁止事项

- 不要只更新整卷，不更新 practice bank
- 不要只补 markdown 阅读版，不更新站内数据
- 不要批量引入大体积截图资源
- 不要把交互 demo 塞进题面 mockup
- 不要把 `Week 5 React lectures` 混进当前 Quiz 2 模拟卷

### 0.7 快速开始

本地开发常用命令：

```bash
npm install
npm run dev
```

其他常用命令：

```bash
npm run test
npm run build
npm run lint
```

默认开发服务器由 Next.js 提供；启动后可在本地访问课程、题库和模拟真题页面。

## 1. 项目定位

这是一个面向 `COMP6080 Web Foundations` 的教学内容平台，不只是题目展示页。

当前项目同时服务于三类场景：

- 课程学习：按课程主线浏览 slides、代码证据与 demo 入口
- 题库练习：按周次与主题筛选单题，查看答案与解析
- 模拟真题：按整套试卷进行阅读、讲评与复盘

项目已经从早期的“Week 1–4 原型”演进为一套可持续扩展的内容系统，当前内容已覆盖更完整的知识主题与多周练习 / 试卷数据。

## 2. 当前技术栈

- 框架：`Next.js 15`
- 视图层：`React 19`
- 语言：`TypeScript`
- 样式：`Tailwind CSS` + 项目级 CSS tokens
- 内容渲染：`MDX`、`react-markdown`、`remark-gfm`
- 代码高亮：`highlight.js`
- 测试：`Vitest` + `Testing Library`

当前项目已经不是单纯的 `React + Tailwind` 静态原型，而是基于 Next.js App Router 的内容平台。

## 3. 当前模块结构

顶层面向用户的主入口有三块：

- `课程`：`/courses`
- `题库中心`：`/practice`
- `模拟真题`：`/exams`

此外还存在一些辅助或内部入口：

- `知识点详情`：`/knowledge/...`
- `Demos`：`/demos/...`
- `登录`：`/login`
- `管理后台`：`/admin`

根路由 `/` 当前会直接重定向到 `/courses`。

## 4. 路由与页面现实

当前项目采用 Next.js App Router，实际页面入口以 `src/app` 为准，而不是 README 早期版本里那种纯静态周次路由表。

当前核心路由包括：

- `/` → 重定向到 `/courses`
- `/courses/[[...slug]]`
- `/practice`
- `/exams`
- `/knowledge/[[...slug]]`
- `/demos/[[...slug]]`
- `/login`
- `/admin`

其中：

- `courses` 是课程主入口
- `practice` 和 `exams` 面向题库与整卷练习
- `knowledge` 更偏主题化知识点详情
- `demos` 用于承载独立实验与示例

## 5. 当前布局与交互骨架

项目整体采用“上中下”结构：

- 顶部 `Header`
- 中间 `Main`
- 底部 `Footer`

布局重点不是传统文档页，而是：

- Header 固定在顶部，承担模块导航与用户入口
- Main 独立滚动，承载课程 / 题库 / 试卷等主体内容
- Footer 固定在底部，维持整体结构稳定

题库与试卷页强调卡片化阅读；课程页强调连续学习与局部切换；知识点与 demo 页则承担更细粒度的讲解与实验角色。

## 6. 当前视觉风格

README 早期版本提到的“科技蓝主题”已经不是当前项目真实风格。

当前视觉基调是：

- 暖纸张背景
- 深青绿作为主品牌色
- 暖琥珀作为辅助强调色
- 白色 / 浅米色卡片层次
- 教学内容区和后台式证据图区并存

也就是说，现在的项目不是冷蓝科技风，而是更偏“纸张学习感 + 管理后台感”的混合体系。

### 6.1 视觉分层

- 页面外层：暖纸色内容平台
- 内容卡片：浅色纸面、低对比边框、适度阴影
- 题面 mockup：轻后台风格，用于还原页面证据
- 强调信息：深青绿 / 暖琥珀标签与状态点缀

### 6.2 设计取向

- 优先可读性与层次，而不是装饰性
- 支持高密度信息，但尽量保持清晰分区
- UI 证据区应真实、简洁、便于分析
- 不为了“像海报”而牺牲教学清晰度

## 7. 当前内容组织方式

项目现在采用“内容与代码分离”的结构：

- `content/knowledge/`：知识点 MDX，按主题目录组织
- `content/questions/`：练习题库 JSON
- `content/exams/`：试卷 / 模拟卷 JSON
- `quizs/`：人类可读的阅读版试卷文档

这和 README 早期版本里“按 week 写一整篇 knowledge 文档”的思路不同。当前知识内容更偏主题化组织，例如：

- `html/`
- `css/`
- `javascript/`
- `nodejs/`
- `react/`
- `ui-ux/`

这更贴近长期扩展，也更利于按知识点复用。

## 8. 当前内容建模约定

### 8.1 知识点内容

知识点使用 `MDX`，适合承载：

- 长文本讲解
- 代码块
- 小型教学结构
- 与组件结合的内容呈现

### 8.2 练习题库

练习题以“单题记录”为单位存在于 `week-*.practice.json` 中，适合：

- 题库筛选
- 单题展开
- 按周同步维护
- 与试卷题目互相映射

### 8.3 模拟真题

试卷以“整卷”为单位存在于 `content/exams/*.json` 中，当前已经支持：

- 常规模拟卷
- 周次模拟卷
- Quiz 模拟卷 / 真题改编卷
- 结构化题目列表
- 每题独立的 subQuestions
- 可选 `mockup` 题面

### 8.4 HTML Mockup 题面

对于老师样本里常见的“Supporting files + 页面截图”类题目，当前推荐使用轻量 HTML Mockup，而不是新增重图片资源。

其特点是：

- 使用统一的渲染能力与通用样式
- 保留真实考试观感
- 只还原判题需要的视觉证据
- 更容易批量生成、修改与维护

## 9. 当前目录概览

```text
src/
  app/
    (app)/
      courses/
      practice/
      exams/
      knowledge/
      demos/
      admin/
    login/
  components/
  features/
    courses/
    knowledge/
    practice/
    mock-exams/
    demos/
  lib/
  types/

content/
  knowledge/
    html/
    css/
    javascript/
    nodejs/
    react/
    ui-ux/
  questions/
    week-1.practice.json
    week-2.practice.json
    week-3.practice.json
    week-4.practice.json
    week-5.practice.json
  exams/
    week-1.mock-exams.json
    week-2.mock-exams.json
    week-3.mock-exams.json
    week-4.mock-exams.json
    quiz-2.mock-exams.json
    ...

quizs/
  2026T3-QUIZ1.md
  2026T3-QUIZ2.md
  ...
```

## 10. 当前维护原则

在这个项目里，内容更新通常不是“只改一个文件”。

一条比较完整的更新路径通常是：

1. 更新 `content/exams/*.json` 或 `content/questions/*.json`
2. 同步对应的 practice bank
3. 若题面需要截图感，优先补 `mockup`
4. 同步 `quizs/*.md`
5. 更新测试并运行验证

这些协作规则已经在：

- [AGENTS.md](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/AGENTS.md)

中固定下来，README 只保留面向人类的摘要说明。

## 11. 为什么现在这样设计

当前架构能同时兼顾：

### 对教学使用

- 课程模块适合按节奏讲授
- 题库模块适合逐题训练与讲评
- 试卷模块适合整卷复盘与专项模拟

### 对学生使用

- 可以按课程主线学
- 可以按题库刷
- 可以按整卷练
- 页面信息密度较高，但结构明确

### 对内容维护

- 知识点、题库、试卷分层清晰
- 结构化内容便于批量扩展
- HTML Mockup 降低截图资源维护成本
- 测试可以对内容完整性做基本兜底

## 12. 当前结论

这个项目现在应被理解为：

- 一个以教学为核心的内容平台
- 一个支持课程、题库、试卷三条使用路径的学习系统
- 一个逐步从“原型文档”演进到“可持续维护知识库”的真实仓库

因此，当前最重要的不是继续沿用早期蓝色原型设定，而是让 README 与现有代码、现有内容结构、现有协作规则保持一致。
