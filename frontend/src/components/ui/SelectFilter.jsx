/**
 * SelectFilter — A labelled <select> dropdown for filter controls.
 *
 * Props:
 *  - label    {string}
 *  - options  {Array<string>}
 *  - value    {string}
 *  - onChange {fn}
 */
const SelectFilter = ({ label, options, value, onChange }) => (
  <div>
    {label && (
      <label className="block text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-1">
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default SelectFilter;
