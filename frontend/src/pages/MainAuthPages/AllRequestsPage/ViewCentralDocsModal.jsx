import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export const ViewCentralDocsModal = ({ req, onClose }) => {
  if (!req) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-2xl bg-background border border-border rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-border/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-india-blue" />
            <div>
              <h2 className="text-base font-bold text-foreground">Central Clearance Dossier</h2>
              <span className="text-xs text-foreground/60 font-mono">
                {req.requestId} &bull; {req.requestedDocName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border hover:bg-border text-foreground/70 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Forwarding Meta */}
          <div className="p-3 rounded-lg border border-border bg-border/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-foreground/40 block">Clearance Level</span>
              <span className="font-semibold text-india-blue">{req.clearanceLevel?.replace(/_/g, ' ')}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-foreground/40 block">Forwarded By Local Desk</span>
              <span className="font-semibold text-foreground">{req.forwardedBy}</span>
            </div>
          </div>

          {/* Scrutiny Pipeline Trail */}
          {req.scrutinyHistory && req.scrutinyHistory.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider block mb-2">
                Preceding Inter-Authority Scrutiny Trail
              </span>
              <div className="space-y-2 border border-border rounded-lg p-3">
                {req.scrutinyHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs pb-1.5 border-b border-border/50 last:border-0 last:pb-0">
                    <div>
                      <span className="font-semibold text-foreground">{h.stage}</span>
                      <p className="text-[11px] text-foreground/60">{h.officer} &bull; {h.date}</p>
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-india-blue/10 text-india-blue border border-india-blue/20">
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Documents List */}
          <div>
            <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider block mb-2">
              Attached Statutory Dossier ({req.userDocs?.length || 0} files)
            </span>
            <div className="space-y-2">
              {req.userDocs?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-india-blue/50 transition-colors bg-background"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-india-blue shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-foreground truncate text-xs">{doc.title}</p>
                      <span className="text-[10px] font-mono text-foreground/50">{doc.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded border border-border text-[11px] font-semibold text-foreground/70 hover:text-india-blue hover:border-india-blue transition-colors inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </a>
                    <a
                      href={doc.fileUrl}
                      download
                      className="px-2.5 py-1 rounded border border-border text-[11px] font-semibold text-foreground/70 hover:text-india-blue hover:border-india-blue transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-border/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-border transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewCentralDocsModal;
