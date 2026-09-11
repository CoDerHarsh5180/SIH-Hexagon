import { useLocation, useNavigate, Outlet } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar
        badge="Main Authority"
        currentPath={currentPath}
        onNavClick={handleNavClick}
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
            onNavClick={handleNavClick}
          />
        )}
      >
        <NavLinks
          links={mainAuthNavLinks}
          currentPath={currentPath}
          onNavClick={handleNavClick}
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
          {children || <Outlet />}
        </motion.div>
      </main>
    </div>
  );
};

export default MainAuthLayout;