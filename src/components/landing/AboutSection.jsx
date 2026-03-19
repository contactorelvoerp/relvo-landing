import { Reveal } from './Reveal'
import { HeroCanvasVideo } from './HeroCanvasVideo'
import { canUseAlphaCanvasVideo, isMobileDevice } from '../../utils/mediaSupport'

const MOBILE_FEATURE_VIDEO_SRC_BY_INDEX = [
  '/Feature%201%20movil.mp4',
  '/Feature%202%20movil.mp4',
  '/Feature%203%20movil.mp4',
  '/Feature%204%20movil.mp4',
]

export const AboutSection = ({ t }) => {
  const features = t.features ?? []
  const supportsAlphaCanvas = canUseAlphaCanvasVideo()
  const useMobileLayout = isMobileDevice()

  return (
    <section className="section-shell bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl space-y-14 sm:space-y-16 lg:space-y-20">
        {features.map((feature, idx) => {
          const imageLeft = feature.imageSide === 'left'
          const aspectClass = 'aspect-square'

          const mobileVideoOnly = useMobileLayout && Boolean(feature.videoSrc)

          const media = (
            <div
              className={`overflow-hidden rounded-[var(--radius-xl)] ${
                mobileVideoOnly ? 'bg-transparent' : 'bg-black/[0.03]'
              }`}
            >
              <div className={`w-full ${aspectClass}`}>
                <div className="relative h-full w-full">
                  {feature.imageSrc && !mobileVideoOnly ? (
                    <img
                      src={feature.imageSrc}
                      alt={feature.imageAlt ?? feature.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-20 w-20 rounded-[var(--radius-md)] bg-black/[0.05]" />
                    </div>
                  )}

                  {feature.videoSrc ? (
                    <HeroCanvasVideo
                      src={
                        useMobileLayout
                          ? MOBILE_FEATURE_VIDEO_SRC_BY_INDEX[idx] || feature.videoSrc
                          : feature.videoSrc
                      }
                      fit={useMobileLayout ? 'cover' : 'contain'}
                      topCropPx={useMobileLayout ? 14 : 0}
                      backgroundColor=""
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    />
                  ) : null}

                  {!feature.imageSrc && !feature.videoSrc ? (
                    <>
                      <div className="absolute left-[18%] top-[30%] h-28 w-28 rounded-full bg-black/[0.04]" />
                      <div className="absolute right-[20%] bottom-[22%] h-24 w-24 rounded-full bg-black/[0.04]" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] via-transparent to-black/[0.05]" />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )

          const copy = (
            <div className="mx-auto flex w-full max-w-[32ch] flex-col justify-center md:max-w-[30ch] lg:max-w-[32ch]">
              <h3 className="max-w-[16ch] font-display text-[clamp(1.75rem,2.35vw,2.35rem)] font-bold leading-[1.06] tracking-[-0.04em] text-[var(--text-main)]">
                {feature.title}
              </h3>
              <p className="mt-4 whitespace-pre-line text-[16px] leading-[1.4] tracking-[-0.01em] text-[#777777] sm:text-[18px]">
                {feature.description}
              </p>
            </div>
          )

          return (
            <Reveal
              key={`${idx}-${feature.title}`}
              delayMs={idx * 70}
              className="grid items-start gap-10 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16"
            >
              <div className={imageLeft ? '' : 'md:order-2'}>{media}</div>
              <div className={imageLeft ? '' : 'md:order-1'}>{copy}</div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}