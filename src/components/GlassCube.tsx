import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
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

const glassMaterialProps = {
  thickness: 0.1,
  roughness: 0.1,
  transmission: 1,
  ior: 1.27,
  chromaticAberration: 0.2,
  backside: true,
  samples: 4,
  resolution: 1024,
  attenuationDistance: 3,
  envMapIntensity: 0.18,
  reflectivity: 0.04,
  metalness: 0,
}

function useGlassRotation(ref: RefObject<THREE.Object3D | null>, speed = 1) {
  const { pointer } = useThree()
  const rot = useRef({ rx: 0, ry: 0 })

  useFrame((_, delta) => {
    if (!ref.current) return
    rot.current.rx += delta * 0.15 * speed
    rot.current.ry += delta * 0.25 * speed
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
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const { viewport, gl } = useThree()

  useEffect(() => {
    let disposed = false
    const image = new Image()
    image.src = '/logo.svg'

    image.onload = () => {
      if (disposed) return

      const canvas = document.createElement('canvas')
      canvas.width = 4096
      canvas.height = 1125
      const context = canvas.getContext('2d')
      if (!context) return

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      const canvasTexture = new THREE.CanvasTexture(canvas)
      canvasTexture.colorSpace = THREE.SRGBColorSpace
      canvasTexture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
      canvasTexture.needsUpdate = true
      setTexture(canvasTexture)
    }

    return () => {
      disposed = true
      setTexture((current) => {
        current?.dispose()
        return null
      })
    }
  }, [gl])

  if (!texture) return null

  return (
    <mesh position={[0, 0, -2.2]} scale={[viewport.width * 0.72, viewport.width * 0.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.1}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

interface FloatingCubeProps {
  geometry: THREE.BufferGeometry
  index: number
  count: number
  scale: number
  radius: number
}

function FloatingCube({ geometry, index, count, scale, radius }: FloatingCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { pointer, viewport } = useThree()
  const phase = (index / count) * Math.PI * 2
  const verticalPhase = phase * 1.7
  const position = useRef(
    new THREE.Vector3(
      Math.cos(phase) * radius,
      Math.sin(verticalPhase) * radius * 0.58,
      Math.sin(phase) * 0.45,
    ),
  )
  const velocity = useRef(new THREE.Vector3())
  useGlassRotation(meshRef, 0.7 + index * 0.12)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const t = state.clock.elapsedTime * 0.55
    const pointerWorld = new THREE.Vector3(
      pointer.x * viewport.width * 0.5,
      pointer.y * viewport.height * 0.5,
      0,
    )
    const target = new THREE.Vector3(
      Math.cos(t + phase) * radius,
      Math.sin(t * 0.85 + verticalPhase) * radius * 0.58,
      Math.sin(t + phase) * 0.45,
    )

    const distance = position.current.distanceTo(pointerWorld)
    const pointerActive = Math.abs(pointer.x) > 0.015 || Math.abs(pointer.y) > 0.015
    if (pointerActive && distance < 0.75) {
      const release = position.current.clone().sub(pointerWorld).normalize().multiplyScalar((0.75 - distance) * 14 * delta)
      velocity.current.add(release)
    } else {
      const magnet = target.sub(position.current).multiplyScalar(7 * delta)
      velocity.current.add(magnet)
    }

    velocity.current.multiplyScalar(0.9)
    position.current.addScaledVector(velocity.current, delta * 4)
    meshRef.current.position.copy(position.current)
  })

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <MeshTransmissionMaterial {...glassMaterialProps} />
    </mesh>
  )
}

function GlassCubeCluster() {
  const geometry = useRoundedCubeGeometry()
  const { viewport } = useThree()
  const baseScale = Math.min(viewport.width / 2, 2.8)

  useEffect(() => {
    console.log('[GlassCube] Magnetic glass cluster created')
  }, [])

  const cubes = [
    { scale: 0.85, radius: 0.12 },
    { scale: 0.26, radius: 0.6 },
    { scale: 0.22, radius: 0.7 },
    { scale: 0.3, radius: 0.8 },
    { scale: 0.2, radius: 0.9 },
    { scale: 0.24, radius: 1 },
    { scale: 0.18, radius: 1.52 },
    { scale: 0.22, radius: 1.44 },
    { scale: 0.12, radius: 1.6 },
    { scale: 0.3, radius: 1.2 },
  ]

  return (
    <group scale={baseScale}>
      {cubes.map((cube, index) => (
        <FloatingCube
          key={index}
          geometry={geometry}
          index={index}
          count={cubes.length}
          radius={cube.radius}
          scale={cube.scale}
        />
      ))}
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
      dispersion: 1,
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
      setUseFallback(false)
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
        {useFallback ? <GlassCubeCluster /> : <GlassCubeCluster />}

        <Environment preset="city" background={false} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/rounded_diamond.glb')
