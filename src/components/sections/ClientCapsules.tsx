'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Building2 } from 'lucide-react';

interface Client {
  name: string;
  industry: string;
  location: string;
  glowColor: string;
  symbol: string;
}

export default function ClientCapsules() {
  const clients: Client[] = [
    { name: 'TATA MOTORS', industry: 'Automotive OEM', location: 'Chennai Plant', glowColor: 'shadow-[0_0_30px_rgba(255,193,7,0.3)] border-amber-500/40', symbol: 'TATA' },
    { name: 'LARSEN & TOUBRO', industry: 'Heavy Defense & Eng.', location: 'Kattupalli Port', glowColor: 'shadow-[0_0_30px_rgba(0,240,255,0.3)] border-cyan-500/40', symbol: 'L&T' },
    { name: 'BHARAT HEAVY ELECTRICALS', industry: 'Energy & Power', location: 'BHEL Trichy/Ranipet', glowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-500/40', symbol: 'BHEL' },
    { name: 'ISRO SATELLITE CENTRE', industry: 'Aerospace & Space', location: 'Sriharikota / Blr', glowColor: 'shadow-[0_0_30px_rgba(244,63,94,0.3)] border-rose-500/40', symbol: 'ISRO' },
    { name: 'HYUNDAI MOTOR INDIA', industry: 'Automotive Manufacturing', location: 'Sriperumbudur', glowColor: 'shadow-[0_0_30px_rgba(255,193,7,0.3)] border-amber-500/40', symbol: 'HYUNDAI' },
    { name: 'SIEMENS HEALTHINEERS', industry: 'Medical Equipment', location: 'Chennai Technology Park', glowColor: 'shadow-[0_0_30px_rgba(0,240,255,0.3)] border-cyan-500/40', symbol: 'SIEMENS' },
    { name: 'TVS MOTOR COMPANY', industry: 'Automotive & R&D', location: 'Hosur / Chennai', glowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-500/40', symbol: 'TVS' },
    { name: 'BOSCH INDIA', industry: 'Electronics & Sensors', location: 'Naganathapura', glowColor: 'shadow-[0_0_30px_rgba(255,193,7,0.3)] border-amber-500/40', symbol: 'BOSCH' },
  ];

  return (
    <section className="relative py-28 bg-dark-900 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            ENTERPRISE INDUSTRIAL TRUST MATRIX
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            TRUSTED BY <span className="text-amber-400 text-amber-glow">INDUSTRY LEADERS</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Floated inside zero-gravity glass capsules. Calibrating mission-critical instruments for aerospace, defense, automotive, and energy conglomerates across India.
          </p>
        </div>

        {/* Orbiting Glass Capsules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {clients.map((client, idx) => (
            <motion.div
              key={client.name}
              initial={{ y: 0 }}
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4 + (idx % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.4,
              }}
              whileHover={{ scale: 1.05, y: -16 }}
              className={`p-6 rounded-3xl bg-dark-800/70 backdrop-blur-2xl border ${client.glowColor} transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group`}
            >
              {/* Capsule Inner Emblem */}
              <div className="w-14 h-14 rounded-full bg-dark-900 border border-neutral-700 flex items-center justify-center group-hover:border-amber-400 group-hover:shadow-[0_0_20px_#FFC107] transition-all">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {client.symbol}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold font-display text-white group-hover:text-amber-400 transition-colors">
                  {client.name}
                </h3>
                <p className="text-[11px] font-mono text-neutral-400 mt-1">
                  {client.industry}
                </p>
              </div>

              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NABL CALIBRATED
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
