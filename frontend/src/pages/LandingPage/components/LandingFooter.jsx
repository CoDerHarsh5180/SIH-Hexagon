import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-card text-card-foreground border-t border-border transition-colors duration-300">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Tier: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border">
          {/* Brand & Badges */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-india-orange/10 border border-india-orange/20 text-india-orange flex items-center justify-center font-bold text-sm">
                <Building2 className="w-4 h-4 text-india-orange" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                SAR<span className="text-india-orange">AL</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-india-blue/10 text-india-blue border border-india-blue/20">
                Single Window
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
              <strong className="text-foreground">SARAL</strong> (Streamlined Applications, Record and Approvals Link) — Single Window Industrial Clearance &amp; Regulatory Compliance Portal. Designed for businesses, factories, and entrepreneurs across Maharashtra.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1 font-semibold text-india-blue bg-muted px-2.5 py-1 rounded-md border border-border">
                <CheckCircle2 className="w-3.5 h-3.5" />
                State Portal Verified
              </span>
              <span>•</span>
              <span className="bg-muted px-2.5 py-1 rounded-md border border-border">
                Maharashtra RTS Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Portal Pages
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <button 
                  onClick={() => navigate('/approvals')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  Ask for Approval
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  Public Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/gov-benefits')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  Government Benefits &amp; Subsidies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/login')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  Applicant Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/register')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left font-semibold text-india-orange"
                >
                  New Business Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Redressal */}
          <div>
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Support &amp; Redressal
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <button 
                  onClick={() => navigate('/user/query')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  Helpdesk &amp; Queries
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/user/complain')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  Grievance Redressal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/user/feedback')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  Citizen Feedback
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/local-auth/requests')} 
                  className="hover:text-india-orange transition-colors cursor-pointer text-left"
                >
                  District Collectorates Desk
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-muted-foreground">
          <p>© 2026 SARAL (Streamlined Applications, Record and Approvals Link) Single Window System. Government of Maharashtra. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Online Services Node</span>
            <span>•</span>
            <span className="text-india-blue font-semibold">System Status: 100% Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
