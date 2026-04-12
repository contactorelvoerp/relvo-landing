/**
 * BackgroundMobile — static CSS gradient backdrop for phones.
 *
 * Zero GPU shader, zero JS. Uses the same brand palette as the desktop
 * RelvoGradient but composed as layered radial-gradients so it reads as
 * atmosphere rather than a blocky blob. Decorative SVG figures are
 * still rendered on top by ShaderBackground (kept per user preference).
 */

export const BackgroundMobile = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      backgroundImage: [
        'radial-gradient(ellipse 70% 55% at 15% 8%, rgba(223,244,235,0.95), rgba(223,244,235,0) 65%)',
        'radial-gradient(ellipse 80% 50% at 85% 22%, rgba(213,247,193,0.85), rgba(213,247,193,0) 65%)',
        'radial-gradient(ellipse 90% 60% at 20% 55%, rgba(227,192,242,0.70), rgba(227,192,242,0) 65%)',
        'radial-gradient(ellipse 85% 55% at 80% 82%, rgba(63,40,178,0.18), rgba(63,40,178,0) 65%)',
        'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(223,244,235,0.60), rgba(223,244,235,0) 70%)',
      ].join(', '),
    }}
  />
)
