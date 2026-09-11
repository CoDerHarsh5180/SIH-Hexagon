import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { Landmark, Search, ShieldCheck, Phone, Mail, UserCheck } from 'lucide-react';

export const LocalAuthsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const officers = [
    {
      id: 'AUTH-OFF-01',
      name: 'S. K. Kulkarni',
      designation: 'Scrutiny Officer (MPCB)',
      body: 'Maharashtra Pollution Control Board',
      district: 'Chhatrapati Sambhajinagar',
      phone: '+91 240 233 4455',
      email: 'sk.kulkarni@mpcb.gov.in',
      activeDockets: 28,
      status: 'ACTIVE'
    },
    {
      id: 'AUTH-OFF-02',
      name: 'Anand Patil',
      designation: 'Divisional Fire Officer',
      body: 'Maharashtra Fire Services / MIDC Wing',
      district: 'Pune',
      phone: '+91 20 2612 7881',
      email: 'anand.patil@midcfire.gov.in',
      activeDockets: 42,
      status: 'ACTIVE'
    },
    {
      id: 'AUTH-OFF-03',
      name: 'Dr. Neha Shinde',
      designation: 'Town Planning Assistant Director',
      body: 'Brihanmumbai Municipal Corporation (BMC)',
      district: 'Mumbai Suburban',
      phone: '+91 22 2262 0251',
      email: 'neha.shinde@mcgm.gov.in',
      activeDockets: 65,
      status: 'ACTIVE'
    },
    {
      id: 'AUTH-OFF-04',
      name: 'V. R. Deshmukh',
      designation: 'Executive Engineer (Water Works)',
      body: 'MIDC Water Works Division',
      district: 'Thane',
      phone: '+91 22 2534 7777',
      email: 'vr.deshmukh@midcindia.org',
      activeDockets: 19,
      status: 'ACTIVE'
    },
    {
      id: 'AUTH-OFF-05',
      name: 'Rajendra Joshi',
      designation: 'Joint Director of DISH',
      body: 'Directorate of Industrial Safety & Health',
      district: 'Nagpur',
      phone: '+91 712 256 0881',
      email: 'r.joshi@dish.maharashtra.gov.in',
      activeDockets: 31,
      status: 'ACTIVE'
    }
  ];

  const filtered = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="border-b border-border pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded border border-india-blue/20">
              Administrative Hierarchy
            </span>
            <span className="text-xs text-foreground/60">State Roster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Local Authorities & Designated Post Roster
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-0.5">
            Directory of field officers, municipal bodies, and regional inspectors authorized to issue clearances.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by officer, district, or body..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-india-blue"
            />
            <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((o) => (
          <div key={o.id} className="border border-border rounded-xl p-5 bg-background space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded border border-india-blue/20">
                  {o.id}
                </span>
                <span className="text-[10px] font-bold text-india-blue flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> {o.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">{o.name}</h3>
                <p className="text-xs text-foreground/70">{o.designation}</p>
                <p className="text-[11px] font-semibold text-foreground/50 mt-0.5">{o.body}</p>
              </div>

              <div className="pt-2 border-t border-border/60 text-xs space-y-1 font-mono text-foreground/70">
                <div>District: <strong className="font-sans text-foreground">{o.district}</strong></div>
                <div>Phone: <span className="text-foreground">{o.phone}</span></div>
                <div>Email: <span className="text-india-blue">{o.email}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-foreground/50">Active Queue:</span>
              <span className="font-mono font-bold text-foreground">{o.activeDockets} Applications</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalAuthsPage;
