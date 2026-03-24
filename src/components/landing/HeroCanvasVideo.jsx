import { useEffect, useMemo, useRef, useState } from 'react'

// ─── Native video (mobile MP4) ───────────────────────────────────────────────

export const NativeVideo = ({ src, fit = 'cover', className = '', onError }) => {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    let destroyed = false
    let retryTimer1, retryTimer2

    const tryPlay = () => {
      if (destroyed || !v.paused) return
      v.play().catch(() => {})
    }

    // React no siempre sincroniza el atributo muted al DOM — setearlo imperativo
    // es necesario para que autoplay funcione en browsers móviles
    v.muted = true
    v.setAttribute('muted', '')
    v.setAttribute('webkit-playsinline', '')

    tryPlay()
    // Retries diferidos por si el primer intento cae antes de que el video esté listo
    retryTimer1 = setTimeout(tryPlay, 300)
    retryTimer2 = setTimeout(tryPlay, 1000)

    v.addEventListener('loadeddata', tryPlay)
    v.addEventListener('canplay', tryPlay)
    // Si el video se pausa por cualquier razón (browser policy, background, etc.), reintentar
    v.addEventListener('pause', tryPlay)

    const onVisibility = () => { if (!document.hidden) tryPlay() }
    document.addEventListener('visibilitychange', onVisibility)

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) tryPlay() },
      { threshold: 0.1 }
    )
    observer.observe(v)

    return () => {
      destroyed = true
      clearTimeout(retryTimer1)
      clearTimeout(retryTimer2)
      v.removeEventListener('loadeddata', tryPlay)
      v.removeEventListener('canplay', tryPlay)
      v.removeEventListener('pause', tryPlay)
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
    }
  }, [src])

  const handleTap = () => {
    const v = ref.current
    if (v && v.paused) v.play().catch(() => {})
  }

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
      disablePictureInPicture
      disableRemotePlayback
      className={`hero-video ${className}`}
      style={{ objectFit: fit }}
      onClick={handleTap}
      onError={onError}
    />
  )
}

// ─── Canvas video (desktop WebM con alpha) ───────────────────────────────────

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

const CanvasVideo = ({ src, topCropPx = 0, fit = 'cover', backgroundColor = '', className = '', onError }) => {
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
      try { video.currentTime = 0 } catch { /* ignore */ }
      video.play().catch(() => {})
    }
    video.addEventListener('ended', handleEnded)

    let rafId = 0
    let resizeObserver
    let viewportObserver
    let destroyed = false

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
        } catch { /* ignore */ }
      }
    }

    const start = async () => {
      try {
        await new Promise((resolve, reject) => {
          if (video.readyState >= 3) { resolve(); return }

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
          timeoutId = setTimeout(settle(resolve), 5000)

          video.addEventListener('canplay', onReady, { once: true })
          video.addEventListener('loadeddata', onReady, { once: true })
          video.addEventListener('error', onErr, { once: true })
        })

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        resize()

        await video.play().catch(() => {})

        viewportObserver = new IntersectionObserver(
          (entries) => { if (entries[0]?.isIntersecting) tryPlay() },
          { threshold: 0.1 }
        )
        viewportObserver.observe(canvas)

        const onVisibility = () => { if (!document.hidden) tryPlay() }
        document.addEventListener('visibilitychange', onVisibility)
        video._onVisibility = onVisibility

        const hasVfc = typeof video.requestVideoFrameCallback === 'function'
        if (hasVfc) {
          const loop = () => {
            if (destroyed) return
            draw()
            video.requestVideoFrameCallback(loop)
          }
          video.requestVideoFrameCallback(loop)
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
      try { window.cancelAnimationFrame(rafId) } catch { /* ignore */ }
      try { resizeObserver?.disconnect() } catch { /* ignore */ }
      try { viewportObserver?.disconnect() } catch { /* ignore */ }
      try {
        if (video._onVisibility)
          document.removeEventListener('visibilitychange', video._onVisibility)
      } catch { /* ignore */ }
      try {
        video.removeEventListener('ended', handleEnded)
        video.pause()
      } catch { /* ignore */ }
      try { video.remove() } catch { /* ignore */ }
    }
  }, [ok, onError, src, key, topCropPx, fit])

  if (!ok) return null
  return <canvas ref={canvasRef} className={className} />
}

// ─── Exported component ───────────────────────────────────────────────────────

export const HeroCanvasVideo = ({ src, topCropPx = 0, fit = 'cover', backgroundColor = '', className = '', onError, native = false }) => {
  if (native) {
    return <NativeVideo src={src} fit={fit} className={className} onError={onError} />
  }
  return <CanvasVideo src={src} topCropPx={topCropPx} fit={fit} backgroundColor={backgroundColor} className={className} onError={onError} />
}
