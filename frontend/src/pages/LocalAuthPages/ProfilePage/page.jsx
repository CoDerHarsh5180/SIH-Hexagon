import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { Landmark, KeyRound, CheckCircle2, Phone, Mail, ShieldCheck } from 'lucide-react';

export const LocalAuthProfilePage = () => {
  const [officerData, setOfficerData] = useState({
    officerName: 'S. K. Kulkarni',
    designation: 'Scrutiny & Verification Officer',
    govEmployeeId: 'MH-GOV-8821',
    authorityBody: 'Maharashtra Pollution Control Board (MPCB)',
    assignedDistrict: 'Chhatrapati Sambhajinagar (Aurangabad)',
    officeAddress: 'Regional Office, Paryavaran Bhavan, Station Road, Aurangabad 431005',
    contactEmail: 'sk.kulkarni@mpcb.gov.in',
    contactPhone: '+91 240 233 4455',
    dscTokenId: 'DSC-TOKEN-AUR-8821',
    dscExpiry: '24 March 2027',
    dscStatus: 'ACTIVE & VERIFIED'
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <PageHeader
        title="Local Authority Officer Profile"
        subtitle="Verification officer credentials, jurisdiction, and active Digital Signature Certificate (DSC) token status."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Officer Card */}
        <div className="border border-border rounded-xl bg-background p-6 space-y-4 text-xs">
          <div className="flex items-center space-x-3.5 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-xl bg-india-blue/10 border border-india-blue/30 flex items-center justify-center text-india-blue">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">{officerData.officerName}</h2>
              <p className="text-foreground/70">{officerData.designation}</p>
              <span className="text-[10px] font-mono text-india-blue font-bold">{officerData.govEmployeeId}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-bold block">Authority Department</span>
              <span className="text-foreground font-semibold">{officerData.authorityBody}</span>
            </div>
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-bold block">Jurisdiction District</span>
              <span className="text-foreground font-semibold">{officerData.assignedDistrict}</span>
            </div>
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-bold block">Official Office</span>
              <span className="text-foreground/70">{officerData.officeAddress}</span>
            </div>
          </div>
        </div>

        {/* Digital Signature Details */}
        <div className="lg:col-span-2 border border-border rounded-xl bg-background p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-india-blue" />
              <h3 className="text-sm font-bold text-foreground">Cryptographic Digital Signature (DSC)</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-india-blue/10 text-india-blue border border-india-blue/20">
              {officerData.dscStatus}
            </span>
          </div>

          <p className="text-foreground/70 leading-relaxed">
            All approvals granted by this account will automatically embed this cryptographic DSC token and an authenticated QR code. When scanned by AI or inspectors, it confirms official clearance under Maharashtra industrial bylaws.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border rounded-xl p-4 bg-border/10 font-mono">
            <div>
              <span className="text-[10px] uppercase text-foreground/50 font-sans block font-bold">DSC Hardware Token ID</span>
              <span className="text-xs font-bold text-foreground mt-0.5 block">{officerData.dscTokenId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-foreground/50 font-sans block font-bold">Certificate Expiry</span>
              <span className="text-xs font-bold text-foreground mt-0.5 block">{officerData.dscExpiry}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2 text-foreground/60 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-india-blue shrink-0" />
            <span>Complies with IT Act 2000 & Controller of Certifying Authorities (CCA) India.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalAuthProfilePage;
