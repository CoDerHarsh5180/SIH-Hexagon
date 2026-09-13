import React, { useEffect } from 'react';
import LandingNavbar from './components/LandingNavbar';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import SmartDiscoverySection from './components/SmartDiscoverySection';
import FeaturesGrid from './components/FeaturesGrid';
import SubsidiesSection from './components/SubsidiesSection';
import DualEcosystemSection from './components/DualEcosystemSection';
import DepartmentsSection from './components/DepartmentsSection';
import TrustSecuritySection from './components/TrustSecuritySection';
import CallToActionSection from './components/CallToActionSection';
import LandingFooter from './components/LandingFooter';

export const LandingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#121212] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col font-sans selection:bg-[#ff7700]/20 selection:text-[#ff7700] transition-colors duration-300">
      {/* 1. Top Navigation */}
      <LandingNavbar />

      <main className="flex-grow relative z-10">
        {/* 2. Hero Section with Live Dossier */}
        <HeroSection />

        {/* 3. Key Stats Bar */}
        <StatsBar />

        {/* 4. How It Works - 3-Stage Smart Discovery (Ask for Approvals Simulator) */}
        <SmartDiscoverySection />

        {/* 5. Powerful Features Grid */}
        <FeaturesGrid />

        {/* 6. Industrial Subsidies & Benefits Section */}
        <SubsidiesSection />

        {/* 7. The Dual Dashboard Ecosystem */}
        <DualEcosystemSection />

        {/* 8. Integrated Maharashtra Departments */}
        <DepartmentsSection />

        {/* 9. Trust & Cryptographic Security Section */}
        <TrustSecuritySection />

        {/* 10. Final Call to Action */}
        <CallToActionSection />
      </main>

      {/* 11. Official Civic Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
