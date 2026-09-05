'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Shield,
  Cpu,
  Gauge,
  Activity,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Download,
  FileText,
  Sparkles,
  Sliders,
  Play,
  Pause,
  RefreshCw,
  Search,
  ExternalLink,
  Award,
  Layers,
  Thermometer,
  Clock,
  Check,
  Building,
  Radio,
  Waves,
  Calendar,
  Phone,
  Mail,
  HelpCircle,
  BarChart2,
  Hash,
  Compass
} from 'lucide-react';
import BackgroundGridCanvas from '@/components/canvas/BackgroundGridCanvas';

// Master Reference Standards
const MASTER_STANDARDS = [
  {
    id: 'fluke-5730a',
    model: 'Fluke 5730A',
    name: 'Multifunction Reference Calibrator',
    tag: 'Primary Metrology Standard',
    description: 'The global gold standard in DC/LF electrical calibration. Features internal Artifact Calibration to maintain traceability to external standards with sub-ppm stability.',
    specs: [
      { label: 'DC Voltage', val: '0 to 1100 V (±1.5 ppm)' },
      { label: 'AC Voltage', val: '220 mV to 1100 V (10 Hz - 1.2 MHz)' },
      { label: 'Resistance', val: '1 Ω to 100 MΩ in x1 & x1.9' },
      { label: 'DC/AC Current', val: 'Up to 2.2 A (120 A with 52120A)' },
    ],
    traceability: 'NPL India / NIST Direct Calibration',
    imageType: 'calibrator',
  },
  {
    id: 'keysight-3458a',
    model: 'Keysight 3458A',
    name: '8.5-Digit High-Stability DMM',
    tag: 'Reference Transfer Standard',
    description: 'Industry benchmark for precision measurement and linearity. Offers 8.5-digit resolution, transfer accuracy of 0.1 ppm, and sub-nanovolt DC voltage sampling.',
    specs: [
      { label: 'Resolution', val: '8.5 Digits (10 nV sensitivity)' },
      { label: 'Transfer Accuracy', val: '0.1 ppm of reading' },
      { label: 'Sampling Speed', val: 'Up to 100k readings/sec' },
      { label: 'Linearity', val: '±0.05 ppm of reading + 0.05 ppm range' },
    ],
    traceability: 'Traceable to BIPM Josephson Junction Array',
    imageType: 'multimeter',
  },
  {
    id: 'fluke-52120a',
    model: 'Fluke 52120A',
    name: 'Transconductance Power Current Amplifier',
    tag: 'High-Current Master Source',
    description: 'Delivers stable, high-accuracy AC and DC current outputs up to 120 Amperes standalone, and up to 10,000 A with parallel-coupled toroidal coils for clamp meters.',
    specs: [
      { label: 'Output Current', val: 'Up to 120 A DC & AC RMS' },
      { label: 'Coil Multiplier', val: 'Up to 12,000 A-turns (25/50-turn)' },
      { label: 'Bandwidth', val: 'DC to 100 kHz high fidelity' },
      { label: 'Compliance Voltage', val: 'Up to 4.5 V RMS' },
    ],
    traceability: 'Traceable to National Metrology Institutes (NPLI)',
    imageType: 'amplifier',
  },
  {
    id: 'guildline-9330',
    model: 'Guildline 9330 Series',
    name: 'Ultra-Stable Resistance Standards in Oil Bath',
    tag: 'Primary Resistance Transfer',
    description: 'Hermetically sealed standard resistors immersed in a temperature-regulated fluid bath maintained at 23.00 °C, ensuring virtually zero thermal drift.',
    specs: [
      { label: 'Resistance Values', val: '0.001 Ω to 100 MΩ decade steps' },
      { label: 'Temp Coefficient', val: '< 0.1 ppm / °C' },
      { label: 'Annual Stability', val: '< 0.5 ppm / year' },
      { label: 'Bath Temperature', val: '23.00 °C ± 0.01 °C regulated' },
    ],
    traceability: 'Quantum Hall Resistance Traceable',
    imageType: 'resistor',
  },
  {
    id: 'srs-fs725',
    model: 'SRS FS725',
    name: 'Rubidium Atomic Frequency Standard',
    tag: 'Master Time & Frequency Reference',
    description: 'Ultra-low phase noise rubidium atomic clock source providing a rock-solid 10 MHz reference for all frequency counters, signal generators, and spectrum analyzers.',
    specs: [
      { label: 'Outputs', val: '10 MHz & 5 MHz Sine, 1 PPS' },
      { label: 'Allan Deviation', val: '< 2 × 10⁻¹¹ (1 s)' },
      { label: 'Monthly Aging', val: '< 5 × 10⁻¹¹ / month' },
      { label: 'Harmonic Distortion', val: '< -30 dBc' },
    ],
    traceability: 'Directly synchronized with UTC (NPLI)',
    imageType: 'atomic',
  },
  {
    id: 'phenix-100kv',
    model: 'Phenix Technologies 100kV',
    name: 'Precision AC/DC High Voltage Divider',
    tag: 'High Voltage Breakdown Facility',
    description: 'Shielded high-voltage capacitive-resistive divider designed for ultra-high accuracy measurements of hipot test sets, megohmmeters, and spark testers.',
    specs: [
      { label: 'DC Voltage Range', val: '0 to 100 kV DC' },
      { label: 'AC Voltage Range', val: '0 to 70 kV AC RMS (50/60 Hz)' },
      { label: 'Voltage Ratio', val: '10,000 : 1 precision matched' },
      { label: 'Measurement Uncertainty', val: '± 0.05 % of reading' },
    ],
    traceability: 'High Voltage Metrology NPL Traceable',
    imageType: 'hv',
  }
];

