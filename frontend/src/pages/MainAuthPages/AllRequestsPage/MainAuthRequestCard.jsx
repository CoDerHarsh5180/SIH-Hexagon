import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, XCircle, Building2, MapPin, DollarSign, Zap, ExternalLink } from 'lucide-react';

export const MainAuthRequestCard = ({ req, onOpenModal }) => {
  const isPending = req.status === 'PENDING_REVIEW';
  const isApproved = req.status === 'APPROVED';
  const isRejected = req.status === 'REJECTED';

  return (
    <motion.div
      layout
      className="border border-border rounded-xl p-4 sm:p-5 bg-background hover:border-foreground/30 transition-colors space-y-4"
    >
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded border border-india-blue/20">
            {req.requestId}
          </span>
          <span className="text-foreground/40 text-xs">&bull;</span>
          <span className="text-xs text-foreground/70">
            Applied on: <strong className="font-mono text-foreground">{req.appliedDate}</strong>
          </span>
          <span className="text-foreground/40 text-xs">&bull;</span>
          <span className="text-[10px] uppercase font-bold text-foreground/50 border border-border px-1.5 py-0.5 rounded-full">
            {req.clearanceLevel?.replace(/_/g, ' ')}
          </span>
        </div>

        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border self-start sm:self-auto ${
            isPending
              ? 'border-border text-foreground/80 bg-border/20'
              : isApproved
              ? 'border-india-blue text-india-blue bg-india-blue/10'
              : 'border-border text-foreground/60 bg-border/40'
          }`}
        >
          {isPending ? 'Pending Apex Decision' : isApproved ? 'Apex Clearance Issued' : 'Remitted / Rejected'}
        </span>
      </div>

      {/* Enterprise Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="md:col-span-2">
          <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider block">
            Enterprise & Clearance Dossier
          </span>
          <h3 className="text-sm font-bold text-foreground mt-0.5 leading-snug">{req.enterprise.name}</h3>
          <p className="text-xs font-semibold text-india-blue mt-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            {req.requestedDocName}
          </p>
          <p className="text-foreground/60 text-[11px] mt-0.5">Type: {req.enterprise.type}</p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider block">
            Location & Forwarded Desk
          </span>
          <p className="text-foreground font-medium mt-0.5 leading-relaxed flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-foreground/40 mt-0.5" />
            <span>{req.enterprise.plotLocation}, {req.enterprise.district}</span>
          </p>
          <span className="text-[10px] text-foreground/60 block mt-1">
            Origin Desk: <strong className="text-foreground">{req.forwardedBy}</strong>
          </span>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-4 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-foreground/50 tracking-wider block">
            Project Scale & Metrics
          </span>
          <div className="flex items-center gap-1 text-foreground/80">
            <DollarSign className="w-3 h-3 text-india-blue" />
            <span>Capex: <strong>{req.enterprise.capitalInvestmentInr}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-foreground/80">
            <Zap className="w-3 h-3 text-india-blue" />
            <span>Load: <strong>{req.enterprise.connectedLoad}</strong></span>
          </div>
          <p className="text-[10px] text-foreground/60">Contact: {req.enterprise.ownerName} ({req.enterprise.mobile})</p>
        </div>
      </div>

      {/* Scrutiny Status & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-foreground/60">Supporting Files:</span>
          <span className="font-mono font-bold text-foreground bg-border px-2 py-0.5 rounded text-[11px]">
            {req.userDocs?.length || 0} Documents
          </span>
          {req.signedDocId && (
            <span className="text-[11px] font-mono text-india-blue font-semibold">
              Reg: {req.signedDocId}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenModal(req, 'VIEW_DOCS')}
            className="px-3 py-1.5 rounded-lg border border-border hover:bg-border text-xs font-semibold text-foreground/80 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-india-blue" /> View Dossier
          </button>

          {isPending && (
            <>
              <button
                onClick={() => onOpenModal(req, 'REJECT')}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-india-blue hover:text-india-blue text-xs font-semibold text-foreground/70 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" /> Disapprove
              </button>
              <button
                onClick={() => onOpenModal(req, 'APPROVE')}
                className="px-3.5 py-1.5 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Issue Apex Sanction
              </button>
            </>
          )}

          {isApproved && (
            <span className="text-xs font-semibold text-india-blue inline-flex items-center gap-1 px-2.5 py-1 rounded bg-india-blue/5 border border-india-blue/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Signed & Dispatched
            </span>
          )}

          {isRejected && (
            <span className="text-xs font-semibold text-foreground/60 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-border/20 border border-border">
              <XCircle className="w-3.5 h-3.5" /> Remitted with Grounds
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MainAuthRequestCard;
