import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import {
  PageHeader, OrderStatusBadge, PaymentStatusBadge,
  Spinner, Alert
} from '../components/ui';

const ORDER_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
const PAYMENT_STATUSES = ['pending', 'complete', 'canceled', 'failed'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editStatus, setEditStatus] = useState({ orderStatus: '', paymentStatus: '' });

  useEffect(() => {
    orderService.getById(id)
      .then((r) => {
        setOrder(r.data.data.order);
        setEditStatus({
          orderStatus: r.data.data.order.orderStatus,
          paymentStatus: r.data.data.order.paymentStatus,
        });
      })
      .catch((e) => setError(e.response?.data?.message || 'Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await orderService.update(id, editStatus);
      setOrder(data.data.order);
      setSuccess('Order updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await orderService.delete(id);
      navigate('/orders');
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed.');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
  );

  if (!order && error) return (
    <div>
      <PageHeader title="Order Not Found" />
      <Alert type="error" message={error} />
      <Link to="/orders" className="btn-secondary mt-4 inline-flex">← Back to Orders</Link>
    </div>
  );

  const totalItems = order.garments?.reduce((s, g) => s + Number(g.quantity), 0) || 0;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Order Details"
        subtitle={`ID: ${order.id.slice(0, 8)}...`}
        action={
          <div className="flex gap-2">
            <Link to="/orders" className="btn-secondary text-sm">← Back</Link>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex items-center gap-1">
              {deleting ? <Spinner size="sm" /> : '🗑'}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        }
      />

      <div className="space-y-5 animate-slide-up">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        {/* Customer info */}
        <div className="card p-6">
          <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4">
            Customer
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-white font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-white font-mono">{order.phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Created</p>
              <p className="text-white text-sm">
                {new Date(order.createdAt).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <p className="text-white text-sm">
                {new Date(order.updatedAt).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Garments */}
        <div className="card p-6">
          <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4">
            Garments ({totalItems} items)
          </h3>
          <div className="space-y-2">
            {order.garments?.map((g, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                    👕
                  </span>
                  <div>
                    <p className="text-white text-sm font-medium">{g.type}</p>
                    <p className="text-xs text-gray-500">₹{g.pricePerItem} × {g.quantity}</p>
                  </div>
                </div>
                <p className="font-mono text-sm text-white">
                  ₹{(Number(g.quantity) * Number(g.pricePerItem)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/[0.06] mt-2">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="font-display text-2xl font-700 text-brand-400">
              ₹{parseFloat(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Update Status */}
        <div className="card p-6">
          <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4">
            Update Status
          </h3>

          <div className="flex items-center gap-2 mb-5">
            <OrderStatusBadge status={order.orderStatus} />
            <span className="text-gray-600">·</span>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Order Status</label>
              <select
                value={editStatus.orderStatus}
                onChange={(e) => setEditStatus((s) => ({ ...s, orderStatus: e.target.value }))}
                className="input"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Payment Status</label>
              <select
                value={editStatus.paymentStatus}
                onChange={(e) => setEditStatus((s) => ({ ...s, paymentStatus: e.target.value }))}
                className="input"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0) + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="btn-primary flex items-center gap-2"
          >
            {updating && <Spinner size="sm" />}
            {updating ? 'Updating...' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
