/**
 * ShaderOnly — minimal peaceful preview of the RelvoGradient.
 *
 * No landing UI, no text, no figures. Full-viewport shader with live
 * animation. Use this route to iterate on the shader look.
 *
 *                    ╔═══════════════════════════╗
 *                    ║  EDIT THE KNOBS BELOW     ║
 *                    ║  Save → Vite HMR reloads  ║
 *                    ║  No URL params needed     ║
 *                    ╚═══════════════════════════╝
 *
 * Values also overridable via URL params (e.g. ?noise=0.02) so you can
 * compare variants side-by-side in two tabs without editing.
 */
import { ShaderMount } from '@paper-design/shaders-react'
import {
  getShaderColorFromString,
  getShaderNoiseTexture,
  ShaderFitOptions,
} from '@paper-design/shaders'
import { useMemo } from 'react'
import { relvoGradientFragmentShader } from '../shaders/relvo-gradient.js'

// ═══════════════════════════════════════════════════════════════════════
//  SHADER KNOBS — edit these, save, see result instantly via Vite HMR
// ═══════════════════════════════════════════════════════════════════════

const KNOBS = {
  // Motion
  speed:        0.65,   // animation speed (0 = frozen). prod = 0.65
  rotation:    -180,    // degrees

  // Grain (the two levers for "sparkly / alive" feel)
  intensity:    0.6,   // u_intensity — grain modulates shape. usable 0.30–0.68, >0.70 washes out
  noise:        0.060,  // u_noise     — noise overlay.         usable 0.000–0.030, >0.040 washes out

  // Blob shape
  blobCount:   14,      // 0..14
  blobSize:     0.80,   // fraction of viewport width
  blobScale:    1.0,    // multiplier on size AND drift — larger = more dramatic motion
  blobStretchY: 1.0,    // 1.0 = circular, <1.0 = squashed vertically
  softness:     0.35,   // blob edge softness / color-transition softness

  // Colors — change palette here
  colorBack:  '#FFFFFF',
  colors: ['#DFF4EB', '#D5F7C1', '#E3C0F2', '#3F28B2'],
}

// ═══════════════════════════════════════════════════════════════════════

const noiseTexture = getShaderNoiseTexture()

export function ShaderOnly() {
  // URL params override KNOBS for quick A/B in two tabs without editing
  const params = new URLSearchParams(window.location.search)
  const pick = (name, fallback) => {
    const v = params.get(name)
    return v !== null ? parseFloat(v) : fallback
  }

  const speed        = pick('speed',     KNOBS.speed)
  const intensity    = pick('intensity', KNOBS.intensity)
  const noise        = pick('noise',     KNOBS.noise)
  const softness     = pick('softness',  KNOBS.softness)
  const blobCount    = pick('blobs',     KNOBS.blobCount)
  const blobSize     = pick('size',      KNOBS.blobSize)
  const blobScale    = pick('scale',     KNOBS.blobScale)
  const blobStretchY = pick('stretchY',  KNOBS.blobStretchY)

  const uniforms = useMemo(() => ({
    u_colorBack: getShaderColorFromString(KNOBS.colorBack),
    u_colors: KNOBS.colors.map(getShaderColorFromString),
    u_colorsCount: KNOBS.colors.length,
    u_softness: softness,
    u_intensity: intensity,
    u_noise: noise,
    u_blobCount: blobCount,
    u_blobSize: blobSize,
    u_blobScale: blobScale,
    u_blobStretchY: blobStretchY,
    u_noiseTexture: noiseTexture,
    u_fit: ShaderFitOptions['contain'],
    u_scale: 1,
    u_rotation: KNOBS.rotation,
    u_offsetX: 0,
    u_offsetY: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  }), [softness, intensity, noise, blobCount, blobSize, blobScale, blobStretchY])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <ShaderMount
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        speed={speed}
        fragmentShader={relvoGradientFragmentShader}
        uniforms={uniforms}
        maxPixelCount={2240 * 1260}
        minPixelRatio={1}
      />
      <div
        style={{
          position: 'fixed',
          left: 12,
          bottom: 12,
          padding: '6px 10px',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 11,
          color: '#000a',
          background: '#fff8',
          borderRadius: 4,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'pre',
        }}
      >
        {`speed=${speed}  intensity=${intensity}  noise=${noise}  softness=${softness}\nblobs=${blobCount}  size=${blobSize}  scale=${blobScale}  stretchY=${blobStretchY}`}
      </div>
    </div>
  )
}
