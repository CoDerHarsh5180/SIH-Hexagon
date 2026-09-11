import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { initialRequestsData } from './data';
import { RequestCard } from './RequestCard';
import { ViewDocsModal } from './ViewDocsModal';
import { ApproveDocModal } from './ApprovalDocsModel';
import { RejectDocModal } from './RejectDocsModal';

export const LocalAuthAllRequestsPage = () => {
  const [requests, setRequests] = useState(initialRequestsData);
  const [activeReq, setActiveReq] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'VIEW_DOCS' | 'APPROVE' | 'REJECT'

  const handleOpenModal = (req, mode) => {
    setActiveReq(req);
    setModalMode(mode);
  };

  const handleCloseModal = () => {
    setActiveReq(null);
    setModalMode(null);
  };

  const handleConfirmApproval = (requestId, signedDocId) => {
    setRequests((prev) =>
      prev.map((r) => (r.requestId === requestId ? { ...r, status: 'APPROVED', signedDocId } : r))
    );
    alert(`Document successfully signed and issued with ID: ${signedDocId}`);
    handleCloseModal();
  };

  const handleConfirmRejection = (requestId, rejectionReason) => {
    setRequests((prev) =>
      prev.map((r) => (r.requestId === requestId ? { ...r, status: 'REJECTED', rejectionReason } : r))
    );
    alert('Application rejected. Feedback notification dispatched to applicant.');
    handleCloseModal();
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDING_REVIEW').length;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded border border-india-blue/20">
              Desk Verification Queue
            </span>
            <span className="text-xs text-foreground/60">Local Authority Panel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            All Incoming Requests
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-0.5">
            Examine uploaded files, verify site details, and either digitally sign and issue clearance or reject with feedback.
          </p>
        </div>

        <div className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-border bg-border/10 text-foreground shrink-0">
          Pending in Queue: <strong className="text-india-blue">{pendingCount}</strong>
        </div>
      </div>

      {/* Cards Feed */}
      <div className="space-y-4">
        {requests.map((req) => (
          <RequestCard key={req.requestId} req={req} onOpenModal={handleOpenModal} />
        ))}
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {activeReq && modalMode === 'VIEW_DOCS' && (
          <ViewDocsModal req={activeReq} onClose={handleCloseModal} />
        )}
        {activeReq && modalMode === 'APPROVE' && (
          <ApproveDocModal req={activeReq} onClose={handleCloseModal} onConfirm={handleConfirmApproval} />
        )}
        {activeReq && modalMode === 'REJECT' && (
          <RejectDocModal req={activeReq} onClose={handleCloseModal} onConfirm={handleConfirmRejection} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocalAuthAllRequestsPage;