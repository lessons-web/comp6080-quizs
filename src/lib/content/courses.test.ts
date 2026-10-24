import { describe, expect, it } from 'vitest'

import { getCourseLesson } from './courses'

describe('course week 4 overview', () => {
  it('uses four pure slides without a demo iframe slide', () => {
    const result = getCourseLesson('week-4', 'overview')

    expect(result).not.toBeNull()
    expect(result?.lesson.slides).toHaveLength(4)
    expect(result?.lesson.slides.map((slide) => slide.kind)).toEqual([
      'cover',
      'roadmap',
      'cards',
      'closing',
    ])
    expect(result?.lesson.slides.some((slide) => slide.kind === 'demo')).toBe(
      false,
    )
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