// Complete NABL Scope Matrix Data
interface ScopeItem {
  id: string;
  category: 'dc' | 'ac' | 'res' | 'hv' | 'freq' | 'power';
  measurand: string;
  range: string;
  frequency?: string;
  cmc: string; // Calibration Measurement Capability (Uncertainty)
  standardUsed: string;
  method: string;
}

const SCOPE_DATA: ScopeItem[] = [
  {
    id: '1',
    category: 'dc',
    measurand: 'DC Voltage (Low Range / Sub-Microvolt)',
    range: '10 nV to 200 mV',
    cmc: '± (1.2 ppm to 3.5 ppm)',
    standardUsed: 'Fluke 5730A Calibrator / Keysight 3458A DMM',
    method: 'Direct measurement / Comparison as per EURAMET cg-15',
  },
  {
    id: '2',
    category: 'dc',
    measurand: 'DC Voltage (Standard & High Range)',
    range: '200 mV to 1100 V',
    cmc: '± (1.5 ppm to 4.0 ppm)',
    standardUsed: 'Fluke 5730A Multifunction Calibrator',
    method: 'Direct substitution against calibrated reference',
  },
  {
    id: '3',
    category: 'hv',
    measurand: 'DC High Voltage',
    range: '1.1 kV to 100 kV',
    cmc: '± 0.05 % to ± 0.12 %',
    standardUsed: 'Phenix Precision HV Divider & 8.5-Digit DMM',
    method: 'Precision resistive divider ratio technique (IS 2071)',
  },
  {
    id: '4',
    category: 'ac',
    measurand: 'AC Voltage (Low & Audio Frequency)',
    range: '1 mV to 1000 V',
    frequency: '10 Hz to 100 kHz',
    cmc: '± 25 ppm to ± 90 ppm',
    standardUsed: 'Fluke 5730A with Wideband AC option',
    method: 'Thermal voltage transfer comparison',
  },
  {
    id: '5',
    category: 'ac',
    measurand: 'AC Voltage (High Frequency / RF)',
    range: '10 mV to 10 V',
    frequency: '100 kHz to 30 MHz',
    cmc: '± 0.15 % to ± 0.45 %',
    standardUsed: 'Precision Thermal Transfer Standards',
    method: 'RF Power & AC/DC thermal difference metrology',
  },
  {
    id: '6',
    category: 'hv',
    measurand: 'AC High Voltage (50 Hz / 60 Hz)',
    range: '1 kV to 70 kV RMS',
    frequency: '50 Hz / 60 Hz',
    cmc: '± 0.08 % of reading',
    standardUsed: 'Calibrated Capacitive-Resistive Divider',
    method: 'High voltage AC test standard (IEC 60060-2)',
  },
  {
    id: '7',
    category: 'dc',
    measurand: 'DC Current (Picoampere to Milliampere)',
    range: '10 pA to 200 mA',
    cmc: '± 10 ppm to ± 35 ppm',
    standardUsed: 'Electrometer Reference / Keysight 3458A',
    method: 'Standard resistor IV conversion technique',
  },
  {
    id: '8',
    category: 'dc',
    measurand: 'DC Current (High Current / Shunt Range)',
    range: '200 mA to 1000 A',
    cmc: '± 45 ppm to ± 120 ppm',
    standardUsed: 'Fluke 52120A Amplifier & Precision Coaxial Shunts',
    method: 'Precision low-inductance shunt drop measurement',
  },
  {
    id: '9',
    category: 'ac',
    measurand: 'AC Current',
    range: '10 µA to 1000 A',
    frequency: '10 Hz to 10 kHz',
    cmc: '± 80 ppm to ± 250 ppm',
    standardUsed: 'Fluke 5730A + 52120A Power Transconductance',
    method: 'AC current shunt comparison & Rogowski calibration',
  },
  {
    id: '10',
    category: 'res',
    measurand: 'Standard Resistance (4-Wire Kelvin)',
    range: '10 µΩ to 1 Ω (Low Ohm)',
    cmc: '± 2.5 ppm to ± 10 ppm',
    standardUsed: 'Guildline Standard Resistors in Oil Bath',
    method: 'Automated 4-Wire current reversal null comparison',
  },
  {
    id: '11',
    category: 'res',
    measurand: 'Resistance (Standard Decade Range)',
    range: '1 Ω to 100 MΩ',
    cmc: '± 1.8 ppm to ± 15 ppm',
    standardUsed: 'Guildline 9330 Series & Fluke 5730A',
    method: 'Direct ratio bridge substitution',
  },
  {
    id: '12',
    category: 'res',
    measurand: 'High & Ultra-High Resistance (Insulation)',
    range: '100 MΩ to 10 TΩ (Teraohm)',
    cmc: '± 0.25 % to ± 1.5 %',
    standardUsed: 'High-Voltage Guarded Decade Megohm Standard',
    method: 'Sub-picoampere constant voltage dual-bridge method',
  },
  {
    id: '13',
    category: 'freq',
    measurand: 'Time & Frequency Standard',
    range: '0.001 Hz to 26.5 GHz',
    cmc: '± 2 × 10⁻¹¹ (Rubidium)',
    standardUsed: 'SRS FS725 Atomic Standard + Keysight Counter',
    method: 'Direct phase comparison against UTC reference',
  },
  {
    id: '14',
    category: 'power',
    measurand: 'Active & Reactive AC Power (1-Phase / 3-Phase)',
    range: '10 V - 600 V / 10 mA - 100 A (PF: -1 to +1)',
    frequency: '45 Hz to 400 Hz',
    cmc: '± 0.025 % of apparent power',
    standardUsed: 'Radian / Fluke Precision Power Standard',
    method: 'Dual-channel digital sampling wattmeter method',
  },
];

