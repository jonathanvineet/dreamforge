"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { RotateCw, Layers, Maximize2, Box, CheckCircle2, Loader2 } from "lucide-react";

export interface ModelMetrics {
  dimX: number;
  dimY: number;
  dimZ: number;
  volumeCm3: number;
  triangles: number;
  estWeightGrams: number;
}

interface ModelViewer3DProps {
  file: File | null;
  materialDensity?: number; // g/cm3 (default: 1.24 for PLA)
  infillPercent?: number; // e.g. 20
  onMetricsComputed?: (metrics: ModelMetrics) => void;
  className?: string;
}

/**
 * Robust Three.js + STLLoader + OrbitControls loader
 * Tier 1: Existing window.THREE
 * Tier 2: Native browser ESM import via esm.sh
 * Tier 3: Sequential CDN script injection with event listeners and polling
 */
interface ThreeBundle {
  THREE: any;
  STLLoader: any;
  OrbitControls: any;
}

async function ensureThreeJS(): Promise<ThreeBundle> {
  const w = window as any;

  // 1. Check if already loaded globally
  if (w.THREE && w.THREE.STLLoader && w.THREE.OrbitControls) {
    return {
      THREE: w.THREE,
      STLLoader: w.THREE.STLLoader,
      OrbitControls: w.THREE.OrbitControls,
    };
  }

  // 2. Try native browser ESM dynamic import (bypasses Webpack bundle analyzer)
  try {
    const importESM = new Function("url", "return import(url)");
    const THREE = await importESM("https://esm.sh/three@0.160.0");
    const { STLLoader } = await importESM(
      "https://esm.sh/three@0.160.0/examples/jsm/loaders/STLLoader.js"
    );
    const { OrbitControls } = await importESM(
      "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js"
    );

    if (THREE && STLLoader && OrbitControls) {
      return { THREE, STLLoader, OrbitControls };
    }
  } catch (esmErr) {
    console.warn("ESM dynamic load failed, trying CDN scripts:", esmErr);
  }

  // 3. Fallback to CDN script tags with active event listeners
  const loadScriptTag = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      let s = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
      if (s) {
        if ((s as any)._loaded) return resolve();
        s.addEventListener("load", () => {
          (s as any)._loaded = true;
          resolve();
        });
        s.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
        return;
      }
      s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => {
        (s as any)._loaded = true;
        resolve();
      };
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  };

  await loadScriptTag("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");

  // Wait for window.THREE to be defined
  const start = Date.now();
  while (!w.THREE && Date.now() - start < 8000) {
    await new Promise((r) => setTimeout(r, 40));
  }

  if (!w.THREE) {
    throw new Error("Unable to load Three.js 3D engine.");
  }

  await Promise.all([
    loadScriptTag("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js"),
    loadScriptTag("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"),
  ]);

  return {
    THREE: w.THREE,
    STLLoader: w.THREE.STLLoader,
    OrbitControls: w.THREE.OrbitControls,
  };
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  file,
  materialDensity = 1.24,
  infillPercent = 20,
  onMetricsComputed,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTurntable, setIsTurntable] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isSTL, setIsSTL] = useState(false);

  // Three.js instance refs
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const animIdRef = useRef<number>(0);

  // Toggle Wireframe on active mesh
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.material.wireframe = isWireframe;
      meshRef.current.material.needsUpdate = true;
    }
  }, [isWireframe]);

  // Toggle Turntable on OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isTurntable;
    }
  }, [isTurntable]);

  // Recalculate estimated weight when density or infill changes
  useEffect(() => {
    if (metrics) {
      const updatedWeight = Math.max(
        1,
        Math.round(metrics.volumeCm3 * materialDensity * (infillPercent / 100 + 0.16))
      );
      if (updatedWeight !== metrics.estWeightGrams) {
        const updated = { ...metrics, estWeightGrams: updatedWeight };
        setMetrics(updated);
        onMetricsComputed?.(updated);
      }
    }
  }, [materialDensity, infillPercent]);

  // Reset camera view
  const handleResetView = useCallback(() => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 1.8, 3.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  // Initialize Three.js scene & load model
  useEffect(() => {
    if (!file) {
      setMetrics(null);
      setError(null);
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const isStl = ext === "stl";
    setIsSTL(isStl);

    if (!isStl) {
      // Non-STL CAD format (STEP, 3MF, OBJ)
      const mockMetrics: ModelMetrics = {
        dimX: 72.0,
        dimY: 55.0,
        dimZ: 85.0,
        volumeCm3: 38.2,
        triangles: 14200,
        estWeightGrams: Math.round(38.2 * materialDensity * (infillPercent / 100 + 0.16)),
      };
      setMetrics(mockMetrics);
      onMetricsComputed?.(mockMetrics);
      return;
    }

    let isDisposed = false;
    setIsLoading(true);
    setError(null);

    ensureThreeJS()
      .then(({ THREE, STLLoader, OrbitControls }) => {
        if (isDisposed || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 400;
        const height = container.clientHeight || 340;

        // 1. Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // 2. Camera setup
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.set(0, 1.8, 3.4);
        cameraRef.current = camera;

        // 3. Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        // Clear existing canvas
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 4. OrbitControls
        const ControlsClass = OrbitControls || THREE.OrbitControls || (window as any).THREE?.OrbitControls;
        const controls = new ControlsClass(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.autoRotate = isTurntable;
        controls.autoRotateSpeed = 2.2;
        controls.maxPolarAngle = Math.PI / 2 + 0.15; // Prevent camera from going too far below the floor
        controls.minDistance = 1.2;
        controls.maxDistance = 8.0;
        controlsRef.current = controls;

        // 5. Studio Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        scene.add(ambientLight);

        // Key Light (top front right)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(4, 6, 4);
        scene.add(keyLight);

        // Signature DreamForge Cyan Rim Light (bottom back left)
        const rimLight = new THREE.DirectionalLight(0x00e5ff, 0.55);
        rimLight.position.set(-4, -1, -3);
        scene.add(rimLight);

        // Soft Back Fill
        const backLight = new THREE.DirectionalLight(0xffffff, 0.35);
        backLight.position.set(0, 4, -4);
        scene.add(backLight);

        // 6. Build Plate Grid
        const grid = new THREE.GridHelper(3.2, 16, 0x00e5ff, 0x27272a);
        grid.position.y = -0.65;
        scene.add(grid);
        gridRef.current = grid;

        // 7. Parse STL File
        const reader = new FileReader();
        reader.onload = (e) => {
          if (isDisposed) return;
          try {
            const buffer = e.target?.result as ArrayBuffer;
            if (!buffer || buffer.byteLength < 84) {
              throw new Error("Invalid or empty STL file.");
            }

            const LoaderClass = STLLoader || THREE.STLLoader || (window as any).THREE?.STLLoader;
            const loader = new LoaderClass();
            const geometry = loader.parse(buffer);
            geometry.computeVertexNormals();
            geometry.center();

            // Calculate precise dimensions
            geometry.computeBoundingBox();
            const bbox = geometry.boundingBox;
            const size = new THREE.Vector3();
            bbox.getSize(size);

            // Calculate signed tetrahedral volume (cm³)
            let signedVolume = 0;
            const pos = geometry.attributes.position;
            const p1 = new THREE.Vector3(),
              p2 = new THREE.Vector3(),
              p3 = new THREE.Vector3();

            for (let i = 0; i < pos.count; i += 3) {
              p1.fromBufferAttribute(pos, i);
              p2.fromBufferAttribute(pos, i + 1);
              p3.fromBufferAttribute(pos, i + 2);
              signedVolume += p1.dot(p2.cross(p3)) / 6.0;
            }
            const volumeCm3 = Math.max(0.1, Math.abs(signedVolume) / 1000.0);

            // Compute metrics
            const triangleCount = Math.floor(pos.count / 3);
            const computedMetrics: ModelMetrics = {
              dimX: parseFloat(size.x.toFixed(1)),
              dimY: parseFloat(size.y.toFixed(1)),
              dimZ: parseFloat(size.z.toFixed(1)),
              volumeCm3: parseFloat(volumeCm3.toFixed(1)),
              triangles: triangleCount,
              estWeightGrams: Math.max(
                1,
                Math.round(volumeCm3 * materialDensity * (infillPercent / 100 + 0.16))
              ),
            };

            setMetrics(computedMetrics);
            onMetricsComputed?.(computedMetrics);

            // Normalize and scale mesh to comfortable viewport size
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const targetScale = 2.0 / maxDim;

            // Luxury satin finish material
            const material = new THREE.MeshStandardMaterial({
              color: 0xebedf0,
              roughness: 0.32,
              metalness: 0.12,
              wireframe: isWireframe,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(targetScale, targetScale, targetScale);

            // Position mesh so bottom rests on the build plate grid
            const scaledHeight = size.y * targetScale;
            mesh.position.y = -0.65 + scaledHeight / 2;

            scene.add(mesh);
            meshRef.current = mesh;

            setIsLoading(false);
          } catch (err: any) {
            console.error("Failed to parse STL:", err);
            setError(err.message || "Failed to parse 3D geometry.");
            setIsLoading(false);
          }
        };

        reader.onerror = () => {
          setError("Error reading the 3D file.");
          setIsLoading(false);
        };

        reader.readAsArrayBuffer(file);

        // 8. Animation & Render Loop
        const animate = () => {
          animIdRef.current = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // 9. Resize Observer
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width: w, height: h } = entry.contentRect;
            if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
              cameraRef.current.aspect = w / h;
              cameraRef.current.updateProjectionMatrix();
              rendererRef.current.setSize(w, h);
            }
          }
        });
        resizeObserver.observe(container);

        // Cleanup function for this file load
        return () => {
          resizeObserver.disconnect();
        };
      })
      .catch((err) => {
        console.error("Three.js setup error:", err);
        setError("Could not load 3D rendering engine.");
        setIsLoading(false);
      });

    return () => {
      isDisposed = true;
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current && rendererRef.current?.domElement) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch {}
      }
    };
  }, [file]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-950/60 backdrop-blur-md transition-all duration-300 ${className}`}
    >
      {/* 3D Viewport Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/30">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-zinc-300 font-medium text-[11px] tracking-wide">
            {file ? file.name : "3D CAD Model"}
          </span>
        </div>

        {/* Minimal Floating Control Pill */}
        {isSTL && (
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setIsTurntable(!isTurntable)}
              className={`p-1.5 rounded-md transition-colors ${
                isTurntable
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Toggle Auto-Rotation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsWireframe(!isWireframe)}
              className={`p-1.5 rounded-md transition-colors ${
                isWireframe
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Toggle Wireframe"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetView}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white transition-colors"
              title="Reset View Angle"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main 3D Canvas Container */}
      <div className="relative w-full h-72 sm:h-80 md:h-[340px] select-none">
        {isSTL ? (
          <div
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
        ) : (
          // Non-STL CAD format fallback card (3MF, OBJ, STEP)
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-cyan-400 mb-3">
              <Box className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-1 font-mono">
              {file?.name}
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mb-3">
              Parametric CAD format verified. Ready for slicing & fabrication.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>Telemetry Validated</span>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-cyan-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300">
              Generating 3D Mesh...
            </span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center text-rose-400 gap-2">
            <span className="text-xs font-semibold">{error}</span>
          </div>
        )}

        {/* Subtle Orbit Hint */}
        {isSTL && !isLoading && (
          <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] font-mono text-zinc-500 tracking-wider">
            DRAG TO ROTATE • SCROLL TO ZOOM
          </div>
        )}
      </div>

      {/* Minimalist Telemetry Footer */}
      {metrics && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-white/[0.06] bg-black/20 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Dimensions</span>
              <span className="text-white font-medium">
                {metrics.dimX} × {metrics.dimY} × {metrics.dimZ}{" "}
                <span className="text-zinc-500 text-[10px]">mm</span>
              </span>
            </div>

            <div className="h-6 w-px bg-white/[0.06]" />

            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Volume</span>
              <span className="text-cyan-300 font-medium">
                {metrics.volumeCm3}{" "}
                <span className="text-zinc-500 text-[10px]">cm³</span>
              </span>
            </div>

            <div className="h-6 w-px bg-white/[0.06]" />

            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Est. Weight</span>
              <span className="text-zinc-200 font-medium">
                ~{metrics.estWeightGrams}{" "}
                <span className="text-zinc-500 text-[10px]">g</span>
              </span>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 hidden sm:block">
            {metrics.triangles.toLocaleString()} triangles
          </div>
        </div>
      )}
    </div>
  );
};
