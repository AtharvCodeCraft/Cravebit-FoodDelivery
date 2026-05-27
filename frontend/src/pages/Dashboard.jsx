import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Clock, MapPin, Truck, CheckCircle, History } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import ActiveOrderTracker from '../components/ActiveOrderTracker';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const endpoint = '/api/orders/myorders';
        const { data } = await axios.get(endpoint, config);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    // Request notification permission for true push notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const socket = io(); // Connects to same origin (proxy will handle)

    // Subscribe to specific order rooms if user
    if (user.role === 'user' && orders.length > 0) {
      orders.forEach(order => {
        if (['Placed', 'Preparing', 'Out for Delivery'].includes(order.orderStatus)) {
          socket.emit('join_order_room', order._id);
        }
      });
    }

    socket.on('order_status_update', (data) => {
      const msg = `Order #${data.orderId.substring(18)} status updated: ${data.status}`;
      toast.info(msg, {
        icon: '🚀',
        style: { borderRadius: '16px', background: '#fff3ea', color: '#ea580c', fontWeight: '600' }
      });
      
      // True Browser Push Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('CraveBite Update', {
          body: msg,
          icon: '/apple-touch-icon.png'
        });
      }

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId ? { ...order, orderStatus: data.status } : order
        )
      );
    });

    socket.on('new_order', (order) => {
      // Customers do not see new orders globally
    });

    return () => {
      socket.disconnect();
    };
  }, [user, orders.length]);

  if (loading) {
    return <div className="text-center mt-20">Loading dashboard...</div>;
  }

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

  const activeOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
  const pastOrders = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Track your recent food orders and manage your profile.
          </p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex space-x-8 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-4 px-2 font-bold text-lg transition-colors flex items-center gap-2 ${
            activeTab === 'active' 
              ? 'text-orange-600 border-b-2 border-orange-600' 
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Truck className="w-5 h-5" /> Active Orders
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{activeOrders.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-4 px-2 font-bold text-lg transition-colors flex items-center gap-2 ${
            activeTab === 'past' 
              ? 'text-orange-600 border-b-2 border-orange-600' 
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <History className="w-5 h-5" /> Previous Orders
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{pastOrders.length}</span>
        </button>
      </div>

      {/* Active Orders Section */}
      {activeTab === 'active' && (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2 flex items-center gap-2">
          <Truck className="w-6 h-6 text-orange-500" /> Active Orders
        </h2>
        
        {activeOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active orders right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {activeOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-50 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900">Order #{order._id.substring(18)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-4">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="font-bold text-2xl text-orange-600">₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item._id || item.foodItemId} className="flex justify-between text-sm text-gray-600">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}<br/>
                          {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* New Live Tracking Map Integration */}
                <ActiveOrderTracker order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Previous Orders Section */}
      {activeTab === 'past' && (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2 flex items-center gap-2">
          <History className="w-6 h-6 text-gray-500" /> Previous Orders
        </h2>
        
        {pastOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-gray-100">
            <p className="text-gray-500">No previous orders found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pastOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-50 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900">Order #{order._id.substring(18)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-4">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="font-bold text-2xl text-gray-900">₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item._id || item.foodItemId} className="flex justify-between text-sm text-gray-600">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}<br/>
                          {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Dashboard;
