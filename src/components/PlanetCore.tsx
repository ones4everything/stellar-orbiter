import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetCoreProps {
  scrollProgress: number;
}

// Wireframe fallback while video loads
const WireframeSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial
        color="#00ffff"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

// Gradient planet fallback (no video dependency)
const GradientPlanet = ({ scrollProgress }: PlanetCoreProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentRotationY = useRef(0);
  const currentTilt = useRef(0);

  // Detect reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Detect mobile for performance
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  const segments = isMobile ? 32 : 64;

  // Create seasonal gradient colors
  const getSeasonalColor = useMemo(() => {
    if (scrollProgress < 0.25) return "#0ea5e9"; // Cyan for menu
    if (scrollProgress < 0.50) return "#22d3ee"; // Best selling - bright cyan
    if (scrollProgress < 0.625) return "#f472b6"; // Spring - pink
    if (scrollProgress < 0.75) return "#fbbf24"; // Summer - gold
    if (scrollProgress < 0.875) return "#f97316"; // Autumn - orange
    return "#60a5fa"; // Winter - ice blue
  }, [scrollProgress]);

  useFrame(() => {
    if (!meshRef.current || prefersReducedMotion) return;

    // Target rotation directly from scroll
    const targetRotationY = scrollProgress * Math.PI * 2;
    
    // Smooth interpolation for clean transitions
    currentRotationY.current = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotationY,
      0.06
    );

    // Apply rotation - static when scroll stops
    meshRef.current.rotation.y = currentRotationY.current;
    
    // Gentle tilt based on scroll progress
    const targetTilt = Math.sin(scrollProgress * Math.PI) * 0.15;
    currentTilt.current = THREE.MathUtils.lerp(
      currentTilt.current,
      targetTilt,
      0.04
    );
    meshRef.current.rotation.x = currentTilt.current;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, segments, segments]} />
      <meshStandardMaterial
        color={getSeasonalColor}
        toneMapped={false}
        roughness={0.2}
        metalness={0.8}
        emissive={getSeasonalColor}
        emissiveIntensity={0.3}
        envMapIntensity={1}
      />
    </mesh>
  );
};

const PlanetCore = (props: PlanetCoreProps) => {
  return (
    <Suspense fallback={<WireframeSphere />}>
      <GradientPlanet {...props} />
    </Suspense>
  );
};

export default PlanetCore;
