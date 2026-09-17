import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader, AIAdvisorPanel } from '../../../components/ui';
import { ApprovalRow } from './ApprovalRow';
import { ApplyPaymentModal } from './ApplyPaymentModal';
import { approvalsService, applicationsService, vaultService } from '../../../services';
import { useAuth } from '../../../context/AuthContext';

const MAX_HISTORY = 3;

export const ListOfApprovalsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [activeInsight, setActiveInsight] = useState(null);
  const [insightHistory, setInsightHistory] = useState([]);
  const [restoredBanner, setRestoredBanner] = useState(false);
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [globalUploadedDocs, setGlobalUploadedDocs] = useState({}); 

  // Strict Guard & Ingestion: List of Approvals should ONLY be opened through Ask For Approvals page
  useEffect(() => {
    let savedApprovals = null;
    try {
      const saved = sessionStorage.getItem('saral_pending_approvals') || sessionStorage.getItem('docflow_pending_approvals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.approvals && Array.isArray(parsed.approvals) && parsed.approvals.length > 0) {
          savedApprovals = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to restore cached approvals:', e);
    }

    const evalData = location.state?.evaluationResult;

    // If neither questionnaire evaluation result nor cached session exists, redirect back to Ask For Approvals
    if (!evalData && !savedApprovals) {
      const targetApprovalRoute = location.pathname.startsWith('/user') ? '/user/approvals' : '/approvals';
      navigate(targetApprovalRoute, { 
        replace: true, 
        state: { needQuestionnaire: true } 
      });
      return;
    }

    // If we have cached approvals from prior session
    if (savedApprovals) {
      setApprovals(savedApprovals.approvals);
      setRestoredBanner(true);
      if (isAuthenticated) {
        setIsApplyModalOpen(true);
        sessionStorage.removeItem('saral_pending_approvals');
        sessionStorage.removeItem('docflow_pending_approvals');
      }
      return;
    }

    // Ingest evaluation results from Ask For Approvals
    if (evalData?.mandatoryApprovals && Array.isArray(evalData.mandatoryApprovals) && evalData.mandatoryApprovals.length > 0) {
      const mapped = evalData.mandatoryApprovals.map((item, idx) => ({
        id: item.approvalId || `APP-EVAL-${idx}`,
        docName: item.title,
        authority: item.authority,
        fee: item.estimatedFeeInr || 15000,
        aiReason: item.reason || 'Statutory requirement identified based on your enterprise inputs.',
        tag: item.urgency || 'Mandatory',
        aiPoints: [
          `Category: ${item.category}`,
          `Statutory Act: ${item.statutoryAct || 'State Industrial Act'}`,
          `SLA Days: ${item.maxSlaDays || 30} days`,
        ],
        requiredDocs: (Array.isArray(item.requiredDocs) && item.requiredDocs.length > 0) ? item.requiredDocs : ['Site Plan', 'EIA Report', 'Land Allotment Letter'],
        checkedForApply: true,
        alreadyHave: false,
        uploadedFile: null,
      }));
      setApprovals(mapped);
    } else {
      // If evaluation returned empty or invalid data, navigate back to questionnaire
      const targetApprovalRoute = location.pathname.startsWith('/user') ? '/user/approvals' : '/approvals';
      navigate(targetApprovalRoute, { replace: true, state: { needQuestionnaire: true } });
    }
  }, [location.state, location.pathname, isAuthenticated, navigate]);

  // Load user's real uploaded documents from Cloudinary vault to automatically attach to approvals
  useEffect(() => {
    vaultService.getVaultDocuments()
      .then((res) => {
        const docs = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        const vaultMap = {};
        docs.forEach((d) => {
          if (d.category === 'PAN_CARD' || d.category === 'AADHAAR_CARD') {
            vaultMap['Identity Proof (Aadhaar/PAN)'] = d.fileName || 'Verified_ID.pdf';
          }
          if (d.category === 'LAND_RECORD') {
            vaultMap['7/12 Land Extract'] = d.fileName || 'Land_Record_7_12.pdf';
            vaultMap['Site Plan / Layout'] = d.fileName || 'Site_Plan.pdf';
          }
          if (d.category === 'UDYAM_REGISTRATION') {
            vaultMap['Udyam Registration'] = d.fileName || 'Udyam_Registration.pdf';
          }
          if (d.category === 'GSTIN_CERTIFICATE') {
            vaultMap['GSTIN Certificate'] = d.fileName || 'GST_Certificate.pdf';
          }
          if (d.category === 'SITE_PLAN_BLUEPRINT') {
            vaultMap['Site Plan / Layout'] = d.fileName || 'Blueprint_Layout.pdf';
          }
          if (d.documentName) {
            vaultMap[d.documentName] = d.fileName || `${d.documentName}.pdf`;
          }
        });
        setGlobalUploadedDocs(vaultMap);
      })
      .catch((err) => console.warn('Could not load user vault documents:', err.message));
  }, []);

  const toggleField = (id, field) =>
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: !item[field],
              ...(field === 'alreadyHave' && !item.alreadyHave ? { checkedForApply: false } : {}),
            }
          : item
      )
    );

  const handleMainFileUpload = (id, fileName) =>
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, uploadedFile: fileName } : item))
    );

  const handleRequiredDocUpload = (docName, fileName) => {
    setGlobalUploadedDocs((prev) => ({ ...prev, [docName]: fileName }));
  };

  const handleRowClick = (doc) => {
    const insight = {
      field: 'doc',
      value: doc.id,
      title: doc.docName,
      body: doc.aiReason,
      tag: doc.tag,
      points: [
        ...doc.aiPoints,
        `Issuing Authority: ${doc.authority}`,
        `Government Fee: ₹${doc.fee.toLocaleString('en-IN')}`,
      ],
    };
    setInsightHistory((prev) =>
      activeInsight ? [activeInsight, ...prev].slice(0, MAX_HISTORY) : prev
    );
    setActiveInsight(insight);
  };

  const applyItems = approvals.filter((item) => item.checkedForApply && !item.alreadyHave);
  const totalAmount = applyItems.reduce((acc, curr) => acc + curr.fee, 0);

  const uniqueRequiredDocs = Array.from(
    new Set(applyItems.flatMap((item) => item.requiredDocs || []))
  );

  const handlePaymentSuccess = async () => {
    try {
      for (const item of applyItems) {
        await applicationsService.submitApplication({
          approvalId: item.id,
          approvalTitle: item.docName,
          authority: item.authority,
          department: item.authority,
          district: user?.district || user?.location?.district || 'Pune',
          feePaid: item.fee,
          submissionDate: new Date().toISOString(),
        }).catch((err) => console.warn('[ApplyApproval] Item submit notice:', err.message));
      }
    } finally {
      setIsApplyModalOpen(false);
    }
  };

  const handleApplyNowClick = () => {
    if (!isAuthenticated) {
      // Save pending selections to sessionStorage so the user does not lose their checklist
      try {
        sessionStorage.setItem('saral_pending_approvals', JSON.stringify({
          approvals,
          applyItems,
          evaluationResult: location.state?.evaluationResult || null,
          savedAt: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('Unable to cache pending approvals:', e);
      }

      // Route to login page with preserved intention
      navigate('/login', { 
        state: { 
          from: location,
          intent: 'APPLY_APPROVALS',
          itemCount: applyItems.length 
        } 
      });
      return;
    }

    setIsApplyModalOpen(true);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      {restoredBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <span>✨</span>
            <span>Your saved approvals list has been restored.</span>
          </span>
          <button 
            onClick={() => setRestoredBanner(false)} 
            className="text-emerald-900 dark:text-emerald-200 font-bold hover:underline cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      <PageHeader
        title="Required Government Approvals & Licenses"
        subtitle="Click any approval to see why it is needed. Select the ones you want to apply for today, or attach existing certificates if you already have them."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            {approvals.map((doc) => (
              <ApprovalRow
                key={doc.id}
                doc={doc}
                isActive={activeInsight?.value === doc.id}
                onRowClick={handleRowClick}
                onToggleApply={(id) => toggleField(id, 'checkedForApply')}
                onToggleAlreadyHave={(id) => toggleField(id, 'alreadyHave')}
                onFileUpload={handleMainFileUpload}
              />
            ))}
          </div>

          <div className="border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-foreground/50 block">Selected to Apply Now</span>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {applyItems.length} Approvals &bull; Total Govt Fee:{' '}
                <strong className="text-india-blue font-mono text-base">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </strong>
              </p>
            </div>
            <button
              disabled={applyItems.length === 0}
              onClick={handleApplyNowClick}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-india-blue text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Apply & Pay Online ({applyItems.length})
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIAdvisorPanel
            insight={activeInsight}
            history={insightHistory}
            subtitle="Click any approval to read"
            idleTitle="Select an approval"
            idleBody="Click on any permission or license in the list, and the AI will explain why your factory needs it in simple terms."
          />
        </div>
      </div>

      <ApplyPaymentModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        totalAmount={totalAmount}
        uniqueRequiredDocs={uniqueRequiredDocs}
        globalUploadedDocs={globalUploadedDocs}
        onRequiredDocUpload={handleRequiredDocUpload}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ListOfApprovalsPage;