import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Modal } from '../../../components/ui';
import { Check, FileText, Eye, Phone, MapPin, ArrowLeft } from 'lucide-react';

// Mock Data
const mockTrackingDocument = {
  applicationId: 'APP-MH-2026-89412',
  docName: 'Consent to Establish (CTE) - Orange Category',
  description: 'Industrial statutory environmental permit for machinery setup and civil layout verification.',
  dateApplied: '2026-08-12',
  estimatedDate: '2026-09-28',
  currentStatus: 'UNDER_INSPECTION',
  pipelineSteps: [
    { id: 'step-1', roleKey: 'user', name: 'User Submitted', authorityName: 'Applicant Submission', contactPerson: 'Self', phone: '+91 98765 43210', office: 'DocFlow Online Portal', status: 'COMPLETED', completedDate: '2026-08-12', remarks: 'Application docket and uploaded attachments verified by system algorithms.' },
    { id: 'step-2', roleKey: 'auth1', name: 'Auth 1: Desk Screening', authorityName: 'MPCB Sub-Regional Office', contactPerson: 'S. K. Kulkarni (Scrutiny Officer)', phone: '+91 22 2757 2739', office: 'Room 304, Raigad Bhavan, CBD Belapur, Navi Mumbai', status: 'COMPLETED', completedDate: '2026-08-18', remarks: 'Primary verification of manufacturing flowcharts and land tenure complete.' },
    { id: 'step-3', roleKey: 'auth2', name: 'Auth 2: Field Inspection', authorityName: 'Field Technical Directorate', contactPerson: 'Anand Patil (Divisional Inspector)', phone: '+91 22 2757 4410', office: 'Regional Industrial Safety Cell, Turbhe', status: 'IN_PROGRESS', completedDate: null, remarks: 'Site visit scheduled. Officer reviewing air chimney coordinates and effluent disposal plan.' },
    { id: 'step-4', roleKey: 'auth3', name: 'Auth 3: Legal & Fee Verification', authorityName: 'Treasury & GRAS Account Desk', contactPerson: 'V. R. Deshmukh (Account Officer)', phone: '+91 22 2202 5543', office: 'Mantralaya GRAS Gateway Verification Unit, Fort, Mumbai', status: 'PENDING', completedDate: null, remarks: 'Challan fee clearance pending inspection concurrence.' },
    { id: 'step-5', roleKey: 'final', name: 'Final: Certificate Issuance', authorityName: 'Maharashtra Pollution Control Board HQ', contactPerson: 'Member Secretary', phone: '+91 22 2401 0706', office: 'Kalpataru Point, 3rd Floor, Sion Circle, Mumbai', status: 'PENDING', completedDate: null, remarks: 'Final tokenized digital signature with QR verification embedded on the certificate.' },
  ],
  submittedFiles: [
    { name: 'Industrial Site Plan Drawing.pdf', size: '3.4 MB', uploadedAt: '2026-08-12' },
    { name: 'Environmental Impact Assessment.pdf', size: '6.1 MB', uploadedAt: '2026-08-12' },
    { name: '7_12 Land Extract Document.pdf', size: '1.2 MB', uploadedAt: '2026-08-12' },
  ],
};

const docMocks = {
  'APP-MH-2026-89411': {
    ...mockTrackingDocument,
    applicationId: 'APP-MH-2026-89411',
    docName: 'Final Factory Safety NOC',
    description: 'Mandatory statutory safety clearance before machine energization and electrical inspectorate signoff.',
    dateApplied: '2026-08-25',
    estimatedDate: '2026-09-30',
    currentStatus: 'AWAITING_SUBMISSION',
  },
  'APP-MH-2026-89412': mockTrackingDocument,
  'APP-MH-2026-89413': {
    ...mockTrackingDocument,
    applicationId: 'APP-MH-2026-89413',
    docName: 'Water Supply Connection Sanction',
    description: 'Utility clearance from MIDC Water Works Division for industrial high-pressure pipeline connection.',
    dateApplied: '2026-08-15',
    estimatedDate: '2026-10-05',
    currentStatus: 'UNDER_REVIEW',
  },
  'APP-MH-2026-89414': {
    ...mockTrackingDocument,
    applicationId: 'APP-MH-2026-89414',
    docName: 'Fire Safety NOC Renewal',
    description: 'Statutory renewal application under Maharashtra Fire Prevention and Life Safety Measures Act.',
    dateApplied: '2026-09-01',
    estimatedDate: '2026-11-05',
    currentStatus: 'RENEWAL_ACTIVE',
  },
};

