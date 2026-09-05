'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  // GSAP Cinematic Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // 1. Badge Reveal
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: -30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 }
        );
      }

      // 2. Title Split Lines Reveal
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current.children,
          { y: 70, opacity: 0, rotateX: -20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15 },
          '-=0.4'
        );
      }

      // 3. Subtitle Fade & Slide
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.8'
        );
      }

      // 4. CTA Buttons Elastic Reveal
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { scale: 0.8, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.7)' },
          '-=0.6'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative min-h-screen pt-36 pb-20 flex flex-col justify-between bg-dark-900 overflow-hidden">
      
      {/* Volumetric Glow Ambient Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      
      <div
        ref={containerRef}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col items-center justify-center text-center my-auto"
      >
        {/* Accreditation Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800/90 border border-amber-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(255,193,7,0.15)] mb-8"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
            NABL ISO/IEC 17025 ACCREDITED LABS
          </span>
        </div>

        {/* GSAP Split Headline Lines */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1] max-w-3xl uppercase"
        >
          <div className="block">PRECISION</div>
          <div className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-amber-glow">
            PERFORMANCE
          </div>
          <div className="block">CONFIDENCE</div>
        </h1>

        {/* Sub-headline */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-3xl mt-6"
        >
          MSIR INDIA delivers advanced industrial metrology and precision calibration solutions across Chennai & Bengaluru, engineered to meet the highest standards of accuracy, reliability, and compliance across Aerospace, Defence, Energy, and Automotive industries.
        </p>

        {/* Action Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center gap-5 pt-10"
        >
          <a
            href="#booking"
            data-cursor="BOOK NOW"
            className="magnetic-button px-9 py-4.5 text-base font-bold font-display uppercase tracking-wider bg-amber-500 text-dark-950 rounded-xl shadow-[0_0_35px_rgba(255,193,7,0.45)] hover:shadow-[0_0_55px_rgba(255,193,7,0.75)] hover:scale-105 transition-all flex items-center gap-3"
          >
            <span>REQUEST CALIBRATION</span>
            <CheckCircle2 className="w-5 h-5" />
          </a>

          <a
            href="#laboratory"
            data-cursor="EXPLORE"
            className="magnetic-button px-8 py-4.5 text-base font-mono tracking-wider text-white bg-dark-800/90 border border-neutral-700 hover:border-amber-500/50 hover:bg-amber-500/10 rounded-xl transition-all flex items-center gap-2.5 backdrop-blur-md"
          >
            <span>EXPLORE LAB DOMAINS</span>
          </a>
        </div>
      </div>
    </section>
  );
}
