import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight, 
  ChevronDown,
  Check,
  X,
  Building2
} from 'lucide-react';
import { POPULAR_DISTRICTS, POPULAR_CLEARANCES } from '../data/landingData';
import heroLightWebp from '../../../assets/light.webp';
import heroDarkWebp from '../../../assets/dark.webp';

const ROTATING_TARGETS = [
  'New Factories',
  'MSME Units',
  'Plant Expansion',
  'Warehouses',
  'Industrial Units'
];

export const HeroSection = ({ onSelectClearanceSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [districtFilterSearch, setDistrictFilterSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All');
  const [wordIndex, setWordIndex] = useState(0);

  const dropdownRef = useRef(null);
  const filterInputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_TARGETS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

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
    navigate('/approvals', { state: { initialQuery: searchQuery, initialDistrict: selectedDistrict } });
  };

  const handleTagClick = (tagQuery) => {
    setSearchQuery(tagQuery);
    if (onSelectClearanceSearch) {
      onSelectClearanceSearch(tagQuery);
    }
  };

  return (
    <section className="relative z-20 bg-background text-foreground pt-8 pb-14 border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Government Official Badge (Clean, No Gradients, No SLA Claims) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex flex-wrap items-center gap-2 bg-background border border-border rounded-full px-3.5 py-1 text-xs font-medium text-foreground mb-6"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-india-orange animate-pulse"></span>
          <span className="font-semibold text-india-orange">Government of Maharashtra</span>
          <span className="text-foreground/40">•</span>
          <span className="text-foreground/80">
            SARAL — Streamlined Applications, Record and Approvals Link
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content with Cool Text Animation */}
          <div className="lg:col-span-7 flex flex-col gap-5 relative z-30">
            
            {/* Animated Headline with Dynamic Rotating Target Word (Locked Height & Stable Line Structure) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-[85px] sm:min-h-[105px] lg:min-h-[130px] flex flex-col justify-center"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                <span className="block">Apply for Approvals &amp; Clearances</span>
                <span className="block mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground/90">
                  Directly Online for{' '}
                  <span className="inline-block text-india-orange whitespace-nowrap">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={wordIndex}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="inline-block underline decoration-india-orange/30 decoration-wavy"
                      >
                        {ROTATING_TARGETS[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Simple, natural English subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-foreground/75 leading-relaxed max-w-2xl font-normal"
            >
              No more visiting multiple government offices. Check which approvals your business needs, calculate your state subsidies, and submit your applications from home or office.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <button
                onClick={() => navigate('/approvals')}
                className="px-6 py-3 bg-india-orange hover:opacity-90 text-white font-semibold text-sm rounded-lg shadow-xs transition-opacity flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Check Required Approvals</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('subsidies');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/gov-benefits');
                }}
                className="px-6 py-3 bg-background hover:bg-border text-foreground border border-border font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>View Government Benefits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* District & Clearance Instant Search Bar */}
            <motion.form 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearchSubmit} 
              className="mt-2 bg-background p-2 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-stretch gap-2 relative z-30"
            >
              <div className="flex items-center gap-2 flex-grow px-3 py-2">
                <Search className="w-4 h-4 text-foreground/50 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any approval (e.g. Factory License, Fire NOC, Pollution CTE)..."
                  className="w-full bg-transparent border-0 focus:outline-none p-0 text-sm text-foreground placeholder:text-foreground/40"
                />
              </div>

              {/* District Dropdown */}
              <div className="relative border-t sm:border-t-0 sm:border-l border-border px-3 py-1.5 sm:w-72" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                  className="w-full h-full flex items-center justify-between gap-2 text-left focus:outline-none cursor-pointer py-1"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-india-orange shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-foreground/50 leading-none mb-0.5">
                        District
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {selectedDistrictObj ? (selectedDistrictObj.city || selectedDistrictObj.name.split('(')[0].trim()) : 'Select Your District'}
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
                        title="Clear district"
                        className="p-1 hover:bg-border rounded-full text-foreground/50 hover:text-foreground cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-foreground/50 transition-transform duration-200 ${isDistrictDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Floating Menu */}
                {isDistrictDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2.5 w-80 sm:w-[380px] max-w-[92vw] bg-background border border-border rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-india-orange" />
                        <span className="text-xs font-bold text-foreground">
                          Maharashtra Districts
                        </span>
                      </div>
                      {selectedDistrict && (
                        <button
                          type="button"
                          onClick={() => setSelectedDistrict('')}
                          className="text-[11px] text-india-orange hover:underline font-semibold cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    {/* Search inside district dropdown */}
                    <div className="relative flex items-center bg-border/40 border border-border rounded-lg px-2.5 py-1.5 mb-2">
                      <Search className="w-3.5 h-3.5 text-foreground/50 shrink-0 mr-2" />
                      <input
                        ref={filterInputRef}
                        type="text"
                        value={districtFilterSearch}
                        onChange={(e) => setDistrictFilterSearch(e.target.value)}
                        placeholder="Search district or industrial area..."
                        className="w-full bg-transparent border-0 focus:outline-none p-0 text-xs text-foreground placeholder:text-foreground/40"
                      />
                    </div>

                    {/* Region Filter Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
                      {REGION_TABS.map((tab) => {
                        const isActive = selectedRegionFilter === tab;
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setSelectedRegionFilter(tab)}
                            className={`text-[10px] font-semibold px-2 py-1 rounded-md shrink-0 transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-india-orange text-white'
                                : 'bg-border text-foreground hover:bg-border/80'
                            }`}
                          >
                            {tab}
                          </button>
                        );
                      })}
                    </div>

                    {/* Districts List */}
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {filteredDistricts.length === 0 ? (
                        <div className="py-4 text-center text-foreground/50 text-xs">
                          No districts found
                        </div>
                      ) : (
                        filteredDistricts.map((district) => {
                          const isSelected = selectedDistrict === district.id;
                          return (
                            <button
                              key={district.id}
                              type="button"
                              onClick={() => {
                                setSelectedDistrict(district.id);
                                setIsDistrictDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between text-xs cursor-pointer ${
                                isSelected 
                                  ? 'bg-india-orange/10 text-india-orange font-bold' 
                                  : 'hover:bg-border text-foreground'
                              }`}
                            >
                              <span>{district.city || district.name.split('(')[0].trim()}</span>
                              <span className="text-[10px] text-foreground/50 font-normal">
                                {district.region}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-india-blue hover:opacity-90 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-opacity shrink-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Find Approvals</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.form>

            {/* Popular Clearance Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60 pt-1">
              <span className="font-semibold text-foreground">Common Clearances:</span>
              {POPULAR_CLEARANCES.slice(0, 4).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(item.query)}
                  className="bg-background px-2.5 py-1 rounded-md border border-border hover:border-india-orange hover:text-india-orange text-foreground/80 transition-colors cursor-pointer text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Right: Clean Visual Frame with Light/Dark Mode Switching */}
          <div className="lg:col-span-5 relative z-10 flex items-center justify-center">
            <div className="relative w-full max-w-[460px]">
              
              {/* Ambient Glow Aura */}
              <div 
                className="absolute -inset-2 rounded-3xl opacity-30 dark:opacity-45 blur-2xl transition-all duration-500 pointer-events-none bg-gradient-to-tr from-india-orange/20 via-india-blue/15 to-india-orange/20" 
                aria-hidden="true" 
              />

              {/* Main Card Container with subtle float */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-2xl border border-border bg-background shadow-md p-3 sm:p-4 overflow-visible"
              >
                
                {/* Visual Frame */}
                <div className="relative rounded-xl overflow-hidden border border-border aspect-square flex items-center justify-center bg-background dark:bg-[#070d18]">
                  {/* Light Mode Animation */}
                  <img 
                    src={heroLightWebp} 
                    alt="SARAL Maharashtra Digital Industrial Clearance Portal (Light)" 
                    className="w-full h-full object-cover object-center dark:hidden block"
                    loading="eager"
                    decoding="async"
                  />
                  {/* Dark Mode Animation (scaled to remove letterbox bars and fill 1:1 frame smoothly) */}
                  <img 
                    src={heroDarkWebp} 
                    alt="SARAL Maharashtra Digital Industrial Clearance Portal (Dark)" 
                    className="w-full h-full object-cover object-center hidden dark:block scale-[1.15] -translate-y-1 transform"
                    loading="eager"
                    decoding="async"
                  />
                  
                  {/* System Status HUD Pill at Bottom of Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-lg bg-background/90 dark:bg-background/85 backdrop-blur-md border border-border text-foreground text-[11px] shadow-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-india-orange animate-pulse"></span>
                      <span className="font-semibold">Maharashtra Single Window</span>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-india-blue/10 text-india-blue font-bold border border-india-blue/30">
                      100% Online
                    </span>
                  </div>
                </div>

                {/* Floating Badge 1: Top-Right */}
                <motion.div 
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="absolute -top-3 -right-2 sm:-top-3 sm:-right-3 bg-background border border-border shadow-md rounded-xl p-2.5 flex items-center gap-2.5 z-20"
                >
                  <div className="w-7 h-7 rounded-lg bg-india-blue/10 text-india-blue flex items-center justify-center font-bold shrink-0 border border-india-blue/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="pr-1">
                    <p className="text-[10px] uppercase font-bold text-foreground/50 leading-tight">Direct Approvals</p>
                    <p className="text-xs font-bold text-foreground leading-tight">No Office Visits</p>
                  </div>
                </motion.div>

                {/* Floating Badge 2: Bottom-Left */}
                <motion.div 
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute -bottom-3 -left-2 sm:-bottom-3 sm:-left-3 bg-background border border-border shadow-md rounded-xl p-2.5 flex items-center gap-2.5 z-20"
                >
                  <div className="w-7 h-7 rounded-lg bg-india-orange/10 text-india-orange flex items-center justify-center font-bold shrink-0 border border-india-orange/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="pr-1">
                    <p className="text-[10px] uppercase font-bold text-foreground/50 leading-tight">Verified Documents</p>
                    <p className="text-xs font-bold text-foreground leading-tight">QR Code Protected</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
