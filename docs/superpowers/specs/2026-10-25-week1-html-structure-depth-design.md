# Week 1 HTML 文档结构深化设计

## 目标

把 Week 1 的 `HTML 文档结构` 从“几个零散知识点”重构成一条自上而下的主线，让学生能按整份 HTML 文档的真实组织方式理解页面结构。

## 设计结论

采用“重写 Lesson 2，收束 Lesson 3”的方案：

- `Lesson 2` 负责完整讲清 `doctype -> html -> head -> body -> body 内常见结构 -> 块元素 / 行内元素 -> 语义骨架`
- `Lesson 3` 不再重复解释标签定义，改为专讲“结构表达如何更专业”，重点放在标题层级、`section/article` 边界，以及何时退回 `div/span`

## Lesson 2 重构范围

新的 `Lesson 2` 应形成一条连续教学线：

1. 为什么一份 HTML 文档有严格骨架
2. 浏览器按什么顺序理解 `doctype`、`html`、`head`、`body`
3. `head` 中最基础也最常见的标签：`meta charset`、`meta viewport`、`title`、`link`
4. `body` 承载什么，以及哪些结构通常应放在其中
5. 常见语义地标：`header`、`nav`、`main`、`section`、`article`、`aside`、`footer`
6. 块元素与行内元素的基本直觉
7. 一份更完整的 HTML 骨架代码
8. 保留 `code -> demo` 节奏，继续使用 `document-skeleton` demo

## Lesson 3 收束范围

新的 `Lesson 3` 聚焦“结构表达质量”，不再承担文档骨架扫盲：

- `h1-h6` 是结构层级，不是字号工具
- `section` 与 `article` 的使用边界
- `div soup` 与语义结构的对照
- 什么时候该优先使用语义标签，什么时候退回 `div/span`

## 兼容性要求

- 保持 `week-1/structure` lesson id 不变
- 保持 `week-1/semantics` lesson id 不变
- 保持 `Lesson 2` 仍含有一个 `demo` slide，且路由继续为 `/demos/week-1/html/document-skeleton`
- 不新增新的 slide kind，只复用现有 `cover / outline / content / code / compare / demo / closing`

## 验证

- 运行 `pnpm test -- src/lib/content/courses.test.ts`
- 运行 `pnpm test -- src/features/courses/components/slides/SlideRenderer.test.tsx`
