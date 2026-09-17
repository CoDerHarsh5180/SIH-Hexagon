import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Eye, 
  X, 
  ShieldCheck,
  FileCheck,
  Search,
  Building,
  FileBadge,
  Layers
} from 'lucide-react';
import { vaultService } from '../../services/vaultService';

export const DOCUMENT_CATEGORIES = [
  {
    code: 'PAN_CARD',
    label: 'PAN Card (Director / Entity)',
    desc: 'Permanent Account Number for legal & tax identification',
    category: 'Core Identity & Land',
    authority: 'Income Tax Department',
    required: true,
    tag: 'Identity Proof',
  },
  {
    code: 'AADHAAR_CARD',
    label: 'Aadhaar Card (Authorized Signatory)',
    desc: 'Identity & authorization verification of plant head / promoter',
    category: 'Core Identity & Land',
    authority: 'UIDAI',
    required: true,
    tag: 'Signatory Proof',
  },
  {
    code: 'UDYAM_REGISTRATION',
    label: 'Udyam Registration / Co. Incorporation',
    desc: 'MSME registration certificate or ROC Certificate of Incorporation',
    category: 'Core Identity & Land',
    authority: 'Ministry of MSME / MCA',
    required: true,
    tag: 'Ownership Proof',
  },
  {
    code: 'LAND_RECORD',
    label: '7/12 Land Extract / MIDC Allotment Letter',
    desc: 'Proof of land ownership, registered lease, or industrial estate plot',
    category: 'Core Identity & Land',
    authority: 'Revenue Dept / MIDC',
    required: true,
    tag: 'Premises Proof',
  },
  {
    code: 'GSTIN_CERTIFICATE',
    label: 'GSTIN Registration Certificate',
    desc: 'State GST taxpayer registration certificate',
    category: 'Core Identity & Land',
    authority: 'Goods and Services Tax Network',
    required: false,
    tag: 'Tax Proof',
  },
  {
    code: 'SITE_PLAN_BLUEPRINT',
    label: 'Approved Factory Blueprint / Layout',
    desc: 'Architect & civil engineer signed plant layout with setback marks',
    category: 'Core Identity & Land',
    authority: 'Directorate of Industrial Safety / Town Planning',
    required: false,
    tag: 'Technical Proof',
  },
];

