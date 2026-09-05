'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MsirLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MsirLogo({ className = '', size = 'md' }: MsirLogoProps) {
  // Height sizing for transparent official user logo
  const heightClass = size === 'sm' ? 'h-8 sm:h-9' : size === 'lg' ? 'h-13 sm:h-15' : 'h-10 sm:h-12';

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center group cursor-pointer select-none py-1 overflow-visible ${className}`}
    >
      {/* Official Transparent MSIR INDIA Calibration Logo from User Image */}
      <img
        src="/msir-user-logo-transparent.png"
        alt="MSIR INDIA Calibration"
        className={`${heightClass} max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(255,193,7,0.5)] group-hover:drop-shadow-[0_0_22px_rgba(255,193,7,0.85)] transition-all duration-300 overflow-visible`}
      />
    </motion.div>
  );
}
