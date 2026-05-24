import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Clock, MapPin, Truck, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const OrderTracker = ({ status }) => {
  const stages = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStageIndex = stages.indexOf(status);
  
  if (status === 'Cancelled') return (
    <div className="text-red-500 font-medium text-sm flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-red-500"></div> Order Cancelled
    </div>
  );
  if (currentStageIndex === -1) return null;

  return (
    <div className="w-full mt-2">
      <div className="relative">
        <div className="absolute top-3 left-0 w-full h-1 bg-gray-100 rounded-full z-0"></div>
        <div 
          className="absolute top-3 left-0 h-1 bg-orange-500 rounded-full z-0 transition-all duration-700 ease-in-out"
          style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
        ></div>
        
        <div className="relative z-10 flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            return (
              <div key={stage} className="flex flex-col items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors duration-500 ${
                    isCompleted 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200' 
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs font-semibold ${isCurrent ? 'text-orange-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <div className="grid grid-cols-1 gap-6">
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        ) : (
          orders.map((order) => (
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

              <div className="mt-8 border-t border-gray-50 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" /> Live Tracking
                </h4>
                <OrderTracker status={order.orderStatus} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
