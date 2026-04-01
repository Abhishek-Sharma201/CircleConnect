"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";

const COUNT = 1200; // Dense swarm of boxes for a lush fluid effect

const Swarm = () => {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  const targetMouse = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize particles with organic starting positions and properties
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
        const radius = 2 + Math.random() * 25;
        // Spherical distribution
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Randomizations for fluid-like motion
        const timeOffset = Math.random() * 100;
        const speed = 0.02 + Math.random() * 0.08;
        const scale = 0.08 + Math.random() * 0.35;
        const orbitSpeed = (Math.random() - 0.5) * 0.15;
        
        temp.push({ 
            baseX: x, baseY: y, baseZ: z,
            timeOffset, 
            speed,
            scale,
            orbitSpeed,
            // Track current position for smoothing
            cx: x, cy: y, cz: z
        });
    }
    return temp;
  }, []);

  // Premium Lusion-esque color palette mapping to PostGrid/Geist theme
  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const color = new THREE.Color();
    const palette = ["#ffffff", "#d1d5db", "#9ca3af", "#3b82f6", "#60a5fa"];
    for (let i = 0; i < COUNT; i++) {
        color.set(palette[Math.floor(Math.random() * palette.length)]);
        arr[i * 3] = color.r;
        arr[i * 3 + 1] = color.g;
        arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
        // Map viewport to 3D world space loosely
        const vx = (e.clientX / window.innerWidth) * 2 - 1;
        const vy = -(e.clientY / window.innerHeight) * 2 + 1;
        targetMouse.current.set(vx * 18, vy * 18, 0);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    
    // Smoothly drag mouse position 
    mouse.current.lerp(targetMouse.current, 0.04);

    particles.forEach((particle, i) => {
        let { baseX, baseY, baseZ, timeOffset, speed, scale, orbitSpeed } = particle;
        
        const t = time * speed + timeOffset;
        
        // Circular orbit
        const orbitAngle = time * orbitSpeed;
        const cA = Math.cos(orbitAngle);
        const sA = Math.sin(orbitAngle);
        
        let tx = baseX * cA - baseZ * sA;
        let tz = baseX * sA + baseZ * cA;
        let ty = baseY;

        // Fluid noise wandering
        tx += Math.sin(t * 1.5) * 2.5;
        ty += Math.cos(t * 1.2) * 2.5;
        tz += Math.sin(t * 1.8) * 2.5;
        
        // Interaction with mouse (soft repulsion & swirling)
        const dist = mouse.current.distanceTo(new THREE.Vector3(tx, ty, tz));
        const interactRadius = 6.5;
        let finalScale = scale;
        
        if (dist < interactRadius) {
            const force = Math.pow((interactRadius - dist) / interactRadius, 2);
            const dir = new THREE.Vector3(tx, ty, tz).sub(mouse.current).normalize();
            
            // Push outwards and slightly rotate around mouse
            tx += dir.x * force * 4 + dir.y * force * 1.5;
            ty += dir.y * force * 4 - dir.x * force * 1.5;
            tz += dir.z * force * 4;
            
            // Pop out size when interacting
            finalScale = scale * (1 + force * 1.5);
        }

        // Apply smooth transition to target location
        particle.cx += (tx - particle.cx) * 0.1;
        particle.cy += (ty - particle.cy) * 0.1;
        particle.cz += (tz - particle.cz) * 0.1;

        dummy.position.set(particle.cx, particle.cy, particle.cz);
        
        // Organic box rotation
        dummy.rotation.x = t + particle.cx * 0.15;
        dummy.rotation.y = t * 1.5 + particle.cy * 0.15;
        dummy.rotation.z = t * 0.5;
        
        // Apply scaling
        dummy.scale.set(finalScale, finalScale, finalScale);
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Global swarm gentle parallax framing
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (targetMouse.current.x * Math.PI) / 80, 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, (-targetMouse.current.y * Math.PI) / 80, 0.05);
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]} castShadow receiveShadow>
      {/* Box shapes per user request */}
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      {/* Physical material for high-craft shiny/lusion feel */}
      <meshPhysicalMaterial 
        vertexColors
        roughness={0.15} 
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </instancedMesh>
  );
};

const Background = () => {
  return (
    <div
      className="fixed inset-0 z-[2] overflow-hidden pointer-events-none"
      style={{ background: "var(--geist-background)" }}
    >
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 15%, var(--geist-background) 100%)",
        }}
      />
      
      <Canvas
        camera={{ position: [0, 0, 25], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        <Environment preset="city" />
        
        <Swarm />
        
        {/* Soft fading logic for depth */}
        <fog attach="fog" args={["#000000", 15, 45]} />
      </Canvas>
    </div>
  );
};

export default Background;
