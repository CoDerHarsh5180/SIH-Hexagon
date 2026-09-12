import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, XCircle } from 'lucide-react';

export const CentralRejectModal = ({ req, onClose, onConfirm }) => {
  const [rejectionGrounds, setRejectionGrounds] = useState('NON_COMPLIANCE_WITH_APEX_STANDARDS');
  const [detailedReason, setDetailedReason] = useState(
    'The submitted environmental management plan does not satisfy zero-liquid-discharge (ZLD) norms for river basin proximity. Remitted back to applicant with statutory non-concurrence.'
  );

  if (!req) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(req.requestId, detailedReason, rejectionGrounds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg bg-background border border-border rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-india-blue/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-india-blue" />
            <div>
              <h2 className="text-base font-bold text-foreground">Remit / Disapprove Clearance</h2>
              <span className="text-xs text-foreground/60 font-mono">
                {req.requestId} &bull; {req.enterprise?.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border hover:bg-border text-foreground/70 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider block mb-1">
              Primary Statutory Ground
            </label>
            <select
              value={rejectionGrounds}
              onChange={(e) => setRejectionGrounds(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-semibold focus:outline-none focus:border-india-blue"
            >
              <option value="NON_COMPLIANCE_WITH_APEX_STANDARDS">Non-Compliance with State Environmental Norms</option>
              <option value="INCOMPLETE_SAFETY_BUFFER_ZONE">Inadequate Hazard Isolation Buffer Distance</option>
              <option value="EXCESSIVE_GROUNDWATER_DEPLETION">Excessive Groundwater Extraction in Stressed Aquifer</option>
              <option value="DISCREPANCY_UNRESOLVED">Failure to Address Previous Local Desk Discrepancies</option>
              <option value="STATUTORY_ACT_VIOLATION">Direct Violation of Applicable Central/State Acts</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider block mb-1">
              Detailed Statutory Order & Remittance Notes
            </label>
            <textarea
              rows={4}
              value={detailedReason}
              onChange={(e) => setDetailedReason(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground leading-relaxed focus:outline-none focus:border-india-blue"
              placeholder="Specify the regulatory provisions and remediation required before re-application..."
              required
            />
          </div>

          <div className="p-3 rounded-lg border border-border bg-border/5 text-[11px] text-foreground/70 leading-normal">
            <strong>Apex Directive:</strong> This formal rejection order will be served to the applicant and mirrored to the local authority district office for audit records.
          </div>

          {/* Footer actions */}
          <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-border transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <XCircle className="w-4 h-4" /> Issue Rejection Order
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CentralRejectModal;
