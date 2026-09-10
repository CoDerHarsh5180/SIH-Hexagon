import { PackageSearch } from 'lucide-react';

/**
 * EmptyState — Dashed border placeholder shown when a filtered list is empty.
 *
 * Props:
 *  - message {string}
 */
const EmptyState = ({ message = 'No items found matching current filter.' }) => (
  <div className="text-center py-12 border border-dashed border-border rounded-xl">
    <PackageSearch className="w-8 h-8 text-foreground/30 mx-auto mb-2" />
    <p className="text-sm text-foreground/60">{message}</p>
  </div>
);

export default EmptyState;
