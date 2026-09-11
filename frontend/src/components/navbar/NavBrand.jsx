/**
 * NavBrand — "DocFlow" brand logo + optional portal badge pill.
 *
 * Props:
 *  - badge {string}
 */
const NavBrand = ({ badge }) => (
  <div className="flex items-center space-x-3">
    <span className="text-foreground font-bold text-xl tracking-tight">
      Doc<span className="text-india-orange">Flow</span>
    </span>
    {badge && (
      <span className="text-xs font-semibold px-2 py-0.5 rounded border border-india-orange/30 bg-india-orange/10 text-india-orange uppercase tracking-wider">
        {badge}
      </span>
    )}
  </div>
);

export default NavBrand;
