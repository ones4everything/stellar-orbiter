import { Canvas } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useState } from "react";
import PlanetCore from "./PlanetCore";
import OrbitRings from "./OrbitRings";

interface Hero3DSceneProps {
  scrollProgress: number;
}

const Hero3DScene = ({ scrollProgress }: Hero3DSceneProps) => {
  const [webglAvailable, setWebglAvailable] = useState(true);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Seasonal lighting: continuous interpolation for smooth transitions
  // 0-25% = Spring, 25-50% = Summer, 50-75% = Fall, 75-100% = Winter
  const getSeasonalLighting = () => {
    // Spring: soft warm, subtle bloom
    if (scrollProgress < 0.25) {
      const blend = scrollProgress / 0.25;
      return { 
        rim: "#f0abfc", 
        fill: "#d946ef", 
        intensity: 1.3 + blend * 0.2,
        fogColor: "transparent",
        fogDensity: 0
      };
    }
    // Summer: bright warm, high saturation, crisp
    if (scrollProgress < 0.50) {
      const blend = (scrollProgress - 0.25) / 0.25;
      return { 
        rim: "#fde047", 
        fill: "#f59e0b", 
        intensity: 1.5 + blend * 0.3,
        fogColor: "transparent",
        fogDensity: 0
      };
    }
    // Fall: golden hour, warm orange/red, optional fog
    if (scrollProgress < 0.75) {
      const blend = (scrollProgress - 0.50) / 0.25;
      return { 
        rim: "#fb923c", 
        fill: "#ea580c", 
        intensity: 1.4 - blend * 0.2,
        fogColor: "#fbbf2420",
        fogDensity: blend * 0.3
      };
    }
    // Winter: cool blue, soft fog
    const blend = (scrollProgress - 0.75) / 0.25;
    return { 
      rim: "#7dd3fc", 
      fill: "#0ea5e9", 
      intensity: 1.2 - blend * 0.3,
      fogColor: "#e0f2fe30",
      fogDensity: 0.3 + blend * 0.2
    };
  };

  const seasonalLighting = getSeasonalLighting();

  if (!webglAvailable) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="rounded-xl border border-border bg-background/70 backdrop-blur px-4 py-3 text-sm text-muted-foreground">
          3D preview unavailable on this device/browser.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          const onContextLost = (e: Event) => {
            // prevent default to stop browser from spamming logs
            // and show our fallback UI instead
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e as any).preventDefault?.();
            setWebglAvailable(false);
          };
          gl.domElement.addEventListener("webglcontextlost", onContextLost, false);
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
          color="#ffffff"
        />
        {/* Seasonal rim light */}
        <spotLight
          position={[-5, 2, -3]}
          intensity={seasonalLighting.intensity}
          color={seasonalLighting.rim}
          angle={0.6}
          penumbra={1}
        />
        {/* Seasonal fill light */}
        <spotLight
          position={[5, -2, -3]}
          intensity={seasonalLighting.intensity * 0.7}
          color={seasonalLighting.fill}
          angle={0.6}
          penumbra={1}
        />

        {/* Stars background */}
        <Stars
          radius={100}
          depth={50}
          count={1200}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Main planet */}
        <Suspense fallback={null}>
          <PlanetCore scrollProgress={scrollProgress} />
        </Suspense>

        {/* Orbit rings */}
        <OrbitRings visible={scrollProgress > 0.1} scrollProgress={scrollProgress} />

        {/* Environment for reflections */}
        <Environment preset="night" />

        {/* Post-processing effects - disable when reduced motion for stability */}
        {!prefersReducedMotion && (
          <EffectComposer>
            {/* Subtle bloom for neon glow */}
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.65}
              luminanceSmoothing={0.9}
            />
            {/* Vignette for cinematic feel and depth */}
            <Vignette
              offset={0.25}
              darkness={0.7}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default Hero3DScene;

