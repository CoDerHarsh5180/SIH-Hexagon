import { Link } from 'react-router-dom';
import SaralLogo from '../common/SaralLogo';

const NavBrand = ({ badge }) => {
  return (
    <div className="flex items-center space-x-3 shrink-0">
      <Link 
        to="/" 
        className="hover:opacity-90 transition-opacity flex items-center cursor-pointer py-1 shrink-0" 
        title="SARAL — Streamlined Applications, Record and Approvals Link"
      >
        <SaralLogo />
      </Link>
      {badge && badge !== 'Single Window' && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded border border-india-orange/30 bg-india-orange/10 text-india-orange uppercase tracking-wider shrink-0 whitespace-nowrap hidden sm:inline-block">
          {badge}
        </span>
      )}
    </div>
  );
};

export default NavBrand;
