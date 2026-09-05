'use client';

import React, { useEffect, useRef } from 'react';

export default function BackgroundGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Array
    const particlesCount = 70;
    const particles = Array.from({ length: particlesCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.3 ? '#FFC107' : '#00F0FF',
    }));

    // Laser scan sweep line position
    let scanY = 0;
    let scanDirection = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 2. Animated Laser Sweep Line
      scanY += 1.2 * scanDirection;
      if (scanY > height) scanDirection = -1;
      if (scanY < 0) scanDirection = 1;

      const scanGradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGradient.addColorStop(0, 'rgba(255, 193, 7, 0)');
      scanGradient.addColorStop(0.5, 'rgba(255, 193, 7, 0.15)');
      scanGradient.addColorStop(1, 'rgba(255, 193, 7, 0)');

      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 30, width, 60);

      ctx.strokeStyle = 'rgba(255, 213, 79, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // 3. Floating Micro Particles & Triangulation
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect close particles with laser lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#FFC107';
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
