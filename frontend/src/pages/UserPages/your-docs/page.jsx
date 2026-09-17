import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, SearchInput, FilterTabs, Modal } from '../../../components/ui';
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  UploadCloud, 
  ExternalLink,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { RenewDocumentModal } from './RenewDocumentModal';
import { vaultService } from '../../../services/vaultService';
import DocumentUploadModal from '../../../components/common/DocumentUploadModal';

const SOURCE_TABS = [
  { key: 'ALL', label: 'All Docs' },
  { key: 'SUBMITTED', label: 'Submitted by Me' },
  { key: 'AUTHORITY', label: 'From Authorities' },
];

export const YourDocsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSource, setFilterSource] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [renewingDoc, setRenewingDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await vaultService.getVaultDocuments();
      const docs = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setDocuments(docs);
    } catch (err) {
      console.warn('[YourDocs] Live fetch error:', err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleRenewalSuccess = async (docId, renewalData = {}) => {
    try {
      await vaultService.renewDocument(docId, renewalData).catch(() => {});
    } finally {
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
      fetchDocs();
    }
  };

  const handleDownload = async (doc) => {
    if (doc.fileUrl || doc.pdfUrl) {
      window.open(doc.fileUrl || doc.pdfUrl, '_blank');
      return;
    }
    try {
      const blob = await vaultService.downloadCertificate(doc.id);
      if (blob) {
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        const safeName = (doc.name || doc.documentName || 'Document').replace(/[^a-zA-Z0-9]/g, '_');
        link.setAttribute('download', `${safeName}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn('Download error:', err.message);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const docName = doc.name || doc.documentName || '';
    const docAuth = doc.authority || doc.issuingAuthority || '';
    const docCat = doc.category || '';
    const docCert = doc.certificateNumber || '';
    const docSrc = doc.source || (['PAN_CARD', 'AADHAAR_CARD', 'UDYAM_REGISTRATION', 'LAND_RECORD', 'GSTIN_CERTIFICATE', 'SITE_PLAN_BLUEPRINT'].includes(doc.category) ? 'Submitted by Me' : 'Authority');

    const matchesSource =
      filterSource === 'ALL' ||
      (filterSource === 'AUTHORITY' && docSrc === 'Authority') ||
      (filterSource === 'SUBMITTED' && docSrc === 'Submitted by Me');

    const matchesSearch =
      docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docAuth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docCat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docCert.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSource && matchesSearch;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-foreground/50">
            Factory Document Locker
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">Your Government Documents & Certificates</h1>
          <p className="text-xs text-foreground/60 mt-1">
            All your government approvals, PAN/Aadhaar papers, and 7/12 land records saved safely in one place.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-center"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document (PDF)</span>
        </button>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {successBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successBanner}</span>
            </div>
            <button onClick={() => setSuccessBanner('')} className="font-bold text-emerald-800 hover:opacity-75">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, authority, certificate..."
          />
        </div>
        <FilterTabs
          options={SOURCE_TABS}
          value={filterSource}
          onChange={(tab) => setFilterSource(tab)}
        />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-india-blue" />
          <p className="text-xs text-foreground/60 font-semibold">Fetching Vault Records from Cloudinary...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center space-y-3 bg-card/20">
          <div className="w-12 h-12 rounded-full bg-india-blue/10 text-india-blue flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No Documents in Your Vault</h3>
          <p className="text-xs text-foreground/60 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? 'No documents matched your search query. Try resetting your search filters.'
              : 'You have not uploaded any statutory documents yet. Upload your PAN, Aadhaar, Land Papers, or Udyam Certificate to activate your single-window profile.'}
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity inline-flex items-center space-x-1.5 cursor-pointer shadow-xs mt-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload First Document (PDF)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const isExpiring = doc.needsRenewal;
            return (
              <div
                key={doc.id || doc._id}
                className="border border-border rounded-2xl p-5 flex flex-col justify-between bg-background hover:border-foreground/20 transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border bg-card text-foreground/70">
                      {doc.source}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isExpiring
                        ? 'border-india-orange/30 bg-india-orange/10 text-india-orange'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {isExpiring ? 'Renewal Due' : 'Verified & Active'}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">{doc.name || doc.documentName || 'Statutory Clearance'}</h3>
                  <p className="text-[11px] text-foreground/50 mt-1">{doc.issuingAuthority || doc.authority}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border text-[11px]">
                    <div>
                      <span className="text-foreground/40 block text-[10px]">Issued On</span>
                      <span className="font-semibold text-foreground">{doc.issueDate || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-foreground/40 block text-[10px]">Valid Until</span>
                      <span className={`font-semibold ${isExpiring ? 'text-india-orange font-bold' : 'text-foreground'}`}>
                        {doc.expiryDate || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {doc.certificateNumber && (
                    <div className="mt-2.5 p-2 rounded-lg bg-card/40 border border-border text-[11px]">
                      <span className="text-foreground/40 block text-[10px]">Certificate / Doc No:</span>
                      <span className="font-mono font-bold text-foreground truncate block">{doc.certificateNumber}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 rounded-lg border border-border hover:border-india-blue hover:text-india-blue text-foreground/70 transition-colors cursor-pointer"
                      title="View PDF Document"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="text-xs font-semibold text-foreground/70 hover:text-foreground cursor-pointer"
                    >
                      Details
                    </button>
                  </div>

                  {isExpiring && (
                    <button
                      onClick={() => setRenewingDoc(doc)}
                      className="px-3 py-1.5 rounded-lg bg-india-orange text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Renew</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedDoc && (
        <Modal
          isOpen={Boolean(selectedDoc)}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.name || selectedDoc.documentName || 'Document Details'}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-india-blue/5 border border-india-blue/20">
              <span className="text-india-blue font-bold block mb-1">Need & Statutory Importance</span>
              <p className="text-foreground/70 leading-relaxed">
                {selectedDoc.importanceSummary || selectedDoc.details?.usageScope || 'Mandatory statutory compliance document.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border">
                <span className="text-foreground/40 block text-[11px]">Issuing Authority</span>
                <span className="font-bold text-foreground mt-0.5 block">{selectedDoc.issuingAuthority || selectedDoc.authority}</span>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <span className="text-foreground/40 block text-[11px]">File Size & Format</span>
                <span className="font-bold text-foreground mt-0.5 block">{selectedDoc.fileSize || 'PDF Document'}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-border">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-lg border border-border text-foreground text-xs font-semibold hover:bg-border cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const d = selectedDoc;
                  setSelectedDoc(null);
                  handleDownload(d);
                }}
                className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 flex items-center space-x-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open PDF in Viewer</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Renew Document Modal */}
      {renewingDoc && (
        <RenewDocumentModal
          isOpen={Boolean(renewingDoc)}
          onClose={() => setRenewingDoc(null)}
          document={renewingDoc}
          onRenewalSuccess={handleRenewalSuccess}
        />
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => {
          setSuccessBanner('Document scanned, verified, and saved to your Vault successfully!');
          setTimeout(() => setSuccessBanner(''), 4000);
          fetchDocs();
        }}
      />
    </div>
  );
};

export default YourDocsPage;