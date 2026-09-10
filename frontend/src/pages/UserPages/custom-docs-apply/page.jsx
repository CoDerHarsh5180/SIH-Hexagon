import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data: Raw catalog for document applications
const availableDocsCatalog = [
  {
    id: 'custom-doc-001',
    title: 'Consent to Establish (CTE)',
    type: 'Pollution NOC',
    authorityCategory: 'Pollution Control',
    authorityName: 'Maharashtra Pollution Control Board (MPCB)',
    supportedDistricts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Thane', 'Nagpur', 'Nashik'],
    processingTimeDays: 45,
    feeEstimate: '₹15,000 - ₹50,000',
    description: 'Mandatory statutory permit required prior to constructing or modifying industrial plants.',
    importance: 'Under Section 25 of the Water Act and Section 21 of the Air Act, starting construction without CTE attracts heavy monetary penalties and stoppage orders from environmental authorities.',
    prerequisites: ['Site layout plan', 'Project report with manufacturing process flow', 'Land possession document']
  },
  {
    id: 'custom-doc-002',
    title: 'Provisional Fire Safety NOC',
    type: 'Fire NOC',
    authorityCategory: 'Fire Department',
    authorityName: 'Maharashtra Fire Services / MIDC Fire Wing',
    supportedDistricts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Thane', 'Aurangabad'],
    processingTimeDays: 21,
    feeEstimate: '₹5,000 - ₹20,000',
    description: 'Preliminary safety approval validating evacuation passages, staircases, and fire suppression layouts.',
    importance: 'Pre-requisite for municipal building plan approval. Commercial civil works cannot begin without clearance from the Chief Fire Officer.',
    prerequisites: ['Architectural blueprints with exit widths', 'Hydrant layout plan', 'Building elevation drawings']
  },
  {
    id: 'custom-doc-003',
    title: 'Factory Building Plan Sanction',
    type: 'Building Permit',
    authorityCategory: 'Municipal Corporation',
    authorityName: 'Brihanmumbai Municipal Corporation (BMC)',
    supportedDistricts: ['Mumbai City', 'Mumbai Suburban'],
    processingTimeDays: 30,
    feeEstimate: '₹25,000',
    description: 'Municipal engineering sanction authorizing structural construction as per regional development plan rules.',
    importance: 'Mandatory structural clearance ensuring setback margins, FAR/FSI compliance, and access road clearance under municipal corporation bylaws.',
    prerequisites: ['Registered land deed / 7/12 extract', 'Structural stability certificate', 'Architectural drawings']
  },
  {
    id: 'custom-doc-004',
    title: 'Non-Agricultural (NA) Land Permission',
    type: 'Land Conversion',
    authorityCategory: 'Revenue / SDO',
    authorityName: 'Sub-Divisional Officer (SDO) / District Collectorate',
    supportedDistricts: ['Pune', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad'],
    processingTimeDays: 60,
    feeEstimate: 'Calculated per sq. meter',
    description: 'Conversion approval allowing agricultural land parcels to be officially repurposed for commercial or industrial setups.',
    importance: 'Operating an industrial establishment on agricultural land without an SDO non-agricultural sanction leads to legal sealing and property seizure.',
    prerequisites: ['7/12 Extract with mutation entry', 'Village map demarcation', 'No-dues certificate from gram panchayat / talathi']
  },
  {
    id: 'custom-doc-005',
    title: 'Factory Inspectorate License (Form 4)',
    type: 'Factory License',
    authorityCategory: 'Labour & Safety',
    authorityName: 'Directorate of Industrial Safety and Health (DISH)',
    supportedDistricts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad'],
    processingTimeDays: 20,
    feeEstimate: '₹10,000',
    description: 'Operational licensing certifying worker health protocols, safety guards, and working environment standards.',
    importance: 'Required under Factories Act, 1948 prior to commencing manufacturing operations and power connection energization.',
    prerequisites: ['Approved factory plan from DISH', 'Installed machinery equipment list', 'First-aid and welfare setup verification']
  }
];

const maharashtraDistricts = [
  'All Districts',
  'Mumbai City',
  'Mumbai Suburban',
  'Pune',
  'Thane',
  'Nagpur',
  'Nashik',
  'Aurangabad'
];

const docTypes = ['All Types', 'Pollution NOC', 'Fire NOC', 'Building Permit', 'Land Conversion', 'Factory License'];
const authorityTypes = ['All Authorities', 'Pollution Control', 'Fire Department', 'Municipal Corporation', 'Revenue / SDO', 'Labour & Safety'];

export const CustomDocsApplyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedDocType, setSelectedDocType] = useState('All Types');
  const [selectedAuth, setSelectedAuth] = useState('All Authorities');
  const [activeInfoDoc, setActiveInfoDoc] = useState(null);
  const [applyingDoc, setApplyingDoc] = useState(null);

  const filteredDocs = availableDocsCatalog.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authorityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict =
      selectedDistrict === 'All Districts'
        ? true
        : doc.supportedDistricts.includes(selectedDistrict);

    const matchesType =
      selectedDocType === 'All Types'
        ? true
        : doc.type === selectedDocType;

    const matchesAuth =
      selectedAuth === 'All Authorities'
        ? true
        : doc.authorityCategory === selectedAuth;

    return matchesSearch && matchesDistrict && matchesType && matchesAuth;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Page Header */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Custom Document Applications
        </h1>
        <p className="text-xs sm:text-sm text-foreground/70 mt-1">
          Search and request any departmental clearance across Maharashtra districts with automatic authority routing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by approval name or authority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-india-blue transition-colors"
          />
          <svg
            className="w-4 h-4 text-foreground/40 absolute left-3 top-2.5 sm:top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Dropdown Filters (District, Doc Type, Authority) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* District Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-1">
              District (Maharashtra)
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors cursor-pointer"
            >
              {maharashtraDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-1">
              Document Type
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors cursor-pointer"
            >
              {docTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Authority Type Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-1">
              Authority Classification
            </label>
            <select
              value={selectedAuth}
              onChange={(e) => setSelectedAuth(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors cursor-pointer"
            >
              {authorityTypes.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-foreground/60 pt-1">
        <span>Available Clearances ({filteredDocs.length})</span>
        {(selectedDistrict !== 'All Districts' || selectedDocType !== 'All Types' || selectedAuth !== 'All Authorities' || searchQuery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDistrict('All Districts');
              setSelectedDocType('All Types');
              setSelectedAuth('All Authorities');
            }}
            className="text-india-blue hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Documents Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl p-4 bg-background flex flex-col justify-between hover:border-india-blue transition-colors"
          >
            {/* Header: Title, Category & Issuing Body */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">
                    {doc.type}
                  </span>
                  <h3 className="font-semibold text-base text-foreground leading-snug break-words">
                    {doc.title}
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-border text-foreground/80 shrink-0">
                  {doc.authorityCategory}
                </span>
              </div>

              <p className="text-xs text-foreground/60 mb-2 truncate">
                {doc.authorityName}
              </p>

              <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed mb-3">
                {doc.description}
              </p>

              {/* Meta Grid: Processing Window & Fee */}
              <div className="grid grid-cols-2 gap-2 border-t border-b border-border py-2 text-[11px] font-mono">
                <div>
                  <span className="text-foreground/50 block text-[10px] uppercase tracking-wider">Est. Processing</span>
                  <span className="text-foreground font-semibold">~{doc.processingTimeDays} Days</span>
                </div>
                <div>
                  <span className="text-foreground/50 block text-[10px] uppercase tracking-wider">Department Fee</span>
                  <span className="text-foreground font-semibold">{doc.feeEstimate}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Info Button & Apply Now Button */}
            <div className="flex items-center justify-between gap-2 pt-3 mt-1">
              <button
                onClick={() => setActiveInfoDoc(doc)}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-india-blue text-xs font-semibold text-foreground hover:text-india-blue transition-colors flex items-center space-x-1.5 cursor-pointer"
                aria-label="View Document Information"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Info</span>
              </button>

              <button
                onClick={() => setApplyingDoc(doc)}
                className="px-4 py-1.5 rounded-lg bg-india-blue text-white hover:opacity-90 text-xs font-semibold transition-opacity flex items-center space-x-1 cursor-pointer"
              >
                <span>Apply Now</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Modal: Explaining Need, Importance & Prerequisites */}
      <AnimatePresence>
        {activeInfoDoc && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="bg-background border-t sm:border border-border w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6 relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-border gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-india-blue tracking-wider block">
                    Information & Purpose
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-foreground mt-0.5 break-words">
                    {activeInfoDoc.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveInfoDoc(null)}
                  className="p-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-border transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs sm:text-sm text-foreground">
                <div>
                  <h4 className="text-[10px] sm:text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">
                    Regulatory Need & Importance
                  </h4>
                  <p className="text-foreground/90 leading-relaxed">
                    {activeInfoDoc.importance}
                  </p>
                </div>

                <div className="border border-border rounded-lg p-3 bg-border/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Competent Authority:</span>
                    <span className="text-foreground font-semibold text-right">{activeInfoDoc.authorityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">SLA Timeline:</span>
                    <span className="text-foreground font-semibold">{activeInfoDoc.processingTimeDays} working days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Indicative Fee:</span>
                    <span className="text-foreground font-semibold">{activeInfoDoc.feeEstimate}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] sm:text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">
                    Required Prerequisites & Uploads
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {activeInfoDoc.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-foreground/80 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-india-blue shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setActiveInfoDoc(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const targetDoc = activeInfoDoc;
                    setActiveInfoDoc(null);
                    setApplyingDoc(targetDoc);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Proceed to Apply</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Application Confirmation Modal */}
      <AnimatePresence>
        {applyingDoc && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="bg-background border-t sm:border border-border w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6 relative"
            >
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Initiate Application
              </h2>
              <p className="text-xs text-foreground/70 mt-1">
                You are beginning a custom application for{' '}
                <span className="font-semibold text-foreground">{applyingDoc.title}</span>.
              </p>

              <div className="my-4 p-3 rounded-lg border border-india-blue/30 bg-india-blue/5 text-xs text-foreground space-y-1">
                <p className="font-semibold text-india-blue">Automated Authority Dispatch</p>
                <p className="text-foreground/80">
                  Targeted Body: {applyingDoc.authorityName}
                </p>
                <p className="text-foreground/80">
                  Selected Jurisdiction: {selectedDistrict === 'All Districts' ? 'Maharashtra State Default' : selectedDistrict}
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  onClick={() => setApplyingDoc(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Application draft created for ${applyingDoc.title}`);
                    setApplyingDoc(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer text-center"
                >
                  Confirm & Upload Docs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDocsApplyPage;