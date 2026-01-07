import { Canvas } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import { Suspense } from "react";
import PlanetCore from "./PlanetCore";
import OrbitRings from "./OrbitRings";

interface Hero3DSceneProps {
  scrollProgress: number;
}

const Hero3DScene = ({ scrollProgress }: Hero3DSceneProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
          color="#ffffff"
        />
        {/* Cyan rim light */}
        <spotLight
          position={[-5, 2, -3]}
          intensity={1.5}
          color="#00ffff"
          angle={0.6}
          penumbra={1}
        />
        {/* Magenta fill light */}
        <spotLight
          position={[5, -2, -3]}
          intensity={1}
          color="#ff00ff"
          angle={0.6}
          penumbra={1}
        />

        {/* Stars background */}
        <Stars
          radius={100}
          depth={50}
          count={3000}
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
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
