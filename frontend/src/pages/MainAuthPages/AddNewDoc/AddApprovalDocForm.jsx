import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileCheck2, 
  Clock, 
  IndianRupee, 
  Search 
} from 'lucide-react';
import { approvalCategories, commonRequiredDocSuggestions, mockAiRefineDescription } from './mockNewDocSchemesData';

export const AddApprovalDocForm = ({ onDocCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(approvalCategories[0]);
  const [slaDays, setSlaDays] = useState('30');
  const [fee, setFee] = useState('5000');
  const [description, setDescription] = useState('');
  const [isAiRefining, setIsAiRefining] = useState(false);

  // Required docs array
  const [requiredDocs, setRequiredDocs] = useState([
    'Site Plan & Building Blueprint',
    'Aadhaar / Identity Proof of Director',
  ]);
  const [newDocInput, setNewDocInput] = useState('');

  // Inspection requirements
  const [requiresInspection, setRequiresInspection] = useState(true);
  const [inspectionTiming, setInspectionTiming] = useState('Before Approval Issuance');

  const handleRefineDescription = () => {
    setIsAiRefining(true);
    setTimeout(() => {
      const refined = mockAiRefineDescription(description);
      setDescription(refined);
      setIsAiRefining(false);
    }, 700);
  };

  const addRequiredDoc = (name) => {
    const val = name || newDocInput;
    if (!val.trim()) return;
    if (!requiredDocs.includes(val.trim())) {
      setRequiredDocs([...requiredDocs, val.trim()]);
    }
    setNewDocInput('');
  };

  const removeRequiredDoc = (index) => {
    setRequiredDocs(requiredDocs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a document title.');
      return;
    }
    if (requiredDocs.length === 0) {
      alert('Please specify at least one required prerequisite document.');
      return;
    }

    const payload = {
      id: `DOC-AUTH-${Date.now().toString().slice(-4)}`,
      title,
      category,
      slaDays: Number(slaDays),
      fee: Number(fee),
      description,
      requiredDocs,
      requiresInspection,
      inspectionTiming: requiresInspection ? inspectionTiming : 'None',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onDocCreated(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      {/* Basic Meta Details */}
      <div className="border border-border rounded-xl p-4 sm:p-5 bg-background space-y-4">
        <h3 className="text-sm font-bold text-foreground">1. Clearance Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
              Document / Approval Title <span className="text-india-blue">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Consent to Establish (CTE) - Orange Category"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
              Sector / Classification
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
            >
              {approvalCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <label className="block font-sans text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                Target SLA (Days)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  value={slaDays}
                  onChange={(e) => setSlaDays(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 pl-8 text-foreground focus:outline-none focus:border-india-blue"
                />
                <Clock className="w-4 h-4 text-foreground/40 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                Govt Fee (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 pl-8 text-foreground focus:outline-none focus:border-india-blue"
                />
                <IndianRupee className="w-4 h-4 text-foreground/40 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Description Refinement Box */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider">
              Legal Scope & Description
            </label>
            <button
              type="button"
              onClick={handleRefineDescription}
              disabled={isAiRefining}
              className="text-india-blue font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiRefining ? 'Refining with AI...' : 'Refine with AI'}</span>
            </button>
          </div>
          <textarea
            rows="3"
            required
            placeholder="Describe what this approval regulates and why enterprises are mandated to obtain it..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground leading-relaxed focus:outline-none focus:border-india-blue"
          />
        </div>
      </div>

      {/* Required Documents Section */}
      <div className="border border-border rounded-xl p-4 sm:p-5 bg-background space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">2. Required Supporting Documents</h3>
          <p className="text-foreground/60 text-[11px] mt-0.5">
            Applicants must supply all of these certificates/drawings to be verified by desk officers.
          </p>
        </div>

        {/* Selected List */}
        <div className="space-y-2">
          {requiredDocs.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-border/5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-india-blue shrink-0" />
                <span className="font-semibold text-foreground truncate">{doc}</span>
              </div>
              <button
                type="button"
                onClick={() => removeRequiredDoc(idx)}
                className="text-foreground/40 hover:text-india-orange cursor-pointer p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Custom / Suggestions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Type custom required document name..."
            value={newDocInput}
            onChange={(e) => setNewDocInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addRequiredDoc();
              }
            }}
            className="flex-1 bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue"
          />
          <button
            type="button"
            onClick={() => addRequiredDoc()}
            className="px-4 py-2 bg-border text-foreground hover:bg-foreground hover:text-background font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="pt-1">
          <span className="text-[10px] uppercase font-bold text-foreground/50 block mb-1.5">
            Frequently Required (Click to add):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {commonRequiredDocSuggestions
              .filter((s) => !requiredDocs.includes(s))
              .map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => addRequiredDoc(suggestion)}
                  className="px-2 py-1 rounded-md border border-border text-[11px] text-foreground/70 hover:border-india-blue hover:text-india-blue cursor-pointer transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Field Inspection Protocols */}
      <div className="border border-border rounded-xl p-4 sm:p-5 bg-background space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">3. Site Inspection Mandate</h3>
            <p className="text-foreground/60 text-[11px] mt-0.5">
              Does this approval require an officer physical visit to verify factory machinery, safety, or open space?
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRequiresInspection(!requiresInspection)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              requiresInspection ? 'bg-india-blue' : 'bg-border'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                requiresInspection ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {requiresInspection && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
            <div>
              <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                Inspection Schedule Phase
              </label>
              <select
                value={inspectionTiming}
                onChange={(e) => setInspectionTiming(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue"
              >
                <option value="Before Approval Issuance">Before Approval Issuance (Strict Prerequisite)</option>
                <option value="Post-Grant Verification (30 Days)">Post-Grant Verification (Within 30 Days)</option>
                <option value="Joint Multi-Department Inspection">Joint Multi-Department Inspection</option>
              </select>
            </div>
            <div className="flex items-center text-foreground/60 text-[11px] bg-border/5 p-3 rounded-lg border border-border">
              <span>Automatic notification will be issued to local area inspection teams upon applicant fee confirmation.</span>
            </div>
          </div>
        )}
      </div>

      {/* Form Submission */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-india-blue text-white font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Publish Clearance into System</span>
        </button>
      </div>
    </form>
  );
};