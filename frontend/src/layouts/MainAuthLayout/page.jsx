import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Navbar, NavLinks, MobileDrawer } from '../../components/navbar';
import { useAuth } from '../../context/AuthContext';
import { notificationsService } from '../../services/notificationsService';

const mainAuthNavLinks = [
  { id: 'dashboard', label: 'Dashboard', path: '/main-auth/dashboard' },
  { id: 'requests', label: 'All Requests', path: '/main-auth/requests' },
  { id: 'our-docs', label: 'Our Docs', path: '/main-auth/our-docs' },
  { id: 'add-new', label: 'Add New Doc', path: '/main-auth/add-new' },
  { id: 'complaints', label: 'Complaints', path: '/main-auth/complaints' },
  { id: 'local-auths', label: 'Local Auths', path: '/main-auth/local-auths' },
];

export const MainAuthLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationsService.getUnreadCount()
      .then((res) => {
        if (typeof res?.data?.count === 'number') {
          setUnreadCount(res.data.count);
        }
      })
      .catch(() => {});
  }, [currentPath]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const adminTitle = user?.designation || user?.name || 'Principal Secretary';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar
        badge="Main Authority"
        currentPath={currentPath}
        onNavClick={handleNavClick}
        notificationPath="/main-auth/notifications"
        profilePath="/main-auth/profile"
        unreadCount={unreadCount}
        avatarUrl={user?.avatar || ''}
        avatarAlt={adminTitle}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainAuthLayout;