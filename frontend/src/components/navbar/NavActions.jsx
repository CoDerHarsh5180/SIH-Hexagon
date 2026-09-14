import { useState } from 'react';
import { Bell, Sun, Moon, User, Home } from 'lucide-react';

/**
 * NavActions — Right-side action cluster: Landing Page button, notification bell, dark-mode toggle, avatar.
 *
 * Props:
 *  - notificationPath  {string}
 *  - profilePath       {string}
 *  - currentPath       {string}
 *  - onNavClick        {fn}
 *  - unreadCount       {number}
 *  - avatarUrl         {string}
 *  - avatarAlt         {string}
 *  - notificationLabel {string}
 */
const NavActions = ({
  notificationPath,
  profilePath,
  currentPath,
  onNavClick,
  unreadCount = 0,
  avatarUrl = '',
  avatarAlt = 'Profile',
  notificationLabel = 'View Notifications',
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      {/* Return to Public Landing Page */}
      <button
        onClick={() => onNavClick('/')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-foreground hover:text-india-orange hover:bg-muted text-xs font-semibold transition-colors focus:outline-none cursor-pointer"
        title="Go to Public Landing Page"
      >
        <Home className="w-3.5 h-3.5 text-india-orange" />
        <span className="hidden sm:inline">Landing Page</span>
      </button>

      {/* Notification Bell */}
      <button
        onClick={() => onNavClick(notificationPath)}
        className={`relative p-2 rounded-full text-foreground hover:bg-border transition-colors focus:outline-none ${
          currentPath === notificationPath ? 'text-india-orange' : ''
        }`}
        aria-label={notificationLabel}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-india-orange" />
          </span>
        )}
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full text-foreground hover:bg-border transition-colors focus:outline-none cursor-pointer"
        aria-label="Toggle Dark Mode"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-india-orange" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Profile Avatar */}
      <button
        onClick={() => onNavClick(profilePath)}
        className={`relative rounded-full p-0.5 transition-all focus:outline-none cursor-pointer ${
          currentPath === profilePath ? 'ring-2 ring-india-orange' : 'hover:ring-1 hover:ring-border'
        }`}
        aria-label={avatarAlt}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={avatarAlt} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-foreground">
            <User className="w-5 h-5" />
          </div>
        )}
      </button>
    </div>
  );
};

export default NavActions;
