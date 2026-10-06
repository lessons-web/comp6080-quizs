import * as fs from 'fs'
import * as path from 'path'

const inputPath = path.join(process.cwd(), 'quizs/2026T3-QUIZ1.md')
const outputPath = path.join(process.cwd(), 'content/exams/week-1.mock-exams.json')

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
  id: "2026T3-QUIZ1",
  title: "2026 Term 3 Quiz 1",
  description: "Comprehensive mock exam covering HTML, CSS, and JS.",
  totalMarks: questions.reduce((acc, q) => acc + q.marks, 0),
  questions
}

const collection = {
  topic: "html",
  exams: [paper]
}

fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2))
console.log('Successfully parsed exam to', outputPath)
