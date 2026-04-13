/**
 * LinkedInBanner — 1584×396 banner using the Relvo grain gradient.
 *
 * Palette and blob config tuned to be LESS white-heavy than the landing,
 * since LinkedIn's own background is already white. We drop the pale mint
 * and let the saturated colors dominate.
 *
 * Screenshot at exactly 1584×396 (LinkedIn's required size). The page
 * renders a centered banner-sized box; take the screenshot of that box.
 * You can also pass ?full=1 to make it fill the viewport for previewing.
 */
import { ShaderMount } from '@paper-design/shaders-react'
import {
  getShaderColorFromString,
  getShaderNoiseTexture,
  ShaderFitOptions,
} from '@paper-design/shaders'
import { useMemo } from 'react'
import { relvoGradientFragmentShader } from '../shaders/relvo-gradient.js'

const KNOBS = {
  speed:        0.65,
  rotation:    -180,
  intensity:    0.6,
  noise:        0.060,
  blobCount:   14,
  blobSize:     0.55,
  blobScale:    1.0,
  blobStretchY: 1.0,
  softness:     0.35,
  colorBack:  '#3F28B2',
  colors: ['#D5F7C1', '#E3C0F2', '#7B5BD9', '#3F28B2'],
}

const noiseTexture = getShaderNoiseTexture()

export function LinkedInBanner() {
  const params = new URLSearchParams(window.location.search)
  const full = params.get('full') === '1'

  const uniforms = useMemo(() => ({
    u_colorBack: getShaderColorFromString(KNOBS.colorBack),
    u_colors: KNOBS.colors.map(getShaderColorFromString),
    u_colorsCount: KNOBS.colors.length,
    u_softness: KNOBS.softness,
    u_intensity: KNOBS.intensity,
    u_noise: KNOBS.noise,
    u_blobCount: KNOBS.blobCount,
    u_blobSize: KNOBS.blobSize,
    u_blobScale: KNOBS.blobScale,
    u_blobStretchY: KNOBS.blobStretchY,
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
  }), [])

  const bannerStyle = full
    ? { position: 'fixed', inset: 0, width: '100vw', height: '100vh' }
    : {
        width: 1584,
        height: 396,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f2f2f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: full ? 0 : 24,
      }}
    >
      <div style={bannerStyle}>
        <ShaderMount
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          speed={KNOBS.speed}
          fragmentShader={relvoGradientFragmentShader}
          uniforms={uniforms}
          maxPixelCount={2240 * 1260}
          minPixelRatio={1}
        />
      </div>
    </div>
  )
}
