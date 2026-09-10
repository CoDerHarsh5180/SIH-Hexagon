import { Search } from 'lucide-react';

/**
 * SearchInput — Styled text input with a Lucide Search icon on the left.
 *
 * Props:
 *  - value       {string}
 *  - onChange    {fn}
 *  - placeholder {string}
 *  - className   {string}
 */
const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-india-blue transition-colors"
    />
    <Search className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" />
  </div>
);

export default SearchInput;
