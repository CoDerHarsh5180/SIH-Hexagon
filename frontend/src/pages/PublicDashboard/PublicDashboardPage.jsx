import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw
} from 'lucide-react';
import LandingNavbar from '../LandingPage/components/LandingNavbar';
import LandingFooter from '../LandingPage/components/LandingFooter';
import { publicDashboardService, DEFAULT_PUBLIC_DASHBOARD_DATA } from '../../services/publicDashboardService';

export const PublicDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('6M'); // '3M' | '6M' | '1Y'
  const [selectedStatusSegment, setSelectedStatusSegment] = useState(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Live state fetched from API (with seamless initial default)
  const [dashboardData, setDashboardData] = useState(DEFAULT_PUBLIC_DASHBOARD_DATA);

  // Fetch full metrics on mount
  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await publicDashboardService.getPublicMetrics();
        if (isMounted && data) {
          setDashboardData(prev => ({
            ...prev,
            ...data,
            metrics: { ...prev.metrics, ...(data.metrics || {}) },
          }));
        }
      } catch (err) {
        console.error('Failed to load public dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMetrics();
    return () => { isMounted = false; };
  }, []);

  // Handle timeframe change for monthly velocity
  const handleTimeframeChange = async (timeframe) => {
    setActiveTimeframe(timeframe);
    try {
      const velocityData = await publicDashboardService.getMonthlyVelocity(timeframe);
      if (Array.isArray(velocityData)) {
        setDashboardData(prev => ({
          ...prev,
          monthlyVelocity: velocityData,
        }));
      }
    } catch (err) {
      console.warn('Failed to switch timeframe:', err);
    }
  };

  const { metrics, monthlyVelocity = [], statusDistribution = [], departments = [], districts = [] } = dashboardData;

  // 4 Core KPI definitions
  const kpiCards = [
    {
      title: 'Total Applications Received',
      value: (metrics?.totalReceived || 18450).toLocaleString('en-IN'),
      change: '+12.4% this month',
      subtitle: 'Submitted across all 36 districts',
      color: 'text-india-blue',
      borderColor: 'border-india-blue/30',
      bgColor: 'bg-india-blue/10',
      icon: FileText,
    },
    {
      title: 'Under Scrutiny & Review',
      value: (metrics?.inProgress || 2840).toLocaleString('en-IN'),
      change: `${metrics?.totalReceived ? ((metrics.inProgress / metrics.totalReceived) * 100).toFixed(1) : '15.4'}% of total`,
      subtitle: 'Currently being verified by desk officers',
      color: 'text-india-orange',
      borderColor: 'border-india-orange/30',
      bgColor: 'bg-india-orange/10',
      icon: Clock,
    },
    {
      title: 'Approved & Issued',
      value: (metrics?.approved || 14690).toLocaleString('en-IN'),
      change: `${metrics?.totalReceived ? ((metrics.approved / metrics.totalReceived) * 100).toFixed(1) : '79.6'}% clearance rate`,
      subtitle: 'Official digital certificates issued with QR',
      color: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/10',
      icon: CheckCircle2,
    },
    {
      title: 'Rejected / Incomplete',
      value: (metrics?.rejected || 920).toLocaleString('en-IN'),
      change: `${metrics?.totalReceived ? ((metrics.rejected / metrics.totalReceived) * 100).toFixed(1) : '5.0'}% query rate`,
      subtitle: 'Sent back for document clarification',
      color: 'text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-500/30',
      bgColor: 'bg-rose-500/10',
      icon: AlertTriangle,
    },
  ];

  // Donut chart calculations
  const totalDockets = statusDistribution.reduce((acc, s) => acc + (s.count || 0), 0) || 18450;
  const circumference = 2 * Math.PI * 100; // ~628.3

  let cumulativePct = 0;
  const donutSegments = statusDistribution.map((seg) => {
    const strokeDash = `${(seg.pct / 100) * circumference} ${circumference}`;
    const strokeOffset = `-${(cumulativePct / 100) * circumference}`;
    cumulativePct += seg.pct;
    return {
      ...seg,
      strokeDash,
      strokeOffset,
    };
  });

  const maxReceived = Math.max(...monthlyVelocity.map(d => d.received), 3000);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans transition-colors duration-300">
      <LandingNavbar />

      <main className="flex-grow max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Link to="/" className="hover:text-india-orange flex items-center gap-1 font-medium transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-foreground">Public Transparency Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <span>Public Transparency Dashboard</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-india-blue/10 text-india-blue border border-india-blue/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Public Data
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
              Real-time public statistics under the Maharashtra Right to Public Services Act. All state industrial clearances, review velocity, and departmental performance are updated continuously.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => navigate('/approvals')}
              className="px-4 py-2 bg-india-orange hover:bg-india-orange/90 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask for Approvals</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-card hover:bg-muted text-foreground border border-border font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-india-blue" />
              <span>Officer Login</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {kpiCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-all hover:border-india-orange/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.title}
                  </span>
                  <div className={`p-2 rounded-lg ${item.bgColor} ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-extrabold font-mono tracking-tight ${item.color}`}>
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    files
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground">
                    {item.change}
                  </span>
                  <span className="text-muted-foreground truncate max-w-[150px]">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visualizations Row (Monthly Trend Bar Chart + Donut Status Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Inflow & Clearance Velocity */}
          <div className="lg:col-span-8 bg-card text-card-foreground p-6 rounded-xl border border-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-india-blue/10 text-india-blue">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Document Processing Velocity
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Applications received vs approved vs rejected by month
                    </p>
                  </div>
                </div>

                {/* Legend & Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-india-blue"></span>
                    <span className="text-muted-foreground font-medium">Received</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
                    <span className="text-muted-foreground font-medium">Approved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-rose-500"></span>
                    <span className="text-muted-foreground font-medium">Rejected</span>
                  </div>

                  <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 ml-2">
                    {['3M', '6M', '1Y'].map(t => (
                      <button
                        key={t}
                        onClick={() => handleTimeframeChange(t)}
                        className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          activeTimeframe === t 
                            ? 'bg-card text-foreground shadow-xs font-bold' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pure SVG/CSS Bar Chart Canvas */}
              <div className="mt-6 pt-4">
                <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-4 border-b border-border">
                  {monthlyVelocity.map((d, i) => {
                    const receivedHeight = Math.round((d.received / maxReceived) * 220);
                    const approvedHeight = Math.round((d.approved / maxReceived) * 220);
                    const rejectedHeight = Math.max(Math.round((d.rejected / maxReceived) * 220), 8);
                    const isHovered = hoveredBarIndex === i;

                    return (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative"
                        onMouseEnter={() => setHoveredBarIndex(i)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-20 z-30 bg-card text-card-foreground text-[11px] rounded-lg p-2.5 shadow-xl border border-border min-w-[140px] pointer-events-none animate-in fade-in zoom-in-95">
                            <p className="font-bold border-b border-border pb-1 mb-1 text-india-orange">{d.month}</p>
                            <div className="flex justify-between gap-2">
                              <span>Received:</span>
                              <span className="font-mono font-bold text-india-blue">{d.received}</span>
                            </div>
                            <div className="flex justify-between gap-2 text-emerald-600 dark:text-emerald-400">
                              <span>Approved:</span>
                              <span className="font-mono font-bold">{d.approved}</span>
                            </div>
                            <div className="flex justify-between gap-2 text-rose-600 dark:text-rose-400">
                              <span>Rejected:</span>
                              <span className="font-mono font-bold">{d.rejected}</span>
                            </div>
                          </div>
                        )}

                        {/* Bar Cluster */}
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                          {/* Received Bar */}
                          <div 
                            style={{ height: `${receivedHeight}px` }} 
                            className={`w-3 sm:w-5 bg-india-blue rounded-t-sm transition-all ${isHovered ? 'opacity-100 scale-y-105' : 'opacity-85'}`}
                          />
                          {/* Approved Bar */}
                          <div 
                            style={{ height: `${approvedHeight}px` }} 
                            className={`w-3 sm:w-5 bg-emerald-500 rounded-t-sm transition-all ${isHovered ? 'opacity-100 scale-y-105' : 'opacity-85'}`}
                          />
                          {/* Rejected Bar */}
                          <div 
                            style={{ height: `${rejectedHeight}px` }} 
                            className={`w-2 sm:w-3 bg-rose-500 rounded-t-sm transition-all ${isHovered ? 'opacity-100' : 'opacity-70'}`}
                          />
                        </div>

                        {/* Month Label */}
                        <span className="text-[11px] font-semibold text-muted-foreground mt-2 truncate w-full text-center">
                          {d.month.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Graph Summary Footer */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1 text-india-blue font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Average clearance turnaround reduced from 28 days to 4.2 days</span>
                  </span>
                  <span>Source: Maharashtra State RTS Portal Node</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown (Interactive Donut Chart) */}
          <div className="lg:col-span-4 bg-card text-card-foreground p-6 rounded-xl border border-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <div className="p-2 rounded-lg bg-india-orange/10 text-india-orange">
                  <PieChartIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Status Distribution
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Breakdown of {(metrics?.totalReceived || 18450).toLocaleString('en-IN')} total applications
                  </p>
                </div>
              </div>

              {/* Donut Chart SVG */}
              <div className="my-6 flex flex-col items-center justify-center relative">
                <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 240 240">
                  {/* Background Track */}
                  <circle
                    cx="120"
                    cy="120"
                    r="100"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="28"
                    className="text-muted/40"
                  />

                  {/* Segments */}
                  {donutSegments.map((segment, idx) => (
                    <circle
                      key={idx}
                      cx="120"
                      cy="120"
                      r="100"
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth={selectedStatusSegment === idx ? '34' : '28'}
                      strokeDasharray={segment.strokeDash}
                      strokeDashoffset={segment.strokeOffset}
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      onMouseEnter={() => setSelectedStatusSegment(idx)}
                      onMouseLeave={() => setSelectedStatusSegment(null)}
                    />
                  ))}
                </svg>

                {/* Center Stat */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-2xl font-extrabold font-mono text-foreground">
                    {selectedStatusSegment !== null 
                      ? `${donutSegments[selectedStatusSegment].pct}%` 
                      : '79.6%'}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {selectedStatusSegment !== null 
                      ? donutSegments[selectedStatusSegment].name 
                      : 'Clearance Rate'}
                  </span>
                </div>
              </div>

              {/* Segment Legend */}
              <div className="space-y-2.5">
                {donutSegments.map((seg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                      selectedStatusSegment === idx 
                        ? 'bg-muted border-border scale-[1.02]' 
                        : 'border-border/60 hover:bg-muted/40'
                    }`}
                    onMouseEnter={() => setSelectedStatusSegment(idx)}
                    onMouseLeave={() => setSelectedStatusSegment(null)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }}></span>
                      <span className="text-xs font-semibold text-foreground">
                        {seg.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-foreground block">
                        {seg.count.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {seg.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Departmental Performance Matrix */}
        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Departmental Clearance Matrix
              </h2>
              <p className="text-xs text-muted-foreground">
                Performance breakdown across all integrated state departments
              </p>
            </div>
            <span className="text-xs font-bold text-india-blue bg-india-blue/10 border border-india-blue/20 px-3 py-1 rounded-full self-start sm:self-auto">
              Statewide Timely Resolution: 94.2%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 font-semibold">Department / Agency</th>
                  <th className="py-3 font-semibold">Total Received</th>
                  <th className="py-3 font-semibold">Approved &amp; Signed</th>
                  <th className="py-3 font-semibold">In Progress</th>
                  <th className="py-3 font-semibold">Deficiencies</th>
                  <th className="py-3 font-semibold">Average Time</th>
                  <th className="py-3 font-semibold">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departments.map((dept, i) => (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-india-orange font-bold">
                          {dept.code}
                        </span>
                        <span>{dept.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-foreground">
                      {dept.received.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {dept.approved.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-india-orange">
                      {dept.inProgress}
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-rose-600 dark:text-rose-400">
                      {dept.rejected}
                    </td>
                    <td className="py-3.5 font-mono text-muted-foreground">
                      {dept.avgSla}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-india-blue/10 text-india-blue border border-india-blue/20">
                        {dept.compliance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* District Clearances Table */}
        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                District Level Industrial Clearance Velocity
              </h2>
              <p className="text-xs text-muted-foreground">
                Application throughput reported across major industrial corridors and MIDC clusters
              </p>
            </div>
            <button
              onClick={() => navigate('/approvals')}
              className="text-xs font-bold text-india-orange hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Explore Approvals by District</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 font-semibold">District Hub</th>
                  <th className="py-3 font-semibold">Key Industrial Clusters</th>
                  <th className="py-3 font-semibold">Total Logged</th>
                  <th className="py-3 font-semibold">Approved</th>
                  <th className="py-3 font-semibold">In Progress</th>
                  <th className="py-3 font-semibold">Turnaround</th>
                  <th className="py-3 font-semibold">On-Time Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {districts.map((dist, i) => (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 font-bold text-foreground">{dist.name}</td>
                    <td className="py-3.5 text-muted-foreground">{dist.cluster}</td>
                    <td className="py-3.5 font-mono font-bold text-foreground">{dist.total}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{dist.approved}</td>
                    <td className="py-3.5 font-mono text-india-orange">{dist.inProgress}</td>
                    <td className="py-3.5 font-mono text-muted-foreground">{dist.turnaround}</td>
                    <td className="py-3.5">
                      <span className="font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded text-[11px] border border-india-blue/20">
                        {dist.compliance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA Row (Clean, Bordered, No Gradients) */}
        <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-india-orange">
              Get Started with SARAL
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Ready to Apply for Clearances for Your Business?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Use the Ask for Approvals guide to check the exact licenses you need, calculate government fees, and claim state subsidies online.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/approvals')}
              className="px-6 py-3 bg-india-orange hover:bg-india-orange/90 text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-xs cursor-pointer"
            >
              Ask for Approvals
            </button>
            <button
              onClick={() => navigate('/gov-benefits')}
              className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground border border-border font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer"
            >
              Explore Subsidies
            </button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PublicDashboardPage;
