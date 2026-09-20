import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SearchInput, SelectFilter, Modal } from '../../../components/ui';
import { Info, ChevronRight, Loader2 } from 'lucide-react';
import { approvalsService } from '../../../services/approvalsService';
import { applicationsService } from '../../../services/applicationsService';
import { useToast } from '../../../context/ToastContext';

// Mock Data
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
    importance:
      'Under Section 25 of the Water Act and Section 21 of the Air Act, starting construction without CTE attracts heavy monetary penalties and stoppage orders from environmental authorities.',
    prerequisites: [
      'Site layout plan',
      'Project report with manufacturing process flow',
      'Land possession document',
    ],
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
    prerequisites: ['Architectural blueprints with exit widths', 'Hydrant layout plan', 'Building elevation drawings'],
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
    prerequisites: ['Registered land deed / 7/12 extract', 'Structural stability certificate', 'Architectural drawings'],
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
    prerequisites: ['7/12 Extract with mutation entry', 'Village map demarcation', 'No-dues certificate from gram panchayat / talathi'],
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
    prerequisites: ['Approved factory plan from DISH', 'Installed machinery equipment list', 'First-aid and welfare setup verification'],
  },
];

const maharashtraDistricts = [
  'All Districts', 'Mumbai City', 'Mumbai Suburban', 'Pune', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad',
];
const docTypes = ['All Types', 'Pollution NOC', 'Fire NOC', 'Building Permit', 'Land Conversion', 'Factory License'];
const authorityTypes = ['All Authorities', 'Pollution Control', 'Fire Department', 'Municipal Corporation', 'Revenue / SDO', 'Labour & Safety'];

