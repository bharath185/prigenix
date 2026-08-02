'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { NeuralNetwork } from './NeuralNetwork'

interface NexusCanvasProps {
  scrollProgress: number
  activeNode: number | null
  setActiveNode: (id: number | null) => void
  alignLeft?: boolean
}

export function NexusCanvas({ scrollProgress, activeNode, setActiveNode, alignLeft }: NexusCanvasProps) {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-transparent">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
        
        {/* Futuristic Cyberpunk Neon Lighting Setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        
        {/* Neon Forest Green reflection light on the left */}
        <pointLight position={[-6, 4, 3]} intensity={2.5} color="#0D5B3A" />
        
        {/* Neon Muted Gold reflection light on the right */}
        <pointLight position={[6, -4, 3]} intensity={2.5} color="#C8A870" />

        {/* Main 3D Neural Nexus System wrapped in Suspense */}
        <Suspense fallback={null}>
          <NeuralNetwork 
            scrollProgress={scrollProgress}
            activeNode={activeNode}
            setActiveNode={setActiveNode}
            alignLeft={alignLeft}
          />
        </Suspense>

        {/* Cyberpunk Glowing Postprocessing Bundle */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={1.5} 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={[0.0006, 0.0006]} 
          />
          <Vignette 
            eskil={false} 
            offset={0.1} 
            darkness={1.1} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
