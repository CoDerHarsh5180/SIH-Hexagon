import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Landmark, 
  Coins 
} from 'lucide-react';
import { mockAiExtractSchemePdf } from './mockNewDocSchemesData';

export const UploadSchemePdfForm = ({ onSchemeCreated }) => {
  const [file, setFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setExtractedData(null);
    }
  };

  const handleRunAiAnalysis = () => {
    if (!file) return;
    setIsExtracting(true);
    setTimeout(() => {
      const result = mockAiExtractSchemePdf(file.name);
      setExtractedData(result);
      setIsExtracting(false);
    }, 1200);
  };

  const handleSaveScheme = () => {
    if (!extractedData) return;
    onSchemeCreated({
      id: `SCHEME-${Date.now().toString().slice(-4)}`,
      fileName: file.name,
      ...extractedData,
      status: 'PUBLISHED',
      datePublished: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Upload Zone */}
      <div className="border border-border rounded-xl p-5 sm:p-6 bg-background space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Upload Scheme / Policy Document</h3>
          <p className="text-foreground/60 text-[11px] mt-0.5">
            Submit Government Resolutions (GR), incentive circulars, or subsidies in PDF format.
          </p>
        </div>

        <div className="border-2 border-dashed border-border hover:border-india-blue rounded-xl p-6 text-center bg-border/5 transition-colors">
          <input
            type="file"
            id="scheme-upload"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="scheme-upload" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-india-blue mb-2" />
            <span className="text-sm font-bold text-foreground">
              {file ? file.name : 'Click to select Policy PDF'}
            </span>
            <span className="text-[11px] text-foreground/50 mt-1">
              Supports official Gazette notifications & industrial policy guidelines (Max 25MB)
            </span>
          </label>
        </div>

        {file && !extractedData && (
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isExtracting}
              onClick={handleRunAiAnalysis}
              className="px-5 py-2.5 rounded-lg bg-india-blue text-white font-bold hover:opacity-90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isExtracting ? 'AI Analyzing Guidelines...' : 'Extract Content with AI'}</span>
            </button>
          </div>
        )}
      </div>

      {/* AI Parsed Results Confirmation View */}
      {extractedData && (
        <div className="border border-india-blue/30 rounded-xl p-5 bg-background space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-india-blue" />
              <h3 className="text-sm font-bold text-foreground">AI Policy Analysis Summary</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded">
              Ready for Catalog DB
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-foreground/50 block">Extracted Policy Title</span>
              <p className="text-sm font-bold text-foreground mt-0.5">{extractedData.schemeTitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-border/5">
                <span className="text-[10px] uppercase font-bold text-foreground/50 block mb-1">
                  Subsidy Intensity
                </span>
                <span className="font-mono font-bold text-sm text-india-blue">
                  {extractedData.maxSubsidyPercentage}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-border/5">
                <span className="text-[10px] uppercase font-bold text-foreground/50 block mb-1">
                  Maximum Ceiling
                </span>
                <span className="font-mono font-bold text-sm text-foreground">
                  {extractedData.maxCeilingAmount}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-foreground/50 block mb-1">
                Target Industrial Sectors
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.targetSectors.map((sector, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-border text-foreground font-semibold text-[11px]">
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-foreground/50 block mb-1">
                Eligibility Conditions
              </span>
              <ul className="space-y-1 bg-border/5 p-3 rounded-lg border border-border">
                {extractedData.eligibilityCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-foreground/80">
                    <Check className="w-3.5 h-3.5 text-india-blue shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setExtractedData(null)}
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-border cursor-pointer"
            >
              Discard / Re-upload
            </button>
            <button
              type="button"
              onClick={handleSaveScheme}
              className="px-5 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer flex items-center gap-1.5"
            >
              <span>Commit Scheme to Database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};