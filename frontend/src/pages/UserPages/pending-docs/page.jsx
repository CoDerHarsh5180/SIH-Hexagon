import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data: Raw catalog of documents yet to be submitted, cleared, or renewed
const initialPendingDocs = [
  {
    id: 'pend-001',
    name: 'Final Factory Safety NOC',
    authority: 'Directorate of Industrial Safety & Health (DISH)',
    type: 'Safety Clearance',
    stage: 'Awaiting User Submission',
    dueDate: '2026-09-30',
    status: 'NOT_SUBMITTED', // 'NOT_SUBMITTED' | 'UNDER_REVIEW' | 'REQUIRES_REVISION' | 'EXPIRED'
    reason: 'Mandatory before machine energization and electrical inspectorate signoff.',
    priority: 'HIGH',
    actionRoute: '/user/custom-docs-apply'
  },
  {
    id: 'pend-002',
    name: 'Hazardous Waste Authorization (Form 1)',
    authority: 'Maharashtra Pollution Control Board (MPCB)',
    type: 'Environmental Clearance',
    stage: 'Desk Screening Discrepancy',
    dueDate: '2026-09-22',
    status: 'REQUIRES_REVISION',
    reason: 'Clarification needed on waste storage capacity & effluent recycling specs.',
    priority: 'CRITICAL',
    actionRoute: '/user/track/APP-MH-2026-89412'
  },
  {
    id: 'pend-003',
    name: 'Water Supply Connection Sanction',
    authority: 'MIDC Water Works Division',
    type: 'Utility Clearance',
    stage: 'Field Inspection Scheduled',
    dueDate: '2026-10-05',
    status: 'UNDER_REVIEW',
    reason: 'Pipeline joint verification pending on-site engineer visit.',
    priority: 'MEDIUM',
    actionRoute: '/user/track/APP-MH-2026-89413'
  },
  {
    id: 'pend-004',
    name: 'Fire Safety NOC Renewal',
    authority: 'Department of Fire & Emergency Services',
    type: 'Statutory Renewal',
    stage: 'Renewal Window Active',
    dueDate: '2026-11-05',
    status: 'EXPIRED',
    reason: 'Provisional clearance expires within 60 days. Periodic test log required.',
    priority: 'HIGH',
    actionRoute: '/user/your-docs'
  }
];

export const PendingDocsPage = () => {
  const [pendingDocs, setPendingDocs] = useState(initialPendingDocs);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocInfo, setSelectedDocInfo] = useState(null);

  const filteredDocs = pendingDocs.filter((doc) => {
    const matchesPriority = filterPriority === 'ALL' ? true : doc.priority === filterPriority;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL':
      case 'REQUIRES_REVISION':
        return 'border-india-blue text-india-blue bg-india-blue/10';
      case 'HIGH':
      case 'EXPIRED':
        return 'border-border text-foreground bg-border/40';
      default:
        return 'border-border text-foreground/70 bg-transparent';
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Pending Documents
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-1">
            Approvals, compliance clearances, and renewals requiring immediate attention or submission.
          </p>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-border bg-border/20 text-foreground">
            Total Remaining: <strong className="text-india-blue">{filteredDocs.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Priority Filter */}
        <div className="flex overflow-x-auto rounded-lg border border-border p-1 bg-background shrink-0">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterPriority === p
                  ? 'bg-india-blue text-white'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {p === 'ALL' ? 'All Priorities' : p}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search pending docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs sm:text-sm text-foreground focus:outline-none focus:border-india-blue transition-colors"
          />
          <svg
            className="w-4 h-4 text-foreground/40 absolute left-2.5 top-2 sm:top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* List Container */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl p-4 bg-background flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-india-blue transition-colors"
          >
            {/* Document Details */}
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold text-india-blue">
                  {doc.id}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(doc.priority)}`}>
                  {doc.priority} Priority
                </span>
                <span className="text-[10px] uppercase font-semibold text-foreground/50 border border-border px-1.5 py-0.5 rounded">
                  {doc.type}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-bold text-foreground break-words leading-tight">
                {doc.name}
              </h2>

              <p className="text-xs text-foreground/60">
                {doc.authority}
              </p>

              <p className="text-xs text-foreground/80 line-clamp-1 pt-0.5">
                <strong className="text-foreground font-medium">Issue / Hold:</strong> {doc.reason}
              </p>
            </div>

            {/* SLA Meta & Action Buttons */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-border pt-3 md:pt-0 gap-2 shrink-0">
              <div className="text-left md:text-right font-mono">
                <span className="text-[10px] uppercase text-foreground/50 block">Target Date</span>
                <span className="text-xs font-semibold text-foreground">{doc.dueDate}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDocInfo(doc)}
                  className="px-3 py-1.5 rounded-lg border border-border hover:border-india-blue text-xs font-semibold text-foreground hover:text-india-blue transition-colors cursor-pointer"
                >
                  Info
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <p className="text-sm text-foreground/60">No pending documents found matching current filter.</p>
          </div>
        )}
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {selectedDocInfo && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-background border-t sm:border border-border w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6"
            >
              <div className="flex items-start justify-between pb-3 border-b border-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">
                    Pending Clearance Detail
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-0.5">
                    {selectedDocInfo.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDocInfo(null)}
                  className="p-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div>
                  <span className="text-foreground/50 uppercase block text-[10px]">Competent Authority</span>
                  <p className="text-foreground font-semibold mt-0.5">{selectedDocInfo.authority}</p>
                </div>
                <div className="p-3 border border-border rounded-lg bg-border/10">
                  <span className="text-foreground/60 block font-medium">Pending Stage:</span>
                  <p className="text-foreground font-semibold mt-0.5">{selectedDocInfo.stage}</p>
                  <span className="text-foreground/60 block font-medium mt-2">Resolution Required:</span>
                  <p className="text-foreground mt-0.5 leading-relaxed">{selectedDocInfo.reason}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <button
                  onClick={() => setSelectedDocInfo(null)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const route = selectedDocInfo.actionRoute;
                    setSelectedDocInfo(null);
                    alert(`Navigating to ${route}`);
                  }}
                  className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 cursor-pointer"
                >
                  Take Action
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingDocsPage;