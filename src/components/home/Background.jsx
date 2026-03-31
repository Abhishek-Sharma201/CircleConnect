"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const Scene = () => {
  const groupRef = useRef(null);
  
  // Create lines configuration
  const lines = useMemo(() => {
    return Array.from({ length: 45 }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 20 - 5,
      width: Math.random() * 0.08 + 0.02,
      length: Math.random() * 20 + 5,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.5 ? "#3b82f6" : "#60a5fa"
    }));
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 15,
      size: Math.random() * 0.06 + 0.02,
      speed: Math.random() * 0.01 + 0.005,
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!groupRef.current) return;
      const { innerWidth, innerHeight } = window;
      const mx = (e.clientX / innerWidth - 0.5) * 2;
      const my = (e.clientY / innerHeight - 0.5) * 2;

      // Use GSAP to animate rotation towards cursor smoothly
      gsap.to(groupRef.current.rotation, {
        x: my * 0.2,
        y: mx * 0.4,
        z: -mx * 0.1,
        duration: 2.5,
        ease: "power2.out",
      });
      // Move slightly on X/Y to give parallax depth
      gsap.to(groupRef.current.position, {
        x: mx * 1,
        y: -my * 1,
        duration: 3,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Animate lines and particles flowing seamlessly
    groupRef.current.children.forEach((mesh) => {
      if (mesh.userData.isLine) {
        mesh.position.y += mesh.userData.speed;
        mesh.position.x += mesh.userData.speed * 0.5; // Flow diagonally
        if (mesh.position.y > 20 || mesh.position.x > 20) {
          mesh.position.y = -20;
          mesh.position.x = (Math.random() - 0.5) * 40;
        }
      } else if (mesh.userData.isParticle) {
        mesh.position.y += mesh.userData.speed;
        if (mesh.position.y > 15) {
          mesh.position.y = -15;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <mesh 
          key={`line-${i}`} 
          position={[line.x, line.y, line.z]} 
          rotation={[0, 0, -Math.PI / 6]} 
          userData={{ isLine: true, speed: line.speed }}
        >
          <planeGeometry args={[line.width, line.length]} />
          <meshBasicMaterial 
            color={line.color} 
            transparent 
            opacity={line.opacity} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide} 
            depthWrite={false}
          />
        </mesh>
      ))}
      
      {particles.map((p, i) => (
        <mesh 
          key={`particle-${i}`} 
          position={[p.x, p.y, p.z]}
          userData={{ isParticle: true, speed: p.speed }}
        >
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial 
            color="#93c5fd" 
            transparent 
            opacity={p.opacity} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const Background = () => {
  return (
    <div
      className="fixed inset-0 z-[2] overflow-hidden pointer-events-none"
      style={{ background: "var(--geist-background)" }}
    >
      {/* Ambient center glow */}
      <div
        className="absolute z-[1]"
        style={{
          left: "20%",
          top: "10%",
          width: "60vw",
          height: "60vh",
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      
      {/* Dark overlay to blend edges smoothly into the site's dark background */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, var(--geist-background) 100%)",
        }}
      />
      
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default Background;
