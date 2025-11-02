"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShaderAnimation({ speed = 2 }) {
  // `speed` controls animation speed (default 5x). Pass a prop or change default.
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- Shaders ---
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // --- Three.js setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 0.0 },
      resolution: {
        value: new THREE.Vector2(
          renderer.domElement.width,
          renderer.domElement.height
        ),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Resize handler ---
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height
      );
    };

    window.addEventListener("resize", onWindowResize, { passive: true });
    onWindowResize();

    // --- Animation loop (corrected) ---
    let frameId = null;
    const animate = (timeMs) => {
      // timeMs is provided by RAF in milliseconds
      const seconds = (timeMs || 0) * 0.001;
      uniforms.time.value = seconds * speed; // <-- increase speed by changing `speed`
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    // start loop
    frameId = requestAnimationFrame(animate);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (frameId) cancelAnimationFrame(frameId);

      try {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      } catch (err) {
        // ignore
      }

      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  );
}
