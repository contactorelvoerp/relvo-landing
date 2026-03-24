import { useState } from 'react'
import { HeroCanvasVideo } from './HeroCanvasVideo'
import { canUseAlphaCanvasVideo, isMobileDevice } from '../../utils/mediaSupport'

const DESKTOP_HERO_SRC = '/Hero%20New.webm'
const MOBILE_HERO_SRC = '/Hero%20new%20mobile.mov'

export const HeroSection = ({ t, mediaSrc = DESKTOP_HERO_SRC }) => {
  const [mediaOk, setMediaOk] = useState(true)
  const showMedia = Boolean(mediaSrc) && mediaOk
  const supportsAlphaCanvas = canUseAlphaCanvasVideo()
  const useMobileLayout = isMobileDevice()
  const mobileHeroSrc = MOBILE_HERO_SRC

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
              {t.heroBadge && (
                <div className="mb-4 flex justify-center">
                  <span className="eyebrow-compact">{t.heroBadge}</span>
                </div>
              )}
              <h1 className="font-display text-[clamp(2rem,10.4vw,2.8rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--text-main)]">
                {t.heroTitle}
              </h1>
              <p className="mx-auto mt-4 max-w-[38ch] whitespace-pre-line text-[17px] font-medium leading-[1.45] tracking-[-0.02em] text-[var(--text-soft)]">
                {t.heroDescription}
              </p>
            </div>
            <div className="aspect-video w-full">
              {showMedia ? (
                isVideo ? (
                  <HeroCanvasVideo
                    src={mobileHeroSrc}
                    fit="cover"
                    topCropPx={14}
                    native
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
            className="relative overflow-hidden rounded-[var(--radius-2xl)] px-6 py-4 shadow-[0_10px_28px_rgba(16,16,14,0.14)] sm:px-10 sm:py-12"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 5% 15%, rgba(37,99,235,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 65% at 92% 85%, rgba(37,99,235,0.10) 0%, transparent 55%), #0f1115',
            }}
          >
            <div className="relative mx-auto max-w-3xl text-center">
              {t.heroBadge && (
                <div className="mb-4 flex justify-center">
                  <span
                    className="eyebrow-compact"
                    style={{ color: 'rgba(255,255,255,0.50)', ['--brand-accent']: 'rgba(255,255,255,0.45)' }}
                  >
                    {t.heroBadge}
                  </span>
                </div>
              )}
              <h1 className="font-display text-[clamp(2rem,4.1vw,3.05rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-white">
                {t.heroTitle}
              </h1>
              <p className="mx-auto mt-4 max-w-[42ch] whitespace-pre-line text-[18px] font-medium leading-[1.45] tracking-[-0.02em] text-white/60">
                {t.heroDescription}
              </p>
            </div>

            <div className="mx-auto mt-6 w-full max-w-4xl sm:mt-8">
              <div className="aspect-[16/7.2] w-full">
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
                          src={mediaSrc}
                          fit="cover"
                          topCropPx={14}
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