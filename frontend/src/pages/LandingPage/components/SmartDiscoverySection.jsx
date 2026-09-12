import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Check, 
  CircleDot, 
  Sparkles, 
  FolderPlus, 
  ShieldCheck, 
  ArrowRight,
  Calculator,
  ChevronRight,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { KYA_SIMULATOR_PRESETS } from '../data/landingData';

export const SmartDiscoverySection = () => {
  const navigate = useNavigate();
  const [selectedPresetId, setSelectedPresetId] = useState('automotive');

  const currentPreset = KYA_SIMULATOR_PRESETS.find((p) => p.id === selectedPresetId) || KYA_SIMULATOR_PRESETS[0];

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#141414] border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300" id="wizard">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 text-[#1E3A6E] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Brain className="w-4 h-4" />
            <span>Intelligent Regulatory Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ask for Approvals — 3-Stage Smart Discovery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Eliminate clearance confusion. Our statutory rules engine evaluates your project parameters to automatically formulate your mandatory NOCs, timeline, and consolidated GRAS treasury challan.
          </p>
        </div>

        {/* 3 Step Explanation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Step 1 Card */}
          <div className="bg-white dark:bg-[#222222] p-6 rounded-2xl border-2 border-[#1E3A6E] dark:border-emerald-500 shadow-xs relative">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-[#1E3A6E] dark:bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="text-[11px] font-bold text-[#1E3A6E] dark:text-emerald-400 bg-blue-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded uppercase">
                Step 01
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Stage & Land Tenure
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Define current development phase and land classification across notified industrial zones.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Pre-construction planning & design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>MIDC Allotted Plot vs Private Land (NA)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>District Jurisdiction (36 Districts)</span>
              </div>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="bg-white dark:bg-[#222222] p-6 rounded-2xl border border-slate-200 dark:border-[#333333] shadow-xs relative">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                Step 02
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Enterprise Scale & Sector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Classify manufacturing sector and statutory MSME / Large Unit financial brackets.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#1E3A6E] dark:text-blue-400 shrink-0" />
                <span>Precision Auto, Food, Pharma & Castings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#1E3A6E] dark:text-blue-400 shrink-0" />
                <span>Proposed Capital Investment Tiers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#1E3A6E] dark:text-blue-400 shrink-0" />
                <span>Workforce Count (Factories Act Sec 2m)</span>
              </div>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="bg-white dark:bg-[#222222] p-6 rounded-2xl border border-slate-200 dark:border-[#333333] shadow-xs relative">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                Step 03
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Utilities & Effluent Categorization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Calculate industrial utility dependencies and CPCB / MPCB pollution indexing.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#ff7700] shrink-0" />
                <span>Power requirement (kVA / MSEDCL)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#ff7700] shrink-0" />
                <span>MPCB Red / Orange / Green / White</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#ff7700] shrink-0" />
                <span>Effluent Discharge & CETP Connectivity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Industry Preset Tabs */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#ff7700]" />
              Select Industry Simulation Scenario:
            </span>
            <span className="text-[11px] text-slate-500">Live dynamic recalculation</span>
          </div>

          <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
            {KYA_SIMULATOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                  selectedPresetId === preset.id
                    ? 'bg-[#1E3A6E] dark:bg-emerald-700 text-white border-[#1E3A6E] dark:border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-[#222222] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#333333] hover:border-slate-300'
                }`}
              >
                <span>{preset.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Checklist Output Box */}
        <div className="bg-white dark:bg-[#202020] rounded-2xl border border-slate-200 dark:border-[#3a445a] shadow-lg p-6 lg:p-8 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff7700] animate-pulse"></span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Simulated Discovery Output: Recommended Clearances
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Based on: <strong className="text-slate-700 dark:text-slate-200">{currentPreset.name}</strong> • {currentPreset.location} • {currentPreset.investment} ({currentPreset.badge})
              </p>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
                {currentPreset.clearancesCount} Statutory Clearances Required
              </span>
              <span className="text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#1E3A6E] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
                ~{currentPreset.estimatedDays} Days Max SLA
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
            {/* Clearances List (Left 8 cols) */}
            <div className="lg:col-span-8 space-y-3">
              {currentPreset.clearances.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#333333] hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#252525] text-[#1E3A6E] dark:text-emerald-400 border border-slate-200 dark:border-[#3a445a] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {item.id}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.sla} &bull; {item.category}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-[#1E3A6E] dark:text-emerald-400 bg-white dark:bg-[#252525] px-3 py-1 rounded-lg border border-slate-200 dark:border-[#3a445a] shrink-0">
                    {item.fee}
                  </span>
                </div>
              ))}
            </div>

            {/* Total and Bundle CTA (Right 4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-[#1a1a1a] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-[#333333] flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Treasury Consolidated Fee
                </span>
                <div className="mt-2 text-3xl font-extrabold text-[#1E3A6E] dark:text-emerald-400">
                  ₹{currentPreset.totalFee.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Single government treasury payment with automated fee reconciliation across departments.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Direct GRAS Challan</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deemed Approval Guarantee</span>
                    <span className="font-semibold text-slate-800 dark:text-white">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Escrow Protection</span>
                    <span className="font-semibold text-slate-800 dark:text-white">Yes</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => navigate('/user/approvals')}
                  className="w-full py-3.5 bg-[#ff7700] hover:bg-[#e06600] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Apply Single Dossier Bundle</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Launches full 3-step dynamic KYA questionnaire in portal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartDiscoverySection;
