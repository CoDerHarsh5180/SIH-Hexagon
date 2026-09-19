import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Sun, Moon } from 'lucide-react';
import SaralLogo from '../../components/common/SaralLogo';
import image from './image.png';
import imageDark from './image-dark.png';

export const AuthLayout = ({ title, subtitle, children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex relative">
      {/* Left Column: Image & Brand Narrative (Visible on lg screens and up) */}
      <div className="hidden lg:flex lg:w-5/12 border-r border-border bg-border/5 flex-col justify-between p-12 relative overflow-hidden">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity" title="Streamlined Applications, Record and Approvals Link">
            <SaralLogo />
          </Link>
        </div>

        {/* ILLUSTRATION AREA (Optimized for Light and Dark mode) */}
        <div className="my-8 rounded-2xl border border-border bg-card h-72 flex items-center justify-center p-4 text-center relative overflow-hidden shadow-xs transition-colors">
          <img 
            src={image} 
            alt="SARAL Maharashtra Industrial Clearance" 
            className="max-h-full max-w-full object-contain block dark:hidden" 
          />
          <img 
            src={imageDark} 
            alt="SARAL Maharashtra Industrial Clearance (Dark)" 
            className="max-h-full max-w-full object-contain hidden dark:block" 
          />
        </div>

        {/* Trust Footnote */}
        <div className="border-t border-border pt-6 flex items-start space-x-3 text-xs text-foreground/70">
          <ShieldCheck className="w-5 h-5 text-india-blue shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Direct integration with Single-Window Clearances, Treasury GRAS payment receipts, and automated authority escalation.
          </p>
        </div>
      </div>

      {/* Right Column: Interactive Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-12 relative">
        {/* Top Header Actions: Theme Switcher & Home Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs focus:outline-none"
            aria-label="Toggle Dark Mode"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-india-orange" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link 
            to="/" 
            className="text-xs font-semibold text-foreground/80 hover:text-india-orange flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors shadow-xs"
            title="Return to Public Home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo Branding */}
          <div className="lg:hidden flex items-center justify-between pt-6">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <SaralLogo size="sm" />
            </Link>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70 mt-1">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};