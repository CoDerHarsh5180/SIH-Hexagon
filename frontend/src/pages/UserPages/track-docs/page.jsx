import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data: Detailed tracking state for a specific pending document
const mockTrackingDocument = {
  applicationId: 'APP-MH-2026-89412',
  docName: 'Consent to Establish (CTE) - Orange Category',
  description: 'Industrial statutory environmental permit for machinery setup and civil layout verification.',
  dateApplied: '2026-08-12',
  estimatedDate: '2026-09-28',
  currentStatus: 'UNDER_INSPECTION', // 'SUBMITTED' | 'IN_REVIEW' | 'UNDER_INSPECTION' | 'FINAL_CLEARANCE' | 'REJECTED'
  rejectionResponse: null, // Populated if any stage triggers a reject loop back to the user
  
  // Pipeline nodes matching handwritten notes:
  // User Submitted -> Auth 1 -> Auth 2 -> Auth 3 -> Final
  // Includes direct office contact numbers and rejection feedback channels
  pipelineSteps: [
    {
      id: 'step-1',
      roleKey: 'user',
      name: 'User Submitted',
      authorityName: 'Applicant Submission',
      contactPerson: 'Self',
      phone: '+91 98765 43210',
      office: 'DocFlow Online Portal',
      status: 'COMPLETED', // 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'REJECTED'
      completedDate: '2026-08-12',
      remarks: 'Application docket and uploaded attachments verified by system algorithms.',
    },
    {
      id: 'step-2',
      roleKey: 'auth1',
      name: 'Auth 1: Desk Screening',
      authorityName: 'MPCB Sub-Regional Office',
      contactPerson: 'S. K. Kulkarni (Scrutiny Officer)',
      phone: '+91 22 2757 2739',
      office: 'Room 304, Raigad Bhavan, CBD Belapur, Navi Mumbai',
      status: 'COMPLETED',
      completedDate: '2026-08-18',
      remarks: 'Primary verification of manufacturing flowcharts and land tenure complete.',
    },
    {
      id: 'step-3',
      roleKey: 'auth2',
      name: 'Auth 2: Field Inspection',
      authorityName: 'Field Technical Directorate',
      contactPerson: 'Anand Patil (Divisional Inspector)',
      phone: '+91 22 2757 4410',
      office: 'Regional Industrial Safety Cell, Turbhe',
      status: 'IN_PROGRESS',
      completedDate: null,
      remarks: 'Site visit scheduled. Officer reviewing air chimney coordinates and effluent disposal plan.',
    },
    {
      id: 'step-4',
      roleKey: 'auth3',
      name: 'Auth 3: Legal & Fee Verification',
      authorityName: 'Treasury & GRAS Account Desk',
      contactPerson: 'V. R. Deshmukh (Account Officer)',
      phone: '+91 22 2202 5543',
      office: 'Mantralaya GRAS Gateway Verification Unit, Fort, Mumbai',
      status: 'PENDING',
      completedDate: null,
      remarks: 'Challan fee clearance pending inspection concurrence.',
    },
    {
      id: 'step-5',
      roleKey: 'final',
      name: 'Final: Certificate Issuance',
      authorityName: 'Maharashtra Pollution Control Board HQ',
      contactPerson: 'Member Secretary',
      phone: '+91 22 2401 0706',
      office: 'Kalpataru Point, 3rd Floor, Sion Circle, Mumbai',
      status: 'PENDING',
      completedDate: null,
      remarks: 'Final tokenized digital signature with QR verification embedded on the certificate.',
    },
  ],

  // Documents attached to this application (persisted on the system for automatic reuse)
  submittedFiles: [
    { name: 'Industrial Site Plan Drawing.pdf', size: '3.4 MB', uploadedAt: '2026-08-12' },
    { name: 'Environmental Impact Assessment.pdf', size: '6.1 MB', uploadedAt: '2026-08-12' },
    { name: '7_12 Land Extract Document.pdf', size: '1.2 MB', uploadedAt: '2026-08-12' },
  ],
};

