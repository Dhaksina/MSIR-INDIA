export interface MasterStandard {
  id: string;
  model: string;
  name: string;
  tag: string;
  description: string;
  specs: { label: string; val: string }[];
  traceability: string;
}

export interface ScopeItem {
  id: string;
  category: string;
  measurand: string;
  range: string;
  condition?: string;
  cmc: string;
  standardUsed: string;
  method: string;
}

export interface ServicedInstrument {
  name: string;
  sub: string;
}

export interface SimulatorConfig {
  title: string;
  modes: { id: string; label: string; unit: string; baseVal: string; ppm: string }[];
  paramLabel: string;
  paramDefault: number;
  paramMin: number;
  paramMax: number;
  paramStep: number;
  paramUnit: string;
}

export interface FacilityData {
  id: string;
  slug: string;
  title: string;
  facilityName: string;
  subtitle: string;
  tagline: string;
  color: string;
  accentHex: string;
  secondaryHex: string;
  chamber: {
    temp: string;
    humidity: string;
    cleanroom: string;
    special: string;
    nablCert: string;
  };
  stats: { label: string; value: string; sub: string }[];
  overview: string;
  standards: MasterStandard[];
  categories: { id: string; label: string }[];
  scope: ScopeItem[];
  servicedEquipment: ServicedInstrument[];
  environmentalRigor: string[];
  traceability: {
    tier1: string;
    tier2: string;
    tier3: string;
    tier4: string;
  };
  simulator: SimulatorConfig;
  calculator: {
    baseFee: number;
    instruments: { id: string; label: string; multiplier: number }[];
  };
}

