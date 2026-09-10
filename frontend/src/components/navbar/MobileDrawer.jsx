import { motion, AnimatePresence } from 'framer-motion';

/**
 * MobileDrawer — Animated accordion mobile menu that slides open below the navbar.
 *
 * Props:
 *  - isOpen      {boolean}
 *  - links       {Array<{ id, label, path }>}
 *  - currentPath {string}
 *  - onNavClick  {fn}
 *  - children               — Optional extra content (e.g. "More" accordion)
 */
const MobileDrawer = ({ isOpen, links, currentPath, onNavClick, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="md:hidden border-t border-border bg-background px-4 pt-2 pb-4 space-y-1 overflow-hidden"
      >
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavClick(link.path)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
              currentPath === link.path
                ? 'bg-border text-india-blue font-semibold'
                : 'text-foreground hover:bg-border hover:text-india-blue'
            }`}
          >
            <span>{link.label}</span>
            {currentPath === link.path && (
              <span className="w-2 h-2 rounded-full bg-india-blue" />
            )}
          </button>
        ))}
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default MobileDrawer;
