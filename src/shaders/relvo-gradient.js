/**
 * Relvo Grain Gradient — forked from @paper-design/shaders GrainGradient
 *
 * Key change: the "corners" shape is replaced with a multi-blob shape
 * that distributes blobs across the canvas. u_blobCount controls how many
 * are visible (up to MAX_BLOBS). u_blobSize controls falloff radius.
 */

const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;

const rotation2 = `
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;

const textureRandomizerR = `
float randomR(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).r;
}
`;

const proceduralHash11 = `
float hash11(float p) {
  p = fract(p * 0.3183099) + 0.1;
  p *= p + 19.19;
  return fract(p * p);
}
`;

const simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const MAX_COLORS = 7;

export const relvoGradientFragmentShader = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${MAX_COLORS}];
uniform float u_colorsCount;
uniform float u_softness;
uniform float u_intensity;
uniform float u_noise;
uniform float u_blobCount;
uniform float u_blobSize;

uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;

uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

in vec2 v_objectUV;
in vec2 v_patternUV;
in vec2 v_objectBoxSize;
in vec2 v_patternBoxSize;

out vec4 fragColor;

${declarePI}
${simplexNoise}
${rotation2}
${textureRandomizerR}

float valueNoiseR(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 fbmR(vec2 n0, vec2 n1, vec2 n2, vec2 n3) {
  float amplitude = 0.2;
  vec4 total = vec4(0.);
  for (int i = 0; i < 3; i++) {
    n0 = rotate(n0, 0.3);
    n1 = rotate(n1, 0.3);
    n2 = rotate(n2, 0.3);
    n3 = rotate(n3, 0.3);
    total.x += valueNoiseR(n0) * amplitude;
    total.y += valueNoiseR(n1) * amplitude;
    total.z += valueNoiseR(n2) * amplitude;
    total.w += valueNoiseR(n3) * amplitude;
    n0 *= 1.99;
    n1 *= 1.99;
    n2 *= 1.99;
    n3 *= 1.99;
    amplitude *= 0.6;
  }
  return total;
}

${proceduralHash11}

void main() {
  const float firstFrameOffset = 7.;
  float t = .1 * (u_time + firstFrameOffset);

  vec2 shape_uv = v_objectUV;
  vec2 grain_uv = shape_uv;

  float r = u_rotation * PI / 180.;
  float cr = cos(r);
  float sr = sin(r);
  mat2 graphicRotation = mat2(cr, sr, -sr, cr);
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  grain_uv = transpose(graphicRotation) * grain_uv;
  grain_uv *= u_scale;
  grain_uv -= graphicOffset;
  grain_uv *= v_objectBoxSize;
  grain_uv *= .7;

  // ── Multi-blob shape ──
  // Coordinate system: top-anchored.
  // suv is derived from v_objectUV, scaled by 0.6, y-shifted so 0 = top.
  // Approximate ranges depend on aspect ratio and page height.

  float shape = 0.;
  float blobSz = max(u_blobSize, 0.15);
  vec2 suv = shape_uv * 0.6;
  // Shift y origin from center to top of page
  suv.y += 0.5 * 0.6; // 0.6 is the shape_uv scaling factor

  // ── Drift helper: multi-frequency chaotic motion, normalized ──
  // 4 incommensurate golden-ratio frequencies → non-repeating orbits.
  // Sum is bounded to [-1, 1] per axis. maxDrift scales the result.

  #define DRIFT(t, px, py, maxD) ( \
    maxD * vec2( \
      ( 0.40 * sin(1.0 * t + px)           \
      + 0.30 * sin(1.618 * t + px + 1.2)  \
      + 0.20 * sin(2.879 * t + px + 3.7)  \
      + 0.10 * sin(5.213 * t + px + 0.4)  \
      ) / 1.0, \
      ( 0.40 * cos(1.0 * t + py + 0.7)    \
      + 0.30 * cos(1.618 * t + py + 2.9)  \
      + 0.20 * cos(2.879 * t + py + 5.1)  \
      + 0.10 * cos(2.118 * t + py + 1.8)  \
      ) / 1.0  \
    ) \
  )

  // ── BLOB A: top-left, off-screen ──
  if (u_blobCount > 0.5) {
    vec2 anchor = vec2(-0.43, -0.68);
    vec2 drift = DRIFT(t, 0.0, 0.5, 0.17);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  // ── BLOB B: right side, slightly off-screen ──
  if (u_blobCount > 1.5) {
    vec2 anchor = vec2(0.55, -0.050);
    vec2 drift = DRIFT(t, 2.1, 2.6, 0.06);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  // ── BLOB C: left side, lower page ──
  if (u_blobCount > 2.5) {
    vec2 anchor = vec2(-0.63, 0.60);
    vec2 drift = DRIFT(t, 4.2, 4.7, 0.07);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  // ── BLOB D: (unused, set blobCount=4 to enable) ──
  if (u_blobCount > 3.5) {
    vec2 anchor = vec2(0.55, 0.65);
    vec2 drift = DRIFT(t, 6.3, 6.8, 0.07);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  // ── BLOB E: (unused, set blobCount=5 to enable) ──
  if (u_blobCount > 4.5) {
    vec2 anchor = vec2(-0.55, 1.20);
    vec2 drift = DRIFT(t, 8.4, 8.9, 0.07);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  // ── BLOB F: (unused, set blobCount=6 to enable) ──
  if (u_blobCount > 5.5) {
    vec2 anchor = vec2(0.55, 1.50);
    vec2 drift = DRIFT(t, 10.5, 11.0, 0.07);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  // ── BLOB G: (unused, set blobCount=7 to enable) ──
  if (u_blobCount > 6.5) {
    vec2 anchor = vec2(-0.55, 1.80);
    vec2 drift = DRIFT(t, 12.6, 13.1, 0.07);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  // ── BLOB H: (unused, set blobCount=8 to enable) ──
  if (u_blobCount > 7.5) {
    vec2 anchor = vec2(0.55, 2.10);
    vec2 drift = DRIFT(t, 14.7, 15.2, 0.07);
    float d = length(suv - anchor - drift);
    shape += smoothstep(blobSz, 0.0, d);
  }

  shape = clamp(shape, 0.0, 1.0);
  shape = smoothstep(0.0, 0.8, shape);

  // ── Grain + noise ──

  float baseNoise = snoise(grain_uv * .5);
  vec4 fbmVals = fbmR(
    .002 * grain_uv + 10.,
    .003 * grain_uv,
    .001 * grain_uv,
    rotate(.4 * grain_uv, 2.)
  );
  float grainDist = baseNoise * snoise(grain_uv * .2) - fbmVals.x - fbmVals.y;
  float rawNoise = .75 * baseNoise - fbmVals.w - fbmVals.z;
  float noise = clamp(rawNoise, 0., 1.);

  shape += u_intensity * 2. / u_colorsCount * (grainDist + .5);
  shape += u_noise * 10. / u_colorsCount * noise;

  float aa = fwidth(shape);

  shape = clamp(shape - .5 / u_colorsCount, 0., 1.);
  float totalShape = smoothstep(0., u_softness + 2. * aa, clamp(shape * u_colorsCount, 0., 1.));
  float mixer = shape * (u_colorsCount - 1.);

  int cntStop = int(u_colorsCount) - 1;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  for (int i = 1; i < ${MAX_COLORS}; i++) {
    if (i > cntStop) break;

    float localT = clamp(mixer - float(i - 1), 0., 1.);
    localT = smoothstep(.5 - .5 * u_softness - aa, .5 + .5 * u_softness + aa, localT);

    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localT);
  }

  vec3 color = gradient.rgb * totalShape;
  float opacity = gradient.a * totalShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  fragColor = vec4(color, opacity);
}
`;