export const CustomDocsApplyPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [catalog, setCatalog] = useState(availableDocsCatalog);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedDocType, setSelectedDocType] = useState('All Types');
  const [selectedAuth, setSelectedAuth] = useState('All Authorities');
  const [activeInfoDoc, setActiveInfoDoc] = useState(null);
  const [applyingDoc, setApplyingDoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await approvalsService.getApprovalsCatalog();
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (data.length > 0) {
          setCatalog(data.map((d) => ({
            ...d,
            id: d.approvalId || d._id || d.id,
            title: d.title || d.name,
            authorityName: d.authorityName || d.authority || d.department || 'Competent Authority',
            authorityCategory: d.authorityCategory || d.category || 'Statutory Clearance',
            type: d.type || d.category || 'Clearance',
            feeEstimate: d.feeEstimate || (d.statutoryFee ? `₹${d.statutoryFee.toLocaleString()}` : '₹5,000'),
            processingTimeDays: d.processingTimeDays || d.slaTimelineDays || 15,
            supportedDistricts: d.supportedDistricts || ['All Districts', 'Pune', 'Mumbai City', 'Mumbai Suburban', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad'],
            prerequisites: d.prerequisites || (d.documentsRequired ? d.documentsRequired.map((x) => x.name || x) : ['Land Record / 7-12 Extract', 'Identity Proof']),
            importance: d.importance || d.description || 'Mandatory statutory requirement under state regulations.',
            description: d.description || 'Statutory clearance issued by state departmental authorities.',
          })));
        }
      } catch (err) {
        console.warn('Using default custom approvals catalog:', err.message);
      }
    };
    fetchCatalog();
  }, []);

  const handleConfirmApply = async () => {
    if (!applyingDoc) return;
    setIsSubmitting(true);
    try {
      const payload = {
        approvalId: applyingDoc.id,
        title: applyingDoc.title,
        authority: applyingDoc.authorityName,
        district: selectedDistrict !== 'All Districts' ? selectedDistrict : 'Maharashtra State',
      };
      const res = await applicationsService.submitCustomApplication(payload);
      const newAppId = res?.data?.applicationId || res?.data?.id;
      setApplyingDoc(null);
      if (newAppId) {
        navigate(`/user/track/${newAppId}`);
      } else {
        toast.success(`Application draft created successfully for ${applyingDoc.title}`);
      }
    } catch (err) {
      console.warn('Backend custom application failed, using local confirmation:', err.message);
      toast.info(`Application initiated for ${applyingDoc.title}`);
      setApplyingDoc(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDocs = catalog.filter((doc) => {
    const docTitle = (doc.title || doc.name || '').toLowerCase();
    const authName = (doc.authorityName || doc.authority || doc.department || '').toLowerCase();
    const matchesSearch =
      docTitle.includes(searchQuery.toLowerCase()) ||
      authName.includes(searchQuery.toLowerCase());
    const matchesDistrict =
      selectedDistrict === 'All Districts' ||
      !doc.supportedDistricts ||
      doc.supportedDistricts.includes('All Districts') ||
      doc.supportedDistricts.includes(selectedDistrict);
    const matchesType = selectedDocType === 'All Types' || doc.type === selectedDocType;
    const matchesAuth = selectedAuth === 'All Authorities' || doc.authorityCategory === selectedAuth;
    return matchesSearch && matchesDistrict && matchesType && matchesAuth;
  });

  const hasActiveFilters =
    selectedDistrict !== 'All Districts' ||
    selectedDocType !== 'All Types' ||
    selectedAuth !== 'All Authorities' ||
    searchQuery;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('All Districts');
    setSelectedDocType('All Types');
    setSelectedAuth('All Authorities');
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      <PageHeader
        title="Apply for Specific Clearance / NOC"
        subtitle="Directly search and apply for individual government permits, NOCs, and factory licenses in Maharashtra."
      />

      {/* Filters */}
      <div className="space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by approval name or authority..."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <SelectFilter label="District (Maharashtra)" options={maharashtraDistricts} value={selectedDistrict} onChange={setSelectedDistrict} />
          <SelectFilter label="Document Type" options={docTypes} value={selectedDocType} onChange={setSelectedDocType} />
          <SelectFilter label="Government Department" options={authorityTypes} value={selectedAuth} onChange={setSelectedAuth} />
        </div>
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between text-xs text-foreground/50 pt-1">
        <span>Available Approvals: <strong className="text-foreground">{filteredDocs.length}</strong></span>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-india-blue hover:underline cursor-pointer font-semibold">
            Reset Filters
          </button>
        )}
      </div>

      {/* Document Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl bg-background p-4 flex flex-col justify-between hover:border-foreground/20 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider">
                    {doc.type}
                  </span>
                  <h3 className="font-bold text-base text-foreground leading-snug break-words mt-0.5">
                    {doc.title}
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-border text-foreground/60 border border-border shrink-0">
                  {doc.authorityCategory}
                </span>
              </div>
              <p className="text-xs text-foreground/50 mb-2 truncate">{doc.authorityName}</p>
              <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed mb-3">
                {doc.description}
              </p>

              <div className="grid grid-cols-2 gap-2 border-t border-b border-border py-2.5 text-[11px] font-mono">
                <div>
                  <span className="text-foreground/40 block text-[10px] uppercase tracking-wider">Time</span>
                  <span className="text-foreground font-bold">~{doc.processingTimeDays} Days</span>
                </div>
                <div>
                  <span className="text-foreground/40 block text-[10px] uppercase tracking-wider">Govt Fee</span>
                  <span className="text-foreground font-bold">{doc.feeEstimate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3">
              <button
                onClick={() => setActiveInfoDoc(doc)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-india-blue hover:text-india-blue text-xs font-semibold text-foreground/60 transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                Details
              </button>
              <button
                onClick={() => setApplyingDoc(doc)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-india-blue text-white hover:opacity-90 text-xs font-semibold transition-opacity cursor-pointer"
              >
                Apply Now <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={!!activeInfoDoc}
        onClose={() => setActiveInfoDoc(null)}
        maxWidth="sm:max-w-lg"
        badge="Approval Details"
        title={activeInfoDoc?.title}
        footer={
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button onClick={() => setActiveInfoDoc(null)} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-border transition-colors cursor-pointer text-center">
              Close
            </button>
            <button
              onClick={() => { const t = activeInfoDoc; setActiveInfoDoc(null); setApplyingDoc(t); }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
            >
              Proceed to Apply
            </button>
          </div>
        }
      >
        {activeInfoDoc && (
          <div className="space-y-4 text-xs sm:text-sm text-foreground">
            <div>
              <h4 className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">
                Why is this approval required?
              </h4>
              <p className="text-foreground/90 leading-relaxed">{activeInfoDoc.importance}</p>
            </div>
            <div className="border border-border rounded-lg p-3 space-y-2 text-xs font-mono">
              {[
                { label: 'Department', value: activeInfoDoc.authorityName },
                { label: 'Expected Timeline', value: `${activeInfoDoc.processingTimeDays} working days` },
                { label: 'Government Fee', value: activeInfoDoc.feeEstimate },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-0.5 border-b border-border/40 last:border-0 pb-1.5 last:pb-0">
                  <span className="text-foreground/50">{label}:</span>
                  <span className="text-foreground font-semibold sm:text-right break-words">{value}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
                Documents You Will Need
              </h4>
              <ul className="space-y-1.5 pl-1">
                {activeInfoDoc.prerequisites.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground/80 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-india-blue shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Apply Modal */}
      <Modal
        isOpen={!!applyingDoc}
        onClose={() => setApplyingDoc(null)}
        maxWidth="sm:max-w-md"
        title="Start Application"
        footer={
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button onClick={() => setApplyingDoc(null)} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-border transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleConfirmApply}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Confirm & Continue'
              )}
            </button>
          </div>
        }
      >
        {applyingDoc && (
          <>
            <p className="text-xs text-foreground/70 mt-1">
              You are starting an application for{' '}
              <span className="font-semibold text-foreground">{applyingDoc.title}</span>.
            </p>
            <div className="my-4 p-3 rounded-lg border border-india-blue/20 bg-india-blue/5 text-xs text-foreground space-y-1">
              <p className="font-bold text-india-blue">Direct Department Submission</p>
              <p className="text-foreground/60">Department: {applyingDoc.authorityName}</p>
              <p className="text-foreground/60">
                District:{' '}
                {selectedDistrict === 'All Districts' ? 'Maharashtra State Default' : selectedDistrict}
              </p>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CustomDocsApplyPage;