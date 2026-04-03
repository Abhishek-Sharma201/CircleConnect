"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const GRID_SIZE = 30; // 30x30 grid points
const SPACING = 1.5;
const COUNT = GRID_SIZE * GRID_SIZE;

const AnimatedGrid = () => {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  // Generate grid lattice of cubes with individual base colors
  const particles = useMemo(() => {
    const temp = [];
    const subColors = ["#3b82f6", "#60a5fa", "#4b5563", "#1f2937", "#111827"];
    const tempColor = new THREE.Color();

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const px = (x - GRID_SIZE / 2) * SPACING;
        const pz = (z - GRID_SIZE / 2) * SPACING;
        
        // Random assign color
        if (Math.random() > 0.95) {
             tempColor.set(subColors[Math.floor(Math.random() * 2)]);
        } else {
             tempColor.set(subColors[2 + Math.floor(Math.random() * 3)]);
        }

        temp.push({ 
            baseX: px,
            baseZ: pz,
            offset: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
            baseR: tempColor.r,
            baseG: tempColor.g,
            baseB: tempColor.b,
            // Independent random glow offsets to break sequence
            glowOffset: Math.random() * Math.PI * 2,
            // Much slower pacing (0.1 to 0.4 rad/s)
            glowSpeed: 0.1 + Math.random() * 0.3
        });
      }
    }
    return temp;
  }, []);

  // Set initial colors safely once mesh is available
  useEffect(() => {
     if (meshRef.current) {
        particles.forEach((p, i) => {
            colorObj.setRGB(p.baseR, p.baseG, p.baseB);
            meshRef.current.setColorAt(i, colorObj);
        });
        meshRef.current.instanceColor.needsUpdate = true;
     }
  }, [particles, colorObj]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
        let { baseX, baseZ, offset, speed, baseR, baseG, baseB, glowOffset, glowSpeed } = particle;
        
        // Complex wave keeping the cubes undulating
        const wave1 = Math.sin(baseX * 0.3 + time * 0.8);
        const wave2 = Math.cos(baseZ * 0.2 + time * 0.5);
        const combinedWave = wave1 * wave2;

        const yPos = -6 + combinedWave * 1.8;
        dummy.position.set(baseX, yPos, baseZ);
        
        dummy.rotation.x = combinedWave * 0.2;
        dummy.rotation.y = time * speed * 0.3 + offset;
        dummy.rotation.z = combinedWave * 0.1;

        const scale = 0.15 + Math.abs(Math.sin(time + offset)) * 0.35;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);

        // Randomized, slower glow effect
        // Instead of a sequence, each box breathes at its own pace
        const glowIntensity = Math.max(0, Math.sin(time * glowSpeed + glowOffset));
        
        // Raise it to a power to create a nice, sharp soft gradient up to the peak
        // The * 5 multiplier sends it over Bloom threshold nicely but softly 
        const factor = 1 + Math.pow(glowIntensity, 6) * 5;

        colorObj.setRGB(baseR * factor, baseG * factor, baseB * factor);
        meshRef.current.setColorAt(i, colorObj);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    // Smooth grid camera pan horizontally forever
    meshRef.current.position.x = Math.sin(time * 0.05) * 5;
    meshRef.current.position.z = Math.cos(time * 0.05) * 5;
    meshRef.current.rotation.y = Math.sin(time * 0.05) * 0.1;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshPhysicalMaterial 
        roughness={0.4} 
        metalness={0.6}
        transparent={true}
        opacity={0.8}
        // disable tonemapping so glowing colors exceed standard 0-1 brightness cleanly into the Bloom filter
        toneMapped={false} 
      />
    </instancedMesh>
  );
};

const DashboardBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 4, 15], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "default" }}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <ambientLight intensity={1.5} />
        {/* Soft lighting */}
        <directionalLight position={[10, 15, 10]} intensity={3} color="#ffffff" />
        <Environment preset="city" />
        
        <AnimatedGrid />
        
        <fog attach="fog" args={["#000000", 10, 30]} />
        
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default DashboardBackground;
