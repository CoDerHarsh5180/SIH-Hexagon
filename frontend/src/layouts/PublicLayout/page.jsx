import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from '../../pages/LandingPage/components/LandingNavbar';
import LandingFooter from '../../pages/LandingPage/components/LandingFooter';

export const PublicLayout = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Official Civic Navbar */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Official Civic Footer */}
      <LandingFooter />
    </div>
  );
};

export default PublicLayout;
