import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Coins, 
  ArrowRight, 
  Gavel, 
  Factory, 
  Zap, 
  Leaf, 
  ScrollText, 
  Calculator,
  ExternalLink
} from 'lucide-react';
import { INDUSTRIAL_SUBSIDIES } from '../data/landingData';

export const SubsidiesSection = () => {
  const navigate = useNavigate();
  const [investmentCrores, setInvestmentCrores] = useState(15);
  const [showGazetteModal, setShowGazetteModal] = useState(false);

  // Dynamic calculations based on Maharashtra industrial subsidy policy
  const calculatedCapitalSubsidy = Math.min(investmentCrores * 0.4, 5.0).toFixed(2);
  const calculatedElectricitySavings = (investmentCrores * 0.12 * 5).toFixed(1);
  const calculatedStampDutySaved = (investmentCrores * 0.06).toFixed(2);

  const getSubsidyIcon = (id) => {
    const iconClass = "w-5 h-5 text-india-orange";
    switch (id) {
      case 'psi-capital':
        return <Factory className={iconClass} />;
      case 'stamp-duty':
        return <ScrollText className={iconClass} />;
      case 'power-tariff':
        return <Zap className={iconClass} />;
      case 'green-etp':
        return <Leaf className={iconClass} />;
      default:
        return <Coins className={iconClass} />;
    }
  };

  return (
    <section className="py-16 bg-background border-b border-border transition-colors duration-300" id="subsidies">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-india-orange text-xs font-bold uppercase tracking-wider mb-2">
            <Coins className="w-4 h-4" />
            <span>Government Incentives &amp; Grants</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Industrial Subsidies &amp; Government Schemes
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Save on your setup costs with direct government subsidies, stamp duty waivers, and electricity bill discounts.
          </p>
        </div>

        {/* 4 Subsidy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {INDUSTRIAL_SUBSIDIES.map((sub) => (
            <div
              key={sub.id}
              className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-xs flex flex-col justify-between hover:shadow-xs hover:border-india-orange/60 transition-all duration-200"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-india-orange/10 border border-india-orange/20 flex items-center justify-center mb-4">
                  {getSubsidyIcon(sub.id)}
                </div>

                <span className="text-[11px] font-semibold text-india-orange bg-india-orange/10 px-2 py-0.5 rounded border border-india-orange/20">
                  {sub.badge}
                </span>

                <h3 className="text-base font-bold text-foreground mt-3">
                  {sub.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {sub.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => navigate('/gov-benefits')}
                  className="w-full py-2 bg-muted hover:bg-india-orange hover:text-white text-foreground border border-border text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Check Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Quick Incentive Estimator Bar */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-6 lg:p-7 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-india-orange/10 text-india-orange flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Quick Subsidy Calculator
                </h4>
                <p className="text-xs text-muted-foreground">
                  Slide your planned factory investment to estimate government subsidies you can receive:
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-muted text-foreground border border-border">
              Maharashtra Policy Rules
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
            {/* Slider Column */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Planned Investment (Building &amp; Machinery):</span>
                <span className="text-base font-extrabold text-india-orange font-mono">
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
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>₹2 Cr (Micro/Small)</span>
                <span>₹25 Cr (Medium Enterprise)</span>
                <span>₹50 Cr+ (Large Setup)</span>
              </div>
            </div>

            {/* Output Metric Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-muted/40 p-3 rounded-lg border border-border text-center">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Capital Subsidy</span>
                <span className="text-sm sm:text-base font-extrabold text-india-blue block mt-1 font-mono">
                  ₹{calculatedCapitalSubsidy} Cr
                </span>
                <span className="text-[9px] text-muted-foreground">Up to 40% subsidy</span>
              </div>

              <div className="bg-muted/40 p-3 rounded-lg border border-border text-center">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Power Bill Savings</span>
                <span className="text-sm sm:text-base font-extrabold text-india-orange block mt-1 font-mono">
                  ₹{calculatedElectricitySavings} L
                </span>
                <span className="text-[9px] text-muted-foreground">Estimated over 5 yrs</span>
              </div>

              <div className="bg-muted/40 p-3 rounded-lg border border-border text-center">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Stamp Duty Waiver</span>
                <span className="text-sm sm:text-base font-extrabold text-india-blue block mt-1 font-mono">
                  ₹{calculatedStampDutySaved} L
                </span>
                <span className="text-[9px] text-muted-foreground">100% MIDC waiver</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flat RTS Act Governance Banner (No Gradients) */}
        <div className="bg-card text-card-foreground p-6 sm:p-7 rounded-xl border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-india-orange/10 text-india-orange border border-india-orange/20 flex items-center justify-center shrink-0">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-india-orange">
                Maharashtra Right to Public Services Act
              </span>
              <h4 className="text-base sm:text-lg font-bold text-foreground mt-0.5">
                Guaranteed Timely Delivery for All Clearances
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                Every application is legally tracked under the Maharashtra RTS Act. If a department requires extra information, they must notify you directly online. You will always have full transparency on each stage.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGazetteModal(true)}
            className="px-5 py-2.5 bg-india-orange hover:bg-india-orange/90 text-white text-xs font-bold rounded-lg whitespace-nowrap transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>View Citizen Charter</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Citizen Charter Modal */}
      {showGazetteModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowGazetteModal(false)}
        >
          <div 
            className="bg-background text-foreground border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-india-orange" />
                <h3 className="font-bold text-base text-foreground">Maharashtra Citizen Charter &amp; RTS Act</h3>
              </div>
              <button 
                onClick={() => setShowGazetteModal(false)}
                className="text-foreground/50 hover:text-foreground hover:bg-border p-1.5 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs sm:text-sm text-foreground/85 leading-relaxed">
              <p className="text-foreground font-semibold">
                Under the Maharashtra Right to Public Services Act (RTS Act) &amp; Single Window Policy:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                <li>Every department (MPCB, DISH, MIDC, Fire Services, Town Planning) is required to process online applications without delay.</li>
                <li>No physical visits to offices or counter files are needed. All queries and reviews happen completely online.</li>
                <li>You can track the progress of every document and raise a grievance directly if your file is unnecessarily held up.</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-border flex justify-end">
              <button
                onClick={() => setShowGazetteModal(false)}
                className="px-4 py-2 bg-india-orange text-white font-semibold text-xs rounded-lg hover:bg-india-orange/90 transition-opacity cursor-pointer shadow-xs"
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
