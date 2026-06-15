// ============================================
// Portfolio OS 2026 — useDebounce Hook
// ============================================
// Debounces a value by the specified delay.
// Used in search inputs to avoid firing queries on every keystroke.

import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the input value.
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms)
 * @returns {*} The debounced value
 *
 * Usage:
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 300);
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
