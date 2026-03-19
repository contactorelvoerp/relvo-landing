import { useState } from 'react'
import { HeroCanvasVideo } from './HeroCanvasVideo'
import { canUseAlphaCanvasVideo, isMobileDevice } from '../../utils/mediaSupport'

export const HeroSection = ({ t, mediaSrc = '/Video%20real%20v123.webm' }) => {
  const [mediaOk, setMediaOk] = useState(true)
  const showMedia = Boolean(mediaSrc) && mediaOk
  const supportsAlphaCanvas = canUseAlphaCanvasVideo()
  const useMobileLayout = isMobileDevice()
  const mobileHeroSrc = '/Hero%20fondo%20blanco.mp4'

  const lower = String(mediaSrc || '').toLowerCase()
  const isVideo =
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.mov')

  return (
    <section className="section-shell bg-white pb-8 pt-5 sm:pb-10 sm:pt-6">
      <div className="mx-auto max-w-7xl">
        {useMobileLayout ? (
          <>
            <div className="mx-auto mb-5 max-w-3xl text-center">
              <h1 className="font-display text-[clamp(2rem,10.4vw,2.8rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--text-main)]">
                {t.heroTitle}
              </h1>
              <p className="mt-4 whitespace-pre-line text-[22px] font-bold leading-[1] tracking-[-0.04em] text-[#6f6f78]">
                {t.heroDescription}
              </p>
            </div>
            <div className="aspect-video w-full">
              {showMedia ? (
                isVideo ? (
                  <HeroCanvasVideo
                    src={mobileHeroSrc}
                    fit="contain"
                    backgroundColor="#ffffff"
                    className="h-full w-full"
                    onError={() => setMediaOk(false)}
                  />
                ) : (
                  <img
                    src={mediaSrc}
                    alt={t.heroGifAlt}
                    onError={() => setMediaOk(false)}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5">
                  <div className="h-16 w-16 rounded-[var(--radius-md)] bg-white/10" />
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-cover bg-center px-6 py-4 shadow-[0_10px_28px_rgba(16,16,14,0.08)] sm:px-10 sm:py-12"
            style={{ backgroundImage: "url('/Fondo%20Hero.png')" }}
          >
            <div className="relative mx-auto max-w-3xl text-center">
              <h1 className="font-display text-[clamp(2rem,4.1vw,3.05rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-white">
                {t.heroTitle}
              </h1>
              <p className="mt-4 whitespace-pre-line text-[22px] font-bold leading-[1] tracking-[-0.04em] text-[#F2F4FF]">
                {t.heroDescription}
              </p>
            </div>

            <div className="mt-0 -mx-6 w-auto sm:mt-9 sm:-mx-10">
              <div className="aspect-video w-full">
                {showMedia ? (
                  isVideo ? (
                    <div className="relative h-full w-full">
                      {supportsAlphaCanvas ? (
                        <>
                          <HeroCanvasVideo
                            src={mediaSrc}
                            topCropPx={14}
                            className="absolute inset-0 h-full w-full"
                            onError={() => setMediaOk(false)}
                          />
                          <video
                            className="hero-video absolute inset-0 h-full w-full bg-transparent object-cover opacity-0"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                            disablePictureInPicture
                            disableRemotePlayback
                            tabIndex={-1}
                            onError={() => setMediaOk(false)}
                          >
                            <source src={mediaSrc} type="video/webm" />
                          </video>
                        </>
                      ) : (
                        <HeroCanvasVideo
                          src={mobileHeroSrc}
                          fit="contain"
                          backgroundColor="#ffffff"
                          className="absolute inset-0 h-full w-full"
                          onError={() => setMediaOk(false)}
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={mediaSrc}
                      alt={t.heroGifAlt}
                      onError={() => setMediaOk(false)}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5">
                    <div className="h-16 w-16 rounded-[var(--radius-md)] bg-white/10" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}