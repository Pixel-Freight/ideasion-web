import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MeshTransmissionMaterial, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function SceneSetup({ onContextLost }: { onContextLost: () => void }) {
  const { scene, gl } = useThree()

  useEffect(() => {
    scene.background = null
    gl.setClearColor(0x000000, 0)
    console.log('[GlassCube] Scene setup complete')

    const canvas = gl.domElement
    const handleLost = (e: Event) => {
      e.preventDefault()
      console.error('[GlassCube] WebGL Context Lost')
      onContextLost()
    }
    const handleRestored = () => {
      console.log('[GlassCube] WebGL Context Restored')
      scene.background = null
      gl.setClearColor(0x000000, 0)
    }

    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', handleRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', handleRestored)
    }
  }, [scene, gl, onContextLost])

  useFrame(() => {
    if (scene.background !== null) scene.background = null
  })

  return null
}

function useGlassRotation(ref: RefObject<THREE.Object3D | null>) {
  const { pointer } = useThree()
  const rot = useRef({ rx: 0, ry: 0 })

  useFrame((_, delta) => {
    if (!ref.current) return
    rot.current.rx += delta * 0.15
    rot.current.ry += delta * 0.25
    ref.current.rotation.x = rot.current.rx + pointer.y * 0.3
    ref.current.rotation.y = rot.current.ry + pointer.x * 0.2
    ref.current.rotation.z = pointer.x * 0.1
  })
}

function findFirstMeshGeometry(root: THREE.Object3D): THREE.BufferGeometry | null {
  let geometry: THREE.BufferGeometry | null = null

  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!geometry && mesh.isMesh) {
      geometry = mesh.geometry
    }
  })

  return geometry
}

function useRoundedCubeGeometry() {
  const gltf = useGLTF('/rounded_diamond.glb') as { scene: THREE.Group }

  return useMemo(() => {
    const sourceGeometry = findFirstMeshGeometry(gltf.scene)

    if (!sourceGeometry) {
      return new THREE.BoxGeometry(2.4, 2.4, 2.4, 8, 8, 8)
    }

    const geometry = sourceGeometry.clone()
    geometry.computeBoundingBox()

    if (geometry.boundingBox) {
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      geometry.boundingBox.getCenter(center)
      geometry.boundingBox.getSize(size)

      const maxAxis = Math.max(size.x, size.y, size.z)
      const scale = maxAxis > 0 ? 1 / maxAxis : 1
      geometry.translate(-center.x, -center.y, -center.z)
      geometry.scale(scale, scale, scale)
    }

    geometry.computeVertexNormals()
    return geometry
  }, [gltf.scene])
}

function SceneLogo() {
  const texture = useTexture('/logo.svg')
  const { viewport } = useThree()

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
  }, [texture])

  return (
    <mesh position={[0, 0, -2.2]} scale={[viewport.width * 0.72, viewport.width * 0.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function GlassRoundedCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometry = useRoundedCubeGeometry()
  const { viewport } = useThree()
  useGlassRotation(meshRef)

  const materialProps = {
    thickness: 1.5,
    roughness: 0.1,
    transmission: 1,
    ior: 0.8,
    chromaticAberration: 0.1,
    backside: true,
  }

  useEffect(() => {
    console.log('[GlassCube] Rounded GLB created with MeshTransmissionMaterial')
  }, [])

  return (
    <group scale={Math.min(viewport.width / 2, 2.8)}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshTransmissionMaterial
          {...materialProps}
          samples={8}
          resolution={1024}
          attenuationDistance={3}
          attenuationColor="#575050ff"
          color="#143030ff"
          envMapIntensity={0.18}
          reflectivity={0.04}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

function FallbackCubeGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometry = useRoundedCubeGeometry()
  useGlassRotation(meshRef)

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0,
      thickness: 0.2,
      ior: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      color: new THREE.Color('#143030ff'),
      transparent: true,
      side: THREE.DoubleSide,
      envMapIntensity: 0.7,
      metalness: 0,
      reflectivity: 0.08,
    })
  }, [])

  useEffect(() => {
    console.log('[GlassCube] Using fallback MeshPhysicalMaterial')
  }, [])

  return <mesh ref={meshRef} geometry={geometry} material={material} scale={2.4} />
}

export default function GlassCube() {
  const [contextLost, setContextLost] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  const handleContextLost = useCallback(() => {
    setContextLost(true)
    setTimeout(() => {
      setUseFallback(true)
      setContextLost(false)
      console.log('[GlassCube] Switching to fallback renderer')
    }, 1500)
  }, [])

  if (contextLost) {
    return (
      <div className="canvas-container flex items-center justify-center">
        <div className="text-text-secondary/30 text-xs tracking-widest uppercase animate-pulse">
          Recovering...
        </div>
      </div>
    )
  }

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        frameloop="always"
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0)
          scene.background = null
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1
          console.log('[GlassCube] Canvas created')

          const ctx = gl.getContext()
          const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info')
          if (debugInfo) {
            console.log('[GlassCube] GPU:', ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
          }
        }}
      >
        <SceneSetup onContextLost={handleContextLost} />

        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 2, 3]} intensity={2} />

        <SceneLogo />
        {useFallback ? <FallbackCubeGeometry /> : <GlassRoundedCube />}

        <Environment preset="city" background={false} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/rounded_diamond.glb')
