import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, 
  Lock, 
  GitPullRequest, 
  Calendar, 
  Headphones, 
  LayoutDashboard,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { PLATFORM_FEATURES } from '../data/landingData';

export const FeaturesGrid = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleFeatureClick = (idx) => {
    switch (idx) {
      case 0: 
        navigate('/approvals');
        break;
      case 1: 
        navigate(isAuthenticated ? '/user/your-docs' : '/login');
        break;
      case 2: 
        navigate(isAuthenticated ? '/user/track' : '/dashboard');
        break;
      case 3: 
        navigate('/gov-benefits');
        break;
      case 4: 
        navigate(isAuthenticated ? '/user/complain' : '/login');
        break;
      case 5: 
        navigate('/dashboard');
        break;
      default: 
        navigate('/dashboard');
    }
  };

  const getFeatureIcon = (iconName) => {
    const iconClass = "w-5 h-5 text-india-orange group-hover:text-white transition-colors";
    switch (iconName) {
      case 'Network':
        return <Network className={iconClass} />;
      case 'Lock':
        return <Lock className={iconClass} />;
      case 'GitPullRequest':
        return <GitPullRequest className={iconClass} />;
      case 'Calendar':
        return <Calendar className={iconClass} />;
      case 'Headphones':
        return <Headphones className={iconClass} />;
      case 'LayoutDashboard':
        return <LayoutDashboard className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <section className="py-16 bg-background border-b border-border transition-colors duration-300" id="features">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-india-orange text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Key Benefits for Businesses</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Why Use SARAL For Your Approvals
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            SARAL (Streamlined Applications, Record and Approvals Link) makes it quick and stress-free to get your factory and business approvals online without visiting multiple offices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              onClick={() => handleFeatureClick(idx)}
              className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-xs hover:border-india-orange/60 hover:shadow-xs transition-all duration-200 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-india-orange/10 border border-india-orange/20 flex items-center justify-center group-hover:bg-india-orange transition-colors">
                    {getFeatureIcon(feature.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-india-orange transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                  {feature.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center gap-1 text-xs font-semibold text-india-orange group-hover:translate-x-1 transition-transform">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
