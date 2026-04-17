// Spinner
export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div
      className={`${sizes[size]} border-2 border-brand-500 border-t-transparent rounded-full animate-spin`}
    />
  );
};

// Status badge for orders
const ORDER_STATUS_MAP = {
  RECEIVED:   { label: 'Received',   color: 'bg-blue-500/15 text-blue-400 border border-blue-500/20' },
  PROCESSING: { label: 'Processing', color: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' },
  READY:      { label: 'Ready',      color: 'bg-brand-500/15 text-brand-400 border border-brand-500/20' },
  DELIVERED:  { label: 'Delivered',  color: 'bg-purple-500/15 text-purple-400 border border-purple-500/20' },
};

const PAYMENT_STATUS_MAP = {
  pending:   { label: 'Pending',   color: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' },
  complete:  { label: 'Paid',      color: 'bg-brand-500/15 text-brand-400 border border-brand-500/20' },
  canceled:  { label: 'Canceled',  color: 'bg-gray-500/15 text-gray-400 border border-gray-500/20' },
  failed:    { label: 'Failed',    color: 'bg-red-500/15 text-red-400 border border-red-500/20' },
};

export const OrderStatusBadge = ({ status }) => {
  const cfg = ORDER_STATUS_MAP[status] || { label: status, color: 'bg-gray-500/15 text-gray-400' };
  return <span className={`badge ${cfg.color}`}>{cfg.label}</span>;
};

export const PaymentStatusBadge = ({ status }) => {
  const cfg = PAYMENT_STATUS_MAP[status] || { label: status, color: 'bg-gray-500/15 text-gray-400' };
  return <span className={`badge ${cfg.color}`}>{cfg.label}</span>;
};

// Alert / error banner
export const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  const styles = {
    error:   'bg-red-500/10 border-red-500/20 text-red-400',
    success: 'bg-brand-500/10 border-brand-500/20 text-brand-400',
    info:    'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

// Page header
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-8 gap-4">
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-700 text-white">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

// Empty state
export const EmptyState = ({ icon = '📭', title, description }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-5xl mb-4 opacity-50">{icon}</div>
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    {description && <p className="text-gray-500 text-sm max-w-xs">{description}</p>}
  </div>
);

// Loading skeleton
export const SkeletonRow = () => (
  <div className="animate-pulse flex gap-4 px-4 py-4 border-b border-white/[0.04]">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-4 bg-white/5 rounded-full flex-1" />
    ))}
  </div>
);
