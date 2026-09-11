import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar, NavLinks, MobileDrawer } from '../../components/navbar';

// Navigation routes for Local Authority portal
const localAuthNavLinks = [
  { id: 'requests', label: 'Requests', path: '/local-auth/requests' },
  { id: 'history', label: 'History', path: '/local-auth/history' },
  { id: 'complaints', label: 'Complaints', path: '/local-auth/complaints' },
];

// Local Authority officer metadata
const mockLocalAuthData = {
  officerDesignation: 'Verification Officer',
  avatarUrl: '',
  unreadNotifications: 5,
};

export const LocalAuthLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar
        badge="Local Authority"
        currentPath={currentPath}
        onNavClick={handleNavClick}
        notificationPath="/local-auth/notifications"
        profilePath="/local-auth/profile"
        unreadCount={mockLocalAuthData.unreadNotifications}
        avatarUrl={mockLocalAuthData.avatarUrl}
        avatarAlt={mockLocalAuthData.officerDesignation}
        notificationLabel="View Authority Notifications"
        mobileMenu={(isOpen, onNavClick) => (
          <MobileDrawer
            isOpen={isOpen}
            links={localAuthNavLinks}
            currentPath={currentPath}
            onNavClick={handleNavClick}
          />
        )}
      >
        <NavLinks
          links={localAuthNavLinks}
          currentPath={currentPath}
          onNavClick={handleNavClick}
          layoutId="activeLocalAuthNav"
        />
      </Navbar>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children || <Outlet />}
        </motion.div>
      </main>
    </div>
  );
};

export default LocalAuthLayout;