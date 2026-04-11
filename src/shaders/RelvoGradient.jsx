/**
 * RelvoGradient — React component wrapping our forked grain gradient shader.
 *
 * Uses Paper's ShaderMount infrastructure but with our custom fragment shader
 * that supports configurable blob count and size.
 */

import { memo, useMemo } from 'react'
import { ShaderMount } from '@paper-design/shaders-react'
import {
  getShaderColorFromString,
  getShaderNoiseTexture,
  ShaderFitOptions,
} from '@paper-design/shaders'
import { relvoGradientFragmentShader } from './relvo-gradient.js'

const noiseTexture = getShaderNoiseTexture()

export const RelvoGradient = memo(function RelvoGradientImpl({
  // Animation
  speed = 0.85,
  frame = 0,
  // Colors
  colorBack = '#000000',
  colors = ['#DFF4EB', '#D5F7C1', '#E3C0F2', '#3F28B2'],
  // Grain
  softness = 0.35,
  intensity = 0.58,
  noise = 0.17,
  // Blob control
  blobCount = 6,
  blobSize = 0.45,
  blobScale = 1.0,
  // Sizing
  fit = 'contain',
  scale = 1,
  rotation = 0,
  originX = 0.5,
  originY = 0.5,
  offsetX = 0,
  offsetY = 0,
  worldWidth = 0,
  worldHeight = 0,
  // Rest (style, className, etc.)
  ...props
}) {
  const uniforms = useMemo(() => ({
    u_colorBack: getShaderColorFromString(colorBack),
    u_colors: colors.map(getShaderColorFromString),
    u_colorsCount: colors.length,
    u_softness: softness,
    u_intensity: intensity,
    u_noise: noise,
    u_blobCount: blobCount,
    u_blobSize: blobSize,
    u_blobScale: blobScale,
    u_noiseTexture: noiseTexture,
    u_fit: ShaderFitOptions[fit],
    u_scale: scale,
    u_rotation: rotation,
    u_offsetX: offsetX,
    u_offsetY: offsetY,
    u_originX: originX,
    u_originY: originY,
    u_worldWidth: worldWidth,
    u_worldHeight: worldHeight,
  }), [colorBack, colors, softness, intensity, noise, blobCount, blobSize, blobScale,
       fit, scale, rotation, originX, originY, offsetX, offsetY,
       worldWidth, worldHeight])

  return (
    <ShaderMount
      {...props}
      speed={speed}
      frame={frame}
      fragmentShader={relvoGradientFragmentShader}
      uniforms={uniforms}
    />
  )
})
