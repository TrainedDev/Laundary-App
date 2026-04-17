import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { PageHeader, Alert, Spinner } from '../components/ui';

const GARMENT_TYPES = [
  'Shirt', 'T-Shirt', 'Pants', 'Jeans', 'Jacket', 'Coat', 'Saree',
  'Kurta', 'Dress', 'Skirt', 'Sweater', 'Suit', 'Bedsheet', 'Towel',
  'Blanket', 'Curtain', 'Other',
];

const emptyGarment = () => ({ type: 'Shirt', quantity: 1, pricePerItem: 50 });

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    paymentStatus: 'pending',
    orderStatus: 'RECEIVED',
  });
  const [garments, setGarments] = useState([emptyGarment()]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = garments.reduce((s, g) => {
    const q = Number(g.quantity) || 0;
    const p = Number(g.pricePerItem) || 0;
    return s + q * p;
  }, 0);

  const handleFormChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleGarmentChange = (idx, field, value) => {
    setGarments((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, [field]: value } : g))
    );
  };

  const addGarment = () => setGarments((prev) => [...prev, emptyGarment()]);

  const removeGarment = (idx) => {
    if (garments.length === 1) return;
    setGarments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    for (const g of garments) {
      if (!g.type || Number(g.quantity) <= 0 || Number(g.pricePerItem) < 0) {
        return setError('All garment fields must be filled with valid values.');
      }
    }

    setLoading(true);
    try {
      const { data } = await orderService.create({
        ...form,
        garments: garments.map((g) => ({
          type: g.type,
          quantity: Number(g.quantity),
          pricePerItem: Number(g.pricePerItem),
        })),
      });
      navigate(`/orders/${data.data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="New Order"
        subtitle="Fill in the details to create a laundry order."
        action={<Link to="/orders" className="btn-secondary">← Back</Link>}
      />

      <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
        <Alert type="error" message={error} />

        {/* Customer Info */}
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-brand-400">
            Customer Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleFormChange}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleFormChange}
                className="input"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>
        </div>

        {/* Garments */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-brand-400">
              Garments ({garments.length})
            </h3>
            <button type="button" onClick={addGarment} className="btn-secondary text-sm px-3 py-1.5">
              + Add Item
            </button>
          </div>

          <div className="space-y-3">
            {garments.map((g, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-end p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] animate-slide-in-right"
              >
                <div className="flex-1 min-w-0">
                  <label className="label">Type</label>
                  <select
                    value={g.type}
                    onChange={(e) => handleGarmentChange(idx, 'type', e.target.value)}
                    className="input"
                  >
                    {GARMENT_TYPES.map((t) => (
                      <option className='bg-black/50' key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="w-20">
                  <label className="label">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={g.quantity}
                    onChange={(e) => handleGarmentChange(idx, 'quantity', e.target.value)}
                    className="input text-center"
                  />
                </div>
                <div className="w-28">
                  <label className="label">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={g.pricePerItem}
                    onChange={(e) => handleGarmentChange(idx, 'pricePerItem', e.target.value)}
                    className="input"
                  />
                </div>
                <div className="w-20 text-right pb-3">
                  <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                  <p className="font-mono text-sm text-white">
                    ₹{((Number(g.quantity) || 0) * (Number(g.pricePerItem) || 0)).toFixed(0)}
                  </p>
                </div>
                {garments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGarment(idx)}
                    className="pb-2 text-gray-600 hover:text-red-400 transition-colors text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end pt-2 border-t border-white/[0.06]">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="font-display text-2xl font-700 text-brand-400">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Settings */}
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-brand-400">
            Order Settings
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Order Status</label>
              <select name="orderStatus" value={form.orderStatus} onChange={handleFormChange} className="input">
                <option className='bg-black/50' value="RECEIVED">Received</option>
                <option className='bg-black/50' value="PROCESSING">Processing</option>
                <option className='bg-black/50' value="READY">Ready</option>
                <option className='bg-black/50' value="DELIVERED">Delivered</option>
              </select>
            </div>
            <div>
              <label className="label">Payment Status</label>
              <select name="paymentStatus" value={form.paymentStatus} onChange={handleFormChange} className="input">
                <option className='bg-black/50' value="pending">Pending</option>
                <option className='bg-black/50' value="complete">Complete</option>
                <option className='bg-black/50' value="canceled">Canceled</option>
                <option className='bg-black/50' value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pb-8">
          <Link to="/orders" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading && <Spinner size="sm" />}
            {loading ? 'Creating...' : '✓ Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
