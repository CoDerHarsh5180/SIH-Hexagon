import React from 'react';
import { motion } from 'framer-motion';

export const RequestCard = ({ req, onOpenModal }) => {
  const isPending = req.status === 'PENDING_REVIEW';
  const isApproved = req.status === 'APPROVED';
  const isRejected = req.status === 'REJECTED';
  const isInspectionScheduled = req.status === 'INSPECTION_SCHEDULED';

  return (
    <motion.div
      layout
      className="border border-border rounded-xl p-4 sm:p-5 bg-background hover:border-foreground/30 transition-colors space-y-4"
    >
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-india-blue">{req.requestId}</span>
          <span className="text-foreground/40 text-xs">&bull;</span>
          <span className="text-xs text-foreground/70">
            Applied on: <strong className="font-mono text-foreground">{req.appliedDate}</strong>
          </span>
        </div>

        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border self-start sm:self-auto ${
            isPending
              ? 'border-border text-foreground/80 bg-border/20'
              : isApproved
              ? 'border-india-blue text-india-blue bg-india-blue/10'
              : isInspectionScheduled
              ? 'border-india-orange/30 text-india-orange bg-india-orange/10'
              : 'border-border text-foreground/60 bg-border/40'
          }`}
        >
          {isPending ? 'Pending Scrutiny' : isApproved ? 'Issued & Signed' : isInspectionScheduled ? 'Inspection Scheduled' : 'Returned / Discrepancy'}
        </span>
      </div>

      {/* Enterprise Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider block">
            Enterprise Name
          </span>
          <h3 className="text-sm font-bold text-foreground mt-0.5 leading-snug">{req.enterprise.name}</h3>
          <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-border text-foreground/80">
            {req.enterprise.type}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider block">
            Site Location
          </span>
          <p className="text-foreground font-medium mt-0.5 leading-relaxed">{req.enterprise.plotLocation}</p>
          <p className="text-foreground/60 text-[11px]">District: {req.enterprise.district}</p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-4">
          <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider block">
            Contact Person
          </span>
          <p className="text-foreground font-semibold mt-0.5">{req.enterprise.ownerName}</p>
          <div className="flex items-center space-x-1 mt-0.5 text-india-blue font-mono font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${req.enterprise.mobile}`} className="hover:underline">
              {req.enterprise.mobile}
            </a>
          </div>
          <p className="text-foreground/60 text-[11px] font-mono truncate">{req.enterprise.email}</p>
        </div>
      </div>

      {/* Target Document & Actions */}
      <div className="border-t border-border pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="min-w-0">
          <span className="text-[10px] uppercase text-foreground/50 block">Target Clearance</span>
          <p className="font-bold text-foreground truncate">{req.requestedDocName}</p>
          <span className="text-[11px] text-india-blue font-semibold">
            {req.userDocs.length} uploaded files submitted by applicant
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenModal(req, 'VIEW_DOCS')}
            className="px-3 py-1.5 rounded-lg border border-border hover:border-india-blue text-xs font-semibold text-foreground hover:text-india-blue transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View Docs</span>
          </button>

          {isPending && (
            <>
              <button
                onClick={() => onOpenModal(req, 'INSPECTION')}
                className="px-3 py-1.5 rounded-lg border border-india-blue/30 bg-india-blue/5 text-xs font-semibold text-india-blue hover:bg-india-blue/10 transition-colors cursor-pointer"
              >
                Schedule Inspection
              </button>
              <button
                onClick={() => onOpenModal(req, 'REJECT')}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-border transition-colors cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => onOpenModal(req, 'APPROVE')}
                className="px-4 py-1.5 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 cursor-pointer"
              >
                <span>Submit Doc</span>
                <span>&rarr;</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Outcome Messages */}
      {isInspectionScheduled && (
        <div className="border border-india-orange/30 bg-india-orange/5 rounded-lg p-2.5 text-xs text-foreground flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-india-orange shrink-0 animate-pulse" />
            <span>
              Field Inspection Scheduled: <strong>{req.inspectionDetails?.inspectionDate || 'Upcoming'}</strong> ({req.inspectionDetails?.inspectionTime || '11:00 AM'}) &bull; Inspector: {req.inspectionDetails?.inspectorName || 'Assigned Officer'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-india-orange font-semibold">Inspector Assigned</span>
        </div>
      )}

      {isApproved && (
        <div className="border border-india-blue/30 bg-india-blue/5 rounded-lg p-2.5 text-xs text-foreground flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-india-blue shrink-0" />
            <span>Official Clearance Certificate Issued: <strong>{req.signedDocId}</strong></span>
          </div>
          <span className="font-mono text-[11px] text-india-blue font-semibold">Digitally Signed & Sent</span>
        </div>
      )}

      {isRejected && (
        <div className="border border-border bg-border/20 rounded-lg p-2.5 text-xs text-foreground space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-foreground">
            <span>Application Sent Back to User</span>
          </div>
          <p className="text-foreground/80 leading-relaxed pl-3.5">
            <strong>Reason:</strong> {req.rejectionReason}
          </p>
        </div>
      )}
    </motion.div>
  );
};