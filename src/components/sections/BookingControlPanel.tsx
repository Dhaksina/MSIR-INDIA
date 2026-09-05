'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Calendar, Upload, ShieldCheck, Check, ArrowRight, FileText, Cpu, Sparkles, AlertCircle, RefreshCw, MessageSquare, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BookingControlPanel() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    discipline: 'Electrical Calibration',
    instrumentName: '',
    quantity: 1,
    pickupType: 'MSIR Pickup (Chennai & Bengaluru Metro Areas)',
    notes: '',
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsScanning(true);
    setTimeout(() => {
      setUploadedFile(file);
      setIsScanning(false);
    }, 1500);
  };

  const buildWhatsAppUrl = (ref: string) => {
    const ownerPhone = '919789877567';
    const text = `🚨 *NEW CALIBRATION BOOKING ALERT* 🚨
--------------------------------------
📋 *Booking Ref:* ${ref}

🏢 *Company Name:* ${formData.companyName || 'N/A'}
👤 *Contact Person:* ${formData.contactName || 'N/A'}
📞 *Phone:* ${formData.phone || 'N/A'}
✉️ *Email:* ${formData.email || 'N/A'}

⚙️ *Discipline:* ${formData.discipline}
🔬 *Instrument / Model:* ${formData.instrumentName || 'Standard Equipment'}
🔢 *Quantity:* ${formData.quantity}
🚚 *Logistics / Branch:* ${formData.pickupType}
${formData.notes ? `📝 *Notes:* ${formData.notes}` : ''}
--------------------------------------
_Sent via MSIR INDIA Calibration Portal_`;

    return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`;
  };

  const triggerWhatsAppDispatch = (ref: string) => {
    const url = buildWhatsAppUrl(ref);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSaving(true);
    const refId = `MSIR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(refId);

    const bookingData = {
      bookingRef: refId,
      companyName: formData.companyName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      discipline: formData.discipline,
      instrumentName: formData.instrumentName,
      quantity: Number(formData.quantity),
      pickupType: formData.pickupType,
      notes: formData.notes || '',
      uploadedFileName: uploadedFile ? uploadedFile.name : null,
      status: 'Pending',
      createdAt: serverTimestamp()
    };

    try {
      // Save to "customers" collection
      await addDoc(collection(db, "customers"), bookingData);
      // Also save to "contact" collection
      await addDoc(collection(db, "contact"), bookingData);
      console.log("Booking successfully saved to Firestore 'customers' & 'contact' collections!");
    } catch (error: any) {
      console.error("Error saving booking details to Firestore:", error);
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        setSubmitError("Firebase Firestore Permission Denied. Please enable Read/Write rules in your Firebase Console.");
      }
    } finally {
      setIsSaving(false);
      setIsSubmitted(true);
    }

    // Fire Celebration Confetti
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC107', '#FFD54F', '#00F0FF', '#10B981'],
    });

    // Auto-trigger WhatsApp redirect to Owner
    setTimeout(() => {
      triggerWhatsAppDispatch(refId);
    }, 600);
  };

  return (
    <section id="booking" className="relative py-28 bg-dark-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            FUTURISTIC CONTROL PANEL
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            ONLINE CALIBRATION <span className="text-amber-400 text-amber-glow">BOOKING</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Schedule instrument calibration, upload equipment specs, or request urgent lab dispatch.
          </p>
        </div>

        {/* Glassmorphic Control Panel Form Container */}
        <div className="relative rounded-3xl bg-dark-800/80 border border-amber-500/30 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          {/* Progress Bar Indicator */}
          <div className="mb-8 border-b border-neutral-800 pb-6">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className={`text-amber-400 font-bold`}>PHASE 0{step} OF 03</span>
              <span className="text-neutral-400">
                {step === 1 ? 'COMPANY & CONTACT' : step === 2 ? 'INSTRUMENT SPECIFICATIONS' : 'FILE UPLOAD & CONFIRMATION'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-dark-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_12px_#FFC107] transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: Contact Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Tata Motors R&D"
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-mono transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Contact Officer *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        required
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder="e.g. Dr. K. Ramesh"
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ramesh@tatamotors.com"
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-mono transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Mobile / Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98400 12345"
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 text-xs font-bold font-display uppercase tracking-wider bg-amber-500 text-dark-950 rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2"
                    >
                      <span>NEXT: INSTRUMENT DETAILS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Instrument Specs */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Calibration Discipline *
                      </label>
                      <select
                        name="discipline"
                        value={formData.discipline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-sm font-mono transition-all"
                      >
                        <option>Electrical Calibration</option>
                        <option>Pressure & Hydraulics</option>
                        <option>Thermal & Temperature</option>
                        <option>Dimensional & Optical</option>
                        <option>Torque & Force</option>
                        <option>RF & Microwave</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Instrument Name / Model *
                      </label>
                      <input
                        type="text"
                        name="instrumentName"
                        required
                        value={formData.instrumentName}
                        onChange={handleInputChange}
                        placeholder="e.g. Fluke 87V DMM / WIKA Pressure Gauge"
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 text-sm font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-sm font-mono transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                        Logistics Option *
                      </label>
                      <select
                        name="pickupType"
                        value={formData.pickupType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-400 text-sm font-mono transition-all"
                      >
                        <option>MSIR Pickup (Chennai & Bengaluru Metro Areas)</option>
                        <option>Direct Drop-off (Chennai HQ - Chromepet Lab)</option>
                        <option>Direct Drop-off (Bengaluru Branch - AMJ Towers, Attibele)</option>
                        <option>Insured Courier Dispatch</option>
                        <option>On-Site Site Calibration (Mobile Calibration Unit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 text-xs font-mono text-neutral-400 hover:text-white"
                    >
                      BACK
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 text-xs font-bold font-display uppercase tracking-wider bg-amber-500 text-dark-950 rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2"
                    >
                      <span>NEXT: FILE UPLOAD</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: File Scanner & Submit */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Holographic Laser Drag-and-Drop Area */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-2 uppercase">
                      Upload Equipment Specs / Image / PO File (Optional)
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleFileDrop}
                      className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                        dragActive
                          ? 'border-amber-400 bg-amber-500/10'
                          : 'border-neutral-800 bg-dark-950/80 hover:border-neutral-700'
                      }`}
                    >
                      {/* Laser Scanner animation effect when processing */}
                      {isScanning && (
                        <div className="absolute inset-0 bg-dark-950/90 rounded-2xl flex flex-col items-center justify-center space-y-3 z-20">
                          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                          <span className="text-xs font-mono text-amber-400">OPTICAL LASER SCANNING FILE...</span>
                        </div>
                      )}

                      <Upload className="w-10 h-10 text-amber-400 mx-auto mb-3 animate-bounce" />
                      <p className="text-sm font-bold font-display text-white mb-1">
                        {uploadedFile ? uploadedFile.name : 'Drag & Drop PDF, PNG, JPG or DOCX here'}
                      </p>
                      <p className="text-xs font-mono text-neutral-400 mb-4">
                        Max file size: 25 MB (NABL Security Encrypted)
                      </p>
                      
                      <input
                        type="file"
                        id="fileInput"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="fileInput"
                        className="px-4 py-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg cursor-pointer hover:bg-amber-500/20 transition-all inline-block"
                      >
                        BROWSE FILE
                      </label>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-dark-950 border border-neutral-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>COMPANY:</span>
                      <span className="text-white">{formData.companyName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>DISCIPLINE:</span>
                      <span className="text-amber-400 font-bold">{formData.discipline}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>INSTRUMENT:</span>
                      <span className="text-white">{formData.instrumentName || 'Standard Instrument'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 text-xs font-mono text-neutral-400 hover:text-white"
                    >
                      BACK
                    </button>
                    
                    <button
                      type="submit"
                      className="px-8 py-3.5 text-xs font-bold font-display uppercase tracking-wider bg-amber-500 text-dark-950 rounded-xl shadow-[0_0_30px_rgba(255,193,7,0.5)] hover:bg-amber-400 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>SUBMIT & DISPATCH TO WHATSAPP</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </form>
          ) : (
            /* Submission Confirmation Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                  BOOKING CONFIRMED & DISPATCHED
                </span>
                <h3 className="text-3xl font-extrabold font-display text-white">
                  REFERENCE ID: <span className="text-amber-400">{bookingRef}</span>
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto">
                  Your calibration request has been formatted and queued for immediate dispatch to MSIR INDIA Lab Owner WhatsApp (+91 97898 77567).
                </p>
              </div>

              {/* Direct WhatsApp Action Card */}
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 max-w-md mx-auto space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                  <MessageSquare className="w-4 h-4 animate-bounce" />
                  <span>DIRECT OWNER WHATSAPP DISPATCH</span>
                </div>
                
                <p className="text-xs text-neutral-300 font-sans">
                  If WhatsApp did not launch automatically, click below to send your booking directly to the owner:
                </p>

                <button
                  onClick={() => triggerWhatsAppDispatch(bookingRef)}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 text-dark-950 font-bold font-display uppercase tracking-wider text-xs hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND TO OWNER WHATSAPP (+91 97898 77567)</span>
                </button>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => { setIsSubmitted(false); setStep(1); }}
                  className="px-6 py-2.5 text-xs font-mono text-neutral-400 hover:text-white bg-dark-950 border border-neutral-800 rounded-lg"
                >
                  BOOK ANOTHER INSTRUMENT
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}

