import React from 'react';
import { Check } from 'lucide-react';

export const ApprovalRow = ({
  doc,
  isActive,
  onRowClick,
  onToggleApply,
  onToggleAlreadyHave,
  onFileUpload,
}) => {
  return (
    <div
      onClick={() => onRowClick(doc)}
      className={`border rounded-xl bg-background transition-colors cursor-pointer p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isActive
          ? 'border-india-blue shadow-sm shadow-india-blue/10'
          : 'border-border hover:border-foreground/20'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <input
          type="checkbox"
          checked={doc.checkedForApply}
          disabled={doc.alreadyHave}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onToggleApply(doc.id);
          }}
          className="mt-1 h-4 w-4 rounded border-border text-india-blue focus:ring-india-blue cursor-pointer disabled:opacity-30"
        />
        <div className="min-w-0">
          <span
            className={`text-sm font-bold block break-words leading-snug ${
              doc.alreadyHave ? 'line-through text-foreground/40' : 'text-foreground'
            }`}
          >
            {doc.docName}
          </span>
          <p className="text-xs text-foreground/50 mt-0.5">{doc.authority}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-0 border-border">
        <div className="text-left sm:text-right font-mono">
          <span className="text-[10px] text-foreground/40 block font-sans">Govt Fee</span>
          <span
            className={`text-sm font-bold ${
              doc.alreadyHave ? 'line-through text-foreground/40' : 'text-foreground'
            }`}
          >
            ₹{doc.fee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAlreadyHave(doc.id);
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              doc.alreadyHave
                ? 'border-india-blue/30 bg-india-blue/10 text-india-blue'
                : 'border-border text-foreground/60 hover:border-foreground/40'
            }`}
          >
            {doc.alreadyHave ? '✓ Already Have' : 'Already have this?'}
          </button>
          {doc.alreadyHave && (
            <label
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1 rounded-lg bg-border text-foreground/70 hover:bg-foreground/10 text-xs font-medium cursor-pointer transition-colors"
            >
              <span>{doc.uploadedFile ? '📎 Attached' : 'Attach PDF'}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) onFileUpload(doc.id, e.target.files[0].name);
                }}
              />
            </label>
          )}
        </div>
      </div>

      {doc.uploadedFile && (
        <div className="pl-7 text-[11px] text-india-blue font-mono flex items-center gap-1">
          <Check className="w-3 h-3" /> {doc.uploadedFile}
        </div>
      )}
    </div>
  );
};