import { useState } from 'react';
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
  const [currentPath, setCurrentPath] = useState('/local-auth/requests');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar
        badge="Local Authority"
        currentPath={currentPath}
        onNavClick={setCurrentPath}
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
            onNavClick={onNavClick}
          />
        )}
      >
        <NavLinks
          links={localAuthNavLinks}
          currentPath={currentPath}
          onNavClick={setCurrentPath}
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
          {children || (
            <div className="p-4 sm:p-6 border border-border rounded-lg bg-background">
              Active Authority View: <span className="font-bold text-india-blue">{currentPath}</span>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LocalAuthLayout;