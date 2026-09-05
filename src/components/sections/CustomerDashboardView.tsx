'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, Search, Clock, Calendar, CheckCircle2, AlertTriangle, FileText, Activity, RefreshCw } from 'lucide-react';

interface JobItem {
  id: string;
  instrument: string;
  serialNo: string;
  discipline: string;
  status: 'In Calibration' | 'Calibrated' | 'Dispatched' | 'Scheduled';
  statusColor: string;
  dueDate: string;
  certNo: string;
}

export default function CustomerDashboardView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const jobs: JobItem[] = [
    {
      id: 'MSIR-JOB-9841',
      instrument: 'Fluke 87V Industrial Multimeter',
      serialNo: 'SN-9402184',
      discipline: 'Electrical',
      status: 'Calibrated',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      dueDate: '2027-07-28',
      certNo: 'NABL-CC2891-2026-0914',
    },
    {
      id: 'MSIR-JOB-9842',
      instrument: 'WIKA Master Pressure Gauge 0-100 bar',
      serialNo: 'SN-771092',
      discipline: 'Pressure',
      status: 'In Calibration',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      dueDate: '2026-08-02',
      certNo: 'NABL-CC2891-2026-0915',
    },
    {
      id: 'MSIR-JOB-9843',
      instrument: 'Mitutoyo Digital Micrometer 0-25mm',
      serialNo: 'SN-331048',
      discipline: 'Dimensional',
      status: 'Dispatched',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      dueDate: '2027-06-15',
      certNo: 'NABL-CC2891-2026-0916',
    },
    {
      id: 'MSIR-JOB-9844',
      instrument: 'Keysight Oscilloscope 4-Channel 500MHz',
      serialNo: 'SN-KEY-882',
      discipline: 'Electrical',
      status: 'Scheduled',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      dueDate: '2026-08-10',
      certNo: 'PENDING ISSUE',
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.serialNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || job.status.toUpperCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section id="dashboard" className="relative py-28 bg-dark-950 border-t border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-800 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest mb-3">
              INDUSTRIAL SAAS MONITORING PORTAL
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              CLIENT <span className="text-amber-400 text-amber-glow">INSTRUMENT DASHBOARD</span>
            </h2>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-dark-900 border border-neutral-800 text-right font-mono">
              <span className="text-[10px] text-neutral-400 uppercase block">ACTIVE AMC INSTRUMENTS</span>
              <span className="text-base font-bold text-amber-400">142 UNITS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-dark-900 border border-neutral-800 text-right font-mono">
              <span className="text-[10px] text-neutral-400 uppercase block">CERTIFICATES ISSUED</span>
              <span className="text-base font-bold text-emerald-400">1,289 VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Dashboard Shell Box */}
        <div className="rounded-3xl bg-dark-900/90 border border-neutral-800 p-6 lg:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          
          {/* Controls Bar: Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job ID, instrument or S/N..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'CALIBRATED', 'IN CALIBRATION', 'DISPATCHED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeFilter === filter
                      ? 'bg-amber-500 text-dark-950 font-bold'
                      : 'bg-dark-950 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

          </div>

          {/* Jobs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">JOB REF</th>
                  <th className="pb-3 px-3">INSTRUMENT & MODEL</th>
                  <th className="pb-3 px-3">SERIAL NO</th>
                  <th className="pb-3 px-3">DISCIPLINE</th>
                  <th className="pb-3 px-3">STATUS</th>
                  <th className="pb-3 px-3">RE-CALIBRATION DUE</th>
                  <th className="pb-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono text-xs">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-dark-800/40 transition-colors">
                    <td className="py-4 px-3 text-amber-400 font-bold">{job.id}</td>
                    <td className="py-4 px-3 font-semibold text-white">{job.instrument}</td>
                    <td className="py-4 px-3 text-neutral-400">{job.serialNo}</td>
                    <td className="py-4 px-3 text-neutral-300">{job.discipline}</td>
                    <td className="py-4 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded border text-[10px] uppercase font-bold ${job.statusColor}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-neutral-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{job.dueDate}</span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      {job.status === 'Calibrated' || job.status === 'Dispatched' ? (
                        <button
                          onClick={() => alert(`Downloading NABL Accredited PDF Certificate: ${job.certNo}`)}
                          className="px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF CERT
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-500 italic">IN PROGRESS</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AMC Renewal Warning Banner Widget */}
          <div className="p-4 rounded-xl bg-dark-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-display text-white">
                  AMC CALIBRATION RENEWAL ALERT
                </h4>
                <p className="text-[11px] font-mono text-neutral-400">
                  3 instruments are due for NABL mandatory re-calibration within the next 30 days.
                </p>
              </div>
            </div>

            <a
              href="#booking"
              className="px-4 py-2 text-xs font-bold font-display uppercase bg-amber-500 text-dark-950 rounded-lg whitespace-nowrap"
            >
              SCHEDULE RE-CALIBRATION
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
