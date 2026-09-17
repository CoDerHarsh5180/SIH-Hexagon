import React, { useState, useEffect } from 'react';
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
  Sparkles,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { applicationsService, vaultService, benefitsService, authService } from '../../../services';

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({
    active: 0,
    issued: 0,
    pending: 0,
    subsidies: 0,
  });

  useEffect(() => {
    // Load dynamic metrics
    const fetchDashboardMetrics = async () => {
      try {
        const [profRes, appsRes, vaultRes, pendingRes, benefitsRes] = await Promise.allSettled([
          authService.getProfile(),
          applicationsService.getUserApplications(),
          vaultService.getVaultDocuments(),
          vaultService.getPendingDocuments(),
          benefitsService.getSchemes(),
        ]);

        if (profRes.status === 'fulfilled' && profRes.value?.data) {
          const p = profRes.value.data.enterprise || profRes.value.data.user || profRes.value.data;
          setProfile(p);
        }

        setCounts({
          active: appsRes.status === 'fulfilled' && Array.isArray(appsRes.value?.data)
            ? appsRes.value.data.length
            : 0,
          issued: vaultRes.status === 'fulfilled' && Array.isArray(vaultRes.value?.data)
            ? vaultRes.value.data.length
            : 0,
          pending: pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value?.data)
            ? pendingRes.value.data.length
            : 0,
          subsidies: benefitsRes.status === 'fulfilled' && Array.isArray(benefitsRes.value?.data)
            ? benefitsRes.value.data.length
            : 0,
        });
      } catch (err) {
        console.warn('[UserDashboard] Metrics fetch error:', err.message);
      }
    };

    fetchDashboardMetrics();
  }, []);

  const isProfileIncomplete = profile?.profileStatus === 'INCOMPLETE' || (profile?.profileCompletion && profile.profileCompletion < 80);

  const stats = [
    { title: 'Active Approvals', count: String(counts.active), subtitle: 'Under review by government', color: 'text-india-blue', border: 'border-india-blue/30', bg: 'bg-india-blue/5' },
    { title: 'Approved Certificates', count: String(counts.issued), subtitle: 'Available in Document Locker', color: 'text-foreground', border: 'border-border', bg: 'bg-background' },
    { title: 'Action Needed', count: String(counts.pending), subtitle: 'Officer asked for changes / Expiring', color: 'text-india-orange', border: 'border-india-orange/30', bg: 'bg-india-orange/5' },
    { title: 'Eligible Subsidies', count: String(counts.subsidies), subtitle: 'Government subsidies you can get', color: 'text-india-blue', border: 'border-india-blue/20', bg: 'bg-india-blue/5' },
  ];

  const quickActions = [
    {
      title: 'Know Your Approvals',
      desc: 'Answer a few simple questions to find all government approvals, NOCs & fees needed for your factory.',
      path: '/user/approvals',
      btnText: 'Find My Approvals',
      icon: Sparkles,
      highlight: true
    },
    {
      title: 'Track Applications',
      desc: 'Check current status of your submitted applications, officer remarks, and inspection dates.',
      path: '/user/track',
      btnText: 'Check Status',
      icon: Clock,
      highlight: false
    },
    {
      title: 'Document Locker',
      desc: 'View and download all your approved government certificates, licenses, and factory papers.',
      path: '/user/your-docs',
      btnText: 'Open Locker',
      icon: FileText,
      highlight: false
    },
    {
      title: 'Apply for Specific NOC',
      desc: 'Directly search and apply for any specific license or department clearance in Maharashtra.',
      path: '/user/custom-docs-apply',
      btnText: 'Browse Licenses',
      icon: Search,
      highlight: false
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Profile Incomplete Action Callout */}
      {isProfileIncomplete && (
        <div className="border border-india-orange/30 bg-india-orange/5 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-india-orange/10 text-india-orange border border-india-orange/20 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Your Profile is Incomplete ({profile?.profileCompletion || 20}% Complete)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-india-orange text-white uppercase tracking-wider">
                  Action Needed
                </span>
              </div>
              <p className="text-xs text-foreground/70 mt-1 leading-relaxed max-w-2xl">
                Government approvals need your business documents. Please upload your PAN, Aadhaar, Land Papers (7/12 Satbara / Lease), and Udyam Registration (if registered) to easily apply for clearances.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/user/profile')}
            className="px-4 py-2.5 rounded-xl bg-india-orange text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-center"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Complete Profile Now</span>
          </button>
        </div>
      )}

      {/* Enterprise Welcome Banner */}
      <div className="border border-border rounded-2xl bg-background p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
                {profile?.businessId || (profile?._id ? `ENT-MH-${profile._id.slice(-6).toUpperCase()}` : 'ENT-MH-NEW')}
              </span>
              <span className="text-xs text-foreground/60 uppercase tracking-wider font-semibold">
                {profile?.location?.area ? `${profile.location.area} • ${profile.location.district}` : (profile?.district ? `${profile.district} • Maharashtra` : 'Maharashtra')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {profile?.factoryName || profile?.companyName || profile?.name || 'Industrial Enterprise'}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Single-Window Portal for your factory. Apply for government licenses, track officer approvals, and claim state subsidies.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/user/approvals')}
              className="px-4 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Find Required Approvals</span>
            </button>
            <button
              onClick={() => navigate('/user/gov-benefits')}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-border transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-india-orange" />
              <span>Check Subsidies</span>
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
          <h2 className="text-sm sm:text-base font-bold text-foreground">What would you like to do?</h2>
          <span className="text-xs text-foreground/50">Choose an option below</span>
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
