'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Equipment {
  id: string;
  name: string;
  category: 'ELECTRO-TECHNICAL' | 'THERMAL' | 'PRESSURE & VACUUM' | 'DIMENSIONAL & LASER' | 'MASS & FLOW';
  brand: string;
  accuracy: string;
  precisionRating: number;
  range: string;
  resolution: string;
  standard: string;
  traceability: string;
  features: string[];
  colorTheme: {
    border: string;
    text: string;
    bg: string;
    glow: string;
    badge: string;
  };
  iconName: string;
}

const DEFAULT_EQUIPMENT: Equipment[] = [
  {
    id: 'fluke-5730a',
    name: 'Fluke 5730A High Precision Calibrator',
    category: 'ELECTRO-TECHNICAL',
    brand: 'FLUKE CALIBRATION',
    accuracy: '± 0.00015 %',
    precisionRating: 99.999,
    range: '0 to 1100 V DC/AC (10 Hz - 1 MHz)',
    resolution: '8.5 Digits (0.01 ppm)',
    standard: 'NIST & NPL Master Standard',
    traceability: 'ISO 17025 Accredited Primary Reference',
    features: [
      'Visual Touch Management UI with real-time waveform inspection',
      'Built-in wideband AC voltage option to 50 MHz',
      'Direct Artifact Calibration for automated drift compensation'
    ],
    colorTheme: {
      border: 'border-amber-500/40 hover:border-amber-400',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    iconName: 'Cpu'
  },
  {
    id: 'wika-cpb5000',
    name: 'WIKA CPB5000 Hydraulic Deadweight Tester',
    category: 'PRESSURE & VACUUM',
    brand: 'WIKA ALEXANDER WIEGAND',
    accuracy: '± 0.005 % of reading',
    precisionRating: 99.995,
    range: '1 bar to 2,500 bar (36,000 PSI)',
    resolution: '0.001 bar',
    standard: 'Piston-Cylinder Reference Assembly',
    traceability: 'DKD / PTB National Standard Traceable',
    features: [
      'Tungsten Carbide piston-cylinder system for zero thermal expansion',
      'Dual-range piston for low and high-pressure dynamic coverage',
      'Automated mass loading mechanism for repeatability'
    ],
    colorTheme: {
      border: 'border-cyan-500/40 hover:border-cyan-400',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.2)]',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    iconName: 'Gauge'
  },
  {
    id: 'keysight-3458a',
    name: 'Keysight 3458A 8.5-Digit System DMM',
    category: 'ELECTRO-TECHNICAL',
    brand: 'KEYSIGHT TECHNOLOGIES',
    accuracy: '± 0.00008 % (0.8 ppm)',
    precisionRating: 99.9992,
    range: '10 nV to 1000 V / 10 pA to 1 A',
    resolution: '8.5 Digit (100,000 rds/sec)',
    standard: 'NABL Recognized Primary DMM Standard',
    traceability: 'Direct Voltage & Resistance Reference',
    features: [
      'Multi-slope II A/D converter for ultra-low noise floor',
      'Direct AC voltage measurement up to 10 MHz',
      'Mathematical statistics & automated drift calibration'
    ],
    colorTheme: {
      border: 'border-emerald-500/40 hover:border-emerald-400',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    iconName: 'Activity'
  },
  {
    id: 'renishaw-xl80',
    name: 'Renishaw XL-80 Laser Interferometer',
    category: 'DIMENSIONAL & LASER',
    brand: 'RENISHAW UK',
    accuracy: '± 0.5 ppm over temp range',
    precisionRating: 99.9995,
    range: '0 to 80 meters (Linear)',
    resolution: '1 nm (0.001 µm)',
    standard: 'ISO 230-2 International Laser Standard',
    traceability: 'National Physical Laboratory (NPL) Traceable',
    features: [
      'Frequency stability ± 0.05 ppm using helium-neon laser source',
      'Environmental compensation unit for air temp & pressure',
      'Simultaneous measurement of pitch, yaw, and straightness'
    ],
    colorTheme: {
      border: 'border-purple-500/40 hover:border-purple-400',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.2)]',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    iconName: 'Zap'
  },
  {
    id: 'fluke-9173',
    name: 'Fluke 9173 Metrology Well Calibrator',
    category: 'THERMAL',
    brand: 'FLUKE HART SCIENTIFIC',
    accuracy: '± 0.005 °C',
    precisionRating: 99.995,
    range: '-45 °C to +700 °C',
    resolution: '0.001 °C',
    standard: 'ITS-90 Primary Fixed-Point Standard',
    traceability: 'NIST Traceable Fixed Point Cells (TPW & Ga)',
    features: [
      'Best-in-class display accuracy with zero axial thermal gradient',
      'Dual-zone temperature control for deep immersion wells',
      'Direct automated interface for SPRT & PRT sensors'
    ],
    colorTheme: {
      border: 'border-rose-500/40 hover:border-rose-400',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.2)]',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    iconName: 'Thermometer'
  },
  {
    id: 'mettler-umx5',
    name: 'Mettler Toledo UMX5 Ultra-Microbalance',
    category: 'MASS & FLOW',
    brand: 'METTLER TOLEDO',
    accuracy: '± 0.2 µg',
    precisionRating: 99.9998,
    range: '0 to 5.1 grams',
    resolution: '0.1 µg (0.0000001 g)',
    standard: 'OIML Class E2 Reference Weights',
    traceability: 'International Mass Standard Prototype (IPK)',
    features: [
      'Automated draft shield with touchless infrared door activation',
      'FACT automated internal temperature-controlled adjustment',
      'Static elimination system for high-resolution micro-weighing'
    ],
    colorTheme: {
      border: 'border-yellow-500/40 hover:border-yellow-400',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      glow: 'shadow-[0_0_25px_rgba(234,179,8,0.2)]',
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    },
    iconName: 'Scale'
  },
  {
    id: 'isotech-microk',
    name: 'Isotech MicroK 700 Thermometer Bridge',
    category: 'THERMAL',
    brand: 'ISOTHERMAL TECHNOLOGY',
    accuracy: '± 0.07 ppm (0.00007 °C)',
    precisionRating: 99.9999,
    range: '0 Ω to 500 Ω (SPRT & Thermistors)',
    resolution: '0.00001 °C',
    standard: 'Primary National Thermometry Standard',
    traceability: 'UKAS / NPL Certified Metrology Standard',
    features: [
      'Zero thermal EMF substitution measurement technique',
      'Substitution DC bridge technology with zero drift',
      'Multi-channel expansion unit for automated SPRT arrays'
    ],
    colorTheme: {
      border: 'border-orange-500/40 hover:border-orange-400',
      text: 'text-orange-400',
      bg: 'bg-orange-500/10',
      glow: 'shadow-[0_0_25px_rgba(249,115,22,0.2)]',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    },
    iconName: 'Sparkles'
  },
  {
    id: 'mitutoyo-lsm',
    name: 'Mitutoyo LSM-902S Laser Scan Micrometer',
    category: 'DIMENSIONAL & LASER',
    brand: 'MITUTOYO JAPAN',
    accuracy: '± 0.5 µm',
    precisionRating: 99.998,
    range: '0.1 mm to 60 mm',
    resolution: '0.01 µm',
    standard: 'Non-Contact Optical Laser Gauging',
    traceability: 'JCSS Accredited Optical Reference',
    features: [
      'Ultra-high scanning speed of 3,200 scans per second',
      'Transparent & reflective workpiece dual measurement mode',
      'Integrated statistical processing & automated pitch check'
    ],
    colorTheme: {
      border: 'border-blue-500/40 hover:border-blue-400',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.2)]',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    iconName: 'Scan'
  },
  {
    id: 'yokogawa-wt5000',
    name: 'Yokogawa WT5000 Precision Power Analyzer',
    category: 'ELECTRO-TECHNICAL',
    brand: 'YOKOGAWA METROLOGY',
    accuracy: '± 0.03 % of reading',
    precisionRating: 99.997,
    range: '0 to 1000 Vrms / 0 to 50 Arms',
    resolution: '7-Digit Modular Channel Sampling',
    standard: 'IEEE 1459 Power Quality Reference',
    traceability: 'NMI National Metrology Institute Certified',
    features: [
      '10 MS/s 18-bit sampling resolution per input element',
      'Harmonic measurement up to 500th order simultaneously',
      'Motor evaluation option with dual torque and speed inputs'
    ],
    colorTheme: {
      border: 'border-indigo-500/40 hover:border-indigo-400',
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      glow: 'shadow-[0_0_25px_rgba(99,102,241,0.2)]',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    iconName: 'Radio'
  },
  {
    id: 'endress-coriolis',
    name: 'Endress+Hauser Coriolis Mass Flow Standard',
    category: 'MASS & FLOW',
    brand: 'ENDRESS + HAUSER',
    accuracy: '± 0.05 % of mass flow rate',
    precisionRating: 99.995,
    range: '0 to 45,000 kg/h',
    resolution: '0.001 kg/h',
    standard: 'Master Gravimetric Calibration Rig',
    traceability: 'NIST & METAS Flow Reference Standards',
    features: [
      'Heartbeat Technology for continuous diagnostic verification',
      'Simultaneous density, mass flow, and fluid temp measurement',
      'Immunity to external vibration & pressure fluctuations'
    ],
    colorTheme: {
      border: 'border-teal-500/40 hover:border-teal-400',
      text: 'text-teal-400',
      bg: 'bg-teal-500/10',
      glow: 'shadow-[0_0_25px_rgba(20,184,166,0.2)]',
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    },
    iconName: 'Waves'
  }
];

