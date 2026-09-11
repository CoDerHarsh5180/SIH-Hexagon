import React, { useState } from 'react';
import { Modal } from '../../../components/ui';
import { Check, ArrowRight, FileText, Database } from 'lucide-react';
import { userSystemVault } from './mockApprovalsData';

export const ApplyPaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  uniqueRequiredDocs,
  globalUploadedDocs,
  onRequiredDocUpload,
  onPaymentSuccess
}) => {
  const [modalStep, setModalStep] = useState(1);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert('Please enter your Transaction Reference Number');
      return;
    }
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setModalStep(1);
      setUtrNumber('');
      onPaymentSuccess(); // Notify parent to close and reset non-vault docs
      alert('Applications successfully submitted.');
    }, 2000);
  };

  const handleClose = () => {
    setModalStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth={modalStep === 1 ? 'sm:max-w-lg' : 'sm:max-w-md'}
      badge={modalStep === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
      title={modalStep === 1 ? 'Required Documents Upload' : 'Government Fee Payment'}
    >
      {paymentSuccess ? (
        <div className="py-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-india-blue/10 text-india-blue flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">Payment Received & Files Verified</h4>
          <p className="text-xs text-foreground/50">Forwarding to officer desk...</p>
        </div>
      ) : modalStep === 1 ? (
        <div className="space-y-4 py-2">
          <p className="text-xs text-foreground/70">
            The system automatically pulled documents you already have in your vault. Please upload any missing documents below.
          </p>
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-2">
            {uniqueRequiredDocs.map((reqDoc, idx) => {
              const isUploaded = !!globalUploadedDocs[reqDoc];
              const isFromVault = !!userSystemVault[reqDoc];

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
                          <span className="hidden sm:inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-india-blue text-white flex items-center gap-1">
                            <Database className="w-2.5 h-2.5" /> Vault
                          </span>
                        )}
                      </div>
                      {isUploaded && (
                        <p className="text-[10px] text-india-blue/70 font-mono truncate mt-0.5">
                          {globalUploadedDocs[reqDoc]}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {!isFromVault && (
                    <label className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer shrink-0 border ${
                      isUploaded ? 'border-india-blue/30 text-india-blue hover:bg-india-blue/10' : 'border-border text-foreground hover:bg-border/60'
                    }`}>
                      <span>{isUploaded ? 'Re-upload' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) onRequiredDocUpload(reqDoc, e.target.files[0].name);
                        }}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

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
              Proceed to Payment <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg border border-border flex justify-between items-center bg-border/5">
            <span className="text-foreground/60">Total Amount:</span>
            <span className="font-mono font-bold text-lg text-india-blue">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <div className="w-36 h-36 border-2 border-india-blue rounded-lg p-2 bg-white flex flex-col items-center justify-center">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm2-4h2v2h-2v-2zm-2-2h4v2h-4v-2zm4 6h2v2h-2v-2zm-6 0h2v2h-2v-2z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-foreground/40 mt-2">GPay / PhonePe / Paytm / BHIM</span>
            <span className="text-[10px] text-foreground/30 mt-0.5">GRAS Maharashtra Treasury</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-foreground/60 mb-1.5">
              UPI / Transaction Reference (UTR)
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
              Verify Payment & Submit
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};