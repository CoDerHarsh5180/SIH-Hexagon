import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { AlertTriangle, Send, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const ComplainPage = () => {
  const [complaintForm, setComplaintForm] = useState({
    applicationId: 'APP-MH-2026-89412',
    authority: 'Maharashtra Pollution Control Board (MPCB)',
    complaintType: 'SLA Exceeded / Stalled Review',
    subject: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const existingComplaints = [
    {
      id: 'CMP-2026-081',
      appId: 'APP-MH-2026-89412',
      authority: 'MPCB Sub-Regional Office',
      subject: 'Field Inspection delayed past 30-day statutory SLA',
      dateFiled: '2026-09-02',
      status: 'ESCALATED_TO_HQ',
      officerNote: 'Notice dispatched to Member Secretary for expedited hearing.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <PageHeader
        title="File Authority Grievance / Delay Report"
        subtitle="If you have submitted all requisite documentation and the local authority is delaying or ignoring your application past its SLA, file an official grievance here for auto-escalation to the Principal Secretary HQ."
      />

      {submitted && (
        <div className="bg-india-blue/10 border border-india-blue/30 text-foreground p-4 rounded-xl flex items-center space-x-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-india-blue shrink-0" />
          <span>Grievance filed successfully! Reference ID: CMP-2026-082. This file has been automatically escalated to the State Main Authority dashboard.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filing Form */}
        <div className="lg:col-span-2 border border-border rounded-xl bg-background p-5 sm:p-6 space-y-4">
          <div className="border-b border-border pb-3 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-india-orange" />
            <h2 className="text-sm sm:text-base font-bold text-foreground">Formal Grievance Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Target Application ID</label>
                <select
                  value={complaintForm.applicationId}
                  onChange={(e) => setComplaintForm({ ...complaintForm, applicationId: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
                >
                  <option value="APP-MH-2026-89412">APP-MH-2026-89412 (Consent to Establish)</option>
                  <option value="APP-MH-2026-89413">APP-MH-2026-89413 (Water Supply Sanction)</option>
                  <option value="APP-MH-2026-89414">APP-MH-2026-89414 (Provisional Fire NOC)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Issuing Authority Body</label>
                <select
                  value={complaintForm.authority}
                  onChange={(e) => setComplaintForm({ ...complaintForm, authority: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
                >
                  <option>Maharashtra Pollution Control Board (MPCB)</option>
                  <option>MIDC Industrial Development Wing</option>
                  <option>Directorate of Industrial Safety & Health (DISH)</option>
                  <option>Town Planning & Municipal Corporation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Grievance Category</label>
              <select
                value={complaintForm.complaintType}
                onChange={(e) => setComplaintForm({ ...complaintForm, complaintType: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
              >
                <option>SLA Exceeded / Stalled Review</option>
                <option>Uploaded Documents Ignored or Repeated Queries</option>
                <option>Unjustified Inspection Postponement</option>
                <option>Discrepancy in Fee Calculation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Grievance Subject</label>
              <input
                required
                type="text"
                placeholder="e.g. Field inspection pending for 45 days despite complete ETP installation"
                value={complaintForm.subject}
                onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Factual Chronology & Detailed Description</label>
              <textarea
                required
                rows={4}
                placeholder="Provide date of document upload, previous interactions with the desk officer, and reasons why delay affects operations..."
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-india-orange text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center space-x-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance to State Authority</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Grievances Sidebar */}
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-5 bg-background space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-india-blue" />
              <span>Filed Grievances</span>
            </h3>

            {existingComplaints.map((c) => (
              <div key={c.id} className="border border-border rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-india-blue">{c.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-india-orange/10 text-india-orange border border-india-orange/20">
                    {c.status}
                  </span>
                </div>
                <p className="font-bold text-foreground">{c.subject}</p>
                <p className="text-[11px] text-foreground/60">Against: {c.authority}</p>
                <div className="bg-border/20 p-2 rounded text-[11px] text-foreground/80 mt-1">
                  <strong>HQ Action:</strong> {c.officerNote}
                </div>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-xl p-4 bg-background text-xs space-y-2">
            <h4 className="font-bold text-foreground">Right to Public Services Act (RTS)</h4>
            <p className="text-foreground/70 leading-relaxed text-[11px]">
              Under Maharashtra RTS Act, all statutory approvals must be disposed of within the notified SLA timeline. Delays automatically trigger escalation to the First Appellate Authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplainPage;
