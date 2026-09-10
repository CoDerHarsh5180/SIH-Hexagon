import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Modal } from '../../../components/ui';
import { Check } from 'lucide-react';

// Mock Data
const initialApprovalsList = [
  { id: 'appr-01', docName: 'Consent to Establish (CTE) - Pollution Board', authority: 'Maharashtra Pollution Control Board (MPCB)', fee: 15000, alreadyHave: false, uploadedFile: null, checkedForApply: false, aiReason: 'Because your factory falls in Orange Category with connected power above 100 HP, MPCB permission is mandatory before civil work or machinery fitting starts.' },
  { id: 'appr-02', docName: 'Provisional Fire Safety NOC', authority: 'Maharashtra Fire Services / MIDC Fire Wing', fee: 7500, alreadyHave: false, uploadedFile: null, checkedForApply: false, aiReason: 'Your factory has a built shed area over 20,000 sq ft. Fire department must verify emergency gates, fire hydrants, and clear passage for fire trucks.' },
  { id: 'appr-03', docName: 'Factory Building Plan Approval', authority: 'Town Planning & Municipal Corporation', fee: 20000, alreadyHave: false, uploadedFile: null, checkedForApply: false, aiReason: 'Required because you are constructing an industrial shed. Municipal engineers must check structural stability and roadside open space.' },
  { id: 'appr-04', docName: 'FSSAI State Manufacturing License', authority: 'Food Safety and Standards Authority of India', fee: 5000, alreadyHave: false, uploadedFile: null, checkedForApply: false, aiReason: 'Since your planned business is Food Processing, manufacturing license is required before selling food products in the market.' },
  { id: 'appr-05', docName: 'Factory Registration & License (Form 1)', authority: 'Directorate of Industrial Safety & Health (DISH)', fee: 4500, alreadyHave: false, uploadedFile: null, checkedForApply: false, aiReason: 'Because you employ more than 10 workers using electrical power, DISH approval ensures working condition safety.' },
];

export const ListOfApprovalsPage = () => {
  const [approvals, setApprovals] = useState(initialApprovalsList);
  const [selectedDocId, setSelectedDocId] = useState('appr-01');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const toggleField = (id, field) =>
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: !item[field], ...(field === 'alreadyHave' && !item.alreadyHave ? { checkedForApply: false } : {}) }
          : item
      )
    );

  const handleFileUpload = (id, fileName) =>
    setApprovals((prev) => prev.map((item) => (item.id === id ? { ...item, uploadedFile: fileName } : item)));

  const activeDocument = approvals.find((item) => item.id === selectedDocId);
  const applyItems = approvals.filter((item) => item.checkedForApply && !item.alreadyHave);
  const totalAmount = applyItems.reduce((acc, curr) => acc + curr.fee, 0);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) { alert('Please enter your Transaction Reference Number'); return; }
    setPaymentSuccess(true);
    setTimeout(() => { setPaymentSuccess(false); setIsPaymentOpen(false); setUtrNumber(''); alert('Applications successfully submitted.'); }, 2000);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      <PageHeader
        title="Required Approvals & Clearances"
        subtitle="Click any row to view why it is required. Check items to apply, or submit PDFs if already obtained."
      />

      {/* Approvals List */}
      <div className="space-y-2">
        {approvals.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocId(doc.id)}
            className={`border rounded-xl bg-background transition-colors cursor-pointer p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              doc.id === selectedDocId
                ? 'border-india-blue shadow-sm shadow-india-blue/10'
                : 'border-border hover:border-foreground/20'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <input
                type="checkbox"
                checked={doc.checkedForApply}
                disabled={doc.alreadyHave}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => { e.stopPropagation(); toggleField(doc.id, 'checkedForApply'); }}
                className="mt-1 h-4 w-4 rounded border-border text-india-blue focus:ring-india-blue cursor-pointer disabled:opacity-30"
              />
              <div className="min-w-0">
                <span className={`text-sm font-bold block break-words leading-snug ${doc.alreadyHave ? 'line-through text-foreground/40' : 'text-foreground'}`}>
                  {doc.docName}
                </span>
                <p className="text-xs text-foreground/50 mt-0.5">{doc.authority}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-0 border-border">
              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-foreground/40 block font-sans">Govt Fee</span>
                <span className={`text-sm font-bold ${doc.alreadyHave ? 'line-through text-foreground/40' : 'text-foreground'}`}>
                  ₹{doc.fee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleField(doc.id, 'alreadyHave'); }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    doc.alreadyHave
                      ? 'border-india-blue/30 bg-india-blue/10 text-india-blue'
                      : 'border-border text-foreground/50 hover:border-foreground/30'
                  }`}
                >
                  {doc.alreadyHave ? '✓ Have it' : 'Already have?'}
                </button>
                {doc.alreadyHave && (
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg bg-border text-foreground/60 hover:bg-foreground/10 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <span>{doc.uploadedFile ? '📎 Attached' : 'Submit PDF'}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(doc.id, e.target.files[0].name); }} />
                  </label>
                )}
              </div>
            </div>
            {doc.uploadedFile && (
              <div className="pl-7 text-[11px] text-india-blue font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {doc.uploadedFile}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-foreground/50 block">Selected for Application</span>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {applyItems.length} papers &bull; Total:{' '}
            <strong className="text-india-blue font-mono text-base">₹{totalAmount.toLocaleString('en-IN')}</strong>
          </p>
        </div>
        <button
          disabled={applyItems.length === 0}
          onClick={() => setIsPaymentOpen(true)}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-india-blue text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Apply Now ({applyItems.length})
        </button>
      </div>

      {/* Details Panel */}
      <div className="border border-border rounded-xl p-4 sm:p-6 space-y-3">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Document Requirement Details
        </h2>
        {activeDocument ? (
          <motion.div key={activeDocument.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div>
              <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider block">Selected Document</span>
              <h3 className="text-sm sm:text-base font-bold text-foreground mt-0.5">{activeDocument.docName}</h3>
              <p className="text-xs text-foreground/50">{activeDocument.authority}</p>
            </div>
            <div className="border border-border rounded-lg p-3.5">
              <span className="text-xs font-bold text-india-blue block mb-1">Why is this required?</span>
              <p className="text-xs text-foreground/80 leading-relaxed">{activeDocument.aiReason}</p>
            </div>
          </motion.div>
        ) : (
          <p className="text-xs text-foreground/40">Click any item to view its requirement here.</p>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        maxWidth="sm:max-w-md"
        badge="Government Treasury Portal"
        title="Government Fee Payment"
      >
        {paymentSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-india-blue/10 text-india-blue flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">Payment Received</h4>
            <p className="text-xs text-foreground/50">Forwarding to officer desk...</p>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-lg border border-border flex justify-between items-center">
              <span className="text-foreground/60">Total Amount:</span>
              <span className="font-mono font-bold text-lg text-india-blue">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* QR placeholder */}
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
              <label className="block text-[11px] font-bold text-foreground/60 mb-1.5">UPI / Transaction Reference (UTR)</label>
              <input
                type="text"
                required
                placeholder="e.g. 423871928312"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-india-blue transition-colors"
              />
            </div>

            <div className="pt-2 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2">
              <button type="button" onClick={() => setIsPaymentOpen(false)} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-border cursor-pointer text-center">
                Cancel
              </button>
              <button type="submit" className="w-full sm:w-auto px-5 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer text-center">
                Verify & Apply
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ListOfApprovalsPage;