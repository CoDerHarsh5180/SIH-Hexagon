import React, { useState } from 'react';
import { PageHeader } from '../../components/ui';
import { Bell, Calendar, Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const NotificationsPage = () => {
  const [filter, setFilter] = useState('ALL');

  const notifications = [
    {
      id: 'NOTIF-01',
      title: 'Field Inspection Scheduled - MPCB',
      desc: 'Inspector Anand Patil has scheduled a site visit for Consent to Establish on 18 Sep 2026 at 11:00 AM.',
      date: 'Today, 10:30 AM',
      type: 'INSPECTION',
      unread: true,
      icon: Calendar,
      tag: 'Inspection'
    },
    {
      id: 'NOTIF-02',
      title: 'Statutory Renewal Window Active - Fire NOC',
      desc: 'Your Provisional Fire Safety NOC expires in 54 days. Submit Form-B compliance report before expiry.',
      date: 'Yesterday',
      type: 'RENEWAL',
      unread: true,
      icon: Clock,
      tag: 'Renewal'
    },
    {
      id: 'NOTIF-03',
      title: 'Auto-Escalation Warning - Water Sanction',
      desc: 'Application APP-MH-2026-89413 has exceeded 25 days of processing. Escalation alert sent to District Collector.',
      date: '05 Sep 2026',
      type: 'ESCALATION',
      unread: false,
      icon: ShieldAlert,
      tag: 'Escalation'
    },
    {
      id: 'NOTIF-04',
      title: 'Document Digitally Signed & Token Embedded',
      desc: 'Factory Building Plan Approval issued with QR token AUTH-DOC-89410-2026. Available in vault.',
      date: '01 Sep 2026',
      type: 'SYSTEM',
      unread: false,
      icon: CheckCircle2,
      tag: 'Approved'
    }
  ];

  const filtered = notifications.filter(
    (n) => filter === 'ALL' || n.type === filter
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <PageHeader
          title="Notification Center"
          subtitle="Real-time alerts on inspection schedules, document renewal windows, and SLA auto-escalations."
          className="pb-0 border-b-0"
        />

        <div className="flex bg-border/20 p-1 rounded-xl shrink-0">
          {['ALL', 'INSPECTION', 'RENEWAL', 'ESCALATION'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab ? 'bg-india-blue text-white shadow-xs' : 'text-foreground/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`border rounded-xl p-4 sm:p-5 flex items-start justify-between gap-4 transition-all ${
                item.unread
                  ? 'border-india-blue/30 bg-india-blue/5'
                  : 'border-border bg-background'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  item.unread ? 'bg-india-blue text-white' : 'bg-border/30 text-foreground/70'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{item.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-border text-foreground/60">
                      {item.tag}
                    </span>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-india-orange" />
                    )}
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed break-words">
                    {item.desc}
                  </p>
                  <span className="text-[10px] text-foreground/40 block font-mono">{item.date}</span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-foreground/40 shrink-0 hidden sm:block">
                {item.id}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
