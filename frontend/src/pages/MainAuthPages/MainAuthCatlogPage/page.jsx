import React, { useState } from 'react';
import { Search, PlusCircle, Filter } from 'lucide-react';
import { mainAuthDocsData } from './mockMainAuthDocs';
import { ManagedDocCard } from './ManagedDocCard';

export const MainAuthCatalogPage = () => {
  const [docs, setDocs] = useState(mainAuthDocsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'PAUSED', 'DRAFT'

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'ALL' ? true : doc.status === activeFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDocClick = (doc) => {
    // This will navigate to the individual document details page you requested next
    alert(`Navigating to detailed settings for: ${doc.name}`);
  };

  const handleAddNewDoc = () => {
    alert('Opening form to create a new Government Clearance or Scheme...');
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 sm:pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded border border-india-blue/20">
              Department: MPCB HQ
            </span>
            <span className="text-xs text-foreground/60 uppercase tracking-wider font-semibold">State Level Authority</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Managed Clearances & Schemes
          </h1>
          <p className="text-xs sm:text-sm text-foreground/70 mt-0.5">
            Add new document requirements, update fees, and manage the rules for all approvals issued by your department.
          </p>
        </div>

        <button
          onClick={handleAddNewDoc}
          className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 cursor-pointer shrink-0 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Document / Scheme</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search documents or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-india-blue transition-colors"
          />
          <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-2.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-foreground/40 hidden sm:block mr-1" />
          {['ALL', 'ACTIVE', 'PAUSED', 'DRAFT'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider transition-colors shrink-0 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-background border border-border text-foreground/60 hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <ManagedDocCard 
              key={doc.id} 
              doc={doc} 
              onClick={handleDocClick} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-xl bg-border/5">
          <FileText className="w-8 h-8 text-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground">No documents found</h3>
          <p className="text-xs text-foreground/60 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default MainAuthCatalogPage;