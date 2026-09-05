import React from 'react';
import BackgroundGridCanvas from '@/components/canvas/BackgroundGridCanvas';
import HeroSection from '@/components/hero/HeroSection';
import SpecialistScrollSection from '@/components/sections/SpecialistScrollSection';
import ScrollStorytelling from '@/components/sections/ScrollStorytelling';
import ClientCapsules from '@/components/sections/ClientCapsules';
import CalibrationProcess from '@/components/sections/CalibrationProcess';
import BookingControlPanel from '@/components/sections/BookingControlPanel';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-dark-950 text-white selection:bg-amber-500/30 selection:text-amber-400">
      
      {/* 120 FPS Background Laser & Particle Mesh Canvas */}
      <BackgroundGridCanvas />

      {/* 1. Full-Screen Cinematic Hero Experience */}
      <HeroSection />

      {/* 2. WE ARE SPECIALISTS IN - 4 Core Instrument Showcase */}
      <SpecialistScrollSection />

      {/* 3. Scroll Storytelling - Discipline Lab Domains */}
      <ScrollStorytelling />

      {/* 4. Orbiting Glass Client Trust Capsules */}
      <ClientCapsules />

      {/* 7. Futuristic 6-Step Calibration Pipeline Timeline */}
      <CalibrationProcess />

      {/* 8. Online Control Panel Booking & Optical Scanner */}
      <BookingControlPanel />

    </div>
  );
}


