import React from 'react';
import { 
  Network, 
  Lock, 
  GitPullRequest, 
  Calendar, 
  Headphones, 
  LayoutDashboard,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { PLATFORM_FEATURES } from '../data/landingData';

export const FeaturesGrid = () => {
  const getFeatureIcon = (iconName) => {
    switch (iconName) {
      case 'Network':
        return <Network className="w-5 h-5 text-[#1E3A6E] dark:text-blue-400 group-hover:text-white" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-[#ff7700] group-hover:text-white" />;
      case 'GitPullRequest':
        return <GitPullRequest className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-[#1E3A6E] dark:text-blue-400 group-hover:text-white" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-[#ff7700] group-hover:text-white" />;
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#1E3A6E] group-hover:text-white" />;
    }
  };

  const getHoverBg = (iconName) => {
    switch (iconName) {
      case 'Network':
      case 'Calendar':
        return 'group-hover:bg-[#1E3A6E] dark:group-hover:bg-blue-600';
      case 'Lock':
      case 'Headphones':
        return 'group-hover:bg-[#ff7700]';
      case 'GitPullRequest':
      case 'LayoutDashboard':
        return 'group-hover:bg-emerald-600';
      default:
        return 'group-hover:bg-[#1E3A6E]';
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-[#181818] border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300" id="features">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-[#1E3A6E] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Civic-SaaS Platform Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Flawless Industrial Governance
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            DocFlow replaces isolated departmental siloes with connected intelligence, legal immutability, and statutory transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-[#222222] p-6 rounded-2xl border border-slate-200 dark:border-[#333333] shadow-xs hover:border-[#1E3A6E]/40 dark:hover:border-emerald-500/40 hover:bg-white dark:hover:bg-[#282828] transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors ${getHoverBg(feature.iconName)}`}>
                  {getFeatureIcon(feature.iconName)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1a1a1a] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                  {feature.tag}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
