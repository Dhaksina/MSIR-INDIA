'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Activity,
  Scale,
  Radio,
  Ruler,
  Mic,
  Sun,
  Waves,
  Weight,
  Wrench,
  Zap,
  Gauge,
  Thermometer,
  RefreshCcw,
  Sliders,
  Play,
  Pause,
  ShieldCheck,
  Cpu,
  BarChart2
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export type SimulatorDomainId =
  | 'mass'
  | 'rf'
  | 'dimensions'
  | 'sound'
  | 'lux'
  | 'flow'
  | 'force'
  | 'torque'
  | 'acceleration'
  | 'electrotechnical'
  | 'temperature'
  | 'pressure';

interface DomainConfig {
  id: SimulatorDomainId;
  title: string;
  category: string;
  icon: React.ElementType;
  primarySignalName: string;
  primaryUnit: string;
  secondarySignalName: string;
  secondaryUnit: string;
  basePrimaryVal: number;
  baseSecondaryVal: number;
  primaryColor: string;
  secondaryColor: string;
  stats: { label: string; value: string; icon: React.ElementType }[];
  description: string;
}

const DOMAIN_CONFIGS: Record<SimulatorDomainId, DomainConfig> = {
  force: {
    id: 'force',
    title: 'FORCE',
    category: 'HIGH-CAPACITY TENSION & COMPRESSION METROLOGY',
    icon: Weight,
    primarySignalName: 'Load Cell Compression Strain Signal',
    primaryUnit: 'kN',
    secondarySignalName: 'Strain Gauge Bridge Hysteresis Drift',
    secondaryUnit: 'mV/V',
    basePrimaryVal: 250.04,
    baseSecondaryVal: 2.0004,
    primaryColor: '#EAB308', // Amber-Yellow
    secondaryColor: '#EF4444', // Red
    stats: [
      { label: 'FORCE RANGE', value: '10 N to 5,000 kN', icon: Weight },
      { label: 'HYSTERESIS ACCURACY', value: '± 0.01 % F.S.', icon: ShieldCheck },
      { label: 'MODES', value: 'Tension & Compression', icon: Cpu },
    ],
    description: 'Simulates heavy hydraulic force machine strain gauge bridge output, proving ring elastic deformation, and dynamic load cell compression curves.',
  },
  torque: {
    id: 'torque',
    title: 'TORQUE',
    category: 'PRECISION TORSIONAL MOMENT & TOOL CALIBRATION',
    icon: Wrench,
    primarySignalName: 'Dynamic Torsional Moment Impulse Wave',
    primaryUnit: 'N·m',
    secondarySignalName: 'Torque Transducer Angular Deflection',
    secondaryUnit: 'deg',
    basePrimaryVal: 150.25,
    baseSecondaryVal: 1.45,
    primaryColor: '#F59E0B', // Amber
    secondaryColor: '#10B981', // Emerald
    stats: [
      { label: 'TORQUE RANGE', value: '0.1 N·m to 5,000 N·m', icon: Wrench },
      { label: 'CLICK ACCURACY', value: '± 0.2 % of reading', icon: ShieldCheck },
      { label: 'TOOL COMPATIBILITY', value: 'Manual, Electric, Pneumatic', icon: Cpu },
    ],
    description: 'Real-time impulse torque tool click release curve, motorized screwdriver torque buildup, and static/dynamic torque transducer auditing.',
  },
  acceleration: {
    id: 'acceleration',
    title: 'ACCELERATION & SPEED',
    category: 'VIBRATION & ROTATIONAL MOTION METROLOGY',
    icon: Activity,
    primarySignalName: 'Air-Bearing Shaker Sinusoidal Acceleration',
    primaryUnit: 'g',
    secondarySignalName: 'Optical Laser Tachometer Pulse Velocity',
    secondaryUnit: 'RPM',
    basePrimaryVal: 9.81,
    baseSecondaryVal: 3600.0,
    primaryColor: '#06B6D4', // Cyan
    secondaryColor: '#A855F7', // Purple
    stats: [
      { label: 'VIBRATION FREQUENCY', value: '0.1 Hz to 10 kHz', icon: Activity },
      { label: 'ROTATIONAL SPEED', value: '1 to 100,000 RPM', icon: BarChart2 },
      { label: 'ACCELERATION RANGE', value: '0.01 g to 100 g pk', icon: ShieldCheck },
    ],
    description: 'Simulates piezoelectric accelerometer back-to-back sensitivity calibration, electrodynamic shaker sine sweeps, and laser tachometer rotational speed.',
  },
  mass: {
    id: 'mass',
    title: 'MASS & VOLUME',
    category: 'E1 ANALYTICAL MASS & VOLUMETRIC GLASSWARE',
    icon: Scale,
    primarySignalName: 'Mass Balance Equilibrium Curve',
    primaryUnit: 'g',
    secondarySignalName: 'Volumetric Dispenser Meniscus Pressure',
    secondaryUnit: 'mL',
    basePrimaryVal: 5.0000002,
    baseSecondaryVal: 10.0004,
    primaryColor: '#FFC107',
    secondaryColor: '#10B981',
    stats: [
      { label: 'MASS RESOLUTION', value: '0.1 µg (0.0000001 g)', icon: Scale },
      { label: 'BALANCE NOISE FLOOR', value: '0.00008 mg', icon: Activity },
      { label: 'VOLUME UNCERTAINTY', value: '± 0.0005 mL', icon: ShieldCheck },
    ],
    description: 'Simulates ultra-microbalance settling oscillations, air buoyancy compensation, and volumetric glassware meniscus displacement in an ISO Class 5 cleanroom.',
  },
  rf: {
    id: 'rf',
    title: 'RF CALIBRATION',
    category: 'MICROWAVE & HIGH FREQUENCY TELECOM',
    icon: Radio,
    primarySignalName: 'RF Carrier Waveform (10.0 GHz)',
    primaryUnit: 'V',
    secondarySignalName: 'Attenuated Microwave Power Envelope',
    secondaryUnit: 'dBm',
    basePrimaryVal: 1.414,
    baseSecondaryVal: -30.02,
    primaryColor: '#00F0FF',
    secondaryColor: '#A855F7',
    stats: [
      { label: 'FREQUENCY RANGE', value: '9 kHz to 40.0 GHz', icon: Radio },
      { label: 'PHASE NOISE', value: '-128 dBc/Hz @ 10kHz', icon: Zap },
      { label: 'S-PARAMETER S21', value: '0.002 dB', icon: Cpu },
    ],
    description: 'High-speed radio frequency carrier simulation featuring 40 GHz synthesizer stability, phase noise jitter, and microwave power sensor calibration.',
  },
  dimensions: {
    id: 'dimensions',
    title: 'DIMENSIONS',
    category: 'SUB-MICRON LASER INTERFEROMETRY',
    icon: Ruler,
    primarySignalName: 'Optical Laser Interferometer Fringe Wave',
    primaryUnit: 'nm',
    secondarySignalName: 'Laser Scan Micrometer Beam Width',
    secondaryUnit: 'µm',
    basePrimaryVal: 632.8,
    baseSecondaryVal: 25.0004,
    primaryColor: '#F59E0B',
    secondaryColor: '#3B82F6',
    stats: [
      { label: 'LASER RESOLUTION', value: '0.1 nm (0.0001 µm)', icon: Ruler },
      { label: 'OPTICAL FLATNESS', value: 'λ / 20 (31 nm)', icon: ShieldCheck },
      { label: 'STABILITY', value: '± 0.05 ppm', icon: Activity },
    ],
    description: 'Real-time laser interferometer fringe phase shift and sub-micron micrometer diameter scanning using HeNe 632.8 nm optical standards.',
  },
  sound: {
    id: 'sound',
    title: 'SOUND',
    category: 'ACOUSTIC & SOUND LEVEL METROLOGY',
    icon: Mic,
    primarySignalName: '1 kHz Acoustic Reference Pressure',
    primaryUnit: 'Pa',
    secondarySignalName: 'Sound Pressure Level (SPL) Spectrum',
    secondaryUnit: 'dBSPL',
    basePrimaryVal: 1.0002,
    baseSecondaryVal: 94.01,
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    stats: [
      { label: 'ACOUSTIC FREQUENCY', value: '20 Hz to 20 kHz', icon: Mic },
      { label: 'REFERENCE LEVEL', value: '94.0 dBSPL (1 Pa)', icon: BarChart2 },
      { label: 'TOTAL HARMONIC THD', value: '0.0012 %', icon: Activity },
    ],
    description: 'Simulates anechoic chamber condenser microphone calibration, 1 kHz acoustic reference tone generation, and IEC 61672 Class 1 octave spectrum analysis.',
  },
  lux: {
    id: 'lux',
    title: 'LUX',
    category: 'ILLUMINANCE & PHOTOMETRIC METROLOGY',
    icon: Sun,
    primarySignalName: 'Photometric Illuminance Irradiance Wave',
    primaryUnit: 'Lux',
    secondarySignalName: 'Spectral Photodiode Power Density',
    secondaryUnit: 'mW/cm²',
    basePrimaryVal: 10000.5,
    baseSecondaryVal: 15.42,
    primaryColor: '#FBBF24',
    secondaryColor: '#10B981',
    stats: [
      { label: 'ILLUMINANCE RANGE', value: '0.1 Lux to 150,000 Lux', icon: Sun },
      { label: 'SPECTRAL PEAK', value: '555 nm (CIE Vλ)', icon: Cpu },
      { label: 'PHOTODIODE LINEARITY', value: '± 0.15 %', icon: ShieldCheck },
    ],
    description: 'Photometric darkroom illuminance simulation tracking standard lamp spectral distribution, photodiode response, and CIE standard observer curves.',
  },
  flow: {
    id: 'flow',
    title: 'FLUID FLOW',
    category: 'HYDRODYNAMIC & CORIOLIS MASS FLOW',
    icon: Waves,
    primarySignalName: 'Coriolis Mass Flow Rate Waveform',
    primaryUnit: 'kg/h',
    secondarySignalName: 'Hydrodynamic Fluid Velocity Pulsation',
    secondaryUnit: 'm/s',
    basePrimaryVal: 12450.8,
    baseSecondaryVal: 4.52,
    primaryColor: '#38BDF8',
    secondaryColor: '#F43F5E',
    stats: [
      { label: 'MASS FLOW ACCURACY', value: '± 0.05 % of reading', icon: Waves },
      { label: 'FLUID MEDIA', value: 'Deionized Water / Oil', icon: Gauge },
      { label: 'REYNOLDS NUMBER', value: 'Re = 45,200 (Turbulent)', icon: Activity },
    ],
    description: 'Simulates gravimetric flow rig fluid dynamics, Coriolis tube oscillation phase shift, and hydrodynamic velocity turbulence in real time.',
  },
  electrotechnical: {
    id: 'electrotechnical',
    title: 'ELECTROTECHNICAL',
    category: 'SUB-PICOAMPERE & HIGH VOLTAGE PRECISION',
    icon: Zap,
    primarySignalName: 'DC/AC Voltage Calibration Reference Waveform',
    primaryUnit: 'V',
    secondarySignalName: 'Voltage Harmonic Distortion THD',
    secondaryUnit: '%',
    basePrimaryVal: 230.15,
    baseSecondaryVal: 0.0014,
    primaryColor: '#F59E0B',
    secondaryColor: '#10B981',
    stats: [
      { label: 'VOLTAGE ACCURACY', value: '± 0.00015 % (1.5 ppm)', icon: Zap },
      { label: 'RESOLUTION', value: '8.5 Digits (Fluke 5730A)', icon: Cpu },
      { label: 'FREQUENCY RANGE', value: 'DC to 26.5 GHz', icon: ShieldCheck },
    ],
    description: 'Precision AC/DC primary voltage standard simulation featuring 8.5-digit multimeter sampling, thermal voltage converter comparison, and sub-ppm calibration stability.',
  },
  temperature: {
    id: 'temperature',
    title: 'TEMPERATURE & HUMIDITY',
    category: 'ITS-90 FIXED POINT & THERMAL METROLOGY',
    icon: Thermometer,
    primarySignalName: 'SPRT Bridge Resistance Drift Wave',
    primaryUnit: 'Ω',
    secondarySignalName: 'Triple-Point Water Cell Stability',
    secondaryUnit: '°C',
    basePrimaryVal: 25.4312,
    baseSecondaryVal: 0.0100,
    primaryColor: '#F43F5E',
    secondaryColor: '#38BDF8',
    stats: [
      { label: 'TEMPERATURE ACCURACY', value: '± 0.001 °C (ITS-90)', icon: Thermometer },
      { label: 'CELL STABILITY', value: '± 0.0002 °C / hr', icon: ShieldCheck },
      { label: 'RANGE', value: '-196 °C to +1,600 °C', icon: Cpu },
    ],
    description: 'Fixed-point thermal calibration simulation tracking Standard Platinum Resistance Thermometer (SPRT) resistance bridge substitution ratio and water triple-point stability.',
  },
  pressure: {
    id: 'pressure',
    title: 'PRESSURE & VACUUM',
    category: 'HYDRAULIC DEADWEIGHT & PNEUMATIC TRANSDUCERS',
    icon: Gauge,
    primarySignalName: 'Hydraulic Piston-Cylinder Pressure Line',
    primaryUnit: 'bar',
    secondarySignalName: 'Quartz Transducer Strain Frequency',
    secondaryUnit: 'kHz',
    basePrimaryVal: 100.42,
    baseSecondaryVal: 42.15,
    primaryColor: '#00F0FF',
    secondaryColor: '#F59E0B',
    stats: [
      { label: 'PRESSURE ACCURACY', value: '± 0.005 % of reading', icon: Gauge },
      { label: 'PRESSURE RANGE', value: '-1 bar to 2,500 bar', icon: ShieldCheck },
      { label: 'MEDIA', value: 'Air, Nitrogen, Oil', icon: Cpu },
    ],
    description: 'Simulates deadweight tester piston flotation equilibrium, tungsten carbide cylinder thermal compensation, and electronic pressure controller response.',
  },
};

