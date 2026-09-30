import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useLocalStoragePref } from './useLocalStoragePref'

const KEY = 'comp6080:test:pref-columns'

beforeEach(() => { window.localStorage.clear() })
afterEach(() => { vi.restoreAllMocks() })

describe('useLocalStoragePref', () => {
  it('returns defaultValue when key is missing', () => {
    const { result } = renderHook(() => useLocalStoragePref<'1' | '2' | '3'>(KEY, '2'))
    expect(result.current[0]).toBe('2')
    expect(window.localStorage.getItem(KEY)).toBe('2')
  })
  it('reads existing valid value on mount', () => {
    window.localStorage.setItem(KEY, '3')
    const { result } = renderHook(() => useLocalStoragePref<'1' | '2' | '3'>(KEY, '2'))
    expect(result.current[0]).toBe('3')
  })
  it('falls back to defaultValue when stored value is invalid (accepts a validator)', () => {
    window.localStorage.setItem(KEY, '99')
    const { result } = renderHook(() =>
      useLocalStoragePref<'1' | '2' | '3'>(KEY, '2', (v) => ['1','2','3'].includes(v)),
    )
    expect(result.current[0]).toBe('2')
    expect(window.localStorage.getItem(KEY)).toBe('2')
  })
  it('setter writes to localStorage and updates state', () => {
    const { result } = renderHook(() => useLocalStoragePref<'1' | '2' | '3'>(KEY, '2'))
    act(() => { result.current[1]('1') })
    expect(result.current[0]).toBe('1')
    expect(window.localStorage.getItem(KEY)).toBe('1')
  })
  it('gracefully degrades when localStorage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('SecurityError') })
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('SecurityError') })
    const { result } = renderHook(() => useLocalStoragePref<'1' | '2' | '3'>(KEY, '2'))
    expect(result.current[0]).toBe('2')
    act(() => { result.current[1]('3') })
    expect(result.current[0]).toBe('3')
    getItem.mockRestore(); setItem.mockRestore()
  })
})
