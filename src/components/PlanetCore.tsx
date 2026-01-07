import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

interface PlanetCoreProps {
  scrollProgress: number;
  isHovered: boolean;
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

// Video-textured planet
const VideoPlanet = ({ scrollProgress, isHovered }: PlanetCoreProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotationY = useRef(0);
  const currentRotationY = useRef(0);
  const hoverSpeed = useRef(0);

  // Detect reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Load video texture
  const texture = useVideoTexture("/video/planet-seasons.mp4", {
    loop: true,
    muted: true,
    start: true,
    playsInline: true,
    crossOrigin: "anonymous",
  });

  // Configure texture
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture]);

  // Detect mobile for performance
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  const segments = isMobile ? 32 : 64;

  useFrame((_, delta) => {
    if (!meshRef.current || prefersReducedMotion) return;

    // Calculate target rotation based on scroll
    targetRotationY.current = scrollProgress * Math.PI * 2;

    // Add hover effect
    if (isHovered) {
      hoverSpeed.current = THREE.MathUtils.lerp(hoverSpeed.current, 0.5, 0.05);
    } else {
      hoverSpeed.current = THREE.MathUtils.lerp(hoverSpeed.current, 0, 0.05);
    }

    // Smooth interpolation to target + hover rotation
    currentRotationY.current = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotationY.current,
      0.08
    );

    meshRef.current.rotation.y = currentRotationY.current + hoverSpeed.current * delta * 10;
    meshRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.2;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, segments, segments]} />
      <meshStandardMaterial
        map={texture}
        toneMapped={false}
        roughness={0.35}
        metalness={0.6}
        emissive="#ffffff"
        emissiveIntensity={0.15}
        emissiveMap={texture}
      />
    </mesh>
  );
};

const PlanetCore = (props: PlanetCoreProps) => {
  return (
    <Suspense fallback={<WireframeSphere />}>
      <VideoPlanet {...props} />
    </Suspense>
  );
};

export default PlanetCore;
