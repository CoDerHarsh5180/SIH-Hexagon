import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Shield, 
  FileText,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Flame,
  Check
} from 'lucide-react';
import { POPULAR_DISTRICTS, POPULAR_CLEARANCES, LIVE_DOSSIER_MOCK } from '../data/landingData';

export const HeroSection = ({ onSelectClearanceSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedDistrict) {
      navigate('/user/approvals');
    } else {
      navigate('/user/approvals');
    }
  };

  const handleTagClick = (tagQuery) => {
    setSearchQuery(tagQuery);
    if (onSelectClearanceSearch) {
      onSelectClearanceSearch(tagQuery);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/50 dark:from-[#1c1c1c] dark:via-[#181818] dark:to-[#141414] pt-8 pb-16 border-b border-slate-200 dark:border-[#3a445a] overflow-hidden transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#ff7700]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Live Policy Pill */}
        <div className="inline-flex items-center gap-2 bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#3a445a] shadow-xs rounded-full px-3.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 mb-6 transition-all hover:border-[#1E3A6E]/30">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          <span className="font-semibold text-[#1E3A6E] dark:text-emerald-400">Maharashtra Industrial Policy 2024–2029</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
            Section 19 Deemed SLA Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Every Industrial Clearance, Subsidy & Permit —{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A6E] via-emerald-700 to-[#ff7700] dark:from-emerald-400 dark:via-blue-400 dark:to-[#ff7700]">
                Under One Intelligent Window
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              Empowering manufacturing plants, MSMEs, and heavy engineering facilities across Maharashtra with AI-powered approvals, real-time tracking, and direct access to state industrial incentive packages.
            </p>

            {/* Two Strong Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => navigate('/user/approvals')}
                className="px-6 py-3.5 bg-[#ff7700] hover:bg-[#e06600] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95 shadow-orange-500/20 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Ask for Approvals – AI Wizard</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('subsidies');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/user/gov-benefits');
                }}
                className="px-6 py-3.5 bg-white dark:bg-[#252525] hover:bg-slate-50 dark:hover:bg-[#303030] text-[#1E3A6E] dark:text-white border-2 border-[#1E3A6E] dark:border-[#3a445a] font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Industrial Subsidies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* District & Clearance Instant Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-3 bg-white dark:bg-[#252525] p-2 rounded-2xl border border-slate-200 dark:border-[#3a445a] shadow-lg flex flex-col sm:flex-row items-stretch gap-2">
              <div className="flex items-center gap-2 flex-grow px-3 py-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 80+ clearances (e.g., MPCB CTE, Fire NOC, Factory Building Plan)..."
                  className="w-full bg-transparent border-0 focus:outline-none p-0 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 px-3 py-2 sm:w-64">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  aria-label="Select Industrial District Hub"
                  className="w-full bg-transparent border-0 focus:outline-none p-0 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <option value="" className="dark:bg-[#252525]">Select District Hub</option>
                  {POPULAR_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id} className="dark:bg-[#252525]">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#1E3A6E] dark:bg-emerald-700 hover:bg-[#14284d] dark:hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Find Approvals</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular Clearance Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Popular Clearances:</span>
              {POPULAR_CLEARANCES.slice(0, 4).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(item.query)}
                  className="bg-white dark:bg-[#252525] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#3a445a] hover:border-[#1E3A6E] dark:hover:border-emerald-400 text-slate-700 dark:text-slate-300 hover:text-[#1E3A6E] transition-colors cursor-pointer text-[11px]"
                >
                  {item.label.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Right Mockup Card: High-Fidelity Active Application Dossier */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#222222] rounded-2xl border border-slate-200 dark:border-[#3a445a] shadow-xl p-6 relative overflow-hidden transition-all duration-300">
              {/* Header Details */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Live Statutory Dossier
                  </span>
                </div>
                <button
                  onClick={() => navigate('/user/track/APP-MH-2026-89412')}
                  title="Click to track in detail"
                  className="text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-[#1E3A6E] dark:text-emerald-400 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Ref: {LIVE_DOSSIER_MOCK.ref}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Title & Facility */}
              <div className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {LIVE_DOSSIER_MOCK.company}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {LIVE_DOSSIER_MOCK.location}
                    </p>
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                    {LIVE_DOSSIER_MOCK.status}
                  </span>
                </div>
              </div>

              {/* Interactive Stepper */}
              <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3.5 rounded-xl border border-slate-200 dark:border-[#333333] my-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Clearance Pipeline</span>
                  <span className="text-[#1E3A6E] dark:text-emerald-400 font-extrabold">
                    {LIVE_DOSSIER_MOCK.completedSteps} of {LIVE_DOSSIER_MOCK.totalSteps} Completed
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-[#1E3A6E] dark:to-emerald-400 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${LIVE_DOSSIER_MOCK.progressPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-5 text-[10px] text-center text-slate-500 dark:text-slate-400 mt-2.5 font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Filed ✓</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Scrutiny ✓</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Inspect ✓</span>
                  <span className="text-[#1E3A6E] dark:text-amber-400 font-bold underline">Legal (Active)</span>
                  <span className="text-slate-400">Issuance</span>
                </div>
              </div>

              {/* Real-time Clearances List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs my-3">
                {LIVE_DOSSIER_MOCK.clearances.map((c, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 truncate">
                      {c.isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#ff7700] shrink-0 animate-pulse" />
                      )}
                      <span className="truncate">{c.name}</span>
                    </div>

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      c.isDone 
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60' 
                        : 'text-[#ff7700] bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 font-bold'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cryptographic Badge */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  SHA-256 Token
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Apex RTS Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