export default function TelemetryDashboard() {
  const [activeDomain, setActiveDomain] = useState<SimulatorDomainId>('force');
  const [waveformType, setWaveformType] = useState<'sine' | 'square' | 'triangle' | 'pulsed'>('sine');
  const [frequencyScale, setFrequencyScale] = useState<number>(1);
  const [amplitude, setAmplitude] = useState<number>(100);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const config = DOMAIN_CONFIGS[activeDomain];

  // Generate initial Chart.js datasets
  const [chartData, setChartData] = useState(() => {
    const labels = Array.from({ length: 25 }, (_, i) => `${(i * 0.5).toFixed(1)}s`);
    return {
      labels,
      datasets: [
        {
          label: `${config.primarySignalName} (${config.primaryUnit})`,
          data: Array.from({ length: 25 }, () => config.basePrimaryVal),
          borderColor: config.primaryColor,
          backgroundColor: `${config.primaryColor}1F`,
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 2,
          pointBackgroundColor: config.primaryColor,
        },
        {
          label: `${config.secondarySignalName} (${config.secondaryUnit})`,
          data: Array.from({ length: 25 }, () => config.baseSecondaryVal),
          borderColor: config.secondaryColor,
          backgroundColor: `${config.secondaryColor}10`,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 2,
          pointBackgroundColor: config.secondaryColor,
        },
      ],
    };
  });

  // Re-initialize chart when domain changes
  useEffect(() => {
    const labels = Array.from({ length: 25 }, (_, i) => `${(i * 0.5).toFixed(1)}s`);
    setChartData({
      labels,
      datasets: [
        {
          label: `${config.primarySignalName} (${config.primaryUnit})`,
          data: Array.from({ length: 25 }, (_, i) => {
            const phase = i * 0.4 * frequencyScale;
            let val = 0;
            if (waveformType === 'sine') val = Math.sin(phase);
            else if (waveformType === 'square') val = Math.sin(phase) >= 0 ? 1 : -1;
            else if (waveformType === 'triangle') val = (2 / Math.PI) * Math.asin(Math.sin(phase));
            else val = Math.exp(-Math.abs((i % 6) - 3)) * Math.sin(phase * 2);

            const noise = noiseEnabled ? (Math.random() - 0.5) * 0.08 : 0;
            const ampFactor = (amplitude / 100) * (config.basePrimaryVal * 0.05);
            return Number((config.basePrimaryVal + val * ampFactor + noise).toFixed(4));
          }),
          borderColor: config.primaryColor,
          backgroundColor: `${config.primaryColor}20`,
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 2,
          pointBackgroundColor: config.primaryColor,
        },
        {
          label: `${config.secondarySignalName} (${config.secondaryUnit})`,
          data: Array.from({ length: 25 }, (_, i) => {
            const phase = i * 0.4 * frequencyScale + 1.2;
            let val = Math.cos(phase);
            if (waveformType === 'square') val = Math.cos(phase) >= 0 ? 0.8 : -0.8;
            const noise = noiseEnabled ? (Math.random() - 0.5) * 0.05 : 0;
            const ampFactor = (amplitude / 100) * (config.baseSecondaryVal * 0.04);
            return Number((config.baseSecondaryVal + val * ampFactor + noise).toFixed(4));
          }),
          borderColor: config.secondaryColor,
          backgroundColor: `${config.secondaryColor}10`,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 2,
          pointBackgroundColor: config.secondaryColor,
        },
      ],
    });
  }, [activeDomain, waveformType, frequencyScale, amplitude, noiseEnabled, config]);

  // Real-time live update loop
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setChartData((prev) => {
        if (!prev.datasets || prev.datasets.length < 2) return prev;

        const timeNow = Date.now() / 300;
        const newPrimary = prev.datasets[0].data.map((_, i) => {
          const phase = (i + timeNow) * 0.35 * frequencyScale;
          let wave = Math.sin(phase);
          if (waveformType === 'square') wave = Math.sin(phase) >= 0 ? 1 : -1;
          else if (waveformType === 'triangle') wave = (2 / Math.PI) * Math.asin(Math.sin(phase));
          else if (waveformType === 'pulsed') wave = Math.sin(phase) * Math.cos(phase * 3);

          const ampFactor = (amplitude / 100) * (config.basePrimaryVal * 0.04);
          const noise = noiseEnabled ? (Math.random() - 0.5) * (config.basePrimaryVal * 0.008) : 0;
          return Number((config.basePrimaryVal + wave * ampFactor + noise).toFixed(4));
        });

        const newSecondary = prev.datasets[1].data.map((_, i) => {
          const phase = (i + timeNow) * 0.35 * frequencyScale + 1.5;
          let wave = Math.cos(phase);
          if (waveformType === 'square') wave = Math.cos(phase) >= 0 ? 1 : -1;
          else if (waveformType === 'pulsed') wave = Math.cos(phase) * Math.sin(phase * 2);

          const ampFactor = (amplitude / 100) * (config.baseSecondaryVal * 0.03);
          const noise = noiseEnabled ? (Math.random() - 0.5) * (config.baseSecondaryVal * 0.006) : 0;
          return Number((config.baseSecondaryVal + wave * ampFactor + noise).toFixed(4));
        });

        return {
          ...prev,
          datasets: [
            { ...prev.datasets[0], data: newPrimary },
            { ...prev.datasets[1], data: newSecondary },
          ],
        };
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isStreaming, activeDomain, waveformType, frequencyScale, amplitude, noiseEnabled, config]);

  // HTML5 Phosphor Oscilloscope Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const drawOscilloscope = () => {
      ctx.fillStyle = '#060A0F';
      ctx.fillRect(0, 0, width, height);

      if (isStreaming) {
        time += 0.04 * frequencyScale;
      }

      // Phosphor CRT Grid Graticule
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      const stepX = width / 10;
      const stepY = height / 6;

      for (let x = 0; x <= width; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = 'rgba(255, 193, 7, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw Primary Glowing Signal Trace
      ctx.shadowColor = config.primaryColor;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = config.primaryColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const ampPixel = (height / 3.5) * (amplitude / 100);

      for (let x = 0; x < width; x += 2) {
        const phase = (x / width) * Math.PI * 4 * frequencyScale + time;
        let yWave = 0;

        if (waveformType === 'sine') {
          yWave = Math.sin(phase);
        } else if (waveformType === 'square') {
          yWave = Math.sin(phase) >= 0 ? 0.85 : -0.85;
        } else if (waveformType === 'triangle') {
          yWave = (2 / Math.PI) * Math.asin(Math.sin(phase));
        } else {
          yWave = Math.sin(phase) * Math.cos(phase * 2.5);
        }

        const jitter = noiseEnabled ? (Math.random() - 0.5) * 4 : 0;
        const y = height / 2 - yWave * ampPixel + jitter;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Secondary Signal Trace
      ctx.shadowColor = config.secondaryColor;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = config.secondaryColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let x = 0; x < width; x += 2) {
        const phase = (x / width) * Math.PI * 4 * frequencyScale + time + 1.2;
        let yWave = Math.cos(phase);
        if (waveformType === 'square') yWave = Math.cos(phase) >= 0 ? 0.6 : -0.6;
        else if (waveformType === 'pulsed') yWave = Math.cos(phase) * Math.sin(phase * 2);

        const jitter = noiseEnabled ? (Math.random() - 0.5) * 3 : 0;
        const y = height / 2 - yWave * (ampPixel * 0.6) + jitter;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(drawOscilloscope);
    };

    drawOscilloscope();
    return () => cancelAnimationFrame(animId);
  }, [isStreaming, activeDomain, waveformType, frequencyScale, amplitude, noiseEnabled, config]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#E5E7EB',
          font: { family: 'JetBrains Mono', size: 11, weight: 'bold' as const },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        borderColor: config.primaryColor,
        borderWidth: 1,
        titleColor: '#F59E0B',
        bodyColor: '#FFFFFF',
      },
    },
    scales: {
      x: {
        ticks: { color: '#6B7280', font: { family: 'JetBrains Mono', size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      y: {
        ticks: { color: '#9CA3AF', font: { family: 'JetBrains Mono', size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
      },
    },
  };

  const domainListKeys: SimulatorDomainId[] = [
    'force',
    'torque',
    'acceleration',
    'mass',
    'rf',
    'dimensions',
    'sound',
    'lux',
    'flow',
    'electrotechnical',
    'temperature',
    'pressure',
  ];

  return (
    <section id="telemetry" className="relative py-24 bg-dark-950 border-t border-b border-neutral-800">
      
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-dark-950 to-dark-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(255,193,7,0.2)]">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              LIVE INDUSTRIAL WAVEFORM SIMULATOR
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight uppercase">
              REAL-TIME <span className="text-amber-400 text-amber-glow">METROLOGY SIMULATOR</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
              Select any of the 6 primary calibration discipline domains below to simulate live signal waveforms, harmonic distortion, frequency sweeps, and NABL primary standard telemetry.
            </p>
          </div>

          {/* Live Status Pill */}
          <div className="flex items-center gap-3 bg-dark-900 border border-neutral-800 px-5 py-2.5 rounded-2xl shadow-xl shrink-0">
            <RefreshCcw className={`w-4 h-4 ${isStreaming ? 'text-emerald-400 animate-spin' : 'text-neutral-500'}`} />
            <div className="text-xs font-mono">
              <div className="text-white font-bold">120 HZ HARDWARE SYNC</div>
              <div className="text-neutral-400 text-[10px]">ISO/IEC 17025 ACCREDITED FEED</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6 DOMAIN SELECTION BUTTONS - STYLED EXACTLY LIKE USER SCREENSHOT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {domainListKeys.map((key) => {
            const dom = DOMAIN_CONFIGS[key];
            const IconComp = dom.icon;
            const isActive = activeDomain === key;

            return (
              <button
                key={dom.id}
                onClick={() => setActiveDomain(key)}
                className={`group relative p-6 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 border cursor-pointer ${
                  isActive
                    ? 'bg-dark-900 border-amber-400 ring-2 ring-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.35)] scale-105 z-10'
                    : 'bg-dark-900/90 border-neutral-800 hover:border-amber-500/50 hover:bg-dark-800/80 hover:scale-[1.02]'
                }`}
              >
                {/* Yellow Circle Icon Badge - Matches Screenshot */}
                <div
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'border-amber-400 bg-amber-500/20 text-amber-400 shadow-[0_0_20px_#FFC107]'
                      : 'border-amber-500/60 bg-dark-950 text-amber-400/90 group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  <IconComp className="w-7 h-7" />
                </div>

                {/* Domain Title Label - Clean uppercase font */}
                <span
                  className={`text-xs sm:text-sm font-extrabold font-display uppercase tracking-wider ${
                    isActive ? 'text-amber-400' : 'text-neutral-200 group-hover:text-white'
                  }`}
                >
                  {dom.title}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#FFC107] absolute top-3 right-3 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* WAVEFORM SIMULATOR INTERACTIVE CONTROLS BAR */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          
          {/* Waveform Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" /> WAVEFORM SHAPE:
            </span>
            <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-neutral-800">
              {(['sine', 'square', 'triangle', 'pulsed'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setWaveformType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    waveformType === type
                      ? 'bg-amber-500 text-dark-950 shadow-[0_0_12px_#FFC107]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Scaling */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">SWEEP FREQ:</span>
            <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-neutral-800">
              {[0.5, 1, 2, 5].map((scale) => (
                <button
                  key={scale}
                  onClick={() => setFrequencyScale(scale)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    frequencyScale === scale
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {scale}x
                </button>
              ))}
            </div>
          </div>

          {/* Noise & Stream Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNoiseEnabled(!noiseEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                noiseEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-dark-950 text-neutral-500 border-neutral-800'
              }`}
            >
              SIGNAL NOISE: {noiseEnabled ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                isStreaming
                  ? 'bg-amber-500 text-dark-950 hover:bg-amber-400 shadow-[0_0_15px_rgba(255,193,7,0.4)]'
                  : 'bg-emerald-500 text-dark-950 hover:bg-emerald-400'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" /> PAUSE STREAM
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> RESUME STREAM
                </>
              )}
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MAIN CHART + HIGH-PRECISION OSCILLOSCOPE & STATS DISPLAY */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Chart Card (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-dark-900 border border-neutral-800 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                  {config.category}
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  {config.title} Live Oscilloscope Feed
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
                  {waveformType.toUpperCase()} MODE
                </span>
                <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                  TRACEABLE
                </span>
              </div>
            </div>

            {/* Chart Container */}
            <div className="w-full h-[320px] sm:h-[380px]">
              <Line data={chartData} options={chartOptions} />
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pt-2 border-t border-neutral-800/80">
              {config.description}
            </p>

          </div>

          {/* Side Oscilloscope Visualizer & Technical Metrics (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            
            {/* HTML5 Phosphor Oscilloscope Screen */}
            <div className="p-4 rounded-2xl bg-dark-900 border border-neutral-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> CRT PHOSPHOR TRACE
                </span>
                <span className="text-neutral-500 text-[10px]">120 FPS</span>
              </div>

              <div className="w-full h-[200px] rounded-xl overflow-hidden border border-emerald-500/30 relative">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400/80 bg-black/60 px-1.5 py-0.5 rounded">
                  CH1: {config.primarySignalName.slice(0, 18)}
                </div>
              </div>
            </div>

            {/* 3 Domain Live Technical Metric Widgets */}
            <div className="space-y-3">
              {config.stats.map((st, idx) => {
                const StatIcon = st.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-dark-900 border border-neutral-800 hover:border-amber-500/40 transition-colors">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                      <span>{st.label}</span>
                      <StatIcon className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-lg font-mono font-bold text-amber-400">
                      {st.value}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
