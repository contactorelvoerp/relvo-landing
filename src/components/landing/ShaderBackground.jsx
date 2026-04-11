import { GrainGradient } from '@paper-design/shaders-react'

/**
 * Full-page animated grain gradient background.
 * The shader fills 100% viewport width (edge-to-edge on any screen).
 * Decorative hypotrochoid figures are positioned relative to the viewport.
 */
export const ShaderBackground = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden ${className}`}
      style={{ height: '100%' }}
    >
      {/* Shader — always full viewport width */}
      <GrainGradient
        speed={0.85}
        scale={1}
        rotation={-180}
        offsetX={0}
        offsetY={0}
        softness={0.35}
        intensity={0.58}
        noise={0.17}
        shape="corners"
        colors={['#DFF4EB', '#D5F7C1', '#E3C0F2', '#3F28B2']}
        colorBack="#00000000"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
        }}
      />

      {/* Hypotrochoid figure — top left */}
      <img
        src="/figures/Asset 5.svg"
        alt=""
        aria-hidden="true"
        className="absolute opacity-30"
        style={{
          top: '-8%',
          left: '-5%',
          width: 'clamp(400px, 50vw, 800px)',
          height: 'auto',
        }}
      />

      {/* Hypotrochoid figure — bottom right */}
      <img
        src="/figures/Asset 7.svg"
        alt=""
        aria-hidden="true"
        className="absolute opacity-25"
        style={{
          bottom: '5%',
          right: '-3%',
          width: 'clamp(300px, 35vw, 550px)',
          height: 'auto',
        }}
      />
    </div>
  )
}
