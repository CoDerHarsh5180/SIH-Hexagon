import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data: Navigation routes for Main Authority
const mainAuthNavLinks = [
  { id: 'dashboard', label: 'Dashboard', path: '/main-auth/dashboard' },
  { id: 'our-docs', label: 'Our Docs', path: '/main-auth/our-docs' },
  { id: 'complaints', label: 'Complaints', path: '/main-auth/complaints' },
  { id: 'local-auths', label: 'Local Auths', path: '/main-auth/local-auths' },
];

// Mock Data: Main Authority Official & System Metadata
const mockMainAuthData = {
  authorityName: 'Central Licensing & Monitoring Authority',
  adminName: 'Principal Secretary',
  adminId: 'AUTH-MAIN-001',
  avatarUrl: '', // Fallback SVG renders when empty
  unreadNotifications: 7,
};

const MainAuthNavbar = ({ currentPath, setCurrentPath }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNavClick = (path) => {
    setCurrentPath(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Identity & Portal Scope */}
          <div className="flex items-center space-x-3">
            <span className="text-foreground font-bold text-xl tracking-tight">
              Doc<span className="text-india-blue">Flow</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded border border-india-blue/30 bg-india-blue/10 text-india-blue uppercase tracking-wider">
              Main Authority
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:space-x-8 items-center">
            {mainAuthNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentPath(link.path)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  currentPath === link.path ? 'text-india-blue' : 'text-foreground hover:text-india-blue'
                }`}
              >
                {link.label}
                {currentPath === link.path && (
                  <motion.div
                    layoutId="activeMainAuthNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-india-blue"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Items: Notifications, Theme Switcher, Profile */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button
              onClick={() => handleNavClick('/main-auth/notifications')}
              className={`relative p-2 rounded-full text-foreground hover:bg-border transition-colors focus:outline-none ${
                currentPath === '/main-auth/notifications' ? 'text-india-blue' : ''
              }`}
              aria-label="View System Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {mockMainAuthData.unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-blue opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-india-blue" />
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-foreground hover:bg-border transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Profile Avatar Trigger */}
            <button
              onClick={() => handleNavClick('/main-auth/profile')}
              className={`relative rounded-full p-0.5 transition-all focus:outline-none ${
                currentPath === '/main-auth/profile' ? 'ring-2 ring-india-blue' : 'hover:ring-1 hover:ring-border'
              }`}
              aria-label="Main Authority Profile"
            >
              {mockMainAuthData.avatarUrl ? (
                <img
                  src={mockMainAuthData.avatarUrl}
                  alt={mockMainAuthData.adminName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-foreground">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 0114 0H5z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-foreground hover:bg-border transition-colors focus:outline-none md:hidden"
              aria-label="Toggle Main Authority Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Accordion Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border bg-background px-4 pt-2 pb-4 space-y-1 overflow-hidden"
          >
            {mainAuthNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.path)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const MainAuthLayout = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/main-auth/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <MainAuthNavbar currentPath={currentPath} setCurrentPath={setCurrentPath} />

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
              Active Main Authority View: <span className="font-bold text-india-blue">{currentPath}</span>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MainAuthLayout;