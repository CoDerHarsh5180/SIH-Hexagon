import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, SearchInput, FilterTabs, Modal } from '../../../components/ui';
import { FileText, Download, AlertTriangle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { RenewDocumentModal } from './RenewDocumentModal';

// Mock Data with renewal fee and required documents
const initialDocumentsData = [
  {
    id: 'doc-001',
    name: 'Consent to Establish (CTE) - Pollution Control',
    source: 'Authority',
    issuingAuthority: 'State Pollution Control Board',
    issueDate: '2025-03-15',
    expiryDate: '2026-10-15',
    needsRenewal: true,
    verificationStatus: 'VERIFIED',
    pdfUrl: '/mock/docs/cte-certificate.pdf',
    fileSize: '1.8 MB',
    renewalFee: 7500,
    renewalRequiredDocs: [
      'Original CTE Certificate',
      'Identity Proof (Aadhaar/PAN)',
      'Updated Effluent Discharge Report',
      'ETP Plant Commissioning Photos & Specs'
    ],
    importanceSummary:
      'Mandatory environmental approval required prior to civil construction or setting up industrial equipment.',
    details: {
      category: 'Environmental Clearance',
      legalSection: 'Section 25 of Water Act, 1974 & Section 21 of Air Act, 1981',
      renewalWindowDays: 60,
      usageScope:
        'Factory site layout verification, power connection approval, and municipal site plan NOC.',
    },
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
    renewalFee: 10000,
    renewalRequiredDocs: [
      'Original Approved Blueprint',
      '7/12 Land Extract',
      'Structural Stability Certificate (Form 1A)',
      'Municipal Property Tax Clearance'
    ],
    importanceSummary:
      'Validates structural stability, fire safety access paths, and setbacks according to municipal bylaws.',
    details: {
      category: 'Municipal Infrastructure',
      legalSection: 'State Municipal Municipalities Act, Reg 44',
      renewalWindowDays: 30,
      usageScope: 'Electricity load sanction and Fire NOC application.',
    },
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
    renewalFee: 3500,
    renewalRequiredDocs: [
      'Original Provisional Fire NOC',
      'Identity Proof (Aadhaar/PAN)',
      'Form-B Periodic Fire Audit Report',
      'Fire Extinguisher Maintenance Log'
    ],
    importanceSummary:
      'Ensures compliance with fire hydrants, emergency evacuation routes, and extinguisher distribution.',
    details: {
      category: 'Life Safety',
      legalSection: 'National Building Code 2016 (Part IV)',
      renewalWindowDays: 45,
      usageScope: 'Mandatory before commencement of commercial operations and worker occupancy.',
    },
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
    renewalFee: 5000,
    renewalRequiredDocs: [
      'Original Lease Deed',
      '7/12 Land Extract',
      'MIDC No-Dues Certificate',
      'Identity Proof (Aadhaar/PAN)'
    ],
    importanceSummary:
      'Demonstrates lawful legal title and possession of designated plot in the industrial zone.',
    details: {
      category: 'Title & Ownership',
      legalSection: 'State Industrial Area Development Act',
      renewalWindowDays: 0,
      usageScope: 'Primary proof of address and premises for all sub-clearances.',
    },
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
    renewalFee: 2500,
    renewalRequiredDocs: [
      'Original DG Sanction Letter',
      'Electrical Inspectorate Periodic Test Report',
      'DG Noise & Air Emission Certificate'
    ],
    importanceSummary:
      'Authorizes installation and electrical earthing compliance for backup diesel generating sets.',
    details: {
      category: 'Electrical Safety',
      legalSection: 'Central Electricity Authority Regulations 2010',
      renewalWindowDays: 30,
      usageScope: 'Backup grid connection and noise clearance compliance.',
    },
  },
];

// Pre-verified files automatically pulled from User Digital Vault
const systemVaultDocs = {
  'Identity Proof (Aadhaar/PAN)': 'Aadhaar_Card_Verified.pdf',
  '7/12 Land Extract': 'Land_Record_7_12.pdf',
  'Original CTE Certificate': 'cte-certificate.pdf',
  'Original Provisional Fire NOC': 'fire-noc.pdf',
  'Original Lease Deed': 'lease-deed.pdf',
  'Original Approved Blueprint': 'building-plan.pdf',
  'Original DG Sanction Letter': 'dg-set-sanction.pdf',
};

const SOURCE_TABS = [
  { key: 'ALL', label: 'All Docs' },
  { key: 'AUTHORITY', label: 'From Authorities' },
  { key: 'SUBMITTED', label: 'Submitted by Me' },
];

export const YourDocsPage = () => {
  const [documents, setDocuments] = useState(initialDocumentsData);
  const [filterSource, setFilterSource] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [renewingDoc, setRenewingDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const handleRenewalSuccess = (docId) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, needsRenewal: false, verificationStatus: 'VERIFIED' }
          : d
      )
    );
    setRenewingDoc(null);
    setSuccessBanner('Renewal application and requisite documents successfully submitted!');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

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
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <PageHeader
          title="All Documents"
          subtitle="Central repository of all documents submitted by you or issued directly by respective authorities."
        />
        <p className="text-xs text-india-blue/80 border border-india-blue/20 bg-india-blue/5 px-3 py-2 rounded-lg">
          Uploaded documents undergo automated system verification prior to inter-departmental use.
        </p>

        {/* Success Banner */}
        <AnimatePresence>
          {successBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-india-blue/10 border border-india-blue/30 text-foreground p-3 rounded-lg flex items-center space-x-2 text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 text-india-blue shrink-0" />
              <span>{successBanner}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs options={SOURCE_TABS} value={filterSource} onChange={setFilterSource} />
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search document..."
          className="w-full sm:w-64 md:w-72"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl bg-background p-4 flex flex-col justify-between hover:border-foreground/20 transition-colors"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-india-blue mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug break-words">
                    {doc.name}
                  </h3>
                  <p className="text-[11px] text-foreground/60 truncate mt-0.5">{doc.issuingAuthority}</p>
                </div>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                doc.source === 'Authority'
                  ? 'bg-india-blue/10 text-india-blue border border-india-blue/20'
                  : 'bg-border text-foreground/60 border border-border'
              }`}>
                {doc.source}
              </span>
            </div>

            {/* Verification status */}
            <div className="mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                doc.verificationStatus === 'VERIFIED'
                  ? 'bg-india-blue/10 text-india-blue border-india-blue/20'
                  : 'bg-border text-foreground/60 border-border'
              }`}>
                {doc.verificationStatus === 'VERIFIED' ? 'System Verified' : 'Pending Verification'}
              </span>
            </div>

            {/* Summary & dates */}
            <div className="py-3 space-y-2 border-t border-b border-border text-xs">
              <p className="text-foreground/60 text-[11px] sm:text-xs line-clamp-2 leading-relaxed">
                {doc.importanceSummary}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div>
                  <span className="text-foreground/40 text-[10px] uppercase tracking-wider block">Issued</span>
                  <span className="text-foreground font-semibold text-xs">{doc.issueDate}</span>
                </div>
                <div>
                  <span className="text-foreground/40 text-[10px] uppercase tracking-wider block">Expires</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-foreground font-semibold text-xs">{doc.expiryDate}</span>
                    {doc.needsRenewal && (
                      <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-india-orange/10 text-india-orange border border-india-orange/20">
                        <AlertTriangle className="w-2.5 h-2.5" /> Renew Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 gap-2">
              <span className="text-[10px] text-foreground/40 font-mono shrink-0">{doc.fileSize}</span>
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border hover:border-india-blue text-xs font-semibold text-foreground/60 hover:text-india-blue transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </a>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-2.5 py-1.5 rounded-lg border border-border text-foreground hover:bg-border text-xs font-semibold transition-colors cursor-pointer"
                >
                  Details
                </button>
                <button
                  onClick={() => setRenewingDoc(doc)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    doc.needsRenewal
                      ? 'bg-india-orange text-white hover:opacity-90 shadow-xs'
                      : 'border border-border text-foreground hover:border-india-blue hover:text-india-blue'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{doc.needsRenewal ? 'Renew Now' : 'Renew'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        maxWidth="sm:max-w-lg"
        badge="Need & Importance"
        title={selectedDoc?.name}
        footer={
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button
              onClick={() => setSelectedDoc(null)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border transition-colors cursor-pointer text-center"
            >
              Close
            </button>
            <a
              href={selectedDoc?.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg border border-border text-foreground hover:bg-border text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              PDF
            </a>
            <button
              onClick={() => {
                const d = selectedDoc;
                setSelectedDoc(null);
                setRenewingDoc(d);
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-orange text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Apply for Renewal
            </button>
          </div>
        }
      >
        {selectedDoc && (
          <div className="space-y-4 text-xs text-foreground">
            <div>
              <h4 className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">
                Why is this Document Mandatory?
              </h4>
              <p className="text-foreground/90 leading-relaxed text-xs sm:text-sm">
                {selectedDoc.importanceSummary}
              </p>
            </div>

            <div className="border border-border rounded-lg p-3 space-y-2 text-[11px] sm:text-xs font-mono">
              {[
                { label: 'Governing Act', value: selectedDoc.details.legalSection },
                { label: 'Issuing Dept', value: selectedDoc.issuingAuthority },
                { label: 'Usage Scope', value: selectedDoc.details.usageScope },
                { label: 'Renewal Fee', value: `₹${selectedDoc.renewalFee?.toLocaleString('en-IN') || '5,000'}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 border-b border-border/40 last:border-0 pb-1.5 last:pb-0">
                  <span className="text-foreground/50">{label}:</span>
                  <span className="text-foreground font-semibold sm:text-right break-words">{value}</span>
                </div>
              ))}
            </div>

            {selectedDoc.needsRenewal && (
              <div className="border border-india-orange/30 bg-india-orange/5 rounded-lg p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-india-orange shrink-0 mt-0.5" />
                <div className="text-[11px] sm:text-xs">
                  <p className="font-bold text-india-orange">Statutory Renewal Active</p>
                  <p className="text-foreground/70 mt-0.5">
                    Clearance expires on <strong className="font-mono text-foreground">{selectedDoc.expiryDate}</strong>. Renewal docket requires attaching updated periodic logs.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Document Renewal Modal with Required Docs & Payment */}
      <RenewDocumentModal
        isOpen={!!renewingDoc}
        onClose={() => setRenewingDoc(null)}
        document={renewingDoc}
        vaultDocs={systemVaultDocs}
        onRenewalSuccess={handleRenewalSuccess}
      />
    </div>
  );
};

export default YourDocsPage;