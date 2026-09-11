import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Building2, FileText } from 'lucide-react';

export const RecordDetailsModal = ({ record, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background border-t sm:border border-border w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6"
      >
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider block">
              Record Details
            </span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{record.docName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer bg-border/20"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Status Banner */}
          <div className={`p-3 rounded-lg border flex items-center space-x-2 ${
            record.category === 'SIGNED' ? 'bg-india-blue/10 border-india-blue/30 text-india-blue' :
            record.category === 'REJECTED' ? 'bg-india-orange/10 border-india-orange/30 text-india-orange' :
            'bg-border/20 border-border text-foreground'
          }`}>
            <div className="font-bold">{record.statusMessage}</div>
            <span className="text-foreground/50">|</span>
            <span className="font-mono">{record.timeTaken}</span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 bg-border/10 p-3 rounded-lg border border-border">
            <div>
              <span className="text-[10px] text-foreground/50 block">Factory / Business</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" /> {record.enterpriseName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-foreground/50 block">Applicant Name</span>
              <span className="font-semibold text-foreground mt-0.5 block">{record.owner}</span>
            </div>
            <div className="border-t border-border pt-2 mt-1">
              <span className="text-[10px] text-foreground/50 block">Date Received</span>
              <span className="font-mono text-foreground mt-0.5 block">{record.dateSubmitted}</span>
            </div>
            <div className="border-t border-border pt-2 mt-1">
              <span className="text-[10px] text-foreground/50 block">Date Action Taken</span>
              <span className="font-mono text-foreground mt-0.5 block">{record.dateActionTaken}</span>
            </div>
          </div>

          {/* Documents Submitted */}
          <div>
            <span className="text-[11px] font-bold text-foreground block mb-2">Documents Checked by You:</span>
            <div className="space-y-1.5">
              {record.userDocs.map((doc, i) => (
                <div key={i} className="flex items-center space-x-2 text-foreground/80 bg-background border border-border p-2 rounded">
                  <FileText className="w-3.5 h-3.5 text-india-blue" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Remarks */}
          <div className="border-t border-border pt-3">
            <span className="text-[11px] font-bold text-foreground block mb-1">Your Official Remarks:</span>
            <p className="text-foreground/80 leading-relaxed bg-border/5 p-2 rounded border border-border">
              {record.officerRemarks}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-border text-foreground font-semibold text-xs hover:bg-foreground hover:text-background transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};