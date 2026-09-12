import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Coins, 
  ArrowRight, 
  CheckCircle, 
  Gavel, 
  Factory, 
  Zap, 
  Leaf, 
  ScrollText,
  Calculator,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { INDUSTRIAL_SUBSIDIES } from '../data/landingData';

export const SubsidiesSection = () => {
  const navigate = useNavigate();
  const [investmentCrores, setInvestmentCrores] = useState(15);
  const [showGazetteModal, setShowGazetteModal] = useState(false);

  // Dynamic calculations based on Maharashtra PSI 2024 formula
  const calculatedCapitalSubsidy = Math.min(investmentCrores * 0.4, 5.0).toFixed(2);
  const calculatedElectricitySavings = (investmentCrores * 0.12 * 5).toFixed(1);
  const calculatedStampDutySaved = (investmentCrores * 0.06).toFixed(2);

  const getSubsidyIcon = (id) => {
    switch (id) {
      case 'psi-capital':
        return <Factory className="w-5 h-5 text-[#1E3A6E] dark:text-blue-400" />;
      case 'stamp-duty':
        return <ScrollText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'power-tariff':
        return <Zap className="w-5 h-5 text-[#ff7700]" />;
      case 'green-etp':
        return <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Coins className="w-5 h-5 text-[#1E3A6E]" />;
    }
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#141414] border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300" id="subsidies">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#1E3A6E] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Coins className="w-4 h-4" />
            <span>State Industrial Package Schemes (IPS)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Maharashtra Industrial Policy 2024–2029 Subsidies
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Accelerate your capital deployment with direct state fiscal packages, stamp duty waivers, and industrial power tariff subsidies.
          </p>
        </div>

        {/* 4 Subsidy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {INDUSTRIAL_SUBSIDIES.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-[#222222] p-6 rounded-2xl border border-slate-200 dark:border-[#333333] shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#1E3A6E]/30 dark:hover:border-emerald-500/30 transition-all duration-200"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1c1c1c] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4">
                  {getSubsidyIcon(sub.id)}
                </div>

                <span className="text-[11px] font-bold text-[#1E3A6E] dark:text-emerald-400 bg-blue-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-emerald-800/40">
                  {sub.badge}
                </span>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2.5">
                  {sub.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {sub.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => navigate('/user/gov-benefits')}
                  className="w-full py-2 bg-slate-50 dark:bg-[#1c1c1c] hover:bg-[#1E3A6E] hover:text-white dark:hover:bg-emerald-700 text-[#1E3A6E] dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Check Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Quick Incentive Estimator Bar */}
        <div className="bg-white dark:bg-[#202020] rounded-2xl border border-slate-200 dark:border-[#3a445a] p-6 lg:p-7 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Interactive Capital Subsidy Estimator
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Slide your planned fixed capital investment to estimate statutory government incentives:
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              PSI 2024 Rule Engine
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
            {/* Slider Column */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Proposed Investment (Plant & Machinery):</span>
                <span className="text-base font-extrabold text-[#1E3A6E] dark:text-emerald-400 font-mono">
                  ₹{investmentCrores} Crore
                </span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="50" 
                step="1"
                value={investmentCrores}
                onChange={(e) => setInvestmentCrores(Number(e.target.value))}
                className="w-full accent-[#ff7700] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹2 Cr (Micro/Small)</span>
                <span>₹25 Cr (Medium Unit)</span>
                <span>₹50 Cr+ (Mega Project)</span>
              </div>
            </div>

            {/* Output Metric Cards */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Capital Subsidy</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1 font-mono">
                  ₹{calculatedCapitalSubsidy} Cr
                </span>
                <span className="text-[9px] text-slate-400">Up to 40% cap</span>
              </div>

              <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Power Duty Waiver</span>
                <span className="text-sm sm:text-base font-extrabold text-[#ff7700] block mt-1 font-mono">
                  ₹{calculatedElectricitySavings} L
                </span>
                <span className="text-[9px] text-slate-400">5-yr estimation</span>
              </div>

              <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Stamp Exemption</span>
                <span className="text-sm sm:text-base font-extrabold text-[#1E3A6E] dark:text-blue-400 block mt-1 font-mono">
                  ₹{calculatedStampDutySaved} L
                </span>
                <span className="text-[9px] text-slate-400">100% MIDC waiver</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 19 Deemed Approval Banner */}
        <div className="bg-gradient-to-r from-[#1E3A6E] to-[#0B192C] text-white p-6 sm:p-7 rounded-2xl border border-blue-900 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-[#ff7700] flex items-center justify-center shrink-0">
              <Gavel className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff7700]">
                Statutory Legal Guarantee
              </span>
              <h4 className="text-base sm:text-lg font-bold">
                Section 19 Deemed Approval Rule Enforced
              </h4>
              <p className="text-xs text-white/80 mt-0.5 leading-relaxed max-w-2xl">
                If an agency fails to process or formally raise objections within 30 statutory days, the clearance certificate is automatically deemed approved and legally issued by DocFlow under Maharashtra statutory decree.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGazetteModal(true)}
            className="px-5 py-2.5 bg-[#ff7700] hover:bg-[#e06600] text-white text-xs font-bold rounded-xl whitespace-nowrap transition-colors shrink-0 shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>View Gazette Mandate</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gazette Modal */}
      {showGazetteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#3a445a] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[#ff7700]" />
                <h3 className="font-bold text-slate-900 dark:text-white">Maharashtra Gazette Notification No. 118/2024</h3>
              </div>
              <button 
                onClick={() => setShowGazetteModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Under the Maharashtra Right to Public Services Act (RTS Act) 2015 &amp; Industrial Single Window Policy 2024:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Every regulatory desk (MPCB, DISH, MIDC, Fire, Town Planning) has an enforceable statutory turnaround time between 7 to 30 days.</li>
                <li>Zero physical visits or counter files are legally acceptable. All queries must be logged cryptographically on DocFlow.</li>
                <li>In case of officer inaction upon deadline expiration, the DocFlow Apex Governance Node generates a digitally signed statutory Deemed Certificate carrying legal immunity.</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowGazetteModal(false)}
                className="px-4 py-2 bg-[#1E3A6E] text-white font-semibold text-xs rounded-xl"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SubsidiesSection;
