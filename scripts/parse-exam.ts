import * as fs from 'fs'
import * as path from 'path'

// 定义多个考试文件的配置信息，方便扩展和自定义标签
const EXAMS_CONFIG = [
  {
    input: 'quizs/2026T3-QUIZ1.md',
    output: 'content/exams/week-1.mock-exams.json',
    id: "2026T3-QUIZ1",
    title: "2026 Term 3 Quiz 1",
    description: "Comprehensive mock exam covering HTML, CSS, and JS.",
    tags: ["真题"], // 可以在这里修改或添加不同的标签，如 ["模拟题"]
    topic: "html"
  },
  {
    input: 'quizs/Week1-模拟试卷.md',
    output: 'content/exams/week1-sim.json',
    id: "WEEK1-SIM",
    title: "Week 1 模拟试卷",
    description: "Week 1 知识点模拟试卷：HTML 语义化、CSS 盒模型尺寸精准计算、Flexbox 主轴交叉轴对齐。",
    tags: ["模拟题", "Week1"],
    topic: "html"
  },
  {
    input: 'quizs/Week2-模拟试卷.md',
    output: 'content/exams/week2-sim.json',
    id: "WEEK2-SIM",
    title: "Week 2 模拟试卷",
    description: "Week 2 知识点模拟试卷：移动端优先响应式、JS 基础、NPM 依赖与脚本管理。",
    tags: ["模拟题", "Week2"],
    topic: "javascript"
  },
  {
    input: 'quizs/Week3-模拟试卷.md',
    output: 'content/exams/week3-sim.json',
    id: "WEEK3-SIM",
    title: "Week 3 模拟试卷",
    description: "Week 3 知识点模拟试卷：DOM 操作与事件委托、表单验证与默认行为、闭包（Closure）。",
    tags: ["模拟题", "Week3"],
    topic: "javascript"
  },
  {
    input: 'quizs/Week4-模拟试卷.md',
    output: 'content/exams/week4-sim.json',
    id: "WEEK4-SIM",
    title: "Week 4 模拟试卷",
    description: "Week 4 知识点模拟试卷：异步编程宏观理解、async/await 重构、回调地狱及前后端通信。",
    tags: ["模拟题", "Week4"],
    topic: "javascript"
  },
  {
    input: 'quizs/mock-exam-1.md',
    output: 'content/exams/mock-exam-1.json',
    id: "MOCK-EXAM-1",
    title: "模拟试卷 1",
    description: "基于前四周知识点（HTML, CSS, 响应式, JS 基础）的模拟试卷。",
    tags: ["模拟题"],
    topic: "javascript"
  },
  {
    input: 'quizs/mock-exam-2.md',
    output: 'content/exams/mock-exam-2.json',
    id: "MOCK-EXAM-2",
    title: "模拟试卷 2",
    description: "基于前四周知识点（DOM, NPM, 事件冒泡, Fetch/Promise）的模拟试卷。",
    tags: ["模拟题"],
    topic: "javascript"
  }
]

for (const config of EXAMS_CONFIG) {
  const inputPath = path.join(process.cwd(), config.input)
  const outputPath = path.join(process.cwd(), config.output)

  if (!fs.existsSync(inputPath)) {
    console.warn(`File not found, skipping: ${inputPath}`)
    continue
  }

  const content = fs.readFileSync(inputPath, 'utf-8')

  // Split by '---' or '### Q.' to get main questions
  const blocks = content.split(/\n---\n+/).filter(Boolean)

  const questions = []
  let qIndex = 1

  for (const block of blocks) {
    if (!block.trim()) continue
    
    // Extract main question title and marks
    const mainMatch = block.match(/### Q\. (.*?)\s+\((\d+) marks\)/)
    if (!mainMatch) continue
    
    const title = mainMatch[1]
    const marks = parseInt(mainMatch[2], 10)
    
    // Extract content before the first sub-question
    const contentMdx = block
      .replace(/### Q\..*/, '')
      .split(/\*\*\([a-z]\)\s*\[\d+\s*marks\]\*\*/)[0]
      .trim()
      
    // Extract sub-questions
    const subQuestions = []
    const subBlocks = block.split(/\*\*\(([a-z])\)\s*\[(\d+)\s*marks\]\*\*/).slice(1)
    
    for (let i = 0; i < subBlocks.length; i += 3) {
      const label = `(${subBlocks[i]})`
      const subMarks = parseInt(subBlocks[i + 1], 10)
      const subContent = subBlocks[i + 2]
      
      // Extract questionMdx
      const questionMdx = subContent
        .split('**Model answer:**')[0]
        .trim()
        
      // Extract answer and marking
      const answerSection = subContent.split('**Model answer:**')[1] || ''
      
      // The answer is in the first code block, marking in the second
      const codeBlocks = answerSection.match(/```[\s\S]*?```/g) || []
      
      const answerMdx = codeBlocks[0] ? codeBlocks[0].replace(/```/g, '').trim() : ''
      const markingMdx = codeBlocks[1] ? codeBlocks[1].replace(/```/g, '').trim() : ''
      
      subQuestions.push({
        id: `Q${qIndex}-${subBlocks[i]}`,
        label,
        marks: subMarks,
        questionMdx,
        answerMdx,
        markingMdx
      })
    }
    
    questions.push({
      id: `Q${qIndex}`,
      title,
      marks,
      contentMdx,
      subQuestions
    })
    
    qIndex++
  }

  const paper = {
    id: config.id,
    title: config.title,
    description: config.description,
    tags: config.tags,
    totalMarks: questions.reduce((acc, q) => acc + q.marks, 0),
    questions
  }

  const collection = {
    topic: config.topic,
    exams: [paper]
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2))
  console.log(`Successfully parsed exam to ${outputPath} with tags: ${config.tags.join(', ')}`)
}
