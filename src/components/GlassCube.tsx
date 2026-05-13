import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { useResponsiveSettings } from "../hooks/useResponsiveSettings";

function SceneSetup({ onContextLost }: { onContextLost: () => void }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    // Three.js scene objects are external mutable renderer state, not React state.
    // eslint-disable-next-line react-hooks/immutability
    scene.background = null;
    gl.setClearColor(0x000000, 0);

    const canvas = gl.domElement;
    const handleLost = (e: Event) => {
      e.preventDefault();
      console.error("[GlassCube] WebGL Context Lost");
      onContextLost();
    };
    const handleRestored = () => {
      scene.background = null;
      gl.setClearColor(0x000000, 0);
    };

    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    };
  }, [scene, gl, onContextLost]);

  useFrame(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (scene.background !== null) scene.background = null;
  });

  return null;
}

const glassMaterialProps = {
  thickness: 0.1,
  roughness: 0.1,
  transmission: 1,
  ior: 1.27,
  chromaticAberration: 0.2,
  backside: true,
  attenuationDistance: 3,
  envMapIntensity: 0.18,
  reflectivity: 0.04,
  metalness: 0,
};

function useGlassRotation(
  ref: RefObject<THREE.Object3D | null>,
  speed = 1,
  interactive = true,
  motionScale = 1,
) {
  const { pointer } = useThree();
  const rot = useRef({ rx: 0, ry: 0 });

  useFrame((_, delta) => {
    if (!ref.current) return;
    rot.current.rx += delta * 0.15 * speed * motionScale;
    rot.current.ry += delta * 0.25 * speed * motionScale;
    ref.current.rotation.x =
      rot.current.rx + (interactive ? pointer.y * 0.3 : 0);
    ref.current.rotation.y =
      rot.current.ry + (interactive ? pointer.x * 0.2 : 0);
    ref.current.rotation.z = interactive
      ? pointer.x * 0.1
      : Math.sin(rot.current.ry) * 0.08;
  });
}

function findFirstMeshGeometry(
  root: THREE.Object3D,
): THREE.BufferGeometry | null {
  let geometry: THREE.BufferGeometry | null = null;

  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!geometry && mesh.isMesh) {
      geometry = mesh.geometry;
    }
  });

  return geometry;
}

