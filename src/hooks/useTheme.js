import { useState, useEffect } from 'react'
import { computeTheme, applyTheme, persistTheme, toggleThemeValue } from '../utils/theme'

export const useTheme = () => {
  const [theme, setTheme] = useState(() => computeTheme())

  useEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => toggleThemeValue(prev))

  return { isDark: theme === 'dark', toggleTheme }
}

