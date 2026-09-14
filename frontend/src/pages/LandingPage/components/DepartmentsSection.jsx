import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Flame, 
  Leaf, 
  Landmark, 
  Utensils, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { INTEGRATED_DEPARTMENTS } from '../data/landingData';

export const DepartmentsSection = () => {
  const navigate = useNavigate();

  const getDeptIcon = (iconName) => {
    const iconClass = "w-6 h-6 text-india-orange";
    switch (iconName) {
      case 'Leaf':
        return <Leaf className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'Building2':
        return <Building2 className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Landmark':
        return <Landmark className={iconClass} />;
      case 'Utensils':
        return <Utensils className={iconClass} />;
      default:
        return <Building2 className={iconClass} />;
    }
  };

  return (
    <section className="py-16 bg-background border-b border-border transition-colors duration-300" id="departments">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-india-orange text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Government Authorities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Integrated Maharashtra Departments
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connect directly with all key departments through a single platform without having to visit each office individually.
            </p>
          </div>

          <div className="text-xs font-semibold text-foreground bg-muted border border-border px-3.5 py-1.5 rounded-full self-start md:self-auto shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Desks Connected Online</span>
          </div>
        </div>

        {/* 6 Department Cards Row/Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INTEGRATED_DEPARTMENTS.map((dept, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/approvals/list', { state: { filterDept: dept.code } })}
              className="bg-card text-card-foreground p-5 rounded-xl border border-border shadow-xs flex flex-col items-center text-center hover:border-india-orange/60 hover:shadow-xs transition-all duration-200 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-india-orange/10 border border-india-orange/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {getDeptIcon(dept.iconName)}
              </div>

              <h4 className="text-sm font-bold text-foreground group-hover:text-india-orange transition-colors">
                {dept.code}
              </h4>
              <span className="text-[10px] font-semibold text-india-blue mt-0.5">
                {dept.tag}
              </span>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 h-8">
                {dept.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
