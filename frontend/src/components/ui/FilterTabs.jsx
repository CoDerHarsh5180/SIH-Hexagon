/**
 * FilterTabs — Segmented button group for filtering lists.
 *
 * Props:
 *  - options  {Array<{ key: string, label: string }>}
 *  - value    {string}
 *  - onChange {fn}
 */
const FilterTabs = ({ options, value, onChange }) => (
  <div className="flex overflow-x-auto rounded-lg border border-border p-1 bg-background shrink-0">
    {options.map((opt) => (
      <button
        key={opt.key}
        onClick={() => onChange(opt.key)}
        className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
          value === opt.key
            ? 'bg-india-blue text-white'
            : 'text-foreground/70 hover:text-foreground'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default FilterTabs;
