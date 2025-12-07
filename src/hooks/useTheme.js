import { useState, useEffect } from 'react'

const THEME_KEY = 'relvo-theme'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return true // fallback dark

  // Manual preference wins
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false

  // Default by hour: night (19-6) => dark, else light
  const hour = new Date().getHours()
  return hour >= 19 || hour < 7
}

export const useTheme = () => {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark')
      localStorage.setItem(THEME_KEY, 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem(THEME_KEY, 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return { isDark, toggleTheme }
}

