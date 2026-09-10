import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data: Embedded API metadata for the User's document inventory
const initialDocumentsData = [
  {
    id: 'doc-001',
    name: 'Consent to Establish (CTE) - Pollution Control',
    source: 'Authority', // 'Submitted' or 'Authority'
    issuingAuthority: 'State Pollution Control Board',
    issueDate: '2025-03-15',
    expiryDate: '2026-10-15',
    needsRenewal: true,
    verificationStatus: 'VERIFIED', // 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'
    pdfUrl: '/mock/docs/cte-certificate.pdf',
    fileSize: '1.8 MB',
    importanceSummary: 'Mandatory environmental approval required prior to civil construction or setting up industrial equipment.',
    details: {
      category: 'Environmental Clearance',
      legalSection: 'Section 25 of Water Act, 1974 & Section 21 of Air Act, 1981',
      renewalWindowDays: 60,
      usageScope: 'Factory site layout verification, power connection approval, and municipal site plan NOC.'
    }
  },
  {
    id: 'doc-002',
    name: 'Factory Building Plan Approval',
    source: 'Authority',
    issuingAuthority: 'Town Planning & Municipal Corp',
    issueDate: '2025-06-20',
    expiryDate: '2028-06-19',
    needsRenewal: false,
    verificationStatus: 'VERIFIED',
    pdfUrl: '/mock/docs/building-plan.pdf',
    fileSize: '4.2 MB',
    importanceSummary: 'Validates structural stability, fire safety access paths, and setbacks according to municipal bylaws.',
    details: {
      category: 'Municipal Infrastructure',
      legalSection: 'State Municipal Municipalities Act, Reg 44',
      renewalWindowDays: 30,
      usageScope: 'Electricity load sanction and Fire NOC application.'
    }
  },
  {
    id: 'doc-003',
    name: 'Fire Safety NOC (Provisional)',
    source: 'Submitted',
    issuingAuthority: 'Department of Fire & Rescue Services',
    issueDate: '2026-01-10',
    expiryDate: '2026-11-05',
    needsRenewal: true,
    verificationStatus: 'VERIFIED',
    pdfUrl: '/mock/docs/fire-noc.pdf',
    fileSize: '950 KB',
    importanceSummary: 'Ensures compliance with fire hydrants, emergency evacuation routes, and extinguisher distribution.',
    details: {
      category: 'Life Safety',
      legalSection: 'National Building Code 2016 (Part IV)',
      renewalWindowDays: 45,
      usageScope: 'Mandatory before commencement of commercial operations and worker occupancy.'
    }
  },
  {
    id: 'doc-004',
    name: 'Land Possession & Lease Deed',
    source: 'Submitted',
    issuingAuthority: 'Industrial Development Authority (IDA)',
    issueDate: '2024-11-01',
    expiryDate: '2054-10-31',
    needsRenewal: false,
    verificationStatus: 'VERIFIED',
    pdfUrl: '/mock/docs/lease-deed.pdf',
    fileSize: '3.1 MB',
    importanceSummary: 'Demonstrates lawful legal title and possession of designated plot in the industrial zone.',
    details: {
      category: 'Title & Ownership',
      legalSection: 'State Industrial Area Development Act',
      renewalWindowDays: 0,
      usageScope: 'Primary proof of address and premises for all sub-clearances.'
    }
  },
  {
    id: 'doc-005',
    name: 'Diesel Generator (DG) Installation Sanction',
    source: 'Submitted',
    issuingAuthority: 'Chief Electrical Inspectorate',
    issueDate: '2026-08-01',
    expiryDate: '2027-07-31',
    needsRenewal: false,
    verificationStatus: 'PENDING_VERIFICATION',
    pdfUrl: '/mock/docs/dg-set-sanction.pdf',
    fileSize: '1.2 MB',
    importanceSummary: 'Authorizes installation and electrical earthing compliance for backup diesel generating sets.',
    details: {
      category: 'Electrical Safety',
      legalSection: 'Central Electricity Authority Regulations 2010',
      renewalWindowDays: 30,
      usageScope: 'Backup grid connection and noise clearance compliance.'
    }
  }
];

