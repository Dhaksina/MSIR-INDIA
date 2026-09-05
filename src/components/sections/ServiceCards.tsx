'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Gauge, Thermometer, Maximize, Cpu, Radio, ShieldCheck, X, Check, ArrowRight } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  shortDesc: string;
  fullDesc: string;
  accentColor: string;
  borderGlow: string;
  features: string[];
  instruments: string[];
  turnaround: string;
  accreditation: string;
}

export default function ServiceCards() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      id: 'electro-technical',
      title: 'Electro-Technical Calibration',
      category: 'PRIMARY ELECTRICAL',
      icon: Zap,
      shortDesc: 'Calibration of high-precision multimeters, calibrators, oscilloscopes, and power meters.',
      fullDesc: 'MSIR INDIA provides comprehensive electro-technical calibration services for research laboratories, defense contractors, and electronics manufacturers. We measure voltage, current, resistance, capacitance, inductance, frequency, and RF power with NABL traceable uncertainties down to ppm levels.',
      accentColor: 'text-amber-400',
      borderGlow: 'hover:border-amber-400 hover:shadow-[0_0_35px_rgba(255,193,7,0.35)]',
      features: ['8.5 Digit Multimeter Master Calibration', 'DC/AC Voltage & Current to 100 kV / 1000 A', 'RF & Microwave Frequency up to 26.5 GHz', 'Oscilloscope Bandwidth Verification'],
      instruments: ['Fluke 5730A', 'Keysight 3458A', 'Tektronix MSO Series', 'Megger Insulation Testers'],
      turnaround: '24 - 48 Hours',
      accreditation: 'NABL CC-2891 / ISO 17025',
    },
    {
      id: 'pressure-vacuum',
      title: 'Pressure & Vacuum Calibration',
      category: 'HYDRAULICS & PNEUMATICS',
      icon: Gauge,
      shortDesc: 'Deadweight tester calibration for master pressure gauges, transducers, and transmitters.',
      fullDesc: 'Our pressure calibration laboratory utilizes high-precision Dead Weight Testers (DWT) and electronic pressure controllers capable of generating pneumatics and hydraulics from -1 bar vacuum up to 2,500 bar high pressure with NIST traceability.',
      accentColor: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,240,255,0.35)]',
      features: ['Pneumatic & Hydraulic Dead Weight Testing', 'Digital Manometer & Transmitter Calibration', 'Differential & Absolute Pressure Verification', 'Safety Relief Valve Pop-Pressure Testing'],
      instruments: ['WIKA Deadweight Testers', 'Druck PACE6000', 'Fluke 700 Series', 'Ashcroft Master Gauges'],
      turnaround: '24 Hours',
      accreditation: 'NABL CC-2891 / ISO 17025',
    },
    {
      id: 'thermal-temperature',
      title: 'Thermal & Temperature Calibration',
      category: 'THERMAL METROLOGY',
      icon: Thermometer,
      shortDesc: 'Fixed-point cell thermal calibration, RTD, thermocouple, and IR camera testing.',
      fullDesc: 'Equipped with ITS-90 Fixed Point Cells (Triple Point of Water, Gallium, Tin, Zinc), liquid calibration baths, and dry block calibrators spanning -196 °C to 1,600 °C for ultra-stable temperature measurement.',
      accentColor: 'text-rose-400',
      borderGlow: 'hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.35)]',
      features: ['SPRT & PRT Primary Cell Calibration', 'Infrared Pyrometer & Thermal Imager Calibration', 'Cold Storage & Oven Validation Mapping', 'Thermocouple Type R, S, B, K, J Calibration'],
      instruments: ['Isotech Water Cells', 'Fluke 1595A Super-Thermometer', 'FLIR IR Reference Sources'],
      turnaround: '48 Hours',
      accreditation: 'NABL CC-2891 / ISO 17025',
    },
    {
      id: 'mechanical-dimensional',
      title: 'Dimensional & Optical Calibration',
      category: 'SUB-MICRON METROLOGY',
      icon: Maximize,
      shortDesc: 'Laser interferometer calibration for gauge blocks, micrometers, CMMs, and optical flats.',
      fullDesc: 'Class 10,000 cleanroom dimensional laboratory offering sub-micron precision calibration for linear measuring tools, gauge block sets, surface plates, profile projectors, and coordinate measuring machines.',
      accentColor: 'text-emerald-400',
      borderGlow: 'hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)]',
      features: ['Laser Interferometer Linear Positioning', 'Grade 0 & 00 Gauge Block Calibration', 'Granite Surface Plate Flatness Mapping', 'Optical Profile Projector Angle Verification'],
      instruments: ['Mitutoyo Laser Micrometers', 'Renishaw XL-80 Laser', 'Taylor Hobson Profilometer'],
      turnaround: '24 - 48 Hours',
      accreditation: 'NABL CC-2891 / ISO 17025',
    },
    {
      id: 'torque-force',
      title: 'Torque & Mass Calibration',
      category: 'MECHANICAL FORCE',
      icon: Cpu,
      shortDesc: 'Calibration of digital torque wrenches, force transducers, load cells, and analytical balances.',
      fullDesc: 'Precision torque and force calibration facilities testing torque wrenches, motorized torque screwdrivers, tensile testing machines, and E2/F1 class standard weights.',
      accentColor: 'text-amber-400',
      borderGlow: 'hover:border-amber-400 hover:shadow-[0_0_35px_rgba(255,193,7,0.35)]',
      features: ['Automated Torque Wrench Calibration up to 2000 Nm', 'Load Cell & Force Transducer Calibration to 500 kN', 'E2, F1 Class Standard Weight Verification', 'Analytical Micro-Balance Calibration'],
      instruments: ['Norbar Torque Calibration Bench', 'Interface Force Load Cells', 'Sartorius Microbalances'],
      turnaround: '24 Hours',
      accreditation: 'NABL CC-2891 / ISO 17025',
    },
    {
      id: 'rf-telecom',
      title: 'RF, Microwave & Frequency',
      category: 'HIGH FREQUENCY TELECOM',
      icon: Radio,
      shortDesc: 'High-frequency spectrum analyzer, signal generator, and network analyzer calibration.',
      fullDesc: 'Specialized radio frequency calibration domain covering wireless communications, radar testing, spectrum analysis, signal generators, power sensors, and attenuation standards up to 26.5 GHz.',
      accentColor: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,240,255,0.35)]',
      features: ['Vector Network Analyzer S-Parameter Calibration', 'Spectrum Analyzer Amplitude & Frequency Fidelity', 'Rubidium Atomic Clock Frequency Standard', 'RF Power Meter & Sensor Calibration'],
      instruments: ['Keysight N9030B Signal Analyzer', 'Rohde & Schwarz Vector Generators', 'SRS Rubidium Frequency Standard'],
      turnaround: '48 Hours',
      accreditation: 'NABL CC-2891 / ISO 17025',
    },
  ];

  return (
    <section id="services" className="relative py-28 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest">
              HOLOGRAPHIC SERVICE MATRIX
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              PRECISION <span className="text-amber-400 text-amber-glow">SERVICES</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl">
              Hover over cards to activate liquid magnetic 3D tilt. Click any card to expand full NABL calibration scope & technical specifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-dark-800 border border-neutral-800 text-xs font-mono text-neutral-300">
              <span className="text-amber-400 font-bold">6 PRIMARY</span> DISCIPLINE LABS
            </div>
          </div>
        </div>

        {/* Floating Holographic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                onClick={() => setSelectedService(service)}
                data-cursor="INSPECT"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`magnetic-card group relative p-8 rounded-2xl bg-dark-800/70 border border-neutral-800/80 backdrop-blur-xl transition-all cursor-pointer ${service.borderGlow}`}
              >
                {/* Holographic Scanline Shader */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400/50 shadow-[0_0_20px_#FFC107] animate-scan" />
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />
                </div>

                {/* Category & Icon */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase px-3 py-1 rounded bg-dark-900 border border-neutral-800">
                    {service.category}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-dark-900 border border-neutral-700 flex items-center justify-center group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(255,193,7,0.5)] transition-all">
                    <IconComponent className={`w-6 h-6 ${service.accentColor}`} />
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-amber-400 transition-colors relative z-10">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-400 leading-relaxed mb-6 relative z-10">
                  {service.shortDesc}
                </p>

                {/* Features Pill Tags */}
                <div className="space-y-2 mb-6 relative z-10">
                  {service.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Action Link */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between relative z-10 text-xs font-mono text-neutral-400 group-hover:text-amber-400">
                  <span>EXPAND NABL SCOPE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Full-Screen Detailed Drawer Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-dark-950/80 backdrop-blur-2xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl rounded-2xl bg-dark-900 border border-amber-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(255,193,7,0.2)] z-10 my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-dark-800 border border-neutral-700 text-neutral-400 hover:text-white hover:border-amber-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-dark-800 border border-amber-500/40 flex items-center justify-center">
                  {React.createElement(selectedService.icon, { className: `w-7 h-7 ${selectedService.accentColor}` })}
                </div>
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                    {selectedService.category} // {selectedService.accreditation}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {selectedService.fullDesc}
              </p>

              {/* Technical Capabilities */}
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Calibration Features & Accuracy Scope</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.features.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-dark-800/80 border border-neutral-800 text-xs font-mono text-neutral-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Equipment */}
              <div className="mb-6 space-y-2">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Primary Reference Instruments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.instruments.map((inst, idx) => (
                    <span key={idx} className="px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>

              {/* Turnaround & Action */}
              <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-neutral-400">
                  ESTIMATED LAB TURNAROUND: <span className="text-amber-400 font-bold">{selectedService.turnaround}</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-5 py-2.5 text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    CLOSE
                  </button>
                  <a
                    href="#booking"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold font-display uppercase tracking-wider bg-amber-500 text-dark-950 rounded-lg shadow-[0_0_20px_rgba(255,193,7,0.4)] hover:bg-amber-400 transition-all text-center"
                  >
                    BOOK THIS SERVICE NOW
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
