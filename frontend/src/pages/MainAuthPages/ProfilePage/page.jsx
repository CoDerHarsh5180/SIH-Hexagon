import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui';
import { Landmark, ShieldCheck, Mail, Phone, Building, LogOut } from 'lucide-react';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';

export const MainAuthProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState({
    title: 'Principal Secretary (Industries)',
    subtitle: 'State Level Apex Clearances Cell',
    adminId: 'IAS-MH-ADMIN-01',
    department: 'Industries, Energy & Labour Department',
    office: 'Mantralaya, Madam Cama Road, Nariman Point, Mumbai 400032',
    email: 'psec.ind@maharashtra.gov.in',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        if (res?.data?.profile || res?.data?.admin) {
          setProfile((prev) => ({ ...prev, ...(res.data.profile || res.data.admin) }));
        }
      } catch (err) {
        console.warn('Using offline state admin profile fallback:', err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out from State Administrator console?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <PageHeader
          title="State Authority Headquarters Profile"
          subtitle="Principal Secretary and Headquarters State-Level Policy Administrator credentials."
          className="pb-0 border-b-0"
        />
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border text-foreground/70 hover:text-india-orange hover:border-india-orange/30 text-xs font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          title="Sign out of DocFlow"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border border-border rounded-xl bg-background p-6 space-y-4 text-xs">
          <div className="flex items-center space-x-3.5 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-xl bg-india-blue/10 border border-india-blue/30 flex items-center justify-center text-india-blue">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Principal Secretary (Industries)</h2>
              <p className="text-foreground/70">State Level Apex Clearances Cell</p>
              <span className="text-[10px] font-mono text-india-blue font-bold">IAS-MH-ADMIN-01</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-bold block">Department</span>
              <span className="text-foreground font-semibold">Industries, Energy & Labour Department</span>
            </div>
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-bold block">Headquarters Office</span>
              <span className="text-foreground/70">Mantralaya, Madam Cama Road, Nariman Point, Mumbai 400032</span>
            </div>
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-bold block">Email</span>
              <span className="text-india-blue font-mono">psec.ind@maharashtra.gov.in</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 border border-border rounded-xl bg-background p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-india-blue" />
              <h3 className="text-sm font-bold text-foreground">Administrative Privileges & Scope</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-india-blue/10 text-india-blue border border-india-blue/20">
              STATEWIDE ADMIN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-foreground/80">
            <div className="p-3 rounded-lg border border-border bg-border/10 space-y-1">
              <h4 className="font-bold text-foreground">Policy & Clearance Creation</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed">
                Publish new clearance mandates, update statutory fees, and set maximum SLA duration for all 36 districts.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-border/10 space-y-1">
              <h4 className="font-bold text-foreground">Scheme Ingestion</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed">
                Ingest government circular PDFs and deploy automated AI subsidy extraction for industrial promoters.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-border/10 space-y-1">
              <h4 className="font-bold text-foreground">Statutory Delay Overrides</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed">
                Intervene directly on delayed files, dispatch RTS notices, and enforce turnaround compliance.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-border/10 space-y-1">
              <h4 className="font-bold text-foreground">Unified Corporation Control</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed">
                Manage unified roles for municipal corporations handling both localized inspection and policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainAuthProfilePage;
