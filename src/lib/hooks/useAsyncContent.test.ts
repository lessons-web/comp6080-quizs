import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAsyncContent } from './useAsyncContent'

describe('useAsyncContent', () => {
  it('emits loading then data on success', async () => {
    const fetcher = vi.fn(async () => 'hello')
    const { result } = renderHook(() => useAsyncContent(fetcher, []))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe('hello')
    expect(result.current.error).toBeNull()
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('captures rejection as error state', async () => {
    const boom = new Error('network')
    const fetcher = vi.fn(async () => { throw boom })
    const { result } = renderHook(() => useAsyncContent(fetcher, []))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe(boom)
    expect(result.current.data).toBeNull()
  })

  it('refetches when dep value changes', async () => {
    const fetcher = vi.fn(async (n: number) => n * 2)
    const { result, rerender } = renderHook(
      ({ n }: { n: number }) => useAsyncContent(() => fetcher(n), [n]),
      { initialProps: { n: 1 } },
    )
    await waitFor(() => expect(result.current.data).toBe(2))
    expect(fetcher).toHaveBeenCalledTimes(1)
    rerender({ n: 3 })
    await waitFor(() => expect(result.current.data).toBe(6))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
