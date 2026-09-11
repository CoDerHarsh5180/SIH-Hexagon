import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  FileCheck2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  PlusCircle, 
  Search, 
  Award, 
  FileText, 
  Sparkles 
} from 'lucide-react';

export const UserDashboardPage = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Active Approvals', count: '4', subtitle: 'In inter-authority pipeline', color: 'text-india-blue', border: 'border-india-blue/30', bg: 'bg-india-blue/5' },
    { title: 'Issued Clearances', count: '5', subtitle: 'Valid & in document vault', color: 'text-foreground', border: 'border-border', bg: 'bg-background' },
    { title: 'Action Required', count: '2', subtitle: 'Expiring or revision needed', color: 'text-india-orange', border: 'border-india-orange/30', bg: 'bg-india-orange/5' },
    { title: 'Eligible Subsidies', count: '3', subtitle: 'State incentive schemes', color: 'text-india-blue', border: 'border-india-blue/20', bg: 'bg-india-blue/5' },
  ];

  const quickActions = [
    {
      title: 'Know Your Approvals',
      desc: '3-step AI assessment to discover all clearances, permits & NOCs needed for your factory setup.',
      path: '/user/approvals',
      btnText: 'Start Assessment',
      icon: Sparkles,
      highlight: true
    },
    {
      title: 'Track Pipeline',
      desc: 'View real-time status, officer contact details, and inspection schedules for your active applications.',
      path: '/user/track',
      btnText: 'Track Status',
      icon: Clock,
      highlight: false
    },
    {
      title: 'Document Vault',
      desc: 'Access all issued certificates with QR verification tokens, download PDFs, and monitor renewals.',
      path: '/user/your-docs',
      btnText: 'Open Vault',
      icon: FileText,
      highlight: false
    },
    {
      title: 'Custom Apply',
      desc: 'Directly search and apply for specific clearances across any Maharashtra district authority.',
      path: '/user/custom-docs-apply',
      btnText: 'Browse Catalog',
      icon: Search,
      highlight: false
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Enterprise Welcome Banner */}
      <div className="border border-border rounded-2xl bg-background p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
                ENT-MH-440912
              </span>
              <span className="text-xs text-foreground/60 uppercase tracking-wider font-semibold">
                MIDC Shendra Phase 2 &bull; Chhatrapati Sambhajinagar
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Sahyadri Agro Foods Pvt. Ltd.
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Industrial Single-Window Compliance Hub. Track statutory permits, schedule field inspections, and claim state industrial incentives.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/user/approvals')}
              className="px-4 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply Clearances</span>
            </button>
            <button
              onClick={() => navigate('/user/gov-benefits')}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-border transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-india-orange" />
              <span>Incentives Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`border ${s.border} ${s.bg} rounded-xl p-4 transition-all`}>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-foreground/60 block">
              {s.title}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-2xl sm:text-3xl font-bold font-mono ${s.color}`}>
                {s.count}
              </span>
            </div>
            <p className="text-[11px] text-foreground/50 mt-1 truncate">{s.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-foreground">Key Workflows</h2>
          <span className="text-xs text-foreground/50">Single click entry points</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                className={`border rounded-xl p-5 flex flex-col justify-between transition-all ${
                  action.highlight
                    ? 'border-india-blue/40 bg-india-blue/5'
                    : 'border-border bg-background hover:border-foreground/20'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-background border border-border text-india-blue">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{action.title}</h3>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-end">
                  <button
                    onClick={() => navigate(action.path)}
                    className="text-xs font-bold text-india-blue hover:text-india-blue/80 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{action.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
