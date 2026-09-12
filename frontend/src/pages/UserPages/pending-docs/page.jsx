import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader, SearchInput, FilterTabs, Modal, EmptyState } from '../../../components/ui';

// Mock Data
const initialPendingDocs = [
  {
    id: 'pend-001',
    applicationId: 'APP-MH-2026-89411',
    name: 'Final Factory Safety NOC',
    authority: 'Directorate of Industrial Safety & Health (DISH)',
    type: 'Safety Clearance',
    stage: 'Awaiting User Submission',
    dueDate: '2026-09-30',
    status: 'NOT_SUBMITTED',
    reason: 'Mandatory before machine energization and electrical inspectorate signoff.',
    priority: 'HIGH',
    actionRoute: '/user/track/APP-MH-2026-89411',
  },
  {
    id: 'pend-002',
    applicationId: 'APP-MH-2026-89412',
    name: 'Hazardous Waste Authorization (Form 1)',
    authority: 'Maharashtra Pollution Control Board (MPCB)',
    type: 'Environmental Clearance',
    stage: 'Desk Screening Discrepancy',
    dueDate: '2026-09-22',
    status: 'REQUIRES_REVISION',
    reason: 'Clarification needed on waste storage capacity & effluent recycling specs.',
    priority: 'CRITICAL',
    actionRoute: '/user/track/APP-MH-2026-89412',
  },
  {
    id: 'pend-003',
    applicationId: 'APP-MH-2026-89413',
    name: 'Water Supply Connection Sanction',
    authority: 'MIDC Water Works Division',
    type: 'Utility Clearance',
    stage: 'Field Inspection Scheduled',
    dueDate: '2026-10-05',
    status: 'UNDER_REVIEW',
    reason: 'Pipeline joint verification pending on-site engineer visit.',
    priority: 'MEDIUM',
    actionRoute: '/user/track/APP-MH-2026-89413',
  },
  {
    id: 'pend-004',
    applicationId: 'APP-MH-2026-89414',
    name: 'Fire Safety NOC Renewal',
    authority: 'Department of Fire & Emergency Services',
    type: 'Statutory Renewal',
    stage: 'Renewal Window Active',
    dueDate: '2026-11-05',
    status: 'EXPIRED',
    reason: 'Provisional clearance expires within 60 days. Periodic test log required.',
    priority: 'HIGH',
    actionRoute: '/user/track/APP-MH-2026-89414',
  },
];

const PRIORITY_TABS = [
  { key: 'ALL', label: 'All Priorities' },
  { key: 'CRITICAL', label: 'Critical' },
  { key: 'HIGH', label: 'High' },
  { key: 'MEDIUM', label: 'Medium' },
];

const PRIORITY_BADGE = {
  CRITICAL: 'bg-india-blue/10 text-india-blue border border-india-blue/30',
  HIGH: 'bg-foreground/10 text-foreground border border-foreground/20',
  MEDIUM: 'bg-border text-foreground/70 border border-border',
};

const STATUS_BADGE = {
  NOT_SUBMITTED: 'text-foreground/60 border border-border',
  REQUIRES_REVISION: 'bg-india-blue/5 text-india-blue border border-india-blue/20',
  UNDER_REVIEW: 'text-foreground/70 border border-border',
  EXPIRED: 'bg-india-blue/10 text-india-blue border border-india-blue/30',
};

export const PendingDocsPage = () => {
  const navigate = useNavigate();
  const [pendingDocs] = useState(initialPendingDocs);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocInfo, setSelectedDocInfo] = useState(null);

  const handleOpenTracker = (doc) => {
    const trackId = doc?.applicationId || doc?.id;
    navigate(`/user/track/${trackId}`);
  };

  const filteredDocs = pendingDocs.filter((doc) => {
    const matchesPriority = filterPriority === 'ALL' || doc.priority === filterPriority;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      <PageHeader
        title="Pending Documents"
        subtitle="Approvals, compliance clearances, and renewals requiring immediate attention or submission."
      >
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-foreground/70">
          Remaining: <strong className="text-india-blue">{filteredDocs.length}</strong>
        </span>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <FilterTabs options={PRIORITY_TABS} value={filterPriority} onChange={setFilterPriority} />
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search pending docs..."
          className="w-full sm:w-60"
        />
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl bg-background p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-foreground/30 transition-colors"
          >
            {/* Left: details */}
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${PRIORITY_BADGE[doc.priority] || PRIORITY_BADGE.MEDIUM}`}>
                  {doc.priority}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[doc.status] || ''}`}>
                  {doc.status.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] uppercase font-semibold text-foreground/40 border border-border px-1.5 py-0.5 rounded-full">
                  {doc.type}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-foreground break-words leading-snug">{doc.name}</h2>
              <p className="text-xs text-foreground/60">{doc.authority}</p>
              <p className="text-xs text-foreground/70 line-clamp-1">
                <span className="font-medium text-foreground">Issue:</span> {doc.reason}
              </p>
            </div>

            {/* Right: date + action */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-border pt-3 md:pt-0 gap-3 shrink-0">
              <div className="text-left md:text-right">
                <span className="text-[10px] uppercase text-foreground/40 block font-mono">Target Date</span>
                <span className="text-xs font-bold text-foreground font-mono">{doc.dueDate}</span>
              </div>
              <button
                onClick={() => handleOpenTracker(doc)}
                className="px-3.5 py-1.5 rounded-lg border border-border hover:border-india-blue hover:text-india-blue hover:bg-india-blue/5 text-xs font-semibold text-foreground/70 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                title="View document tracking details"
              >
                Info →
              </button>
            </div>
          </motion.div>
        ))}

        {filteredDocs.length === 0 && (
          <EmptyState message="No pending documents found matching current filter." />
        )}
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={!!selectedDocInfo}
        onClose={() => setSelectedDocInfo(null)}
        maxWidth="sm:max-w-md"
        badge="Pending Clearance Detail"
        title={selectedDocInfo?.name}
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSelectedDocInfo(null)}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                const target = selectedDocInfo;
                setSelectedDocInfo(null);
                if (target) handleOpenTracker(target);
              }}
              className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 cursor-pointer"
            >
              Track Status →
            </button>
          </div>
        }
      >
        {selectedDocInfo && (
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-foreground/50 uppercase block text-[10px] font-semibold tracking-wider">Authority</span>
              <p className="text-foreground font-semibold mt-0.5">{selectedDocInfo.authority}</p>
            </div>
            <div className="p-3 border border-border rounded-lg bg-background">
              <span className="text-foreground/60 block font-medium">Pending Stage:</span>
              <p className="text-foreground font-semibold mt-0.5">{selectedDocInfo.stage}</p>
              <span className="text-foreground/60 block font-medium mt-2">Issue:</span>
              <p className="text-foreground mt-0.5 leading-relaxed">{selectedDocInfo.reason}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingDocsPage;