import { useEffect } from 'react'

const loginUrl = 'https://app.relvoerp.com/login'

export const LoginRedirect = () => {
  useEffect(() => {
    window.location.replace(loginUrl)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-sm text-[var(--text-muted)]">
      Redirecting to login...
    </div>
  )
}
