import { memo, useMemo } from 'react'
import { ShaderMount } from '@paper-design/shaders-react'
import {
  getShaderColorFromString,
  getShaderNoiseTexture,
  ShaderFitOptions,
} from '@paper-design/shaders'
import { loginGradientFragmentShader } from './login-gradient.js'

const noiseTexture = getShaderNoiseTexture()

export const LoginGradient = memo(function LoginGradientImpl({
  speed = 0.65,
  frame = 0,
  colorBack = '#000000',
  colors = ['#DFF4EB', '#D5F7C1', '#E3C0F2', '#3F28B2'],
  softness = 0.35,
  intensity = 0.58,
  noise = 0.008,
  blobCount = 2,
  blobSize = 0.80,
  blobScale = 1.0,
  fit = 'contain',
  scale = 1,
  rotation = 0,
  originX = 0.5,
  originY = 0.5,
  offsetX = 0,
  offsetY = 0,
  worldWidth = 0,
  worldHeight = 0,
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
      fragmentShader={loginGradientFragmentShader}
      uniforms={uniforms}
    />
  )
})
