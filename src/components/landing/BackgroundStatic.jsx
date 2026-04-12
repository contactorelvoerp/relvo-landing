/**
 * BackgroundStatic — static CSS gradient backdrop for the landing.
 *
 * Zero GPU shader, zero JS per frame. Layered radial-gradients using the
 * brand palette. Originally built for mobile, now used on all devices
 * after we decided the live RelvoGradient was too GPU-heavy on desktop
 * and pre-rendered video didn't preserve the shader's feel.
 *
 * See ~/.claude/.../memory/project_shader_perf_exploration.md for the
 * full story and the unvisited optimization (half-res blob + full-res
 * grain shader split) that might let us revive the live shader later.
 *
 * Decorative SVG figures are still rendered on top by ShaderBackground.
 */

export const BackgroundStatic = () => (
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
