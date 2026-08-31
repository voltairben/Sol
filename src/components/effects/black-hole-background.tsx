"use client";

import { useEffect, useRef } from "react";
import { whenBootComplete } from "@/lib/boot-signal";

const VERT = `#version 300 es
in vec2 position;
out vec2 v_uv;
void main() {
  v_uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Numerical geodesic raymarcher in the Schwarzschild metric.
// Scroll drives the camera height + look-at so the event horizon sinks and
// tilts into the screen as the page scrolls.
const FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;
uniform float u_narrow;

#define PI 3.14159265359

vec3 colorPersimmon = vec3(1.0, 0.42, 0.21);
vec3 colorNeonBlue  = vec3(0.0, 0.94, 1.0);

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float vnoiseWrapY(vec2 p, float perY) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float y0 = mod(i.y, perY), y1 = mod(i.y + 1.0, perY);
  return mix(
    mix(hash21(vec2(i.x, y0)), hash21(vec2(i.x + 1.0, y0)), f.x),
    mix(hash21(vec2(i.x, y1)), hash21(vec2(i.x + 1.0, y1)), f.x),
    f.y
  );
}

vec2 rot(vec2 v, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

vec3 blackbody(float T) {
  float t = clamp(T, 1500.0, 40000.0) / 100.0;
  float r = t <= 66.0 ? 1.0 : clamp(1.292936 * pow(t - 60.0, -0.1332047), 0.0, 1.0);
  float g = t <= 66.0
    ? clamp(0.3900816 * log(t) - 0.6318414, 0.0, 1.0)
    : clamp(1.1298909 * pow(t - 60.0, -0.0755148), 0.0, 1.0);
  float b = t >= 66.0 ? 1.0 : (t <= 19.0 ? 0.0 : clamp(0.5432068 * log(t - 10.0) - 1.196254, 0.0, 1.0));
  return vec3(r, g, b);
}

vec3 getStarfield(vec3 d) {
  vec2 sph = vec2(atan(d.x, -d.z), asin(clamp(d.y, -1.0, 1.0)));
  vec2 g = sph * 50.0;
  vec2 id = floor(g);
  float h = hash21(id);
  if (h < 0.96) return vec3(0.0);
  vec2 f = fract(g) - 0.5;
  vec2 off = (vec2(hash21(id + 17.3), hash21(id + 31.7)) - 0.5) * 0.7;
  float spark = smoothstep(0.08, 0.0, length(f - off));
  float tw = 0.6 + 0.4 * sin(u_time * (1.0 + 3.0 * hash21(id + 5.1)));
  vec3 tint = mix(vec3(0.8, 0.85, 1.0), vec3(1.0, 0.85, 0.75), hash21(id + 2.7));
  return tint * spark * tw;
}

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  // Fit to height up to ~2:1, then switch to "cover": cap the horizontal
  // spread and crop vertically instead, so the disk keeps filling the width
  // on wide / ultrawide monitors rather than stranding black bands on the sides.
  float k = min(aspect, 2.0);
  vec2 aspectUV = (gl_FragCoord.xy / u_resolution) - vec2(0.5);
  aspectUV.x *= k;
  aspectUV.y *= k / aspect;

  float zCam = 18.0;
  float baseHeight = 2.4;
  float scrollFactor = u_scroll * 1.8;
  vec3 ro = vec3(0.0, baseHeight - scrollFactor, zCam);

  ro.xz = rot(ro.xz, u_mouse.x * 0.18);
  ro.yz = rot(ro.yz, clamp(u_mouse.y * 0.12 - u_scroll * 0.08, -0.15, 0.15));

  vec3 lookAt = vec3(0.0, -u_scroll * 0.5, 0.0);
  vec3 ww = normalize(lookAt - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = normalize(cross(uu, ww));

  float fov = u_narrow > 0.5 ? 0.95 : 1.35;
  vec3 rd = normalize(aspectUV.x * uu + aspectUV.y * vv + fov * ww);

  float r_s = 1.0;
  float h2 = dot(cross(ro, rd), cross(ro, rd));

  float r_in = 2.6;
  float r_out = 9.5;

  vec3 x = ro;
  vec3 v = rd;

  vec3 emitc = vec3(0.0);
  float trans = 1.0;
  bool captured = false;
  float sPrev = x.y;
  vec3 xPrev = x;

  int steps = u_narrow > 0.5 ? 95 : 175;

  for (int i = 0; i < steps; i++) {
    float r2 = dot(x, x);
    if (r2 < r_s * 1.002) { captured = true; break; }
    if (r2 > zCam * zCam * 2.8) break;

    float r = sqrt(r2);

    // Adaptive proximity speed limiter — keeps the near-disk loops concentric.
    float distToDiskPlane = abs(x.y);
    float dt = clamp(0.12 * r, 0.04, 1.35);
    if (r >= r_in && r <= r_out * 1.4) {
      dt = min(dt, max(0.015, distToDiskPlane * 0.45));
    }

    vec3 a = -1.5 * h2 * x / (r2 * r2 * r);
    v += a * (0.5 * dt);
    x += v * dt;
    r2 = dot(x, x);
    r = sqrt(r2);
    a = -1.5 * h2 * x / (r2 * r2 * r);
    v += a * (0.5 * dt);

    float s = x.y;
    if (s * sPrev < 0.0 && trans > 0.01) {
      float tc = sPrev / (sPrev - s);
      vec3 xc = mix(xPrev, x, tc);
      float rc = length(xc);

      if (rc >= r_in && rc <= r_out) {
        float band = smoothstep(r_in, r_in * 1.15, rc) * (1.0 - smoothstep(r_out * 0.8, r_out, rc));

        float phi = atan(xc.z, xc.x);
        float turns = phi / (2.0 * PI);
        float kepSpeed = pow(r_in / rc, 1.5);
        float dilation = sqrt(max(1.0 - 1.5 * r_s / rc, 0.05));
        float swirl = rc * 6.5 - u_time * kepSpeed * 4.5 * dilation;

        // How edge-on this crossing is viewed. Near 0 = the disk is grazed
        // almost tangentially (the arc lensed over the top, the ansae, the
        // photon ring): a wide swath of the disk collapses into a few pixels,
        // so the azimuthal streak coordinate races and the noise aliases into
        // stretched, crawling smears.
        float faceOn = smoothstep(0.04, 0.30, abs(normalize(v).y));

        float streaks = vnoiseWrapY(vec2(rc * 3.2, turns * 16.0 + swirl * 2.0), 16.0) * 0.6 +
                        vnoiseWrapY(vec2(rc * 1.2, turns * 8.0 + swirl * 1.0 + 5.0), 8.0) * 0.4;
        streaks = 0.2 + 1.8 * streaks * streaks;
        // Dissolve the fine filaments toward a smooth band where the image is
        // compressed, so the ring glides instead of smearing.
        streaks = mix(0.78, streaks, faceOn);

        vec3 gasDir = normalize(vec3(-xc.z, 0.0, xc.x));
        float beta = clamp(inversesqrt(max(2.0 * (rc - r_s), 0.1)), 0.0, 0.95);
        float g = dilation / max(1.0 + beta * dot(gasDir, normalize(v)), 0.05);

        float tProfile = pow(r_in / rc, 0.75) * pow(max(1.0 - sqrt(r_in / rc), 0.0), 0.25) / 0.488;
        float baseTemp = 6500.0;
        vec3 cbb = blackbody(baseTemp * tProfile * g);

        vec3 diskColor = mix(colorPersimmon, colorNeonBlue, clamp((g - 0.75) * 1.6, 0.0, 1.0));
        diskColor *= mix(vec3(1.2), cbb, 0.55);

        float boost = pow(g, 3.2);
        float density = band * streaks;
        emitc += trans * diskColor * (3.4 * density * tProfile * tProfile * boost);
        trans *= 1.0 - clamp(0.85 * density, 0.0, 1.0);
      }
    }
    sPrev = s;
    xPrev = x;
  }

  vec3 bg = vec3(0.0);
  if (!captured) bg += getStarfield(normalize(v));

  vec3 col = bg * trans + (vec3(1.0) - exp(-emitc * 1.05));

  vec2 uvDist = v_uv - 0.5;
  col *= 1.0 - 0.26 * dot(uvDist, uvDist);

  fragColor = vec4(col, 1.0);
}`;

