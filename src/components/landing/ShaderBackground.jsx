import { RelvoGradient } from '../../shaders/RelvoGradient'

/**
 * Full-page animated grain gradient background.
 *
 * Uses our forked shader with configurable blob count — blobs distribute
 * evenly across the canvas at any aspect ratio, no stretching.
 */
export const ShaderBackground = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden ${className}`}
      style={{ height: '100%' }}
    >
      <RelvoGradient
        speed={0.4}
        scale={1}
        rotation={-180}
        offsetX={0}
        offsetY={0}
        softness={0.35}
        intensity={0.58}
        noise={0.008}
        blobCount={6}
        blobSize={0.80}
        blobScale={1.0}
        colors={['#DFF4EB', '#D5F7C1', '#E3C0F2', '#3F28B2']}
        colorBack="#00000000"
        maxPixelCount={2560 * 1440 * 2}
        minPixelRatio={2}
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
