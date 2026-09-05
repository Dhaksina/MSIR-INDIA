'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Search, TestTube2, Cpu, FileCheck2, PackageCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Step {
  num: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  specs: string[];
}

export default function CalibrationProcess() {
  const steps: Step[] = [
    {
      num: '01',
      title: 'Pickup & Ingestion',
      desc: 'Secure climate-controlled logistics pickup from client facility or insured courier dispatch to MSIR lab.',
      icon: Truck,
      specs: ['Asset Tagging & QR Registration', 'Shock-proof Transportation', '24/7 Chain of Custody'],
    },
    {
      num: '02',
      title: 'Visual & Physical Inspection',
      desc: 'Thorough preliminary checks for mechanical wear, electrical zeroing, probe degradation, and physical damage.',
      icon: Search,
      specs: ['Microscopic Terminal Inspection', 'Environmental Thermal Stabilization', 'Pre-test Cleanroom Soak'],
    },
    {
      num: '03',
      title: 'Pre-Calibration As-Found Testing',
      desc: 'Initial performance measurement across full instrument operating scale before any adjustments are made.',
      icon: TestTube2,
      specs: ['Baseline Deviation Recording', 'Uncertainty Budget Calculation', 'Traceable Primary Standard Sync'],
    },
    {
      num: '04',
      title: 'Precision Calibration & Alignment',
      desc: 'Sub-micron or ppm-level adjustments using master reference standards to bring instrument within tolerance.',
      icon: Cpu,
      specs: ['Automated Multivariable Sweep', 'Direct Artifact Alignment', 'Zero-drift Tuning'],
    },
    {
      num: '05',
      title: 'NABL Certification & QR Seal',
      desc: 'Issuance of ISO/IEC 17025 accredited calibration certificate complete with digital verification QR code.',
      icon: FileCheck2,
      specs: ['NABL Symbol Stamp CC-2891', 'Cryptographic QR Verification', 'PDF Cloud Vault Archival'],
    },
    {
      num: '06',
      title: 'Protected Dispatch & Delivery',
      desc: 'Tamper-evident sealing, protective foam casing, and express door-to-door dispatch with tracking.',
      icon: PackageCheck,
      specs: ['Tamper-evident Calibration Sticker', 'Next-Day Express Dispatch', 'AMC Record Sync'],
    },
  ];

  return (
    <section id="process" className="relative py-28 bg-dark-950 border-t border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest">
            ZERO-DEFECT WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            FUTURISTIC 6-STEP <span className="text-amber-400 text-amber-glow">CALIBRATION PIPELINE</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Every instrument passing through MSIR INDIA undergoes an audited 6-stage lifecycle ensuring 100% NABL compliance.
          </p>
        </div>

        {/* Timeline Pipeline */}
        <div className="relative">
          
          {/* Connecting Energy Beam Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-amber-400 to-cyan-500/20 transform -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="p-6 rounded-2xl bg-dark-900 border border-neutral-800 hover:border-amber-400/60 backdrop-blur-xl transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Step Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                        STEP {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-dark-800 border border-neutral-700 flex items-center justify-center group-hover:border-amber-400 group-hover:shadow-[0_0_15px_#FFC107] transition-all">
                        <IconComponent className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-display text-white group-hover:text-amber-400 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bullet Specs */}
                  <div className="pt-4 mt-4 border-t border-neutral-800/80 space-y-1.5">
                    {step.specs.map((sp, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{sp}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
