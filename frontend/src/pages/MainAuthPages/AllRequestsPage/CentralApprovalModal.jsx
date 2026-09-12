import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Award, QrCode } from 'lucide-react';

export const CentralApprovalModal = ({ req, onClose, onConfirm }) => {
  const [issuedLicenseNumber, setIssuedLicenseNumber] = useState(
    `APEX-MAH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [concurrenceRemarks, setConcurrenceRemarks] = useState(
    'Granted statutory apex clearance following scrutiny concurrence from local regional directorates and verification of statutory compliance metrics.'
  );
  const [validityYears, setValidityYears] = useState(5);
  const [isDigitalTokenSigned, setIsDigitalTokenSigned] = useState(true);

  if (!req) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(req.requestId, issuedLicenseNumber, concurrenceRemarks);
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
            <Award className="w-5 h-5 text-india-blue" />
            <div>
              <h2 className="text-base font-bold text-foreground">Issue Apex Statutory Clearance</h2>
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
              Clearance Title
            </label>
            <div className="p-2.5 rounded-lg border border-border bg-border/10 font-semibold text-foreground">
              {req.requestedDocName}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider block mb-1">
              Apex Certificate / Order Registration Number
            </label>
            <input
              type="text"
              value={issuedLicenseNumber}
              onChange={(e) => setIssuedLicenseNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono font-bold focus:outline-none focus:border-india-blue"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider block mb-1">
                Validity Period (Years)
              </label>
              <select
                value={validityYears}
                onChange={(e) => setValidityYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-semibold focus:outline-none focus:border-india-blue"
              >
                <option value={1}>1 Year</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years (Standard)</option>
                <option value={10}>10 Years (Permanent)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider block mb-1">
                Issuing Directorate
              </label>
              <div className="p-2 rounded-lg border border-border bg-border/5 text-[11px] font-semibold text-foreground/80 truncate">
                Apex State Directorate
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider block mb-1">
              Concurrence & Sanction Remarks
            </label>
            <textarea
              rows={3}
              value={concurrenceRemarks}
              onChange={(e) => setConcurrenceRemarks(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground leading-relaxed focus:outline-none focus:border-india-blue"
              required
            />
          </div>

          {/* Cryptographic token indicator */}
          <div className="p-3 rounded-lg border border-india-blue/30 bg-india-blue/5 flex items-start gap-2.5">
            <QrCode className="w-5 h-5 text-india-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground block text-xs">Digital Seal & QR Verification</span>
              <p className="text-[11px] text-foreground/70 leading-normal mt-0.5">
                The issued certificate will be cryptographically tokenized with a tamper-evident QR code and instantly delivered to the applicant's Enterprise Vault.
              </p>
            </div>
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
              <CheckCircle2 className="w-4 h-4" /> Issue & Digitally Sign Clearance
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CentralApprovalModal;
