import { useEffect, useRef, useState } from 'react'
import { HeroFlowLive } from './HeroFlowLive'

function goTo(path) {
  window.history.pushState({}, '', path)
  window.scrollTo(0, 0)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const DESKTOP_HERO_RATIOS = {
  navReserve: 0.095,
  gapAfterNav: 0.028,
  eyebrow: 0.028,
  gapAfterEyebrow: 0.028,
  headline: 0.18,
  gapAfterHeadline: 0.038,
  body: 0.11,
  gapAfterBody: 0.032,
  animation: 0.275,
  gapAfterAnimation: 0.024,
  cta: 0.062,
  bottomGap: 0.028,
}

const MOBILE_HERO_RATIOS = {
  navReserve: 0.075,
  gapAfterNav: 0.008,
  eyebrow: 0.03,
  gapAfterEyebrow: 0.072,
  headline: 0.145,
  gapAfterHeadline: 0.032,
  body: 0.13,
  gapAfterBody: 0.022,
  animation: 0.285,
  gapAfterAnimation: 0.012,
  cta: 0.075,
  bottomGap: 0.028,
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function buildDesktopComposition(viewportWidth, viewportHeight) {
  const shellPadding = viewportWidth >= 640 ? 48 : 32
  const contentWidth = Math.min(viewportWidth - shellPadding, 1280)
  const compositionScale = clamp(
    Math.min(viewportHeight / 900, contentWidth / 1280),
    0.82,
    1.22
  )
  const ratioSum = Object.values(DESKTOP_HERO_RATIOS).reduce((sum, ratio) => sum + ratio, 0)
  const unit = viewportHeight / ratioSum

  const rows = {
    navReserve: unit * DESKTOP_HERO_RATIOS.navReserve,
    gapAfterNav: unit * DESKTOP_HERO_RATIOS.gapAfterNav,
    eyebrow: unit * DESKTOP_HERO_RATIOS.eyebrow,
    gapAfterEyebrow: unit * DESKTOP_HERO_RATIOS.gapAfterEyebrow,
    headline: unit * DESKTOP_HERO_RATIOS.headline,
    gapAfterHeadline: unit * DESKTOP_HERO_RATIOS.gapAfterHeadline,
    body: unit * DESKTOP_HERO_RATIOS.body,
    gapAfterBody: unit * DESKTOP_HERO_RATIOS.gapAfterBody,
    animation: unit * DESKTOP_HERO_RATIOS.animation,
    gapAfterAnimation: unit * DESKTOP_HERO_RATIOS.gapAfterAnimation,
    cta: unit * DESKTOP_HERO_RATIOS.cta,
    bottomGap: unit * DESKTOP_HERO_RATIOS.bottomGap,
  }

  const eyebrowFontSize = clamp(rows.eyebrow * 0.54 * compositionScale, 11, 20)
  const headlineFontSize = clamp(
    Math.min(rows.headline * 0.5 * compositionScale, contentWidth * 0.056 * compositionScale),
    38,
    96
  )
  const bodyFontSize = clamp(
    Math.min(rows.body * 0.255 * compositionScale, contentWidth * 0.0195 * compositionScale),
    15,
    29
  )
  const animationHeight = clamp(rows.animation * 0.98, 180, 340)
  const animationWidth = Math.min(contentWidth * 0.9, animationHeight * 6.2)
  const ctaHeight = clamp(rows.cta * 0.76, 42, 60)
  const primaryButtonFontSize = clamp(rows.cta * 0.26, 14, 18)
  const secondaryButtonFontSize = clamp(rows.cta * 0.22, 12, 15)
  const buttonGap = clamp(contentWidth * 0.022, 18, 42)
  const buttonWidth = clamp(contentWidth * 0.11, 132, 196)
  const buttonPaddingX = clamp(contentWidth * 0.015, 20, 34)

  return {
    contentWidth,
    compositionScale,
    rows,
    eyebrowFontSize,
    headlineFontSize,
    bodyFontSize,
    animationHeight,
    animationWidth,
    ctaHeight,
    primaryButtonFontSize,
    secondaryButtonFontSize,
    buttonGap,
    buttonWidth,
    buttonPaddingX,
  }
}

function buildMobileComposition(viewportWidth, viewportHeight) {
  const contentWidth = Math.max(viewportWidth - 32, 280)
  const textWidth = clamp(contentWidth * 0.9, 304, contentWidth * 0.9)
  const compositionScale = clamp(
    Math.min(viewportHeight / 812, contentWidth / 390),
    0.88,
    1.12
  )
  const ratioSum = Object.values(MOBILE_HERO_RATIOS).reduce((sum, ratio) => sum + ratio, 0)
  const unit = viewportHeight / ratioSum

  const rows = {
    navReserve: unit * MOBILE_HERO_RATIOS.navReserve,
    gapAfterNav: unit * MOBILE_HERO_RATIOS.gapAfterNav,
    eyebrow: unit * MOBILE_HERO_RATIOS.eyebrow,
    gapAfterEyebrow: unit * MOBILE_HERO_RATIOS.gapAfterEyebrow,
    headline: unit * MOBILE_HERO_RATIOS.headline,
    gapAfterHeadline: unit * MOBILE_HERO_RATIOS.gapAfterHeadline,
    body: unit * MOBILE_HERO_RATIOS.body,
    gapAfterBody: unit * MOBILE_HERO_RATIOS.gapAfterBody,
    animation: unit * MOBILE_HERO_RATIOS.animation,
    gapAfterAnimation: unit * MOBILE_HERO_RATIOS.gapAfterAnimation,
    cta: unit * MOBILE_HERO_RATIOS.cta,
    bottomGap: unit * MOBILE_HERO_RATIOS.bottomGap,
  }

  const eyebrowFontSize = clamp(rows.eyebrow * 0.56 * compositionScale, 10, 13)
  const headlineFontSize = clamp(
    Math.min(rows.headline * 0.33 * compositionScale, contentWidth * 0.088),
    21,
    36
  )
  const bodyFontSize = clamp(
    Math.min(rows.body * 0.232 * compositionScale, contentWidth * 0.047),
    15,
    20
  )
  const animationHeight = clamp(rows.animation * 1.04, 166, 280)
  const animationWidth = Math.min(contentWidth * 2.45, animationHeight * 6.8)
  const ctaHeight = clamp(rows.cta * 0.7, 38, 48)
  const primaryButtonFontSize = clamp(rows.cta * 0.22, 13, 16)
  const secondaryButtonFontSize = clamp(rows.cta * 0.19, 11, 13.5)
  const buttonGap = clamp(contentWidth * 0.04, 14, 22)
  const buttonWidth = clamp(contentWidth * 0.34, 112, 146)
  const buttonPaddingX = clamp(contentWidth * 0.048, 16, 20)

  return {
    contentWidth,
    textWidth,
    rows,
    eyebrowFontSize,
    headlineFontSize,
    bodyFontSize,
    animationHeight,
    animationWidth,
    ctaHeight,
    primaryButtonFontSize,
    secondaryButtonFontSize,
    buttonGap,
    buttonWidth,
    buttonPaddingX,
  }
}

export const HeroSection = () => {
  const page1Ref = useRef(null)
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  }))

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', updateViewport, { passive: true })
    updateViewport()
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const isDesktopComposition = viewport.width >= 768
  const desktopComposition = buildDesktopComposition(viewport.width, viewport.height)
  const mobileComposition = buildMobileComposition(viewport.width, viewport.height)

  if (!isDesktopComposition) {
    return (
      <section
        ref={page1Ref}
        className="full-page relative w-full px-4"
        style={{ minHeight: `${viewport.height}px` }}
      >
        <div
          className="relative z-10 mx-auto grid w-full"
          style={{
            minHeight: `${viewport.height}px`,
            gridTemplateColumns: 'minmax(0, 1fr)',
            gridTemplateRows: [
              `${mobileComposition.rows.navReserve}px`,
              `${mobileComposition.rows.gapAfterNav}px`,
              `${mobileComposition.rows.eyebrow}px`,
              `${mobileComposition.rows.gapAfterEyebrow}px`,
              `${mobileComposition.rows.headline}px`,
              `${mobileComposition.rows.gapAfterHeadline}px`,
              `${mobileComposition.rows.body}px`,
              `${mobileComposition.rows.gapAfterBody}px`,
              `${mobileComposition.rows.animation}px`,
              `${mobileComposition.rows.gapAfterAnimation}px`,
              `${mobileComposition.rows.cta}px`,
              `${mobileComposition.rows.bottomGap}px`,
            ].join(' '),
          }}
        >
          <div
            className="flex w-full items-center justify-center text-center"
            style={{ gridRow: '3' }}
          >
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: `${mobileComposition.eyebrowFontSize}px`,
                fontWeight: 400,
                color: '#585858',
                letterSpacing: '0.14em',
                width: `${mobileComposition.textWidth}px`,
                textAlign: 'center',
              }}
            >
              Revenue-design para empresas B2B en LATAM
            </p>
          </div>
          <div
            className="flex w-full items-center justify-center text-center"
            style={{ gridRow: '5' }}
          >
            <h1
              className="mx-auto"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: `${mobileComposition.headlineFontSize}px`,
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: '-0.024em',
              color: '#000000',
              width: `${Math.min(mobileComposition.textWidth, mobileComposition.headlineFontSize * 10.4)}px`,
              textAlign: 'center',
            }}
          >
              Cobra como quieras,
              <br />
              opera en un sólo sistema.
            </h1>
          </div>
          <div
            className="flex w-full items-center justify-center text-center"
            style={{ gridRow: '7' }}
          >
            <p
              className="mx-auto"
              style={{
                fontFamily: 'var(--font-ui)',
              fontSize: `${mobileComposition.bodyFontSize}px`,
              fontWeight: 400,
              lineHeight: 1.38,
              color: '#2a2a2a',
              width: `${Math.min(mobileComposition.textWidth, mobileComposition.bodyFontSize * 23)}px`,
              textAlign: 'center',
            }}
          >
              Cuando tus ingresos dependen de cobros por suscripciones, uso, hitos o métricas de servicio, el camino del contrato al cobro es largo y manual. Relvo automatiza ese proceso de punta a punta, para que la facturación deje de ser un dolor de cabeza.
            </p>
          </div>
          <div
            className="flex w-full items-center justify-center overflow-visible"
            style={{ gridRow: '9' }}
          >
            <div
              className="relative shrink-0"
              style={{
                height: `${mobileComposition.animationHeight}px`,
                width: `${mobileComposition.animationWidth}px`,
                maxWidth: '165vw',
              }}
            >
              <HeroFlowLive className="block h-full w-full" />
            </div>
          </div>
          <div
            className="flex w-full items-center justify-center"
            style={{ gridRow: '11' }}
          >
            <div className="flex items-center" style={{ gap: `${mobileComposition.buttonGap}px` }}>
              <a
                href="#producto"
                className="inline-flex items-center justify-center rounded-full bg-white/50 text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: `${mobileComposition.primaryButtonFontSize}px`,
                  fontWeight: 500,
                  height: `${mobileComposition.ctaHeight}px`,
                  minWidth: `${mobileComposition.buttonWidth}px`,
                  paddingLeft: `${mobileComposition.buttonPaddingX}px`,
                  paddingRight: `${mobileComposition.buttonPaddingX}px`,
                }}
              >
                Ver producto
              </a>
              <a
                href="/login"
                onClick={(e) => { e.preventDefault(); goTo('/login') }}
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--text-main)] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: `${mobileComposition.secondaryButtonFontSize}px`,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  height: `${mobileComposition.ctaHeight}px`,
                  minWidth: `${mobileComposition.buttonWidth}px`,
                  paddingLeft: `${mobileComposition.buttonPaddingX}px`,
                  paddingRight: `${mobileComposition.buttonPaddingX}px`,
                }}
              >
                Ir a demo
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={page1Ref}
      className="full-page relative w-full px-4 sm:px-6"
      style={{ minHeight: `${viewport.height}px` }}
    >
      <div
        className="relative z-10 mx-auto grid w-full max-w-7xl"
        style={{
          minHeight: `${viewport.height}px`,
          gridTemplateRows: [
            `${desktopComposition.rows.navReserve}px`,
            `${desktopComposition.rows.gapAfterNav}px`,
            `${desktopComposition.rows.eyebrow}px`,
            `${desktopComposition.rows.gapAfterEyebrow}px`,
            `${desktopComposition.rows.headline}px`,
            `${desktopComposition.rows.gapAfterHeadline}px`,
            `${desktopComposition.rows.body}px`,
            `${desktopComposition.rows.gapAfterBody}px`,
            `${desktopComposition.rows.animation}px`,
            `${desktopComposition.rows.gapAfterAnimation}px`,
            `${desktopComposition.rows.cta}px`,
            `${desktopComposition.rows.bottomGap}px`,
          ].join(' '),
        }}
      >
        <div
          className="flex items-center justify-center text-center"
          style={{ gridRow: '3' }}
        >
          <p
            className="whitespace-nowrap uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: `${desktopComposition.eyebrowFontSize}px`,
              fontWeight: 400,
              color: '#585858',
              letterSpacing: '0.14em',
            }}
          >
            Revenue-design para empresas B2B en LATAM
          </p>
        </div>

        <div
          className="flex items-center justify-center text-center"
          style={{ gridRow: '5' }}
        >
          <h1
            className="mx-auto"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: `${desktopComposition.headlineFontSize}px`,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: '-0.028em',
              color: '#000000',
              width: `min(100%, ${Math.min(desktopComposition.contentWidth * 0.88, desktopComposition.headlineFontSize * 11.8)}px)`,
            }}
          >
            Cobra como quieras,
            <br />
            opera en un sólo sistema.
          </h1>
        </div>

        <div
          className="flex items-center justify-center text-center"
          style={{ gridRow: '7' }}
        >
          <p
            className="mx-auto"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: `${desktopComposition.bodyFontSize}px`,
              fontWeight: 400,
              lineHeight: 1.38,
              color: '#2a2a2a',
              width: `min(100%, ${Math.min(desktopComposition.contentWidth * 0.82, desktopComposition.bodyFontSize * 34)}px)`,
            }}
          >
            Cuando tus ingresos dependen de cobros por suscripciones, uso, hitos o métricas de servicio, el camino del contrato al cobro es largo y manual. Relvo automatiza ese proceso de punta a punta, para que la facturación deje de ser un dolor de cabeza.
          </p>
        </div>

        <div
          className="flex items-center justify-center"
          style={{ gridRow: '9' }}
        >
          <div
            className="hero-animation-stage relative"
            style={{
              height: `${desktopComposition.animationHeight}px`,
              width: `${desktopComposition.animationWidth}px`,
              maxWidth: '100%',
            }}
          >
            <HeroFlowLive className="block h-full w-full" />
          </div>
        </div>

        <div
          className="flex items-center justify-center"
          style={{ gridRow: '11' }}
        >
          <div className="flex items-center" style={{ gap: `${desktopComposition.buttonGap}px` }}>
            <a
              href="#producto"
              className="inline-flex items-center justify-center rounded-full bg-white/50 text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: `${desktopComposition.primaryButtonFontSize}px`,
                fontWeight: 500,
                height: `${desktopComposition.ctaHeight}px`,
                minWidth: `${desktopComposition.buttonWidth}px`,
                paddingLeft: `${desktopComposition.buttonPaddingX}px`,
                paddingRight: `${desktopComposition.buttonPaddingX}px`,
              }}
            >
              Ver producto
            </a>
            <a
              href="/login"
              onClick={(e) => { e.preventDefault(); goTo('/login') }}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--text-main)] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: `${desktopComposition.secondaryButtonFontSize}px`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                height: `${desktopComposition.ctaHeight}px`,
                minWidth: `${desktopComposition.buttonWidth}px`,
                paddingLeft: `${desktopComposition.buttonPaddingX}px`,
                paddingRight: `${desktopComposition.buttonPaddingX}px`,
              }}
            >
              Ir a demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
