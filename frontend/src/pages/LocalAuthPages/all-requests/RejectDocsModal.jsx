import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const RejectDocModal = ({ req, onClose, onConfirm }) => {
  const [rejectCategory, setRejectCategory] = useState('Incomplete Drawings / Maps');
  const [rejectReason, setRejectReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Please enter a specific reason for rejection');
      return;
    }
    onConfirm(req.requestId, `${rejectCategory}: ${rejectReason}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background border-t sm:border border-border w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6"
      >
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider block">Application Scrutiny</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">Reject / Return Application</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-xs">
          <p className="text-foreground/80 leading-relaxed">
            The applicant will receive this exact message as an official notification to rectify their dossier.
          </p>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Discrepancy Category</label>
            <select
              value={rejectCategory}
              onChange={(e) => setRejectCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue"
            >
              <option value="Incomplete Drawings / Maps">Incomplete Drawings / Maps</option>
              <option value="Invalid 7/12 Land Tenure">Invalid 7/12 Land Record / Ownership</option>
              <option value="Insufficient Effluent / Waste Treatment Specs">Insufficient Effluent / Waste Treatment Specs</option>
              <option value="Missing Power Substation Sanction Letter">Missing Power Substation Sanction Letter</option>
              <option value="Site Setback / Open Space Violation">Site Setback / Open Space Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Specific Officer Remarks <span className="text-india-blue">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. ETP capacity does not match daily discharge requirements."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
            />
          </div>

          <div className="pt-3 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-border text-foreground hover:bg-foreground hover:text-background transition-colors text-xs font-semibold cursor-pointer"
            >
              Send Rejection Notice
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};