const STEP_STYLES = {
  COMPLETED:   { node: 'bg-india-blue border-india-blue text-white', badge: 'bg-india-blue/10 text-india-blue border-india-blue/20', label: 'Completed' },
  IN_PROGRESS: { node: 'bg-background border-india-blue text-india-blue ring-4 ring-india-blue/20 animate-pulse', badge: 'bg-india-blue/10 text-india-blue border-india-blue/20', label: 'In Progress' },
  PENDING:     { node: 'bg-background border-border text-foreground/40', badge: 'bg-border text-foreground/50 border-border', label: 'Pending' },
};

export const TrackDocDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const docData = (id && docMocks[id])
    ? docMocks[id]
    : { ...mockTrackingDocument, applicationId: id || mockTrackingDocument.applicationId };

  const [selectedAuthContact, setSelectedAuthContact] = useState(null);

  const completedCount = docData.pipelineSteps.filter((s) => s.status === 'COMPLETED').length;
  const progressPercentage = Math.round((completedCount / (docData.pipelineSteps.length - 1)) * 100);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5">
      {/* Top Back Navigation Banner */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/user/pending-docs')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/70 hover:text-india-blue transition-colors cursor-pointer bg-background border border-border px-3 py-1.5 rounded-lg shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pending Documents</span>
        </button>
        <span className="text-xs font-mono text-foreground/50 hidden sm:inline-block">
          Tracking ID: <span className="text-india-blue font-bold">{id || docData.applicationId}</span>
        </span>
      </div>

      {/* Application Header */}
      <div className="border border-border rounded-xl bg-background p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
                {id || docData.applicationId}
              </span>
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full border border-border text-foreground/60">
                In Review
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground break-words">
              {docData.docName}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1 leading-relaxed">
              {docData.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 border border-border rounded-lg p-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-foreground/40 tracking-wider block">Applied</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-foreground">{docData.dateApplied}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-foreground/40 tracking-wider block">Est. Decision</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-india-blue">{docData.estimatedDate}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-foreground">Clearance Progress</span>
            <span className="font-mono font-bold text-india-blue">{progressPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full bg-india-blue rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Pipeline Stepper */}
      <div className="border border-border rounded-xl bg-background p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">Inter-Authority Pipeline</h2>
          <span className="text-xs text-foreground/40">Click any node to view authority contact</span>
        </div>

        {/* Desktop horizontal */}
        <div className="hidden lg:block pt-4">
          <div className="grid grid-cols-5 gap-2 relative">
            <div className="absolute top-5 left-[10%] right-[10%] h-px bg-border -z-0" />
            {docData.pipelineSteps.map((step, idx) => {
              const s = STEP_STYLES[step.status] || STEP_STYLES.PENDING;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center px-1">
                  <button
                    onClick={() => setSelectedAuthContact(step)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${s.node}`}
                  >
                    {step.status === 'COMPLETED' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-mono font-bold">{idx + 1}</span>
                    )}
                  </button>
                  <h3 className="text-xs font-semibold text-foreground mt-2 leading-tight">{step.name}</h3>
                  <p className="text-[11px] text-foreground/50 mt-0.5 line-clamp-1">{step.authorityName}</p>
                  <button
                    onClick={() => setSelectedAuthContact(step)}
                    className="mt-2 text-[10px] font-semibold text-india-blue hover:underline cursor-pointer"
                  >
                    Contact Info
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-3 border-t border-dashed border-border flex items-center justify-between text-xs text-foreground/40">
            <span><strong className="text-foreground">System Feedback Loop:</strong> Discrepancies route back directly to the applicant.</span>
            <span className="text-[11px] font-mono text-india-blue shrink-0">Auto-Escalation Active</span>
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="lg:hidden space-y-3 pt-2">
          {docData.pipelineSteps.map((step, idx) => {
            const s = STEP_STYLES[step.status] || STEP_STYLES.PENDING;
            return (
              <div key={step.id} className="flex items-start gap-3 relative">
                {idx !== docData.pipelineSteps.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-border -z-0" />
                )}
                <button
                  onClick={() => setSelectedAuthContact(step)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${s.node}`}
                >
                  {step.status === 'COMPLETED' ? <Check className="w-4 h-4" /> : <span className="text-xs font-mono font-bold">{idx + 1}</span>}
                </button>
                <div className="flex-1 border border-border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">{step.name}</h3>
                      <p className="text-[11px] text-foreground/50">{step.authorityName}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.badge}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground/60 mt-2 leading-relaxed">{step.remarks}</p>
                  <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-foreground/40 font-mono">
                      {step.completedDate ? `Cleared ${step.completedDate}` : 'Pending'}
                    </span>
                    <button onClick={() => setSelectedAuthContact(step)} className="text-xs font-semibold text-india-blue hover:underline cursor-pointer">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submitted Files */}
      <div className="border border-border rounded-xl bg-background p-4 sm:p-6 space-y-3">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Submitted Document Dossier
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {docData.submittedFiles.map((file, i) => (
            <div key={i} className="border border-border rounded-lg p-3 flex items-center justify-between gap-2 hover:border-india-blue transition-colors group">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center shrink-0 text-india-blue">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                  <p className="text-[10px] text-foreground/40 font-mono">{file.size}</p>
                </div>
              </div>
              <button className="p-1 text-foreground/40 group-hover:text-india-blue transition-colors cursor-pointer">
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Authority Contact Modal */}
      <Modal
        isOpen={!!selectedAuthContact}
        onClose={() => setSelectedAuthContact(null)}
        maxWidth="sm:max-w-md"
        badge="Authority Office Details"
        title={selectedAuthContact?.name}
        footer={
          <div className="flex justify-end">
            <button onClick={() => setSelectedAuthContact(null)} className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 cursor-pointer">
              Dismiss
            </button>
          </div>
        }
      >
        {selectedAuthContact && (
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-foreground/50 uppercase tracking-wider block text-[10px] font-semibold">Authority</span>
              <p className="text-foreground font-bold text-sm mt-0.5">{selectedAuthContact.authorityName}</p>
            </div>
            <div className="border border-border rounded-lg p-3 space-y-2.5">
              <div>
                <span className="text-foreground/50 block">Designated Officer:</span>
                <span className="text-foreground font-semibold">{selectedAuthContact.contactPerson}</span>
              </div>
              <div className="border-t border-border pt-2">
                <span className="text-foreground/50 block">Phone:</span>
                <a href={`tel:${selectedAuthContact.phone}`} className="text-india-blue font-mono font-bold hover:underline flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />{selectedAuthContact.phone}
                </a>
              </div>
              <div className="border-t border-border pt-2">
                <span className="text-foreground/50 block">Office:</span>
                <span className="text-foreground leading-relaxed block mt-0.5 flex gap-1">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-foreground/40" />{selectedAuthContact.office}
                </span>
              </div>
            </div>
            <div>
              <span className="text-foreground/50 uppercase tracking-wider block text-[10px] font-semibold">Remarks</span>
              <p className="text-foreground/80 mt-0.5 leading-relaxed">{selectedAuthContact.remarks}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrackDocDetailPage;