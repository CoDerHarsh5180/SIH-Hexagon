import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, NavLinks, MobileDrawer } from '../../components/navbar';
import { ChevronDown } from 'lucide-react';

// Primary navigation links
const primaryNavLinks = [
  { id: 'dashboard', label: 'Dashboard', path: '/user/dashboard' },
  { id: 'approvals', label: 'Know Your Approval', path: '/user/approvals' },
  { id: 'track', label: 'Track Documents', path: '/user/track' },
  { id: 'your-docs', label: 'Your Docs', path: '/user/your-docs' }
];

// Secondary links grouped under 'More' dropdown
const moreNavLinks = [
  { id: 'pending-docs', label: 'Pending Docs', path: '/user/pending-docs' },
  { id: 'custom-docs-apply', label: 'Custom Apply', path: '/user/custom-docs-apply' },
  { id: 'query', label: 'Query', path: '/user/query' },
  { id: 'complain', label: 'Complain', path: '/user/complain' },
  { id: 'feedback', label: 'Feedback', path: '/user/feedback' },
  { id: 'Government Benefits', label: 'Government Benefits', path: '/user/gov-benefits' },
];

const mockUserData = {
  name: 'User',
  avatarUrl: '',
  unreadNotifications: 3,
};

/** MoreDropdown — desktop secondary nav */
const MoreDropdown = ({ currentPath, onNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isMoreActive = moreNavLinks.some((link) => link.path === currentPath);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors ${
          isMoreActive || isOpen ? 'text-india-orange' : 'text-foreground hover:text-india-orange'
        }`}
      >
        <span>More</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        {isMoreActive && (
          <motion.div
            layoutId="activeUserNav"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-india-orange"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-1 w-48 rounded-lg bg-background border border-border py-1 shadow-lg z-50"
          >
            {moreNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavClick(item.path); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentPath === item.path
                    ? 'text-india-orange font-semibold bg-india-orange/5'
                    : 'text-foreground hover:bg-border hover:text-india-orange'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** MobileMoreAccordion — "More" inside the mobile drawer */
const MobileMoreAccordion = ({ currentPath, onNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMoreActive = moreNavLinks.some((link) => link.path === currentPath);

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
          isMoreActive
            ? 'bg-border text-india-orange font-semibold'
            : 'text-foreground hover:bg-border hover:text-india-orange'
        }`}
      >
        <span>More</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-4 space-y-1 pt-1 overflow-hidden"
          >
            {moreNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  currentPath === item.path
                    ? 'bg-border text-india-orange font-semibold'
                    : 'text-foreground hover:bg-border hover:text-india-orange'
                }`}
              >
                <span>{item.label}</span>
                {currentPath === item.path && (
                  <span className="w-2 h-2 rounded-full bg-india-orange" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar
        currentPath={currentPath}
        onNavClick={handleNavClick}
        notificationPath="/user/notifications"
        profilePath="/user/profile"
        unreadCount={mockUserData.unreadNotifications}
        avatarUrl={mockUserData.avatarUrl}
        avatarAlt={mockUserData.name}
        notificationLabel="View Notifications"
        mobileMenu={(isOpen, onNavClick) => (
          <MobileDrawer
            isOpen={isOpen}
            links={primaryNavLinks}
            currentPath={currentPath}
            onNavClick={handleNavClick}
          >
            <MobileMoreAccordion currentPath={currentPath} onNavClick={handleNavClick} />
          </MobileDrawer>
        )}
      >
        <NavLinks
          links={primaryNavLinks}
          currentPath={currentPath}
          onNavClick={handleNavClick}
          layoutId="activeUserNav"
        />
        <MoreDropdown currentPath={currentPath} onNavClick={handleNavClick} />
      </Navbar>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children || <Outlet />}
        </motion.div>
      </main>
    </div>
  );
};

export default UserLayout;