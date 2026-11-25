export function HeroFigure({ palette }) {
  return <img className="hero__ring" data-palette={palette} src={`/brand/figuras/anillo-agente-${palette}.svg`} alt="" width="216" height="216" aria-hidden="true" />
}
