import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileCheck, XCircle, Clock, Calendar } from 'lucide-react';

import { performanceStats, historyRecords } from './localAuthMockData';
import { StatCard } from './StatCard';
import { AnalyticsPanel } from './AnalyticsPanel';
import { HistoryRecordCard } from './HistoryRecordCard';
import { RecordDetailsModal } from './RecordDetailsModal';

export const LocalAuthHistoryPage = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredRecords = historyRecords.filter(
    (record) => activeTab === 'ALL' || record.category === activeTab
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Office Dashboard & History
        </h1>
        <p className="text-xs sm:text-sm text-foreground/70 mt-1">
          Track your office performance, view recently signed documents, and manage rejected or delayed files.
        </p>
      </div>

      {/* Top Number Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Files Signed" value={performanceStats.signed} icon={FileCheck} colorClass="text-india-blue" />
        <StatCard title="Files Rejected" value={performanceStats.rejected} icon={XCircle} colorClass="text-india-orange" />
        <StatCard title="Inspections Set" value={performanceStats.inspection} icon={Calendar} colorClass="text-foreground" />
        <StatCard title="Delayed Files" value={performanceStats.delayed} icon={Clock} colorClass="text-india-orange" />
      </div>

      {/* Graph / Analytics Section */}
      <AnalyticsPanel stats={performanceStats} />

      {/* History List Section */}
      <div className="border border-border rounded-xl p-4 sm:p-6 bg-background space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">Recent Documents</h2>
          
          {/* Tabs */}
          <div className="flex bg-border/20 p-1 rounded-lg">
            {['ALL', 'SIGNED', 'REJECTED', 'INSPECTION'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-background shadow-xs text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List of Records */}
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <HistoryRecordCard 
              key={record.id} 
              record={record} 
              onClick={() => setSelectedRecord(record)} 
            />
          ))}
        </div>
      </div>

      {/* Pop-up for Document Details */}
      <AnimatePresence>
        {selectedRecord && (
          <RecordDetailsModal 
            record={selectedRecord} 
            onClose={() => setSelectedRecord(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocalAuthHistoryPage;