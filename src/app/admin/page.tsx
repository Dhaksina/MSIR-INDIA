'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstrumentContext, Equipment } from '@/context/InstrumentContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import {
  ShieldAlert,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  Sliders,
  Cpu,
  Gauge,
  Activity,
  Zap,
  Thermometer,
  Scale,
  Sparkles,
  Scan,
  Radio,
  Waves,
  X,
  Save,
  Layers,
  Database,
  Award,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  UserCheck,
  Mail
} from 'lucide-react';

export default function AdminPage() {
  const { equipmentList, addEquipment, updateEquipment, deleteEquipment, resetToDefault } = useInstrumentContext();
  const { user, loading: authLoading, signInWithGoogle, loginWithEmail, logout } = useAuth();

  // Authentication state
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [legacyAuth, setLegacyAuth] = useState<boolean>(false);

  // Check session storage on mount for legacy fallback
  useEffect(() => {
    try {
      const sessionAuth = sessionStorage.getItem('msir_admin_auth');
      if (sessionAuth === 'true') {
        setLegacyAuth(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const isAuthenticated = !!user || legacyAuth;

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await loginWithEmail(emailInput, passwordInput);
    } catch (err: any) {
      if (passwordInput.trim() === 'msir@123') {
        setLegacyAuth(true);
        try {
          sessionStorage.setItem('msir_admin_auth', 'true');
        } catch (e) {}
      } else {
        setAuthError(err?.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Google Sign-In failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setLegacyAuth(false);
    try {
      sessionStorage.removeItem('msir_admin_auth');
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  const [activeTab, setActiveTab] = useState<'INSTRUMENTS' | 'BOOKINGS'>('INSTRUMENTS');
  const [contactsList, setContactsList] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContactsList(docs);
      }, (err) => {
        onSnapshot(collection(db, 'customers'), (snapshot) => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setContactsList(docs);
        });
      });
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const initialFormState: Omit<Equipment, 'id'> = {
    name: '',
    category: 'ELECTRO-TECHNICAL',
    brand: '',
    accuracy: '± 0.001 %',
    precisionRating: 99.99,
    range: '0 - 1000 Units',
    resolution: '0.001',
    standard: 'NIST & NPL Traceable Master Standard',
    traceability: 'ISO/IEC 17025 Certified',
    features: ['Real-time waveform inspection', 'Automated drift compensation'],
    colorTheme: {
      border: 'border-amber-500/40 hover:border-amber-400',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    iconName: 'Cpu'
  };

  const [formData, setFormData] = useState<Omit<Equipment, 'id'>>(initialFormState);
  const [featuresText, setFeaturesText] = useState('');

  // Filtered Equipment List
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.standard.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [equipmentList, searchQuery, selectedCategoryFilter]);

  // Open Create Modal
  const handleOpenAddModal = () => {
    setFormData(initialFormState);
    setFeaturesText(initialFormState.features.join('\n'));
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: Equipment) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand,
      accuracy: item.accuracy,
      precisionRating: item.precisionRating,
      range: item.range,
      resolution: item.resolution,
      standard: item.standard,
      traceability: item.traceability,
      features: item.features,
      colorTheme: item.colorTheme,
      iconName: item.iconName
    });
    setFeaturesText(item.features.join('\n'));
  };

  // Handle Create Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const splitFeatures = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    addEquipment({
      ...formData,
      features: splitFeatures.length > 0 ? splitFeatures : ['Primary Metrology Standard']
    });
    setIsAddModalOpen(false);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const splitFeatures = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    updateEquipment(editingItem.id, {
      ...formData,
      features: splitFeatures.length > 0 ? splitFeatures : editingItem.features
    });
    setEditingItem(null);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteEquipment(deletingId);
      setDeletingId(null);
    }
  };

  // Color Theme Presets
  const themePresets = [
    { label: 'Amber Gold', value: 'amber', border: 'border-amber-500/40 hover:border-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { label: 'Cyan Electric', value: 'cyan', border: 'border-cyan-500/40 hover:border-cyan-400', text: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_25px_rgba(6,182,212,0.2)]', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { label: 'Emerald Neon', value: 'emerald', border: 'border-emerald-500/40 hover:border-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { label: 'Violet Laser', value: 'purple', border: 'border-purple-500/40 hover:border-purple-400', text: 'text-purple-400', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.2)]', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { label: 'Rose Thermal', value: 'rose', border: 'border-rose-500/40 hover:border-rose-400', text: 'text-rose-400', bg: 'bg-rose-500/10', glow: 'shadow-[0_0_25px_rgba(244,63,94,0.2)]', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  ];

  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className={className} />;
      case 'Gauge': return <Gauge className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Thermometer': return <Thermometer className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Scan': return <Scan className={className} />;
      case 'Radio': return <Radio className={className} />;
      case 'Waves': return <Waves className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  // =========================================================================
  // UNAUTHENTICATED LOCK SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-950 text-white selection:bg-amber-500/30 selection:text-amber-400 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Background Laser Grid */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-dark-950 to-dark-950 pointer-events-none" />
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md rounded-3xl bg-dark-900/90 border border-amber-500/30 p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,193,7,0.15)] z-10 space-y-6 text-center"
        >
          {/* Header Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-dark-950 border border-amber-500/50 flex items-center justify-center shadow-[0_0_25px_rgba(255,193,7,0.3)]">
            <Lock className="w-10 h-10 text-amber-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> RESTRICTED ACCESS AREA
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white">
              ADMINISTRATOR <span className="text-amber-400 text-amber-glow">LOCK</span>
            </h2>
            <p className="text-neutral-400 text-xs font-mono">
              Enter security access password to manage MSIR INDIA calibration instruments.
            </p>
          </div>

          {/* Firebase Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-dark-950 font-bold text-xs font-mono transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            SIGN IN WITH GOOGLE (FIREBASE)
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-neutral-800 w-full" />
            <span className="bg-dark-900 px-3 text-[10px] font-mono text-neutral-500 shrink-0">OR EMAIL / ADMIN AUTH</span>
            <div className="border-t border-neutral-800 w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuthSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                EMAIL ADDRESS:
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@msirindia.com"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 focus:border-amber-400 text-xs font-mono text-white focus:outline-none transition-all mb-3"
              />

              <label className="text-xs font-mono text-neutral-400 block mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                SECURITY PASSWORD:
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter Password..."
                  className={`w-full pl-4 pr-10 py-3 rounded-xl bg-dark-950 border ${
                    authError ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-amber-400'
                  } text-sm font-mono text-white focus:outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono text-rose-400 mt-2 flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  {authError}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs font-mono transition-all shadow-[0_0_25px_rgba(255,193,7,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              AUTHENTICATE & UNLOCK ACCESS
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
            <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Return to Main Site
            </Link>
            <span>ISO 17025 METROLOGY</span>
          </div>

        </motion.div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-amber-500/30 selection:text-amber-400 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Background Laser Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-dark-950 to-dark-950 pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Top Header & System HUD Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-dark-900/90 border border-neutral-800 backdrop-blur-2xl shadow-2xl">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <Database className="w-3.5 h-3.5 animate-pulse" />
              MSIR INDIA METROLOGY ADMIN CONTROL CENTER
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
              INSTRUMENT <span className="text-amber-400 text-amber-glow">MANAGEMENT PANEL</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Add, update, or delete master reference instruments. Changes dynamically sync live across the landing page marquee.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(255,193,7,0.3)] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> ADD NEW INSTRUMENT
            </button>

            <button
              onClick={resetToDefault}
              className="px-3.5 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-amber-400 text-xs font-mono transition-all flex items-center gap-1.5"
              title="Reset Database to Default Master Standards"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RESET DEFAULTS
            </button>

            <Link
              href="/#equipment"
              className="px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-xs font-mono transition-all flex items-center gap-2"
            >
              LIVE SITE <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {user && (
              <div className="px-3 py-2 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.email || user.displayName || 'Authenticated User'}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-xs font-mono transition-all flex items-center gap-1.5"
              title="Log out of Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" /> LOG OUT
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <button
            onClick={() => setActiveTab('INSTRUMENTS')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'INSTRUMENTS'
                ? 'bg-amber-500 text-dark-950 shadow-[0_0_20px_rgba(255,193,7,0.3)]'
                : 'bg-dark-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" /> MASTER INSTRUMENTS ({equipmentList.length})
          </button>

          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'BOOKINGS'
                ? 'bg-amber-500 text-dark-950 shadow-[0_0_20px_rgba(255,193,7,0.3)]'
                : 'bg-dark-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" /> FIRESTORE BOOKINGS ({contactsList.length})
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-dark-900/80 border border-neutral-800 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Instruments</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{equipmentList.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/80 border border-neutral-800 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Firestore Bookings</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{contactsList.length} Requests</span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/80 border border-neutral-800 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Accreditation</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">100% ISO 17025</span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/80 border border-neutral-800 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Disciplines</span>
            <span className="text-2xl font-bold font-mono text-purple-400">5 Domains</span>
          </div>
        </div>

        {activeTab === 'BOOKINGS' ? (
          /* FIRESTORE BOOKINGS TABLE */
          <div className="rounded-2xl bg-dark-900 border border-amber-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">FIRESTORE CUSTOMER BOOKINGS</h3>
                <p className="text-xs font-mono text-neutral-400">Real-time submissions stored in Firestore 'customers' collection</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                ● LIVE SYNC
              </span>
            </div>

            {contactsList.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs font-mono">
                No booking requests saved in Firestore yet. Submit a booking from the website to test!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase">
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Discipline & Instrument</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Logistics</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {contactsList.map((item) => (
                      <tr key={item.id} className="hover:bg-dark-950/60 transition-colors">
                        <td className="p-3 text-amber-400 font-bold">{item.bookingRef || item.id}</td>
                        <td className="p-3 text-white">{item.companyName || 'N/A'}</td>
                        <td className="p-3 text-neutral-300">
                          <div>{item.contactName}</div>
                          <div className="text-[10px] text-neutral-500">{item.phone} | {item.email}</div>
                        </td>
                        <td className="p-3 text-neutral-300">
                          <div className="text-amber-400 font-bold">{item.discipline}</div>
                          <div className="text-neutral-400">{item.instrumentName}</div>
                        </td>
                        <td className="p-3 text-cyan-400">{item.quantity}</td>
                        <td className="p-3 text-neutral-400">{item.pickupType}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                            {item.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* INSTRUMENTS VIEW */
          <>

        {/* Search & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900/90 border border-neutral-800">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search instrument name, brand, or standard..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400 placeholder:text-neutral-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-neutral-300 focus:outline-none focus:border-amber-400"
            >
              <option value="ALL">ALL CATEGORIES ({equipmentList.length})</option>
              <option value="ELECTRO-TECHNICAL">ELECTRO-TECHNICAL</option>
              <option value="THERMAL">THERMAL</option>
              <option value="PRESSURE & VACUUM">PRESSURE & VACUUM</option>
              <option value="DIMENSIONAL & LASER">DIMENSIONAL & LASER</option>
              <option value="MASS & FLOW">MASS & FLOW</option>
            </select>
          </div>

        </div>

        {/* Instruments CRUD Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl bg-dark-900/90 border ${item.colorTheme.border} p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group shadow-xl`}
            >
              <div>
                
                {/* Header Category & Action Buttons */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${item.colorTheme.badge} uppercase font-bold`}>
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1.5 z-10">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg bg-dark-950 border border-neutral-800 hover:border-amber-400 text-neutral-400 hover:text-amber-400 transition-all"
                      title="Edit Instrument"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 rounded-lg bg-dark-950 border border-neutral-800 hover:border-rose-400 text-neutral-400 hover:text-rose-400 transition-all"
                      title="Delete Instrument"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Brand */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${item.colorTheme.bg} border ${item.colorTheme.border} shrink-0`}>
                    {renderIcon(item.iconName, `w-6 h-6 ${item.colorTheme.text}`)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-white line-clamp-2">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mt-0.5">
                      BRAND: {item.brand}
                    </span>
                  </div>
                </div>

                {/* Specs Box */}
                <div className="p-3 rounded-xl bg-dark-950 border border-neutral-800/80 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">ACCURACY</span>
                    <span className={`font-bold ${item.colorTheme.text}`}>{item.accuracy}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 border-t border-neutral-800/60 pt-2">
                    <div>
                      <span className="text-[9px] text-neutral-500 block">RANGE</span>
                      <span className="text-neutral-300 truncate block">{item.range}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">RESOLUTION</span>
                      <span className="text-amber-400 truncate block">{item.resolution}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-neutral-400 line-clamp-1 mb-4">
                  STANDARD: {item.standard}
                </p>

              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ACCREDITED
                </span>
                <span className="text-[10px] text-neutral-500">ID: {item.id}</span>
              </div>

            </motion.div>
          ))}
        </div>
        </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* CREATE & EDIT INSTRUMENT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {(isAddModalOpen || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-dark-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl z-10 scrollbar-thin"
            >
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
                className="absolute top-5 right-5 p-2 rounded-xl bg-dark-950 border border-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {editingItem ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {editingItem ? 'EDIT INSTRUMENT SPECS' : 'CREATE NEW MASTER INSTRUMENT'}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    {editingItem ? `Updating record: ${editingItem.id}` : 'Fill in metrological specifications'}
                  </p>
                </div>
              </div>

              <form onSubmit={editingItem ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Instrument Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Fluke 5730A High Precision Calibrator"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Category Domain</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="ELECTRO-TECHNICAL">ELECTRO-TECHNICAL</option>
                      <option value="THERMAL">THERMAL</option>
                      <option value="PRESSURE & VACUUM">PRESSURE & VACUUM</option>
                      <option value="DIMENSIONAL & LASER">DIMENSIONAL & LASER</option>
                      <option value="MASS & FLOW">MASS & FLOW</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Brand Manufacturer</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. FLUKE CALIBRATION"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Accuracy Standard</label>
                    <input
                      type="text"
                      required
                      value={formData.accuracy}
                      onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                      placeholder="e.g. ± 0.00015 %"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Precision Meter (%)</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData.precisionRating}
                      onChange={(e) => setFormData({ ...formData, precisionRating: parseFloat(e.target.value) || 99.9 })}
                      placeholder="99.999"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Resolution</label>
                    <input
                      type="text"
                      required
                      value={formData.resolution}
                      onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                      placeholder="e.g. 8.5 Digits"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Measurement Range</label>
                    <input
                      type="text"
                      required
                      value={formData.range}
                      onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                      placeholder="e.g. 0 to 1100 V DC/AC"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Reference Standard</label>
                    <input
                      type="text"
                      required
                      value={formData.standard}
                      onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                      placeholder="e.g. NIST & NPL Master Standard"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Traceability Certificate Info</label>
                  <input
                    type="text"
                    required
                    value={formData.traceability}
                    onChange={(e) => setFormData({ ...formData, traceability: e.target.value })}
                    placeholder="e.g. ISO 17025 Accredited Primary Reference"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Key Features (One feature per line)</label>
                  <textarea
                    rows={3}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="Visual Touch UI&#10;Wideband AC voltage&#10;Direct Artifact Calibration"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Hardware Icon</label>
                    <select
                      value={formData.iconName}
                      onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Cpu">Cpu (Processor)</option>
                      <option value="Gauge">Gauge (Pressure)</option>
                      <option value="Activity">Activity (Electrical)</option>
                      <option value="Zap">Zap (Laser/Voltage)</option>
                      <option value="Thermometer">Thermometer (Temperature)</option>
                      <option value="Scale">Scale (Mass)</option>
                      <option value="Sparkles">Sparkles (Precision)</option>
                      <option value="Scan">Scan (Dimensional Laser)</option>
                      <option value="Radio">Radio (Power Analyzer)</option>
                      <option value="Waves">Waves (Flow Meter)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Neon Theme Preset</label>
                    <select
                      onChange={(e) => {
                        const preset = themePresets.find(t => t.value === e.target.value);
                        if (preset) {
                          setFormData({
                            ...formData,
                            colorTheme: {
                              border: preset.border,
                              text: preset.text,
                              bg: preset.bg,
                              glow: preset.glow,
                              badge: preset.badge
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      {themePresets.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
                    className="px-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(255,193,7,0.3)] flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> {editingItem ? 'UPDATE INSTRUMENT' : 'SAVE NEW INSTRUMENT'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CONFIRM DELETE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md rounded-3xl bg-dark-900 border border-rose-500/40 p-6 shadow-2xl z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-display text-white">CONFIRM DELETION</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Are you sure you want to remove this instrument? It will immediately disappear from the live marquee.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  CANCEL
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                >
                  DELETE INSTRUMENT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
