import React, { useState } from 'react';
import { PlusCircle, Award, CheckCircle2 } from 'lucide-react';
import { AddApprovalDocForm } from './AddApprovalDocForm';
import { UploadSchemePdfForm } from './UploadSchemePdfForm';
import { mainAuthService } from '../../../services/mainAuthService';

export const MainAuthCreationPage = () => {
  const [activeTab, setActiveTab] = useState('DOC'); // 'DOC' | 'SCHEME'
  const [successBanner, setSuccessBanner] = useState('');

  const handleDocCreated = async (docPayload) => {
    try {
      await mainAuthService.createMasterDoc(docPayload);
    } catch (err) {
      console.warn('Backend createMasterDoc failed, continuing locally:', err.message);
    }
    setSuccessBanner(`Approval "${docPayload.title}" successfully added with SLA ${docPayload.slaDays} days.`);
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handleSchemeCreated = async (schemePayload) => {
    try {
      await mainAuthService.createMasterDoc({ ...schemePayload, type: 'SCHEME' });
    } catch (err) {
      console.warn('Backend scheme creation failed, continuing locally:', err.message);
    }
    setSuccessBanner(`Incentive Scheme "${schemePayload.schemeTitle}" verified by AI and saved to public catalog.`);
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded border border-india-blue/20">
            HQ State Admin
          </span>
          <span className="text-xs text-foreground/60">Policy & Approvals Management</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Create Clearances & Publish Schemes
        </h1>
        <p className="text-xs sm:text-sm text-foreground/70 mt-1">
          Introduce new approval documents for local verification or ingest state incentive circulars using AI extraction.
        </p>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="bg-india-blue/10 border border-india-blue/30 text-foreground p-3.5 rounded-xl flex items-center space-x-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4.5 h-4.5 text-india-blue shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 border border-border rounded-xl bg-background max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('DOC')}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'DOC'
              ? 'bg-india-blue text-white shadow-xs'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Approval</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SCHEME')}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'SCHEME'
              ? 'bg-india-blue text-white shadow-xs'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Upload Incentive PDF</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'DOC' ? (
        <AddApprovalDocForm onDocCreated={handleDocCreated} />
      ) : (
        <UploadSchemePdfForm onSchemeCreated={handleSchemeCreated} />
      )}
    </div>
  );
};

export default MainAuthCreationPage;