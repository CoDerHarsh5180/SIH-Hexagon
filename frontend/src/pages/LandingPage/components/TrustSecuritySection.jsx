import React from 'react';
import { 
  Shield, 
  ShieldCheck, 
  QrCode, 
  Award, 
  FileCheck2, 
  Lock, 
  ClockAlert,
  Server
} from 'lucide-react';

export const TrustSecuritySection = () => {
  return (
    <section className="py-16 bg-white dark:bg-[#181818] border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300" id="security">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-[#202020] rounded-3xl border border-slate-200 dark:border-[#333333] p-8 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Maharashtra Ease of Doing Business Act 2025 Backed</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                Every Certificate is Legally Enforceable with Cryptographic QR Verification
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                No physical visits to government secretariats or regional collectorates. Every clearance approved on DocFlow carries an official digitally signed SHA-256 certificate backed by the Maharashtra State Citizen Charter statutory guarantee.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="border-l-2 border-[#1E3A6E] dark:border-blue-400 pl-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Zero Physical Visits</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    100% digital submission, scrutiny, and issuance.
                  </p>
                </div>

                <div className="border-l-2 border-[#ff7700] pl-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Automated SLA Triggers</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Auto-escalation to Principal Secretary if inactive &gt; 14 days.
                  </p>
                </div>

                <div className="border-l-2 border-emerald-600 pl-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Bank-Grade Audit Vault</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    CERT-In compliant and ISO 27001 state data center hosted.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Apex Citizen Charter Card */}
            <div className="lg:col-span-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-slate-200 dark:border-[#333333] shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-4 shadow-2xs">
                <Shield className="w-9 h-9" />
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Apex Citizen Charter
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Right to Public Services Act (RTS) Guarantee No. 44/2024
              </p>

              <div className="mt-5 w-full bg-slate-50 dark:bg-[#252525] p-3.5 rounded-xl border border-slate-200 dark:border-[#3a445a] text-left">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Chief Secretary Oversight:
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  Industrial Fast-Track Clearance Council
                </p>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>STATUS: COMPLIANCE ACTIVE 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSecuritySection;
