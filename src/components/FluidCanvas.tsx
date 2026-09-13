"use client";

import React, { useEffect, useRef } from "react";

interface FluidCanvasProps {
  className?: string;
}

export const FluidCanvas: React.FC<FluidCanvasProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect WebGL support
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl = (canvas.getContext("webgl2", params) ||
      canvas.getContext("webgl", params) ||
      canvas.getContext("experimental-webgl", params)) as WebGLRenderingContext | WebGL2RenderingContext | null;

    if (!gl) {
      console.warn("WebGL not supported, fluid canvas inactive.");
      return;
    }

    const isWebGL2 = "WebGL2RenderingContext" in window && gl instanceof WebGL2RenderingContext;

    // Get extensions for float/half-float texture rendering
    let halfFloatExt: any = null;
    let floatExt: any = null;
    let linearExt: any = null;

    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloatExt = gl.getExtension("OES_texture_half_float");
      floatExt = gl.getExtension("OES_texture_float");
      linearExt = gl.getExtension("OES_texture_half_float_linear") || gl.getExtension("OES_texture_float_linear");
    }

    const halfFloatType = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : halfFloatExt?.HALF_FLOAT_OES || gl.UNSIGNED_BYTE;

    const textureType = halfFloatType;

    // Simulation resolutions
    const SIM_RES_X = 128;
    const SIM_RES_Y = 72;
    const DYE_RES_X = 512;
    const DYE_RES_Y = 288;

    // Shaders helper
    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return null;
      const prog = gl.createProgram();
      if (!prog) return null;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    }

    const baseVertexShader = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Clear Shader
    const clearShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uValue;
      void main() {
        gl_FragColor = uValue * texture2D(uTexture, vUv);
      }
    `;

    // Advection Shader
    const advectShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 uTexelSize;
      uniform float uDt;
      uniform float uDissipation;

      void main() {
        vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
        gl_FragColor = uDissipation * texture2D(uSource, coord);
      }
    `;

    // Divergence Shader
    const divergenceShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    // Curl Shader
    const curlShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    // Vorticity confinement Shader
    const vorticityShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float uCurlStrength;
      uniform float uDt;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= max(length(force), 0.0001);
        force *= uCurlStrength * C;
        force.y *= -1.0;

        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * uDt, 0.0, 1.0);
      }
    `;

    // Pressure Solver (Jacobi) Shader
    const pressureShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        float div = texture2D(uDivergence, vUv).x;
        float p = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
      }
    `;

    // Project (Gradient Subtraction) Shader
    const projectShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel -= vec2(R - L, T - B) * 0.5;
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    // Splat (Injection) Shader
    const splatShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float uAspectRatio;
      uniform vec3 uColor;
      uniform vec2 uPoint;
      uniform float uRadius;

      void main() {
        vec2 p = vUv - uPoint;
        p.x *= uAspectRatio;
        vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    // Final Display Shader with dreamy glow & top/bottom border edge containment
    const displayShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uDye;
      uniform vec2 uResolution;

      void main() {
        vec3 color = texture2D(uDye, vUv).rgb;
        
        // Tone-mapping: rich exponential curve
        vec3 mapped = vec3(1.0) - exp(-color * 1.6);

        // Smooth vertical border containment (fade near top y=1.0 and bottom y=0.0 so fluid never spills)
        float edgeY = smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
        float edgeX = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
        float edgeMask = edgeX * edgeY;

        // Subtle dark vignette
        vec2 centerOffset = vUv - 0.5;
        float distSq = dot(centerOffset, centerOffset);
        float vignette = clamp(1.0 - distSq * 1.1, 0.2, 1.0);

        gl_FragColor = vec4(mapped * edgeMask * vignette, edgeMask * 0.85);
      }
    `;

    // Compile programs
    const progClear = createProgram(gl, baseVertexShader, clearShader)!;
    const progAdvect = createProgram(gl, baseVertexShader, advectShader)!;
    const progDivergence = createProgram(gl, baseVertexShader, divergenceShader)!;
    const progCurl = createProgram(gl, baseVertexShader, curlShader)!;
    const progVorticity = createProgram(gl, baseVertexShader, vorticityShader)!;
    const progPressure = createProgram(gl, baseVertexShader, pressureShader)!;
    const progProject = createProgram(gl, baseVertexShader, projectShader)!;
    const progSplat = createProgram(gl, baseVertexShader, splatShader)!;
    const progDisplay = createProgram(gl, baseVertexShader, displayShader)!;

    // Fullscreen quad buffer
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    function createFbo(width: number, height: number): {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      attach: (id: number) => number;
    } {
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);

      if (isWebGL2) {
        gl!.texImage2D(
          gl!.TEXTURE_2D,
          0,
          (gl as WebGL2RenderingContext).RGBA16F,
          width,
          height,
          0,
          gl!.RGBA,
          gl!.HALF_FLOAT,
          null
        );
      } else {
        gl!.texImage2D(
          gl!.TEXTURE_2D,
          0,
          gl!.RGBA,
          width,
          height,
          0,
          gl!.RGBA,
          textureType,
          null
        );
      }

      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        texture,
        0
      );

      return {
        texture,
        fbo,
        width,
        height,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFbo(width: number, height: number) {
      let fbo1 = createFbo(width, height);
      let fbo2 = createFbo(width, height);
      return {
        width,
        height,
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          const tmp = fbo1;
          fbo1 = fbo2;
          fbo2 = tmp;
        },
      };
    }

    // Ping-pong buffers
    const velocity = createDoubleFbo(SIM_RES_X, SIM_RES_Y);
    const dye = createDoubleFbo(DYE_RES_X, DYE_RES_Y);
    const pressure = createDoubleFbo(SIM_RES_X, SIM_RES_Y);
    const divergence = createFbo(SIM_RES_X, SIM_RES_Y);
    const curl = createFbo(SIM_RES_X, SIM_RES_Y);

    function blit(destFbo: WebGLFramebuffer | null, width: number, height: number) {
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, destFbo);
      gl!.viewport(0, 0, width, height);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuffer);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
      gl!.enableVertexAttribArray(0);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    // Interactive pointer queue
    interface SplatEvent {
      x: number;
      y: number;
      dx: number;
      dy: number;
      color: [number, number, number];
    }
    const splatStack: SplatEvent[] = [];

    // Continuous stir helper
    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      splatStack.push({ x, y, dx, dy, color });
    }

    // DreamForge signature color generators (Cyan laser, Electric blue, Molten amber)
    const DREAM_COLORS: [number, number, number][] = [
      [0.0, 0.94, 1.0],   // Electric Laser Cyan #00F0FF
      [0.0, 0.65, 1.0],   // Cobalt Blue #00A6FF
      [1.0, 0.62, 0.0],   // Molten Forge Amber #FFA000
      [1.0, 0.35, 0.0],   // Heated Extruder Gold-Orange #FF5900
      [0.4, 0.2, 1.0],    // Deep Violet Resin
    ];
    let colorIndex = 0;

    const parent = canvas.parentElement || canvas;

    let prevPointerX = 0;
    let prevPointerY = 0;
    let isInteracting = false;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      if (!isInteracting) {
        prevPointerX = x;
        prevPointerY = y;
        isInteracting = true;
        return;
      }

      const dx = (x - prevPointerX) * 12.0;
      const dy = (y - prevPointerY) * 12.0;

      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        colorIndex = (colorIndex + 1) % DREAM_COLORS.length;
        const color = DREAM_COLORS[colorIndex];
        splat(x, y, dx * 65.0, dy * 65.0, color);
      }

      prevPointerX = x;
      prevPointerY = y;
    };

    const onPointerLeave = () => {
      isInteracting = false;
    };

    // Attach to parent container so moving anywhere over the section stirs the fluid
    parent.addEventListener("pointermove", onPointerMove, { passive: true });
    parent.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // Handle canvas sizing & DPR
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    // Idle emitters timer
    let step = 0;
    let animFrame = 0;
    let isDestroyed = false;

    const render = () => {
      if (isDestroyed) return;

      step++;
      const time = step / 60;

      // 1. Idle emitters: 2 gentle glowing orbits matching the user's WGSL specification
      const idleAx = 0.5 + 0.32 * Math.sin(0.68 * time);
      const idleAy = 0.5 + 0.22 * Math.sin(1.05 * time + 0.4);
      const idleBx = 0.5 + 0.28 * Math.sin(0.55 * time + Math.PI);
      const idleBy = 0.5 + 0.24 * Math.sin(0.92 * time + 2.1);

      const idleSpeedA = 0.45;
      const idleSpeedB = 0.42;
      const idleDirAx = Math.cos(time * 1.4) * idleSpeedA;
      const idleDirAy = Math.sin(time * 1.4) * idleSpeedA;
      const idleDirBx = -Math.sin(time * 1.1) * idleSpeedB;
      const idleDirBy = Math.cos(time * 1.1) * idleSpeedB;

      // Inject gentle continuous idle fluid
      splat(idleAx, idleAy, idleDirAx * 2.5, idleDirAy * 2.5, [0.0, 0.85, 1.0]); // Laser Cyan
      splat(idleBx, idleBy, idleDirBx * 2.5, idleDirBy * 2.5, [1.0, 0.48, 0.05]); // Forge Amber

      const dt = 0.016;

      // 2. Apply all queued splats to Velocity and Dye
      while (splatStack.length > 0) {
        const s = splatStack.pop()!;

        // Splat into velocity
        gl!.useProgram(progSplat);
        gl!.uniform1i(gl!.getUniformLocation(progSplat, "uTarget"), velocity.read.attach(0));
        gl!.uniform1f(gl!.getUniformLocation(progSplat, "uAspectRatio"), canvas.width / canvas.height);
        gl!.uniform2f(gl!.getUniformLocation(progSplat, "uPoint"), s.x, s.y);
        gl!.uniform3f(gl!.getUniformLocation(progSplat, "uColor"), s.dx, s.dy, 0.0);
        gl!.uniform1f(gl!.getUniformLocation(progSplat, "uRadius"), 0.0025);
        blit(velocity.write.fbo, SIM_RES_X, SIM_RES_Y);
        velocity.swap();

        // Splat into dye
        gl!.useProgram(progSplat);
        gl!.uniform1i(gl!.getUniformLocation(progSplat, "uTarget"), dye.read.attach(0));
        gl!.uniform1f(gl!.getUniformLocation(progSplat, "uAspectRatio"), canvas.width / canvas.height);
        gl!.uniform2f(gl!.getUniformLocation(progSplat, "uPoint"), s.x, s.y);
        gl!.uniform3f(gl!.getUniformLocation(progSplat, "uColor"), s.color[0] * 0.4, s.color[1] * 0.4, s.color[2] * 0.4);
        gl!.uniform1f(gl!.getUniformLocation(progSplat, "uRadius"), 0.0035);
        blit(dye.write.fbo, DYE_RES_X, DYE_RES_Y);
        dye.swap();
      }

      // 3. Curl pass
      gl!.useProgram(progCurl);
      gl!.uniform1i(gl!.getUniformLocation(progCurl, "uVelocity"), velocity.read.attach(0));
      gl!.uniform2f(gl!.getUniformLocation(progCurl, "uTexelSize"), 1.0 / SIM_RES_X, 1.0 / SIM_RES_Y);
      blit(curl.fbo, SIM_RES_X, SIM_RES_Y);

      // 4. Vorticity confinement pass (creates the curling turbulent smoke & fluid vortices)
      gl!.useProgram(progVorticity);
      gl!.uniform1i(gl!.getUniformLocation(progVorticity, "uVelocity"), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(progVorticity, "uCurl"), curl.attach(1));
      gl!.uniform1f(gl!.getUniformLocation(progVorticity, "uCurlStrength"), 22.0);
      gl!.uniform1f(gl!.getUniformLocation(progVorticity, "uDt"), dt);
      gl!.uniform2f(gl!.getUniformLocation(progVorticity, "uTexelSize"), 1.0 / SIM_RES_X, 1.0 / SIM_RES_Y);
      blit(velocity.write.fbo, SIM_RES_X, SIM_RES_Y);
      velocity.swap();

      // 5. Divergence pass
      gl!.useProgram(progDivergence);
      gl!.uniform1i(gl!.getUniformLocation(progDivergence, "uVelocity"), velocity.read.attach(0));
      gl!.uniform2f(gl!.getUniformLocation(progDivergence, "uTexelSize"), 1.0 / SIM_RES_X, 1.0 / SIM_RES_Y);
      blit(divergence.fbo, SIM_RES_X, SIM_RES_Y);

      // 6. Clear pressure
      gl!.useProgram(progClear);
      gl!.uniform1i(gl!.getUniformLocation(progClear, "uTexture"), pressure.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(progClear, "uValue"), 0.8);
      blit(pressure.write.fbo, SIM_RES_X, SIM_RES_Y);
      pressure.swap();

      // 7. Pressure solve (Jacobi iterations)
      gl!.useProgram(progPressure);
      gl!.uniform1i(gl!.getUniformLocation(progPressure, "uDivergence"), divergence.attach(1));
      gl!.uniform2f(gl!.getUniformLocation(progPressure, "uTexelSize"), 1.0 / SIM_RES_X, 1.0 / SIM_RES_Y);
      for (let i = 0; i < 18; i++) {
        gl!.uniform1i(gl!.getUniformLocation(progPressure, "uPressure"), pressure.read.attach(0));
        blit(pressure.write.fbo, SIM_RES_X, SIM_RES_Y);
        pressure.swap();
      }

      // 8. Gradient subtract / Project pass
      gl!.useProgram(progProject);
      gl!.uniform1i(gl!.getUniformLocation(progProject, "uPressure"), pressure.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(progProject, "uVelocity"), velocity.read.attach(1));
      gl!.uniform2f(gl!.getUniformLocation(progProject, "uTexelSize"), 1.0 / SIM_RES_X, 1.0 / SIM_RES_Y);
      blit(velocity.write.fbo, SIM_RES_X, SIM_RES_Y);
      velocity.swap();

      // 9. Advect Velocity
      gl!.useProgram(progAdvect);
      gl!.uniform1i(gl!.getUniformLocation(progAdvect, "uVelocity"), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(progAdvect, "uSource"), velocity.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(progAdvect, "uDt"), dt);
      gl!.uniform1f(gl!.getUniformLocation(progAdvect, "uDissipation"), 0.985);
      gl!.uniform2f(gl!.getUniformLocation(progAdvect, "uTexelSize"), 1.0 / SIM_RES_X, 1.0 / SIM_RES_Y);
      blit(velocity.write.fbo, SIM_RES_X, SIM_RES_Y);
      velocity.swap();

      // 10. Advect Dye
      gl!.useProgram(progAdvect);
      gl!.uniform1i(gl!.getUniformLocation(progAdvect, "uVelocity"), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(progAdvect, "uSource"), dye.read.attach(1));
      gl!.uniform1f(gl!.getUniformLocation(progAdvect, "uDt"), dt);
      gl!.uniform1f(gl!.getUniformLocation(progAdvect, "uDissipation"), 0.978);
      gl!.uniform2f(gl!.getUniformLocation(progAdvect, "uTexelSize"), 1.0 / SIM_RES_X, 1.0 / SIM_RES_Y);
      blit(dye.write.fbo, DYE_RES_X, DYE_RES_Y);
      dye.swap();

      // 11. Final output render to screen with tone-mapping and edge containment
      gl!.useProgram(progDisplay);
      gl!.uniform1i(gl!.getUniformLocation(progDisplay, "uDye"), dye.read.attach(0));
      gl!.uniform2f(gl!.getUniformLocation(progDisplay, "uResolution"), canvas.width, canvas.height);
      blit(null, canvas.width, canvas.height);

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
      gl?.deleteBuffer(quadBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        display: "block",
        willChange: "transform",
      }}
    />
  );
};
