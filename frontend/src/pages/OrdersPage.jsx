import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import {
  PageHeader, OrderStatusBadge, PaymentStatusBadge,
  Spinner, Alert, EmptyState, SkeletonRow
} from '../components/ui';

const ORDER_STATUSES = ['', 'RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    customerName: searchParams.get('customerName') || '',
    phoneNumber: searchParams.get('phoneNumber') || '',
    orderStatus: searchParams.get('orderStatus') || '',
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.customerName) params.customerName = filters.customerName;
      if (filters.phoneNumber) params.phoneNumber = filters.phoneNumber;
      if (filters.orderStatus) params.orderStatus = filters.orderStatus;
      const { data } = await orderService.getAll(params);
      setOrders(data.data.orders);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
    const params = {};
    if (name !== 'customerName' && filters.customerName) params.customerName = filters.customerName;
    if (name !== 'phoneNumber' && filters.phoneNumber) params.phoneNumber = filters.phoneNumber;
    if (name !== 'orderStatus' && filters.orderStatus) params.orderStatus = filters.orderStatus;
    if (value) params[name] = value;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ customerName: '', phoneNumber: '', orderStatus: '' });
    setSearchParams({});
  };

  const hasFilters = filters.customerName || filters.phoneNumber || filters.orderStatus;

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
        action={
          <Link to="/orders/new" className="btn-primary flex items-center gap-2">
            + New Order
          </Link>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="label">Customer Name</label>
          <input
            name="customerName"
            value={filters.customerName}
            onChange={handleFilterChange}
            className="input"
            placeholder="Search by name..."
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="label">Phone Number</label>
          <input
            name="phoneNumber"
            value={filters.phoneNumber}
            onChange={handleFilterChange}
            className="input"
            placeholder="Search by phone..."
          />
        </div>
        <div className="w-40">
          <label className="label">Status</label>
          <select name="orderStatus" value={filters.orderStatus} onChange={handleFilterChange} className="input">
            <option value="">All Statuses</option>
            {ORDER_STATUSES.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-secondary text-sm mb-0.5">
            Clear
          </button>
        )}
      </div>

      <Alert type="error" message={error} />

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1fr_130px_120px_120px_80px] gap-4 px-5 py-3 border-b border-white/[0.06] text-xs uppercase tracking-wider text-gray-500 font-medium">
          <span>Customer</span>
          <span>Garments</span>
          <span>Order Status</span>
          <span>Payment</span>
          <span className="text-right">Total</span>
        </div>

        {loading ? (
          [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No orders found"
            description={hasFilters ? 'Try clearing the filters.' : 'Create your first order to get started.'}
          />
        ) : (
          orders.map((order, i) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block md:grid md:grid-cols-[1fr_130px_120px_120px_80px] gap-4 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors animate-fade-in group"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div>
                <p className="font-medium text-white group-hover:text-brand-300 transition-colors">
                  {order.customerName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">{order.phoneNumber}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <p className="text-sm text-gray-300">
                  {Array.isArray(order.garments) ? order.garments.length : 0} item
                  {(Array.isArray(order.garments) ? order.garments.length : 0) !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[110px]">
                  {Array.isArray(order.garments)
                    ? order.garments.map((g) => g.type).join(', ')
                    : '—'}
                </p>
              </div>
              <div className="mt-2 md:mt-0 flex md:block items-center gap-2">
                <OrderStatusBadge status={order.orderStatus} />
              </div>
              <div className="mt-2 md:mt-0 flex md:block items-center gap-2">
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <p className="font-mono text-sm text-white">
                  ₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
