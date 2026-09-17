import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync state on app launch and optionally refresh profile
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // If it's a stale fallback mock token from an old session, clear it to allow real auth
        if (storedToken.startsWith('mock-token-') && !storedToken.includes('dev')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const res = await authService.getProfile();
          const liveUser = res?.data?.user || res?.data || res?.user;
          if (liveUser) {
            setUser(liveUser);
            localStorage.setItem('user', JSON.stringify(liveUser));
          }
        } catch (err) {
          console.warn('[AuthContext] Could not fetch fresh profile on mount, using cached user if available:', err.message);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      const receivedToken = res?.data?.token || res?.token;
      const receivedUser = res?.data?.user || res?.user || {
        email: credentials.email,
        role: credentials.portalType || 'USER',
      };

      if (receivedToken) {
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
      }
      return res;
    } catch (err) {
      console.error('[AuthContext] Login error:', err.message);
      throw err;
    }
  };

  const devLoginAs = (targetRole = 'USER') => {
    const devToken = `mock-token-${targetRole.toLowerCase()}-${Date.now()}`;
    const devUser = {
      name: targetRole === 'LOCAL_AUTH' 
        ? 'District Verification Officer' 
        : targetRole === 'MAIN_AUTH' 
        ? 'Principal Secretary' 
        : 'Industrial Applicant (MSME)',
      email: targetRole === 'LOCAL_AUTH' 
        ? 'officer.pune@collectorate.gov.in' 
        : targetRole === 'MAIN_AUTH' 
        ? 'director.industries@maharashtra.gov.in' 
        : 'applicant@enterprise.gov.in',
      role: targetRole,
      profileStatus: targetRole === 'USER' ? 'INCOMPLETE' : 'COMPLETED',
      profileCompletion: targetRole === 'USER' ? 20 : 100,
      verifiedDocuments: [],
    };
    setToken(devToken);
    setUser(devUser);
    localStorage.setItem('token', devToken);
    localStorage.setItem('user', JSON.stringify(devUser));
    return { success: true, token: devToken, user: devUser, isOfflinePreview: true };
  };

  const register = async (payload) => {
    try {
      const res = await authService.register(payload);
      const receivedToken = res?.data?.token || res?.token;
      const receivedUser = res?.data?.user || res?.user;
      if (receivedToken) {
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
      }
      return res;
    } catch (err) {
      console.error('[AuthContext] Registration error:', err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout().catch(() => {});
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const role = user?.role || (token ? 'USER' : null);
  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        devLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
