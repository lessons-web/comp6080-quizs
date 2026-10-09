import { useCallback, useMemo, useState } from 'react'

function handleStorageError(e: unknown): void {
  const expected =
    e instanceof DOMException &&
    (e.name === 'SecurityError' || e.name === 'QuotaExceededError' || e.name === 'NotFoundError')
  if (process.env.NODE_ENV !== 'production' && !expected) {
    console.warn('[useLocalStoragePref] unexpected error', e)
  }
}

export function useLocalStoragePref<T extends string>(
  key: string,
  defaultValue: T,
  validator?: (value: T) => boolean,
): [T, (next: T) => void] {
  const read = (): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) {
        window.localStorage.setItem(key, defaultValue)
        return defaultValue
      }
      const value = raw as T
      if (validator && !validator(value)) {
        window.localStorage.setItem(key, defaultValue)
        return defaultValue
      }
      return value
    } catch (e) {
      handleStorageError(e)
      return defaultValue
    }
  }
  const [value, setValue] = useState<T>(read)
  const write = useCallback((value: T): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, value)
    } catch (e) {
      handleStorageError(e)
    }
  }, [key])
  const setPref = useCallback((next: T) => {
    setValue(next)
    write(next)
  }, [write])
  return useMemo<[T, (next: T) => void]>(() => [value, setPref], [value, setPref])
}
