import React from 'react';
import borderImg from '../../assets/border.png';

/**
 * BackgroundFlagDecor — Elegant Indian Tricolor wave ribbon accent in corners.
 * Uses pointer-events-none so it never intercepts clicks or touch events.
 */
export const BackgroundFlagDecor = ({ 
  opacityClass = 'opacity-30 dark:opacity-20',
  showTopLeft = true,
  showBottomRight = true 
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* Top-Left Corner Ribbon */}
      {showTopLeft && (
        <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 md:-top-8 md:-left-8 transition-transform duration-500">
          <img
            src={borderImg}
            alt=""
            aria-hidden="true"
            className={`w-36 sm:w-56 md:w-72 lg:w-88 h-auto object-contain transform -scale-x-100 rotate-12 filter drop-shadow-sm ${opacityClass}`}
          />
        </div>
      )}

      {/* Bottom-Right Corner Ribbon */}
      {showBottomRight && (
        <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 md:-bottom-10 md:-right-10 transition-transform duration-500">
          <img
            src={borderImg}
            alt=""
            aria-hidden="true"
            className={`w-36 sm:w-56 md:w-72 lg:w-88 h-auto object-contain transform scale-x-100 -rotate-6 filter drop-shadow-sm ${opacityClass}`}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundFlagDecor;
