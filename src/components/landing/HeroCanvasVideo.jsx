import { useEffect, useMemo, useRef, useState } from 'react'

function createVideo(src) {
  const v = document.createElement('video')
  v.src = src
  v.autoplay = true
  v.setAttribute('autoplay', '')
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

  // iOS/Safari no procesa ni dispara canplay en elementos con display:none.
  // Posicionamos off-screen para que el browser cargue y procese el video.
  Object.assign(v.style, {
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    width: '1px',
    height: '1px',
    opacity: '0',
    pointerEvents: 'none',
  })

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
    let viewportObserver
    let destroyed = false
    let cancelVfc = null

    const tryPlay = () => {
      if (destroyed || !video.paused) return
      video.play().catch(() => {})
    }

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
          // Video ya cargado desde caché — resolver inmediatamente sin esperar el evento.
          if (video.readyState >= 3) {
            resolve()
            return
          }

          let settled = false
          let timeoutId

          const settle = (fn) => (...args) => {
            if (settled) return
            settled = true
            clearTimeout(timeoutId)
            video.removeEventListener('canplay', onReady)
            video.removeEventListener('loadeddata', onReady)
            video.removeEventListener('error', onErr)
            fn(...args)
          }

          const onReady = settle(resolve)
          const onErr = settle(reject)

          // Fallback por si canplay/loadeddata no disparan (algunos browsers mobile).
          timeoutId = setTimeout(settle(resolve), 5000)

          video.addEventListener('canplay', onReady, { once: true })
          // loadeddata: alternativa a canplay, más confiable en Safari/Firefox mobile.
          video.addEventListener('loadeddata', onReady, { once: true })
          video.addEventListener('error', onErr, { once: true })
        })

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        resize()

        await video.play().catch(() => {})

        // IntersectionObserver: reintenta play cada vez que el canvas entra en viewport.
        // Resuelve el rechazo silencioso de autoplay en mobile al primer scroll/interacción.
        viewportObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) tryPlay()
          },
          { threshold: 0.1 }
        )
        viewportObserver.observe(canvas)

        // Reintenta play al volver a la pestaña (tab switch, lock screen, etc.)
        const onVisibility = () => { if (!document.hidden) tryPlay() }
        document.addEventListener('visibilitychange', onVisibility)
        // Guardamos referencia para cleanup
        video._onVisibility = onVisibility

        const hasVfc = typeof video.requestVideoFrameCallback === 'function'
        if (hasVfc) {
          const loop = () => {
            if (destroyed) return
            draw()
            video.requestVideoFrameCallback(loop)
          }
          video.requestVideoFrameCallback(loop)
          cancelVfc = () => {
            // destroyed flag detiene la recursión
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
        viewportObserver?.disconnect()
      } catch {
        // ignore
      }
      try {
        if (video._onVisibility) {
          document.removeEventListener('visibilitychange', video._onVisibility)
        }
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
