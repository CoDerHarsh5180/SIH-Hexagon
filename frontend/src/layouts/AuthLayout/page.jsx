import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import image from './image.png'


export const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      {/* Left Column: Image & Brand Narrative (Visible on lg screens and up) */}
      <div className="hidden lg:flex lg:w-5/12 border-r border-border bg-border/5 flex-col justify-between p-12 relative overflow-hidden">
        {/* Brand Header */}
        <div className="flex items-center space-x-2">
          <span className="text-foreground font-bold text-2xl tracking-tight">
            Doc<span className="text-india-blue">Flow</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-india-blue/30 bg-india-blue/10 text-india-blue uppercase">
            Gov Approvals Portal
          </span>
        </div>

        {/* IMAGE PLACEHOLDER AREA */}
        <div className="my-8 rounded-2xl border border-dashed border-border bg-background/50 h-72 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
          {/* REPLACE THIS PLACEHOLDER WITH YOUR IMAGE */}
            <img src={image} alt="" />
          {/* Example replacement: 
            <img src="/path-to-your-image.jpg" alt="Industrial Portal" className="absolute inset-0 w-full h-full object-cover" /> 
          */}
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
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-10">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo Branding */}
          <div className="lg:hidden flex items-center space-x-2">
            <span className="text-foreground font-bold text-2xl tracking-tight">
              Doc<span className="text-india-blue">Flow</span>
            </span>
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