import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Navbar, NavLinks, MobileDrawer } from '../../components/navbar';
import { useAuth } from '../../context/AuthContext';
import { notificationsService } from '../../services/notificationsService';

const localAuthNavLinks = [
  { id: 'All Requests', label: 'All Requests', path: '/local-auth/requests' },
  { id: 'History', label: 'History', path: '/local-auth/history' },
  { id: 'Complaints', label: 'Complaints', path: '/local-auth/complaints' },
  { id: 'Profile', label: 'Profile', path: '/local-auth/profile' },
];

export const LocalAuthLayout = ({ children }) => {
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

  const designation = user?.designation || user?.name || 'Scrutiny Officer';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar
        badge="Local Authority"
        currentPath={currentPath}
        onNavClick={handleNavClick}
        notificationPath="/local-auth/notifications"
        profilePath="/local-auth/profile"
        unreadCount={unreadCount}
        avatarUrl={user?.avatar || ''}
        avatarAlt={designation}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default LocalAuthLayout;