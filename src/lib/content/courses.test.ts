import { describe, expect, it } from 'vitest'

import { getCourseLesson } from './courses'

describe('course week 1 rollout', () => {
  it('uses a structured overview and a flow-first git lesson', () => {
    const overview = getCourseLesson('week-1', 'overview')
    const git = getCourseLesson('week-1', 'course-overview-git')

    expect(overview).not.toBeNull()
    expect(overview?.lesson.status).toBe('ready')
    expect(overview?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])

    expect(git).not.toBeNull()
    expect(git?.lesson.status).toBe('ready')
    expect(git?.lesson.slides.some((slide) => slide.flow?.length)).toBe(true)
    expect(git?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(false)
  })

  it('uses code -> demo rhythm for html structure and links lessons', () => {
    const structure = getCourseLesson('week-1', 'structure')
    const links = getCourseLesson('week-1', 'links-images')

    const structureDemo = structure?.lesson.slides.find((slide) => slide.kind === 'demo')
    const linksDemo = links?.lesson.slides.find((slide) => slide.kind === 'demo')

    expect(structure?.lesson.status).toBe('ready')
    expect(structureDemo?.demo?.route).toBe('/demos/week-1/html/document-skeleton')
    expect(structureDemo?.demo?.ctaLabel).toContain('打开实验')

    expect(links?.lesson.status).toBe('ready')
    expect(linksDemo?.demo?.route).toBe('/demos/week-1/html/paths-and-images')
    expect(linksDemo?.demo?.objectives?.length).toBeGreaterThanOrEqual(2)
  })
})

describe('course week 2 rollout', () => {
  it('uses a structured overview and keeps grid/frameworks as slide-first content', () => {
    const overview = getCourseLesson('week-2', 'overview')
    const grid = getCourseLesson('week-2', 'grid-frameworks')

    expect(overview).not.toBeNull()
    expect(overview?.lesson.status).toBe('ready')
    expect(overview?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])

    expect(grid?.lesson.status).toBe('ready')
    expect(grid?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(false)
    expect(grid?.lesson.slides.some((slide) => slide.kind === 'compare')).toBe(true)
  })

  it('uses demo entries for cascade, box model, flex, positioning and responsive lessons', () => {
    const flex = getCourseLesson('week-2', 'flexbox')
    const responsive = getCourseLesson('week-2', 'responsive-viewport')

    const flexDemo = flex?.lesson.slides.find((slide) => slide.kind === 'demo')
    const responsiveDemo = responsive?.lesson.slides.find((slide) => slide.kind === 'demo')

    expect(flex?.lesson.status).toBe('ready')
    expect(flexDemo?.demo?.route).toBe('/demos/week-2/css/flex-alignment')

    expect(responsive?.lesson.status).toBe('ready')
    expect(responsiveDemo?.demo?.route).toBe('/demos/week-2/css/responsive-breakpoints')
    expect(responsiveDemo?.demo?.objectives?.length).toBeGreaterThanOrEqual(2)
  })
})

describe('course week 3 rollout', () => {
  it('uses a structured overview and keeps ecosystem/npm as slide-first content', () => {
    const overview = getCourseLesson('week-3', 'overview')
    const ecosystem = getCourseLesson('week-3', 'ecosystem-npm')

    expect(overview).not.toBeNull()
    expect(overview?.lesson.status).toBe('ready')
    expect(overview?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])

    expect(ecosystem?.lesson.status).toBe('ready')
    expect(ecosystem?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(false)
    expect(ecosystem?.lesson.slides.some((slide) => slide.flow?.length)).toBe(true)
  })

  it('uses demo entries for closures, dom, events, forms and storage lessons', () => {
    const closures = getCourseLesson('week-3', 'functions-closures')
    const storage = getCourseLesson('week-3', 'storage')

    const closureDemo = closures?.lesson.slides.find((slide) => slide.kind === 'demo')
    const storageDemo = storage?.lesson.slides.find((slide) => slide.kind === 'demo')

    expect(closures?.lesson.status).toBe('ready')
    expect(closureDemo?.demo?.route).toBe('/demos/week-3/javascript/closure-snapshot')

    expect(storage?.lesson.status).toBe('ready')
    expect(storageDemo?.demo?.route).toBe('/demos/week-3/javascript/localstorage-notes')
    expect(storageDemo?.demo?.objectives?.length).toBeGreaterThanOrEqual(2)
  })
})

describe('course week 4 overview', () => {
  it('uses four pure slides without a demo iframe slide', () => {
    const result = getCourseLesson('week-4', 'overview')

    expect(result).not.toBeNull()
    const slides = result?.lesson.slides ?? []

    expect(slides).toHaveLength(4)
    expect(slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])
    expect(slides.some((slide) => slide.kind === 'demo')).toBe(false)

    const roadmap = slides.find((slide) => slide.id === 'roadmap')
    expect(roadmap?.roadmap).toHaveLength(6)
    expect(roadmap?.roadmap?.[5]?.title).toBe('HTTP / Express')

    const cards = slides.find((slide) => slide.id === 'cards')
    expect(cards?.cards).toHaveLength(6)
    expect(cards?.cards?.[5]?.title).toBe('HTTP / Express')
  })
})

describe('course week 4 data-interchange lesson', () => {
  it('uses teaching rhythm: concept -> code -> live demo in the right places', () => {
    const result = getCourseLesson('week-4', 'data-interchange')

    expect(result).not.toBeNull()
    const slides = result?.lesson.slides ?? []

    expect(slides.length).toBeGreaterThan(10)
    expect(slides[0].kind).toBe('cover')
    expect(slides[slides.length - 1].kind).toBe('closing')

    // 1.4 和 1.5 仍保留 demo 页，但它们现在应该是实验入口，而不是 iframe 内嵌
    const demoSlides = slides.filter((slide) => slide.kind === 'demo')
    expect(demoSlides).toHaveLength(2)
    expect(demoSlides.map((slide) => slide.id)).toEqual([
      'stringify-parse-demo',
      'localstorage-demo',
    ])
    expect(demoSlides.map((slide) => slide.demo?.route)).toEqual([
      '/demos/week-4/json/stringify-parse',
      '/demos/week-4/json/localstorage',
    ])
    expect(demoSlides.every((slide) => !slide.demo?.src)).toBe(true)
    expect(demoSlides.every((slide) => (slide.demo?.objectives?.length ?? 0) >= 2)).toBe(
      true,
    )
    expect(demoSlides.every((slide) => slide.demo?.ctaLabel?.includes('打开实验'))).toBe(
      true,
    )

    const limitsSlide = slides.find((slide) => slide.id === 'json-limits')
    expect(limitsSlide?.kind).toBe('content')
    expect(limitsSlide?.bullets?.every((bullet) => Boolean(bullet.code))).toBe(
      true,
    )

    const trapSlide = slides.find((slide) => slide.id === 'json-parse-trap')
    expect(trapSlide?.kind).toBe('compare')

    const methodCompareSlide = slides.find(
      (slide) => slide.id === 'stringify-parse-compare',
    )
    expect(methodCompareSlide?.kind).toBe('compare')

    const highlightedCodeSlide = slides.find(
      (slide) => slide.id === 'stringify-parse-code',
    )
    expect(highlightedCodeSlide?.kind).toBe('code')
    expect(highlightedCodeSlide?.code?.highlightLines).toEqual([6, 7, 10, 13, 14])

    expect(
      slides.some((slide) => slide.kind === 'codes' && (slide.codes?.length ?? 0) >= 3),
    ).toBe(true)
  })
})

describe('course week 4 xhr lesson', () => {
  it('uses teaching rhythm: concept -> demo entry in the right places', () => {
    const result = getCourseLesson('week-4', 'xhr')

    expect(result).not.toBeNull()
    const slides = result?.lesson.slides ?? []

    expect(slides.length).toBeGreaterThan(10)
    expect(slides[0].kind).toBe('cover')
    expect(slides[slides.length - 1].kind).toBe('closing')

    // 两个 demo slide 均为实验入口，不再 iframe 内嵌
    const demoSlides = slides.filter((slide) => slide.kind === 'demo')
    expect(demoSlides.map((slide) => slide.id)).toEqual([
      'request-demo',
      'error-paths-demo',
    ])
    expect(demoSlides.map((slide) => slide.demo?.route)).toEqual([
      '/demos/week-4/xhr/request',
      '/demos/week-4/xhr/error-paths',
    ])
    expect(demoSlides.every((slide) => !slide.demo?.src)).toBe(true)
    expect(demoSlides.every((slide) => (slide.demo?.objectives?.length ?? 0) >= 2)).toBe(
      true,
    )
    expect(demoSlides.every((slide) => slide.demo?.ctaLabel?.includes('打开实验'))).toBe(
      true,
    )

    const requestResponseSlide = slides.find((slide) => slide.id === 'request-response')
    expect(requestResponseSlide?.flow?.length).toBeGreaterThanOrEqual(4)

    const xhrWhatSlide = slides.find((slide) => slide.id === 'xhr-what')
    expect(xhrWhatSlide?.flow?.length).toBeGreaterThanOrEqual(5)

    // readyState 与 status 都用表格承载，错误分类用表格 + trap 提示条
    expect(slides.find((slide) => slide.id === 'readystate')?.table).toBeTruthy()
    expect(slides.find((slide) => slide.id === 'status')?.table).toBeTruthy()

    const errorSlide = slides.find((slide) => slide.id === 'error-classes')
    expect(errorSlide?.kind).toBe('content')
    expect(errorSlide?.table).toBeTruthy()
    expect(errorSlide?.note?.tone).toBe('trap')

    const hellSlide = slides.find((slide) => slide.id === 'callback-hell')
    expect(hellSlide?.kind).toBe('compare')
    expect(Boolean(hellSlide?.compare?.left?.code && hellSlide?.compare?.right?.code)).toBe(
      true,
    )
  })
})

