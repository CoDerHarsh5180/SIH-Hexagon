import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader, AIAdvisorPanel } from '../../../components/ui';
import { ApprovalRow } from './ApprovalRow';
import { ApplyPaymentModal } from './ApplyPaymentModal';
import { initialApprovalsList, userSystemVault } from './mockApprovalsData';
import { approvalsService, applicationsService } from '../../../services';

const MAX_HISTORY = 3;

export const ListOfApprovalsPage = () => {
  const location = useLocation();
  const [approvals, setApprovals] = useState(initialApprovalsList);
  const [activeInsight, setActiveInsight] = useState(null);
  const [insightHistory, setInsightHistory] = useState([]);
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [globalUploadedDocs, setGlobalUploadedDocs] = useState({ ...userSystemVault }); 

  // Ingest questionnaire evaluation results if routed from AskForApprovals
  useEffect(() => {
    const evalData = location.state?.evaluationResult;
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
        requiredDocs: ['Site Plan', 'EIA Report', 'Land Allotment Letter'],
        checkedForApply: true,
        alreadyHave: false,
        uploadedFile: null,
      }));
      setApprovals(mapped);
    }
  }, [location.state]);

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
          feePaid: item.fee,
          submissionDate: new Date().toISOString(),
        }).catch((err) => console.warn('[ApplyApproval] Item submit notice:', err.message));
      }
    } finally {
      setIsApplyModalOpen(false);
      setGlobalUploadedDocs({ ...userSystemVault });
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      <PageHeader
        title="Required Approvals & Clearances"
        subtitle="Click any row to get AI explanation of why it's required. Check items to apply, or submit PDFs if already obtained."
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
              <span className="text-xs text-foreground/50 block">Selected for Application</span>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {applyItems.length} papers &bull; Total:{' '}
                <strong className="text-india-blue font-mono text-base">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </strong>
              </p>
            </div>
            <button
              disabled={applyItems.length === 0}
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-india-blue text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Apply Now ({applyItems.length})
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIAdvisorPanel
            insight={activeInsight}
            history={insightHistory}
            subtitle="Click any document row"
            idleTitle="Select a document"
            idleBody="Click any row in the list to get an AI explanation of why that clearance is required for your enterprise."
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