// Equipment Calibrated List
const CALIBRATED_EQUIPMENT = [
  { name: 'Digital Multimeters', sub: '3.5 to 8.5 Digits, Benchtop & Handheld', icon: Cpu },
  { name: 'Oscilloscopes', sub: 'DSO, MSO, Sampling up to 26.5 GHz', icon: Activity },
  { name: 'AC/DC Clamp Meters', sub: 'Up to 10,000 A with Coils & Rogowski', icon: Gauge },
  { name: 'Power Quality Analyzers', sub: 'Harmonics, Flicker, 3-Phase Energy', icon: BarChart2 },
  { name: 'Insulation & Megohm Testers', sub: 'Up to 10 kV and 10 TΩ Resistance', icon: ShieldCheck },
  { name: 'Hipot / Dielectric Testers', sub: 'AC & DC High Voltage Withstand', icon: Zap },
  { name: 'LCR & Impedance Meters', sub: 'Capacitance, Inductance, ESR, Tan δ', icon: Layers },
  { name: 'Earth & Ground Testers', sub: 'Soil Resistivity, 2/3/4-Wire Grounding', icon: Compass },
  { name: 'Frequency Counters & Timers', sub: 'Crystal Oscillators, Time Interval', icon: Clock },
  { name: 'Signal & Waveform Generators', sub: 'Function, Arbitrary, Pulse, RF Sources', icon: Waves },
  { name: 'Current Shunts & Transducers', sub: 'Precision DC & AC Coaxial Shunts', icon: Hash },
  { name: 'Process & Loop Calibrators', sub: '4-20 mA, 0-10 V, RTD, Thermocouple', icon: Sliders },
];

