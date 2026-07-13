import { Scene } from './FeatureVisuals'

const animationSrc = {
  en: '/animations/relvo-hero-en.html',
  es: '/animations/relvo-hero-es.html',
}

export const HeroVisual = ({ lang }) => {
  const es = lang === 'es'
  const title = es ? 'Animación del flujo de revenue de Relvo' : 'Relvo revenue flow animation'

  return (
    <Scene accent="lime" className="w-full">
      <div className="relative mx-auto aspect-[560/440] w-full max-w-[560px]">
        <iframe
          title={title}
          src={animationSrc[es ? 'es' : 'en']}
          className="absolute inset-0 h-full w-full border-0 bg-transparent"
          scrolling="no"
          loading="eager"
          sandbox="allow-scripts"
        />
      </div>
    </Scene>
  )
}
