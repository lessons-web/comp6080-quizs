import { useEffect, useState } from 'react'

export type AsyncContentState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useAsyncContent<T>(
  fetcher: () => Promise<T | null>,
  deps: unknown[],
): AsyncContentState<T> {
  const [state, setState] = useState<AsyncContentState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let alive = true
    setState((prev) => ({ ...prev, loading: true, error: null }))

    const run = async () => {
      try {
        const value = await fetcher()
        if (!alive) return
        setState({ data: value, loading: false, error: null })
      } catch (err) {
        if (!alive) return
        setState((prev) => ({
          data: prev.data,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        }))
      }
    }

    void run()

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
