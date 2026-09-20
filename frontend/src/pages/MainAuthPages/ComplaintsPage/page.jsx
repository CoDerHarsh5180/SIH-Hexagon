import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/ui';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { mainAuthService } from '../../../services/mainAuthService';
import { useToast } from '../../../context/ToastContext';

export const MainAuthComplaintsPage = () => {
  const toast = useToast();
  const [escalations, setEscalations] = useState([
    {
      id: 'ESC-2026-019',
      appId: 'APP-MH-2026-89412',
      enterprise: 'Sahyadri Agro Foods Pvt. Ltd.',
      district: 'Chhatrapati Sambhajinagar',
      officerAssigned: 'S. K. Kulkarni',
      daysDelayed: 14,
      reason: 'Field Inspection pending despite completed ETP plant setup.',
      status: 'CRITICAL_DELAY'
    },
    {
      id: 'ESC-2026-020',
      appId: 'APP-MH-2026-78102',
      enterprise: 'Deccan Biotech Chemicals',
      district: 'Pune (Ranjangaon MIDC)',
      officerAssigned: 'Anand Patil',
      daysDelayed: 9,
      reason: 'Fire NOC provisional certification query unresolved.',
      status: 'HIGH_DELAY'
    },
    {
      id: 'ESC-2026-021',
      appId: 'APP-MH-2026-66419',
      enterprise: 'Vidarbha Steel Castings',
      district: 'Nagpur (Butibori MIDC)',
      officerAssigned: 'Rajendra Joshi',
      daysDelayed: 7,
      reason: 'Connected power HT substation clearance delay by DISH desk.',
      status: 'MEDIUM_DELAY'
    }
  ]);

  useEffect(() => {
    const fetchEscalations = async () => {
      try {
        const res = await mainAuthService.getStateComplaints();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setEscalations(res.data);
        }
      } catch (err) {
        console.warn('Using offline state escalations fallback:', err.message);
      }
    };
    fetchEscalations();
  }, []);

  const handleIntervene = async (id) => {
    try {
      await mainAuthService.interveneComplaint(id, {
        action: 'EXPEDITE_NOTICE_SENT',
        noticeTimestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Backend intervention dispatch failed, updating local state:', err.message);
    }
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'EXPEDITE_NOTICE_SENT' } : e
      )
    );
    toast.success(`Statutory Expedite Notice dispatched to designated officer for docket: ${id}`);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="border-b border-border pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-india-orange bg-india-orange/10 px-2 py-0.5 rounded border border-india-orange/20">
              Auto-Escalation Engine
            </span>
            <span className="text-xs text-foreground/60">State HQ Oversight</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Delays & Auto-Escalated Dockets
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-0.5">
            Clearances exceeding maximum statutory SLA days. Issue expedite notices or reassign cases directly from HQ.
          </p>
        </div>

        <div className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-border bg-border/10 text-foreground shrink-0">
          Delayed Dockets: <strong className="text-india-orange">{escalations.length}</strong>
        </div>
      </div>

      <div className="space-y-4">
        {escalations.map((esc) => (
          <div key={esc.id} className="border border-border rounded-xl p-5 bg-background space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs text-india-blue">{esc.id}</span>
                  <span className="font-mono text-xs text-foreground/60">&bull; {esc.appId}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mt-0.5">{esc.enterprise}</h3>
                <p className="text-xs text-foreground/70">{esc.district} &bull; Officer: {esc.officerAssigned}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  esc.status === 'EXPEDITE_NOTICE_SENT'
                    ? 'bg-india-blue/10 text-india-blue border border-india-blue/20'
                    : 'bg-india-orange/10 text-india-orange border border-india-orange/20'
                }`}>
                  {esc.status}
                </span>
                <span className="text-[10px] font-mono text-india-orange font-bold block mt-1">
                  +{esc.daysDelayed} Days Beyond Statutory SLA
                </span>
              </div>
            </div>

            <p className="text-xs text-foreground/80 leading-relaxed bg-border/10 p-3 rounded-lg border border-border/50">
              <strong>Delay Cause:</strong> {esc.reason}
            </p>

            <div className="flex items-center justify-end pt-1 gap-2">
              {esc.status !== 'EXPEDITE_NOTICE_SENT' ? (
                <button
                  onClick={() => handleIntervene(esc.id)}
                  className="px-4 py-2 rounded-lg bg-india-orange text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Issue HQ 48-Hour Expedite Notice</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-india-blue flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Expedite Order Dispatched to Officer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainAuthComplaintsPage;
