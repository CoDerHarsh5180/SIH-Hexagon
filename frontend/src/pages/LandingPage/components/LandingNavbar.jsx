import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import SaralLogo from '../../../components/common/SaralLogo';

const navLinks = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'approvals', label: 'Ask for Approval', path: '/approvals' },
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'gov-benefits', label: 'Government Benefits', path: '/gov-benefits' },
];

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated, role, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo - Crisp Official SARAL Logo */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="hover:opacity-90 transition-opacity flex items-center cursor-pointer py-1"
              title="SARAL — Streamlined Applications, Record and Approvals Link"
            >
              <SaralLogo />
            </Link>
          </div>

          {/* Desktop Nav Links - Strictly 3 Public Links with Animated Underline */}
          <nav className="hidden md:flex md:space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive ? 'text-india-orange font-semibold' : 'text-foreground hover:text-india-orange'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="landingActiveNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-india-orange"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right-Side Actions Cluster */}
          <div className="flex items-center space-x-3">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-foreground hover:bg-border transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Dark Mode"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-india-orange" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Actions: Logged In -> Portal Button; Guest -> Login/Register */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (role === 'LOCAL_AUTH') navigate('/local-auth/requests');
                    else if (role === 'MAIN_AUTH') navigate('/main-auth/dashboard');
                    else navigate('/user/dashboard');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Portal</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/20 text-white font-mono">
                    {role || 'USER'}
                  </span>
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="p-2 rounded-full text-foreground hover:text-red-500 hover:bg-border transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-india-orange rounded-md transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-india-orange hover:opacity-90 rounded-lg transition-opacity cursor-pointer shadow-xs"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-foreground hover:bg-border transition-colors focus:outline-none md:hidden cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  currentPath === link.path
                    ? 'bg-border text-india-orange font-semibold'
                    : 'text-foreground hover:bg-border hover:text-india-orange'
                }`}
              >
                <span>{link.label}</span>
                {currentPath === link.path && (
                  <span className="w-2 h-2 rounded-full bg-india-orange" />
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      if (role === 'LOCAL_AUTH') navigate('/local-auth/requests');
                      else if (role === 'MAIN_AUTH') navigate('/main-auth/dashboard');
                      else navigate('/user/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-lg bg-india-blue text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Go to My Portal ({role || 'USER'})</span>
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-border text-foreground text-xs font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                    className="flex-1 py-2 text-center text-xs font-bold rounded-lg border border-border text-foreground cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                    className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-india-orange text-white cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingNavbar;
