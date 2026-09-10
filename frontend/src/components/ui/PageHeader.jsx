/**
 * PageHeader — Standardised title + subtitle block used at the top of every page.
 *
 * Props:
 *  - title    {string}
 *  - subtitle {string}
 *  - children          — Optional slot for extra controls (e.g. a counter badge)
 *  - className {string}
 */
const PageHeader = ({ title, subtitle, children, className = '' }) => (
  <div className={`border-b border-border pb-4 sm:pb-6 ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  </div>
);

export default PageHeader;