function useRoundedCubeGeometry() {
  const gltf = useGLTF("/rounded_diamond.glb") as { scene: THREE.Group };

  return useMemo(() => {
    const sourceGeometry = findFirstMeshGeometry(gltf.scene);

    if (!sourceGeometry) {
      return new THREE.BoxGeometry(2.4, 2.4, 2.4, 8, 8, 8);
    }

    const geometry = sourceGeometry.clone();
    geometry.computeBoundingBox();

    if (geometry.boundingBox) {
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      geometry.boundingBox.getSize(size);

      const maxAxis = Math.max(size.x, size.y, size.z);
      const scale = maxAxis > 0 ? 1 / maxAxis : 1;
      geometry.translate(-center.x, -center.y, -center.z);
      geometry.scale(scale, scale, scale);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, [gltf.scene]);
}

function SceneLogo() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const { viewport, gl } = useThree();
  const { isDesktop } = useResponsiveSettings();

  useEffect(() => {
    let disposed = false;
    const image = new Image();
    image.src = "/logo.svg";

    image.onload = () => {
      if (disposed) return;

      const canvas = document.createElement("canvas");
      canvas.width = isDesktop ? 4096 : 2048;
      canvas.height = isDesktop ? 1125 : 563;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const canvasTexture = new THREE.CanvasTexture(canvas);
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      canvasTexture.anisotropy = Math.min(
        8,
        gl.capabilities.getMaxAnisotropy(),
      );
      canvasTexture.needsUpdate = true;
      setTexture(canvasTexture);
    };

    return () => {
      disposed = true;
      setTexture((current) => {
        current?.dispose();
        return null;
      });
    };
  }, [gl, isDesktop]);

  if (!texture) return null;

  return (
    <mesh
      position={[0, 0, -2.2]}
      scale={[viewport.width * 0.45, viewport.width * 0.13, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.1}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

interface FloatingCubeProps {
  geometry: THREE.BufferGeometry;
  index: number;
  count: number;
  scale: number;
  radius: number;
  interactive: boolean;
  motionScale: number;
  materialResolution: number;
  materialSamples: number;
}

function FloatingCube({
  geometry,
  index,
  count,
  scale,
  radius,
  interactive,
  motionScale,
  materialResolution,
  materialSamples,
}: FloatingCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();
  const phase = (index / count) * Math.PI * 2;
  const verticalPhase = phase * 1.7;
  const position = useRef(
    new THREE.Vector3(
      Math.cos(phase) * radius,
      Math.sin(verticalPhase) * radius * 0.58,
      Math.sin(phase) * 0.45,
    ),
  );
  const velocity = useRef(new THREE.Vector3());
  useGlassRotation(meshRef, 0.7 + index * 0.12, interactive, motionScale);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime * 0.55;
    const pointerWorld = new THREE.Vector3(
      pointer.x * viewport.width * 0.5,
      pointer.y * viewport.height * 0.5,
      0,
    );
    const target = new THREE.Vector3(
      Math.cos(t + phase) * radius,
      Math.sin(t * 0.85 + verticalPhase) * radius * 0.58,
      Math.sin(t + phase) * 0.45,
    );

    const distance = position.current.distanceTo(pointerWorld);
    const pointerActive =
      interactive &&
      (Math.abs(pointer.x) > 0.015 || Math.abs(pointer.y) > 0.015);
    if (pointerActive && distance < 0.75) {
      const release = position.current
        .clone()
        .sub(pointerWorld)
        .normalize()
        .multiplyScalar((0.75 - distance) * 14 * delta);
      velocity.current.add(release);
    } else {
      const magnet = target.sub(position.current).multiplyScalar(7 * delta);
      velocity.current.add(magnet);
    }

    velocity.current.multiplyScalar(0.9);
    position.current.addScaledVector(velocity.current, delta * 4);
    meshRef.current.position.copy(position.current);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <MeshTransmissionMaterial
        {...glassMaterialProps}
        samples={materialSamples}
        resolution={materialResolution}
      />
    </mesh>
  );
}

interface PrimaryGlassCubeProps {
  geometry: THREE.BufferGeometry;
  materialResolution: number;
  materialSamples: number;
  motionScale?: number;
}

function PrimaryGlassCube({
  geometry,
  materialResolution,
  materialSamples,
  motionScale = 1,
}: PrimaryGlassCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useGlassRotation(meshRef, 0.5, true, motionScale);

  useFrame((state) => {
    if (!meshRef.current) return;

    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.025;
    meshRef.current.scale.setScalar(breathe);
    meshRef.current.position.x = pointer.x * 0.08;
    meshRef.current.position.y = pointer.y * 0.06;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <MeshTransmissionMaterial
        {...glassMaterialProps}
        samples={materialSamples}
        resolution={materialResolution}
      />
    </mesh>
  );
}

function SingleGlassCube() {
  const geometry = useRoundedCubeGeometry();
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const { isTabletUp, prefersReducedMotion } = useResponsiveSettings();
  const scale = Math.min(
    viewport.width / (isTabletUp ? 2.2 : 1.45),
    isTabletUp ? 2.35 : 1.65,
  );

  useGlassRotation(meshRef, 0.65, false, prefersReducedMotion ? 0.25 : 0.45);

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <MeshTransmissionMaterial
        {...glassMaterialProps}
        samples={isTabletUp ? 3 : 2}
        resolution={isTabletUp ? 384 : 256}
      />
    </mesh>
  );
}

function GlassCubeCluster() {
  const geometry = useRoundedCubeGeometry();
  const { viewport } = useThree();
  const baseScale = Math.min(viewport.width / 2, 2.8);

  const cubes = [
    { scale: 0.26, radius: 0.6 },
    { scale: 0.22, radius: 0.7 },
    { scale: 0.3, radius: 0.8 },
    { scale: 0.2, radius: 0.9 },
    { scale: 0.24, radius: 1 },
    { scale: 0.28, radius: 1.22 },
    { scale: 0.18, radius: 1.52 },
    { scale: 0.22, radius: 1.44 },
    { scale: 0.12, radius: 1.6 },
    { scale: 0.3, radius: 1.2 },
  ];

  return (
    <group scale={baseScale}>
      <PrimaryGlassCube
        geometry={geometry}
        materialResolution={1024}
        materialSamples={3}
      />
      {cubes.map((cube, index) => (
        <FloatingCube
          key={index}
          geometry={geometry}
          index={index}
          count={cubes.length}
          radius={cube.radius}
          scale={cube.scale}
          interactive
          motionScale={1}
          materialResolution={1024}
          materialSamples={2}
        />
      ))}
    </group>
  );
}

function FallbackCubeGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useRoundedCubeGeometry();
  useGlassRotation(meshRef);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0,
      thickness: 0.2,
      ior: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      color: new THREE.Color("#143030ff"),
      transparent: true,
      side: THREE.DoubleSide,
      envMapIntensity: 0.7,
      metalness: 0,
      reflectivity: 0.08,
      dispersion: 1,
    });
  }, []);

  useEffect(() => {
    console.log("[GlassCube] Using fallback MeshPhysicalMaterial");
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} scale={2.4} />
  );
}

export default function GlassCube() {
  const [contextLost, setContextLost] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const { isDesktop, isTabletUp, prefersReducedMotion } =
    useResponsiveSettings();
  const simplifiedHero = !isDesktop || prefersReducedMotion;

  const handleContextLost = useCallback(() => {
    setContextLost(true);
    setTimeout(() => {
      setUseFallback(true);
      setContextLost(false);
    }, 1500);
  }, []);

  if (contextLost) {
    return (
      <div className="canvas-container flex items-center justify-center">
        <div className="text-text-secondary/30 text-xs tracking-widest uppercase animate-pulse">
          Recovering...
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        dpr={simplifiedHero ? [1, isTabletUp ? 1.35 : 1.15] : [1, 2]}
        frameloop="always"
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <SceneSetup onContextLost={handleContextLost} />

        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 2, 3]} intensity={2} />

        <SceneLogo />
        {useFallback ? (
          <FallbackCubeGeometry />
        ) : simplifiedHero ? (
          <SingleGlassCube />
        ) : (
          <GlassCubeCluster />
        )}

        <Environment preset="city" background={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/rounded_diamond.glb");
