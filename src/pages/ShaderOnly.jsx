/**
 * ShaderOnly — minimal peaceful preview of the RelvoGradient.
 *
 * No landing UI, no text, no figures. Full-viewport shader with live
 * animation. URL params expose the tunable knobs so visual iteration
 * happens by reloading with different values rather than editing code.
 *
 * Params (all optional):
 *   ?speed=0.65      animation speed (0 = static)
 *   ?intensity=0.58  u_intensity — grain contribution to shape (try 0.3 - 1.0)
 *   ?noise=0.008     u_noise — extra noise amount (try 0.005 - 0.05)
 *   ?softness=0.35   u_softness — blob edge softness
 *   ?blobs=14        u_blobCount (0..14)
 *   ?size=0.80       u_blobSize
 *   ?stretchY=1.0    u_blobStretchY
 */
import { ShaderMount } from '@paper-design/shaders-react'
import {
  getShaderColorFromString,
  getShaderNoiseTexture,
  ShaderFitOptions,
} from '@paper-design/shaders'
import { useMemo } from 'react'
import { relvoGradientFragmentShader } from '../shaders/relvo-gradient.js'

const noiseTexture = getShaderNoiseTexture()
const COLORS = ['#DFF4EB', '#D5F7C1', '#E3C0F2', '#3F28B2']

export function ShaderOnly() {
  const params = new URLSearchParams(window.location.search)
  const speed = parseFloat(params.get('speed') ?? '0.65')
  const intensity = parseFloat(params.get('intensity') ?? '0.58')
  const noise = parseFloat(params.get('noise') ?? '0.008')
  const softness = parseFloat(params.get('softness') ?? '0.35')
  const blobCount = parseFloat(params.get('blobs') ?? '14')
  const blobSize = parseFloat(params.get('size') ?? '0.80')
  const blobStretchY = parseFloat(params.get('stretchY') ?? '1.0')

  const uniforms = useMemo(() => ({
    u_colorBack: getShaderColorFromString('#FFFFFF'),
    u_colors: COLORS.map(getShaderColorFromString),
    u_colorsCount: COLORS.length,
    u_softness: softness,
    u_intensity: intensity,
    u_noise: noise,
    u_blobCount: blobCount,
    u_blobSize: blobSize,
    u_blobScale: 1.0,
    u_blobStretchY: blobStretchY,
    u_noiseTexture: noiseTexture,
    u_fit: ShaderFitOptions['contain'],
    u_scale: 1,
    u_rotation: -180,
    u_offsetX: 0,
    u_offsetY: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  }), [softness, intensity, noise, blobCount, blobSize, blobStretchY])

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
        maxPixelCount={2560 * 1440 * 2}
        minPixelRatio={2}
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
        }}
      >
        speed={speed} intensity={intensity} noise={noise} blobs={blobCount} size={blobSize}
      </div>
    </div>
  )
}