interface InstrumentContextType {
  equipmentList: Equipment[];
  addEquipment: (item: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, item: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  resetToDefault: () => void;
}

const InstrumentContext = createContext<InstrumentContextType | undefined>(undefined);

const STORAGE_KEY = 'msir_instruments_db_v1';

export const InstrumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(DEFAULT_EQUIPMENT);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEquipmentList(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load instruments from localStorage', e);
    }
  }, []);

  // Save to LocalStorage whenever equipmentList changes
  const saveToStorage = (newList: Equipment[]) => {
    setEquipmentList(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save instruments to localStorage', e);
    }
  };

  const addEquipment = (newItemData: Omit<Equipment, 'id'>) => {
    const newId = `eq-${Date.now()}`;
    const newItem: Equipment = { ...newItemData, id: newId };
    saveToStorage([newItem, ...equipmentList]);
  };

  const updateEquipment = (id: string, updatedFields: Partial<Equipment>) => {
    const newList = equipmentList.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveToStorage(newList);
  };

  const deleteEquipment = (id: string) => {
    const newList = equipmentList.filter((item) => item.id !== id);
    saveToStorage(newList);
  };

  const resetToDefault = () => {
    saveToStorage(DEFAULT_EQUIPMENT);
  };

  return (
    <InstrumentContext.Provider
      value={{
        equipmentList,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        resetToDefault
      }}
    >
      {children}
    </InstrumentContext.Provider>
  );
};

export const useInstrumentContext = () => {
  const ctx = useContext(InstrumentContext);
  if (!ctx) {
    throw new Error('useInstrumentContext must be used within an InstrumentProvider');
  }
  return ctx;
};
