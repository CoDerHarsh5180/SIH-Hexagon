import React from 'react';

export const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="border border-border rounded-xl p-4 bg-background flex items-center space-x-4">
      <div className={`p-3 rounded-lg bg-border/20 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
};