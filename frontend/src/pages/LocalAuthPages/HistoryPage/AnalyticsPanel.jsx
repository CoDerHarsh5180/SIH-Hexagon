import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const ProgressBar = ({ label, percentage, colorClass }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-semibold">
      <span className="text-foreground/70">{label}</span>
      <span className="text-foreground">{percentage}%</span>
    </div>
    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  </div>
);

export const AnalyticsPanel = ({ stats }) => {
  return (
    <div className="border border-border rounded-xl p-4 sm:p-6 bg-background space-y-5">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <BarChart3 className="w-5 h-5 text-india-blue" />
        <h2 className="text-base font-bold text-foreground">Work Performance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Graph Bars */}
        <div className="space-y-4">
          <ProgressBar label="Files Signed Successfully" percentage={75} colorClass="bg-india-blue" />
          <ProgressBar label="Files Rejected" percentage={15} colorClass="bg-india-orange" />
          <ProgressBar label="Files Pending Inspection" percentage={10} colorClass="bg-foreground/40" />
        </div>

        {/* Time Data */}
        <div className="flex flex-col justify-center space-y-4 bg-border/5 p-4 rounded-lg border border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-foreground/70">Average Time to Sign:</span>
            <span className="text-lg font-bold text-india-blue">{stats.avgDaysToSign} Days</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-xs font-semibold text-foreground/70">Files Cleared On Time:</span>
            <span className="text-sm font-bold text-india-blue">94%</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-xs font-semibold text-foreground/70">Files Delayed:</span>
            <span className="text-sm font-bold text-india-orange">6%</span>
          </div>
        </div>
      </div>
    </div>
  );
};