import { Link } from 'react-router-dom';


const NavBrand = ({ badge }) => (
  <div className="flex items-center space-x-3">
    <Link to="/" className="text-foreground font-bold text-xl tracking-tight hover:opacity-90 transition-opacity flex items-center cursor-pointer" title="Streamlined Applications, Record and Approvals Link">
      SAR<span className="text-india-orange">AL</span>
    </Link>
    {badge && (
      <span className="text-xs font-semibold px-2 py-0.5 rounded border border-india-orange/30 bg-india-orange/10 text-india-orange uppercase tracking-wider">
        {badge}
      </span>
    )}
  </div>
);

export default NavBrand;
