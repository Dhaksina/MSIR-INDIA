'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Activity,
  Zap,
  Gauge,
  Thermometer,
  Scale,
  Sparkles,
  Scan,
  Radio,
  Waves,
  ChevronRight,
  ShieldCheck,
  Award,
  ArrowRightLeft,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  X,
  ExternalLink,
  RotateCw,
  Terminal,
  Target
} from 'lucide-react';

import { useInstrumentContext, Equipment } from '@/context/InstrumentContext';

export default function EquipmentShowcase() {
  const { equipmentList } = useInstrumentContext();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [speed, setSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeSpotlightId, setActiveSpotlightId] = useState<string>('fluke-5730a');
  const [inspectEquipment, setInspectEquipment] = useState<Equipment | null>(null);

  const categories = [
    { label: 'ALL', value: 'ALL' },
    { label: 'ELECTRO-TECHNICAL', value: 'ELECTRO-TECHNICAL' },
    { label: 'THERMAL', value: 'THERMAL' },
    { label: 'PRESSURE', value: 'PRESSURE & VACUUM' },
    { label: 'LASER & DIMENSIONAL', value: 'DIMENSIONAL & LASER' },
    { label: 'MASS & FLOW', value: 'MASS & FLOW' }
  ];

  const filteredList = useMemo(() => {
    if (selectedCategory === 'ALL') return equipmentList;
    return equipmentList.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const activeSpotlight = useMemo(() => {
    return equipmentList.find((item) => item.id === activeSpotlightId) || equipmentList[0];
  }, [activeSpotlightId]);

  const marqueeItems = useMemo(() => {
    if (filteredList.length === 0) return [];
    return [...filteredList, ...filteredList, ...filteredList, ...filteredList];
  }, [filteredList]);

  const marqueeDurationSeconds = useMemo(() => {
    const baseDuration = Math.max(25, filteredList.length * 7);
    return baseDuration / speed;
  }, [filteredList.length, speed]);

  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Gauge':
        return <Gauge className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Thermometer':
        return <Thermometer className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Scan':
        return <Scan className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'Waves':
        return <Waves className={className} />;
      default:
        return <Cpu className={className} />;
    }
  };

  return (
    <section id="equipment" className="relative py-24 bg-dark-950 overflow-hidden border-t border-neutral-900">
      
      {/* Background Ambient Glow & Cyber Laser Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-dark-950 to-dark-950 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* CREATIVE 2-COLUMN SPLIT GRID LAYOUT (HEADER & CONTROLS ON THE RIGHT) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
          
          {/* Left Column: Holographic Metrology Spotlight Terminal */}
          <div className="lg:col-span-5 relative rounded-3xl bg-dark-900/90 border border-neutral-800 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden group">
            
            {/* Holographic Glowing Target Backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-amber-500/20 animate-spin-slow pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-amber-400/40 pointer-events-none" />

            <div className="flex items-center justify-between gap-2 mb-6 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Terminal className="w-4 h-4 animate-pulse" />
                <span>PRIMARY LAB TERMINAL</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                ID: {activeSpotlight.id.toUpperCase()}
              </span>
            </div>

            {/* Active Equipment Spotlight Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSpotlight.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 relative z-10"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${activeSpotlight.colorTheme.bg} border ${activeSpotlight.colorTheme.border} shrink-0 ${activeSpotlight.colorTheme.glow}`}>
                    {renderIcon(activeSpotlight.iconName, `w-9 h-9 ${activeSpotlight.colorTheme.text}`)}
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono border ${activeSpotlight.colorTheme.badge} uppercase font-semibold mb-1`}>
                      {activeSpotlight.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white line-clamp-2">
                      {activeSpotlight.name}
                    </h3>
                  </div>
                </div>

                {/* Accuracy Gauge HUD */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-neutral-800/90 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">PRECISION TOLERANCE</span>
                    <span className={`font-bold ${activeSpotlight.colorTheme.text}`}>{activeSpotlight.accuracy}</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-dark-900 overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400"
                      style={{ width: `${activeSpotlight.precisionRating}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
                    <span>RANGE: {activeSpotlight.range}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    {activeSpotlight.standard}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setInspectEquipment(activeSpotlight)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(255,193,7,0.3)] flex items-center justify-center gap-2"
                  >
                    INSPECT FULL SPECS <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Right Column: Creative Header, Tagline, Discipline Filters & Control Panel */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6 text-left">
            
            {/* Top Tag & Main Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-900 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(255,193,7,0.15)]">
                <ArrowRightLeft className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                INFINITE LEFT-TO-RIGHT METROLOGY MARQUEE
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
                BEST MASTER <span className="text-amber-400 text-amber-glow">INSTRUMENTS</span>
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl">
                Inspect MSIR INDIA&apos;s world-class primary calibration reference standards. Scroll interactively left-to-right to inspect sub-ppm tolerances and traceability specs.
              </p>
            </div>

            {/* Discipline Filter Tabs (Right Aligned Wrap) */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                FILTER METROLOGY DISCIPLINE:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-amber-500 text-dark-950 font-bold shadow-[0_0_20px_rgba(255,193,7,0.4)] scale-105'
                          : 'bg-dark-900/80 text-neutral-400 border border-neutral-800 hover:border-amber-500/40 hover:text-white'
                      }`}
                    >
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-dark-950" />}
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marquee HUD Controls Bar */}
            <div className="rounded-2xl bg-dark-900/90 border border-neutral-800 p-4 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
              
              {/* Direction Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400 uppercase flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Direction:
                </span>
                <div className="inline-flex p-1 rounded-xl bg-dark-950 border border-neutral-800">
                  <button
                    onClick={() => setDirection('ltr')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      direction === 'ltr'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ← L-R
                  </button>
                  <button
                    onClick={() => setDirection('rtl')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      direction === 'rtl'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    R-L →
                  </button>
                </div>
              </div>

              {/* Speed Buttons & Play/Pause */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                        speed === s
                          ? 'bg-neutral-800 text-amber-400 border border-amber-500/30 font-bold'
                          : 'bg-dark-950 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-3 py-1.5 rounded-xl bg-dark-950 border border-neutral-800 hover:border-amber-500/40 text-xs font-mono text-neutral-300 hover:text-amber-400 flex items-center gap-1.5 transition-all"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* CREATIVE INFINITE LEFT-TO-RIGHT INSTRUMENT MARQUEE STREAM */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden py-4">
        
        {/* Left & Right Glass Fade Gradient Grates */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-dark-950 via-dark-950/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-dark-950 via-dark-950/90 to-transparent z-20 pointer-events-none" />

        {/* Marquee Row */}
        <div
          className={`flex gap-6 w-max ${
            direction === 'ltr' ? 'animate-marquee-ltr' : 'animate-marquee-rtl'
          } pause-on-hover`}
          style={{
            ['--marquee-duration' as any]: `${marqueeDurationSeconds}s`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {marqueeItems.map((item, index) => {
            const isSpotlighted = item.id === activeSpotlightId;
            return (
              <motion.div
                key={`${item.id}-${index}`}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => {
                  setActiveSpotlightId(item.id);
                  setInspectEquipment(item);
                }}
                className={`w-[320px] sm:w-[370px] shrink-0 cursor-pointer rounded-2xl bg-dark-900/80 border ${
                  isSpotlighted ? 'border-amber-400 ring-2 ring-amber-500/30' : item.colorTheme.border
                } p-6 backdrop-blur-xl transition-all duration-300 ${item.colorTheme.glow} group relative overflow-hidden flex flex-col justify-between`}
              >
                {/* Card Corner Laser Scanline */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Header Badge & Category */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider border ${item.colorTheme.badge} uppercase font-semibold`}>
                      {item.category}
                    </span>

                    <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                      {item.brand}
                    </span>
                  </div>

                  {/* Instrument Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className={`p-3 rounded-xl ${item.colorTheme.bg} border ${item.colorTheme.border} shrink-0 group-hover:rotate-6 transition-transform`}>
                      {renderIcon(item.iconName, `w-6 h-6 ${item.colorTheme.text}`)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Precision Gauge Visual Bar */}
                  <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-dark-950/80 border border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">ACCURACY CLASS</span>
                      <span className={`font-bold ${item.colorTheme.text}`}>{item.accuracy}</span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-dark-900 overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400"
                        style={{ width: `${item.precisionRating}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                      <span>STANDARD: {item.standard}</span>
                    </div>
                  </div>

                  {/* Key Spec Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                    <div className="p-2 rounded-lg bg-dark-950/50 border border-neutral-800/80">
                      <span className="text-[10px] text-neutral-500 block uppercase">Range</span>
                      <span className="text-neutral-200 text-[11px] truncate block" title={item.range}>{item.range}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-950/50 border border-neutral-800/80">
                      <span className="text-[10px] text-neutral-500 block uppercase">Resolution</span>
                      <span className="text-amber-400 text-[11px] truncate block" title={item.resolution}>{item.resolution}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Inspect Action Footer */}
                <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {item.traceability.slice(0, 24)}...
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                    INSPECT <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE HOLOGRAPHIC SPECIFICATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {inspectEquipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            
            {/* Dark Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectEquipment(null)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-2xl"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl rounded-3xl bg-dark-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setInspectEquipment(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-dark-950 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Info */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${inspectEquipment.colorTheme.bg} border ${inspectEquipment.colorTheme.border} shrink-0`}>
                  {renderIcon(inspectEquipment.iconName, `w-8 h-8 ${inspectEquipment.colorTheme.text}`)}
                </div>
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono border ${inspectEquipment.colorTheme.badge} uppercase mb-1.5`}>
                    {inspectEquipment.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {inspectEquipment.name}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    BRAND: {inspectEquipment.brand}
                  </p>
                </div>
              </div>

              {/* Technical Matrix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-dark-950 border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Accuracy Standard</span>
                  <span className={`text-sm font-mono font-bold ${inspectEquipment.colorTheme.text}`}>
                    {inspectEquipment.accuracy}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-950 border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Range</span>
                  <span className="text-sm font-mono font-bold text-cyan-400 truncate block">
                    {inspectEquipment.range}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-950 border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Resolution</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {inspectEquipment.resolution}
                  </span>
                </div>
              </div>

              {/* Traceability Banner */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6 flex items-center gap-3 text-xs font-mono text-amber-300">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block uppercase text-amber-400">METROLOGICAL TRACEABILITY:</span>
                  <span>{inspectEquipment.traceability}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-8">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Key Metrology Capabilities:</span>
                {inspectEquipment.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => setInspectEquipment(null)}
                  className="px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 transition-all"
                >
                  CLOSE INSPECTION
                </button>

                <a
                  href="#booking"
                  onClick={() => setInspectEquipment(null)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(255,193,7,0.3)] flex items-center gap-2"
                >
                  CALIBRATE THIS INSTRUMENT <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
