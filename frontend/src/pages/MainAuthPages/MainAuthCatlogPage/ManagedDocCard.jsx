import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Wallet, FileText, ArrowRight } from 'lucide-react';

export const ManagedDocCard = ({ doc, onClick }) => {
  const isDraft = doc.status === 'DRAFT';
  const isPaused = doc.status === 'PAUSED';

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={() => onClick(doc)}
      className={`border rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer ${
        isDraft ? 'bg-border/10 border-dashed border-border' : 'bg-background border-border hover:border-india-blue hover:shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border text-foreground/70 bg-border/10">
              {doc.category}
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                doc.status === 'ACTIVE'
                  ? 'bg-india-blue/10 text-india-blue'
                  : isPaused
                  ? 'bg-india-orange/10 text-india-orange'
                  : 'bg-border text-foreground/60'
              }`}
            >
              {doc.status}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground leading-snug mb-1">
          {doc.name}
        </h3>
        <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed h-8">
          {doc.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4 border-t border-border pt-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-foreground/70">
            <Clock className="w-3.5 h-3.5 text-india-blue" />
            <span>{doc.slaDays} Days SLA</span>
          </div>
          <div className="flex items-center space-x-1.5 text-foreground/70">
            <Wallet className="w-3.5 h-3.5 text-india-blue" />
            <span>{doc.baseFee}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between border-t border-dashed border-border text-xs">
        <div className="text-foreground/50 font-mono">
          <span className="block text-[10px] uppercase font-sans">Applications</span>
          <span className="font-semibold text-foreground">{doc.totalApplications.toLocaleString()}</span>
        </div>
        
        <button className="flex items-center space-x-1 font-semibold text-india-blue hover:underline">
          <span>Manage Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};