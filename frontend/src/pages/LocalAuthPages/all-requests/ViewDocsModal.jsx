import React from 'react';
import { motion } from 'framer-motion';

export const ViewDocsModal = ({ req, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background border-t sm:border border-border w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">
              Applicant Attached Files
            </span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{req.enterprise.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="py-4 space-y-2.5">
          {req.userDocs.map((doc) => (
            <div key={doc.id} className="border border-border rounded-lg p-3 flex items-center justify-between gap-3 bg-border/5">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded border border-border flex items-center justify-center shrink-0 text-india-blue bg-background">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{doc.title}</p>
                  <p className="text-[10px] text-foreground/50 font-mono">{doc.size}</p>
                </div>
              </div>

              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded border border-border hover:border-india-blue text-xs font-semibold text-foreground hover:text-india-blue transition-colors shrink-0"
              >
                Open PDF
              </a>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 cursor-pointer"
          >
            Close Document Viewer
          </button>
        </div>
      </motion.div>
    </div>
  );
};