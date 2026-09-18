import React from 'react';
import emblemImg from '../../assets/logo-emblem.png';

/**
 * SaralLogo — Crisp, vector-sharp brand logo component.
 * Uses the official emblem mark and renders typography in pure HTML/CSS
 * so text remains 100% sharp and readable in both Light and Dark modes.
 */
export const SaralLogo = ({ 
  size = 'default', 
  showSubtext = true, 
  className = '' 
}) => {
  const iconSizeClass = {
    sm: 'h-8 w-8',
    default: 'h-9 sm:h-10 w-9 sm:w-10',
    lg: 'h-12 w-12',
  }[size] || 'h-9 sm:h-10 w-9 sm:w-10';

  const titleSizeClass = {
    sm: 'text-lg',
    default: 'text-xl sm:text-2xl',
    lg: 'text-3xl',
  }[size] || 'text-xl sm:text-2xl';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* High-Resolution Emblem */}
      <img
        src={emblemImg}
        alt="SARAL"
        className={`${iconSizeClass} object-contain shrink-0`}
      />

      {/* Brand Typography (Razor-Sharp in Light and Dark Mode) */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`font-extrabold ${titleSizeClass} tracking-tight text-foreground`}>
            SAR<span className="text-india-orange">AL</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-india-orange text-white text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-wider shadow-xs leading-normal">
            Single Window
          </span>
        </div>

        {showSubtext && (
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] uppercase text-foreground/75 dark:text-foreground/70 mt-1 whitespace-nowrap">
            Government of Maharashtra
          </span>
        )}
      </div>
    </div>
  );
};

export default SaralLogo;
