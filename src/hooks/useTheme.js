import { useState, useEffect } from 'react'

const THEME_KEY = 'relvo-theme'

const getLocalHour = () => {
  // Use browser timezone explicitly to avoid UTC drift
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = tz
    ? new Date(new Date().toLocaleString('en-US', { timeZone: tz }))
    : new Date()
  return now.getHours()
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') return true // fallback dark

  // Manual preference wins
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false

  // OS preference next
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  if (prefersDark) return true
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return false

  // Default by local hour: night (19-6) => dark, else light
  const hour = getLocalHour()
  return hour >= 19 || hour < 7
}

export const useTheme = () => {
  const [isDark, setIsDark] = useState(getInitialTheme)

  const applyTheme = (dark) => {
    const body = document.body
    body.classList.toggle('dark', dark)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }

  // Apply on mount to avoid mismatch between UI and DOM
  useEffect(() => {
    applyTheme(isDark)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyTheme(isDark)
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return { isDark, toggleTheme }
}

