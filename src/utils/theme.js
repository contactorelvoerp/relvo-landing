const THEME_KEY = 'relvo-theme'

const computeByHour = () => {
  const h = new Date().getHours()
  return h >= 19 || h < 7 ? 'dark' : 'light'
}

export const getStoredTheme = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return null
}

export const computeTheme = () => {
  if (typeof window === 'undefined') return 'dark'
  const stored = getStoredTheme()
  if (stored) return stored
  return computeByHour()
}

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return
  const isDark = theme === 'dark'
  document.body.classList.toggle('dark', isDark)
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
}

export const persistTheme = (theme) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_KEY, theme)
}

export const toggleThemeValue = (theme) => (theme === 'dark' ? 'light' : 'dark')

export { THEME_KEY }

