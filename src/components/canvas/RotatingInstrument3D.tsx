'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function RotatingInstrument3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera Setup - Positioned for rich, high-visibility 3D framing
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.5);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Vibrant Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffc107, 4);
    mainLight.position.set(6, 12, 10);
    scene.add(mainLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 6, 30);
    cyanPoint.position.set(-10, -5, 8);
    scene.add(cyanPoint);

    const amberPoint = new THREE.PointLight(0xffc107, 7, 30);
    amberPoint.position.set(10, -10, 8);
    scene.add(amberPoint);

    // 3D Calibration Instrument Assembly Group
    const instrumentGroup = new THREE.Group();
    // Offset slightly right for cinematic balance
    instrumentGroup.position.set(1.5, -0.2, 0);
    scene.add(instrumentGroup);

    // 1. Primary Gold Calibration Torus Ring
    const outerRingGeo = new THREE.TorusGeometry(2.8, 0.18, 32, 100);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffc107,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x885500,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, goldMat);
    instrumentGroup.add(outerRing);

    // 2. Secondary Cyan Precision Scale Ring
    const innerRingGeo = new THREE.TorusGeometry(2.1, 0.1, 24, 80);
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x006688,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, cyanMat);
    innerRing.rotation.x = Math.PI / 3.5;
    instrumentGroup.add(innerRing);

    // 3. Micrometer Scale Tick Marks (48 Notches around perimeter)
    const ticksGroup = new THREE.Group();
    const ticksCount = 48;
    for (let i = 0; i < ticksCount; i++) {
      const angle = (i / ticksCount) * Math.PI * 2;
      const isMajor = i % 4 === 0;
      const tickGeo = new THREE.BoxGeometry(
        isMajor ? 0.07 : 0.035,
        isMajor ? 0.38 : 0.18,
        0.04
      );
      const tickMat = new THREE.MeshBasicMaterial({
        color: isMajor ? 0xffc107 : 0x00f0ff,
      });
      const tick = new THREE.Mesh(tickGeo, tickMat);

      tick.position.x = Math.cos(angle) * 2.45;
      tick.position.y = Math.sin(angle) * 2.45;
      tick.rotation.z = angle + Math.PI / 2;
      ticksGroup.add(tick);
    }
    instrumentGroup.add(ticksGroup);

    // 4. Central Optical Lens Core & Glowing Wireframe Nucleus
    const coreGeo = new THREE.IcosahedronGeometry(0.95, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffc107,
      wireframe: true,
      emissive: 0xaa7700,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    instrumentGroup.add(coreSphere);

    // 5. Crosshair Laser Beam Scanners
    const beamGeo = new THREE.CylinderGeometry(0.018, 0.018, 9.5, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
    });

    const beamX = new THREE.Mesh(beamGeo, beamMat);
    beamX.rotation.z = Math.PI / 2;
    instrumentGroup.add(beamX);

    const beamY = new THREE.Mesh(beamGeo, beamMat);
    instrumentGroup.add(beamY);

    // 6. Orbital Calibration Probe Satellites
    const orbitGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const probeGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const probeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xffc107 : 0x00f0ff,
        metalness: 0.9,
        emissive: i % 2 === 0 ? 0xaa7700 : 0x0077aa,
      });
      const probe = new THREE.Mesh(probeGeo, probeMat);
      const probeAngle = (i / 4) * Math.PI * 2;
      probe.position.x = Math.cos(probeAngle) * 3.4;
      probe.position.y = Math.sin(probeAngle) * 3.4;
      orbitGroup.add(probe);
    }
    instrumentGroup.add(orbitGroup);

    // Scroll Reaction
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      targetRotationY = scrollY * 0.0025;
      targetRotationX = scrollY * 0.0012;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous 3D Rotation of full assembly
      instrumentGroup.rotation.y += 0.009 + (targetRotationY - instrumentGroup.rotation.y) * 0.05;
      instrumentGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3 + targetRotationX;
      instrumentGroup.rotation.z = Math.cos(elapsedTime * 0.4) * 0.25;

      ticksGroup.rotation.z -= 0.008;
      innerRing.rotation.y += 0.015;
      orbitGroup.rotation.z += 0.018;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-60 mix-blend-screen transition-opacity duration-1000"
    />
  );
}
