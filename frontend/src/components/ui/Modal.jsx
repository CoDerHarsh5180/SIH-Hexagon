import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal — Animated bottom-sheet on mobile / centered card on desktop.
 *
 * Props:
 *  - isOpen    {boolean}
 *  - onClose   {fn}
 *  - maxWidth  {string}  — Tailwind max-w class, e.g. 'sm:max-w-md' (default: 'sm:max-w-lg')
 *  - title     {string}
 *  - badge     {string}
 *  - children
 *  - footer
 */
const Modal = ({
  isOpen,
  onClose,
  maxWidth = 'sm:max-w-lg',
  title,
  badge,
  children,
  footer,
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`bg-background border-t sm:border border-border w-full ${maxWidth} rounded-t-2xl sm:rounded-xl shadow-2xl relative max-h-[85vh] overflow-y-auto`}
        >
          {/* Header */}
          {(title || badge) && (
            <div className="flex items-start justify-between p-4 sm:p-6 pb-3 border-b border-border gap-2">
              <div className="min-w-0">
                {badge && (
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-india-blue tracking-wider block">
                    {badge}
                  </span>
                )}
                {title && (
                  <h2 className="text-base sm:text-lg font-bold text-foreground mt-0.5 break-words">
                    {title}
                  </h2>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-border transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-4 sm:p-6 pt-3">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t border-border">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default Modal;
