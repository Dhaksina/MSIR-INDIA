'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main 3D Core Geometry (Futuristic Precision Calibrator)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Core Icosahedron (Metallic Gold)
    const innerGeo = new THREE.IcosahedronGeometry(2, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xFFC107,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
      emissive: 0xFFA000,
      emissiveIntensity: 0.3,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Inner Glowing Core Sphere
    const sphereGeo = new THREE.SphereGeometry(1.3, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xFFD54F,
      wireframe: false,
      transparent: true,
      opacity: 0.8,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(sphereMesh);

    // Outer Holographic Telemetry Rings
    const ringCount = 3;
    const rings: THREE.Mesh[] = [];

    for (let i = 0; i < ringCount; i++) {
      const radius = 3.2 + i * 0.9;
      const ringGeo = new THREE.TorusGeometry(radius, 0.03, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xFFC107 : 0x00F0FF,
        transparent: true,
        opacity: 0.6 - i * 0.1,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + (i * Math.PI) / 6;
      ringMesh.rotation.y = (i * Math.PI) / 4;
      coreGroup.add(ringMesh);
      rings.push(ringMesh);
    }

    // Laser Beam Sweep Disc
    const discGeo = new THREE.RingGeometry(0.5, 4.5, 64);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xFFC107,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.rotation.x = Math.PI / 2;
    coreGroup.add(discMesh);

    // Particle Swarm
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFC107,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xFFC107, 3, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00F0FF, 2, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate core
      innerMesh.rotation.x = elapsedTime * 0.3;
      innerMesh.rotation.y = elapsedTime * 0.5;

      sphereMesh.scale.setScalar(1 + Math.sin(elapsedTime * 3) * 0.05);

      // Rotate Telemetry Rings
      rings.forEach((ring, idx) => {
        ring.rotation.z = elapsedTime * (0.2 + idx * 0.1);
        ring.rotation.x = Math.PI / 2 + Math.sin(elapsedTime + idx) * 0.2;
      });

      discMesh.position.y = Math.sin(elapsedTime * 2) * 1.5;

      // Mouse Parallax smooth lerp
      coreGroup.rotation.y += (mouseX * 0.8 - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (-mouseY * 0.8 - coreGroup.rotation.x) * 0.05;

      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-h-[450px] lg:min-h-[600px] cursor-grab active:cursor-grabbing" />;
}