export const DocumentUploadModal = ({ isOpen, onClose, onSuccess, initialCategory = 'PAN_CARD' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [allDocTypes, setAllDocTypes] = useState(DOCUMENT_CATEGORIES);
  const [loadingDocTypes, setLoadingDocTypes] = useState(false);
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);

  // Sync initial category when modal opens
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  // Fetch all dynamically registered documents from the backend database (ApprovalCatalog + Core docs)
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchDocTypes = async () => {
      setLoadingDocTypes(true);
      try {
        const res = await vaultService.getDocumentTypes();
        if (isMounted && (res.data?.success || res.success)) {
          const docData = res.data?.data || res.data;
          if (Array.isArray(docData.all) && docData.all.length > 0) {
            setAllDocTypes(docData.all);
          }
        }
      } catch (err) {
        console.warn('[DocumentUploadModal] Using fallback document types:', err?.message);
      } finally {
        if (isMounted) setLoadingDocTypes(false);
      }
    };

    fetchDocTypes();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Determine currently selected doc metadata
  const currentSelectedDoc = useMemo(() => {
    return (
      allDocTypes.find((d) => d.code === selectedCategory) ||
      DOCUMENT_CATEGORIES.find((d) => d.code === selectedCategory) ||
      allDocTypes[0] ||
      DOCUMENT_CATEGORIES[0]
    );
  }, [allDocTypes, selectedCategory]);

  // Filtered document types list
  const filteredDocTypes = useMemo(() => {
    return allDocTypes.filter((doc) => {
      // Tab filter
      let matchesTab = true;
      if (selectedTab === 'CORE') {
        matchesTab = doc.tag === 'Identity Proof' || doc.tag === 'Signatory Proof' || doc.tag === 'Ownership Proof' || doc.tag === 'Premises Proof' || doc.tag === 'Tax Proof' || doc.tag === 'Technical Proof' || doc.category === 'Core Identity & Land';
      } else if (selectedTab === 'CLEARANCES') {
        matchesTab = doc.tag === 'Clearance' || doc.category === 'Statutory Clearances';
      } else if (selectedTab === 'PREREQUISITES') {
        matchesTab = doc.tag === 'Prerequisite' || (!['Clearance', 'Identity Proof', 'Signatory Proof', 'Ownership Proof', 'Premises Proof', 'Tax Proof', 'Technical Proof'].includes(doc.tag));
      }

      // Search query filter
      const q = searchFilter.trim().toLowerCase();
      const matchesSearch = !q || 
        doc.label?.toLowerCase().includes(q) || 
        doc.desc?.toLowerCase().includes(q) || 
        doc.authority?.toLowerCase().includes(q) ||
        doc.code?.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [allDocTypes, selectedTab, searchFilter]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict PDF check
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMsg('Strict Compliance Requirement: Only PDF files (.pdf) are permitted.');
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10 MB statutory upload limit.');
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleStartScan = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a PDF document to upload.');
      return;
    }

    setIsScanning(true);
    setErrorMsg('');
    setScanStage('Uploading document securely to Cloudinary storage...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', selectedCategory);
      formData.append('documentName', currentSelectedDoc?.label || selectedCategory);

      setTimeout(() => {
        setScanStage('Running AI Document OCR & metadata extraction...');
      }, 1200);

      const res = await vaultService.scanAndUploadDocument(formData);

      if (res.data?.success || res.success) {
        const payload = res.data?.data || res.data;
        setScannedResult(payload);
        
        // Populate editable verification fields
        const ext = payload.extractedData || {};
        setEditableFields({
          documentNumber: ext.documentNumber || '',
          holderName: ext.holderName || '',
          issuedBy: ext.issuedBy || currentSelectedDoc?.authority || '',
          issueDate: ext.issueDate || '',
          ...(ext.extractedFields || {}),
        });
      } else {
        setErrorMsg(res.data?.message || 'AI document scan failed. Please retry.');
      }
    } catch (err) {
      console.error('[DocumentUploadModal] Scan Error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to scan and upload PDF.');
    } finally {
      setIsScanning(false);
      setScanStage('');
    }
  };

  const handleConfirmVerification = async () => {
    if (!scannedResult) return;
    setIsConfirming(true);
    setErrorMsg('');

    try {
      const payload = {
        category: selectedCategory,
        documentName: currentSelectedDoc?.label || selectedCategory,
        fileUrl: scannedResult.fileUrl,
        fileName: scannedResult.fileName,
        fileSize: scannedResult.fileSize,
        cloudinaryPublicId: scannedResult.cloudinaryPublicId,
        documentNumber: editableFields.documentNumber,
        holderName: editableFields.holderName,
        issuedBy: editableFields.issuedBy || currentSelectedDoc?.authority,
        issueDate: editableFields.issueDate,
        extractedFields: editableFields,
      };

      const res = await vaultService.confirmDocument(payload);

      if (res.data?.success || res.success) {
        if (onSuccess) onSuccess(res.data?.data || res.data);
        handleClose();
      } else {
        setErrorMsg(res.data?.message || 'Verification confirmation failed.');
      }
    } catch (err) {
      console.error('[DocumentUploadModal] Confirm Error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to confirm document verification.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setScannedResult(null);
    setEditableFields({});
    setErrorMsg('');
    setIsScanning(false);
    setIsConfirming(false);
    setSearchFilter('');
    setSelectedTab('ALL');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-3xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-card/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-india-blue/10 text-india-blue border border-india-blue/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {scannedResult ? 'Verify Scanned Document Details' : 'Upload Document (PDF Only)'}
              </h2>
              <p className="text-xs text-foreground/60">
                {scannedResult 
                  ? 'Check the details read by AI from your document before saving.' 
                  : 'Safe government cloud storage with automatic certificate details scanning.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-border text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!scannedResult ? (
            /* ── STEP 1: CATEGORY SELECTION & PDF PICKER ── */
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider">
                    1. Choose Which Document You Are Uploading <span className="text-india-blue">*</span>
                  </label>
                  <span className="text-[11px] text-foreground/50 font-medium">
                    Showing {filteredDocTypes.length} of {allDocTypes.length} documents
                  </span>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="space-y-2.5 mb-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                    {[
                      { id: 'ALL', label: 'All Documents' },
                      { id: 'CORE', label: 'ID, PAN & Land Papers' },
                      { id: 'CLEARANCES', label: 'Government Clearances' },
                      { id: 'PREREQUISITES', label: 'Technical Reports' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                          selectedTab === tab.id
                            ? 'bg-india-blue text-white shadow-xs font-bold'
                            : 'bg-card hover:bg-border text-foreground/70 border border-border'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                      type="text"
                      placeholder="Search by document title, issuing authority, or keyword..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-card/50 border border-border rounded-xl pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-india-blue transition-colors"
                    />
                    {searchFilter && (
                      <button
                        onClick={() => setSearchFilter('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Document Type Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 border border-border/60 rounded-xl p-2 bg-card/20">
                  {loadingDocTypes ? (
                    <div className="col-span-full py-8 text-center text-xs text-foreground/50 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-india-blue" />
                      <span>Loading statutory documents from database...</span>
                    </div>
                  ) : filteredDocTypes.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-foreground/50">
                      No document types match your search filter.
                    </div>
                  ) : (
                    filteredDocTypes.map((cat) => {
                      const isSel = selectedCategory === cat.code;
                      return (
                        <div
                          key={cat.code}
                          onClick={() => setSelectedCategory(cat.code)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSel
                              ? 'border-india-blue bg-india-blue/10 shadow-xs ring-1 ring-india-blue/30'
                              : 'border-border hover:border-foreground/30 bg-card/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-bold text-foreground line-clamp-1 leading-snug">
                                {cat.label}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                                cat.tag === 'Clearance' 
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : cat.tag === 'Prerequisite'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                  : 'bg-background border-border text-foreground/60'
                              }`}>
                                {cat.tag || 'Statutory'}
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground/60 mt-1 line-clamp-2 leading-relaxed">
                              {cat.desc || `Official compliance document for ${cat.label}`}
                            </p>
                          </div>
                          {cat.authority && (
                            <div className="mt-2 pt-1.5 border-t border-border/40 text-[10px] text-foreground/50 flex items-center gap-1">
                              <Building className="w-3 h-3 text-foreground/40 shrink-0" />
                              <span className="truncate">{cat.authority}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Currently Selected Indicator */}
                {currentSelectedDoc && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-india-blue/5 border border-india-blue/20 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <FileBadge className="w-4 h-4 text-india-blue shrink-0" />
                      <span className="font-semibold text-foreground truncate">
                        Selected: <strong className="text-india-blue">{currentSelectedDoc.label}</strong>
                      </span>
                    </div>
                    {currentSelectedDoc.authority && (
                      <span className="text-[10px] text-foreground/50 shrink-0 hidden sm:inline">
                        Authority: {currentSelectedDoc.authority}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* PDF Picker */}
              <div>
                <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">
                  2. Choose Document File (PDF Only, Max 10MB) <span className="text-india-blue">*</span>
                </label>
                <div className="border-2 border-dashed border-border hover:border-india-blue/50 rounded-2xl p-6 text-center transition-colors bg-card/20 relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <div className="p-3 rounded-full bg-india-blue/10 text-india-blue">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-india-blue flex items-center justify-center gap-1.5">
                          <FileCheck className="w-4 h-4" />
                          <span>{selectedFile.name}</span>
                        </p>
                        <p className="text-[11px] text-foreground/50">
                          {(selectedFile.size / 1024).toFixed(1)} KB • PDF Document Ready
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-foreground">
                          Click or drag and drop your PDF certificate here
                        </p>
                        <p className="text-[11px] text-foreground/40">
                          Supports certified PDFs from MIDC, MPCB, DISH, Revenue Dept, UIDAI, Income Tax
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Scanning State Banner */}
              {isScanning && (
                <div className="p-4 rounded-xl bg-india-blue/5 border border-india-blue/20 flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 text-india-blue animate-spin shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-india-blue">Processing Document with OCR & AI...</p>
                    <p className="text-foreground/60">{scanStage}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── STEP 2: REVIEW & AI EXTRACTION VERIFICATION ── */
            <div className="space-y-4">
              {/* Scan Successful Header Bar */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>AI Document Extraction Complete (OCR Verified)</span>
                  {scannedResult?.extractedData?.scannedWithModel && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-200/60 dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-200 font-mono">
                      {scannedResult.extractedData.scannedWithModel}
                    </span>
                  )}
                </div>
                <a
                  href={scannedResult.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 font-bold text-india-blue hover:underline text-[11px] shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View PDF on Cloudinary</span>
                </a>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold text-foreground">
                    Scanned Metadata: {currentSelectedDoc?.label || selectedCategory}
                  </span>
                  <span className="text-[11px] text-foreground/50">Edit fields if OCR misread any character</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground/60 mb-1">
                      Statutory Document / Registration No. <span className="text-india-blue">*</span>
                    </label>
                    <input
                      type="text"
                      value={editableFields.documentNumber || ''}
                      onChange={(e) => setEditableFields((prev) => ({ ...prev, documentNumber: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg p-2 font-mono font-bold text-foreground text-xs focus:outline-none focus:border-india-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground/60 mb-1">
                      Entity / Holder Name <span className="text-india-blue">*</span>
                    </label>
                    <input
                      type="text"
                      value={editableFields.holderName || ''}
                      onChange={(e) => setEditableFields((prev) => ({ ...prev, holderName: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg p-2 font-semibold text-foreground text-xs focus:outline-none focus:border-india-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground/60 mb-1">
                      Issuing Authority
                    </label>
                    <input
                      type="text"
                      value={editableFields.issuedBy || ''}
                      onChange={(e) => setEditableFields((prev) => ({ ...prev, issuedBy: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg p-2 text-foreground text-xs focus:outline-none focus:border-india-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground/60 mb-1">
                      Issue / Registration Date
                    </label>
                    <input
                      type="date"
                      value={editableFields.issueDate ? editableFields.issueDate.split('T')[0] : ''}
                      onChange={(e) => setEditableFields((prev) => ({ ...prev, issueDate: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg p-2 text-foreground text-xs focus:outline-none focus:border-india-blue"
                    />
                  </div>
                </div>

                {/* Additional Dynamic Extracted Attributes */}
                <div className="pt-2 border-t border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block mb-2">
                    Additional Extracted Attributes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {Object.entries(editableFields)
                      .filter(([k]) => !['documentNumber', 'holderName', 'issuedBy', 'issueDate', 'expiryDate'].includes(k))
                      .map(([key, val]) => (
                        <div key={key} className="p-2 rounded-lg border border-border bg-background">
                          <span className="text-foreground/40 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-semibold text-foreground break-words">{String(val)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Single-Window Profile & Vault Sync:</strong> Confirming this document will securely save it to your Document Vault and auto-populate your enterprise identity and statutory records.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-border bg-card/40 shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-border transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {!scannedResult ? (
            <button
              onClick={handleStartScan}
              disabled={!selectedFile || isScanning}
              className="px-5 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Scan with AI</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setScannedResult(null)}
                className="px-3.5 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-border transition-colors cursor-pointer"
              >
                ← Scan Another PDF
              </button>
              <button
                onClick={handleConfirmVerification}
                disabled={isConfirming}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center space-x-2 cursor-pointer shadow-sm"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Vault...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Update Vault</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentUploadModal;
