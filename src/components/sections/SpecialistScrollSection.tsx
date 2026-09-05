'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Activity,
  Radio,
  Mic,
  Wind,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Sliders
} from 'lucide-react';

interface SpecialistCard {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  icon: React.ElementType;
  bullets: string[];
  illustrationType: 'accelerometer' | 'rf' | 'microphone' | 'gas';
}

export default function SpecialistScrollSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const specialistItems: SpecialistCard[] = [
    {
      id: 'accelerometer',
      title: 'ACCELEROMETER CALIBRATION',
      category: 'VIBRATION & DYNAMIC MOTION',
      badgeColor: 'border-amber-400 bg-amber-500/20 text-amber-300',
      icon: Activity,
      bullets: [
        'Back-to-back method',
        'Sensitivity calibration',
        'Frequency response calibration',
        'Frequency range: 5 Hz to 10 kHz',
        'Acceleration range: 0.1 g to 30 g pk'
      ],
      illustrationType: 'accelerometer'
    },
    {
      id: 'rf-calibration',
      title: 'RF CALIBRATION',
      category: 'MICROWAVE & SIGNAL METROLOGY',
      badgeColor: 'border-cyan-400 bg-cyan-500/20 text-cyan-300',
      icon: Radio,
      bullets: [
        'Frequency Range: 9 kHz to 40 GHz',
        'High-Accuracy RF Signal Calibration',
        'Supports Spectrum Analyzers & Signal Generators',
        'Traceable to National/International Standards',
        'Fast, Reliable & ISO/IEC 17025 Compliant'
      ],
      illustrationType: 'rf'
    },
    {
      id: 'microphone',
      title: 'MICROPHONE CALIBRATION',
      category: 'ACOUSTIC & SOUND LEVEL METROLOGY',
      badgeColor: 'border-emerald-400 bg-emerald-500/20 text-emerald-300',
      icon: Mic,
      bullets: [
        'Sensitivity calibration',
        'Frequency response calibration',
        'Sound Level Verification',
        'IEC 61094 Compliant',
        'ISO/IEC 17025 Traceable'
      ],
      illustrationType: 'microphone'
    },
    {
      id: 'gas-detector',
      title: 'GAS DETECTOR CALIBRATION',
      category: 'SAFETY & INDUSTRIAL GAS SENSORS',
      badgeColor: 'border-rose-400 bg-rose-500/20 text-rose-300',
      icon: Wind,
      bullets: [
        'Range: 0-100% LEL / 0-25% O₂ / ppm (Gas Dependent)',
        'Certified Reference Gas Calibration',
        'High Accuracy',
        'Single & Multi-Gas Support',
        'ISO/IEC 17025 Traceable'
      ],
      illustrationType: 'gas'
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => {
        const nextIndex = (prev + 1) % specialistItems.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ left: nextIndex * 380, behavior: 'smooth' });
        }
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [specialistItems.length]);

  const scrollToIndex = (index: number) => {
    setActiveCardIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * 380, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    const newIdx = activeCardIndex > 0 ? activeCardIndex - 1 : specialistItems.length - 1;
    scrollToIndex(newIdx);
  };

  const scrollRight = () => {
    const newIdx = activeCardIndex < specialistItems.length - 1 ? activeCardIndex + 1 : 0;
    scrollToIndex(newIdx);
  };

  return (
    <section id="specialists" className="relative py-24 bg-dark-950 border-t border-b border-neutral-900 overflow-hidden">
      
      {/* Laser Mesh & Ambient Yellow Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-dark-950 to-dark-950 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Header & Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          
          {/* Header Text */}
          <div className="space-y-3 max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(255,193,7,0.2)]">
              <Award className="w-4 h-4 text-amber-400 animate-pulse" />
              SPECIALIST METROLOGY DOMAINS
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight uppercase">
              WE ARE <span className="text-amber-400 text-amber-glow">SPECIALISED IN</span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              <span className="text-white font-medium block mb-1">Precision engineered. Globally aligned. Industry trusted.</span>
              Advanced metrology solutions built to meet NABL & ISO/IEC 17025 standards for critical industrial applications.
            </p>
          </div>

          {/* Controls & Domain Quick Tabs */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="p-3 rounded-2xl bg-dark-900 border border-neutral-800 hover:border-amber-400 text-neutral-300 hover:text-amber-400 transition-all active:scale-95 shadow-lg"
                aria-label="Previous Specialist"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-dark-900 border border-neutral-800 text-xs font-mono text-neutral-400">
                <span className="text-amber-400 font-bold">0{activeCardIndex + 1}</span> / 04
              </div>

              <button
                onClick={scrollRight}
                className="p-3 rounded-2xl bg-dark-900 border border-neutral-800 hover:border-amber-400 text-neutral-300 hover:text-amber-400 transition-all active:scale-95 shadow-lg"
                aria-label="Next Specialist"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {specialistItems.map((item, idx) => {
                const isActive = activeCardIndex === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-500 text-dark-950 font-bold shadow-[0_0_15px_rgba(255,193,7,0.4)] scale-105'
                        : 'bg-dark-900/80 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    {item.title.replace(' CALIBRATION', '')}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4 SPECIALIST INSTRUMENT CAROUSEL CARDS */}
        {/* ========================================================================= */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {specialistItems.map((item, idx) => {
            const isSelected = activeCardIndex === idx;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveCardIndex(idx)}
                className={`w-[320px] sm:w-[410px] shrink-0 snap-start cursor-pointer rounded-3xl bg-dark-900/90 border-2 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-500/30 shadow-[0_0_35px_rgba(255,193,7,0.3)] scale-[1.01]'
                    : 'border-neutral-800 hover:border-neutral-700'
                } p-6 backdrop-blur-2xl transition-all duration-300 relative flex flex-col justify-between overflow-hidden group`}
              >
                {/* Yellow Corner Scanline */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  
                  {/* Yellow Chamfer Hardware Frame */}
                  <div className="relative w-full h-48 mb-6 rounded-2xl bg-amber-400 p-1 shadow-lg overflow-hidden flex items-center justify-center">
                    
                    <div className="w-full h-full rounded-xl bg-dark-950 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
                      <div className="w-32 h-32 rounded-full border border-amber-500/30 animate-spin-slow absolute pointer-events-none" />

                      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                        <div className="w-14 h-14 rounded-full bg-dark-900 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,193,7,0.5)]">
                          {React.createElement(item.icon, { className: 'w-7 h-7 text-amber-400 animate-pulse' })}
                        </div>
                        <span className="text-[10px] font-mono text-amber-300 tracking-widest uppercase bg-dark-900/90 px-2 py-0.5 rounded border border-amber-500/40">
                          {item.category.slice(0, 24)}
                        </span>
                      </div>

                      <span className="absolute top-2 right-2 text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                        ISO 17025
                      </span>
                    </div>

                  </div>

                  {/* Title & Badge */}
                  <div className="space-y-2 mb-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono border ${item.badgeColor} uppercase font-bold tracking-wider`}>
                      {item.category}
                    </span>
                    
                    <h3 className="text-xl font-extrabold font-display text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Bullets List */}
                  <div className="space-y-2.5 mb-6">
                    {item.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-neutral-200 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5 shadow-[0_0_8px_#FFC107]" />
                        <span className="leading-snug">{bullet}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NABL ACCREDITED</span>
                  </div>

                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-transform"
                  >
                    CALIBRATE <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
