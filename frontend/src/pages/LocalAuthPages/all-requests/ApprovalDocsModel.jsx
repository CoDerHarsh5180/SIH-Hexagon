import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../context/ToastContext';

export const ApproveDocModal = ({ req, onClose, onConfirm }) => {
  const toast = useToast();
  const [docIdInput, setDocIdInput] = useState(`AUTH-DOC-${req.requestId.replace('REQ-', '')}-2026`);
  const [officerSignToken] = useState('DSC-TOKEN-AUR-8821');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docIdInput.trim()) {
      toast.warning('Please enter an official Document ID');
      return;
    }
    onConfirm(req.requestId, docIdInput);
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
            <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">Issue Clearance</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">Submit & Sign Document</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div>
            <span className="text-[10px] text-foreground/50 uppercase block">Applicant Enterprise</span>
            <p className="font-bold text-foreground mt-0.5">{req.enterprise.name}</p>
            <p className="text-foreground/60">{req.requestedDocName}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Official Document Number (Doc ID) <span className="text-india-blue">*</span>
            </label>
            <input
              type="text"
              required
              value={docIdInput}
              onChange={(e) => setDocIdInput(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 font-mono text-foreground focus:outline-none focus:border-india-blue"
            />
            <span className="text-[10px] text-foreground/50 mt-1 block">
              Unique identifier printed with a QR token for verification.
            </span>
          </div>

          <div className="border border-border rounded-lg p-3 bg-border/10 space-y-1.5">
            <span className="text-[10px] font-semibold text-foreground/60 uppercase block">
              Officer Digital Signature (Token Attached)
            </span>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-foreground font-bold">{officerSignToken}</span>
              <span className="text-india-blue text-[10px] font-semibold">Active & Verified</span>
            </div>
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
              className="px-5 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 cursor-pointer"
            >
              Confirm & Digitally Sign
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};