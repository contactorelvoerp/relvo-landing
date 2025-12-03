import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true) // Default dark mode

  useEffect(() => {
    // Apply theme class to body
    if (isDark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return { isDark, toggleTheme }
}