/**
 * WebGL2 raymarched Schwarzschild black hole — geodesic photon tracing for real
 * gravitational lensing, an Interstellar-style double-arc disk, doppler beaming,
 * and a scroll-linked camera that sinks toward the disk plane as the page
 * scrolls. Adaptive resolution keeps it near 60fps, pauses when hidden, renders
 * one static frame under prefers-reduced-motion (scroll parallax disabled).
 * Solid #0B0F19 if WebGL2 is unavailable.
 *
 * ponytail: a full-screen raymarcher behind translucent panels is a real GPU
 * load — the adaptive res scaler is the safety valve; drop `steps` / kill the
 * panel blur if profiles on low-end hardware still stutter.
 */
export function BlackHoleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let teardown: (() => void) | null = null;

    // Deferred until the boot preloader is on its way out, so a page load
    // isn't hit with both GPU workloads at once. Runs immediately on routes
    // where no preloader shows.
    const startEngine = () => {
      const gl = canvas.getContext("webgl2", {
        antialias: false,
        powerPreference: "low-power",
        alpha: false,
      });
      if (!gl) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const compile = (src: string, type: number) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
          console.error("shader:", gl.getShaderInfoLog(sh));
          gl.deleteShader(sh);
          return null;
        }
        return sh;
      };

      const vs = compile(VERT, gl.VERTEX_SHADER);
      const fs = compile(FRAG, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return;

      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("link:", gl.getProgramInfoLog(prog));
        return;
      }
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const posLoc = gl.getAttribLocation(prog, "position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "u_resolution");
      const uTime = gl.getUniformLocation(prog, "u_time");
      const uMouse = gl.getUniformLocation(prog, "u_mouse");
      const uScroll = gl.getUniformLocation(prog, "u_scroll");
      const uNarrow = gl.getUniformLocation(prog, "u_narrow");

      const baseDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let narrow = window.innerWidth < 768;
      let scale = narrow ? 0.7 : 0.9;
      let maxScroll = 1;

      const resize = () => {
        narrow = window.innerWidth < 768;
        maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        canvas.width = Math.max(
          2,
          Math.round(window.innerWidth * baseDpr * scale),
        );
        canvas.height = Math.max(
          2,
          Math.round(window.innerHeight * baseDpr * scale),
        );
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = 1 - (e.clientY / window.innerHeight) * 2;
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      const scroll = { y: 0, ty: 0 };
      const onScroll = () => {
        scroll.ty = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      };
      if (!reduce) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      const t0 = performance.now();
      let raf = 0;
      let running = true;
      let last = t0;
      let slow = 0;

      const render = (now: number) => {
        const dt = now - last;
        last = now;
        // adaptive resolution — sustained slow frames shrink the render target
        if (dt > 20) slow++;
        else slow = Math.max(0, slow - 2);
        if (slow > 28 && scale > 0.4) {
          scale = Math.max(0.4, scale - 0.13);
          slow = 0;
          resize();
        }

        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        scroll.y += (scroll.ty - scroll.y) * 0.06;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        // Wrap elapsed time at 20 min — keeps it small enough that the shader's
        // hash / noise / sin terms stay float-precise instead of degrading into
        // shimmer after the tab's been open a while. One coherent phase jump per
        // wrap, imperceptible against the disk's turbulence.
        gl.uniform1f(uTime, ((now - t0) * 0.001) % 1200);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uScroll, scroll.y);
        gl.uniform1f(uNarrow, narrow ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (running && !reduce) raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);

      const onVisibility = () => {
        running = !document.hidden;
        if (running && !reduce) {
          cancelAnimationFrame(raf);
          last = performance.now();
          raf = requestAnimationFrame(render);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      teardown = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        gl.deleteProgram(prog);
        gl.deleteBuffer(buf);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    };

    const cancelWait = whenBootComplete(startEngine);

    return () => {
      cancelWait();
      teardown?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ background: "#0B0F19", filter: "contrast(1.05) saturate(1.1)" }}
      className="pointer-events-none fixed inset-0 -z-10 block h-full w-full"
    />
  );
}
