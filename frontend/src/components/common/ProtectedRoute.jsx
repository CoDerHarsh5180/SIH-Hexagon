import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * - Checks if the user is authenticated.
 * - If not, redirects to /login while saving the current location.
 * - Optionally checks if the user's role is permitted (allowedRoles).
 *   If user role is not allowed, redirects to their authorized home portal.
 */
export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // If still loading session from storage/API, render minimal loader or pass
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-india-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-foreground/60">Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Dual role MUNICIPAL_AUTH can access both LOCAL_AUTH and MAIN_AUTH routes
    if (role === 'MUNICIPAL_AUTH' && (allowedRoles.includes('LOCAL_AUTH') || allowedRoles.includes('MAIN_AUTH'))) {
      return <Outlet />;
    }

    // Redirect to default home based on actual role
    if (role === 'LOCAL_AUTH') return <Navigate to="/local-auth/requests" replace />;
    if (role === 'MAIN_AUTH') return <Navigate to="/main-auth/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
