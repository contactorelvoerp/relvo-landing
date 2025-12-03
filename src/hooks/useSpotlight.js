import { useEffect, useState } from 'react'

export const useSpotlight = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isActive) {
        setIsActive(true)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isActive])

  return { mousePosition, isActive }
}