describe('course week 4 fetch lesson', () => {
  it('uses teaching rhythm: concept -> trap -> demo entry -> wrapper code', () => {
    const result = getCourseLesson('week-4', 'fetch')

    expect(result).not.toBeNull()
    const slides = result?.lesson.slides ?? []

    expect(slides.length).toBeGreaterThan(9)
    expect(slides[0].kind).toBe('cover')
    expect(slides[slides.length - 1].kind).toBe('closing')

    const demoSlides = slides.filter((slide) => slide.kind === 'demo')
    expect(demoSlides.map((slide) => slide.id)).toEqual([
      'response-demo',
      'post-body-demo',
    ])
    expect(demoSlides.map((slide) => slide.demo?.route)).toEqual([
      '/demos/week-4/fetch/response-inspector',
      '/demos/week-4/fetch/post-and-body',
    ])
    expect(demoSlides.every((slide) => !slide.demo?.src)).toBe(true)
    expect(demoSlides.every((slide) => (slide.demo?.objectives?.length ?? 0) >= 3)).toBe(
      true,
    )

    const responseFlow = slides.find((slide) => slide.id === 'response-flow')
    expect(responseFlow?.flow?.length).toBeGreaterThanOrEqual(4)

    const rejectRules = slides.find((slide) => slide.id === 'reject-rules')
    expect(rejectRules?.kind).toBe('content')
    expect(rejectRules?.table).toBeTruthy()
    expect(rejectRules?.note?.tone).toBe('trap')

    const wrapperSlide = slides.find((slide) => slide.id === 'robust-wrapper')
    expect(wrapperSlide?.kind).toBe('code')
    expect(wrapperSlide?.code?.highlightLines).toEqual([6, 8, 9, 12, 14])

    const compareSlide = slides.find((slide) => slide.id === 'why-fetch')
    expect(compareSlide?.kind).toBe('compare')
  })
})

describe('course week 4 promise lesson', () => {
  it('uses teaching rhythm: state machine -> demo entry -> combinators -> wrapper code', () => {
    const result = getCourseLesson('week-4', 'promise')

    expect(result).not.toBeNull()
    const slides = result?.lesson.slides ?? []

    expect(slides.length).toBeGreaterThan(9)
    expect(slides[0].kind).toBe('cover')
    expect(slides[slides.length - 1].kind).toBe('closing')

    const demoSlides = slides.filter((slide) => slide.kind === 'demo')
    expect(demoSlides.map((slide) => slide.id)).toEqual([
      'state-demo',
      'combinators-demo',
    ])
    expect(demoSlides.map((slide) => slide.demo?.route)).toEqual([
      '/demos/week-4/promise/state-and-chain',
      '/demos/week-4/promise/combinators-and-errors',
    ])
    expect(demoSlides.every((slide) => !slide.demo?.src)).toBe(true)
    expect(demoSlides.every((slide) => (slide.demo?.objectives?.length ?? 0) >= 3)).toBe(
      true,
    )

    const stateMachine = slides.find((slide) => slide.id === 'state-machine')
    expect(stateMachine?.flow?.length).toBeGreaterThanOrEqual(4)
    expect(stateMachine?.note?.tone).toBe('trap')

    const methods = slides.find((slide) => slide.id === 'methods')
    expect(methods?.bullets?.every((bullet) => Boolean(bullet.code))).toBe(true)

    const chainBranch = slides.find((slide) => slide.id === 'chain-branch')
    expect(chainBranch?.kind).toBe('compare')

    const errorRules = slides.find((slide) => slide.id === 'error-rules')
    expect(errorRules?.table).toBeTruthy()
    expect(errorRules?.note?.tone).toBe('trap')

    const wrapperSlide = slides.find((slide) => slide.id === 'wrapper-code')
    expect(wrapperSlide?.kind).toBe('code')
    expect(wrapperSlide?.code?.highlightLines).toEqual([2, 3, 6, 9, 10, 11])
  })
})

