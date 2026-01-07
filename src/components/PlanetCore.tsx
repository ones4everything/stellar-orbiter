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

  // Load video texture with optimized settings
  const texture = useVideoTexture("/video/planet-seasons.mp4", {
    loop: true,
    muted: true,
    start: true,
    playsInline: true,
    crossOrigin: "anonymous",
  });

  // Configure texture for smoother transitions
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.anisotropy = 1;
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

    // Calculate target rotation based on scroll with smoother easing
    targetRotationY.current = scrollProgress * Math.PI * 2;

    // Smooth hover effect transition
    const hoverTarget = isHovered ? 0.5 : 0;
    hoverSpeed.current = THREE.MathUtils.lerp(hoverSpeed.current, hoverTarget, 0.03);

    // Very smooth interpolation to target rotation
    currentRotationY.current = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotationY.current,
      0.06
    );

    meshRef.current.rotation.y = currentRotationY.current + hoverSpeed.current * delta * 10;
    
    // Smoother tilt based on scroll with gentler oscillation
    const tiltAmount = Math.sin(scrollProgress * Math.PI) * 0.15;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      tiltAmount,
      0.04
    );
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, segments, segments]} />
      <meshStandardMaterial
        map={texture}
        toneMapped={false}
        roughness={0.3}
        metalness={0.7}
        emissive="#ffffff"
        emissiveIntensity={0.1}
        emissiveMap={texture}
        envMapIntensity={0.5}
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
