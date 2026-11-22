# COMP6080 冲刺卷 03 设计规格

## 目标

新增一套和现有整卷具体考点不重复的期末冲刺卷，减少文件路径等高频主题在不同卷中的重复，同时补充目前较少覆盖的 React 入门、UI 测试和 Week 8 课程主题。

## 范围与去重标准

- 试卷名称：`COMP6080 冲刺卷03`；英文标题：`COMP6080 Sprint Paper 03`。
- 与仓库中所有现有整卷及历次 Quiz 题目逐题对照，不仅与冲刺卷 01/02 对照。
- 按具体机制判定重复；相同课程周次或技术大类不自动视为重复，但不得复用既有题目的核心行为、错误机制或修复目标。
- 明确排除已反复出现的文件路径、盒模型、CSS 特异性、事件循环、Fetch/Promise、React state/effect/router，以及跨组件共享状态等考点。
- Week 8 仅采用课程大纲明确列出的 UI 测试、CSR/SSR/SSG 渲染策略、Lint/Build/交付主题，不扩展到大纲未提及的工具细节。

## 试卷结构

- 10 道大题，每题 3 个子题，每题 8 分，总分 80 分。
- 子题分值为 2/3/3；答案说明因果机制，评分点按分值拆分。
- 双语题干、答案和评分标准；沿用 `quiz-sample`、Supporting files 与静态 HTML Mockup 结构。
- 不新增截图图片；Mockup 只保留答题所需的视觉证据。

## 考点分布

| 大题 | 周次 | 唯一核心考点 |
|---|---|---|
| Q1 | Week 6 | React 根节点与 `createRoot` 挂载 |
| Q2 | Week 6 | Props 的只读输入契约 |
| Q3 | Week 6 | `children` 组合与可复用组件 |
| Q4 | Week 6 | React `style` 对象与 JavaScript 属性命名 |
| Q5 | Week 6 | CSS Modules 与全局样式作用域 |
| Q6 | Week 7 | 组件、hooks、utils 的多文件职责边界 |
| Q7 | Week 8 | 开发服务器与静态生产交付的边界 |
| Q8 | Week 8 | 以用户可见行为设计 UI 回归测试 |
| Q9 | Week 8 | CSR、SSR、SSG 的交付取舍 |
| Q10 | Week 8 | Lint 与 Build 各自解决的问题 |

## 数据同步与实现范围

- 新建 `content/exams/sprint-3.final.json` 并注册试卷 loader。
- React 考点同步到 `content/questions/week-7.practice.json`。
- Week 8 考点同步到新建的 `content/questions/week-8.practice.json`，并为该周注册练习题 loader。
- 新建 `quizs/COMP6080-冲刺卷03.md`，保持卷名、题量、总分及主要考点一致。
- 更新内容测试，验证试卷存在、10 题 × 3 子题、总分自洽、Mockup 约束及 Practice Bank ID 同步。

## 验收标准

- 10 道大题分别覆盖表中唯一核心考点，且不复用任何已存在整卷的具体核心机制。
- 每道大题恰有 3 个子题，单题 8 分，整卷 80 分；中英文题面、答案、评分标准齐全。
- 所有新增题目均能在对应周次 Practice Bank 找到；Week 8 练习题能通过周次 loader 读取。
- Markdown 阅读版与站内试卷的标题、题量、总分、主要考点一致。
- 内容测试与 TypeScript 检查通过。
