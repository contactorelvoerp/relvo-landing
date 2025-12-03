export const BackgroundLayers = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg"></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] ambient-glow rounded-full mix-blend-screen translate-y-[-50%]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] ambient-glow rounded-full mix-blend-screen translate-y-[30%] opacity-50"></div>
    </div>
  )
}

