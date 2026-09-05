'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, MapPin, Phone, Mail, Clock, ArrowUp } from 'lucide-react';

import MsirLogo from './MsirLogo';

export default function Footer() {
  const [chennaiTime, setChennaiTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setChennaiTime(new Date().toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-950 border-t border-amber-500/20 pt-20 pb-12 overflow-hidden">
      
      {/* Neon Edge Lighting Bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#FFC107]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-5">
            <MsirLogo size="lg" />

            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              MSIR INDIA is a premiere NABL ISO/IEC 17025 accredited calibration & testing laboratory headquartered in Chennai. Providing sub-micron dimensional metrology, high-precision electro-technical calibration, pressure deadweight testing, and thermal validation.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                NABL CERT: CC-2891
              </span>
              <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ISO/IEC 17025:2017
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
              LABORATORY DISCIPLINES
            </h4>
            <ul className="space-y-2 text-xs font-mono text-neutral-300">
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Electro-Technical Calibration</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Pressure & Vacuum Hydraulics</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Thermal & ITS-90 Fixed Point</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Dimensional Laser Interferometry</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Torque & Force Metrology</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">RF & Microwave Spectrum Analysis</a></li>
            </ul>
          </div>

          {/* Contact Details & 2 Branch Locations */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center justify-between">
              <span>OUR LAB FACILITIES & BRANCHES</span>
              <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">2 LOCATIONS</span>
            </h4>

            <div className="space-y-4 text-xs font-mono text-neutral-300">
              
              {/* Branch 1: Chennai HQ */}
              <div className="p-3.5 rounded-xl bg-dark-900 border border-neutral-800 space-y-1.5 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>CHENNAI HQ & PRIMARY LAB</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed pl-6">
                  The Madras Science & Industrial Resources, #40, 2nd Floor, 2nd St, Padmavathy Nagar, Chromepet, Chennai - 600044, Tamil Nadu
                </p>
              </div>

              {/* Branch 2: Bengaluru Branch */}
              <div className="p-3.5 rounded-xl bg-dark-900 border border-amber-500/30 space-y-1.5 hover:border-amber-400 transition-colors shadow-[0_0_20px_rgba(255,193,7,0.1)]">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>BENGALURU BRANCH & LAB</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed pl-6">
                  AMJ Towers, 170/1, Main Road, Attibele, Bengaluru, Karnataka 562107
                </p>
              </div>

              {/* Contact Info */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>+91 97898 77567</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>info@msirindia.com / commercial@msirindia.com</span>
                </div>
              </div>

            </div>

            {/* Chennai & Bengaluru Live Clock Ticker */}
            <div className="p-3 rounded-xl bg-dark-900 border border-neutral-800 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> INDIA LAB TIME (IST):
              </span>
              <span className="text-amber-400 font-bold">{chennaiTime || '10:30:00 AM'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>© 2026 MSIR INDIA Calibration Laboratories. All rights reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
