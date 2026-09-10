import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import NavBrand from './NavBrand';
import NavActions from './NavActions';

/**
 * Navbar — Generic top navbar wrapper used by all 3 portal layouts.
 *
 * Props:
 *  - badge             {string}
 *  - currentPath       {string}
 *  - onNavClick        {fn}
 *  - notificationPath  {string}
 *  - profilePath       {string}
 *  - unreadCount       {number}
 *  - avatarUrl         {string}
 *  - avatarAlt         {string}
 *  - notificationLabel {string}
 *  - children                   — Desktop nav links slot
 *  - mobileMenu                 — (isOpen, onNavClick) => node
 */
const Navbar = ({
  badge,
  currentPath,
  onNavClick,
  notificationPath,
  profilePath,
  unreadCount = 0,
  avatarUrl = '',
  avatarAlt = 'Profile',
  notificationLabel = 'View Notifications',
  children,
  mobileMenu,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (path) => {
    onNavClick(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <NavBrand badge={badge} />

          {/* Desktop Nav Links Slot */}
          {children && <div className="hidden md:flex md:space-x-8 items-center">{children}</div>}

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <NavActions
              notificationPath={notificationPath}
              profilePath={profilePath}
              currentPath={currentPath}
              onNavClick={handleNavClick}
              unreadCount={unreadCount}
              avatarUrl={avatarUrl}
              avatarAlt={avatarAlt}
              notificationLabel={notificationLabel}
            />

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-foreground hover:bg-border transition-colors focus:outline-none md:hidden"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slot */}
      {mobileMenu && mobileMenu(isMobileMenuOpen, handleNavClick)}
    </nav>
  );
};

export default Navbar;
