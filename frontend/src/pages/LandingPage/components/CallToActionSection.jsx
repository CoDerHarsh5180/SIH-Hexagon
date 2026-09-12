import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#1E3A6E] dark:bg-[#122342] text-white relative overflow-hidden transition-colors duration-300" id="register">
      {/* Saffron Gradient Accent Backlight */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff7700]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ff7700]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/15 backdrop-blur-xs">
          Instant Digital Enterprise Registration
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto tracking-tight leading-tight">
          Launch Your Enterprise in Maharashtra in Under 7 Days
        </h2>

        <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mt-3 mb-8 leading-relaxed">
          Join over 16,000 industrial establishments accelerating manufacturing setup with single-window statutory convenience.
        </p>

        {/* Two CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-7 py-3.5 bg-[#ff7700] hover:bg-[#e06600] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <BadgeCheck className="w-5 h-5" />
            <span>Register Enterprise (Instant OTP)</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-7 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/40 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Officer / Inspector Portal Login</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
