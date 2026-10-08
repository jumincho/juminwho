import { prefersReducedMotion, REDUCED_MOTION } from './motion'
import { subscribeToMedia } from './subscribe'
import { subscribeToTheme } from './theme'

/*
 * The page backdrop as a small WebGL fragment shader: pastel blobs that drift
 * on slow paths and melt into one soft body where they meet, their edges
 * kneaded a little by noise, like mochi dough. The picture is soft, so
 * it is drawn at a fraction of the screen's resolution and stretched, at most
 * 30 times a second, and not at all while the tab is hidden. With reduced
 * motion it holds one still frame. Colours come from the theme tokens
 * (--bg, --blob-a … --blob-d, --blob-opacity) and follow theme switches.
 */

type Rgb = [number, number, number]

/** Longest side of the drawing buffer in px; smaller screens draw at half their CSS size. */
const MAX_SIDE = 640
const SCALE = 0.5
const FRAME_MS = 1000 / 30

/** The four blob colours of the theme. */
const TOKENS = ['--blob-a', '--blob-b', '--blob-c', '--blob-d'] as const

/**
 * Where each blob rests, how big it is and how it wanders, in vmax units
 * (1 = the viewport's longer side). `anchor` is a point of the viewport as
 * fractions of its width and height, `offset` the resting centre from there.
 * Each blob drifts by `drift` and swells by `swell` and back over `period`
 * seconds. The first four sit where the CSS fallback's blobs do
 * (Backdrop.module.css); two small ones roam between them and now and then
 * melt into a big one.
 */
const BLOBS = [
  { color: 0, anchor: [0, 0], offset: [0.1, 0.08], radius: 0.28, drift: [0.1, 0.07], swell: 0.12, period: 92 },
  { color: 1, anchor: [1, 0.06], offset: [-0.04, 0.2], radius: 0.24, drift: [-0.09, 0.12], swell: -0.1, period: 104 },
  { color: 2, anchor: [0.08, 1], offset: [0.22, -0.02], radius: 0.26, drift: [0.12, -0.08], swell: 0.08, period: 116 },
  { color: 3, anchor: [0.96, 0.96], offset: [-0.18, -0.18], radius: 0.22, drift: [-0.1, -0.1], swell: 0.15, period: 84 },
  { color: 0, anchor: [0.5, 0.5], offset: [0.12, -0.16], radius: 0.1, drift: [0.22, 0.1], swell: 0.2, period: 64 },
  { color: 3, anchor: [0.5, 0.5], offset: [-0.24, 0.1], radius: 0.085, drift: [-0.12, -0.16], swell: 0.25, period: 72 },
] as const

const VERTEX = `
attribute vec2 aCorner;
void main() {
  gl_Position = vec4(aCorner, 0.0, 1.0);
}`

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uSize;        // drawing buffer, px
uniform float uTime;       // s
uniform vec3 uBlobs[${BLOBS.length}];    // centre (y up) and radius, in vmax
uniform vec3 uColors[${BLOBS.length}];
uniform vec3 uBackground;
uniform float uStrength;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 p = gl_FragCoord.xy / max(uSize.x, uSize.y);

  // Knead the space slowly so every edge wobbles like soft dough.
  vec2 q = p * 3.0;
  vec2 knead = vec2(noise(q + vec2(0.0, uTime * 0.06)), noise(q + vec2(5.2, -uTime * 0.05))) - 0.5;
  knead += 0.35 * (vec2(noise(q * 2.2 + vec2(1.7, uTime * 0.09)), noise(q * 2.2 + vec2(-3.1, -uTime * 0.08))) - 0.5);
  p += knead * 0.075;

  vec3 sum = vec3(0.0);
  float total = 0.0;
  for (int i = 0; i < ${BLOBS.length}; i++) {
    vec2 d = (p - uBlobs[i].xy) / uBlobs[i].z;
    float f = exp(-2.0 * dot(d, d));
    sum += uColors[i] * f;
    total += f;
  }

  // Where blobs meet their fields add up, and they melt into one body.
  vec3 blob = sum / max(total, 0.0001);
  float cover = smoothstep(0.14, 0.68, total) * uStrength;
  vec3 color = mix(uBackground, blob, cover);

  // A whisper of noise keeps the long, smooth ramps from banding.
  color += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;
  gl_FragColor = vec4(color, 1.0);
}`

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

function link(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  if (vertex && fragment && program) {
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
  }
  // The program keeps what it needs; the shaders themselves can go.
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (program && gl.getProgramParameter(program, gl.LINK_STATUS)) return program
  gl.deleteProgram(program)
  return null
}

/** Any CSS colour as 0–1 RGB, normalised by a 2D canvas (it answers "#rrggbb" for opaque colours). */
function parseColor(probe: CanvasRenderingContext2D, css: string): Rgb {
  probe.fillStyle = '#000'
  probe.fillStyle = css
  const value = String(probe.fillStyle)
  if (value.startsWith('#')) return [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16) / 255) as Rgb
  const [r = 0, g = 0, b = 0] = value.match(/[\d.]+/g)?.map(Number) ?? []
  return [r / 255, g / 255, b / 255]
}

/**
 * Starts the shader backdrop on `canvas` and returns a function that stops
 * it, or returns nothing when WebGL is missing or would run in software;
 * the CSS blobs stay then. While it paints, the canvas carries
 * `data-painting` (Backdrop.module.css hides the CSS blobs), and
 * `data-playing` while it moves.
 */
export function startMochiField(canvas: HTMLCanvasElement): (() => void) | undefined {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: true,
  })
  const probe = document.createElement('canvas').getContext('2d')
  const program = gl && probe ? link(gl) : null
  if (!gl || !probe || !program) return

  const corners = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, corners)
  // One triangle that covers the whole screen.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const corner = gl.getAttribLocation(program, 'aCorner')
  gl.enableVertexAttribArray(corner)
  gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0)
  gl.useProgram(program)

  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const uSize = uniform('uSize')
  const uTime = uniform('uTime')
  const uBlobs = uniform('uBlobs')
  const uColors = uniform('uColors')
  const uBackground = uniform('uBackground')
  const uStrength = uniform('uStrength')

  const readColors = () => {
    const style = getComputedStyle(document.documentElement)
    gl.uniform3fv(uBackground, parseColor(probe, style.getPropertyValue('--bg')))
    const palette = TOKENS.map((token) => parseColor(probe, style.getPropertyValue(token)))
    gl.uniform3fv(uColors, BLOBS.flatMap((blob) => palette[blob.color]))
    const strength = Number.parseFloat(style.getPropertyValue('--blob-opacity'))
    gl.uniform1f(uStrength, Number.isFinite(strength) ? strength : 0.8)
  }

  let width = 0
  let height = 0
  const resize = () => {
    const scale = Math.min(SCALE, MAX_SIDE / Math.max(window.innerWidth, window.innerHeight, 1))
    width = Math.max(1, Math.round(window.innerWidth * scale))
    height = Math.max(1, Math.round(window.innerHeight * scale))
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
    gl.uniform2f(uSize, width, height)
  }

  /** Draws the field `time` seconds into its slow dance (0 is the resting layout). */
  const draw = (time: number) => {
    const vmax = Math.max(width, height)
    const blobs = BLOBS.flatMap(({ anchor, offset, radius, drift, swell, period }) => {
      const phase = 0.5 - 0.5 * Math.cos((2 * Math.PI * time) / period)
      const x = (anchor[0] * width) / vmax + offset[0] + drift[0] * phase
      const y = (anchor[1] * height) / vmax + offset[1] + drift[1] * phase
      // CSS measures y downwards; the shader upwards.
      return [x, height / vmax - y, radius * (1 + swell * phase)]
    })
    gl.uniform3fv(uBlobs, blobs)
    gl.uniform1f(uTime, time)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  // The field keeps its own time, which only runs while it plays and the tab
  // is visible: after a while in a background tab it carries on where it was.
  let seconds = 0
  let frame = 0
  let last = 0
  const loop = (now: number) => {
    frame = requestAnimationFrame(loop)
    const gap = last ? now - last : 0
    // A little slack, so a 60 Hz screen draws every other frame rather than every third.
    if (last && gap < FRAME_MS - 3) return
    seconds += Math.min(gap, 100) / 1000
    last = now
    draw(seconds)
  }
  /** Moves while motion is welcome; with reduced motion, holds the frame it is on. */
  const play = () => {
    cancelAnimationFrame(frame)
    last = 0
    if (prefersReducedMotion()) {
      delete canvas.dataset.playing
    } else {
      canvas.dataset.playing = ''
      frame = requestAnimationFrame(loop)
    }
    draw(seconds)
  }

  let resizeFrame = 0
  const onResize = () => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => {
      resize()
      draw(seconds)
    })
  }

  resize()
  readColors()
  play()
  canvas.dataset.painting = ''
  window.addEventListener('resize', onResize)
  const unsubscribeMotion = subscribeToMedia(REDUCED_MOTION)(play)
  const unsubscribeTheme = subscribeToTheme(() => {
    readColors()
    draw(seconds)
  })

  const stop = () => {
    cancelAnimationFrame(frame)
    cancelAnimationFrame(resizeFrame)
    window.removeEventListener('resize', onResize)
    canvas.removeEventListener('webglcontextlost', stop)
    unsubscribeMotion()
    unsubscribeTheme()
    delete canvas.dataset.painting
    delete canvas.dataset.playing
  }
  // If the GPU drops the context, give the page back to the CSS blobs.
  canvas.addEventListener('webglcontextlost', stop)

  return () => {
    stop()
    gl.deleteBuffer(corners)
    gl.deleteProgram(program)
  }
}
