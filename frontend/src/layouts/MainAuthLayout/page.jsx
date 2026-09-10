import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar, NavLinks, MobileDrawer } from '../../components/navbar';

// Navigation routes for Main Authority portal
const mainAuthNavLinks = [
  { id: 'dashboard', label: 'Dashboard', path: '/main-auth/dashboard' },
  { id: 'our-docs', label: 'Our Docs', path: '/main-auth/our-docs' },
  { id: 'complaints', label: 'Complaints', path: '/main-auth/complaints' },
  { id: 'local-auths', label: 'Local Auths', path: '/main-auth/local-auths' },
];

// Main Authority admin metadata
const mockMainAuthData = {
  adminName: 'Principal Secretary',
  avatarUrl: '',
  unreadNotifications: 7,
};

export const MainAuthLayout = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/main-auth/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar
        badge="Main Authority"
        currentPath={currentPath}
        onNavClick={setCurrentPath}
        notificationPath="/main-auth/notifications"
        profilePath="/main-auth/profile"
        unreadCount={mockMainAuthData.unreadNotifications}
        avatarUrl={mockMainAuthData.avatarUrl}
        avatarAlt={mockMainAuthData.adminName}
        notificationLabel="View System Notifications"
        mobileMenu={(isOpen, onNavClick) => (
          <MobileDrawer
            isOpen={isOpen}
            links={mainAuthNavLinks}
            currentPath={currentPath}
            onNavClick={onNavClick}
          />
        )}
      >
        <NavLinks
          links={mainAuthNavLinks}
          currentPath={currentPath}
          onNavClick={setCurrentPath}
          layoutId="activeMainAuthNav"
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
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainAuthLayout;