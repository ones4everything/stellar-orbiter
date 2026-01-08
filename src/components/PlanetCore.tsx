import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetCoreProps {
  scrollProgress: number;
}

// Seasonal color mapping (synced with Hero3D chapters)
// 0-25% = Spring (Pink), 25-50% = Summer (Gold), 50-75% = Autumn (Orange), 75-100% = Winter (Ice Blue)
const getSeasonalColors = (progress: number) => {
  if (progress < 0.25) {
    // Spring - Cherry blossom pink/purple
    return {
      main: new THREE.Color("#e879f9"),
      emissive: new THREE.Color("#d946ef"),
      intensity: 0.4,
    };
  }
  if (progress < 0.5) {
    // Summer - Vibrant green/gold
    return {
      main: new THREE.Color("#fbbf24"),
      emissive: new THREE.Color("#f59e0b"),
      intensity: 0.5,
    };
  }
  if (progress < 0.75) {
    // Autumn - Warm orange/red
    return {
      main: new THREE.Color("#f97316"),
      emissive: new THREE.Color("#ea580c"),
      intensity: 0.45,
    };
  }
  // Winter - Ice blue/white
  return {
    main: new THREE.Color("#38bdf8"),
    emissive: new THREE.Color("#0ea5e9"),
    intensity: 0.35,
  };
};

const PlanetCore = ({ scrollProgress }: PlanetCoreProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
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

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    // Get seasonal colors
    const seasonColors = getSeasonalColors(scrollProgress);

    // Smoothly interpolate material color
    materialRef.current.color.lerp(seasonColors.main, 0.05);
    materialRef.current.emissive.lerp(seasonColors.emissive, 0.05);
    materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      materialRef.current.emissiveIntensity,
      seasonColors.intensity,
      0.05
    );

    if (prefersReducedMotion) return;

    // Rotation tied to scroll (full rotation over entire scroll)
    const targetRotationY = scrollProgress * Math.PI * 2;

    currentRotationY.current = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotationY,
      0.06
    );

    meshRef.current.rotation.y = currentRotationY.current;

    // Subtle tilt based on scroll
    const targetTilt = Math.sin(scrollProgress * Math.PI * 2) * 0.1;
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
        ref={materialRef}
        color="#e879f9"
        toneMapped={false}
        roughness={0.15}
        metalness={0.85}
        emissive="#d946ef"
        emissiveIntensity={0.4}
        envMapIntensity={1.2}
      />
    </mesh>
  );
};

export default PlanetCore;
