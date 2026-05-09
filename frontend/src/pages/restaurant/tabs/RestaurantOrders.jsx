import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Clock, MapPin, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

const STATUS_COLORS = {
  Placed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Preparing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Out for Delivery': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const NEXT_STATUS = {
  Placed: ['Preparing', 'Cancelled'],
  Preparing: ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered'],
};

const RestaurantOrders = ({ restaurant, orders, setOrders, token }) => {
  const [filter, setFilter] = useState('All');
  const [updating, setUpdating] = useState(null);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await axios.put(
        `http://localhost:5000/api/restaurant-mgmt/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const filters = ['All', 'Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">Orders <span className="text-[var(--muted-foreground)] font-normal text-base">({filtered.length})</span></h2>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-orange-500 text-white shadow-md' : 'bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-orange-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-[var(--muted-foreground)] text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order._id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-[var(--foreground)]">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1 flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleString()}</span>
                    {order.userId && <span className="font-medium text-[var(--foreground)]">{order.userId.name}</span>}
                  </div>
                </div>
                <p className="text-2xl font-black text-orange-500">₹{order.totalAmount}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold text-[var(--muted-foreground)] mb-2 uppercase tracking-wide">Items</p>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="text-[var(--foreground)]">{item.quantity}× {item.name}</span>
                        <span className="text-[var(--muted-foreground)]">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--muted-foreground)] mb-2 uppercase tracking-wide">Delivery</p>
                  <p className="text-sm text-[var(--foreground)] flex items-start gap-1">
                    <MapPin className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" />
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Payment: {order.paymentMethod}</p>
                </div>
              </div>

              {NEXT_STATUS[order.orderStatus] && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
                  {NEXT_STATUS[order.orderStatus].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order._id, status)}
                      disabled={updating === order._id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${
                        status === 'Cancelled'
                          ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {status === 'Cancelled' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      {updating === order._id ? 'Updating...' : status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
