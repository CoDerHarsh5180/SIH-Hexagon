import React from 'react';
import { 
  Building2, 
  Flame, 
  Leaf, 
  Landmark, 
  Utensils, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { INTEGRATED_DEPARTMENTS } from '../data/landingData';

export const DepartmentsSection = () => {
  const getDeptIcon = (iconName) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#ff7700]" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-[#1E3A6E] dark:text-blue-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-[#ff7700]" />;
      case 'Landmark':
        return <Landmark className="w-6 h-6 text-[#1E3A6E] dark:text-blue-400" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Building2 className="w-6 h-6 text-[#1E3A6E]" />;
    }
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#141414] border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300" id="departments">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#1E3A6E] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Inter-Agency Statutory Coalition</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Integrated Maharashtra Departments
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Real-time synchronization across all key industrial inspection desks under Maharashtra Right to Services Act.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333333] px-3.5 py-1.5 rounded-full self-start md:self-auto shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All 6 Desks Active with Deemed SLA</span>
          </div>
        </div>

        {/* 6 Department Cards Row/Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INTEGRATED_DEPARTMENTS.map((dept, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#222222] p-5 rounded-2xl border border-slate-200 dark:border-[#333333] shadow-xs flex flex-col items-center text-center hover:border-[#1E3A6E] dark:hover:border-emerald-500 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {getDeptIcon(dept.iconName)}
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {dept.code}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 h-8">
                {dept.name}
              </p>

              <span className="mt-4 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                {dept.sla}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
