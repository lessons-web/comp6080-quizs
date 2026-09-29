# COMP6080 题库系统设计说明

## 1. 项目目标

设计并实现一套面向 `COMP6080` 课程的 Web 题库系统，第一版聚焦 `Week 1–4`，以 `Week 1` 作为内容样板做深，整体支持后续扩展到整门课程。

系统的核心目标不是单纯展示题目，而是围绕课程改版后的 quiz 化方向，形成一套适合：

- 讲师备课与课堂讲评
- 学生按知识点复习
- 学生按题库练习
- 学生做整套模拟题和历年题

的统一内容平台。

## 2. 设计结论

本系统采用以下设计结论：

- 技术栈：`React + TailwindCSS`
- 主题风格：`Light 模式`
- 主题色：`科技蓝`
- 页面布局：`Header + Main + Footer`
- 导航方式：`按模块导航`
- 模块结构：
  - `知识点解析`
  - `模拟题库`
  - `模拟真题`
- 覆盖范围：系统骨架覆盖 `Week 1–4`
- 内容策略：`Week 1` 先做完整样板
- 内容架构：采用 `方案 B`
  - `知识点解析` 使用 `Markdown/MDX`
  - `模拟题库 / 模拟真题` 使用结构化数据

## 3. 系统范围

### 3.1 第一版包含内容

- 首页与全局布局
- 三大模块页面
- `Week 1–4` 周切换骨架
- `Week 1` 的完整内容样板
  - 知识点解析
  - 分类题库
  - 两套模拟真题
- 可扩展的数据结构与目录结构

### 3.2 第一版不包含内容

- 用户登录
- 做题进度持久化
- 收藏 / 错题本
- 自动判分
- 后台管理系统
- 暗黑模式

这些能力未来都可以扩展，但不进入第一版。

## 4. 信息架构

### 4.1 顶层导航

Header 固定展示三个主模块：

- `知识点解析`
- `模拟题库`
- `模拟真题`

用户先选择模块，再在模块内部切换 `Week 1–4`。

### 4.2 路由结构

建议采用如下路由：

- `/`
- `/knowledge/week-1`
- `/knowledge/week-2`
- `/knowledge/week-3`
- `/knowledge/week-4`
- `/practice/week-1`
- `/practice/week-2`
- `/practice/week-3`
- `/practice/week-4`
- `/mock-exams/week-1`
- `/mock-exams/week-2`
- `/mock-exams/week-3`
- `/mock-exams/week-4`

如果后续扩展整门课，只需要继续增加周次，而不需要重构路由形态。

## 5. 页面布局设计

### 5.1 整体布局

页面固定采用三段结构：

- `Header`
- `Main`
- `Footer`

### 5.2 Header

Header 包含：

- 系统名称，例如：`COMP6080 Quiz Hub`
- 三个主导航入口
- 当前模块的高亮态

Header 建议固定在顶部，保证用户切换模块时稳定可见。

### 5.3 Main

Main 是内容主区域，包含：

- 模块标题区
- Week 切换栏
- 当前周内容主体

Main 保持较舒适的阅读宽度，不做过宽排版，兼顾讲师阅读与学生刷题。

### 5.4 Footer

Footer 保持简洁，仅放版权和用途说明，例如：

- `© 2026 COMP6080 Training Notes`
- `Built for teaching and quiz practice`

## 6. 视觉风格

### 6.1 视觉原则

整体采用：

- 明亮的 Light 风格
- 干净、现代、教学产品导向
- 科技蓝为主强调色

不使用暗黑模式，不使用花哨动画，不做海报式视觉夸张。

### 6.2 视觉元素

- 页面背景：浅白或浅灰蓝
- 卡片背景：白色
- 强调色：科技蓝
- 边框：浅灰蓝细边框
- 阴影：轻量阴影
- 圆角：中等圆角

### 6.3 视觉用途分配

- 蓝色用于：
  - 当前导航高亮
  - 按钮
  - 标签
  - 链接
  - 展开状态强调
- 正文保持深灰和黑色系，避免整页过度高饱和。

## 7. 三大模块设计

## 7.1 知识点解析

### 页面目标

知识点解析模块用于讲授与复习，不是单纯文档阅读页，而是“讲解 + 易错点 + 例子 + 关联题”的混合型结构。

