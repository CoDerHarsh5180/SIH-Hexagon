/**
 * FilterTabs — Segmented button group for filtering lists.
 *
 * Props:
 *  - options  {Array<{ key: string, label: string }>}
 *  - value    {string}
 *  - onChange {fn}
 */
const FilterTabs = ({ options, tabs, value, activeTab, onChange }) => {
  const items = options || tabs || [];
  const currentVal = value !== undefined ? value : activeTab;

  return (
    <div className="flex overflow-x-auto rounded-lg border border-border p-1 bg-background shrink-0">
      {items.map((opt) => {
        const key = opt.key !== undefined ? opt.key : (opt.id !== undefined ? opt.id : opt);
        const label = opt.label !== undefined ? opt.label : (opt.name !== undefined ? opt.name : opt);
        const isSelected = currentVal === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              isSelected
                ? 'bg-india-blue text-white shadow-xs'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
