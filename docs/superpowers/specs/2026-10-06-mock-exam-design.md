# 模拟真题 (Mock Exam) 设计规范

## 1. 目标
在 COMP6080 题库平台中引入“模拟真题 (Mock Exam)”模块。首个任务是将 `quizs/2026T3-QUIZ1.md` 转化为结构化的数据，并在前端页面中以现代化的卡片流形式展示。该设计旨在提供最接近纸质试卷连贯性的阅读体验，同时兼顾数字化的便捷答案核对。

## 2. 视觉与交互设计 (UI/UX)
- **整体布局**：**单页沉浸流 (经典卷子模式)**。
  - 页面由上至下垂直平铺所有的真题卡片。
  - 页面顶部或侧边提供全局控制按钮（如：“展开全部答案” / “隐藏全部答案”）。
- **卡片结构 (方案 1：按“大题”聚拢)**：
  - 每道大题（Question）占据一张独立卡片。
  - **题干区**：展示大题的通用描述、背景代码块或图片。
  - **子题区**：罗列 `(a)`, `(b)`, `(c)` 等子题的题目内容及分值（如 `[3 marks]`）。
- **答案交互 (内联手风琴 Inline Accordion)**：
  - 默认情况下，卡片内仅显示题目内容，隐藏答案。
  - 在卡片底部或子题区域下方提供“查看答案与解析”的折叠按钮（Toggle）。
  - 点击后，答案区域在卡片内部向下平滑展开（手风琴效果）。
  - 展开的答案区应清晰区分各个子题的 `Model answer` 和评分标准（Marking criteria）。

## 3. 数据结构设计 (Data Model)
由于真题的嵌套结构（大题包含小题）与现有的单题 `PracticeQuestion` 不完全匹配，需要设计一套专用的 `ExamQuestion` 结构。

### 3.1 类型定义建议 (TypeScript)
```typescript
// 试卷元数据
export interface ExamPaper {
  id: string;          // 例如 '2026T3-QUIZ1'
  title: string;       // 例如 '2026 Term 3 Quiz 1'
  description?: string;
  totalMarks: number;
  questions: ExamQuestion[];
}

// 单道大题
export interface ExamQuestion {
  id: string;          // 大题 ID
  title: string;       // 大题标题，例如 "The four rules below all set the colour..."
  marks: number;       // 大题总分
  contentMdx: string;  // 大题的共用题干/代码背景 (MDX 格式)
  subQuestions: ExamSubQuestion[]; // 包含的子题
}

// 子题 (a, b, c...)
export interface ExamSubQuestion {
  id: string;          // 例如 'a'
  label: string;       // 例如 '(a)'
  marks: number;       // 例如 3
  questionMdx: string; // 子题问题描述
  answerMdx: string;   // Model answer 内容
  markingMdx?: string; // 评分标准说明
}
```

## 4. 解析与转换策略 (Parser)
由于原始文件是纯 Markdown，需要编写一个构建时脚本（或运行时解析器）将 `quizs/2026T3-QUIZ1.md` 解析为上述 JSON/对象结构。
- **分隔符识别**：使用 `---` 或 `### Q.` 作为大题之间的分隔符。
- **提取逻辑**：
  - 匹配 `### Q. (.*) \((.*) marks\)` 提取大题标题和总分。
  - 匹配 `\*\*\((.)\)\*\* \[(.*) marks\] (.*)` 提取子题标识、分值和问题。
  - 匹配 `**Model answer:**` 提取答案区块。
  - 提取代码块中的评分标准。

## 5. 组件架构 (React Components)
1. `ExamPage`: 负责加载试卷数据，渲染全局控制栏和试卷列表。
2. `ExamQuestionCard`: 接收 `ExamQuestion` 数据，渲染大题卡片外框、题干内容。
3. `ExamSubQuestionList`: 渲染该大题下的所有子题。
4. `ExamAnswerAccordion`: 封装手风琴折叠逻辑，包含 Model answer 和打分标准。可以使用 Tailwind 的 `group-open` 或简单的 React state 来控制展开/收起。

## 6. 与现有系统的集成
- 将新的 `ExamPage` 接入路由系统（例如 `/exam/:id` 或 `/quiz/:id`）。
- 确保使用的 MDX 渲染器（`ReactMarkdown` / `@tailwindcss/typography`）能够正确渲染真题中频繁出现的代码块和高亮。
- 遵循项目的 UI 约束：严格使用 Tailwind v4，避免内联样式，保持卡片风格（阴影、圆角、边框）与现有系统一致。
