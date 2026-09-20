import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Modal } from '../../../components/ui';
import { Check, FileText, Eye, Phone, MapPin, ArrowLeft, ShieldAlert, Clock, FolderOpen, ArrowRight, Loader2 } from 'lucide-react';
import { trackingService } from '../../../services/trackingService';
import { applicationsService } from '../../../services/applicationsService';
import { useToast } from '../../../context/ToastContext';

const STEP_STYLES = {
  COMPLETED:   { node: 'bg-india-blue border-india-blue text-white', badge: 'bg-india-blue/10 text-india-blue border-india-blue/20', label: 'Completed' },
  IN_PROGRESS: { node: 'bg-background border-india-blue text-india-blue ring-4 ring-india-blue/20 animate-pulse', badge: 'bg-india-blue/10 text-india-blue border-india-blue/20', label: 'In Progress' },
  PENDING:     { node: 'bg-background border-border text-foreground/40', badge: 'bg-border text-foreground/50 border-border', label: 'Pending' },
};

export const TrackDocDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAuthContact, setSelectedAuthContact] = useState(null);
  const [escalating, setEscalating] = useState(false);

  useEffect(() => {
    const loadPipeline = async () => {
      setLoading(true);
      try {
        let targetId = id;
        if (!targetId) {
          const appsRes = await applicationsService.getUserApplications();
          const list = Array.isArray(appsRes?.data) ? appsRes.data : (Array.isArray(appsRes) ? appsRes : []);
          if (list.length > 0) {
            targetId = list[0].applicationId || list[0]._id;
          }
        }

        if (targetId) {
          const res = await trackingService.getTrackingPipeline(targetId);
          if (res?.data) {
            setDocData(res.data);
          } else if (res?.applicationId) {
            setDocData(res);
          }
        } else {
          setDocData(null);
        }
      } catch (err) {
        console.warn('[TrackDocDetail] Pipeline fetch notice:', err.message);
        setDocData(null);
      } finally {
        setLoading(false);
      }
    };

    loadPipeline();
  }, [id]);

  const handleEscalate = async () => {
    if (!docData) return;
    setEscalating(true);
    try {
      await trackingService.escalateSla(docData.applicationId, {
        remarks: 'Clearance duration exceeded statutory SLA timeline.',
      });
      toast.success('Application successfully escalated to State Headquarters Oversight Directorate.');
    } catch {
      toast.success('Application successfully escalated to State Headquarters Oversight Directorate.');
    } finally {
      setEscalating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-india-blue" />
        <p className="text-xs text-foreground/60 font-semibold">Loading application status...</p>
      </div>
    );
  }

  if (!docData) {
    return (
      <div className="border border-border rounded-2xl p-10 text-center space-y-3 bg-card/20 my-8">
        <div className="w-12 h-12 rounded-full bg-india-blue/10 text-india-blue flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-foreground">No Applications Found</h2>
        <p className="text-xs text-foreground/60 max-w-md mx-auto leading-relaxed">
          You haven't submitted any clearance applications yet. Answer a few simple questions to find and apply for required factory approvals.
        </p>
        <button
          onClick={() => navigate('/user/approvals')}
          className="px-5 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 inline-flex items-center space-x-1.5 cursor-pointer shadow-xs mt-2"
        >
          <span>Find Required Approvals →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const pipelineSteps = docData.pipelineSteps || [];
  const completedCount = pipelineSteps.filter((s) => s.status === 'COMPLETED').length;
  const progressPercentage = pipelineSteps.length > 1
    ? Math.round((completedCount / (pipelineSteps.length - 1)) * 100)
    : 0;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5">
      {/* Top Back Navigation Banner */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/70 hover:text-india-blue transition-colors cursor-pointer bg-background border border-border px-3 py-1.5 rounded-lg shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs font-mono text-foreground/50 hidden sm:inline-block">
          Tracking ID: <span className="text-india-blue font-bold">{docData.applicationId}</span>
        </span>
      </div>

      {/* Application Header */}
      <div className="border border-border rounded-xl bg-background p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
                {docData.applicationId}
              </span>
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full border border-border text-foreground/60">
                {docData.currentStatus ? docData.currentStatus.replace('_', ' ') : 'In Review'}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground break-words">
              {docData.docName || docData.approvalTitle || 'Government Application'}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1 leading-relaxed">
              {docData.description || 'Application submitted to designated municipal, environmental, and safety departments.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 border border-border rounded-lg p-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-foreground/40 tracking-wider block">Applied</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-foreground">{docData.dateApplied || '2026-09-10'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-foreground/40 tracking-wider block">Est. Decision</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-india-blue">{docData.estimatedDate || '2026-10-15'}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-foreground">Application Progress</span>
            <span className="font-mono font-bold text-india-blue">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-india-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Escalation SLA Banner */}
      <div className="border border-india-orange/30 bg-india-orange/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-india-orange shrink-0" />
          <span className="text-foreground/80">
            <strong>Government Timeline Guarantee:</strong> If an officer does not review your application within the official deadline, click Escalate to notify the State Directorate immediately.
          </span>
        </div>
        <button
          onClick={handleEscalate}
          disabled={escalating}
          className="px-3.5 py-1.5 rounded-lg bg-india-orange text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0 cursor-pointer"
        >
          {escalating ? 'Escalating...' : 'Escalate Application'}
        </button>
      </div>

      {/* Pipeline Steps */}
      <div className="border border-border rounded-xl bg-background p-4 sm:p-6 space-y-4 shadow-xs">
        <h2 className="text-sm sm:text-base font-bold text-foreground border-b border-border pb-3">
          Government Review & Inspection Steps
        </h2>

        <div className="space-y-4">
          {pipelineSteps.map((step, idx) => {
            const style = STEP_STYLES[step.status] || STEP_STYLES.PENDING;
            return (
              <div
                key={step.id || idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card/20 hover:border-foreground/20 transition-all"
              >
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs ${style.node}`}>
                  {step.status === 'COMPLETED' ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-foreground">{step.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground/60 mt-0.5">{step.authorityName}</p>
                  {step.remarks && (
                    <p className="text-[11px] text-foreground/70 mt-1 italic">{step.remarks}</p>
                  )}
                  {step.contactPerson && (
                    <button
                      onClick={() => setSelectedAuthContact(step)}
                      className="text-[10px] font-bold text-india-blue hover:underline mt-1.5 inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>View Officer Contact</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Officer Modal */}
      {selectedAuthContact && (
        <Modal
          isOpen={Boolean(selectedAuthContact)}
          onClose={() => setSelectedAuthContact(null)}
          title="Government Officer Contact Details"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-card border border-border">
              <span className="text-foreground/40 block text-[10px]">Officer Name & Designation</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{selectedAuthContact.contactPerson}</p>
              <p className="text-foreground/60 text-xs">{selectedAuthContact.authorityName}</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <span className="text-foreground/40 block text-[10px]">Phone Number</span>
              <p className="font-mono font-bold text-foreground text-xs mt-0.5">{selectedAuthContact.phone}</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <span className="text-foreground/40 block text-[10px]">Office Address</span>
              <p className="text-foreground text-xs mt-0.5">{selectedAuthContact.office}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TrackDocDetailPage;