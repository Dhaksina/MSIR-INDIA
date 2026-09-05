'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Zap,
  Thermometer,
  Gauge,
  Scale,
  Radio,
  Ruler,
  Weight,
  Wrench,
  Activity,
  Mic,
  Sun,
  Waves,
  ShieldCheck,
  Shield,
  Cpu,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Download,
  FileText,
  Sliders,
  Play,
  Pause,
  Search,
  Award,
  Layers,
  Clock,
  Building,
  Calendar,
  Phone,
  Mail,
  BarChart2
} from 'lucide-react';
import BackgroundGridCanvas from '@/components/canvas/BackgroundGridCanvas';
import { FACILITIES_MAP, FacilityData } from '@/data/metrologyFacilitiesData';

// Map icon component by domain ID
const DOMAIN_ICONS: Record<string, React.ElementType> = {
  electrotechnical: Zap,
  temperature: Thermometer,
  pressure: Gauge,
  mass: Scale,
  rf: Radio,
  dimensions: Ruler,
  force: Weight,
  torque: Wrench,
  acceleration: Activity,
  sound: Mic,
  lux: Sun,
  flow: Waves,
};

const ALIAS_MAP: Record<string, string> = {
  'temperature-humidity': 'temperature',
  'pressure-vacuum': 'pressure',
  'mass-volume': 'mass',
  'rf-calibration': 'rf',
  'dimensional': 'dimensions',
  'dimension': 'dimensions',
  'fluid-flow': 'flow',
  'fluid': 'flow',
  'sound-acoustic': 'sound',
  'acceleration-speed': 'acceleration',
  'speed': 'acceleration',
  'photometry': 'lux',
};

const ALL_DOMAINS_LIST = [
  { id: 'electrotechnical', title: 'Electrotechnical', icon: Zap },
  { id: 'temperature', title: 'Temperature & Humidity', icon: Thermometer },
  { id: 'pressure', title: 'Pressure & Vacuum', icon: Gauge },
  { id: 'mass', title: 'Mass & Volume', icon: Scale },
  { id: 'rf', title: 'RF Calibration', icon: Radio },
  { id: 'dimensions', title: 'Dimensions', icon: Ruler },
  { id: 'force', title: 'Force', icon: Weight },
  { id: 'torque', title: 'Torque', icon: Wrench },
  { id: 'acceleration', title: 'Acceleration & Speed', icon: Activity },
  { id: 'sound', title: 'Sound', icon: Mic },
  { id: 'lux', title: 'Lux', icon: Sun },
  { id: 'flow', title: 'Fluid Flow', icon: Waves },
];

