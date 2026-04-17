import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { PageHeader, Spinner, Alert } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value, sub, color = 'brand' }) => {
  const colors = {
    brand:  'text-brand-400 bg-brand-500/10 border-brand-500/20',
    blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    gray:   'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
          <p className="text-3xl font-display font-700 text-white">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatusBar = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const barColors = {
    blue:   'bg-blue-500',
    yellow: 'bg-yellow-500',
    brand:  'bg-brand-500',
    purple: 'bg-purple-500',
  };
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColors[color]} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-mono text-gray-300 w-6 text-right">{count}</span>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getDashboard()
      .then((r) => setData(r.data.data))
      .catch((e) => setError(e.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div>
      <PageHeader
        title={`Good day, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's what's happening with your laundry orders."
        action={
          <Link to="/orders/new" className="btn-primary flex items-center gap-2">
            <span>+</span> New Order
          </Link>
        }
      />

      <Alert type="error" message={error} />

      {data && (
        <div className="space-y-8">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="📋" label="Total Orders" value={data.totalOrders} color="blue" />
            <StatCard
              icon="💰"
              label="Revenue"
              value={`₹${parseFloat(data.totalRevenue).toLocaleString('en-IN')}`}
              sub="From paid orders"
              color="brand"
            />
            <StatCard
              icon="✅"
              label="Delivered"
              value={data.ordersByStatus.DELIVERED}
              color="purple"
            />
            <StatCard
              icon="⚙️"
              label="In Progress"
              value={data.ordersByStatus.PROCESSING + data.ordersByStatus.RECEIVED}
              color="yellow"
            />
          </div>

          {/* Progress section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order status breakdown */}
            <div className="card p-6 space-y-5">
              <h3 className="font-semibold text-white">Order Status</h3>
              <div className="space-y-4">
                <StatusBar label="Received" count={data.ordersByStatus.RECEIVED} total={data.totalOrders} color="blue" />
                <StatusBar label="Processing" count={data.ordersByStatus.PROCESSING} total={data.totalOrders} color="yellow" />
                <StatusBar label="Ready" count={data.ordersByStatus.READY} total={data.totalOrders} color="brand" />
                <StatusBar label="Delivered" count={data.ordersByStatus.DELIVERED} total={data.totalOrders} color="purple" />
              </div>
            </div>

            {/* Payment status breakdown */}
            <div className="card p-6 space-y-5">
              <h3 className="font-semibold text-white">Payment Status</h3>
              <div className="space-y-4">
                {Object.entries(data.paymentByStatus || {}).map(([status, count]) => {
                  const colors = { pending: 'yellow', complete: 'brand', canceled: 'gray', failed: 'blue' };
                  return (
                    <StatusBar
                      key={status}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      count={count}
                      total={data.totalOrders}
                      color={colors[status] || 'gray'}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/orders/new" className="btn-primary flex items-center gap-2">➕ Create Order</Link>
              <Link to="/orders" className="btn-secondary flex items-center gap-2">📋 View All Orders</Link>
              <Link to="/orders?orderStatus=READY" className="btn-secondary flex items-center gap-2">✅ Ready for Pickup</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
