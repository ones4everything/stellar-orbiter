import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitRingsProps {
  visible: boolean;
  scrollProgress: number;
}

const OrbitRings = ({ visible, scrollProgress }: OrbitRingsProps) => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: "#00ffff",
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame(() => {
    const targetOpacity = visible ? 0.15 + scrollProgress * 0.15 : 0;
    ringMaterial.opacity = THREE.MathUtils.lerp(ringMaterial.opacity, targetOpacity, 0.05);

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI * 0.4 + scrollProgress * 0.1;
      ring1Ref.current.rotation.z += 0.001;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI * 0.5 + scrollProgress * 0.15;
      ring2Ref.current.rotation.z -= 0.0008;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI * 0.3 + scrollProgress * 0.2;
      ring3Ref.current.rotation.z += 0.0005;
    }
  });

  return (
    <group>
      {/* Inner ring */}
      <mesh ref={ring1Ref} position={[0, 0, 0]}>
        <ringGeometry args={[3, 3.05, 64]} />
        <primitive object={ringMaterial} attach="material" />
      </mesh>

      {/* Middle ring */}
      <mesh ref={ring2Ref} position={[0, 0, 0]}>
        <ringGeometry args={[4, 4.03, 64]} />
        <primitive object={ringMaterial.clone()} attach="material" />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ring3Ref} position={[0, 0, 0]}>
        <ringGeometry args={[5, 5.02, 64]} />
        <primitive object={ringMaterial.clone()} attach="material" />
      </mesh>
    </group>
  );
};

export default OrbitRings;
