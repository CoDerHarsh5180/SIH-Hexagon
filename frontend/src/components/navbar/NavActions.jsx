import { useState } from 'react';
import { Bell, Sun, Moon, User } from 'lucide-react';

/**
 * NavActions — Right-side action cluster: notification bell, dark-mode toggle, avatar.
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Notification Bell */}
      <button
        onClick={() => onNavClick(notificationPath)}
        className={`relative p-2 rounded-full text-foreground hover:bg-border transition-colors focus:outline-none ${
          currentPath === notificationPath ? 'text-india-blue' : ''
        }`}
        aria-label={notificationLabel}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
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
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Profile Avatar */}
      <button
        onClick={() => onNavClick(profilePath)}
        className={`relative rounded-full p-0.5 transition-all focus:outline-none ${
          currentPath === profilePath ? 'ring-2 ring-india-blue' : 'hover:ring-1 hover:ring-border'
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
