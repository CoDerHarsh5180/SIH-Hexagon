import React from 'react';
import { 
  FileCheck2, 
  Timer, 
  Network, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Award 
} from 'lucide-react';
import { PLATFORM_STATS } from '../data/landingData';

export const StatsBar = () => {
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'FileCheck':
        return <FileCheck2 className="w-5 h-5 text-[#1E3A6E] dark:text-blue-400" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-[#ff7700]" />;
      case 'Network':
        return <Network className="w-5 h-5 text-[#1E3A6E] dark:text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Award className="w-5 h-5 text-[#1E3A6E]" />;
    }
  };

  return (
    <section className="py-10 bg-white dark:bg-[#181818] border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300 relative z-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLATFORM_STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 dark:bg-[#222222] p-5 rounded-2xl border border-slate-200 dark:border-[#333333] shadow-xs hover:border-[#1E3A6E]/40 dark:hover:border-emerald-500/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  {getIcon(stat.icon)}
                </div>
              </div>

              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                {stat.value}
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>{stat.trend}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