### 页面结构

每个 `Week` 页面由多个知识点 section 组成，每个 section 包含：

- 标题
- 核心讲解
- 易错点
- 小例子
- 关联题入口

### 交互方式

- 顶部切换周次
- 页面内支持知识点锚点导航
- 点击关联题可跳转到对应题库题目

### 内容格式

知识点解析使用 `MDX`，因为它适合：

- 长文本讲解
- 代码块
- 教学注释
- 后续混合 React 组件

## 7.2 模拟题库

### 页面目标

题库模块用于按知识点练习，不按套卷组织。

### 页面结构

每道题以独立卡片展示，默认只展示：

- 题号
- 题目
- 必要的代码块或图片

用户点击后再展开：

- 知识点
- 答案解析

### 交互方式

- 按周切换
- 按分类切换，例如：
  - `HTML`
  - `CSS`
  - 后续可扩展 `JavaScript`、`React`
- 题目卡片单独展开 / 收起

### 设计原则

- 一道题就是一个独立对象
- 页面始终围绕“一题一题”的节奏组织
- 适合学生自主练习，也适合讲师逐题讲评

## 7.3 模拟真题

### 页面目标

真题模块用于展示整套题，不和题库混用。

### 页面结构

每个 Week 下可包含：

- 历年真题
- 模拟试卷

每套卷子包含：

- 套卷标题
- 题目列表
- 答案区

第一版建议沿用你已确认的排版方式：

- 上方展示整套题目
- 下方统一展示答案

### 设计原则

- 真题的组织单位是“套卷”
- 题库的组织单位是“单题”
- 两者数据结构相关，但展示逻辑不同

## 8. 内容建模方案

采用 `方案 B`：

- `知识点解析`：`Markdown/MDX`
- `模拟题库 / 模拟真题`：结构化数据

这样做的原因是：

- 讲解内容更适合自然写作
- 题目内容更适合“一题一对象”的标准化管理
- 有利于后续筛选、跳转、扩展字段

## 9. 文件与目录结构建议

```text
src/
  app/
  components/
  features/
    knowledge/
    practice/
    mock-exams/
  lib/
  types/

content/
  knowledge/
    week-1.mdx
    week-2.mdx
    week-3.mdx
    week-4.mdx
  questions/
    week-1.practice.json
    week-2.practice.json
    week-3.practice.json
    week-4.practice.json
  exams/
    week-1.mock-exams.json
    week-2.mock-exams.json
    week-3.mock-exams.json
    week-4.mock-exams.json
```

## 10. 数据模型设计

## 10.1 知识点解析（MDX）

建议路径：

- `content/knowledge/week-1.mdx`
- `content/knowledge/week-2.mdx`
- `content/knowledge/week-3.mdx`
- `content/knowledge/week-4.mdx`

建议结构：

```mdx
---
week: 1
title: Week 1 知识点解析
updatedAt: 2026-09-20
---

## HTML Fundamentals

### 核心讲解
...

### 易错点
...

### 例子
```html
...
```

### 关联题
- W1-HTML-Q1
- W1-HTML-Q2
```

## 10.2 模拟题库（单题结构）

建议每题为一条独立记录。

建议字段：

```json
{
  "id": "W1-HTML-Q1",
  "week": 1,
  "module": "practice",
  "category": "HTML",
  "questionNo": 1,
  "question": "在下面代码中，哪一部分属于页面主体内容？为什么？",
  "codeBlocks": [
    {
      "language": "html",
      "code": "<!doctype html>...</html>"
    }
  ],
  "images": [
    {
      "src": "/images/week1/example-1.png",
      "alt": "Week 1 example screenshot",
      "caption": "示意图"
    }
  ],
  "knowledgePoint": "HTML 文档结构（head 与 body）",
  "answerExplanation": "页面主体内容是 body 内的内容。head 主要放文档元信息。",
  "difficulty": "easy",
  "source": "simulation",
  "tags": ["HTML", "文档结构", "基础语义"]
}
```

### 字段说明

- `id`：全局唯一题目编号
- `week`：所属周次
- `module`：当前模块，通常为 `practice`
- `category`：题目分类，例如 `HTML`、`CSS`
- `questionNo`：在当前分类中的序号
- `question`：题目正文
- `codeBlocks`：可选代码块数组
- `images`：可选图片数组，用于未来支持截图题、图示题、UI 判断题
- `knowledgePoint`：题目对应知识点
- `answerExplanation`：答案解析
- `difficulty`：难度
- `source`：来源，例如 `simulation`
- `tags`：检索标签

