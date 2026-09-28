// ============================================================
// useLocalStorage — custom hook that syncs React state with localStorage
// Works just like useState, but also persists the value across page refreshes
// ============================================================

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialise state from localStorage (if available) or fall back to initialValue
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      // If we found something stored, parse it; otherwise use the initial value
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      // If JSON parsing fails, just use the initial value
      return initialValue;
    }
  });

  // Whenever the value changes, write it to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if localStorage is full or unavailable
    }
  }, [key, value]);

  return [value, setValue];
}