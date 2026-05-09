import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, MapPin, Search, Filter, CheckCircle, Truck, XCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const AdminOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
    
    const socket = io('http://localhost:5000');
    socket.on('new_order', (order) => {
      setOrders(prev => [order, ...prev]);
      toast.info('New order received!');
    });

    socket.on('order_status_update', (data) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId ? { ...order, orderStatus: data.status } : order
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status }, config);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Placed': 'bg-blue-100 text-blue-800',
      'Preparing': 'bg-yellow-100 text-yellow-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.deliveryAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Order ID or city..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5" />
          Filter Status
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-50 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-gray-900 text-lg">Order #{order._id.substring(18)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(order.createdAt).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 text-right">
                <p className="font-bold text-2xl text-red-600">₹{order.totalAmount}</p>
                <p className="text-xs text-gray-500">{order.items.length} items • {order.paymentMethod || 'COD'}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                           {item.quantity}x
                         </div>
                         <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-72 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Status Control</h4>
                
                {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' ? (
                  <div className="space-y-2">
                    {order.orderStatus === 'Placed' && (
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Preparing')}
                          className="w-full flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 border border-yellow-100 py-2.5 rounded-xl hover:bg-yellow-100 transition-colors font-bold text-sm">
                          <Package className="w-4 h-4" /> Start Preparing
                        </button>
                    )}
                    {order.orderStatus === 'Preparing' && (
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                          className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-700 border border-orange-100 py-2.5 rounded-xl hover:bg-orange-100 transition-colors font-bold text-sm">
                          <Truck className="w-4 h-4" /> Out for Delivery
                        </button>
                    )}
                    {order.orderStatus === 'Out for Delivery' && (
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Delivered')}
                          className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-100 py-2.5 rounded-xl hover:bg-green-100 transition-colors font-bold text-sm">
                          <CheckCircle className="w-4 h-4" /> Mark Delivered
                        </button>
                    )}
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                      className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-600 py-2 rounded-xl transition-colors font-medium text-xs mt-2">
                      <XCircle className="w-4 h-4" /> Cancel Order
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <CheckCircle className={`w-8 h-8 mb-2 ${order.orderStatus === 'Delivered' ? 'text-green-500' : 'text-gray-300'}`} />
                    <p className="text-xs text-gray-500 font-medium italic">Order {order.orderStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
