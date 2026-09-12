import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { initialMainAuthRequestsData } from './data';
import { MainAuthRequestCard } from './MainAuthRequestCard';
import { ViewCentralDocsModal } from './ViewCentralDocsModal';
import { CentralApprovalModal } from './CentralApprovalModal';
import { CentralRejectModal } from './CentralRejectModal';
import { SearchInput, FilterTabs, EmptyState } from '../../../components/ui';

const FILTER_TABS = [
  { key: 'ALL', label: 'All Inward Requests' },
  { key: 'PENDING_REVIEW', label: 'Awaiting Apex Sanction' },
  { key: 'APPROVED', label: 'Issued / Cleared' },
  { key: 'REJECTED', label: 'Remitted' },
];

export const MainAuthAllRequestsPage = () => {
  const [requests, setRequests] = useState(initialMainAuthRequestsData);
  const [activeReq, setActiveReq] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'VIEW_DOCS' | 'APPROVE' | 'REJECT'
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = (req, mode) => {
    setActiveReq(req);
    setModalMode(mode);
  };

  const handleCloseModal = () => {
    setActiveReq(null);
    setModalMode(null);
  };

  const handleConfirmApproval = (requestId, signedDocId, remarks) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.requestId === requestId
          ? { ...r, status: 'APPROVED', signedDocId, apexRemarks: remarks }
          : r
      )
    );
    alert(`Apex statutory clearance successfully issued and cryptographically signed with ID: ${signedDocId}`);
    handleCloseModal();
  };

  const handleConfirmRejection = (requestId, rejectionReason, grounds) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.requestId === requestId
          ? { ...r, status: 'REJECTED', rejectionReason, rejectionGrounds: grounds }
          : r
      )
    );
    alert('Statutory remittance order issued. Local district and applicant notified.');
    handleCloseModal();
  };

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch =
      r.enterprise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestedDocName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.enterprise.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING_REVIEW').length;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded border border-india-blue/20">
              State / Central Directorate Queue
            </span>
            <span className="text-xs text-foreground/60">Apex Clearance Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Central & Apex Clearance Requests
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-0.5">
            Examine mega-project statutory applications, review local desk recommendation trails, and issue final cryptographically sealed apex clearances.
          </p>
        </div>

        <div className="text-xs font-mono font-semibold px-3.5 py-2 rounded-lg border border-border bg-border/10 text-foreground shrink-0 shadow-xs">
          Awaiting Apex Review: <strong className="text-india-blue text-sm ml-1">{pendingCount}</strong>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <FilterTabs options={FILTER_TABS} value={filterStatus} onChange={setFilterStatus} />
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by enterprise, clearance, ID..."
          className="w-full sm:w-72"
        />
      </div>

      {/* Cards Feed */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <MainAuthRequestCard key={req.requestId} req={req} onOpenModal={handleOpenModal} />
        ))}

        {filteredRequests.length === 0 && (
          <EmptyState message="No central clearance requests found matching current filter." />
        )}
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {activeReq && modalMode === 'VIEW_DOCS' && (
          <ViewCentralDocsModal req={activeReq} onClose={handleCloseModal} />
        )}
        {activeReq && modalMode === 'APPROVE' && (
          <CentralApprovalModal
            req={activeReq}
            onClose={handleCloseModal}
            onConfirm={handleConfirmApproval}
          />
        )}
        {activeReq && modalMode === 'REJECT' && (
          <CentralRejectModal
            req={activeReq}
            onClose={handleCloseModal}
            onConfirm={handleConfirmRejection}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainAuthAllRequestsPage;
