import { useEffect, useMemo, useRef, useState } from 'react'

function createVideo(src) {
  const v = document.createElement('video')
  v.src = src
  v.autoplay = true
  v.controls = false
  v.removeAttribute('controls')
  v.muted = true
  v.setAttribute('muted', '')
  v.loop = true
  v.setAttribute('loop', '')
  v.playsInline = true
  v.setAttribute('playsinline', '')
  v.setAttribute('webkit-playsinline', '')
  v.preload = 'auto'
  v.disablePictureInPicture = true
  v.disableRemotePlayback = true
  return v
}

function drawFit(ctx, video, width, height, topCropPx = 0, fit = 'cover') {
  const vw = video.videoWidth || 1
  const vh = video.videoHeight || 1
  const baseScale =
    fit === 'contain'
      ? Math.min(width / vw, height / vh)
      : Math.max(width / vw, height / vh)
  const zoom = topCropPx > 0 ? 1 + topCropPx / Math.max(1, height) : 1
  const scale = baseScale * zoom
  const dw = vw * scale
  const dh = vh * scale
  const dx = (width - dw) / 2
  const dy = (height - dh) / 2 - topCropPx

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(video, dx, dy, dw, dh)
}

export const HeroCanvasVideo = ({
  src,
  topCropPx = 0,
  fit = 'cover',
  backgroundColor = '',
  className = '',
  onError,
}) => {
  const canvasRef = useRef(null)
  const [ok, setOk] = useState(true)
  const key = useMemo(() => String(src || ''), [src])
  const dprRef = useRef(1)

  useEffect(() => {
    setOk(true)
  }, [key])

  useEffect(() => {
    if (!ok) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      setOk(false)
      return
    }

    const video = createVideo(src)
    video.className = 'hero-video'
    video.style.display = 'none'
    video.style.pointerEvents = 'none'
    document.body.appendChild(video)

    const handleEnded = () => {
      try {
        video.currentTime = 0
      } catch {
        // ignore
      }
      video.play().catch(() => {})
    }

    video.addEventListener('ended', handleEnded)

    let rafId = 0
    let resizeObserver
    let destroyed = false
    let cancelVfc = null

    const fail = (e) => {
      if (destroyed) return
      setOk(false)
      onError?.(e)
    }

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      dprRef.current = dpr
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    const draw = () => {
      if (destroyed) return
      const w = canvas.width || 1
      const h = canvas.height || 1
      if (video.readyState >= 2) {
        try {
          if (backgroundColor) {
            ctx.save()
            ctx.globalCompositeOperation = 'source-over'
            ctx.fillStyle = backgroundColor
            ctx.fillRect(0, 0, w, h)
            ctx.restore()
          }
          const crop = Math.max(0, Number(topCropPx) || 0) * (dprRef.current || 1)
          drawFit(ctx, video, w, h, crop, fit)
        } catch {
          // ignore transient decode/draw errors
        }
      }
    }

    const start = async () => {
      try {
        await new Promise((resolve, reject) => {
          const onCanPlay = () => {
            cleanup()
            resolve()
          }
          const onErr = (err) => {
            cleanup()
            reject(err)
          }
          const cleanup = () => {
            video.removeEventListener('canplay', onCanPlay)
            video.removeEventListener('error', onErr)
          }
          video.addEventListener('canplay', onCanPlay, { once: true })
          video.addEventListener('error', onErr, { once: true })
        })

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        resize()

        await video.play().catch(() => {})

        const hasVfc = typeof video.requestVideoFrameCallback === 'function'
        if (hasVfc) {
          const loop = () => {
            if (destroyed) return
            draw()
            video.requestVideoFrameCallback(loop)
          }
          video.requestVideoFrameCallback(loop)
          cancelVfc = () => {
            // no direct cancel API; destroyed flag stops recursion
          }
          return
        }

        const tick = () => {
          if (destroyed) return
          draw()
          rafId = window.requestAnimationFrame(tick)
        }
        rafId = window.requestAnimationFrame(tick)
      } catch (e) {
        fail(e)
      }
    }

    start()

    return () => {
      destroyed = true
      try {
        window.cancelAnimationFrame(rafId)
      } catch {
        // ignore
      }
      try {
        cancelVfc?.()
      } catch {
        // ignore
      }
      try {
        resizeObserver?.disconnect()
      } catch {
        // ignore
      }
      try {
        video.removeEventListener('ended', handleEnded)
        video.pause()
      } catch {
        // ignore
      }
      try {
        video.remove()
      } catch {
        // ignore
      }
    }
  }, [ok, onError, src, key, topCropPx, fit])

  if (!ok) return null
  return <canvas ref={canvasRef} className={className} />
}

