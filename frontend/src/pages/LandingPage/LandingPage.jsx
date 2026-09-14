import React, { useEffect } from 'react';
import LandingNavbar from './components/LandingNavbar';
import HeroSection from './components/HeroSection';
import FeaturesGrid from './components/FeaturesGrid';
import SubsidiesSection from './components/SubsidiesSection';
import DepartmentsSection from './components/DepartmentsSection';
import TrustSecuritySection from './components/TrustSecuritySection';
import LandingFooter from './components/LandingFooter';

export const LandingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-background text-foreground antialiased min-h-screen flex flex-col font-sans selection:bg-india-orange/20 selection:text-india-orange transition-colors duration-300">
      {/* 1. Top Navigation */}
      <LandingNavbar />

      <main className="flex-grow relative z-10">
        {/* 2. Hero Section with Live Dossier */}
        <HeroSection />

       


        {/* 5. Powerful Features Grid */}
        <FeaturesGrid />

        {/* 6. Industrial Subsidies & Benefits Section */}
        <SubsidiesSection />

        {/* 7. Integrated Maharashtra Departments */}
        <DepartmentsSection />

      

      
      </main>

      {/* 11. Official Civic Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
