import { useCallback, useEffect, useState } from 'react'

export function useLocalStoragePref<T extends string>(
  key: string, defaultValue: T, validator?: (value: T) => boolean,
): [T, (next: T) => void] {
  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return defaultValue
      const value = raw as T
      if (validator && !validator(value)) return defaultValue
      return value
    } catch { return defaultValue }
  }
  const write = (value: T): void => {
    try { window.localStorage.setItem(key, value) } catch { /* ignore */ }
  }
  const [value, setValue] = useState<T>(read)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null || (validator && !validator(raw as T))) { write(value) }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const setPref = useCallback((next: T) => { setValue(next); write(next) },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key])
  return [value, setPref]
}
