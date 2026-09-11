import React from 'react';
import { Eye } from 'lucide-react';

export const HistoryRecordCard = ({ record, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-border rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-india-blue transition-colors cursor-pointer bg-border/5"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
            record.category === 'SIGNED' ? 'bg-india-blue/10 text-india-blue' :
            record.category === 'REJECTED' ? 'bg-india-orange/10 text-india-orange' :
            'bg-border text-foreground'
          }`}>
            {record.category}
          </span>
          <span className="text-xs font-mono text-foreground/50">{record.id}</span>
        </div>
        <h3 className="text-sm font-bold text-foreground truncate">{record.docName}</h3>
        <p className="text-xs text-foreground/70 truncate">{record.enterpriseName}</p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-0 border-border pt-2 sm:pt-0 mt-1 sm:mt-0">
        <div className="text-left sm:text-right">
          <span className="block text-[10px] text-foreground/50">Action Date</span>
          <span className="text-xs font-mono font-semibold text-foreground">{record.dateActionTaken}</span>
        </div>
        <button className="p-1.5 rounded bg-background border border-border text-foreground hover:text-india-blue hover:border-india-blue transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};