export default function GenericFacilityPage() {
  const params = useParams();
  const rawDomain = Array.isArray(params?.domain) ? params.domain[0] : (params?.domain as string) || '';
  const domainKey = ALIAS_MAP[rawDomain.toLowerCase()] || rawDomain.toLowerCase();

  const facility: FacilityData = FACILITIES_MAP[domainKey] || FACILITIES_MAP['temperature'];

  // Simulator state
  const [activeSimMode, setActiveSimMode] = useState<number>(0);
  const [paramValue, setParamValue] = useState<number>(facility.simulator.paramDefault);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [liveReadout, setLiveReadout] = useState<string>(facility.simulator.modes[0]?.baseVal || '100.00');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scope filter & search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cost calculator
  const [selectedInstrument, setSelectedInstrument] = useState<string>(facility.calculator.instruments[0]?.id || '');
  const [calcTier, setCalcTier] = useState<string>('express-48');
  const [calcLocation, setCalcLocation] = useState<string>('lab');
  const [estimate, setEstimate] = useState<{ cost: number; days: string }>({ cost: 3000, days: '2 Business Days' });

  // Update simulator settings when facility changes
  useEffect(() => {
    setActiveSimMode(0);
    setParamValue(facility.simulator.paramDefault);
    setSelectedInstrument(facility.calculator.instruments[0]?.id || '');
  }, [facility]);

  // Recalculate fees
  useEffect(() => {
    const instObj = facility.calculator.instruments.find((i) => i.id === selectedInstrument) || facility.calculator.instruments[0];
    const instMultiplier = instObj ? instObj.multiplier : 1.0;

    let tierMultiplier = 1.0;
    let days = '5-7 Days (Standard)';
    if (calcTier === 'express-48') {
      tierMultiplier = 1.35;
      days = '48 Hours (Fast Track)';
    } else if (calcTier === 'emergency-24') {
      tierMultiplier = 1.75;
      days = '24 Hours (Overnight Lab)';
    }

    let locationExtra = calcLocation === 'onsite' ? 3000 : 0;
    const finalCost = Math.round((facility.calculator.baseFee * instMultiplier * tierMultiplier) + locationExtra);

    setEstimate({ cost: finalCost, days });
  }, [facility, selectedInstrument, calcTier, calcLocation]);

  // Live Canvas Waveform & Physics Simulator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 340);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let t = 0;

    const render = () => {
      ctx.fillStyle = '#07090E';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid / Graticule
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      const xDiv = 10;
      const yDiv = 8;
      const stepX = width / xDiv;
      const stepY = height / yDiv;

      ctx.beginPath();
      for (let i = 0; i <= xDiv; i++) {
        ctx.moveTo(i * stepX, 0);
        ctx.lineTo(i * stepX, height);
      }
      for (let j = 0; j <= yDiv; j++) {
        ctx.moveTo(0, j * stepY);
        ctx.lineTo(width, j * stepY);
      }
      ctx.stroke();

      // Center Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      const centerY = height / 2;

      // Draw physics wave based on active mode
      ctx.strokeStyle = facility.accentHex;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = facility.accentHex;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const noise = noiseEnabled ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;
        let y = centerY;

        if (activeSimMode === 0) {
          // Sinusoidal / Periodic waveform
          const freq = 0.02 + (paramValue / (facility.simulator.paramMax || 100)) * 0.015;
          const amp = (height / 3.2);
          y = centerY + Math.sin(x * freq + t * 3) * amp + noise;
        } else if (activeSimMode === 1) {
          // Damped step / impulse decay response
          const period = (x + t * 60) % 220;
          const decay = Math.exp(-period / 40);
          y = centerY - (decay * Math.cos(period * 0.15) * (height / 2.8)) + noise;
        } else {
          // Steady-state equilibrium drift with low-frequency wander
          const wander = Math.sin((x + t * 25) * 0.006) * 12;
          y = centerY - (paramValue * 0.2) + wander + noise;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isPlaying) {
        t += 0.04;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [facility, activeSimMode, paramValue, noiseEnabled, isPlaying]);

  // Periodic simulated readout update
  useEffect(() => {
    const activeModeObj = facility.simulator.modes[activeSimMode] || facility.simulator.modes[0];
    const interval = setInterval(() => {
      const parsedBase = parseFloat(activeModeObj?.baseVal || '100');
      const jitter = (Math.random() - 0.5) * 0.006;
      setLiveReadout(`${(parsedBase + jitter).toFixed(4)} ${activeModeObj?.unit || ''}`);
    }, 800);
    return () => clearInterval(interval);
  }, [facility, activeSimMode]);

  // Filtered scope
  const filteredScope = facility.scope.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.measurand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.range.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.standardUsed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const IconComponent = DOMAIN_ICONS[facility.id] || Zap;

  return (
    <div className="relative min-h-screen bg-dark-950 text-white selection:bg-amber-500/30 selection:text-amber-400">
      
      {/* Background Canvas */}
      <BackgroundGridCanvas />

      {/* Main Container */}
      <div className="relative z-10 pt-28 pb-20">

        {/* 1. Breadcrumbs & Top Lab Environmental Status Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-5 rounded-2xl bg-dark-900/90 border border-neutral-800/80 backdrop-blur-xl shadow-lg">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Home
              </Link>
              <ChevronRight className="w-3 h-3 text-neutral-600" />
              <Link href="/#laboratory" className="hover:text-amber-400 transition-colors">
                Metrology Domains
              </Link>
              <ChevronRight className="w-3 h-3 text-neutral-600" />
              <span className="text-amber-400 font-bold">{facility.title} Facility</span>
            </div>

            {/* Live Metrology Chamber Telemetry Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-neutral-800 text-neutral-300">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>CHAMBER: <strong className="text-amber-400">{facility.chamber.temp}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-neutral-800 text-neutral-300">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>HUMIDITY: <strong className="text-cyan-400">{facility.chamber.humidity}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-emerald-500/30 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{facility.chamber.special}</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-neutral-800 text-neutral-400">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>{facility.chamber.nablCert}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-b from-dark-900 via-dark-900/90 to-dark-950 border border-neutral-800 shadow-[0_0_50px_rgba(255,193,7,0.1)]">
            
            {/* Ambient Lighting Accents */}
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ backgroundColor: facility.accentHex }}
            />
            <div
              className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15"
              style={{ backgroundColor: facility.secondaryHex }}
            />

            <div className="relative z-10 max-w-4xl space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                  <IconComponent className="w-3.5 h-3.5 fill-amber-400" /> NABL ISO/IEC 17025 ACCREDITED
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-dark-800 border border-neutral-700 text-neutral-300 text-xs font-mono">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> {facility.tagline}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-dark-800 border border-neutral-700 text-neutral-300 text-xs font-mono">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Traceable to NPL (India) & BIPM
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display uppercase tracking-tight text-white leading-tight">
                {facility.title} <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${facility.accentHex}, #FFD54F, ${facility.secondaryHex})`,
                  }}
                >
                  CALIBRATION FACILITY
                </span>
              </h1>

              {/* Overview */}
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                {facility.overview}
              </p>

              {/* Key Quantitative Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {facility.stats.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-dark-950/80 border border-neutral-800 backdrop-blur-md">
                    <p className="text-[11px] font-mono text-neutral-400 uppercase">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-mono font-bold text-amber-400 mt-1">{stat.value}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#booking-calculator"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 text-dark-950 font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,193,7,0.4)] hover:shadow-[0_0_40px_rgba(255,193,7,0.7)] transition-all flex items-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>BOOK CALIBRATION / REQUEST QUOTE</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#scope-matrix"
                  className="px-6 py-3.5 rounded-xl bg-dark-800 border border-neutral-700 text-neutral-200 font-display font-bold text-xs uppercase tracking-wider hover:border-amber-400 hover:text-amber-400 transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>EXPLORE ACCREDITED SCOPE (CMC)</span>
                </a>

                <a
                  href="#standards-showcase"
                  className="px-5 py-3.5 rounded-xl bg-dark-900 border border-neutral-800 text-neutral-400 font-mono text-xs hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>VIEW MASTER STANDARDS</span>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Interactive Telemetry Studio & Waveform Simulator */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-neutral-800/80 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  <Activity className="w-4 h-4 animate-pulse text-amber-400" />
                  <span>LIVE METROLOGY SIGNAL SIMULATOR & TELEMETRY STUDIO</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white">
                  {facility.simulator.title}
                </h2>
              </div>

              {/* Mode Selector */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-dark-950 border border-neutral-800">
                {facility.simulator.modes.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveSimMode(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeSimMode === idx
                        ? 'bg-amber-500 text-dark-950 font-bold shadow-[0_0_15px_rgba(255,193,7,0.4)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Canvas Display */}
              <div className="lg:col-span-8 min-h-[340px] relative rounded-2xl bg-dark-950 border border-neutral-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {/* Top Overlay */}
                <div className="relative z-10 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded bg-dark-900/90 border border-amber-500/30 text-[10px] font-mono text-amber-400 flex items-center gap-2 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>CHANNEL 1 // {facility.title.toUpperCase()} MASTER REFERENCE BUS</span>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-dark-900/90 border border-neutral-800 text-[10px] font-mono text-neutral-400">
                    ACQUISITION: REAL-TIME METROLOGY (120 FPS)
                  </div>
                </div>

                {/* Bottom Overlay Telemetry */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mt-auto pointer-events-none pt-4">
                  <div className="px-3 py-2 rounded-xl bg-dark-900/90 border border-amber-500/40 backdrop-blur-md">
                    <p className="text-[9px] font-mono text-neutral-400 uppercase">MEASURED TELEMETRY</p>
                    <p className="text-base sm:text-xl font-mono font-extrabold text-amber-400">{liveReadout}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2 rounded-xl bg-dark-900/90 border border-neutral-800 backdrop-blur-md">
                      <p className="text-[9px] font-mono text-neutral-400 uppercase">EXPANDED UNCERTAINTY (k=2)</p>
                      <p className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                        {facility.simulator.modes[activeSimMode]?.ppm || '±0.01%'}
                      </p>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-dark-900/90 border border-neutral-800 backdrop-blur-md">
                      <p className="text-[9px] font-mono text-neutral-400 uppercase">TRACEABILITY</p>
                      <p className="text-xs sm:text-sm font-mono text-neutral-300">NPL India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-dark-950 border border-neutral-800 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> PARAMETER TUNING
                  </h3>

                  {/* Slider */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-neutral-400">{facility.simulator.paramLabel}:</span>
                      <span className="text-amber-400 font-bold">{paramValue} {facility.simulator.paramUnit}</span>
                    </div>
                    <input
                      type="range"
                      min={facility.simulator.paramMin}
                      max={facility.simulator.paramMax}
                      step={facility.simulator.paramStep}
                      value={paramValue}
                      onChange={(e) => setParamValue(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  {/* Noise Injection */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-neutral-800 mb-3">
                    <span className="text-xs font-mono text-neutral-300">Thermal / Environmental Noise:</span>
                    <button
                      onClick={() => setNoiseEnabled(!noiseEnabled)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                        noiseEnabled ? 'bg-rose-500 text-white font-bold' : 'bg-dark-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {noiseEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Freeze / Resume */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-neutral-800">
                    <span className="text-xs font-mono text-neutral-300">Signal Stream:</span>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3 py-1 rounded text-xs font-mono bg-dark-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1.5"
                    >
                      {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                      <span>{isPlaying ? 'FREEZE' : 'RESUME'}</span>
                    </button>
                  </div>
                </div>

                {/* ISO Note */}
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] font-mono text-neutral-300 space-y-1">
                  <div className="text-amber-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ISO/IEC 17025 Compliant Measurement
                  </div>
                  <p className="text-neutral-400 text-[10px] leading-relaxed">
                    Evaluated as per GUM (JCGM 100:2008) guidelines with complete Type A and Type B expanded uncertainty analysis.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. Master Reference Standards Showcase */}
        <section id="standards-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-amber-400" /> PRIMARY INSTRUMENTATION ARSENAL
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
              Primary Reference Standards
            </h2>
            <p className="text-neutral-400 text-sm">
              Our {facility.title.toLowerCase()} capabilities are anchored by primary standards directly calibrated 
              by NPL India and BIPM-recognized National Metrology Institutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facility.standards.map((std) => (
              <div
                key={std.id}
                className="group relative rounded-3xl p-6 bg-dark-900/90 border border-neutral-800 hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_35px_rgba(255,193,7,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold uppercase">
                      {std.tag}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">ISO 17025</span>
                  </div>

                  <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                    {std.model}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 mb-3">{std.name}</p>

                  <p className="text-neutral-300 text-xs leading-relaxed mb-5">
                    {std.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Technical Highlights:</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {std.specs.map((spec, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-dark-950 border border-neutral-800/80">
                          <span className="text-neutral-400">{spec.label}:</span>
                          <span className="text-amber-400 font-bold">{spec.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{std.traceability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Complete NABL Scope (CMC) Matrix */}
        <section id="scope-matrix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-6 sm:p-10 rounded-3xl bg-dark-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl">
            
            <div className="space-y-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono mb-2">
                    <FileText className="w-3.5 h-3.5" /> ACCREDITED MEASUREMENT CAPABILITIES
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white">
                    {facility.title} Scope Matrix (CMC)
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Calibration & Measurement Capabilities (CMC) accredited under ISO/IEC 17025:2017. 
                    Uncertainties expressed at an expanded confidence level of approx. 95.45% (k=2).
                  </p>
                </div>

                <a
                  href="#booking-calculator"
                  className="px-5 py-2.5 rounded-xl bg-dark-800 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-mono font-bold flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>REQUEST OFFICIAL NABL CERTIFICATE SCOPE PDF</span>
                </a>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                <div className="flex flex-wrap items-center gap-2">
                  {facility.categories.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCategory === tab.id
                          ? 'bg-amber-500 text-dark-950 font-bold shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                          : 'bg-dark-950 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search measurand or range..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-dark-950 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-4">Discipline / Measurand</th>
                    <th className="py-3.5 px-4">Calibration Range</th>
                    <th className="py-3.5 px-4">Test Condition</th>
                    <th className="py-3.5 px-4 text-amber-400">Expanded CMC (±)</th>
                    <th className="py-3.5 px-4">Master Reference Standard</th>
                    <th className="py-3.5 px-4">Test Standard / Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 bg-dark-900/50">
                  {filteredScope.length > 0 ? (
                    filteredScope.map((item) => (
                      <tr key={item.id} className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <IconComponent className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.measurand}</span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-200 font-bold">{item.range}</td>
                        <td className="py-3.5 px-4 text-neutral-400">{item.condition || 'Direct Metrology'}</td>
                        <td className="py-3.5 px-4 text-amber-400 font-extrabold">{item.cmc}</td>
                        <td className="py-3.5 px-4 text-neutral-300">{item.standardUsed}</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">{item.method}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No parameters match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </section>

        {/* 6. What Instruments We Calibrate */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> COMPREHENSIVE EQUIPMENT DIRECTORY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
              Instruments Serviced & Calibrated
            </h2>
            <p className="text-neutral-400 text-sm">
              We calibrate all major industrial, pharmaceutical, aerospace, and research-grade instrumentation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facility.servicedEquipment.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-dark-900/90 border border-neutral-800 hover:border-amber-400/50 transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display uppercase text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-snug">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Metrological Environmental Rigor & Traceability */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-dark-900/90 border border-neutral-800 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" /> METROLOGICAL INTEGRITY & RIGOR
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white leading-tight">
                  Climate & Environment <br />
                  <span className="text-amber-400">Designed for Zero Drift</span>
                </h2>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Every measurement at MSIR INDIA is conducted under strictly monitored and auditable environmental 
                  controls adhering to ISO/IEC 17025:2017:
                </p>

                <div className="space-y-3">
                  {facility.environmentalRigor.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs font-mono text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unbroken Chain Diagram */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-dark-950 border border-neutral-800 space-y-4">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> UNBROKEN CHAIN OF TRACEABILITY (ISO/IEC 17025)
                </p>

                <div className="space-y-3 relative">
                  {/* Tier 1 */}
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">TIER 1 // INTERNATIONAL DEFINITION</span>
                      <p className="text-xs font-bold text-white">{facility.traceability.tier1}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-dark-950 text-[10px] font-mono text-cyan-400 border border-cyan-500/30">SI BASE</span>
                  </div>

                  <div className="w-0.5 h-3 bg-amber-500/50 mx-auto" />

                  {/* Tier 2 */}
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase">TIER 2 // NATIONAL METROLOGY INSTITUTE</span>
                      <p className="text-xs font-bold text-white">{facility.traceability.tier2}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[10px] font-mono text-amber-400 border border-amber-500/30">PRIMARY LAB</span>
                  </div>

                  <div className="w-0.5 h-3 bg-amber-500/50 mx-auto" />

                  {/* Tier 3 */}
                  <div className="p-3.5 rounded-xl bg-dark-850 border border-amber-400 shadow-[0_0_20px_rgba(255,193,7,0.2)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">TIER 3 // MSIR INDIA ACCREDITED LAB</span>
                      <p className="text-xs font-bold text-amber-300">{facility.traceability.tier3}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-dark-950 font-bold text-[10px] font-mono">NABL CC-2891</span>
                  </div>

                  <div className="w-0.5 h-3 bg-amber-500/50 mx-auto" />

                  {/* Tier 4 */}
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">TIER 4 // CLIENT TEST & MEASUREMENT ASSET</span>
                      <p className="text-xs font-bold text-white">{facility.traceability.tier4}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-dark-950 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">CALIBRATED</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-500 text-center pt-2">
                  Complies fully with ILAC P10 & ISO/IEC 17025:2017 traceability policy.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 8. Interactive Calibration Turnaround & Quotation Estimator */}
        <section id="booking-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-dark-900 to-dark-950 border border-amber-500/40 shadow-2xl relative overflow-hidden">
            
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> INSTANT ESTIMATE & INQUIRY
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
                Book {facility.title} Calibration
              </h2>
              <p className="text-neutral-400 text-sm">
                Get an instant fee estimate for your calibration scope or book an immediate laboratory slot with our certified metrologists.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
              
              {/* Left Configurator */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Select Instrument Type */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-300">Select Instrument Family:</label>
                  <select
                    value={selectedInstrument}
                    onChange={(e) => setSelectedInstrument(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  >
                    {facility.calculator.instruments.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Speed Tier */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-300">Turnaround Speed Tier:</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'standard', title: 'STANDARD', desc: '5-7 Days' },
                      { id: 'express-48', title: 'EXPRESS', desc: '48 Hours' },
                      { id: 'emergency-24', title: 'EMERGENCY', desc: '24 Hours' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setCalcTier(tier.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          calcTier === tier.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-dark-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-display uppercase">{tier.title}</p>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{tier.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-300">Calibration Location:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCalcLocation('lab')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        calcLocation === 'lab'
                          ? 'bg-dark-850 border-amber-400 text-white'
                          : 'bg-dark-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Building className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-xs font-display font-bold uppercase">MSIR Chennai Lab</p>
                        <p className="text-[10px] font-mono text-neutral-400">Controlled Metrology Environment</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCalcLocation('onsite')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        calcLocation === 'onsite'
                          ? 'bg-dark-850 border-amber-400 text-white'
                          : 'bg-dark-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-xs font-display font-bold uppercase">On-Site Mobile Van</p>
                        <p className="text-[10px] font-mono text-neutral-400">At Your Plant / Factory Facility</p>
                      </div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Output Panel */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-dark-950 border border-neutral-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Estimated Turnaround:</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{estimate.days}</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Calibration Certificate:</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">NABL ISO/IEC 17025</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Traceability:</span>
                    <span className="text-xs font-mono text-neutral-300">NPL India (Dual Signatory)</span>
                  </div>

                  <div className="pt-2">
                    <p className="text-[11px] font-mono text-neutral-400 uppercase">INDICATIVE CALIBRATION FEE</p>
                    <p className="text-3xl font-display font-extrabold text-white mt-1">
                      ₹ {estimate.cost.toLocaleString('en-IN')} <span className="text-xs font-mono text-neutral-500 font-normal">+ GST</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/#booking"
                    className="w-full py-3.5 rounded-xl bg-amber-500 text-dark-950 font-display font-bold text-xs uppercase tracking-wider text-center shadow-[0_0_20px_rgba(255,193,7,0.4)] hover:shadow-[0_0_35px_rgba(255,193,7,0.7)] transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>CONFIRM & SCHEDULE INTAKE</span>
                  </Link>

                  <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-amber-400" /> +91 94440 28911</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber-400" /> lab@msirindia.com</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 9. Navigation to Other Metrology Disciplines */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-neutral-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-display uppercase text-white">
                  Explore All 12 Metrology Laboratories
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  MSIR INDIA operates 12 specialized NABL-accredited metrology domains in Chennai.
                </p>
              </div>

              <Link
                href="/#laboratory"
                className="px-5 py-2.5 rounded-xl bg-dark-800 border border-neutral-700 hover:border-amber-400 text-neutral-200 hover:text-amber-400 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <span>RETURN TO LABORATORY DOMAINS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Discipline Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {ALL_DOMAINS_LIST.map((item) => {
                const ItemIcon = item.icon;
                const isCurrent = item.id === facility.id;
                return (
                  <Link
                    key={item.id}
                    href={`/facilities/${item.id}`}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                        : 'bg-dark-950 border-neutral-800 hover:border-neutral-700 hover:text-amber-400 text-neutral-400'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                    <span className="text-[11px] font-mono font-bold uppercase line-clamp-1">{item.title}</span>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