export default function ElectrotechnicalFacilityPage() {
  // Simulator State
  const [simulatorMode, setSimulatorMode] = useState<'dc' | 'ac' | 'hv' | 'kelvin'>('dc');
  const [testFrequency, setTestFrequency] = useState<number>(1000); // 1 kHz
  const [testVoltage, setTestVoltage] = useState<number>(10.0); // 10 V
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [measuredValue, setMeasuredValue] = useState<string>('10.000002');
  const [uncertaintyPpm, setUncertaintyPpm] = useState<number>(1.2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scope Filter & Search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cost Calculator State
  const [calcInstrument, setCalcInstrument] = useState<string>('multimeter-bench');
  const [calcTier, setCalcTier] = useState<string>('express-48');
  const [calcLocation, setCalcLocation] = useState<string>('lab');
  const [calcEstimate, setCalcEstimate] = useState<{ cost: number; days: string }>({ cost: 3500, days: '2 Business Days' });

  // Update calculator
  useEffect(() => {
    let base = 2500;
    if (calcInstrument === 'multimeter-bench') base = 3500;
    if (calcInstrument === 'oscilloscope-high') base = 7500;
    if (calcInstrument === 'power-analyzer') base = 6500;
    if (calcInstrument === 'hipot-hv') base = 5500;
    if (calcInstrument === 'calibrator-primary') base = 15000;

    let multiplier = 1.0;
    let days = '5-7 Days (Standard)';
    if (calcTier === 'express-48') {
      multiplier = 1.35;
      days = '48 Hours (Fast Track)';
    } else if (calcTier === 'emergency-24') {
      multiplier = 1.75;
      days = '24 Hours (Overnight Lab)';
    }

    if (calcLocation === 'onsite') {
      base += 3000;
    }

    setCalcEstimate({
      cost: Math.round(base * multiplier),
      days,
    });
  }, [calcInstrument, calcTier, calcLocation]);

  // Live Canvas Waveform Simulation
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
      ctx.strokeStyle = 'rgba(255, 193, 7, 0.08)';
      ctx.lineWidth = 1;
      const xDivisions = 10;
      const yDivisions = 8;
      const stepX = width / xDivisions;
      const stepY = height / yDivisions;

      ctx.beginPath();
      for (let i = 0; i <= xDivisions; i++) {
        ctx.moveTo(i * stepX, 0);
        ctx.lineTo(i * stepX, height);
      }
      for (let j = 0; j <= yDivisions; j++) {
        ctx.moveTo(0, j * stepY);
        ctx.lineTo(width, j * stepY);
      }
      ctx.stroke();

      // Center Lines (Crosshairs)
      ctx.strokeStyle = 'rgba(255, 193, 7, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      const centerY = height / 2;

      // Draw Waveform based on selected mode
      if (simulatorMode === 'dc') {
        // 8.5-Digit DC Voltage standard with micro-drift
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#FFC107';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const thermalJitter = noiseEnabled ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;
          const slowDrift = Math.sin((x + t * 40) * 0.005) * 4;
          const y = centerY - (testVoltage * 5) + thermalJitter + slowDrift;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Tolerance Band
        ctx.fillStyle = 'rgba(255, 193, 7, 0.05)';
        ctx.fillRect(0, centerY - (testVoltage * 5) - 15, width, 30);

      } else if (simulatorMode === 'ac') {
        // Precision Sine Wave Calibrator
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 14;

        const amplitude = (height / 2.6) * (testVoltage / 10);
        const freqRatio = (testFrequency / 1000) * 0.03;

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const harmonic = Math.sin((x * freqRatio * 3 + t * 6)) * (noiseEnabled ? 12 : 2);
          const noise = noiseEnabled ? (Math.random() - 0.5) * 6 : 0;
          const y = centerY + Math.sin(x * freqRatio + t * 4) * amplitude + harmonic + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else if (simulatorMode === 'hv') {
        // High Voltage Pulse & Impulse Breakdown Curve
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#F43F5E';
        ctx.shadowBlur = 16;

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const period = (x + t * 80) % 250;
          let y = centerY + 80;
          if (period < 15) {
            y = centerY - 110 + (Math.random() - 0.5) * (noiseEnabled ? 20 : 5);
          } else if (period < 180) {
            const decay = Math.exp(-(period - 15) / 35);
            y = centerY + 80 - 190 * decay;
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else if (simulatorMode === 'kelvin') {
        // 4-Wire Kelvin Bridge Galvanometer Balance
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const balanceConvergence = Math.exp(-x / (width * 0.4)) * Math.sin(x * 0.05 + t * 2) * 80;
          const reversalTransient = Math.sin((x + t * 10) * 0.01) * 2;
          const noise = (Math.random() - 0.5) * (noiseEnabled ? 6 : 1.2);
          const y = centerY + balanceConvergence + reversalTransient + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

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
  }, [simulatorMode, testFrequency, testVoltage, noiseEnabled, isPlaying]);

  // Periodic simulated reading jitter
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulatorMode === 'dc') {
        const drift = (Math.random() * 0.000006 - 0.000003);
        const val = (testVoltage + drift).toFixed(6);
        setMeasuredValue(val);
        setUncertaintyPpm(1.2 + Math.random() * 0.15);
      } else if (simulatorMode === 'ac') {
        const vRms = (testVoltage * 0.707106).toFixed(4);
        setMeasuredValue(`${vRms} V RMS`);
        setUncertaintyPpm(24.5 + Math.random() * 1.5);
      } else if (simulatorMode === 'hv') {
        const hv = (testVoltage * 10).toFixed(2);
        setMeasuredValue(`${hv} kV PK`);
        setUncertaintyPpm(450);
      } else if (simulatorMode === 'kelvin') {
        const rVal = (1.0000024).toFixed(7);
        setMeasuredValue(`${rVal} Ω`);
        setUncertaintyPpm(0.85);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [simulatorMode, testVoltage]);

  // Filtered Scope Data
  const filteredScope = SCOPE_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.measurand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.range.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.standardUsed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-dark-950 text-white selection:bg-amber-500/30 selection:text-amber-400">
      
      {/* Background Laser Canvas */}
      <BackgroundGridCanvas />

      {/* Main Container */}
      <div className="relative z-10 pt-28 pb-20">

        {/* 1. Breadcrumbs & Top Lab Status Bar */}
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
              <span className="text-amber-400 font-bold">Electrotechnical Facility</span>
            </div>

            {/* Live Metrology Chamber Telemetry Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-neutral-800 text-neutral-300">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>CHAMBER: <strong className="text-amber-400">23.0 °C ± 0.5 °C</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-neutral-800 text-neutral-300">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>HUMIDITY: <strong className="text-cyan-400">45.0% RH</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-emerald-500/30 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FARADAY CAGE: <strong>ACTIVE</strong></span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950 border border-neutral-800 text-neutral-400">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>NABL CC-2891</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Hero Section: Electrotechnical Facility */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-b from-dark-900 via-dark-900/90 to-dark-950 border border-amber-500/30 shadow-[0_0_50px_rgba(255,193,7,0.15)]">
            
            {/* Ambient Lighting Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-6">
              
              {/* Pillar Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" /> NABL ISO/IEC 17025 ACCREDITED
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-dark-800 border border-neutral-700 text-neutral-300 text-xs font-mono">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Primary Calibration Discipline
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-dark-800 border border-neutral-700 text-neutral-300 text-xs font-mono">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Traceable to NPL (India) & BIPM
                </span>
              </div>

              {/* Epic Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display uppercase tracking-tight text-white leading-tight">
                ELECTROTECHNICAL <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  CALIBRATION FACILITY
                </span>
              </h1>

              {/* Subtitle / Overview */}
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                MSIR INDIA houses Chennai’s premier electrical metrology laboratory. Engineered with 
                vibration-isolated optical breadboards, low-noise Faradaic electromagnetic shielding, 
                and automated IEEE-488 GPIB data acquisition, we deliver sub-picoampere to 100 kV high-voltage 
                calibration with world-class measurement uncertainty (down to ±1.5 ppm).
              </p>

              {/* Key Quantitative Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-neutral-800 backdrop-blur-md">
                  <p className="text-[11px] font-mono text-neutral-400 uppercase">VOLTAGE RANGE</p>
                  <p className="text-lg sm:text-xl font-mono font-bold text-amber-400 mt-1">10 nV to 100 kV</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">DC & AC to 70 kV RMS</p>
                </div>
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-neutral-800 backdrop-blur-md">
                  <p className="text-[11px] font-mono text-neutral-400 uppercase">CURRENT RANGE</p>
                  <p className="text-lg sm:text-xl font-mono font-bold text-amber-400 mt-1">10 pA to 1,000 A</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Up to 10 kA via coils</p>
                </div>
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-neutral-800 backdrop-blur-md">
                  <p className="text-[11px] font-mono text-neutral-400 uppercase">BEST MEASUREMENT CMC</p>
                  <p className="text-lg sm:text-xl font-mono font-bold text-amber-400 mt-1">± 1.5 ppm</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Fluke 5730A 8.5-Digit</p>
                </div>
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-neutral-800 backdrop-blur-md">
                  <p className="text-[11px] font-mono text-neutral-400 uppercase">TIMEBASE STABILITY</p>
                  <p className="text-lg sm:text-xl font-mono font-bold text-amber-400 mt-1">2 × 10⁻¹¹</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Rubidium Atomic Standard</p>
                </div>
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

        {/* 3. Interactive Signal & Waveform Metrology Simulator Studio */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-neutral-800/80 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  <Activity className="w-4 h-4 animate-pulse text-amber-400" />
                  <span>LABORATORY SIGNAL SIMULATOR & TELEMETRY STUDIO</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white">
                  Real-Time Waveform & Metrology Analyzer
                </h2>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-dark-950 border border-neutral-800">
                <button
                  onClick={() => setSimulatorMode('dc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    simulatorMode === 'dc'
                      ? 'bg-amber-500 text-dark-950 font-bold shadow-[0_0_15px_rgba(255,193,7,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚡ 8.5-DIGIT DC
                </button>
                <button
                  onClick={() => setSimulatorMode('ac')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    simulatorMode === 'ac'
                      ? 'bg-cyan-500 text-dark-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  〰️ AC VOLTAGE (1 kHz)
                </button>
                <button
                  onClick={() => setSimulatorMode('hv')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    simulatorMode === 'hv'
                      ? 'bg-rose-500 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚡ 100 kV HIGH VOLTAGE
                </button>
                <button
                  onClick={() => setSimulatorMode('kelvin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    simulatorMode === 'kelvin'
                      ? 'bg-emerald-500 text-dark-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚖️ 4-WIRE KELVIN
                </button>
              </div>
            </div>

            {/* Canvas & Control Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Interactive 120 FPS Canvas Display */}
              <div className="lg:col-span-8 min-h-[340px] relative rounded-2xl bg-dark-950 border border-neutral-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                
                {/* Canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {/* Top Overlay Bar */}
                <div className="relative z-10 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded bg-dark-900/90 border border-amber-500/30 text-[10px] font-mono text-amber-400 flex items-center gap-2 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>CHANNEL 1 // TRACEABLE PRIMARY REFERENCE BUS</span>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-dark-900/90 border border-neutral-800 text-[10px] font-mono text-neutral-400">
                    ACQUISITION: IEEE-488 GPIB (100 kS/s)
                  </div>
                </div>

                {/* Bottom Overlay Telemetry Data */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mt-auto pointer-events-none pt-4">
                  <div className="px-3 py-2 rounded-xl bg-dark-900/90 border border-amber-500/40 backdrop-blur-md">
                    <p className="text-[9px] font-mono text-neutral-400 uppercase">MEASURED READOUT</p>
                    <p className="text-base sm:text-xl font-mono font-extrabold text-amber-400">{measuredValue}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2 rounded-xl bg-dark-900/90 border border-neutral-800 backdrop-blur-md">
                      <p className="text-[9px] font-mono text-neutral-400 uppercase">EXPANDED UNCERTAINTY (k=2)</p>
                      <p className="text-xs sm:text-sm font-mono font-bold text-emerald-400">± {uncertaintyPpm.toFixed(2)} ppm</p>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-dark-900/90 border border-neutral-800 backdrop-blur-md">
                      <p className="text-[9px] font-mono text-neutral-400 uppercase">TRACEABILITY</p>
                      <p className="text-xs sm:text-sm font-mono text-neutral-300">NPL (India)</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Parameter Tuning */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-dark-950 border border-neutral-800 flex flex-col justify-between space-y-4">
                
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> PARAMETER CONTROLS
                  </h3>

                  {/* Voltage Slider */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-neutral-400">Test Amplitude:</span>
                      <span className="text-amber-400 font-bold">{testVoltage} V</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={testVoltage}
                      onChange={(e) => setTestVoltage(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  {/* Frequency Slider (if AC) */}
                  {simulatorMode === 'ac' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Frequency:</span>
                        <span className="text-cyan-400 font-bold">{testFrequency} Hz</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="10000"
                        step="50"
                        value={testFrequency}
                        onChange={(e) => setTestFrequency(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  )}

                  {/* Toggle Noise Injection */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-neutral-800 mb-3">
                    <span className="text-xs font-mono text-neutral-300">Inject Thermal EMF / EMI Noise:</span>
                    <button
                      onClick={() => setNoiseEnabled(!noiseEnabled)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                        noiseEnabled
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-dark-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {noiseEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Play / Pause */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-neutral-800">
                    <span className="text-xs font-mono text-neutral-300">Waveform Stream:</span>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3 py-1 rounded text-xs font-mono bg-dark-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1.5"
                    >
                      {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                      <span>{isPlaying ? 'FREEZE' : 'RESUME'}</span>
                    </button>
                  </div>
                </div>

                {/* Method note */}
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] font-mono text-neutral-300 space-y-1">
                  <div className="text-amber-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ISO 17025 Compliant Measurement
                  </div>
                  <p className="text-neutral-400 text-[10px] leading-relaxed">
                    Readings undergo automated 20-sample averaging and Type A/B standard uncertainty evaluation (GUM JCGM 100:2008).
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
              Our laboratory calibration capabilities are backed by industry-standard calibrators, reference multimeters, 
              and atomic clocks directly calibrated by NPL India and BIPM-recognized National Metrology Institutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MASTER_STANDARDS.map((std) => (
              <div
                key={std.id}
                className="group relative rounded-3xl p-6 bg-dark-900/90 border border-neutral-800 hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_35px_rgba(255,193,7,0.15)]"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold uppercase">
                      {std.tag}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">ISO 17025</span>
                  </div>

                  {/* Instrument Title */}
                  <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                    {std.model}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 mb-3">{std.name}</p>

                  <p className="text-neutral-300 text-xs leading-relaxed mb-5">
                    {std.description}
                  </p>

                  {/* Key Specifications */}
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

                {/* Footer Traceability */}
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

        {/* 5. Complete NABL Calibration Scope & CMC Explorer */}
        <section id="scope-matrix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-6 sm:p-10 rounded-3xl bg-dark-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl">
            
            {/* Header & Controls */}
            <div className="space-y-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono mb-2">
                    <FileText className="w-3.5 h-3.5" /> ACCREDITED MEASUREMENT CAPABILITIES
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white">
                    Electrotechnical Scope Matrix (CMC)
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Calibration & Measurement Capabilities (CMC) accredited under ISO/IEC 17025:2017. 
                    Uncertainties expressed at an expanded confidence level of approx. 95.45% (k=2).
                  </p>
                </div>

                {/* Scope Download CTA */}
                <a
                  href="#booking-calculator"
                  className="px-5 py-2.5 rounded-xl bg-dark-800 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-mono font-bold flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>REQUEST OFFICIAL NABL CERTIFICATE SCOPE PDF</span>
                </a>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'All Parameters' },
                    { id: 'dc', label: 'DC Voltage & Current' },
                    { id: 'ac', label: 'AC Metrology' },
                    { id: 'res', label: 'Resistance & High-Ohm' },
                    { id: 'hv', label: 'High Voltage (to 100 kV)' },
                    { id: 'freq', label: 'Frequency & Time' },
                    { id: 'power', label: 'Power & Energy' },
                  ].map((tab) => (
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

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search parameter or range..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

              </div>
            </div>

            {/* Scope Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-dark-950 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-4">Discipline / Measurand</th>
                    <th className="py-3.5 px-4">Calibration Range</th>
                    <th className="py-3.5 px-4">Frequency / Test Condition</th>
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
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.measurand}</span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-200 font-bold">{item.range}</td>
                        <td className="py-3.5 px-4 text-neutral-400">{item.frequency || 'DC / Direct'}</td>
                        <td className="py-3.5 px-4 text-amber-400 font-extrabold">{item.cmc}</td>
                        <td className="py-3.5 px-4 text-neutral-300">{item.standardUsed}</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">{item.method}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No parameters match your search query. Please try searching for "voltage", "current", "resistance", or "high voltage".
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
              We service and calibrate all major brands including Keysight, Fluke, Tektronix, Rohde & Schwarz, 
              Hioki, Megger, Chroma, Yokogawa, and Keithley.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CALIBRATED_EQUIPMENT.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-dark-900/90 border border-neutral-800 hover:border-amber-400/50 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all shrink-0">
                    <IconComp className="w-5 h-5" />
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
              );
            })}
          </div>
        </section>

        {/* 7. Laboratory Environmental & Quality Integrity */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-dark-900/90 border border-neutral-800 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" /> METROLOGICAL INTEGRITY & CLEAN ENVIRONMENT
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white leading-tight">
                  Engineered For Zero <br />
                  <span className="text-amber-400">Thermal & Electromagnetic Drift</span>
                </h2>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Electrical metrology at the ppm level demands strict isolation from temperature shifts, 
                  relative humidity swings, electromagnetic interference, and seismic floor vibration. 
                  MSIR INDIA’s electrotechnical facility operates inside a custom-constructed environment:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-xs font-mono text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Continuous 24/7 HVAC Control:</strong> Temperature held strictly at 23.0 °C ± 0.5 °C with independent multi-stage chillers.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs font-mono text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Faraday RF Enclosure:</strong> Copper-mesh shielded bays attenuating wireless EMI, cellular signals, and industrial noise.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs font-mono text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Dedicated Metrology Earthing (&lt;0.2 Ω):</strong> Isolated solid chemical ground rods isolated from the building power grid.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs font-mono text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Pneumatic Optical Tables:</strong> Sub-micron vibration damping protecting delicate galvanometer balances and quartz oscillators.</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Traceability Chain Diagram */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-dark-950 border border-neutral-800 space-y-4">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> UNBROKEN CHAIN OF TRACEABILITY (ISO/IEC 17025)
                </p>

                <div className="space-y-3 relative">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">TIER 1 // INTERNATIONAL METROLOGY</span>
                      <p className="text-xs font-bold text-white">BIPM / SI Base Units (Volt, Ampere, Ohm, Second)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-dark-950 text-[10px] font-mono text-cyan-400 border border-cyan-500/30">SI DEFINITION</span>
                  </div>

                  <div className="w-0.5 h-3 bg-amber-500/50 mx-auto" />

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase">TIER 2 // NATIONAL METROLOGY INSTITUTE</span>
                      <p className="text-xs font-bold text-white">National Physical Laboratory (NPL India) / NIST</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[10px] font-mono text-amber-400 border border-amber-500/30">PRIMARY LAB</span>
                  </div>

                  <div className="w-0.5 h-3 bg-amber-500/50 mx-auto" />

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl bg-dark-850 border border-amber-400 shadow-[0_0_20px_rgba(255,193,7,0.2)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">TIER 3 // MSIR INDIA ACCREDITED FACILITY</span>
                      <p className="text-xs font-bold text-amber-300">Fluke 5730A, Keysight 3458A, Rubidium Standard</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-dark-950 font-bold text-[10px] font-mono">NABL CC-2891</span>
                  </div>

                  <div className="w-0.5 h-3 bg-amber-500/50 mx-auto" />

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">TIER 4 // CLIENT TEST & MEASUREMENT ASSET</span>
                      <p className="text-xs font-bold text-white">Your Industrial Multimeters, Hipots, Oscilloscopes & Analyzers</p>
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
                Book Electrotechnical Calibration
              </h2>
              <p className="text-neutral-400 text-sm">
                Get an instant estimate for your calibration scope or book an immediate laboratory slot with our certified metrologists.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
              
              {/* Left Configurator */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Select Instrument Type */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-300">Select Instrument Family:</label>
                  <select
                    value={calcInstrument}
                    onChange={(e) => setCalcInstrument(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="multimeter-bench">Benchtop / Handheld Multimeter (up to 6.5 digits)</option>
                    <option value="oscilloscope-high">High Bandwidth Digital Oscilloscope (up to 4 channels)</option>
                    <option value="power-analyzer">3-Phase Power Quality & Energy Analyzer</option>
                    <option value="hipot-hv">AC/DC High Voltage Hipot & Insulation Breakdown Tester</option>
                    <option value="calibrator-primary">Multi-Product Calibrator / 8.5-Digit Primary Reference DMM</option>
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
                    <span className="text-xs font-mono font-bold text-amber-400">{calcEstimate.days}</span>
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
                      ₹ {calcEstimate.cost.toLocaleString('en-IN')} <span className="text-xs font-mono text-neutral-500 font-normal">+ GST</span>
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
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold font-display uppercase text-white">
                Explore Other Metrology Laboratories
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                MSIR INDIA houses 12 accredited calibration laboratories under one roof in Chennai.
              </p>
            </div>

            <Link
              href="/#laboratory"
              className="px-6 py-3 rounded-xl bg-dark-800 border border-neutral-700 hover:border-amber-400 text-neutral-200 hover:text-amber-400 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shrink-0"
            >
              <span>RETURN TO ALL 12 LAB DOMAINS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
