import React, { useState } from 'react';
import { Modal } from '../../../components/ui';
import { Check, ArrowRight, FileText, Database, RotateCcw, AlertTriangle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const RenewDocumentModal = ({
  isOpen,
  onClose,
  document,
  vaultDocs = {},
  onRenewalSuccess
}) => {
  const toast = useToast();
  const [modalStep, setModalStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!document) return null;

  const renewalDocs = document.renewalRequiredDocs || [
    'Original Document Certificate',
    'Identity Proof (Aadhaar/PAN)',
    'Compliance Audit Report'
  ];

  const renewalFee = document.renewalFee || 5000;

  const handleDocUpload = (docName, fileName) => {
    setUploadedDocs((prev) => ({ ...prev, [docName]: fileName }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      toast.warning('Please enter your Transaction Reference Number (UTR)');
      return;
    }

    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setModalStep(1);
      setUtrNumber('');
      setUploadedDocs({});
      onRenewalSuccess(document.id);
      toast.success(`Renewal application for "${document.name}" submitted successfully! File sent to ${document.issuingAuthority}.`);
    }, 1800);
  };

  const handleClose = () => {
    setModalStep(1);
    setUploadedDocs({});
    setUtrNumber('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth={modalStep === 1 ? 'sm:max-w-lg' : 'sm:max-w-md'}
      badge={modalStep === 1 ? 'Step 1 of 2: Documents' : 'Step 2 of 2: Statutory Fee'}
      title={`Statutory Renewal: ${document.name}`}
    >
      {paymentSuccess ? (
        <div className="py-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-india-blue/10 text-india-blue flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">Renewal Application Dispatched</h4>
          <p className="text-xs text-foreground/50">
            Payment verified with GRAS Treasury. Docket routed to {document.issuingAuthority}.
          </p>
        </div>
      ) : modalStep === 1 ? (
        <div className="space-y-4 py-2 text-xs">
          {/* Document Header Summary */}
          <div className="p-3 rounded-lg border border-border bg-border/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-foreground/50 font-bold text-[10px] uppercase">Issuing Authority</span>
              <span className="font-mono text-india-blue font-bold">Fee: ₹{renewalFee.toLocaleString('en-IN')}</span>
            </div>
            <p className="font-semibold text-foreground">{document.issuingAuthority}</p>
            <p className="text-[11px] text-foreground/60 font-mono">Current Expiry: {document.expiryDate}</p>
          </div>

          <p className="text-foreground/70 leading-relaxed">
            Existing verified documents have been automatically pulled from your digital vault. Please attach any updated periodic audit reports or test logs required for this clearance.
          </p>

          {/* Required Docs List */}
          <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
            {renewalDocs.map((reqDoc, idx) => {
              const isFromVault = !!vaultDocs[reqDoc];
              const fileName = isFromVault ? vaultDocs[reqDoc] : uploadedDocs[reqDoc];
              const isUploaded = !!fileName;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isUploaded ? 'border-india-blue/40 bg-india-blue/5' : 'border-border bg-border/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isUploaded ? (
                      <Check className="w-4 h-4 text-india-blue shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-foreground/40 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-semibold truncate ${isUploaded ? 'text-india-blue' : 'text-foreground'}`}>
                          {reqDoc}
                        </p>
                        {isFromVault && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-india-blue text-white flex items-center gap-1">
                            <Database className="w-2.5 h-2.5" /> Vault
                          </span>
                        )}
                      </div>
                      {isUploaded && (
                        <p className="text-[10px] text-india-blue/70 font-mono truncate mt-0.5">
                          {fileName}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isFromVault && (
                    <label
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer shrink-0 border ${
                        isUploaded
                          ? 'border-india-blue/30 text-india-blue hover:bg-india-blue/10'
                          : 'border-border text-foreground hover:bg-border/60'
                      }`}
                    >
                      <span>{isUploaded ? 'Re-upload' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleDocUpload(reqDoc, e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setModalStep(2)}
              className="px-5 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer flex items-center gap-1.5"
            >
              Proceed to Fee Payment <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Payment */
        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg border border-border flex justify-between items-center bg-border/5">
            <span className="text-foreground/60">Total Statutory Renewal Fee:</span>
            <span className="font-mono font-bold text-lg text-india-blue">
              ₹{renewalFee.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <div className="w-36 h-36 border-2 border-india-blue rounded-lg p-2 bg-white flex flex-col items-center justify-center">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm2-4h2v2h-2v-2zm-2-2h4v2h-4v-2zm4 6h2v2h-2v-2zm-6 0h2v2h-2v-2z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-foreground/40 mt-2">GPay / PhonePe / Paytm / BHIM</span>
            <span className="text-[10px] text-foreground/30 mt-0.5">Government Receipt Accounting System (GRAS)</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-foreground/60 mb-1.5">
              UPI / Transaction Reference Number (UTR)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 423871928312"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-india-blue transition-colors"
            />
          </div>

          <div className="pt-2 border-t border-border flex flex-col-reverse sm:flex-row justify-between gap-2">
            <button
              type="button"
              onClick={() => setModalStep(1)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-border cursor-pointer text-center"
            >
              &larr; Back to Docs
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer text-center"
            >
              Verify Payment & Submit Renewal
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RenewDocumentModal;