export const FACILITIES_MAP: Record<string, FacilityData> = {
  temperature: {
    id: 'temperature',
    slug: 'temperature',
    title: 'Temperature & Humidity',
    facilityName: 'TEMPERATURE & HUMIDITY METROLOGY FACILITY',
    subtitle: 'ITS-90 Fixed-Point Triple-Point & Thermal Metrology',
    tagline: 'ULTRA-STABLE THERMAL METROLOGY DIVISION // CHENNAI PRIMARY LAB',
    color: 'text-rose-400',
    accentHex: '#F43F5E',
    secondaryHex: '#38BDF8',
    chamber: {
      temp: '23.0 °C ± 0.2 °C',
      humidity: '45.0 % RH ± 3%',
      cleanroom: 'ISO Class 7 / Class 10,000',
      special: 'Thermal Fluid Stability: ±0.001 °C',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'TEMPERATURE RANGE', value: '-196 °C to +1,600 °C', sub: 'Liquid N2 to Furnaces' },
      { label: 'BEST UNCERTAINTY (CMC)', value: '± 0.001 °C (1 mK)', sub: 'At Water Triple Point' },
      { label: 'HUMIDITY RANGE', value: '10 % to 98 % RH', sub: 'Two-Pressure Generator' },
      { label: 'REFERENCE STANDARD', value: 'SPRT (ITS-90)', sub: 'Fluke 1595A Super-Therm' },
    ],
    overview:
      'MSIR INDIA’s Temperature and Humidity Metrology Laboratory operates at the pinnacle of ITS-90 thermal realization. Featuring primary sealed Triple Point of Water (TPW) cells, Gallium and Indium melting point standards, Standard Platinum Resistance Thermometers (SPRT), and two-pressure humidity generation systems, our laboratory delivers thermal validation with millikelvin precision.',
    standards: [
      {
        id: 'tpw-cells',
        model: 'Isotech Sealed TPW Cells',
        name: 'Triple Point of Water Primary Standard',
        tag: 'ITS-90 Defining Standard',
        description: 'Primary realization of the kelvin (273.16 K / 0.010 °C) in high-purity quartz envelopes, establishing the baseline for SPRT resistance ratios (W).',
        specs: [
          { label: 'Fixed Point Temp', val: '0.0100 °C (273.16 K)' },
          { label: 'Reproducibility', val: '± 0.0001 °C (0.1 mK)' },
          { label: 'Cell Mantle', val: 'Dry Ice / LN2 Prep' },
        ],
        traceability: 'Directly linked to BIPM ITS-90 definition',
      },
      {
        id: 'fluke-1595a',
        model: 'Fluke 1595A Super-Thermometer',
        name: 'Reference Thermometry Bridge',
        tag: 'Ultra-Precision Resistance Ratio',
        description: 'World-leading thermometry readout with 0.06 ppm ratio accuracy, automated current reversal, and zero-drift internal reference resistors.',
        specs: [
          { label: 'Ratio Accuracy', val: '0.06 ppm (±0.000015 °C)' },
          { label: 'Sensor Compatibility', val: 'SPRT, PRT, Thermistors' },
          { label: 'Measurement Speed', val: '1 reading/sec per channel' },
        ],
        traceability: 'NPL India Calibrated Ratio',
      },
      {
        id: 'thunder-2500',
        model: 'Thunder Scientific 2500',
        name: 'Two-Pressure Mobile Humidity Generator',
        tag: 'Primary Humidity Standard',
        description: 'Generates known humidity levels based on the NIST-proven two-pressure principle, requiring no secondary humidity sensors for master determination.',
        specs: [
          { label: 'Humidity Range', val: '10 % to 98 % RH' },
          { label: 'RH Uncertainty', val: '± 0.5 % RH' },
          { label: 'Temp Range', val: '0 °C to 70 °C' },
        ],
        traceability: 'NIST / NPL Traceable',
      },
    ],
    categories: [
      { id: 'all', label: 'All Parameters' },
      { id: 'sprt', label: 'RTD & PRT' },
      { id: 'tc', label: 'Thermocouples' },
      { id: 'rh', label: 'Humidity & Dew Point' },
      { id: 'ir', label: 'Infrared & Blackbody' },
    ],
    scope: [
      {
        id: 't1',
        category: 'sprt',
        measurand: 'Resistance Thermometers (RTD / SPRT / Pt100)',
        range: '-196 °C to +660 °C',
        condition: 'Fixed Point & Fluid Bath',
        cmc: '± 0.003 °C to ± 0.025 °C',
        standardUsed: 'SPRT + Fluke 1595A Super-Thermometer',
        method: 'Comparison in stirred calibration bath (EURAMET cg-13)',
      },
      {
        id: 't2',
        category: 'tc',
        measurand: 'Noble & Base Metal Thermocouples (K, J, T, N, R, S, B)',
        range: '0 °C to 1,200 °C',
        condition: 'Dry-Well & Tube Furnace',
        cmc: '± 0.35 °C to ± 1.2 °C',
        standardUsed: 'Type S/R Standard Thermocouple + DMM',
        method: 'Furnace comparison metrology (ASTM E220)',
      },
      {
        id: 't3',
        category: 'rh',
        measurand: 'Relative Humidity Transmitters & Data Loggers',
        range: '10 % RH to 95 % RH (at 20°C to 50°C)',
        condition: 'Controlled Chamber',
        cmc: '± 0.6 % RH',
        standardUsed: 'Chilled Mirror Hygrometer + 2-Pressure Gen',
        method: 'Direct chamber comparison against chilled mirror',
      },
      {
        id: 't4',
        category: 'ir',
        measurand: 'Infrared Thermometers & Thermal Imagers',
        range: '30 °C to 500 °C',
        condition: 'Large Aperture Blackbody (ε = 0.995)',
        cmc: '± 0.65 °C to ± 1.5 °C',
        standardUsed: 'Cavity Blackbody Reference Radiator',
        method: 'Radiometric infrared calibration (EURAMET cg-20)',
      },
    ],
    servicedEquipment: [
      { name: 'RTD & PRT Sensors', sub: 'Pt100, Pt500, Pt1000 2/3/4-wire probes' },
      { name: 'Thermocouples (All Types)', sub: 'Industrial mineral-insulated K, J, T, E, R, S, B' },
      { name: 'Chilled Mirror Hygrometers', sub: 'Primary optical dew point instruments' },
      { name: 'Thermal Imaging Cameras', sub: 'FLIR, Fluke, Testo infrared imagers' },
      { name: 'Climatic Chambers & Autoclaves', sub: 'Multi-point temperature & humidity mapping' },
      { name: 'Glass & Dial Thermometers', sub: 'ASTM laboratory liquid-in-glass standards' },
    ],
    environmentalRigor: [
      'Stirred fluid calibration baths maintaining thermal uniformity within ± 0.001 °C',
      'Continuous chilled mirror dew point monitoring preventing ambient condensation',
      'Dual-loop PID dry-well furnaces with zero axial temperature gradients',
      'Dedicated cleanroom zone for SPRT assembly and annealing ovens',
    ],
    traceability: {
      tier1: 'BIPM SI Thermodynamic Temperature Definition (Kelvin)',
      tier2: 'NPL India Primary ITS-90 Fixed-Point Sealed Cells',
      tier3: 'MSIR Master SPRT & 1595A Super-Thermometer (NABL CC-2891)',
      tier4: 'Client Industrial Probes, Furnaces, and Environmental Chambers',
    },
    simulator: {
      title: 'Real-Time Thermal Wave & Fixed-Point Plateau Simulator',
      modes: [
        { id: 'tpw', label: 'WATER TRIPLE POINT', unit: '°C', baseVal: '0.010002', ppm: '±0.0008 °C' },
        { id: 'bath', label: 'STIRRED FLUID BATH', unit: '°C', baseVal: '100.0041', ppm: '±0.0025 °C' },
        { id: 'furnace', label: '1000°C FURNACE', unit: '°C', baseVal: '1000.12', ppm: '±0.45 °C' },
      ],
      paramLabel: 'Set Calibration Temperature',
      paramDefault: 100,
      paramMin: -50,
      paramMax: 600,
      paramStep: 10,
      paramUnit: '°C',
    },
    calculator: {
      baseFee: 2800,
      instruments: [
        { id: 'rtd', label: 'Precision RTD / Pt100 Sensor (3 Test Points)', multiplier: 1.0 },
        { id: 'tc', label: 'Thermocouple with Indicator (5 Test Points)', multiplier: 1.25 },
        { id: 'rh', label: 'Humidity & Temperature Transmitter', multiplier: 1.4 },
        { id: 'ir', label: 'Thermal Imager / Infrared Pyrometer', multiplier: 1.8 },
        { id: 'chamber', label: 'Climatic Chamber 9-Point Spatial Mapping', multiplier: 3.5 },
      ],
    },
  },

  pressure: {
    id: 'pressure',
    slug: 'pressure',
    title: 'Pressure & Vacuum',
    facilityName: 'PRESSURE & VACUUM CALIBRATION FACILITY',
    subtitle: 'Dynamic Pneumatic & Hydraulic Deadweight Testing',
    tagline: 'HIGH-PRESSURE METROLOGY DIVISION // CHENNAI PRIMARY LAB',
    color: 'text-cyan-400',
    accentHex: '#00F0FF',
    secondaryHex: '#F59E0B',
    chamber: {
      temp: '20.0 °C ± 0.5 °C',
      humidity: '45.0 % RH ± 5%',
      cleanroom: 'ISO Class 7 Clean Environment',
      special: 'Vibration Isolated Concrete Pedestal',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'PRESSURE RANGE', value: '-1 bar to 2,500 bar', sub: 'Vacuum to Ultra-High' },
      { label: 'BEST UNCERTAINTY (CMC)', value: '± 0.005 % of reading', sub: 'Hydraulic Deadweight' },
      { label: 'FLUID MEDIA', value: 'Gas, N2, Oil, Water', sub: 'Non-Contaminating' },
      { label: 'AUTOMATION', value: 'Druck PACE6000', sub: 'Dual Channel High-Speed' },
    ],
    overview:
      'The MSIR INDIA Pressure Metrology Laboratory specializes in pneumatic and hydraulic pressure calibration across 7 orders of magnitude. Using automated deadweight testers with tungsten carbide piston-cylinder units, localized gravity compensation (g = 9.7828 m/s²), and high-stability quartz transducers, we serve aerospace, oil & gas, process industries, and defense standards.',
    standards: [
      {
        id: 'wika-cpb5000',
        model: 'WIKA CPB5000',
        name: 'Hydraulic Deadweight Tester (Piston Gauge)',
        tag: 'Primary Pressure Standard',
        description: 'Tungsten carbide piston-cylinder assembly with high-precision austenitic stainless steel mass sets for primary pressure generation up to 2,500 bar.',
        specs: [
          { label: 'Pressure Range', val: 'Up to 2,500 bar (36,000 psi)' },
          { label: 'Accuracy', val: '± 0.005 % of reading' },
          { label: 'Piston Material', val: 'Tungsten Carbide' },
        ],
        traceability: 'NPL India Mass & Area Traceable',
      },
      {
        id: 'druck-pace6000',
        model: 'Druck PACE 6000',
        name: 'Modular Pneumatic Pressure Controller',
        tag: 'High-Precision Automated Standard',
        description: 'Dual-channel piezo-resistive and resonant quartz pressure sensors for ultra-fast, overshoot-free calibration up to 210 bar.',
        specs: [
          { label: 'Control Stability', val: '0.001 % F.S.' },
          { label: 'Measurement Precision', val: '0.005 % Rdg + 0.005 % FS' },
          { label: 'Media', val: 'Clean Dry Air / Nitrogen' },
        ],
        traceability: 'ISO/IEC 17025 Accredited',
      },
    ],
    categories: [
      { id: 'all', label: 'All Parameters' },
      { id: 'dwt', label: 'Deadweight Metrology' },
      { id: 'pneumatic', label: 'Pneumatic & Vacuum' },
      { id: 'hydraulic', label: 'Hydraulic High-Pressure' },
      { id: 'differential', label: 'Differential Pressure' },
    ],
    scope: [
      {
        id: 'p1',
        category: 'pneumatic',
        measurand: 'Pneumatic Low Pressure & Vacuum Gauges',
        range: '-0.95 bar to 20 bar',
        condition: 'Clean Nitrogen Gas',
        cmc: '± 0.01 % of reading',
        standardUsed: 'Druck PACE 6000 Controller',
        method: 'Direct comparison (DKD-R 6-1)',
      },
      {
        id: 'p2',
        category: 'hydraulic',
        measurand: 'Hydraulic Pressure Transmitters & Master Gauges',
        range: '10 bar to 2,500 bar',
        condition: 'Synthetic Sebacate / Mineral Oil',
        cmc: '± 0.005 % of reading',
        standardUsed: 'WIKA CPB5000 Hydraulic Deadweight Tester',
        method: 'Cross-float and direct deadweight generation (BS EN 837)',
      },
      {
        id: 'p3',
        category: 'differential',
        measurand: 'Differential Pressure (DP) Transmitters',
        range: '0 to 1,000 mbar at static pressure to 100 bar',
        condition: 'Dual Port Automated',
        cmc: '± 0.02 % of span',
        standardUsed: 'Resonant Quartz Transfer Standard',
        method: 'High line pressure differential comparison',
      },
    ],
    servicedEquipment: [
      { name: 'Analog & Digital Master Gauges', sub: '0.05% to 0.25% class test gauges' },
      { name: 'Pressure Transmitters (HART/4-20mA)', sub: 'Industrial process transducers & transmitters' },
      { name: 'Differential Pressure Transmitters', sub: 'Flow orifice & filter monitoring DP cells' },
      { name: 'Safety Relief Valves (SRV / PSV)', sub: 'Pop test, reseat pressure & bubble leak checks' },
      { name: 'Barometers & Altimeters', sub: 'Atmospheric pressure aviation reference units' },
      { name: 'Vacuum Gauges (Pirani / Capacitance)', sub: 'Rough to high vacuum instrumentation' },
    ],
    environmentalRigor: [
      'Independent seismic isolated granite foundation dampening building vibrations',
      'Local acceleration of gravity (g) surveyed and applied to all deadweight calculations',
      'Closed-loop oil cleaning system preventing cross-contamination of client media',
      'Continuous thermal gradient logging to correct for piston-cylinder thermal expansion',
    ],
    traceability: {
      tier1: 'BIPM SI Derived Unit (Pascal = N/m²)',
      tier2: 'NPL India Primary Ultrasonic Mercury Manometer & DWT',
      tier3: 'MSIR Master CPB5000 Tungsten Carbide Piston Gauge (NABL CC-2891)',
      tier4: 'Client Pressure Transmitters, Master Gauges, and Safety Valves',
    },
    simulator: {
      title: 'Deadweight Piston Flotation & Equilibrium Simulator',
      modes: [
        { id: 'flotation', label: 'PISTON FLOTATION DWT', unit: 'bar', baseVal: '250.004', ppm: '±0.005%' },
        { id: 'dynamic', label: 'TRANSMITTER STEP RESPONSE', unit: 'mA', baseVal: '16.002', ppm: '±0.015%' },
        { id: 'vacuum', label: 'PNEUMATIC VACUUM', unit: 'mbar', baseVal: '-850.12', ppm: '±0.02 mbar' },
      ],
      paramLabel: 'Target Pressure Setpoint',
      paramDefault: 100,
      paramMin: 1,
      paramMax: 1000,
      paramStep: 10,
      paramUnit: 'bar',
    },
    calculator: {
      baseFee: 2200,
      instruments: [
        { id: 'gauge', label: 'Digital / Analog Pressure Gauge (10 Points)', multiplier: 1.0 },
        { id: 'transmitter', label: 'HART / 4-20mA Pressure Transmitter', multiplier: 1.3 },
        { id: 'dp', label: 'Differential Pressure (DP) Transmitter', multiplier: 1.6 },
        { id: 'dwt', label: 'Deadweight Tester Piston Cross-Float Verification', multiplier: 3.2 },
      ],
    },
  },

  mass: {
    id: 'mass',
    slug: 'mass',
    title: 'Mass & Volume',
    facilityName: 'MASS & VOLUMETRIC METROLOGY FACILITY',
    subtitle: 'E1/E2 Grade Analytical Mass & Volumetric Glassware',
    tagline: 'SUB-MICROGRAM MASS METROLOGY DIVISION // CHENNAI PRIMARY LAB',
    color: 'text-emerald-400',
    accentHex: '#10B981',
    secondaryHex: '#FFC107',
    chamber: {
      temp: '20.0 °C ± 0.3 °C',
      humidity: '50.0 % RH ± 5%',
      cleanroom: 'Class 1,000 Microbalance Enclosure',
      special: 'Draft Velocity < 0.05 m/s',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'MASS CLASS', value: 'E1, E2, F1, F2, M1', sub: 'OIML R111 Compliant' },
      { label: 'WEIGHT RANGE', value: '1 mg to 500 kg', sub: 'Microgram to Industrial' },
      { label: 'MICROBALANCE RES', value: '0.1 µg (0.0000001 g)', sub: 'Mettler Toledo AX' },
      { label: 'VOLUME RANGE', value: '1 µL to 100 L', sub: 'Gravimetric Prover' },
    ],
    overview:
      'MSIR INDIA’s Mass & Volume Metrology Laboratory provides ultra-precision calibration for OIML Class E1, E2, and F1 weights, microbalances, and pharmaceutical volumetric equipment. Operating inside a positive-pressure, low-air-velocity cleanroom with automated robotic mass comparators and air-buoyancy CIPM formula corrections, we achieve sub-microgram repeatability.',
    standards: [
      {
        id: 'mettler-ax',
        model: 'Mettler Toledo AX Automated Robotic Comparator',
        name: 'Robotic Mass Comparator',
        tag: 'Primary Mass Transfer',
        description: 'Automated weight exchange mechanism eliminating human thermal disturbance during ABBA substitution weighing cycles.',
        specs: [
          { label: 'Resolution', val: '0.1 µg (100 ng)' },
          { label: 'Capacity', val: 'Up to 1,000 g' },
          { label: 'Repeatability', val: '0.3 µg' },
        ],
        traceability: 'NPL India Primary Kilogram Traceable',
      },
      {
        id: 'troemner-e1',
        model: 'Troemner Ultra-Mass Class E1 Sets',
        name: 'Austenitic Stainless Steel Weight Standards',
        tag: 'Primary Working Standards',
        description: 'Monoblock vacuum-melted austenitic stainless steel with zero magnetic susceptibility and mirror-polished surface finish.',
        specs: [
          { label: 'Class', val: 'OIML Class E1' },
          { label: 'Density', val: '8,000 kg/m³ ± 20 kg/m³' },
          { label: 'Magnetic Susceptibility', val: 'χ < 0.005' },
        ],
        traceability: 'Traceable to BIPM Planck Constant Definition',
      },
    ],
    categories: [
      { id: 'all', label: 'All Mass & Volume' },
      { id: 'e1e2', label: 'Class E1 / E2 Standards' },
      { id: 'industrial', label: 'Industrial Balances & F1' },
      { id: 'volume', label: 'Pipettes & Glassware' },
    ],
    scope: [
      {
        id: 'm1',
        category: 'e1e2',
        measurand: 'OIML Class E1 & E2 Precision Mass Weights',
        range: '1 mg to 10 kg',
        condition: 'Robotic Comparator with Air Buoyancy Correction',
        cmc: '± 0.002 mg to ± 0.05 mg',
        standardUsed: 'Primary Class E1 Weight Set + AX Comparator',
        method: 'Subdivision & ABBA comparison method (OIML R111-1)',
      },
      {
        id: 'm2',
        category: 'industrial',
        measurand: 'Analytical Balances & Industrial Scales',
        range: '0.1 mg to 500 kg',
        condition: 'On-site or In-Lab',
        cmc: '± 0.05 mg to ± 5 g',
        standardUsed: 'Calibrated Class E2 & F1 Weight Standards',
        method: 'Repeatability, linearity, and eccentricity testing (EURAMET cg-18)',
      },
      {
        id: 'm3',
        category: 'volume',
        measurand: 'Micro-Pipettes, Burettes & Volumetric Flasks',
        range: '1 µL to 2,000 mL',
        condition: 'Degassed Deionized Water Gravimetry',
        cmc: '± 0.05 µL to ± 0.15 mL',
        standardUsed: 'Analytical Balance + Density Determination Kit',
        method: 'Gravimetric volume calculation as per ISO 8655 / ISO 4787',
      },
    ],
    servicedEquipment: [
      { name: 'OIML Weight Sets (E1 to M1)', sub: 'Individual & slotted standard test weights' },
      { name: 'Analytical & Semi-Micro Balances', sub: 'Laboratory 4, 5, and 6-decimal balances' },
      { name: 'Single & Multi-Channel Pipettes', sub: 'Eppendorf, Gilson, Thermo micro-pipettes' },
      { name: 'Volumetric Glassware & Pycnometers', sub: 'Class A volumetric flasks, burettes, cylinders' },
      { name: 'Heavy Industrial Platform Scales', sub: 'Floor scales, weighbridges, hopper scales' },
    ],
    environmentalRigor: [
      'Active air density computation using CIPM-2007 formula (measuring ambient P, T, and RH)',
      'Sub-floor vibration isolation preventing seismic disruption to 0.1 µg microbalance readings',
      'Electrostatic discharge neutralization air ionizers at all weighing stations',
      'Air velocity maintained below 0.05 m/s to eliminate convective aerodynamic drag',
    ],
    traceability: {
      tier1: 'BIPM SI Kilogram Definition (Planck Constant h)',
      tier2: 'NPL India National Prototype Kilogram Standard',
      tier3: 'MSIR Master Class E1 Weight Set & Robotic Comparators (NABL CC-2891)',
      tier4: 'Client Precision Weights, Balances, and Pharmaceutical Pipettes',
    },
    simulator: {
      title: 'Microbalance Beam Oscillation & Air Buoyancy Simulator',
      modes: [
        { id: 'abba', label: 'ABBA COMPARISON CYCLE', unit: 'g', baseVal: '100.0000042', ppm: '±0.0000008 g' },
        { id: 'buoyancy', label: 'AIR BUOYANCY DRIFT', unit: 'µg', baseVal: '+1.42', ppm: '±0.12 µg' },
        { id: 'pipette', label: 'GRAVIMETRIC DISPENSE', unit: 'µL', baseVal: '100.02', ppm: '±0.08 µL' },
      ],
      paramLabel: 'Nominal Test Mass',
      paramDefault: 100,
      paramMin: 1,
      paramMax: 1000,
      paramStep: 10,
      paramUnit: 'g',
    },
    calculator: {
      baseFee: 2000,
      instruments: [
        { id: 'weight-set', label: 'Class F1/F2 Weight Box (1mg - 200g)', multiplier: 1.0 },
        { id: 'weight-e2', label: 'Class E2 Analytical Weight Box', multiplier: 2.2 },
        { id: 'balance', label: 'Analytical Laboratory Balance (In-Lab)', multiplier: 1.3 },
        { id: 'pipette', label: 'Variable Micro-Pipette 3-Point Calibration', multiplier: 0.9 },
      ],
    },
  },

  rf: {
    id: 'rf',
    slug: 'rf',
    title: 'RF & Microwave',
    facilityName: 'RF & MICROWAVE CALIBRATION FACILITY',
    subtitle: 'High-Frequency Radio Frequency & Microwave Metrology',
    tagline: '40 GHz HIGH FREQUENCY METROLOGY DIVISION // CHENNAI PRIMARY LAB',
    color: 'text-purple-400',
    accentHex: '#A855F7',
    secondaryHex: '#00F0FF',
    chamber: {
      temp: '23.0 °C ± 0.5 °C',
      humidity: '45.0 % RH ± 5%',
      cleanroom: 'RF Shielded Semi-Anechoic Enclosure',
      special: 'EMI Attenuation > 90 dB @ 10 GHz',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'FREQUENCY RANGE', value: '10 kHz to 40 GHz', sub: 'Coaxial & Waveguide' },
      { label: 'POWER DYNAMIC RANGE', value: '-130 dBm to +30 dBm', sub: 'Sub-Nanowatt to Watts' },
      { label: 'ATTENUATION CMC', value: '± 0.05 dB', sub: 'To 40 GHz' },
      { label: 'PRIMARY ANALYZER', value: 'Keysight PNA-X', sub: '67 GHz 4-Port Microwave' },
    ],
    overview:
      'MSIR INDIA’s RF and Microwave Metrology Laboratory provides comprehensive calibration up to 40 GHz for aerospace, radar, 5G wireless telecommunications, and defense electronics. Utilizing Keysight PNA-X microwave network analyzers, Rohde & Schwarz signal analyzers, and primary thermistor power sensors, we calibrate power, attenuation, S-parameters, phase noise, and spectrum fidelity.',
    standards: [
      {
        id: 'pna-x',
        model: 'Keysight N5247B PNA-X',
        name: 'Microwave Network Analyzer 67 GHz',
        tag: 'Primary S-Parameter Standard',
        description: 'Industry flagship 4-port vector network analyzer with electronic calibration (ECal) modules and precision air-line mechanical verification kits.',
        specs: [
          { label: 'Freq Range', val: '10 MHz to 67 GHz' },
          { label: 'Dynamic Range', val: '> 130 dB' },
          { label: 'Trace Noise', val: '< 0.001 dB rms' },
        ],
        traceability: 'Keysight Primary Microwave Standards',
      },
      {
        id: 'rns-fsv',
        model: 'Rohde & Schwarz FSV3044',
        name: 'Signal and Spectrum Analyzer 44 GHz',
        tag: 'RF Frequency & Amplitude Master',
        description: 'Ultra-low phase noise signal analyzer for harmonic distortion, third-order intercept (TOI), and frequency accuracy.',
        specs: [
          { label: 'Frequency', val: '10 Hz to 44 GHz' },
          { label: 'Analysis Bandwidth', val: '200 MHz' },
          { label: 'Phase Noise', val: '< -130 dBc/Hz @ 1 GHz' },
        ],
        traceability: 'NPL India / PTB Traceable',
      },
    ],
    categories: [
      { id: 'all', label: 'All RF Parameters' },
      { id: 'power', label: 'RF Power & Attenuation' },
      { id: 'spectrum', label: 'Spectrum & Harmonics' },
      { id: 'vna', label: 'S-Parameters & VSWR' },
    ],
    scope: [
      {
        id: 'rf1',
        category: 'power',
        measurand: 'RF Power Sensors & Power Meters',
        range: '-70 dBm to +30 dBm (10 MHz to 40 GHz)',
        condition: 'Precision Coaxial Coaxial Mount',
        cmc: '± 0.025 dB to ± 0.09 dB',
        standardUsed: 'Primary Thermistor Power Standard + DC Reference',
        method: 'Direct comparison transfer standard method',
      },
      {
        id: 'rf2',
        category: 'spectrum',
        measurand: 'Spectrum Analyzers (Frequency & Amplitude)',
        range: '9 kHz to 40 GHz (Level: -100 to +10 dBm)',
        condition: 'Harmonic & Spurious Verification',
        cmc: '± 0.15 dB Amplitude, ± 2×10⁻¹¹ Freq',
        standardUsed: 'Rubidium Atomic Clock + Synthesized Generator',
        method: 'Calibrated stepped level & frequency marker verification',
      },
      {
        id: 'rf3',
        category: 'vna',
        measurand: 'RF Attenuators & Termination Loads (VSWR / S-Parameters)',
        range: '0 to 70 dB attenuation (up to 40 GHz)',
        condition: '50 Ω Characteristic Impedance',
        cmc: '± 0.05 dB (Attenuation), ± 0.015 (Reflection Γ)',
        standardUsed: 'Keysight PNA-X VNA + Precision Air Lines',
        method: 'Vector network S-parameter substitution metrology',
      },
    ],
    servicedEquipment: [
      { name: 'Spectrum & Signal Analyzers', sub: 'Keysight, R&S, Anritsu up to 40 GHz' },
      { name: 'Vector Network Analyzers (VNA)', sub: 'S11, S21, S12, S22 magnitude & phase verification' },
      { name: 'RF Signal Generators & Synthesizers', sub: 'CW, AM, FM, Phase, Pulse and digital modulation' },
      { name: 'RF Power Meters & Sensors', sub: 'Average, peak, and thermocouple power sensors' },
      { name: 'Step & Fixed Attenuators', sub: 'High-precision coaxial attenuators and pads' },
    ],
    environmentalRigor: [
      'Continuous RF-tight semi-anechoic Faradaic shielded bay with honeycomb air vents',
      'All RF cables utilize phase-stable silver-plated Gore-Tex dielectric assemblies',
      'Calibrated torque wrenches used on all 3.5mm, 2.92mm (K), and 2.4mm connectors',
      'Rubidium atomic clock distribution feed to all instruments on the RF bench',
    ],
    traceability: {
      tier1: 'BIPM SI Derived Units (Hertz, Watt, Decibel)',
      tier2: 'NPL India Radio Frequency Metrology Standards',
      tier3: 'MSIR Master Keysight PNA-X & R&S FSV3044 (NABL CC-2891)',
      tier4: 'Client Microwave Receivers, Radar Front-Ends, and Spectrum Analyzers',
    },
    simulator: {
      title: 'High-Frequency Spectrum Sweep & FFT Waveform Analyzer',
      modes: [
        { id: 'spectrum', label: '40 GHz SPECTRUM SWEEP', unit: 'dBm', baseVal: '-10.02', ppm: '±0.04 dB' },
        { id: 'phase', label: 'PHASE NOISE PROFILE', unit: 'dBc/Hz', baseVal: '-128.4', ppm: '±0.8 dBc' },
        { id: 'smith', label: 'VNA S11 RETURN LOSS', unit: 'dB', baseVal: '-34.15', ppm: '±0.08 dB' },
      ],
      paramLabel: 'RF Carrier Frequency',
      paramDefault: 5,
      paramMin: 1,
      paramMax: 40,
      paramStep: 1,
      paramUnit: 'GHz',
    },
    calculator: {
      baseFee: 4500,
      instruments: [
        { id: 'rf-meter', label: 'RF Power Meter & 1 Power Sensor', multiplier: 1.0 },
        { id: 'attenuator', label: 'Step / Fixed Microwave Attenuator to 18 GHz', multiplier: 0.9 },
        { id: 'spec-an', label: 'Spectrum Analyzer (up to 26.5 GHz)', multiplier: 1.8 },
        { id: 'vna', label: 'Vector Network Analyzer 2-Port Calibration', multiplier: 2.2 },
      ],
    },
  },

  dimensions: {
    id: 'dimensions',
    slug: 'dimensions',
    title: 'Dimensions',
    facilityName: 'DIMENSIONAL & LASER INTERFEROMETRY FACILITY',
    subtitle: 'Sub-Micron Laser Metrology & CMM Metrology',
    tagline: 'SUB-MICRON LENGTH & GEOMETRY METROLOGY // CHENNAI PRIMARY LAB',
    color: 'text-amber-300',
    accentHex: '#FCD34D',
    secondaryHex: '#00F0FF',
    chamber: {
      temp: '20.0 °C ± 0.2 °C (ISO 1 Standard)',
      humidity: '45.0 % RH ± 5%',
      cleanroom: 'ISO Class 6 Cleanroom',
      special: 'Acoustic & Thermal Drift Isolation',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'LASER RESOLUTION', value: '0.0001 mm (0.1 µm)', sub: 'Renishaw XL-80' },
      { label: 'MEASURING RANGE', value: '0 to 1,000 mm', sub: 'Linear Metrology' },
      { label: 'FLATNESS STANDARD', value: 'λ / 20 (0.03 µm)', sub: 'Monochromatic Flat' },
      { label: 'CHAMBER TEMP', value: 'Strict 20.0 °C', sub: 'ISO 1 Standard Baseline' },
    ],
    overview:
      'The MSIR INDIA Dimensional Metrology Laboratory strictly adheres to the ISO 1 international standard reference temperature of 20.0 °C. Equipped with Renishaw XL-80 laser interferometers, Grade 0 ceramic and tungsten carbide gauge block masters, Talyrond roundness testers, and automated optical micrometers, we deliver dimensional verification for aerospace tooling and precision machining.',
    standards: [
      {
        id: 'renishaw-xl80',
        model: 'Renishaw XL-80 Laser Interferometer',
        name: 'HeNe Laser Length Standard',
        tag: 'Primary Dimensional Reference',
        description: 'Frequency-stabilized helium-neon laser system with automated environmental compensation for air temperature, pressure, and relative humidity.',
        specs: [
          { label: 'Linear Accuracy', val: '± 0.5 ppm over full range' },
          { label: 'Resolution', val: '1 nm (0.001 µm)' },
          { label: 'Wavelength', val: '632.8 nm (He-Ne)' },
        ],
        traceability: 'NPL India Laser Metrology Direct Traceability',
      },
      {
        id: 'mitutoyo-blocks',
        model: 'Mitutoyo Grade 0 Gauge Block Sets',
        name: 'Ceramic & Steel Master Gauge Blocks',
        tag: 'Length Comparison Standards',
        description: 'Ultra-flat wringing gauge blocks used for comparative mechanical calibration of micrometers, calipers, and height gauges.',
        specs: [
          { label: 'Grade', val: 'ISO 3650 Grade 0' },
          { label: 'Thermal Expansion', val: '9.3 × 10⁻⁶ / °C (Ceramic)' },
          { label: 'Sizes', val: '0.5 mm to 1,000 mm' },
        ],
        traceability: 'Interferometric Calibration Certificate',
      },
    ],
    categories: [
      { id: 'all', label: 'All Dimensions' },
      { id: 'blocks', label: 'Gauge Blocks & Length' },
      { id: 'hand', label: 'Calipers, Micrometers, Dials' },
      { id: 'form', label: 'Flatness, Angle, Form' },
    ],
    scope: [
      {
        id: 'd1',
        category: 'blocks',
        measurand: 'Gauge Blocks & Length Standards',
        range: '0.5 mm to 1,000 mm',
        condition: 'Monochromatic Interferometer & Comparator',
        cmc: '± (0.05 + 0.5L) µm',
        standardUsed: 'Renishaw Laser Interferometer + Grade 0 Blocks',
        method: 'Interferometry & mechanical comparison (ISO 3650)',
      },
      {
        id: 'd2',
        category: 'hand',
        measurand: 'External/Internal Micrometers, Calipers, Height Gauges',
        range: '0 to 1,000 mm',
        condition: 'Strict 20.0 °C Thermal Equilibrium',
        cmc: '± 1.2 µm to ± 8.0 µm',
        standardUsed: 'Master Gauge Blocks + Optical Flats',
        method: 'Step check and flatness evaluation (IS 2967 / ISO 13385)',
      },
      {
        id: 'd3',
        category: 'form',
        measurand: 'Surface Plates (Granite & Cast Iron)',
        range: 'Up to 3,000 mm × 2,000 mm',
        condition: 'Electronic Differential Levels / Autocollimator',
        cmc: '± 1.5 µm overall planarity',
        standardUsed: 'Wyler Precision Electronic Inclination Levels',
        method: 'Union Jack grid method as per IS 7327 / BS 817',
      },
    ],
    servicedEquipment: [
      { name: 'Vernier & Digital Calipers', sub: 'Depth, internal, external calipers up to 2,000 mm' },
      { name: 'Micrometers (Outside, Inside, Depth)', sub: 'Mechanical and digital micrometers' },
      { name: 'Dial Indicators & Bore Gauges', sub: 'Plunger and lever dial test indicators' },
      { name: 'Height Gauges & Profile Projectors', sub: 'Electronic height masters and optical comparators' },
      { name: 'Granite Surface Plates & Straightedges', sub: 'On-site computerized planarity & flatness mapping' },
    ],
    environmentalRigor: [
      'Continuous thermal soaking of client gauges for 24 hours prior to measurement',
      'Air temperature maintained strictly at 20.0 °C ± 0.2 °C with zero direct air draft',
      'Granite master calibration stations resting on isolated concrete pillars',
      'Interferometric air refraction index compensation using Edlén formula',
    ],
    traceability: {
      tier1: 'BIPM SI Meter Definition (Speed of Light c in Vacuum)',
      tier2: 'NPL India Iodine-Stabilized HeNe Laser Primary Standard',
      tier3: 'MSIR Master Renishaw XL-80 Laser Interferometer (NABL CC-2891)',
      tier4: 'Client Precision Gauge Blocks, CMMs, and Micrometers',
    },
    simulator: {
      title: 'Laser Optical Interference Fringe & Micron Grating Simulator',
      modes: [
        { id: 'laser', label: 'INTERFEROMETER FRINGES', unit: 'mm', baseVal: '25.00012', ppm: '±0.05 µm' },
        { id: 'flatness', label: 'OPTICAL FLAT INTERFERENCE', unit: 'Fringes', baseVal: '0.5 λ', ppm: '±0.02 µm' },
        { id: 'cmm', label: 'CMM TOUCH-PROBE VECTOR', unit: 'mm', baseVal: '100.0004', ppm: '±0.8 µm' },
      ],
      paramLabel: 'Nominal Dimension Length',
      paramDefault: 25,
      paramMin: 1,
      paramMax: 300,
      paramStep: 1,
      paramUnit: 'mm',
    },
    calculator: {
      baseFee: 1800,
      instruments: [
        { id: 'caliper', label: 'Vernier / Digital Caliper (0 - 300 mm)', multiplier: 1.0 },
        { id: 'micrometer', label: 'External Micrometer (0 - 25 mm)', multiplier: 1.1 },
        { id: 'gauge-box', label: 'Standard Gauge Block Set (83 Pieces)', multiplier: 3.5 },
        { id: 'surface-plate', label: 'Granite Surface Plate Planarity (On-Site)', multiplier: 2.8 },
      ],
    },
  },

  force: {
    id: 'force',
    slug: 'force',
    title: 'Force',
    facilityName: 'FORCE & LOAD CELL CALIBRATION FACILITY',
    subtitle: 'High-Capacity Tension & Compression Load Cell Proving',
    tagline: '5,000 kN HIGH-FORCE PROVING DIVISION // CHENNAI PRIMARY LAB',
    color: 'text-blue-400',
    accentHex: '#60A5FA',
    secondaryHex: '#FFC107',
    chamber: {
      temp: '23.0 °C ± 1.0 °C',
      humidity: '50.0 % RH ± 10%',
      cleanroom: 'Heavy Mechanical Force Testing Bay',
      special: 'Sub-Floor Reinforced Seismic Pit',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'FORCE RANGE', value: '10 N to 5,000 kN', sub: 'Tension & Compression' },
      { label: 'BEST UNCERTAINTY (CMC)', value: '± 0.01 % of applied force', sub: 'Class 00 / Class 0.5' },
      { label: 'HYDRAULIC CAPACITY', value: '500 Metric Tonnes', sub: 'Servo-Controlled' },
      { label: 'STANDARD COMPLIANCE', value: 'ISO 376 & ASTM E74', sub: 'Proving Instruments' },
    ],
    overview:
      'The MSIR INDIA Force Calibration Facility is equipped with deadweight force machines and high-tonnage servo-hydraulic calibration frames capable of testing tension and compression devices up to 5,000 kN (500 Tonnes). Operating under ISO 376 and ASTM E74, we calibrate crane scales, proving rings, load cells, universal testing machines, and aircraft weight platforms.',
    standards: [
      {
        id: 'hbm-class00',
        model: 'HBM Class 00 Precision Load Cells',
        name: 'Master Force Reference Transducers',
        tag: 'Primary Force Standards',
        description: 'Ultra-low creep, temperature-compensated foil strain gauge load cells with hermetic laser-welded stainless steel enclosures.',
        specs: [
          { label: 'Accuracy Class', val: 'ISO 376 Class 00' },
          { label: 'Capacities', val: '50 kN, 500 kN, 2,000 kN, 5,000 kN' },
          { label: 'Non-Linearity', val: '< 0.01 % F.S.' },
        ],
        traceability: 'NPL India Primary Deadweight Force Machine',
      },
    ],
    categories: [
      { id: 'all', label: 'All Force' },
      { id: 'compression', label: 'Compression Load Cells' },
      { id: 'tension', label: 'Tension & Dynamometers' },
      { id: 'utm', label: 'UTM Verification (On-Site)' },
    ],
    scope: [
      {
        id: 'f1',
        category: 'compression',
        measurand: 'Compression Load Cells & Proving Rings',
        range: '100 N to 5,000 kN',
        condition: 'Hydraulic Servo Frame with Class 00 Load Cell',
        cmc: '± 0.01 % to ± 0.05 %',
        standardUsed: 'HBM Master Reference Load Cells',
        method: 'Stepwise loading and unloading cycles (ISO 376)',
      },
      {
        id: 'f2',
        category: 'tension',
        measurand: 'Tension Links, Crane Scales & Dynamometers',
        range: '50 N to 1,000 kN',
        condition: 'Universal Tension Fixture',
        cmc: '± 0.03 % of reading',
        standardUsed: 'Calibrated Tension Reference Prover',
        method: 'Direct tension alignment test (ASTM E74)',
      },
    ],
    servicedEquipment: [
      { name: 'Tension & Compression Load Cells', sub: 'Canister, pancake, S-beam, button load cells' },
      { name: 'Crane Scales & Hanging Scales', sub: 'Overhead industrial wireless crane dynamometers' },
      { name: 'Universal Testing Machines (UTM)', sub: 'On-site force verification as per ISO 7500-1' },
      { name: 'Digital Push/Pull Force Gauges', sub: 'Handheld mechanical & digital force indicators' },
    ],
    environmentalRigor: [
      'High-rigidity self-reacting load frames eliminating bending and off-axis moments',
      'Digital multi-channel strain indicators with 24-bit delta-sigma ADCs',
      'Regulated hydraulic temperature to eliminate thermal oil expansion pulse',
      'Rotational loading cycles at 0°, 120°, and 240° to evaluate rotation effects',
    ],
    traceability: {
      tier1: 'BIPM SI Newton Definition (kg · m / s²)',
      tier2: 'NPL India 1 MN Primary Deadweight Force Machine',
      tier3: 'MSIR Master HBM Class 00 Force Transducers (NABL CC-2891)',
      tier4: 'Client Load Cells, UTM Machines, and Crane Dynamometers',
    },
    simulator: {
      title: 'Servo-Hydraulic Load Cell Compression Curve & Hysteresis Simulator',
      modes: [
        { id: 'compression', label: 'COMPRESSION FORCE RAMP', unit: 'kN', baseVal: '500.04', ppm: '±0.01%' },
        { id: 'hysteresis', label: 'HYSTERESIS LOOP', unit: '% F.S.', baseVal: '0.008', ppm: '±0.002%' },
      ],
      paramLabel: 'Target Force Load',
      paramDefault: 200,
      paramMin: 10,
      paramMax: 2000,
      paramStep: 50,
      paramUnit: 'kN',
    },
    calculator: {
      baseFee: 3000,
      instruments: [
        { id: 'push-pull', label: 'Push/Pull Force Gauge (up to 1,000 N)', multiplier: 1.0 },
        { id: 'load-cell', label: 'Precision Load Cell with Digital Indicator', multiplier: 1.6 },
        { id: 'crane-scale', label: 'Industrial Crane Scale (up to 50 Tonnes)', multiplier: 2.2 },
        { id: 'utm', label: 'On-Site Universal Testing Machine (UTM) Calibration', multiplier: 3.5 },
      ],
    },
  },

  torque: {
    id: 'torque',
    slug: 'torque',
    title: 'Torque',
    facilityName: 'TORQUE METROLOGY & WRENCH CALIBRATION FACILITY',
    subtitle: 'Precision Static & Dynamic Torque Tool Calibration',
    tagline: '5,000 Nm PRECISION TORSION METROLOGY // CHENNAI PRIMARY LAB',
    color: 'text-yellow-400',
    accentHex: '#FBBF24',
    secondaryHex: '#00F0FF',
    chamber: {
      temp: '23.0 °C ± 1.0 °C',
      humidity: '50.0 % RH ± 5%',
      cleanroom: 'Regulated Mechanical Tool Calibration Bay',
      special: 'Vibration Free Mounting Bed',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'TORQUE RANGE', value: '0.1 Nm to 5,000 Nm', sub: 'Clockwise & Counter-Clockwise' },
      { label: 'BEST UNCERTAINTY (CMC)', value: '± 0.2 % of reading', sub: 'Static & Dynamic' },
      { label: 'TOOL SUPPORT', value: 'Manual, Electric, Pneumatic', sub: 'Assembly & Testing' },
      { label: 'STANDARD', value: 'ISO 6789:2017', sub: 'Part 1 & Part 2 Conformance' },
    ],
    overview:
      'MSIR INDIA’s Torque Metrology Laboratory ensures assembly safety and joint integrity across automotive, aviation, and heavy engineering sectors. Utilizing automated torque wrench calibration benches, precision torque reaction transducers, and deadweight torque arms, we calibrate torque wrenches, screwdrivers, nutrunners, and rotary transducers in compliance with ISO 6789:2017.',
    standards: [
      {
        id: 'norbar-cal',
        model: 'Norbar / Sturtevant Automated Torque Rig',
        name: 'Master Torque Wrench Calibration Rig',
        tag: 'Primary Torque Standard',
        description: 'Motorized ball-screw loader ensuring constant angular velocity and eliminating operator-induced side forces during torque tool actuation.',
        specs: [
          { label: 'Range', val: '0.1 Nm to 5,000 Nm' },
          { label: 'Transducer Accuracy', val: '± 0.1 % of reading' },
          { label: 'Loading Speed', val: 'ISO 6789 compliant controlled rate' },
        ],
        traceability: 'NPL India Mass & Length Traceable',
      },
    ],
    categories: [
      { id: 'all', label: 'All Torque' },
      { id: 'wrenches', label: 'Torque Wrenches' },
      { id: 'screwdrivers', label: 'Torque Screwdrivers' },
      { id: 'dynamic', label: 'Rotary Transducers' },
    ],
    scope: [
      {
        id: 'tq1',
        category: 'wrenches',
        measurand: 'Click, Dial, and Digital Torque Wrenches',
        range: '0.5 Nm to 3,000 Nm',
        condition: 'ISO 6789 Motorized Rig (CW & CCW)',
        cmc: '± 0.25 % to ± 0.8 %',
        standardUsed: 'Norbar Master Torque Calibration System',
        method: 'Calibration and measurement of uncertainty as per ISO 6789-2:2017',
      },
      {
        id: 'tq2',
        category: 'screwdrivers',
        measurand: 'Torque Screwdrivers & Micro-Torque Tools',
        range: '0.05 Nm to 10 Nm',
        condition: 'Precision Reaction Transducer',
        cmc: '± 0.35 % of reading',
        standardUsed: 'Interface Low-Torque Flanged Transducer',
        method: 'Incremental static torque audit',
      },
    ],
    servicedEquipment: [
      { name: 'Adjustable Clicker Torque Wrenches', sub: 'Micrometer-setting mechanical click wrenches' },
      { name: 'Electronic Digital Torque Wrenches', sub: 'Digital angle and torque recording wrenches' },
      { name: 'Torque Screwdrivers & Preset Drivers', sub: 'Electronics assembly ESD-safe torque tools' },
      { name: 'Pneumatic & DC Nutrunners', sub: 'Production line assembly pulsed tools' },
    ],
    environmentalRigor: [
      'Motor-driven loading arm preventing jerky manual impulse and side-load errors',
      'Dual-direction calibration for both tightening and loosening directions',
      'Pre-loading cycle run 3 times to full scale to overcome mechanical hysteresis',
      'Strict 23 °C ambient control to maintain elasticity of internal springs',
    ],
    traceability: {
      tier1: 'BIPM SI Derived Unit (Newton-Meter = N · m)',
      tier2: 'NPL India Primary Deadweight Torque Machine',
      tier3: 'MSIR Master Norbar Rig & Flanged Transducers (NABL CC-2891)',
      tier4: 'Client Production Torque Wrenches and Calibration Testers',
    },
    simulator: {
      title: 'Torsion Angular Deflection & Breakaway Torque Simulator',
      modes: [
        { id: 'click', label: 'CLICK BREAKAWAY POINT', unit: 'Nm', baseVal: '120.14', ppm: '±0.25%' },
        { id: 'continuous', label: 'CONTINUOUS TORSION RAMP', unit: 'Nm', baseVal: '350.2', ppm: '±0.18%' },
      ],
      paramLabel: 'Target Torque Value',
      paramDefault: 100,
      paramMin: 5,
      paramMax: 1000,
      paramStep: 5,
      paramUnit: 'Nm',
    },
    calculator: {
      baseFee: 1500,
      instruments: [
        { id: 'wrench-small', label: 'Torque Wrench (up to 200 Nm)', multiplier: 1.0 },
        { id: 'wrench-large', label: 'Heavy Torque Wrench (200 - 1,500 Nm)', multiplier: 1.5 },
        { id: 'digital-torque', label: 'Digital Torque & Angle Wrench', multiplier: 1.8 },
        { id: 'transducer', label: 'Precision Dynamic Torque Transducer', multiplier: 2.2 },
      ],
    },
  },

  acceleration: {
    id: 'acceleration',
    slug: 'acceleration',
    title: 'Acceleration & Speed',
    facilityName: 'ACCELERATION, VIBRATION & SPEED FACILITY',
    subtitle: 'Vibration, Tachometer & Motion Dynamic Metrology',
    tagline: 'DYNAMIC VIBRATION & KINEMATIC METROLOGY // CHENNAI PRIMARY LAB',
    color: 'text-teal-400',
    accentHex: '#2DD4BF',
    secondaryHex: '#F59E0B',
    chamber: {
      temp: '23.0 °C ± 1.0 °C',
      humidity: '45.0 % RH ± 5%',
      cleanroom: 'Acoustic-Isolated Vibration Laboratory',
      special: 'Air-Bearing Seismic Levitation',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'VIBRATION FREQ', value: '0.1 Hz to 10 kHz', sub: 'Sub-Hz to High Frequency' },
      { label: 'ACCELERATION', value: '0.01 g to 100 g pk', sub: 'Air-Bearing Shaker' },
      { label: 'ROTATIONAL SPEED', value: '1 to 100,000 RPM', sub: 'Optical & Contact' },
      { label: 'STANDARD', value: 'ISO 16063-21', sub: 'Back-to-Back Comparison' },
    ],
    overview:
      'The MSIR INDIA Vibration and Kinematic Metrology Laboratory provides dynamic sensor validation for condition monitoring, automotive NVH, aerospace flutter testing, and industrial machinery maintenance. Featuring PCB Piezotronics air-bearing shaker tables, primary reference accelerometers, and quartz crystal stroboscopes, we calibrate accelerometers, velocity sensors, and tachometers.',
    standards: [
      {
        id: 'pcb-shaker',
        model: 'PCB Piezotronics 394C06',
        name: 'Air-Bearing Electrodynamic Shaker',
        tag: 'Primary Dynamic Vibration Standard',
        description: 'Eliminates cross-axis transverse motion and delivers pure sinusoidal excitation across a wide frequency spectrum.',
        specs: [
          { label: 'Frequency Range', val: '5 Hz to 10 kHz' },
          { label: 'Transverse Motion', val: '< 1 % cross-axis' },
          { label: 'Reference Sensor', val: 'Integrated quartz standard' },
        ],
        traceability: 'Laser Interferometric Traceable (ISO 16063-11)',
      },
    ],
    categories: [
      { id: 'all', label: 'All Vibration & Speed' },
      { id: 'accel', label: 'Accelerometers & Velocity' },
      { id: 'tacho', label: 'Tachometers & Stroboscopes' },
    ],
    scope: [
      {
        id: 'a1',
        category: 'accel',
        measurand: 'Piezoelectric & IEPE Accelerometers',
        range: '5 Hz to 10 kHz (Acceleration: 1 to 100 m/s²)',
        condition: 'Back-to-Back Shaker Excitation',
        cmc: '± 0.8 % of sensitivity',
        standardUsed: 'PCB Reference Accelerometer + Air Shaker',
        method: 'Back-to-back comparison calibration (ISO 16063-21)',
      },
      {
        id: 'a2',
        category: 'tacho',
        measurand: 'Optical, Contact & Laser Tachometers',
        range: '10 RPM to 100,000 RPM',
        condition: 'Digital Quartz Pulse Generator',
        cmc: '± 0.01 % of reading',
        standardUsed: 'Monarch Optical Tachometer Calibrator',
        method: 'Direct optical frequency pulse comparison',
      },
    ],
    servicedEquipment: [
      { name: 'Piezoelectric & IEPE Accelerometers', sub: 'Single-axis and triaxial vibration sensors' },
      { name: 'Velocity Transducers & 4-20mA Probes', sub: 'Industrial machinery protection vibration transmitters' },
      { name: 'Contact & Optical Tachometers', sub: 'Digital laser tachometers, surface speed wheels' },
      { name: 'Industrial Stroboscopes', sub: 'Xenon and high-intensity LED digital stroboscopes' },
    ],
    environmentalRigor: [
      'Seismic air-isolated table preventing outside traffic and ground vibrations from distorting readings',
      'Automated swept-sine FFT analysis measuring harmonic distortion of vibration signal',
      'High-purity compressed air supply for friction-free air-bearing shaker spindle',
      'Shielded low-noise coaxial cables with microphonic noise suppression',
    ],
    traceability: {
      tier1: 'BIPM SI Derived Acceleration (m/s²) and Frequency (Hz)',
      tier2: 'NPL India Primary Laser Interferometer Vibration Standard',
      tier3: 'MSIR Master PCB Air Shaker & Reference Accelerometer (NABL CC-2891)',
      tier4: 'Client Accelerometers, Vibration Meters, and Optical Tachometers',
    },
    simulator: {
      title: 'Dynamic Sinusoidal Vibration & Resonant Peak Simulator',
      modes: [
        { id: 'sine', label: '100 Hz SINE VIBRATION', unit: 'm/s²', baseVal: '9.806', ppm: '±0.6%' },
        { id: 'sweep', label: 'RESONANCE FREQ SWEEP', unit: 'g pk', baseVal: '5.01', ppm: '±0.8%' },
        { id: 'tacho', label: 'RPM TACHOMETER PULSE', unit: 'RPM', baseVal: '6000.1', ppm: '±0.02%' },
      ],
      paramLabel: 'Vibration Excitation Frequency',
      paramDefault: 100,
      paramMin: 10,
      paramMax: 2000,
      paramStep: 10,
      paramUnit: 'Hz',
    },
    calculator: {
      baseFee: 2200,
      instruments: [
        { id: 'tachometer', label: 'Digital Optical / Contact Tachometer', multiplier: 1.0 },
        { id: 'accel-single', label: 'Single-Axis IEPE Accelerometer (10 Freq Points)', multiplier: 1.3 },
        { id: 'accel-triax', label: 'Triaxial Accelerometer (X, Y, Z channels)', multiplier: 2.4 },
        { id: 'vib-meter', label: 'Vibration Meter with Cable & Sensor Kit', multiplier: 1.8 },
      ],
    },
  },

  sound: {
    id: 'sound',
    slug: 'sound',
    title: 'Sound',
    facilityName: 'ACOUSTIC & SOUND LEVEL METROLOGY FACILITY',
    subtitle: 'Anechoic Acoustic & Sound Level Meter Metrology',
    tagline: 'CLASS-1 ACOUSTIC METROLOGY DIVISION // CHENNAI PRIMARY LAB',
    color: 'text-indigo-400',
    accentHex: '#818CF8',
    secondaryHex: '#10B981',
    chamber: {
      temp: '23.0 °C ± 1.0 °C',
      humidity: '50.0 % RH ± 5%',
      cleanroom: 'Acoustic Anechoic Chamber',
      special: 'Ambient Noise Floor < 18 dBA',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'SOUND LEVEL RANGE', value: '30 dB to 160 dB', sub: 'SPL (Sound Pressure Level)' },
      { label: 'FREQUENCY RANGE', value: '20 Hz to 20 kHz', sub: 'Full Audio Spectrum' },
      { label: 'METER CLASS', value: 'Class 0, 1 & 2', sub: 'IEC 61672-1 Compliant' },
      { label: 'ACOUSTIC CMC', value: '± 0.15 dB', sub: 'Precision Pistonphone' },
    ],
    overview:
      'The MSIR INDIA Acoustic Metrology Facility provides NABL-accredited sound and noise instrumentation calibration in compliance with IEC 61672 and IEC 60942. Utilizing Brüel & Kjær pistonphones, multifrequency acoustic calibrators, and an ultra-low-noise anechoic chamber with wedge absorption, we calibrate sound level meters, noise dosimeters, and measurement microphones.',
    standards: [
      {
        id: 'bk-4228',
        model: 'Brüel & Kjær Type 4228 Pistonphone',
        name: 'Precision Acoustic Pistonphone Standard',
        tag: 'Primary Acoustic Standard',
        description: 'Generates an exact 124.0 dB SPL tone at 250 Hz based on precision piston displacement and barometer ambient air pressure correction.',
        specs: [
          { label: 'Sound Pressure Level', val: '124.0 dB ± 0.09 dB' },
          { label: 'Frequency', val: '250 Hz ± 1 %' },
          { label: 'Harmonic Distortion', val: '< 1.5 %' },
        ],
        traceability: 'DPLA / NPL Direct Acoustic Traceability',
      },
    ],
    categories: [
      { id: 'all', label: 'All Acoustic' },
      { id: 'slm', label: 'Sound Level Meters' },
      { id: 'calibrators', label: 'Acoustic Calibrators' },
      { id: 'microphones', label: 'Microphones & Dosimeters' },
    ],
    scope: [
      {
        id: 's1',
        category: 'slm',
        measurand: 'Sound Level Meters (Class 1 & Class 2)',
        range: '30 dB to 140 dB (Frequency: 31.5 Hz to 16 kHz)',
        condition: 'A, C, Z Frequency Weighting & Fast/Slow Time Weighting',
        cmc: '± 0.20 dB',
        standardUsed: 'B&K Multi-Frequency Sound Calibrator + Audio Signal Gen',
        method: 'Acoustic & electrical testing as per IEC 61672-3:2013',
      },
      {
        id: 's2',
        category: 'calibrators',
        measurand: 'Acoustic Calibrators & Pistonphones',
        range: '94 dB, 104 dB, 114 dB, 124 dB',
        condition: 'Coupler Cavity with Barometric Correction',
        cmc: '± 0.12 dB',
        standardUsed: 'Brüel & Kjær Type 4228 Pistonphone + Digital Barometer',
        method: 'Sound calibrator performance verification (IEC 60942:2018)',
      },
    ],
    servicedEquipment: [
      { name: 'Class 1 & 2 Sound Level Meters', sub: 'Brüel & Kjær, Rion, Testo, Casella, Cirrus SLMs' },
      { name: 'Personal Noise Dosimeters', sub: 'Occupational health & industrial hygiene noise badges' },
      { name: 'Acoustic Sound Calibrators', sub: '94 dB / 114 dB portable verification calibrators' },
      { name: 'Condenser Measurement Microphones', sub: '1/2 inch and 1/4 inch free-field & pressure mics' },
    ],
    environmentalRigor: [
      'Full floating-room anechoic chamber isolated from building structural acoustics',
      'Real-time barometric pressure compensation applied to acoustic pistonphone output',
      'A, C, and Z weighting curve filter response measured point-by-point across 20 Hz - 20 kHz',
      'Ultra-low electrical noise amplifiers preventing 50 Hz hum injection into microphone signals',
    ],
    traceability: {
      tier1: 'BIPM SI Pressure (Pascal) and Frequency (Hertz)',
      tier2: 'NPL India Acoustic Metrology Primary Laboratory',
      tier3: 'MSIR Master B&K Pistonphone & Condenser Microphones (NABL CC-2891)',
      tier4: 'Client Sound Level Meters, Noise Dosimeters, and Microphones',
    },
    simulator: {
      title: 'Anechoic Acoustic Wave & 1/3 Octave Band Spectrum Simulator',
      modes: [
        { id: '1khz', label: '1 kHz 94 dB CALIBRATION TONE', unit: 'dB SPL', baseVal: '94.02', ppm: '±0.12 dB' },
        { id: 'octave', label: '1/3 OCTAVE SPECTRUM', unit: 'dBA', baseVal: '72.4', ppm: '±0.25 dBA' },
      ],
      paramLabel: 'Sound Level Output',
      paramDefault: 94,
      paramMin: 30,
      paramMax: 140,
      paramStep: 1,
      paramUnit: 'dB',
    },
    calculator: {
      baseFee: 2500,
      instruments: [
        { id: 'slm', label: 'Sound Level Meter (Class 2) Complete Test', multiplier: 1.0 },
        { id: 'slm-class1', label: 'Precision Class 1 Sound Level Meter with Octave', multiplier: 1.5 },
        { id: 'sound-cal', label: 'Sound Calibrator (94 dB / 114 dB)', multiplier: 0.9 },
        { id: 'dosimeter', label: 'Personal Noise Dosimeter', multiplier: 1.1 },
      ],
    },
  },

  lux: {
    id: 'lux',
    slug: 'lux',
    title: 'Lux',
    facilityName: 'PHOTOMETRY, RADIOMETRY & LUX FACILITY',
    subtitle: 'Illuminance, Luminance & Optical Metrology',
    tagline: 'PHOTOMETRIC & RADIOMETRIC METROLOGY // CHENNAI PRIMARY LAB',
    color: 'text-amber-300',
    accentHex: '#FBBF24',
    secondaryHex: '#00F0FF',
    chamber: {
      temp: '25.0 °C ± 1.0 °C (CIE Baseline)',
      humidity: '45.0 % RH ± 5%',
      cleanroom: 'Zero-Reflection Light-Tight Darkroom',
      special: 'Ambient Stray Light < 0.01 Lux',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'ILLUMINANCE RANGE', value: '0.1 Lux to 150,000 Lux', sub: 'Sub-Lux to Direct Sun' },
      { label: 'WAVELENGTH', value: '380 nm to 780 nm', sub: 'CIE V(λ) Curve' },
      { label: 'BEST UNCERTAINTY (CMC)', value: '± 1.2 % of reading', sub: 'Luminous Intensity' },
      { label: 'BENCH LENGTH', value: '3-Meter Optical Bench', sub: 'Inverse-Square Law' },
    ],
    overview:
      'The MSIR INDIA Photometry and Radiometry Laboratory is housed within a custom-built light-tight darkroom coated with ultra-matte optical black paint (absorptivity > 99.2%). Using NIST-traceable tungsten-halogen luminous intensity standard lamps (CIE Illuminant A at 2856 K) and high-accuracy photometric detectors, we calibrate lux meters, luminance meters, and UV radiometers.',
    standards: [
      {
        id: 'cie-lamp',
        model: 'NIST Traceable Luminous Intensity Standard Lamp',
        name: 'FEL 1,000W Tungsten-Halogen Standard Lamp',
        tag: 'Primary Photometric Source',
        description: 'Operated at a precise constant direct current to reproduce the CIE Illuminant A standard distribution temperature of 2856 K.',
        specs: [
          { label: 'Color Temp', val: '2856 K ± 15 K' },
          { label: 'Current Stability', val: '< 0.01 % regulated DC' },
          { label: 'Uncertainty', val: '± 0.8 % Luminous Intensity' },
        ],
        traceability: 'NIST / NPL Direct Luminous Intensity Standard',
      },
    ],
    categories: [
      { id: 'all', label: 'All Optical' },
      { id: 'lux', label: 'Lux Meters' },
      { id: 'luminance', label: 'Luminance & Display' },
      { id: 'uv', label: 'UV Radiometers' },
    ],
    scope: [
      {
        id: 'l1',
        category: 'lux',
        measurand: 'Digital Lux Meters & Light Meters',
        range: '0.1 Lux to 150,000 Lux',
        condition: 'CIE Standard Illuminant A on Optical Bench',
        cmc: '± 1.2 % to ± 2.5 % of reading',
        standardUsed: 'Standard Lamp + 3-Meter Optical Track',
        method: 'Inverse-square distance law metrology (CIE Publication 69)',
      },
      {
        id: 'l2',
        category: 'uv',
        measurand: 'UV Radiometers (UVA, UVB, UVC)',
        range: '1 µW/cm² to 50 mW/cm²',
        condition: 'Narrowband UV Source (365 nm / 254 nm)',
        cmc: '± 2.8 % of reading',
        standardUsed: 'Calibrated Silicon UV Transfer Photodiode',
        method: 'Spectral irradiance comparison',
      },
    ],
    servicedEquipment: [
      { name: 'Digital Lux & Foot-Candle Meters', sub: 'Handheld & benchtop environmental light meters' },
      { name: 'Luminance Meters (Nit / cd/m²)', sub: 'Display panel and emergency exit sign meters' },
      { name: 'UV Light Meters & Radiometers', sub: 'NDT magnetic particle inspection & UV curing meters' },
      { name: 'LED Color & Spectrum Analyzers', sub: 'CCT, CRI, and illuminance spectrophotometers' },
    ],
    environmentalRigor: [
      'Black velvet light baffles eliminating secondary scattered reflection off optical rails',
      'Ultra-stable 4-quadrant constant current power supply driving standard lamp (< 10 ppm ripple)',
      'Detector spectral matching response f1’ < 3.0% adhering to CIE photopic curve',
      'Constant ambient temperature 25.0 °C to prevent thermal sensitivity drift in photodiode heads',
    ],
    traceability: {
      tier1: 'BIPM SI Base Unit Candela (cd)',
      tier2: 'NPL India Photometry & Radiometry Standards',
      tier3: 'MSIR Master Standard Lamps & Optical Bench (NABL CC-2891)',
      tier4: 'Client Lux Meters, UV Radiometers, and Photometers',
    },
    simulator: {
      title: 'Photometric Inverse-Square & CIE Spectral Response Simulator',
      modes: [
        { id: 'inverse', label: 'INVERSE-SQUARE LAW', unit: 'Lux', baseVal: '500.2', ppm: '±1.2%' },
        { id: 'uv', label: 'UV-A IRRADIANCE (365 nm)', unit: 'µW/cm²', baseVal: '1250.0', ppm: '±2.5%' },
      ],
      paramLabel: 'Lamp Distance on Bench',
      paramDefault: 1.5,
      paramMin: 0.5,
      paramMax: 3.0,
      paramStep: 0.1,
      paramUnit: 'm',
    },
    calculator: {
      baseFee: 1600,
      instruments: [
        { id: 'lux-meter', label: 'Digital Lux Meter (5 Test Points)', multiplier: 1.0 },
        { id: 'uv-meter', label: 'UV Radiometer (UVA 365 nm)', multiplier: 1.4 },
        { id: 'luminance', label: 'Luminance / Spot Photometer', multiplier: 1.6 },
        { id: 'light-booth', label: 'Color Assessment Light Booth (On-Site)', multiplier: 2.2 },
      ],
    },
  },

  flow: {
    id: 'flow',
    slug: 'flow',
    title: 'Fluid Flow',
    facilityName: 'FLUID FLOW METROLOGY & PROVING RIG FACILITY',
    subtitle: 'Hydraulic & Pneumatic Gas/Liquid Flow Meter Proving',
    tagline: 'GRAVIMETRIC FLOW METROLOGY DIVISION // CHENNAI PRIMARY LAB',
    color: 'text-sky-400',
    accentHex: '#38BDF8',
    secondaryHex: '#10B981',
    chamber: {
      temp: '23.0 °C ± 2.0 °C',
      humidity: '55.0 % RH ± 10%',
      cleanroom: 'Recirculating Hydraulic Test Loop',
      special: 'Pulsation Damped De-Aerated Water Flow',
      nablCert: 'NABL CC-2891',
    },
    stats: [
      { label: 'LIQUID FLOW RATE', value: '0.01 to 250 m³/h', sub: 'Closed Water Loop' },
      { label: 'GAS FLOW RATE', value: '0.001 to 100 Nm³/h', sub: 'Sonic Critical Nozzles' },
      { label: 'PROVER ACCURACY', value: '± 0.15 % (Liquid)', sub: 'Primary Gravimetric' },
      { label: 'PIPE DIAMETERS', value: 'DN15 to DN200', sub: 'Flanged & Wafer' },
    ],
    overview:
      'MSIR INDIA’s Flow Metrology Laboratory features high-accuracy gravimetric water flow calibration rigs and sonic critical flow Venturi nozzle banks for gas meters. Employing the flying-start-flying-finish gravimetric method with high-speed diverters and master Coriolis mass flowmeters, we calibrate electromagnetic, Coriolis, turbine, ultrasonic, and vortex flowmeters.',
    standards: [
      {
        id: 'gravimetric-rig',
        model: 'Flying-Start Gravimetric Proving Rig',
        name: 'Primary Flying-Start Weighing Tank Rig',
        tag: 'Primary Liquid Flow Standard',
        description: 'High-speed pneumatic diverter with microsecond optical timer synchronization and high-precision load cell weighing tanks.',
        specs: [
          { label: 'Flow Range', val: '0.05 to 250 m³/h' },
          { label: 'Weighing Accuracy', val: '± 0.02 % of mass' },
          { label: 'Diverter Timing', val: '< 1 ms transition uncertainty' },
        ],
        traceability: 'Mass & Time Traceable to NPL India',
      },
      {
        id: 'coriolis-master',
        model: 'Micro Motion Elite Coriolis Master Bank',
        name: 'Dual-Tube Master Coriolis Mass Flowmeters',
        tag: 'Secondary Transfer Standard',
        description: 'Direct mass flow measurement independent of fluid viscosity, density, and velocity profile distortions.',
        specs: [
          { label: 'Mass Flow Accuracy', val: '± 0.05 % of rate' },
          { label: 'Density Accuracy', val: '± 0.0002 g/cm³' },
        ],
        traceability: 'NABL Accredited Calibration',
      },
    ],
    categories: [
      { id: 'all', label: 'All Flow' },
      { id: 'liquid', label: 'Liquid Flow (Water)' },
      { id: 'gas', label: 'Gas & Air Flow' },
      { id: 'rotameters', label: 'Rotameters & Sight Meters' },
    ],
    scope: [
      {
        id: 'fl1',
        category: 'liquid',
        measurand: 'Electromagnetic, Coriolis & Turbine Flowmeters',
        range: '0.1 m³/h to 250 m³/h (DN15 to DN200)',
        condition: 'Water at Ambient Temperature',
        cmc: '± 0.15 % of reading',
        standardUsed: 'Gravimetric Weighing Tank Rig + Diverter',
        method: 'Flying start-stop gravimetric method (ISO 4185)',
      },
      {
        id: 'fl2',
        category: 'gas',
        measurand: 'Thermal Mass Flow Meters & Gas Rotameters',
        range: '0.005 Nm³/h to 80 Nm³/h',
        condition: 'Dry Compressed Air / Nitrogen',
        cmc: '± 0.25 % of reading',
        standardUsed: 'Sonic Venturi Nozzle Master Bank',
        method: 'Critical flow Venturi nozzle proving (ISO 9300)',
      },
    ],
    servicedEquipment: [
      { name: 'Electromagnetic Flowmeters', sub: 'Flanged and wafer magnetic flowmeters' },
      { name: 'Coriolis Mass Flowmeters', sub: 'High-accuracy liquid mass and density transmitters' },
      { name: 'Turbine & Ultrasonic Flowmeters', sub: 'In-line and clamp-on acoustic transit time meters' },
      { name: 'Rotameters (Variable Area)', sub: 'Glass and metal tube rotameters with needle valves' },
    ],
    environmentalRigor: [
      'De-aeration expansion tanks removing micro-bubbles and entrained air from the water loop',
      'Straight pipe runs with flow conditioners exceeding 15 diameters upstream and 5 diameters downstream',
      'Continuous fluid density and temperature monitoring throughout the calibration duration',
      'Optical switch timing eliminates diverter actuating asymmetric error',
    ],
    traceability: {
      tier1: 'BIPM SI Units Mass (kg), Time (s), and Volume (m³)',
      tier2: 'NPL India Mass & Volume Standards',
      tier3: 'MSIR Primary Gravimetric Rig & Coriolis Master Standards (NABL CC-2891)',
      tier4: 'Client Industrial Water, Fuel, Chemical, and Gas Flowmeters',
    },
    simulator: {
      title: 'Gravimetric Flow Rig Fluid Velocity & Coriolis Phase Simulator',
      modes: [
        { id: 'flow', label: 'WATER FLOW DISPENSE', unit: 'm³/h', baseVal: '45.12', ppm: '±0.15%' },
        { id: 'density', label: 'CORIOLIS DENSITY', unit: 'g/cm³', baseVal: '0.9982', ppm: '±0.0002' },
      ],
      paramLabel: 'Target Flow Rate',
      paramDefault: 50,
      paramMin: 1,
      paramMax: 200,
      paramStep: 5,
      paramUnit: 'm³/h',
    },
    calculator: {
      baseFee: 3200,
      instruments: [
        { id: 'rotameter', label: 'Variable Area Rotameter (Water/Air)', multiplier: 1.0 },
        { id: 'mag-meter', label: 'Electromagnetic Flowmeter (DN25 - DN50)', multiplier: 1.5 },
        { id: 'coriolis', label: 'Coriolis Mass Flowmeter (High Precision)', multiplier: 2.2 },
        { id: 'ultrasonic', label: 'Clamp-On Ultrasonic Meter Verification', multiplier: 1.8 },
      ],
    },
  },
};