describe('course week 4 async-await lesson', () => {
  it('uses teaching rhythm: rules -> demo entry -> pitfalls -> wrapper code', () => {
    const result = getCourseLesson('week-4', 'async-await')

    expect(result).not.toBeNull()
    const slides = result?.lesson.slides ?? []

    expect(slides.length).toBeGreaterThan(9)
    expect(slides[0].kind).toBe('cover')
    expect(slides[slides.length - 1].kind).toBe('closing')

    const demoSlides = slides.filter((slide) => slide.kind === 'demo')
    expect(demoSlides.map((slide) => slide.id)).toEqual([
      'serial-parallel-demo',
      'errors-demo',
    ])
    expect(demoSlides.map((slide) => slide.demo?.route)).toEqual([
      '/demos/week-4/async-await/serial-vs-parallel',
      '/demos/week-4/async-await/errors-and-pitfalls',
    ])
    expect(demoSlides.every((slide) => !slide.demo?.src)).toBe(true)
    expect(demoSlides.every((slide) => (slide.demo?.objectives?.length ?? 0) >= 3)).toBe(
      true,
    )

    const rulesSlide = slides.find((slide) => slide.id === 'async-rules')
    expect(rulesSlide?.flow?.length).toBeGreaterThanOrEqual(4)
    expect(rulesSlide?.note?.tone).toBe('rule')

    const awaitModel = slides.find((slide) => slide.id === 'await-model')
    expect(awaitModel?.table).toBeTruthy()

    const pitfalls = slides.find((slide) => slide.id === 'pitfalls')
    expect(pitfalls?.bullets?.every((bullet) => Boolean(bullet.code))).toBe(true)
    expect(pitfalls?.note?.tone).toBe('trap')

    const compareSlide = slides.find((slide) => slide.id === 'three-styles')
    expect(compareSlide?.kind).toBe('compare')

    const wrapperSlide = slides.find((slide) => slide.id === 'wrapper-code')
    expect(wrapperSlide?.kind).toBe('code')
    expect(wrapperSlide?.code?.highlightLines).toEqual([4, 5, 8, 9, 12, 13, 16])
  })
})

describe('course week 4 http-server lesson', () => {
  it('uses teaching rhythm: protocol basics -> demo entry -> express code -> restful mapping', () => {
    const result = getCourseLesson('week-4', 'http-server')

    expect(result).not.toBeNull()
    const slides = result?.lesson.slides ?? []

    expect(slides.length).toBeGreaterThan(9)
    expect(slides[0].kind).toBe('cover')
    expect(slides[slides.length - 1].kind).toBe('closing')

    const demoSlides = slides.filter((slide) => slide.kind === 'demo')
    expect(demoSlides.map((slide) => slide.id)).toEqual([
      'http-demo',
      'express-demo',
    ])
    expect(demoSlides.map((slide) => slide.demo?.route)).toEqual([
      '/demos/week-4/http-server/request-response',
      '/demos/week-4/http-server/express-routing',
    ])
    expect(demoSlides.every((slide) => !slide.demo?.src)).toBe(true)
    expect(demoSlides.every((slide) => (slide.demo?.objectives?.length ?? 0) >= 3)).toBe(
      true,
    )

    const layersSlide = slides.find((slide) => slide.id === 'layers')
    expect(layersSlide?.table).toBeTruthy()
    expect(layersSlide?.note?.tone).toBe('rule')

    const flowSlide = slides.find((slide) => slide.id === 'request-response-flow')
    expect(flowSlide?.flow?.length).toBeGreaterThanOrEqual(4)

    const compareSlide = slides.find((slide) => slide.id === 'node-vs-express')
    expect(compareSlide?.kind).toBe('compare')

    const codeSlide = slides.find((slide) => slide.id === 'express-minimal')
    expect(codeSlide?.kind).toBe('code')
    expect(codeSlide?.code?.highlightLines).toEqual([3, 4, 6, 7, 10, 11, 14])

    const restfulSlide = slides.find((slide) => slide.id === 'restful-crud')
    expect(restfulSlide?.table).toBeTruthy()

    const statusSlide = slides.find((slide) => slide.id === 'status-summary')
    expect(statusSlide?.note?.tone).toBe('trap')
  })
})
