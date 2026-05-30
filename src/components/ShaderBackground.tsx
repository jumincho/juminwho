import { useEffect, useRef } from 'react'

/**
 * ShaderBackground — a hand-written WebGL fragment shader.
 *
 * A domain-warped simplex-noise nebula that breathes, drifts, and leans toward
 * the pointer. No three.js, no libraries: raw GLSL on a single fullscreen
 * triangle. Built to be a good citizen — caps device pixel ratio, pauses when
 * off-screen or tab-hidden, renders a single still frame for users who prefer
 * reduced motion, recovers from context loss, and falls back to a CSS gradient
 * if WebGL is unavailable.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_pointer;

// --- Ashima 2D simplex noise ---
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ s += a * snoise(p); p *= 2.02; a *= 0.5; }
  return s;
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;
  float t = u_time * 0.045;

  // domain warp
  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)),
                fbm(p * 1.4 + vec2(5.2, 1.3) - t));
  float f = fbm(p * 1.4 + 1.8 * q + vec2(1.7, 9.2));
  f = 0.5 + 0.5 * f;

  // palette — soft cherry-blossom watercolor (light & airy)
  vec3 base  = vec3(0.995, 0.965, 0.975);  // warm blush white
  vec3 pink  = vec3(1.000, 0.760, 0.855);  // sakura
  vec3 sky   = vec3(0.715, 0.875, 1.000);  // spring sky
  vec3 lav   = vec3(0.855, 0.795, 1.000);  // wisteria
  vec3 peach = vec3(1.000, 0.855, 0.730);  // peach
  vec3 mint  = vec3(0.800, 0.970, 0.880);  // soft mint

  vec3 col = base;
  col = mix(col, pink,  smoothstep(0.18, 0.72, f) * 0.92);
  col = mix(col, sky,   smoothstep(0.42, 0.96, f + 0.28 * q.x) * 0.62);
  col = mix(col, lav,   smoothstep(0.28, 0.82, 0.5 + 0.5 * q.y) * 0.50);
  col = mix(col, peach, smoothstep(0.76, 1.06, f + 0.22 * q.y) * 0.70);
  col = mix(col, mint,  smoothstep(0.55, 0.94, f - 0.22 * q.x) * 0.26);
  col = mix(col, vec3(1.0), 0.10 * (1.0 - f));  // keep it luminous

  // pointer glow — a soft warm bloom that follows the cursor
  vec2 m = (u_mouse - 0.5 * u_res.xy) / u_res.y;
  float d = length(p - m);
  col += (pink * 0.55 + sky * 0.35) * (0.07 / (d * 6.0 + 0.5)) * u_pointer;

  // gentle light vignette — brighten the centre, never darken to murk
  col = mix(col, col + 0.06, smoothstep(1.30, 0.10, length(p)));
  col = clamp(col, 0.0, 1.0);

  // whisper-soft grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + u_time) * 43758.5453);
  col += (g - 0.5) * 0.015;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fallbackBG =
      'radial-gradient(120% 120% at 30% 20%, #ffe3ef 0%, #fdeef6 45%, #eef3ff 100%)'

    const gl =
      canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)

    if (!gl) {
      canvas.style.background = fallbackBG
      return
    }

    let raf = 0
    let running = true
    let program: WebGLProgram | null = null
    let uRes: WebGLUniformLocation | null = null
    let uTime: WebGLUniformLocation | null = null
    let uMouse: WebGLUniformLocation | null = null
    let uPointer: WebGLUniformLocation | null = null

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
    const quality = 0.72
    const start = performance.now()

    // pointer state (in drawing-buffer pixels)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, present: 0, tPresent: 0 }

    function setup(): boolean {
      if (!gl) return false
      const vs = compile(gl, gl.VERTEX_SHADER, VERT)
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
      if (!vs || !fs) return false
      const prog = gl.createProgram()
      if (!prog) return false
      gl.attachShader(prog, vs)
      gl.attachShader(prog, fs)
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
      gl.useProgram(prog)
      program = prog

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'p')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

      uRes = gl.getUniformLocation(prog, 'u_res')
      uTime = gl.getUniformLocation(prog, 'u_time')
      uMouse = gl.getUniformLocation(prog, 'u_mouse')
      uPointer = gl.getUniformLocation(prog, 'u_pointer')
      return true
    }

    function resize() {
      if (!gl) return
      const w = Math.max(1, Math.floor(canvas!.clientWidth * pixelRatio * quality))
      const h = Math.max(1, Math.floor(canvas!.clientHeight * pixelRatio * quality))
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    function render(now: number) {
      if (!gl || !running) return
      resize()
      const w = canvas!.width
      const h = canvas!.height
      // smooth pointer
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      mouse.present += (mouse.tPresent - mouse.present) * 0.04
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform2f(uMouse, mouse.x, h - mouse.y)
      gl.uniform1f(uPointer, mouse.present)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduce) raf = requestAnimationFrame(render)
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.tx = (e.clientX - rect.left) * pixelRatio * quality
      mouse.ty = (e.clientY - rect.top) * pixelRatio * quality
      mouse.tPresent = 1
    }
    function onLeave() { mouse.tPresent = 0 }

    function loop() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(render)
    }

    // visibility / off-screen pausing
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !document.hidden
      if (running && !reduce) loop()
    })
    function onVisibility() {
      running = !document.hidden
      if (running && !reduce) loop()
    }

    // context loss recovery
    function onLost(e: Event) { e.preventDefault(); cancelAnimationFrame(raf) }
    function onRestored() { if (setup()) { resize(); if (!reduce) loop(); else render(performance.now()) } }

    if (!setup()) {
      canvas.style.background = fallbackBG
      return
    }
    resize()
    canvas.addEventListener('webglcontextlost', onLost as EventListener, false)
    canvas.addEventListener('webglcontextrestored', onRestored, false)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerout', onLeave, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    io.observe(canvas)

    if (reduce) render(performance.now())
    else loop()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onLost as EventListener)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      const ext = gl.getExtension('WEBGL_lose_context')
      if (program) gl.deleteProgram(program)
      ext?.loseContext()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 0 }}
    />
  )
}
