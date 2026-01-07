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

  // Seasonal light colors based on scroll
  const getSeasonalAccent = () => {
    if (scrollProgress < 0.50) return { rim: "#00ffff", fill: "#ff00ff" }; // Default cyan/magenta
    if (scrollProgress < 0.625) return { rim: "#ffb7c5", fill: "#ff69b4" }; // Spring - cherry blossom pink
    if (scrollProgress < 0.75) return { rim: "#ffd700", fill: "#ff8c00" }; // Summer - golden/orange
    if (scrollProgress < 0.875) return { rim: "#ff6b35", fill: "#8b4513" }; // Autumn - orange/brown
    return { rim: "#87ceeb", fill: "#4169e1" }; // Winter - ice blue
  };

  const seasonalColors = getSeasonalAccent();

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
          intensity={1.5}
          color={seasonalColors.rim}
          angle={0.6}
          penumbra={1}
        />
        {/* Seasonal fill light */}
        <spotLight
          position={[5, -2, -3]}
          intensity={1}
          color={seasonalColors.fill}
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

