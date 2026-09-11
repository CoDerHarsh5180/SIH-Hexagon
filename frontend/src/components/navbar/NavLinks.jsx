import { motion } from 'framer-motion';

/**
 * NavLinks — Desktop horizontal nav link row with animated underline indicator.
 *
 * Props:
 *  - links        {Array<{ id, label, path }>}
 *  - currentPath  {string}
 *  - onNavClick   {fn}
 *  - layoutId     {string}
 */
const NavLinks = ({ links, currentPath, onNavClick, layoutId = 'activeNav' }) => (
  <div className="hidden md:flex md:space-x-8 items-center">
    {links.map((link) => (
      <button
        key={link.id}
        onClick={() => onNavClick(link.path)}
        className={`relative px-3 py-2 text-sm font-medium transition-colors ${
          currentPath === link.path ? 'text-india-orange' : 'text-foreground hover:text-india-orange'
        }`}
      >
        {link.label}
        {currentPath === link.path && (
          <motion.div
            layoutId={layoutId}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-india-orange"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    ))}
  </div>
);

export default NavLinks;