export const TrackDocDetailPage = () => {
  const [docData] = useState(mockTrackingDocument);
  const [selectedAuthContact, setSelectedAuthContact] = useState(null);

  const completedStepsCount = docData.pipelineSteps.filter((s) => s.status === 'COMPLETED').length;
  const progressPercentage = Math.round((completedStepsCount / (docData.pipelineSteps.length - 1)) * 100);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Top Header Card */}
      <div className="border border-border rounded-xl p-4 sm:p-6 bg-background">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded border border-india-blue/20">
                {docData.applicationId}
              </span>
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded border border-border text-foreground/70">
                In Review
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground break-words">
              {docData.docName}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70 mt-1 leading-relaxed">
              {docData.description}
            </p>
          </div>

          {/* SLA Key Metas */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 bg-border/20 p-3 rounded-lg border border-border">
            <div>
              <span className="text-[10px] uppercase font-mono text-foreground/50 tracking-wider block">
                Date Applied
              </span>
              <span className="text-xs sm:text-sm font-semibold font-mono text-foreground">
                {docData.dateApplied}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-foreground/50 tracking-wider block">
                Estimated Decision
              </span>
              <span className="text-xs sm:text-sm font-semibold font-mono text-india-blue">
                {docData.estimatedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Summary Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-foreground">Current Clearance Progress</span>
            <span className="font-mono font-bold text-india-blue">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-india-blue rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Pipeline Stepper (Horizontal on Desktop, Vertical on Mobile) */}
      <div className="border border-border rounded-xl p-4 sm:p-6 bg-background space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">
            Inter-Authority Pipeline Tracking
          </h2>
          <span className="text-xs text-foreground/60">
            Select any node to view designated authority office and contact numbers
          </span>
        </div>

        {/* Desktop Pipeline (Horizontal flow with rejection return loop) */}
        <div className="hidden lg:block pt-4 pb-2">
          <div className="grid grid-cols-5 gap-2 relative">
            {/* Connecting Baseline */}
            <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border -z-0" />

            {docData.pipelineSteps.map((step, idx) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center px-1">
                  {/* Circle Node */}
                  <button
                    onClick={() => setSelectedAuthContact(step)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-india-blue border-india-blue text-white shadow-md'
                        : isInProgress
                        ? 'bg-background border-india-blue text-india-blue ring-4 ring-india-blue/20 animate-pulse'
                        : 'bg-background border-border text-foreground/40'
                    }`}
                    aria-label={`View details for ${step.name}`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-mono font-bold">{idx + 1}</span>
                    )}
                  </button>

                  <h3 className="text-xs font-semibold text-foreground mt-2 leading-tight">
                    {step.name}
                  </h3>
                  <p className="text-[11px] text-foreground/60 mt-0.5 line-clamp-1">
                    {step.authorityName}
                  </p>

                  <button
                    onClick={() => setSelectedAuthContact(step)}
                    className="mt-2 text-[10px] font-semibold text-india-blue hover:underline cursor-pointer"
                  >
                    Office & Contacts
                  </button>
                </div>
              );
            })}
          </div>

          {/* Rejection Return Loop Banner (Visualizing the Reject arrow flow back to User) */}
          <div className="mt-8 pt-3 border-t border-dashed border-border flex items-center justify-between text-xs text-foreground/70">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-border shrink-0" />
              <span>
                <strong>System Feedback Loop:</strong> If any authority flags discrepancy, a rejection response returns directly to Applicant with resolution notes.
              </span>
            </div>
            <span className="text-[11px] font-mono text-india-blue">Auto-Escalation Active</span>
          </div>
        </div>

        {/* Mobile Pipeline (Vertical Flow) */}
        <div className="lg:hidden space-y-4 pt-2">
          {docData.pipelineSteps.map((step, idx) => {
            const isCompleted = step.status === 'COMPLETED';
            const isInProgress = step.status === 'IN_PROGRESS';

            return (
              <div key={step.id} className="flex items-start space-x-3 relative">
                {/* Connecting Line between vertical steps */}
                {idx !== docData.pipelineSteps.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border -z-0" />
                )}

                {/* Node Avatar */}
                <button
                  onClick={() => setSelectedAuthContact(step)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                    isCompleted
                      ? 'bg-india-blue border-india-blue text-white'
                      : isInProgress
                      ? 'bg-background border-india-blue text-india-blue ring-4 ring-india-blue/20'
                      : 'bg-background border-border text-foreground/40'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-mono font-bold">{idx + 1}</span>
                  )}
                </button>

                {/* Card Info */}
                <div className="flex-1 border border-border rounded-lg p-3 bg-background/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-foreground leading-snug">
                        {step.name}
                      </h3>
                      <p className="text-[11px] text-foreground/60">{step.authorityName}</p>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-india-blue/10 text-india-blue'
                          : isInProgress
                          ? 'bg-border text-foreground'
                          : 'bg-border/40 text-foreground/40'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-foreground/80 mt-2 leading-relaxed">
                    {step.remarks}
                  </p>

                  <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-foreground/50 font-mono">
                      {step.completedDate ? `Cleared on ${step.completedDate}` : 'Pending processing'}
                    </span>
                    <button
                      onClick={() => setSelectedAuthContact(step)}
                      className="text-xs font-semibold text-india-blue hover:underline cursor-pointer"
                    >
                      Contact Info
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Uploaded Application Dossier (Documents kept on system for reuse) */}
      <div className="border border-border rounded-xl p-4 sm:p-6 bg-background space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Submitted Document Dossier
            </h2>
            <p className="text-xs text-foreground/60">
              Documents stored centrally in system vault for re-verification across successive stages
            </p>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-border text-foreground/70 shrink-0">
            Vault Extract Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {docData.submittedFiles.map((file, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-3 flex items-center justify-between gap-2 hover:border-india-blue transition-colors"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded border border-border flex items-center justify-center shrink-0 text-india-blue">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                  <p className="text-[10px] text-foreground/50 font-mono">{file.size}</p>
                </div>
              </div>

              <button
                className="p-1 text-foreground/60 hover:text-india-blue transition-colors cursor-pointer"
                title="Preview document"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Authority Contact & Office Details Modal */}
      <AnimatePresence>
        {selectedAuthContact && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="bg-background border-t sm:border border-border w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6 relative"
            >
              <div className="flex items-start justify-between pb-3 border-b border-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">
                    Authority Office Details
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-0.5">
                    {selectedAuthContact.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAuthContact(null)}
                  className="p-1 rounded-md text-foreground/60 hover:text-foreground hover:bg-border transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 py-4 text-xs">
                <div>
                  <span className="text-foreground/50 uppercase tracking-wider block text-[10px]">
                    Departmental Authority
                  </span>
                  <p className="text-foreground font-semibold text-sm mt-0.5">
                    {selectedAuthContact.authorityName}
                  </p>
                </div>

                <div className="border border-border rounded-lg p-3 bg-border/10 space-y-2">
                  <div>
                    <span className="text-foreground/60 block">Designated Officer:</span>
                    <span className="text-foreground font-semibold">{selectedAuthContact.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60 block">Office Phone Number:</span>
                    <a
                      href={`tel:${selectedAuthContact.phone}`}
                      className="text-india-blue font-mono font-bold hover:underline"
                    >
                      {selectedAuthContact.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-foreground/60 block">Physical Office Location:</span>
                    <span className="text-foreground leading-relaxed block mt-0.5">
                      {selectedAuthContact.office}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-foreground/50 uppercase tracking-wider block text-[10px]">
                    Node Status & Remarks
                  </span>
                  <p className="text-foreground/80 mt-0.5 leading-relaxed">
                    {selectedAuthContact.remarks}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedAuthContact(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackDocDetailPage;