import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';

export const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0F172A] dark:bg-[#0d1322] text-white border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top Tier: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Audit Badges */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A6E] text-white flex items-center justify-center font-bold text-sm">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Doc<span className="text-[#ff7700]">Flow</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Single Window Industrial Clearance &amp; Regulatory Compliance Management System. Designed and maintained under the Directorate of Industries, Government of Maharashtra, in coordination with MIDC, MPCB, and DISH.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5" />
                STQC &amp; CERT-In Audited
              </span>
              <span>•</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                ISO 27001 Certified System
              </span>
            </div>
          </div>

          {/* Statutory Portals */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Statutory Portals
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => navigate('/user/approvals')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Know Your Approvals Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/user/track/APP-MH-2026-89412')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Statutory SLA Matrix &amp; Tracking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/user/gov-benefits')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Deemed Approval &amp; Subsidies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/local-auth/requests')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  District Collectorates Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Assistance & Governance */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Assistance &amp; Governance
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => navigate('/user/query')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Departmental Directory &amp; Helpdesk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/user/complain')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  RTS Vigilance Grievance Redressal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/user/feedback')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Citizen Feedback Scoring
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Cyber Security Audit Mandate (2026)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-400">
          <p>© 2026 DocFlow Single Window Clearance System. Department of Industries, Government of Maharashtra. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>National Informatics Centre (NIC) Node</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Service Level Agreement: 100% Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