其中你当前最关心的三部分仍然是：

- `question`
- `knowledgePoint`
- `answerExplanation`

## 10.3 模拟真题（套卷结构）

建议结构：

```json
{
  "week": 1,
  "exams": [
    {
      "id": "W1-EXAM-01",
      "title": "Week 1 模拟真题 1",
      "type": "mock",
      "questionCount": 10,
      "questions": [
        {
          "id": "W1-EXAM-01-Q1",
          "questionNo": 1,
          "question": "在 HTML 基本文档中，head 和 body 的职责分别是什么？",
          "knowledgePoint": "HTML 文档结构",
          "answerExplanation": "head 放元信息，body 放主体内容",
          "codeBlocks": [],
          "images": []
        }
      ]
    }
  ]
}
```

### 扩展约定

未来如果引入历年真题，可直接扩展：

- `type: "past-paper"`
- `year: 2024`

这样不需要重构页面。

## 11. React 组件结构建议

## 11.1 全局布局组件

- `AppShell`
- `Header`
- `Footer`
- `MainContainer`

## 11.2 模块级组件

知识点模块：

- `KnowledgePage`
- `KnowledgeSection`
- `KnowledgeAnchorNav`
- `RelatedQuestions`

题库模块：

- `PracticePage`
- `QuestionCard`
- `QuestionCodeBlock`
- `QuestionImages`
- `QuestionDetailsCollapse`

真题模块：

- `MockExamPage`
- `ExamPaper`
- `ExamQuestionList`
- `ExamAnswerSection`

## 11.3 通用组件

- `WeekTabs`
- `ModuleTabs`
- `Badge`
- `SectionCard`
- `EmptyState`

## 12. 交互设计

### 12.1 知识点解析

- 默认展示完整知识点内容
- 支持跳转到对应题目

### 12.2 模拟题库

- 默认展示题目
- 点击展开知识点与答案解析
- 每题单独控制展开状态

### 12.3 模拟真题

- 先展示整套题
- 再展示整套答案
- 后续可以扩展为“题目 / 答案”切换视图

## 13. 为什么这样设计

这套设计同时满足了三种需求：

### 对讲师

- 知识点模块适合讲课与备课
- 题库模块适合按知识点讲评
- 真题模块适合课后训练和模考讲解

### 对学生

- 可以按模块进入，不会迷失在内容中
- 可以按周聚焦，不需要一次面对整门课程
- 每道题都是独立卡片，阅读与练习节奏更清晰

### 对后续扩展

- 周次可以继续增加
- 题目字段可以继续增加
- 图片题、截图题、UI 判断题可以自然纳入
- 将来做收藏、做题状态、错题本时无需推翻当前结构

## 14. 第一版实现优先级

建议实现顺序：

1. 全局布局与路由骨架
2. Header / Footer / Week Tabs
3. 知识点解析模块
4. 模拟题库模块
5. 模拟真题模块
6. 导入 Week 1 内容样板
7. 预留 Week 2–4 空内容结构

## 15. 验收标准

第一版完成后应满足：

1. 页面符合 `Header + Main + Footer` 结构
2. 全局使用 Light 模式与科技蓝主题
3. 三大模块可以正常切换
4. 每个模块支持 `Week 1–4` 切换
5. `知识点解析` 使用 `MDX`
6. `模拟题库` 按“一题一卡片”展示
7. 题库题默认只展示题目，展开后显示知识点与答案解析
8. `模拟真题` 至少支持两套 Week 1 套卷
9. 题目数据结构支持 `images` 扩展字段
10. 后续扩展 Week 2–4 时不需要重构整体系统

## 16. 结论

这套 `COMP6080` 题库系统第一版应被视为一个“教学内容平台”，而不是刷题 App。

因此第一版重点不是复杂交互，而是：

- 让知识点讲解清晰
- 让题目结构稳定
- 让真题组织合理
- 为后续扩展保留足够空间

在这个前提下，`React + TailwindCSS + MDX + 结构化题目数据` 是当前最合适的实现方案。

