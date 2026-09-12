import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Shield, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown,
  TrendingUp, 
  Flame, 
  Check,
  X,
  Building2
} from 'lucide-react';
import { POPULAR_DISTRICTS, POPULAR_CLEARANCES, LIVE_DOSSIER_MOCK } from '../data/landingData';
import borderImg from '../../../assets/border.png';

export const HeroSection = ({ onSelectClearanceSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [districtFilterSearch, setDistrictFilterSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All');
  const dropdownRef = useRef(null);
  const filterInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDistrictDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDistrictDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isDistrictDropdownOpen && filterInputRef.current) {
      setTimeout(() => filterInputRef.current?.focus(), 80);
    } else {
      setDistrictFilterSearch('');
    }
  }, [isDistrictDropdownOpen]);

  const selectedDistrictObj = POPULAR_DISTRICTS.find((d) => d.id === selectedDistrict);

  const REGION_TABS = ['All', 'Western Maharashtra', 'Konkan', 'Vidarbha', 'Marathwada', 'North Maharashtra'];

  const filteredDistricts = POPULAR_DISTRICTS.filter((d) => {
    const matchesRegion = selectedRegionFilter === 'All' || d.region === selectedRegionFilter;
    const query = districtFilterSearch.toLowerCase().trim();
    if (!query) return matchesRegion;
    const matchesName = d.name.toLowerCase().includes(query);
    const matchesCity = d.city ? d.city.toLowerCase().includes(query) : false;
    const matchesClusters = d.clusters ? d.clusters.some((c) => c.toLowerCase().includes(query)) : false;
    return matchesRegion && (matchesName || matchesCity || matchesClusters);
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedDistrict) {
      navigate('/user/approvals/list', { state: { searchQuery, selectedDistrict } });
    } else {
      navigate('/user/approvals');
    }
  };

  const handleTagClick = (tagQuery) => {
    setSearchQuery(tagQuery);
    if (onSelectClearanceSearch) {
      onSelectClearanceSearch(tagQuery);
    }
  };

  return (
    <section className="relative z-20 bg-gradient-to-b from-white via-slate-50 to-slate-100/50 dark:from-[#1c1c1c] dark:via-[#181818] dark:to-[#141414] pt-8 pb-16 border-b border-slate-200 dark:border-[#3a445a] transition-colors duration-300">
      {/* Background Decorative Layer (Clipped to Hero Boundary) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#ff7700]/5 rounded-full blur-3xl" />

        {/* Top-Left Indian Tricolor Corner Ribbon Accent */}
        <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 md:-top-8 md:-left-8 select-none">
          <img
            src={borderImg}
            alt=""
            aria-hidden="true"
            className="w-40 sm:w-56 md:w-72 lg:w-88 h-auto object-contain transform -scale-x-100 rotate-12 opacity-35 dark:opacity-20 filter drop-shadow-xs"
          />
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Live Policy Pill */}
        <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#3a445a] shadow-xs rounded-full px-3 sm:px-3.5 py-1 text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 mb-6 transition-all hover:border-[#1E3A6E]/30">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          <span className="font-semibold text-[#1E3A6E] dark:text-emerald-400">Maharashtra Industrial Policy 2024–2029</span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-600 dark:text-slate-300 hidden sm:flex items-center gap-1">
            Section 19 Deemed SLA Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-5 relative z-30">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Every Industrial Clearance, Subsidy & Permit —{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A6E] via-emerald-700 to-[#ff7700] dark:from-emerald-400 dark:via-blue-400 dark:to-[#ff7700]">
                Under One Intelligent Window
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              Empowering manufacturing plants, MSMEs, and heavy engineering facilities across Maharashtra with AI-powered approvals, real-time tracking, and direct access to state industrial incentive packages.
            </p>

            {/* Two Strong Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => navigate('/user/approvals')}
                className="px-6 py-3.5 bg-[#ff7700] hover:bg-[#e06600] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95 shadow-orange-500/20 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Ask for Approvals – AI Wizard</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('subsidies');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/user/gov-benefits');
                }}
                className="px-6 py-3.5 bg-white dark:bg-[#252525] hover:bg-slate-50 dark:hover:bg-[#303030] text-[#1E3A6E] dark:text-white border-2 border-[#1E3A6E] dark:border-[#3a445a] font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Industrial Subsidies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* District & Clearance Instant Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-3 bg-white dark:bg-[#252525] p-2 rounded-2xl border border-slate-200 dark:border-[#3a445a] shadow-lg flex flex-col sm:flex-row items-stretch gap-2 relative z-30">
              <div className="flex items-center gap-2 flex-grow px-3 py-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 80+ clearances (e.g., MPCB CTE, Fire NOC, Factory Building Plan)..."
                  className="w-full bg-transparent border-0 focus:outline-none p-0 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Custom Modern District Dropdown */}
              <div className="relative border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 px-3 py-1.5 sm:w-80" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                  className="w-full h-full flex items-center justify-between gap-2 text-left focus:outline-none cursor-pointer group py-1"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      selectedDistrictObj 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60 shadow-xs' 
                        : 'bg-blue-50 text-[#1E3A6E] border-blue-100 dark:bg-[#202836] dark:text-blue-300 dark:border-slate-700'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider leading-none mb-0.5 flex items-center gap-1">
                        <span>District Hub</span>
                        {selectedDistrictObj && (
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold">• ACTIVE</span>
                        )}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {selectedDistrictObj ? (selectedDistrictObj.city || selectedDistrictObj.name.split('(')[0].trim()) : 'Select District Hub'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {selectedDistrict && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDistrict('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            setSelectedDistrict('');
                          }
                        }}
                        title="Clear district selection"
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDistrictDropdownOpen ? 'rotate-180 text-[#1E3A6E] dark:text-emerald-400' : 'group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                  </div>
                </button>

                {/* Dropdown Floating Menu */}
                {isDistrictDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2.5 w-84 sm:w-[420px] max-w-[92vw] bg-white dark:bg-[#1e232d] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/30 dark:shadow-black/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-900/5 dark:ring-white/10">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#1E3A6E] dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Maharashtra Industrial Hubs
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded-full">
                          {filteredDistricts.length}
                        </span>
                      </div>
                      {selectedDistrict && (
                        <button
                          type="button"
                          onClick={() => setSelectedDistrict('')}
                          className="text-[11px] text-[#ff7700] hover:text-[#d45d00] hover:underline font-semibold cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    {/* Instant Search Filter Input */}
                    <div className="relative flex items-center bg-slate-50 dark:bg-[#151921] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 mb-2 focus-within:ring-2 focus-within:ring-[#1E3A6E]/20 dark:focus-within:ring-emerald-500/20 focus-within:border-[#1E3A6E] dark:focus-within:border-emerald-500 transition-all">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                      <input
                        ref={filterInputRef}
                        type="text"
                        value={districtFilterSearch}
                        onChange={(e) => setDistrictFilterSearch(e.target.value)}
                        placeholder="Search city or MIDC zone (e.g., Chakan, Taloja)..."
                        className="w-full bg-transparent border-0 focus:outline-none p-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                      />
                      {districtFilterSearch && (
                        <button
                          type="button"
                          onClick={() => setDistrictFilterSearch('')}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Region Filter Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
                      {REGION_TABS.map((tab) => {
                        const isActive = selectedRegionFilter === tab;
                        const shortLabel = 
                          tab === 'Western Maharashtra' ? 'Western MH' :
                          tab === 'North Maharashtra' ? 'North MH' : tab;
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setSelectedRegionFilter(tab)}
                            className={`text-[10px] font-semibold px-2 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#1E3A6E] dark:bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {shortLabel}
                          </button>
                        );
                      })}
                    </div>

                    {/* Districts List */}
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {filteredDistricts.length === 0 ? (
                        <div className="py-6 text-center text-slate-400 dark:text-slate-500">
                          <Building2 className="w-7 h-7 mx-auto mb-1.5 opacity-40" />
                          <p className="text-xs font-semibold">No industrial hubs found</p>
                          <p className="text-[10px] mt-0.5">Try searching another MIDC zone or select "All"</p>
                        </div>
                      ) : (
                        filteredDistricts.map((district) => {
                          const isSelected = selectedDistrict === district.id;
                          const [cityName, subAreas] = district.name.split('(');
                          const subAreaClean = subAreas ? subAreas.replace(')', '') : '';
                          const clusters = district.clusters || (subAreaClean ? subAreaClean.split('/').map(s => s.trim()) : []);

                          return (
                            <button
                              key={district.id}
                              type="button"
                              onClick={() => {
                                setSelectedDistrict(district.id);
                                setIsDistrictDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-1.5 cursor-pointer border ${
                                isSelected 
                                  ? 'bg-blue-50/90 dark:bg-emerald-950/50 border-[#1E3A6E]/30 dark:border-emerald-600/50 shadow-xs' 
                                  : 'hover:bg-slate-50 dark:hover:bg-[#262c38] border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-[#1a1f28]/40'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`text-xs font-bold ${
                                    isSelected 
                                      ? 'text-[#1E3A6E] dark:text-emerald-300' 
                                      : 'text-slate-900 dark:text-white'
                                  }`}>
                                    {district.city || cityName.trim()}
                                  </span>
                                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    {district.region}
                                  </span>
                                </div>

                                {isSelected && (
                                  <div className="w-4 h-4 rounded-full bg-[#1E3A6E] dark:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </div>

                              {/* Cluster tags */}
                              {clusters.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1">
                                  {clusters.map((c, idx) => (
                                    <span 
                                      key={idx}
                                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                        isSelected 
                                          ? 'bg-blue-100/70 dark:bg-emerald-900/60 text-[#1E3A6E] dark:text-emerald-300' 
                                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400'
                                      }`}
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>

                    {/* Bottom hint */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-400 flex items-center justify-between">
                      <span>💡 Prioritizes MIDC NOCs & Regional SLAs</span>
                      <span className="font-mono text-[9px] text-slate-400">ESC to close</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-[#1E3A6E] dark:bg-emerald-700 hover:bg-[#14284d] dark:hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Find Approvals</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular Clearance Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Popular Clearances:</span>
              {POPULAR_CLEARANCES.slice(0, 4).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(item.query)}
                  className="bg-white dark:bg-[#252525] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#3a445a] hover:border-[#1E3A6E] dark:hover:border-emerald-400 text-slate-700 dark:text-slate-300 hover:text-[#1E3A6E] transition-colors cursor-pointer text-[11px]"
                >
                  {item.label.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Right Mockup Card: High-Fidelity Active Application Dossier */}
          <div className="lg:col-span-5 relative z-10">
            <div className="bg-white dark:bg-[#222222] rounded-2xl border border-slate-200 dark:border-[#3a445a] shadow-xl p-6 relative overflow-hidden transition-all duration-300">
              {/* Header Details */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Live Statutory Dossier
                  </span>
                </div>
                <button
                  onClick={() => navigate('/user/track/APP-MH-2026-89412')}
                  title="Click to track in detail"
                  className="text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-[#1E3A6E] dark:text-emerald-400 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Ref: {LIVE_DOSSIER_MOCK.ref}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Title & Facility */}
              <div className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {LIVE_DOSSIER_MOCK.company}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {LIVE_DOSSIER_MOCK.location}
                    </p>
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                    {LIVE_DOSSIER_MOCK.status}
                  </span>
                </div>
              </div>

              {/* Interactive Stepper */}
              <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3.5 rounded-xl border border-slate-200 dark:border-[#333333] my-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Clearance Pipeline</span>
                  <span className="text-[#1E3A6E] dark:text-emerald-400 font-extrabold">
                    {LIVE_DOSSIER_MOCK.completedSteps} of {LIVE_DOSSIER_MOCK.totalSteps} Completed
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-[#1E3A6E] dark:to-emerald-400 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${LIVE_DOSSIER_MOCK.progressPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-5 text-[9px] sm:text-[10px] text-center text-slate-500 dark:text-slate-400 mt-2.5 font-medium gap-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Filed ✓</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold"><span className="hidden sm:inline">Scrutiny</span><span className="sm:hidden">Scrut.</span> ✓</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold"><span className="hidden sm:inline">Inspect</span><span className="sm:hidden">Insp.</span> ✓</span>
                  <span className="text-[#1E3A6E] dark:text-amber-400 font-bold underline"><span className="hidden sm:inline">Legal (Active)</span><span className="sm:hidden">Legal</span></span>
                  <span className="text-slate-400"><span className="hidden sm:inline">Issuance</span><span className="sm:hidden">Issue</span></span>
                </div>
              </div>

              {/* Real-time Clearances List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs my-3">
                {LIVE_DOSSIER_MOCK.clearances.map((c, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 truncate">
                      {c.isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#ff7700] shrink-0 animate-pulse" />
                      )}
                      <span className="truncate">{c.name}</span>
                    </div>

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      c.isDone 
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60' 
                        : 'text-[#ff7700] bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 font-bold'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cryptographic Badge */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  SHA-256 Token
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Apex RTS Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
