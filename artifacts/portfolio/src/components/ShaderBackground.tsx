import { useEffect, useRef } from "react";

const VERT_SRC = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG_SRC = /* glsl */ `
precision mediump float;

uniform float uTime;
uniform vec2  uResolution;

/* ── Smooth hash noise ─────────────────────────────────────── */
float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x),
    u.y
  );
}

/* ── 6-octave FBM with rotating frame ─────────────────────── */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2  rot = mat2( 0.8660, 0.5000,
                   -0.5000, 0.8660);
  for (int i = 0; i < 6; i++) {
    v  += a * vnoise(p);
    p   = rot * p * 2.03 + vec2(17.4, 31.8);
    a  *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  uv.x *= aspect;

  float t = uTime * 0.07;

  /* ── Domain warping ──────────────────────────────────────── */
  vec2 q = vec2(
    fbm(uv                        + t * vec2(0.45, 0.30)),
    fbm(uv + vec2(5.200,  1.300)  + t * vec2(0.32, 0.41))
  );

  vec2 r = vec2(
    fbm(uv + 1.2 * q + vec2(1.700, 9.200) + t * 0.38),
    fbm(uv + 1.2 * q + vec2(8.300, 2.800) + t * 0.22)
  );

  float f = fbm(uv + 1.5 * r + t * 0.12);

  /* ── Colour ramp: obsidian void → ember amber → forge red ── */
  /* Layer 1: near-black obsidian with warm undertone */
  vec3 col = vec3(0.023, 0.016, 0.008);

  /* Layer 2: deep ember bloom — driven by warp energy */
  col = mix(col,
    vec3(0.38, 0.12, 0.02),
    clamp(f * f * 4.5, 0.0, 1.0)
  );

  /* Layer 3: bright amber highlight from first warp */
  col = mix(col,
    vec3(0.85, 0.48, 0.04),
    clamp(length(q) * 0.65, 0.0, 1.0)
  );

  /* Layer 4: forge-red ember accent from second warp */
  col = mix(col,
    vec3(0.72, 0.12, 0.06),
    clamp(r.x * r.x * 0.55, 0.0, 1.0)
  );

  /* Layer 5: dark obsidian at the edges of warp flow */
  col = mix(col,
    vec3(0.10, 0.04, 0.01),
    clamp((1.0 - length(r)) * 0.40, 0.0, 1.0)
  );

  /* ── Global intensity ─────────────────────────────────────── */
  col *= 0.68;

  /* ── Radial vignette ─────────────────────────────────────── */
  vec2 vig = gl_FragCoord.xy / uResolution - 0.5;
  vig.x   *= aspect;
  float v  = 1.0 - dot(vig, vig) * 1.65;
  col     *= clamp(v, 0.0, 1.0);

  /* ── Subtle film grain ───────────────────────────────────── */
  float grain = hash(gl_FragCoord.xy + fract(uTime * 17.37)) * 0.025 - 0.012;
  col        += grain;

  /* ── Gamma ───────────────────────────────────────────────── */
  col = pow(clamp(col, 0.0, 1.0), vec3(0.82));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`Shader compile error:\n${log}`);
  }
  return s;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vert: WebGLShader,
  frag: WebGLShader
): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, vert);
  gl.attachShader(p, frag);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(`Program link error:\n${log}`);
  }
  return p;
}

const DPR = Math.min(window.devicePixelRatio ?? 1, 1.5);
const SCALE = 0.6;

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "default",
    }) as WebGLRenderingContext | null;

    if (!gl) return;

    let program: WebGLProgram;
    try {
      const vert = compileShader(gl, gl.VERTEX_SHADER,   VERT_SRC);
      const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
      program = linkProgram(gl, vert, frag);
    } catch (e) {
      console.warn("[ShaderBackground] WebGL compile failed:", e);
      return;
    }

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1,  1,  1,  1]),
      gl.STATIC_DRAW
    );

    const aPos    = gl.getAttribLocation(program,  "aPosition");
    const uTime   = gl.getUniformLocation(program, "uTime")!;
    const uRes    = gl.getUniformLocation(program, "uResolution")!;

    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    let w = 0, h = 0;
    function resize() {
      const W = Math.floor(window.innerWidth  * DPR * SCALE);
      const H = Math.floor(window.innerHeight * DPR * SCALE);
      if (W === w && H === h) return;
      w = W; h = H;
      canvas!.width  = w;
      canvas!.height = h;
      gl!.viewport(0, 0, w, h);
    }
    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };
    window.addEventListener("resize", onResize);

    let rafId: number;
    let startTime = performance.now();
    let lastFrame = 0;
    const TARGET_MS = 1000 / 30;

    function draw(now: number) {
      rafId = requestAnimationFrame(draw);
      if (now - lastFrame < TARGET_MS) return;
      lastFrame = now;
      if (document.hidden) return;
      const t = (now - startTime) * 0.001;
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uRes, w, h);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    if (prefersReduced) {
      gl.uniform1f(uTime, 8.5);
      gl.uniform2f(uRes, w, h);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      startTime = performance.now();
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        imageRendering: "auto",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
