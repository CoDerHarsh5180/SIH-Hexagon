import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  PlusCircle, 
  Award, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { mainAuthService } from '../../../services/mainAuthService';

export const MainAuthDashboardPage = () => {
  const navigate = useNavigate();

  const [stateMetrics, setStateMetrics] = useState([
    { title: 'Total Applications', count: '14,820', subtitle: 'All districts (FY 2026-27)', color: 'text-foreground' },
    { title: 'Issued Approvals', count: '12,410', subtitle: '83.7% statutory clearance rate', color: 'text-india-blue' },
    { title: 'Active in Queue', count: '1,985', subtitle: 'Across 36 district desks', color: 'text-foreground' },
    { title: 'Escalated Delays', count: '425', subtitle: 'Exceeded SLA deadline', color: 'text-india-orange' },
  ]);

  const [districtPerformances, setDistrictPerformances] = useState([
    { district: 'Pune', total: '4,120', approved: '3,650', avgTurnaround: '18 Days', compliance: '94%' },
    { district: 'Thane', total: '3,210', approved: '2,810', avgTurnaround: '21 Days', compliance: '91%' },
    { district: 'Chhatrapati Sambhajinagar', total: '2,480', approved: '2,110', avgTurnaround: '16 Days', compliance: '95%' },
    { district: 'Nagpur', total: '1,890', approved: '1,540', avgTurnaround: '24 Days', compliance: '88%' },
    { district: 'Nashik', total: '1,720', approved: '1,420', avgTurnaround: '22 Days', compliance: '89%' },
  ]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await mainAuthService.getAnalytics();
        if (res?.data) {
          if (res.data.stateMetrics) setStateMetrics(res.data.stateMetrics);
          if (res.data.districtPerformances) setDistrictPerformances(res.data.districtPerformances);
        }
      } catch (err) {
        console.warn('Using offline state analytics fallback:', err.message);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* State Admin Header */}
      <div className="border border-border rounded-2xl bg-background p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
                STATE HQ HEADQUARTERS
              </span>
              <span className="text-xs text-foreground/60 uppercase tracking-wider font-semibold">
                Principal Secretary &bull; Industries Dept
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              State-Wide Single Window Oversight Console
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Real-time monitoring of all industrial clearances, auto-escalations for stalled applications, and catalog policy governance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/main-auth/add-new')}
              className="px-4 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Approval Rule / Scheme</span>
            </button>
            <button
              onClick={() => navigate('/main-auth/complaints')}
              className="px-4 py-2.5 rounded-xl border border-india-orange/30 bg-india-orange/10 text-india-orange text-xs font-bold hover:bg-india-orange/20 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Delay Interventions (425)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stateMetrics.map((m, idx) => (
          <div key={idx} className="border border-border rounded-xl p-4 bg-background">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-foreground/60 block">
              {m.title}
            </span>
            <span className={`text-2xl sm:text-3xl font-bold font-mono ${m.color} block mt-1`}>
              {m.count}
            </span>
            <p className="text-[11px] text-foreground/50 mt-1 truncate">{m.subtitle}</p>
          </div>
        ))}
      </div>

      {/* District Clearance Performance Table */}
      <div className="border border-border rounded-xl bg-background p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">District Level Turnaround & SLA Adherence</h2>
            <p className="text-xs text-foreground/50">Performance metrics reported under RTS Act</p>
          </div>
          <button
            onClick={() => navigate('/main-auth/local-auths')}
            className="text-xs font-bold text-india-blue hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Authorities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-[11px] uppercase tracking-wider text-foreground/50">
                <th className="pb-3 font-semibold">District Hub</th>
                <th className="pb-3 font-semibold">Total Dockets</th>
                <th className="pb-3 font-semibold">Approved & Signed</th>
                <th className="pb-3 font-semibold">Avg Turnaround</th>
                <th className="pb-3 font-semibold">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {districtPerformances.map((d, i) => (
                <tr key={i} className="hover:bg-border/10 transition-colors">
                  <td className="py-3 font-bold text-foreground">{d.district}</td>
                  <td className="py-3 font-mono text-foreground/70">{d.total}</td>
                  <td className="py-3 font-mono text-india-blue font-semibold">{d.approved}</td>
                  <td className="py-3 font-mono text-foreground/80">{d.avgTurnaround}</td>
                  <td className="py-3">
                    <span className="font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded text-[11px]">
                      {d.compliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainAuthDashboardPage;
