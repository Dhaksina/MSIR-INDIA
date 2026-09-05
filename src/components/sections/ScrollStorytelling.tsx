'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  Thermometer,
  Gauge,
  Scale,
  Cog,
  Ruler,
  Weight,
  Wrench,
  Activity,
  Mic,
  Sun,
  Waves,
  Radio,
  Cpu,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface Domain {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  accentBg: string;
  stats: { label: string; value: string }[];
  description: string;
  standards: string[];
  href?: string;
}

export default function ScrollStorytelling() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const domains: Domain[] = [
    {
      id: 'electrotechnical',
      title: 'Electrotechnical',
      subtitle: 'Sub-Picoampere & High-Voltage Precision Calibration',
      href: '/facilities/electrotechnical',
      icon: Zap,
      color: 'text-amber-400',
      accentBg: 'from-amber-500/20 to-transparent',
      stats: [
        { label: 'Voltage Range', value: '10 nV to 100 kV' },
        { label: 'Uncertainty', value: '± 0.0002 %' },
        { label: 'Frequency', value: 'DC to 26.5 GHz' },
      ],
      description:
        'Advanced electrical calibration environment equipped with Keysight & Fluke primary reference standards. Calibration of Digital Multimeters, Oscilloscopes, Power Analyzers, High-Voltage Probes, and Frequency Synthesizers.',
      standards: ['Fluke 5730A High Precision Calibrator', 'Keysight 3458A 8.5-Digit DMM', 'NABL CC-2891 Traceable'],
    },
    {
      id: 'temperature',
      title: 'Temperature & Humidity',
      subtitle: 'Fixed-Point Triple-Point & Thermal Metrology',
      href: '/facilities/temperature',
      icon: Thermometer,
      color: 'text-rose-400',
      accentBg: 'from-rose-500/20 to-transparent',
      stats: [
        { label: 'Temperature Range', value: '-196 °C to 1,600 °C' },
        { label: 'Stability', value: '± 0.001 °C' },
        { label: 'Humidity Range', value: '10% to 98% RH' },
      ],
      description:
        'State-of-the-art thermal calibration chamber featuring SPRTs (Standard Platinum Resistance Thermometers), humidity generators, blackbody calibration sources, and dry-well furnaces for thermocouples and RTDs.',
      standards: ['Isotech Triple Point Water Cells', 'Fluke 1595A Super-Thermometer', 'Thunder Scientific Humidity Generator'],
    },
    {
      id: 'pressure',
      title: 'Pressure',
      subtitle: 'Dynamic Pneumatic & Hydraulic Deadweight Testing',
      href: '/facilities/pressure',
      icon: Gauge,
      color: 'text-cyan-400',
      accentBg: 'from-cyan-500/20 to-transparent',
      stats: [
        { label: 'Pressure Range', value: '-1 bar to 2,500 bar' },
        { label: 'Accuracy', value: '± 0.005 % F.S.' },
        { label: 'Fluid Media', value: 'Air, Nitrogen, Oil, Water' },
      ],
      description:
        'Precision pressure laboratory featuring automated deadweight testers, quartz reference transducers, and dynamic pressure calibrators for industrial pressure transmitters, master gauges, and safety valves.',
      standards: ['WIKA CPB5000 Hydraulic DWT', 'Druck Pace 6000 Controller', 'ISO/IEC 17025 Compliant'],
    },
    {
      id: 'mass',
      title: 'Mass & Volume',
      subtitle: 'E1/E2 Grade Analytical Mass & Volumetric Glassware',
      href: '/facilities/mass',
      icon: Scale,
      color: 'text-emerald-400',
      accentBg: 'from-emerald-500/20 to-transparent',
      stats: [
        { label: 'Mass Class', value: 'E1, E2, F1, F2' },
        { label: 'Weight Range', value: '1 mg to 500 kg' },
        { label: 'Volume Range', value: '1 µL to 100 L' },
      ],
      description:
        'Ultra-clean robotic mass comparator lab for primary standard weight sets, microbalances, glass pycnometers, micro-pipettes, and industrial volumetric proving tanks.',
      standards: ['Mettler Toledo Robotic Mass Comparator', 'Troemner E1 Ultra-Mass Standards', 'OIML R111 Traceable'],
    },
    {
      id: 'rf',
      title: 'RF Calibration',
      subtitle: 'High-Frequency Radio Frequency & Microwave Metrology',
      href: '/facilities/rf',
      icon: Radio,
      color: 'text-purple-400',
      accentBg: 'from-purple-500/20 to-transparent',
      stats: [
        { label: 'Frequency Range', value: '10 kHz to 40 GHz' },
        { label: 'RF Power Level', value: '-120 to +30 dBm' },
        { label: 'Attenuation', value: '± 0.05 dB' },
      ],
      description:
        'Ultra-low phase noise Radio Frequency (RF) and microwave calibration laboratory. Calibration of Spectrum Analyzers, Vector Network Analyzers (VNA), Signal Generators, RF Power Sensors, and Microwave Attenuators.',
      standards: ['Keysight N5247B PNA-X Microwave Network Analyzer', 'Rohde & Schwarz FSV3044 Spectrum Analyzer', 'Anritsu Primary Power Sensor Standard'],
    },
    {
      id: 'dimensions',
      title: 'Dimensions',
      subtitle: 'Sub-Micron Laser Interferometry & CMM Metrology',
      href: '/facilities/dimensions',
      icon: Ruler,
      color: 'text-amber-300',
      accentBg: 'from-amber-400/20 to-transparent',
      stats: [
        { label: 'Laser Resolution', value: '0.0001 mm (0.1 µm)' },
        { label: 'Measuring Length', value: '0 to 1,000 mm' },
        { label: 'Flatness Standard', value: 'λ / 20 Optical Flat' },
      ],
      description:
        'Class-1 cleanroom dimensional environment for gauge blocks, micrometers, dial indicators, profile projectors, coordinate measuring machine (CMM) calibration, and non-contact laser scanning.',
      standards: ['Mitutoyo Laser Scan Micrometer', 'Renishaw XL-80 Laser Interferometer', 'Grade 0 Gauge Blocks'],
    },
    {
      id: 'force',
      title: 'Force',
      subtitle: 'High-Capacity Tension & Compression Load Cell Proving',
      href: '/facilities/force',
      icon: Weight,
      color: 'text-blue-400',
      accentBg: 'from-blue-500/20 to-transparent',
      stats: [
        { label: 'Force Range', value: '10 N to 5,000 kN' },
        { label: 'Uncertainty', value: '± 0.01 %' },
        { label: 'Testing Modes', value: 'Tension & Compression' },
      ],
      description:
        'Heavy-duty hydraulic force calibration machine for load cells, crane scales, proving rings, dynamometers, and structural force transducers used in aerospace and defense testing.',
      standards: ['Primary Deadweight Force Machine', 'HBM Master Load Cells', 'ISO 376 Class 00 Verified'],
    },
    {
      id: 'torque',
      title: 'Torque',
      subtitle: 'Precision Static & Dynamic Torque Tool Calibration',
      href: '/facilities/torque',
      icon: Wrench,
      color: 'text-yellow-400',
      accentBg: 'from-yellow-500/20 to-transparent',
      stats: [
        { label: 'Torque Range', value: '0.1 Nm to 5,000 Nm' },
        { label: 'Accuracy', value: '± 0.2 %' },
        { label: 'Tool Compatibility', value: 'Manual, Electric, Pneumatic' },
      ],
      description:
        'Automated torque calibration rig for torque wrenches, screwdrivers, impulse tools, torque transducers, and assembly line power tool auditing.',
      standards: ['Sturtevant Richmont Master Torque Rig', 'Norbar ISO 6789 Calibrator', 'NABL Accredited'],
    },
    {
      id: 'acceleration',
      title: 'Acceleration & Speed',
      subtitle: 'Vibration, Tachometer & Motion Dynamic Metrology',
      href: '/facilities/acceleration',
      icon: Activity,
      color: 'text-teal-400',
      accentBg: 'from-teal-500/20 to-transparent',
      stats: [
        { label: 'Vibration Freq', value: '0.1 Hz to 10 kHz' },
        { label: 'Rotational Speed', value: '1 to 100,000 RPM' },
        { label: 'Acceleration', value: '0.01 to 100 g' },
      ],
      description:
        'Dynamic vibration and rotational velocity calibration suite for accelerometers, vibration transmitters, optical/contact tachometers, and high-speed stroboscopes.',
      standards: ['PCB Piezotronics Air-Bearing Shaker', 'Monarch Optical Laser Tachometer', 'ISO 16063-21'],
    },
    {
      id: 'sound',
      title: 'Sound',
      subtitle: 'Anechoic Acoustic & Sound Level Meter Calibration',
      href: '/facilities/sound',
      icon: Mic,
      color: 'text-indigo-400',
      accentBg: 'from-indigo-500/20 to-transparent',
      stats: [
        { label: 'Acoustic Freq', value: '20 Hz to 20 kHz' },
        { label: 'Sound Level', value: '30 dB to 160 dB' },
        { label: 'Meter Class', value: 'Class 0 & Class 1' },
      ],
      description:
        'Acoustic calibration facility equipped with pistonphones and multifrequency acoustic calibrators for sound level meters, noise dosimeters, and measurement microphones.',
      standards: ['Brüel & Kjær Type 4231 Sound Calibrator', 'B&K Pistonphone Type 4228', 'IEC 61672 Compliant'],
    },
    {
      id: 'lux',
      title: 'Lux',
      subtitle: 'Illuminance, Luminance & Photometric Calibration',
      href: '/facilities/lux',
      icon: Sun,
      color: 'text-amber-300',
      accentBg: 'from-amber-400/20 to-transparent',
      stats: [
        { label: 'Illuminance', value: '0.1 Lux to 150,000 Lux' },
        { label: 'Wavelength', value: '380 nm to 780 nm' },
        { label: 'Uncertainty', value: '± 1.2 %' },
      ],
      description:
        'Photometric and radiometric calibration darkroom for lux meters, luminance meters, UV radiometers, light meters, and spectroradiometric light sources.',
      standards: ['NIST Traceable Standard Lamp', 'Minolta Photometric Detector', 'CIE Standard Observer'],
    },
    {
      id: 'flow',
      title: 'Fluid Flow',
      subtitle: 'Hydraulic & Pneumatic Gas/Liquid Flow Meter Proving',
      href: '/facilities/flow',
      icon: Waves,
      color: 'text-sky-400',
      accentBg: 'from-sky-500/20 to-transparent',
      stats: [
        { label: 'Liquid Flow Rate', value: '0.01 to 250 m³/h' },
        { label: 'Gas Flow Rate', value: '0.001 to 100 Nm³/h' },
        { label: 'Prover Uncertainty', value: '± 0.15 %' },
      ],
      description:
        'High-flow hydraulic test bench and sonic nozzle gas flow prover for electromagnetic flowmeters, Coriolis mass flowmeters, turbine meters, and rotameters.',
      standards: ['Gravimetric Primary Proving Rig', 'Sonic Nozzle Master Bank', 'ISO 4185 & ISO 9300'],
    },
  ];

  const currentDomain = domains[activeTab];

  // Dynamic Animated Canvas effect per active domain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const drawDomainVisual = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;

      // Base Grid Lines
      ctx.strokeStyle = 'rgba(255, 193, 7, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (currentDomain.id === 'electrotechnical') {
        // Sine & Square Waves
        ctx.beginPath();
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.02 + time * 3) * 60 + Math.cos(x * 0.05) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#FFC107';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (currentDomain.id === 'pressure') {
        // Dial Gauge & Pressure Wave
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3;
        ctx.stroke();

        const needleAngle = -Math.PI / 4 + Math.sin(time * 2) * 0.6;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(needleAngle) * (radius - 20), centerY + Math.sin(needleAngle) * (radius - 20));
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 4;
        ctx.stroke();
      } else if (currentDomain.id === 'mass') {
        // Mass Balance Damped Ringing & Microgram Equilibrium
        ctx.beginPath();
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        for (let x = 0; x < width; x += 2) {
          const decay = Math.exp(-x / (width * 0.4));
          const y = height / 2 + Math.sin(x * 0.08 - time * 5) * 50 * decay + (Math.random() - 0.5) * 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (currentDomain.id === 'rf') {
        // High-Frequency Carrier & Modulation Wave
        ctx.beginPath();
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
          const carrier = Math.sin(x * 0.15 + time * 10);
          const mod = Math.sin(x * 0.015 + time * 2) * 45;
          const y = height / 2 + carrier * mod;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (currentDomain.id === 'dimensions') {
        // Laser Interferometer Interference Fringes
        for (let i = 0; i < 8; i++) {
          const fx = (i * width) / 7;
          ctx.beginPath();
          ctx.strokeStyle = i % 2 === 0 ? '#F59E0B' : '#3B82F6';
          ctx.lineWidth = 2;
          for (let y = 0; y < height; y += 4) {
            const shift = Math.sin(y * 0.04 + time * 4 + i) * 18;
            if (y === 0) ctx.moveTo(fx + shift, y);
            else ctx.lineTo(fx + shift, y);
          }
          ctx.stroke();
        }
      } else if (currentDomain.id === 'sound') {
        // Acoustic Wave & Frequency Spectrum Bars
        ctx.beginPath();
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + Math.sin(x * 0.05 + time * 6) * 40 + Math.sin(x * 0.12 + time * 8) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#6366F1';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (currentDomain.id === 'lux') {
        // Photometric Irradiance & Spectral Sun Rays
        const cx = width / 2;
        const cy = height / 2;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.arc(cx, cy, 40 + Math.sin(time * 3) * 10, 0, Math.PI * 2);
        ctx.fill();

        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          const r1 = 55;
          const r2 = 110 + Math.sin(a * 3 + time * 4) * 15;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a + time) * r1, cy + Math.sin(a + time) * r1);
          ctx.lineTo(cx + Math.cos(a + time) * r2, cy + Math.sin(a + time) * r2);
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (currentDomain.id === 'flow') {
        // Hydrodynamic Streamlines & Coriolis Waves
        for (let row = 1; row <= 4; row++) {
          const yBase = (height / 5) * row;
          ctx.beginPath();
          ctx.strokeStyle = row % 2 === 0 ? '#38BDF8' : '#F43F5E';
          ctx.lineWidth = 2;
          for (let x = 0; x < width; x += 4) {
            const y = yBase + Math.sin(x * 0.03 + time * 4 + row) * 20 + (Math.random() - 0.5) * 3;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (currentDomain.id === 'force') {
        // Force Load Cell Tension & Compression Hysteresis Wave
        ctx.beginPath();
        ctx.strokeStyle = '#EAB308';
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x += 2) {
          const pulse = Math.exp(-Math.pow(((x - (time * 120 % width)) / 40), 2)) * 60;
          const y = height / 2 - pulse + Math.sin(x * 0.02 + time * 2) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#EAB308';
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x += 3) {
          const y = height / 2 + Math.cos(x * 0.04 + time * 3) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (currentDomain.id === 'torque') {
        // Torsional Moment & Impulse Torque Release Spikes
        ctx.beginPath();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.5;
        for (let x = 0; x < width; x += 2) {
          const ramp = (x % 80) / 80;
          const spike = ramp > 0.9 ? (ramp - 0.9) * 400 : 0;
          const y = height / 2 - (ramp * 30 + spike) + Math.sin(time * 5) * 5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (currentDomain.id === 'acceleration') {
        // Vibration Shaker Sine Sweep & Tachometer Pulse Train
        ctx.beginPath();
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 2.5;
        const freq = 0.02 + Math.sin(time) * 0.015;
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * freq + time * 8) * 55;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Digital Tachometer pulses below
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const pulse = (Math.floor((x + time * 100) / 30) % 2) * 25;
          const y = height * 0.8 - pulse;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (currentDomain.id === 'temperature') {
        // SPRT Resistance Bridge Thermal Drift
        ctx.beginPath();
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 2.5;
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + Math.sin(x * 0.015 + time * 1.5) * 25 + (Math.random() - 0.5) * 1.5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = '#F43F5E';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Dynamic Laser & Wave Visual
        const laserY = (Math.sin(time * 2) * 0.5 + 0.5) * height;
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#FFC107';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, laserY);
        ctx.lineTo(width, laserY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.03 + time * 4) * 45;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(drawDomainVisual);
    };

    drawDomainVisual();

    return () => cancelAnimationFrame(animId);
  }, [currentDomain]);

  return (
    <section id="laboratory" className="relative py-28 bg-dark-950 border-t border-b border-neutral-800/80">
      {/* Volumetric Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-dark-900/50 to-dark-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            NABL ISO/IEC 17025 ACCREDITED LABORATORIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white uppercase">
            MASTER METROLOGY DOMAINS OF <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              UNCOMPROMISED ACCURACY
            </span>
          </h2>
          <p className="text-neutral-400 text-base font-normal">
            Step inside MSIR INDIA’s specialized calibration laboratories. Every environment is climate-controlled, vibration-isolated, and traceable to Primary National & International Standards (NPL, NIST, BIPM).
          </p>
        </div>

        {/* 12 Disciplines Circular Icon Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {domains.map((domain, index) => {
            const IconComponent = domain.icon;
            const isActive = activeTab === index;

            if (domain.href) {
              return (
                <Link
                  key={domain.id}
                  href={domain.href}
                  className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center gap-2.5 relative border group ${
                    isActive
                      ? 'bg-dark-800 border-amber-400 shadow-[0_0_30px_rgba(255,193,7,0.3)] scale-105 z-10'
                      : 'bg-dark-900/80 border-neutral-800/80 hover:border-amber-400/60 hover:bg-dark-800/50 hover:scale-102'
                  }`}
                  title={`Open ${domain.title} Calibration Facility Page`}
                >
                  {/* Dedicated Page Badge */}
                  <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-dark-950 font-mono text-[9px] font-extrabold uppercase tracking-wider shadow-[0_0_10px_#FFC107] flex items-center gap-0.5">
                    PAGE ↗
                  </span>

                  {/* Yellow Circle Badge Icon */}
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive
                        ? 'border-amber-400 bg-amber-500/20 text-amber-400 shadow-[0_0_15px_#FFC107]'
                        : 'border-amber-500/40 bg-dark-950 text-neutral-300 group-hover:border-amber-400 group-hover:text-amber-400'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-xs font-bold font-display uppercase tracking-wider line-clamp-1 ${
                      isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                    }`}
                  >
                    {domain.title}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={domain.id}
                onClick={() => setActiveTab(index)}
                className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center gap-2.5 relative border ${
                  isActive
                    ? 'bg-dark-800 border-amber-400 shadow-[0_0_30px_rgba(255,193,7,0.3)] scale-105 z-10'
                    : 'bg-dark-900/80 border-neutral-800/80 hover:border-neutral-700 hover:bg-dark-800/50 hover:scale-102'
                }`}
              >
                {/* Yellow Circle Badge Icon */}
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive
                      ? 'border-amber-400 bg-amber-500/20 text-amber-400 shadow-[0_0_15px_#FFC107]'
                      : 'border-amber-500/40 bg-dark-950 text-neutral-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <span
                  className={`text-xs font-bold font-display uppercase tracking-wider line-clamp-1 ${
                    isActive ? 'text-white' : 'text-neutral-300'
                  }`}
                >
                  {domain.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Domain Display Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl bg-dark-900/90 border border-neutral-800 p-6 lg:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Left Column: Specs & Storytelling */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-block px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono mb-3">
                {currentDomain.subtitle}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3 uppercase">
                {currentDomain.title} Calibration Facility
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                {currentDomain.description}
              </p>

              {/* Live Specs Badges */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {currentDomain.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-dark-950 border border-neutral-800">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">{stat.label}</p>
                    <p className="text-xs sm:text-sm font-mono font-bold text-amber-400 mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Master Standards */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Primary Reference Equipment:</p>
                <div className="space-y-1.5">
                  {currentDomain.standards.map((std, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>{std}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {currentDomain.href && (
                  <Link
                    href={currentDomain.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-dark-950 text-xs font-bold font-display uppercase tracking-wider shadow-[0_0_20px_rgba(255,193,7,0.4)] hover:shadow-[0_0_30px_rgba(255,193,7,0.7)] transition-all group"
                  >
                    <span>EXPLORE FULL {currentDomain.title.toUpperCase()} FACILITY PAGE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-amber-400 text-xs font-bold font-display uppercase tracking-wider transition-all"
                >
                  <span>BOOK {currentDomain.title.toUpperCase()} CALIBRATION</span>
                </a>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">ISO 17025 AUDITED</span>
            </div>
          </div>

          {/* Right Column: Animated Simulator Canvas */}
          <div className="lg:col-span-6 min-h-[360px] relative rounded-2xl bg-dark-950 border border-neutral-800 overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded bg-dark-900/80 border border-amber-500/30 text-[10px] font-mono text-amber-400 flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE WAVEFORM SIMULATOR // {currentDomain.id.toUpperCase()}</span>
            </div>
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-neutral-500 bg-dark-900/80 px-2.5 py-1 rounded border border-neutral-800">
              120 FPS HIGH PRECISION METROLOGY
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
