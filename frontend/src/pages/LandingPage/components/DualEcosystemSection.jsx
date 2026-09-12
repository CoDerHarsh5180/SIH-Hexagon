import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Check, 
  Clock, 
  FolderOpen, 
  AlertTriangle, 
  ShieldAlert, 
  Video, 
  CheckCircle2, 
  ExternalLink,
  Users,
  Eye,
  Building2
} from 'lucide-react';

export const DualEcosystemSection = () => {
  const navigate = useNavigate();
  const [activeQueueDetail, setActiveQueueDetail] = useState(null);

  const handleQueueReview = (queueName, officer) => {
    setActiveQueueDetail({ queueName, officer });
  };

  return (
    <section className="py-16 bg-white dark:bg-[#181818] border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300" id="pipeline">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-[#1E3A6E] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Unified Synchronous Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Dual Dashboard Ecosystem — Synchronous Inter-Agency Infrastructure
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Real-time collaboration between the industrialist and the statutory inspection machinery. Complete transparency at every regulatory milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card: For Entrepreneurs & Investors */}
          <div className="bg-white dark:bg-[#222222] rounded-2xl border border-slate-200 dark:border-[#3a445a] shadow-lg overflow-hidden flex flex-col transition-all">
            <div className="bg-[#1E3A6E] dark:bg-emerald-800 text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-sm font-bold">
                  For Entrepreneurs &amp; Investors (Live Clearance Pipeline)
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-white/10 px-2 py-0.5 rounded">
                Applicant Console
              </span>
            </div>

            <div className="p-6 flex-grow space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  5-Stage Sequential Progress
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Automated SLA counter ticking under RTS Act with immutable milestone stamps.
                </p>
              </div>

              {/* 5-Stage Stepper */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                    ✓
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Stage 1: User Submitted (CAF)</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Completed</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Auto-validated via GSTIN and MIDC Land Allotment Deed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                    ✓
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Stage 2: Desk Screening</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Completed</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cross-departmental document scrutiny verified without defects.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1E3A6E] dark:bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold animate-pulse shadow-2xs">
                    3
                  </div>
                  <div className="flex-grow bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-slate-200 dark:border-[#333333]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#1E3A6E] dark:text-emerald-400">Stage 3: Joint Field Inspection</span>
                      <span className="bg-[#1E3A6E] text-white px-2 py-0.5 rounded font-bold text-[10px]">
                        In Progress
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                      Single joint inspection scheduled for Oct 28th, 11:00 AM (MIDC + Fire + DISH).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 text-slate-400 flex items-center justify-center shrink-0 text-xs font-bold">
                    4
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-600 dark:text-slate-400">Stage 4: Legal &amp; Fee Reconciliation</span>
                      <span className="text-slate-400">Queued</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 text-slate-400 flex items-center justify-center shrink-0 text-xs font-bold">
                    5
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-600 dark:text-slate-400">Stage 5: Final QR Issuance</span>
                      <span className="text-slate-400">Deemed Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools: Verified Dossiers & 1-Click Grievance */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/user/your-docs')}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#252525] rounded-xl border border-slate-200 dark:border-[#333333] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 text-[#1E3A6E] dark:text-blue-400 shrink-0" />
                  <span className="truncate">Verified Document Vault</span>
                </button>

                <button
                  onClick={() => navigate('/user/complain')}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#252525] rounded-xl border border-slate-200 dark:border-[#333333] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-[#ff7700] shrink-0" />
                  <span className="truncate">1-Click Grievance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: For Government Officers */}
          <div className="bg-white dark:bg-[#222222] rounded-2xl border border-slate-200 dark:border-[#3a445a] shadow-lg overflow-hidden flex flex-col transition-all">
            <div className="bg-[#0B192C] text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#ff7700]"></span>
                <h3 className="text-sm font-bold">
                  For Government Officers (Real-time Scrutiny Console)
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-white/10 px-2 py-0.5 rounded text-[#ff7700]">
                Statutory Board
              </span>
            </div>

            <div className="p-6 flex-grow space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Regional Clearance Queues
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cross-agency clearance queues monitored live statewide with RTS breach alarms.
                </p>
              </div>

              {/* Queues Mockup */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#333333] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span>Pune Regional Queue</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                        18 Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      MPCB Regional Officer: Dr. S. Kulkarni
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/local-auth/requests')}
                    className="px-3 py-1 bg-white dark:bg-[#252525] border border-slate-200 dark:border-slate-700 text-[#1E3A6E] dark:text-white font-bold rounded-lg hover:bg-slate-100 cursor-pointer text-xs"
                  >
                    Review
                  </button>
                </div>

                <div className="p-3 bg-orange-50/60 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800/50 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[#ff7700]">
                      <span>Thane Collectorate Queue</span>
                      <span className="text-[10px] bg-[#ff7700] text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                        SLA Alert
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Directorate of Fire NOC — Day 13 of 14
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/local-auth/requests')}
                    className="px-3 py-1 bg-[#ff7700] text-white font-bold rounded-lg hover:bg-[#e06600] cursor-pointer text-xs"
                  >
                    Override
                  </button>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#333333] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span>Chhatrapati Sambhajinagar Queue</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                        12 Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      MIDC Town Planning & Industrial Water
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/local-auth/requests')}
                    className="px-3 py-1 bg-white dark:bg-[#252525] border border-slate-200 dark:border-slate-700 text-[#1E3A6E] dark:text-white font-bold rounded-lg hover:bg-slate-100 cursor-pointer text-xs"
                  >
                    Review
                  </button>
                </div>
              </div>

              {/* Compliance Gauge */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#333333] text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Statewide Compliance Index</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">94.8% SLA Safe</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: '92%' }}></div>
                  <div className="bg-[#ff7700] h-full" style={{ width: '6%' }}></div>
                  <div className="bg-red-500 h-full" style={{ width: '2%' }}></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Video className="w-4 h-4 text-[#1E3A6E] dark:text-blue-400" />
                  Collectorate VC Channel
                </span>
                <span className="text-[#1E3A6E] dark:text-emerald-400 font-bold">
                  Encrypted Officer Node
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualEcosystemSection;
