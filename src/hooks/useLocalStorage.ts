import { useState } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStored = (val: T) => {
    setValue(val)
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      // Storage may be unavailable (private mode, quota exceeded)
    }
  }

  return [value, setStored]
}
