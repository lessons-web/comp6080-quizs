import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CourseSlide } from '../../../../types/course'
import { SlideRenderer } from './SlideRenderer'

const accent = {
  gradient: 'from-emerald-500 to-green-600',
  text: 'text-emerald-700',
}

describe('SlideRenderer', () => {
  it('renders roadmap slides as pure content without iframe', () => {
    const slide: CourseSlide = {
      id: 'roadmap',
      kind: 'roadmap',
      eyebrow: 'Week 4 · 主线地图',
      title: '从 JSON 一路走到 Express',
      roadmap: [
        {
          label: '01',
          title: 'JSON',
          description: '对象怎么先变成可传输的字符串',
        },
        {
          label: '02',
          title: 'XHR',
          description: '浏览器最早怎么发异步请求',
        },
      ],
    }

    render(<SlideRenderer slide={slide} accent={accent} />)

    expect(screen.getByText('从 JSON 一路走到 Express')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()
    expect(screen.getByText('浏览器最早怎么发异步请求')).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('renders cards slides as a pure slide overview without iframe', () => {
    const slide: CourseSlide = {
      id: 'cards',
      kind: 'cards',
      eyebrow: '本周目录',
      title: '6 个知识点总览',
      cards: [
        {
          eyebrow: '知识点 01',
          title: 'JSON',
          description: '对象怎么变成字符串',
          meta: '对应：数据交换格式与 JSON',
        },
        {
          eyebrow: '知识点 02',
          title: 'fetch',
          description: '现代请求 API 怎么拿响应',
          meta: '对应：fetch 与 Response',
        },
        {
          eyebrow: '知识点 03',
          title: 'Promise',
          description: '异步结果如何串起来',
          meta: '对应：Promise 链式处理',
        },
        {
          eyebrow: '知识点 04',
          title: 'async / await',
          description: '把异步流程写得更像同步代码',
          meta: '对应：语法糖与错误处理',
        },
        {
          eyebrow: '知识点 05',
          title: 'HTTP',
          description: '请求与响应为什么会有状态码',
          meta: '对应：request / response',
        },
        {
          eyebrow: '知识点 06',
          title: 'Express',
          description: '服务端如何定义接口',
          meta: '对应：route / handler',
        },
      ],
    }

    const { container } = render(<SlideRenderer slide={slide} accent={accent} />)

    expect(screen.getByText('6 个知识点总览')).toBeInTheDocument()
    expect(screen.getByText('对应：数据交换格式与 JSON')).toBeInTheDocument()
    expect(screen.getByText('现代请求 API 怎么拿响应')).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()

    const cards = Array.from(container.querySelectorAll('article'))
    expect(cards).toHaveLength(6)
    cards.forEach((card) => {
      expect(card).toHaveClass('lg:col-span-2')
    })
  })

    it('renders real knowledge content instead of a placeholder skeleton', () => {
      const slide: CourseSlide = {
        id: 'content',
        kind: 'content',
        eyebrow: '知识点 01 · 1.1',
        title: '为什么需要数据交换格式',
        subtitle: '两套内存模型互不认识，所以需要一个中间格式。',
        bullets: [
          { title: '数据世界', text: '一种极简的标记语言。' },
          { title: '关键动作', text: '先序列化成纯文本才能传输。' },
        ],
        note: {
          tone: 'rule',
          label: '一句话',
          text: '把结构化数据变成可以传输的字符串。',
        },
      }

      render(<SlideRenderer slide={slide} accent={accent} />)

      expect(screen.getByText('数据世界')).toBeInTheDocument()
      expect(screen.getByText('先序列化成纯文本才能传输。')).toBeInTheDocument()
      expect(
        screen.getByText('把结构化数据变成可以传输的字符串。'),
      ).toBeInTheDocument()
      expect(screen.queryByText(/内容占位/)).not.toBeInTheDocument()
    })

  it('renders flow-style content slides with arrows and no iframe', () => {
    const slide: CourseSlide = {
      id: 'flow',
      kind: 'content',
      eyebrow: '知识点 02 · 2.1',
      title: '一次请求-响应循环',
      flow: [
        {
          label: '01',
          title: '浏览器发起请求',
          description: '把 URL 与参数发出去。',
          meta: 'request',
        },
        {
          label: '02',
          title: '服务器处理',
          description: '执行业务逻辑并准备响应。',
          meta: 'response',
        },
      ],
      note: {
        tone: 'rule',
        label: '一句话',
        text: '前端负责发请求，服务器负责回响应。',
      },
    }

    render(<SlideRenderer slide={slide} accent={accent} />)

    expect(screen.getByTestId('slide-flow')).toBeInTheDocument()
    expect(screen.getAllByTestId('slide-flow-step')).toHaveLength(2)
    expect(screen.getByText('浏览器发起请求')).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
  })

    it('renders codes slides with every code block and no iframe', () => {
      const slide: CourseSlide = {
        id: 'codes',
        kind: 'codes',
        title: '同一份数据，三种写法',
        codes: [
          { language: 'json', filename: 'locations.json', source: '{"a":1}' },
          { language: 'yaml', filename: 'locations.yaml', source: 'a: 1' },
          { language: 'xml', filename: 'locations.xml', source: '<a>1</a>' },
        ],
      }

      render(<SlideRenderer slide={slide} accent={accent} />)

      expect(screen.getByText('locations.json')).toBeInTheDocument()
      expect(screen.getByText('locations.yaml')).toBeInTheDocument()
      expect(screen.getByText('locations.xml')).toBeInTheDocument()
      expect(document.querySelector('iframe')).toBeNull()
    })

    it('renders compare slides with real code on both sides', () => {
      const slide: CourseSlide = {
        id: 'compare',
        kind: 'compare',
        title: 'JSON 不等于 JS 对象字面量',
        compare: {
          leftTitle: '✗ 合法 JS',
          rightTitle: '✓ 合法 JSON',
          left: { code: { language: 'js', source: "const bad = { name: 'Bob' }" } },
          right: { code: { language: 'json', source: '{ "name": "Bob" }' } },
        },
      }

      render(<SlideRenderer slide={slide} accent={accent} />)

      expect(screen.getByText('✗ 合法 JS')).toBeInTheDocument()
      expect(
        screen.getByText((_, element) =>
          element?.tagName === 'CODE' &&
          element.textContent?.includes('const bad')
            ? true
            : false,
        ),
      ).toBeInTheDocument()
      expect(screen.queryByText(/反例占位/)).not.toBeInTheDocument()
    })
  })
