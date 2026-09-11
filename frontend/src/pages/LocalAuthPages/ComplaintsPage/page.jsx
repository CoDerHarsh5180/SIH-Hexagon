import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { ShieldAlert, CheckCircle2, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export const LocalAuthComplaintsPage = () => {
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-2026-081',
      appId: 'APP-MH-2026-89412',
      enterprise: 'Sahyadri Agro Foods Pvt. Ltd.',
      subject: 'Field Inspection delayed past 30-day statutory SLA',
      dateFiled: '2026-09-02',
      status: 'PENDING_OFFICER_REPLY',
      slaCountdown: '2 Days Remaining for Response',
      description: 'Factory ETP installation completed on 12 August. Site review is pending without communicated inspection dates.'
    }
  ]);

  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e) => {
    e.preventDefault();
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === activeReply.id ? { ...c, status: 'RESOLVED_WITH_INSPECTION' } : c
      )
    );
    alert('Resolution dispatched to applicant and logged with State HQ.');
    setActiveReply(null);
    setReplyText('');
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="border-b border-border pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-india-orange bg-india-orange/10 px-2 py-0.5 rounded border border-india-orange/20">
              Grievance Redressal
            </span>
            <span className="text-xs text-foreground/60">Local Authority Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Escalated Grievances & Delays
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-0.5">
            Complaints logged by applicants regarding delayed desk reviews or stalled field inspections in your jurisdiction.
          </p>
        </div>

        <div className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-border bg-border/10 text-foreground shrink-0">
          Open Tickets: <strong className="text-india-orange">{complaints.filter(c => c.status !== 'RESOLVED_WITH_INSPECTION').length}</strong>
        </div>
      </div>

      <div className="space-y-4">
        {complaints.map((c) => (
          <div key={c.id} className="border border-border rounded-xl p-5 bg-background space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs text-india-blue">{c.id}</span>
                  <span className="font-mono text-xs text-foreground/60">&bull; {c.appId}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mt-0.5">{c.subject}</h3>
                <p className="text-xs text-foreground/70">{c.enterprise}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  c.status === 'RESOLVED_WITH_INSPECTION'
                    ? 'bg-india-blue/10 text-india-blue border border-india-blue/20'
                    : 'bg-india-orange/10 text-india-orange border border-india-orange/20'
                }`}>
                  {c.status}
                </span>
                <span className="text-[10px] text-foreground/40 block mt-1 font-mono">{c.slaCountdown}</span>
              </div>
            </div>

            <p className="text-xs text-foreground/80 leading-relaxed bg-border/10 p-3 rounded-lg border border-border/50">
              {c.description}
            </p>

            <div className="flex items-center justify-end pt-1">
              {c.status !== 'RESOLVED_WITH_INSPECTION' ? (
                <button
                  onClick={() => setActiveReply(c)}
                  className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Provide Response & Schedule Inspection</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-india-blue flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Response Modal */}
      {activeReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-background border border-border w-full max-w-md rounded-xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">Respond to Grievance {activeReply.id}</h3>
              <button onClick={() => setActiveReply(null)} className="text-foreground/60 hover:text-foreground cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Official Response & Action Taken</label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="State the proposed inspection date, officer designated, and reasons for prior delay..."
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button type="button" onClick={() => setActiveReply(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-border cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-india-blue text-white font-bold hover:opacity-90 cursor-pointer">Dispatch Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalAuthComplaintsPage;
