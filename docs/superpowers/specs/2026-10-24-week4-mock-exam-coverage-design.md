# Week 4 模拟试卷补题与题库同步设计

## 1. 目标

补强 Week 4 模拟试卷的内容覆盖度，确保课程主线里的 6 个主章节都至少在试卷中出现 1 道明确归属的题目：

1. JSON
2. XHR
3. fetch
4. Promise
5. async / await
6. HTTP / Express

本次工作采用“只增不删”的原则：保留现有 Week 4 试卷题目不动，只做增量补题。同时，凡是新增到试卷中的知识点题，必须同步在 Week 4 题库中新增对应练习题，保证“试卷覆盖面”和“题库覆盖面”一致。

## 2. 当前状态与问题

### 2.1 正式 Week 4 试卷内容不足

当前正式接入的 [`content/exams/week-4.mock-exams.json`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/exams/week-4.mock-exams.json) 为空，无法承担 Week 4 主线覆盖任务。

### 2.2 仓库里存在旧版 Week 4 卷

仓库中另有 [`content/exams/week4-sim.json`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/exams/week4-sim.json)，并且在 [`src/lib/content/mockExams.ts`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/lib/content/mockExams.ts) 中仍会被加载。它已经包含一部分 Week 4 题目，但覆盖不完整，且章节边界和当前课程主线不完全对齐。

### 2.3 题库与试卷覆盖尚未绑定

[`content/questions/week-4.practice.json`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/questions/week-4.practice.json) 已有一批 Week 4 题，但当前没有规则保证“试卷新增题”会同步映射为题库练习题，容易出现课程和试卷覆盖了、题库却缺题的情况。

## 3. 设计原则

### 3.1 主线覆盖优先

出题与补题都以 Week 4 当前课程主线为准，而不是以历史遗留题目结构为准。判断是否“补齐”的标准，是 6 个主章节是否都至少命中 1 次，而不是题量是否看起来变多。

### 3.2 只增不删

现有试题保留，不做删题或推翻式重写。本次只增加缺口章节对应的新题，避免影响已经可用的内容。

### 3.3 试卷与题库双写入

新增到 mock exam 的题，必须同步新增一条或多条到 Week 4 practice question bank。两边不要求题型完全一样，但要求：

- 主题一致
- 关键知识点一致
- 题目表述可以根据场景微调
- 覆盖关系可追踪

### 3.4 优先复用已有内容资产

补题时优先参考以下现有材料：

- Week 4 课程 slide 与章节结构：[`src/lib/content/courses.ts`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/src/lib/content/courses.ts)
- 旧版 Week 4 卷：[`content/exams/week4-sim.json`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/exams/week4-sim.json)
- Week 4 题库：[`content/questions/week-4.practice.json`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/questions/week-4.practice.json)

这样可以保持题风、知识点命名、答案口径都尽量一致。

## 4. 方案选择

本次采用以下方案：

### 方案 A：在现有 Week 4 卷上增量补题

- 以正式 Week 4 mock exam 数据为目标载体
- 保留现有旧题
- 只为缺失章节新增题目
- 同步补入 Week 4 practice question bank

这是推荐方案，因为它最符合“现有试题没问题，新增几个”的要求，同时能把章节覆盖和题库同步都建立起来。

### 不采用的方案

#### 方案 B：直接把旧版 `week4-sim` 原样扶正

不采用。原因是历史题目结构和当前课程主线并不完全贴合，直接扶正容易把旧口径问题一起带回来。

#### 方案 C：整套重编正式模拟卷

不采用。原因是改动面太大，超出了这次“补齐覆盖”的目标。

## 5. 数据与内容设计

### 5.1 试卷侧

目标文件：

- [`content/exams/week-4.mock-exams.json`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/exams/week-4.mock-exams.json)

设计要求：

- 新增 1 套正式可用的 Week 4 模拟试卷数据
- 试卷中至少覆盖 6 个主章节
- 每个章节至少有 1 道明确归属题
- 优先使用现有 `ExamPaper -> ExamQuestion -> ExamSubQuestion` 结构，不新增新 schema

题型建议：

- JSON：概念辨析 / 序列化与 parse
- XHR：状态码、`onload` / `onerror`、`responseText`
- fetch：`res.ok`、`Response` vs data、body 读取
- Promise：状态、链式、错误传播或组合器
- async / await：返回 Promise、`await` 行为、`try/catch`、串并行
- HTTP / Express：协议、request/response、`req.query` / `req.body`、JSON 输出

### 5.2 题库侧

目标文件：

- [`content/questions/week-4.practice.json`](file:///Users/luffyzh/luffyzh/github/irbtree/comp6080-quizs/content/questions/week-4.practice.json)

设计要求：

- 为试卷新增题补充对应的 practice questions
- 保持现有 question schema：
  - `id`
  - `topic`
  - `weeks`
  - `difficulty`
  - `tags`
  - `question`
  - `knowledgePoint`
  - `answerExplanation`
  - `codeBlocks`
  - `images`
  - `createdAt`

同步规则：

- 试卷里新增的每个主知识点，题库里都必须能找到对应练习题
- 若试卷题是复合型大题，题库可以拆成更小的单点题
- 题库不要求完全复制试卷子题，但必须覆盖相同知识点

## 6. Week 4 覆盖清单

实施后，需要能明确证明 Week 4 的 6 个主章节全部被覆盖：

1. JSON
2. XHR
3. fetch
4. Promise
5. async / await
6. HTTP / Express

建议在实现时维护一份覆盖映射：

- 试卷题目 ID -> 章节
- 题库题目 ID -> 章节

这样后续做测试或人工检查都更直接。

## 7. 旧版 `week4-sim` 的处理策略

由于 `week4-sim` 仍在注册表中被加载，本次不能假设它不存在。

处理策略如下：

- 允许参考旧题内容与表述
- 不把旧题直接原样复制为正式版本
- 正式 Week 4 卷应使用 `week-4.mock-exams.json` 作为主入口
- 若发现列表页出现两个 Week 4 入口且会干扰使用，再在后续单独处理“去重/隐藏旧卷”问题

这次工作的重点是“补齐内容覆盖”，不顺带扩张为“整理所有历史试卷入口”。

## 8. 验证要求

至少要验证以下几点：

### 8.1 内容验证

- Week 4 正式 mock exam 不再为空
- 6 个主章节在试卷中全部出现
- 新增章节题在题库中也都有对应新增题

### 8.2 回归验证

- mock exam 列表页仍能正常读取 Week 4 试卷
- mock exam 详情页仍能正常渲染新增题目
- 题库页面仍能正常读取 Week 4 practice 数据

### 8.3 测试策略

优先添加一条“覆盖面验证”测试，而不是只验证“有数据”：

- 断言 Week 4 正式试卷的题目集合覆盖 6 个主章节
- 断言 Week 4 practice question bank 的题目集合也覆盖这 6 个主章节

## 9. 非目标

本次不做以下工作：

- 不重做整套 Week 4 模拟卷的 UI
- 不调整 mock exam 页面结构
- 不统一清理所有历史 `week*-sim` 旧卷
- 不扩展到 Week 5 或其他周次
- 不把题库与试卷建立新的复杂引用系统

## 10. 结果预期

完成后，Week 4 应具备下面这些特征：

- 正式模拟试卷内容完整，不再明显缺章
- 课程 6 个主章节在试卷中均有体现
- 新增试卷题同步进入题库，形成一致的训练闭环
- 后续无论从课程、题库还是真题入口进入，Week 4 的知识覆盖都更加均衡