export const YourDocsPage = () => {
  const [documents] = useState(initialDocumentsData);
  const [filterSource, setFilterSource] = useState('ALL'); // 'ALL' | 'AUTHORITY' | 'SUBMITTED'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter =
      filterSource === 'ALL'
        ? true
        : filterSource === 'AUTHORITY'
        ? doc.source === 'Authority'
        : doc.source === 'Submitted';

    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6">
      {/* Top Banner & Info Notice */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            All Documents
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-1">
            Central repository of all documents submitted by you or issued directly by respective authorities.
          </p>
        </div>

        {/* Verification System Notice */}
        <div className="flex items-start sm:items-center space-x-2 text-xs border border-india-blue/30 bg-india-blue/5 text-foreground p-2.5 sm:px-3 sm:py-2 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-india-blue shrink-0 mt-1 sm:mt-0" />
          <span className="leading-tight">Uploaded documents undergo automated system verification prior to inter-departmental use.</span>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Horizontally scrollable tabs on small phones to avoid wrapping awkwardly */}
        <div className="flex overflow-x-auto no-scrollbar rounded-lg border border-border p-1 bg-background shrink-0">
          {[
            { key: 'ALL', label: 'All Docs' },
            { key: 'AUTHORITY', label: 'From Authorities' },
            { key: 'SUBMITTED', label: 'Submitted by Me' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterSource(tab.key)}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterSource === tab.key
                  ? 'bg-india-blue text-white'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Full width search on mobile, fixed width on tablet+ */}
        <div className="relative w-full sm:w-64 md:w-72">
          <input
            type="text"
            placeholder="Search document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 sm:py-1.5 text-xs sm:text-sm text-foreground focus:outline-none focus:border-india-blue transition-colors"
          />
          <svg
            className="w-4 h-4 text-foreground/40 absolute left-3 top-3 sm:top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Document Grid (Adaptive 1 col on mobile, 2 col on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl p-3.5 sm:p-4 bg-background flex flex-col justify-between hover:border-india-blue transition-colors"
          >
            {/* Header: Icon, Titles & Status */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  {/* PDF Document Graphic Thumbnail */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-border bg-border/30 flex items-center justify-center shrink-0 text-india-blue mt-0.5">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug break-words">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-foreground/60 truncate mt-0.5">{doc.issuingAuthority}</p>
                  </div>
                </div>

                {/* Source Tag */}
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-border text-foreground/80 shrink-0">
                  {doc.source}
                </span>
              </div>

              {/* Status pill row */}
              <div className="mb-2.5">
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                    doc.verificationStatus === 'VERIFIED'
                      ? 'bg-india-blue/10 text-india-blue border border-india-blue/30'
                      : 'bg-border text-foreground/70'
                  }`}
                >
                  {doc.verificationStatus === 'VERIFIED' ? 'System Verified' : 'Pending Check'}
                </span>
              </div>

              {/* Middle Section: Summary & Responsive Date Grid */}
              <div className="py-2.5 space-y-2 border-t border-b border-border text-xs">
                <p className="text-foreground/80 text-[11px] sm:text-xs line-clamp-2 leading-relaxed">
                  {doc.importanceSummary}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
                  <div className="flex sm:flex-col justify-between sm:justify-start">
                    <span className="text-foreground/50 text-[10px] uppercase tracking-wider">Date 1 (Issued)</span>
                    <span className="text-foreground font-medium text-xs">{doc.issueDate}</span>
                  </div>
                  <div className="flex sm:flex-col justify-between sm:justify-start">
                    <span className="text-foreground/50 text-[10px] uppercase tracking-wider">Date 2 (Expiry)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground font-medium text-xs">{doc.expiryDate}</span>
                      {doc.needsRenewal && (
                        <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-india-blue text-white shrink-0">
                          Renewal Due
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row: PDF Download + Details */}
            <div className="flex items-center justify-between pt-3 mt-1 gap-2">
              <span className="text-[10px] sm:text-[11px] text-foreground/50 font-mono shrink-0">{doc.fileSize}</span>
              
              <div className="flex items-center space-x-2 shrink-0">
                {/* PDF Action */}
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-border hover:border-india-blue text-xs font-semibold text-foreground hover:text-india-blue transition-colors flex items-center space-x-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>PDF</span>
                </a>

                {/* Details Action */}
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3 sm:px-4 py-1.5 rounded-lg bg-india-blue text-white hover:opacity-90 text-xs font-semibold transition-opacity cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Details Modal (Mobile sheet-like on phone, centered modal on desktop) */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-background border-t sm:border border-border w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6 relative max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-border gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-india-blue tracking-wider block">
                    Need & Importance
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-foreground mt-0.5 break-words">
                    {selectedDoc.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-border transition-colors shrink-0 cursor-pointer"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-3 sm:space-y-4 py-3 sm:py-4 text-xs sm:text-sm text-foreground">
                <div>
                  <h4 className="text-[10px] sm:text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">
                    Why is this Document Mandatory?
                  </h4>
                  <p className="text-foreground/90 leading-relaxed text-xs sm:text-sm">
                    {selectedDoc.importanceSummary}
                  </p>
                </div>

                <div className="border border-border rounded-lg p-2.5 sm:p-3 space-y-2 bg-border/10 text-[11px] sm:text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                    <span className="text-foreground/60">Governing Act:</span>
                    <span className="text-foreground font-semibold sm:text-right break-words">{selectedDoc.details.legalSection}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 border-t border-border/40 pt-1.5 sm:pt-0 sm:border-0">
                    <span className="text-foreground/60">Issuing Dept:</span>
                    <span className="text-foreground font-semibold sm:text-right break-words">{selectedDoc.issuingAuthority}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 border-t border-border/40 pt-1.5 sm:pt-0 sm:border-0">
                    <span className="text-foreground/60">Usage Scope:</span>
                    <span className="text-foreground font-semibold sm:text-right break-words">{selectedDoc.details.usageScope}</span>
                  </div>
                </div>

                {selectedDoc.needsRenewal && (
                  <div className="border border-india-blue/40 bg-india-blue/10 rounded-lg p-2.5 sm:p-3 flex items-start space-x-2.5">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-india-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-[11px] sm:text-xs">
                      <p className="font-semibold text-foreground">Renewal Action Required</p>
                      <p className="text-foreground/80 mt-0.5">
                        Eligible for renewal {selectedDoc.details.renewalWindowDays} days prior to {selectedDoc.expiryDate}.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <a
                  href={selectedDoc.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Document</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YourDocsPage;