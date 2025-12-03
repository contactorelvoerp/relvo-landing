import { useSpotlight } from '../hooks/useSpotlight'

export const Spotlight = () => {
  const { mousePosition, isActive } = useSpotlight()

  return (
    <div
      id="spotlight"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-500"
      style={{
        opacity: isActive ? 1 : 0,
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--cursor-spotlight), transparent 40%)`
      }}
    />
  )
}

