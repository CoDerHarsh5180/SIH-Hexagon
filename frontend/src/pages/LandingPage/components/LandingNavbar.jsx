import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  ChevronDown, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docflow_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('docflow_theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('docflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('docflow_theme', 'light');
    }
  };

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/95 dark:bg-[#1c1c1c]/95 border-b border-slate-200 dark:border-[#3a445a] sticky top-0 z-50 shadow-xs backdrop-blur-md transition-colors duration-300">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Pill Badge */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1E3A6E] dark:bg-emerald-700 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#1E3A6E] dark:text-white">
              Doc<span className="text-[#ff7700]">Flow</span>
            </span>
          </a>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-pulse"></span>
            Gov Clearance Portal
          </span>
        </div>

        {/* Center: Main Menu Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => navigate('/user/dashboard')}
            className="hover:text-[#1E3A6E] dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Dashboard</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">Live</span>
          </button>
          <button 
            onClick={() => scrollToSection('wizard')}
            className="hover:text-[#1E3A6E] dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Know Your Approval
          </button>
          <button 
            onClick={() => scrollToSection('pipeline')}
            className="hover:text-[#1E3A6E] dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Track Documents
          </button>

          {/* More Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              onMouseEnter={() => setIsMoreOpen(true)}
              className="flex items-center gap-1 hover:text-[#1E3A6E] dark:hover:text-emerald-400 transition-colors py-2 cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div 
                onMouseLeave={() => setIsMoreOpen(false)}
                className="absolute top-full left-0 w-52 bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#3a445a] rounded-xl shadow-lg py-2 text-xs text-slate-700 dark:text-slate-200 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <button 
                  onClick={() => scrollToSection('subsidies')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#303030] font-medium flex items-center justify-between"
                >
                  <span>Incentives & Schemes</span>
                  <span className="text-[10px] text-[#ff7700] font-bold">2024–29</span>
                </button>
                <button 
                  onClick={() => scrollToSection('departments')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#303030] font-medium"
                >
                  Departmental Directory
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#303030] font-medium"
                >
                  Platform Capabilities
                </button>
                <button 
                  onClick={() => scrollToSection('security')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#303030] font-medium border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5 text-emerald-700 dark:text-emerald-400 font-semibold"
                >
                  Statutory SLA Charter
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Action Icons & Official Seal Badge */}
        <div className="flex items-center gap-3">
          {/* Official Seal Badge */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-[#3a445a] px-3 py-1 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium">
            <span className="text-sm">🏛️</span>
            <span>Government of Maharashtra <span className="text-slate-300 dark:text-slate-600">|</span> Single Window Portal</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-[#3a445a] pl-2 sm:pl-3">
            {/* Notification Bell */}
            <button 
              onClick={() => navigate('/user/notifications')}
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-[#1E3A6E] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff7700] ring-2 ring-white dark:ring-[#1c1c1c]"></span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#1E3A6E] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Officer Desk / Login Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-[#3a445a] hover:border-[#1E3A6E]/40 bg-slate-50 dark:bg-[#252525] hover:bg-white dark:hover:bg-[#303030] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#1E3A6E] dark:bg-emerald-700 text-white flex items-center justify-center text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline">Officer Desk</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLoginDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsLoginDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#3a445a] rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="font-bold text-slate-900 dark:text-white">Select Portal Access</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct role-based authentication</p>
                  </div>
                  
                  <button
                    onClick={() => { navigate('/user/dashboard'); setIsLoginDropdownOpen(false); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#303030] transition-colors flex items-start gap-2.5 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">Enterprise Applicant Portal</p>
                      <p className="text-[10px] text-slate-500">MSME, Factory & Plant compliance</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/local-auth/requests'); setIsLoginDropdownOpen(false); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#303030] transition-colors flex items-start gap-2.5 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">Local Authority Desk</p>
                      <p className="text-[10px] text-slate-500">Scrutiny officers & field inspectors</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/main-auth/dashboard'); setIsLoginDropdownOpen(false); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#303030] transition-colors flex items-start gap-2.5 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#ff7700] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">Main Authority Governance</p>
                      <p className="text-[10px] text-slate-500">Directorate & Apex Secretaries</p>
                    </div>
                  </button>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1 flex justify-between px-2">
                    <button
                      onClick={() => { navigate('/register'); setIsLoginDropdownOpen(false); }}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      New Registration →
                    </button>
                    <button
                      onClick={() => { navigate('/login'); setIsLoginDropdownOpen(false); }}
                      className="text-[#1E3A6E] dark:text-slate-300 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white lg:hidden rounded-lg"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-[#3a445a] bg-white dark:bg-[#1c1c1c] px-4 py-4 space-y-3">
          <button 
            onClick={() => { navigate('/user/dashboard'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            Dashboard
          </button>
          <button 
            onClick={() => scrollToSection('wizard')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            Know Your Approval
          </button>
          <button 
            onClick={() => scrollToSection('pipeline')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            Track Documents
          </button>
          <button 
            onClick={() => scrollToSection('subsidies')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            Incentives & Schemes
          </button>
          <button 
            onClick={() => scrollToSection('departments')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            Departmental Directory
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400">Direct Authority Portals</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { navigate('/local-auth/requests'); setIsMobileMenuOpen(false); }}
                className="py-1.5 px-2 text-left text-xs rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
              >
                Local Authority
              </button>
              <button
                onClick={() => { navigate('/main-auth/dashboard'); setIsMobileMenuOpen(false); }}
                className="py-1.5 px-2 text-left text-xs rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
              >
                Main Authority
              </button>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-[#ff7700] text-white"
            >
              Register Enterprise
            </button>
            <button
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
