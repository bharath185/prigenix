'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface NeuralNetworkProps {
  scrollProgress: number
  activeNode: number | null
  setActiveNode: (id: number | null) => void
  alignLeft?: boolean
}

export function NeuralNetwork({ scrollProgress, activeNode, alignLeft }: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null)
  const activeLineGeomRef = useRef<THREE.BufferGeometry>(null)
  const backgroundPointsGeomRef = useRef<THREE.BufferGeometry>(null)
  const activePointsGeomRef = useRef<THREE.BufferGeometry>(null)
  
  const { mouse, viewport } = useThree()

  const particleCount = 350
  const maxActiveLines = 400

  // Dynamic responsive alignment: offset to the right on desktop, centered on mobile, or left for login page
  const groupOffsetX = useMemo(() => {
    if (alignLeft) {
      return viewport.width > 7 ? -2.2 : 0
    }
    return viewport.width > 7 ? 1.8 : 0
  }, [viewport.width, alignLeft])

  // 1. Initialize random floating coordinates in space
  const [initialPositions, livePositions] = useMemo(() => {
    const init = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      init[i * 3] = (Math.random() - 0.5) * 10
      init[i * 3 + 1] = (Math.random() - 0.5) * 8
      init[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    return [init, init.slice()]
  }, [])

  // Pre-allocate buffer lines positions
  const activeLinePositions = useMemo(() => new Float32Array(maxActiveLines * 2 * 3), [])

  // Pre-allocate buffer for active point coordinates (visible nodes)
  const activePointsPositions = useMemo(() => new Float32Array(particleCount * 3), [])

  // Smoothed mouse cursor tracking vector
  const smoothCursor = useRef(new THREE.Vector2())

  // Dynamic active spotlight color themed by scroll progress
  const activeColor = useMemo(() => {
    const color = new THREE.Color()
    if (activeNode === 1 || activeNode === 4) return color.set('#0D5B3A') // Logo Forest Green
    if (activeNode === 2 || activeNode === 3) return color.set('#C8A870') // Logo Muted Gold

    // Scroll progress color gates
    if (scrollProgress < 0.15) return color.set('#C8A870') // Muted Gold (Hero)
    if (scrollProgress >= 0.15 && scrollProgress < 0.45) return color.set('#0D5B3A') // Forest Green (Services)
    return color.set('#86B3AA') // Sage Green (About)
  }, [activeNode, scrollProgress])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // 1. Group camera parallax & slow zoom scroll-flight
    if (groupRef.current) {
      const targetRX = mouse.y * 0.12
      const targetRY = mouse.x * 0.12
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRX, 0.05)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRY, 0.05)
      
      const targetZ = scrollProgress * 3.6
      const targetRotY = scrollProgress * 0.35
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06)
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, groupOffsetX - scrollProgress * 2.8, 0.06)
    }

    // 2. Map screen coordinates to the local z=0 viewport plane
    const targetCursorX = (mouse.x * (viewport.width / 2)) - groupOffsetX
    const targetCursorY = mouse.y * (viewport.height / 2)

    // Smoothly interpolate cursor position to add organic inertia
    smoothCursor.current.x = THREE.MathUtils.lerp(smoothCursor.current.x, targetCursorX, 0.08)
    smoothCursor.current.y = THREE.MathUtils.lerp(smoothCursor.current.y, targetCursorY, 0.08)

    const cursorX = smoothCursor.current.x
    const cursorY = smoothCursor.current.y

    // 3. Update background coordinate float positions (Drift down slowly and bob)
    if (backgroundPointsGeomRef.current) {
      const geoArr = backgroundPointsGeomRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        // Slowly drift downwards
        livePositions[i * 3 + 1] -= 0.0025
        // Slight organic sway left/right
        livePositions[i * 3] += Math.sin(t * 0.5 + i) * 0.001

        // Wrap particles back to top/sides when out of bounds
        if (livePositions[i * 3 + 1] < -4) {
          livePositions[i * 3 + 1] = 4
          livePositions[i * 3] = (Math.random() - 0.5) * 10
        }
        if (livePositions[i * 3] < -5) livePositions[i * 3] = 5
        if (livePositions[i * 3] > 5) livePositions[i * 3] = -5

        // Write directly to background points buffer array
        geoArr[i * 3] = livePositions[i * 3]
        geoArr[i * 3 + 1] = livePositions[i * 3 + 1]
        geoArr[i * 3 + 2] = livePositions[i * 3 + 2]
      }
      backgroundPointsGeomRef.current.geometry.attributes.position.needsUpdate = true
    }

    // 4. Update the Active-Only Web (Lines + Nodes)
    let activeLineCount = 0
    let activePointsCount = 0
    
    const cursorBubbleRadius = 1.6
    const touchedIndices: Record<number, boolean> = {}

    // Track active coordinates inside compile bubble
    for (let i = 0; i < particleCount; i++) {
      const px = livePositions[i * 3]
      const py = livePositions[i * 3 + 1]
      const pz = livePositions[i * 3 + 2]

      const dx = px - cursorX
      const dy = py - cursorY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < cursorBubbleRadius) {
        touchedIndices[i] = true

        // Add to active points buffer (visible nodes)
        activePointsPositions[activePointsCount * 3] = px
        activePointsPositions[activePointsCount * 3 + 1] = py
        activePointsPositions[activePointsCount * 3 + 2] = pz
        activePointsCount++

        // Draw active laser link directly from cursor to touched coordinate
        if (activeLineCount < maxActiveLines) {
          activeLinePositions[activeLineCount * 6] = px
          activeLinePositions[activeLineCount * 6 + 1] = py
          activeLinePositions[activeLineCount * 6 + 2] = pz

          activeLinePositions[activeLineCount * 6 + 3] = cursorX
          activeLinePositions[activeLineCount * 6 + 4] = cursorY
          activeLinePositions[activeLineCount * 6 + 5] = 0

          activeLineCount++
        }
      }
    }

    // Connect active coordinates to each other (distance < 1.0 unit)
    const touchedKeys = Object.keys(touchedIndices).map(Number)
    const activeLength = touchedKeys.length

    for (let i = 0; i < activeLength && activeLineCount < maxActiveLines; i++) {
      const idxA = touchedKeys[i]
      const xA = livePositions[idxA * 3]
      const yA = livePositions[idxA * 3 + 1]
      const zA = livePositions[idxA * 3 + 2]

      for (let j = i + 1; j < activeLength && activeLineCount < maxActiveLines; j++) {
        const idxB = touchedKeys[j]
        const xB = livePositions[idxB * 3]
        const yB = livePositions[idxB * 3 + 1]
        const zB = livePositions[idxB * 3 + 2]

        const dx = xA - xB
        const dy = yA - yB
        const dz = zA - zB
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)

        // Only draw connection lines between particles that are both inside the cursor bubble
        if (d < 1.0) {
          activeLinePositions[activeLineCount * 6] = xA
          activeLinePositions[activeLineCount * 6 + 1] = yA
          activeLinePositions[activeLineCount * 6 + 2] = zA

          activeLinePositions[activeLineCount * 6 + 3] = xB
          activeLinePositions[activeLineCount * 6 + 4] = yB
          activeLinePositions[activeLineCount * 6 + 5] = zB

          activeLineCount++
        }
      }
    }

    // 5. Update WebGL Buffer Geometries
    if (activeLineGeomRef.current) {
      activeLineGeomRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(activeLinePositions, 3)
      )
      activeLineGeomRef.current.setDrawRange(0, activeLineCount * 2)
      activeLineGeomRef.current.attributes.position.needsUpdate = true
    }

    if (activePointsGeomRef.current) {
      activePointsGeomRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(activePointsPositions, 3)
      )
      activePointsGeomRef.current.setDrawRange(0, activePointsCount)
      activePointsGeomRef.current.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[groupOffsetX, 0, 0]}>
      
      {/* Specular Spotlight Comet */}
      <pointLight 
        position={[smoothCursor.current.x, smoothCursor.current.y, 2.5]} 
        intensity={3.2} 
        color="#ffffff" 
        distance={9} 
      />

      {/* 1. Background Dim Swarm Particles (drifting at all times) */}
      <points ref={backgroundPointsGeomRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPositions, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#5B756E" // Muted Sage Green
          size={0.046}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </points>

      {/* 2. Active Spotlight Lines (Neon glowing connections inside bubble) */}
      <lineSegments>
        <bufferGeometry ref={activeLineGeomRef} />
        <lineBasicMaterial color={activeColor} transparent opacity={0.52} depthWrite={false} />
      </lineSegments>

      {/* 3. Active Spotlight Nodes (Swell under cursor inside bubble) */}
      <points>
        <bufferGeometry ref={activePointsGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(particleCount * 3), 3]}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color={activeColor}
          size={0.088}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.92}
        />
      </points>

    </group>
  )
}
