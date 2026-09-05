'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MsirLogo from './MsirLogo';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Cpu, ChevronRight, Activity, Calendar, UserCheck, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Laboratory', href: '/#laboratory' },
    { name: 'Process', href: '/#process' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-dark-900/80 backdrop-blur-xl border-b border-amber-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'py-6 bg-gradient-to-b from-dark-950/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Brand Logo & Official Symbol */}
          <Link href="/" className="shrink-0 mr-4 lg:mr-8 group hover:opacity-90 transition-opacity">
            <MsirLogo size="md" />
          </Link>

          {/* Desktop Navigation Links (Visible on LG screens and above) */}
          <nav className="hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full bg-dark-800/60 border border-neutral-800 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-amber-400 hover:bg-amber-500/10 rounded-full transition-all duration-300 flex items-center gap-1"
              >
                <span>{link.name}</span>
              </a>
            ))}
          </nav>

          {/* Quick CTA Actions & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-xs font-mono rounded-lg bg-dark-800 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-xs font-mono rounded-lg bg-dark-800 border border-neutral-800 hover:border-rose-500/40 text-neutral-400 hover:text-rose-400 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-3 py-1.5 text-xs font-mono rounded-lg bg-dark-800 border border-neutral-700 text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> SIGN IN
              </button>
            )}

            <Link
              href="/admin"
              className="px-3.5 py-2 text-xs font-mono rounded-lg bg-dark-800 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 animate-pulse text-amber-400" /> ADMIN PANEL
            </Link>

            <a
              href="/#booking"
              className="relative group overflow-hidden px-5 py-2 text-xs font-semibold tracking-wider font-display uppercase rounded-lg bg-amber-500 text-dark-900 shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.6)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Book Calibration <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
          </div>


          {/* Mobile/Tablet menu trigger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-amber-400 transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-amber-400 transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-amber-400 transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mt-3 px-4 py-4 bg-dark-900 border-b border-amber-500/20 backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-mono text-neutral-200 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 text-xs font-bold font-display uppercase bg-amber-500 text-dark-900 rounded-lg"
            >
              Book Calibration Now
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
