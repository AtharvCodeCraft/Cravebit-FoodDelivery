import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, LayoutDashboard, Settings, ShoppingBag, Store, AlertCircle, Package, Clock, MapPin, Truck } from 'lucide-react';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/orders', config);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching admin orders', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = io('http://localhost:5000');

    socket.on('new_order', (order) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on('order_status_update', (data) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId ? { ...order, orderStatus: data.status } : order
        )
      );
    });

    return () => socket.disconnect();
  }, [user]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status }, { 
         headers: { Authorization: `Bearer ${user.token}` } 
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (err) {
      console.error(err);
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

  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Orders', icon: ShoppingBag },
    { name: 'Users', icon: Users },
    { name: 'Restaurants', icon: Store },
    { name: 'Complaints', icon: AlertCircle },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-sm z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold justify-center items-center gap-2 flex text-gray-800">
             Admin Panel
          </h2>
          <p className="text-xs text-center text-gray-500 mt-1">Full System Control</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.name
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.name ? 'text-red-500' : 'text-gray-400'}`} />
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{activeTab}</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Welcome back, {user?.name}. Here is what's happening with Cravebit today.
            </p>
          </header>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
             {activeTab === 'Orders' ? (
                loadingOrders ? (
                  <div className="text-center py-10">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No orders found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
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
                              <span className="flex items-center gap-1 text-gray-700 font-medium"><MapPin className="w-4 h-4 text-gray-400" /> {order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
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
                            <h4 className="font-semibold text-gray-900 mb-2">Manage Order</h4>
                            
                            {/* Admin Order Controls */}
                            {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' ? (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-3">Update this order's status and the customer will be notified live.</p>
                                <div className="flex flex-wrap gap-2">
                                  {order.orderStatus === 'Placed' && (
                                      <button 
                                        onClick={() => updateOrderStatus(order._id, 'Preparing')}
                                        className="text-sm bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl hover:bg-yellow-200 transition-colors font-bold shadow-sm">
                                        Mark Preparing
                                      </button>
                                  )}
                                  {order.orderStatus === 'Preparing' && (
                                      <button 
                                        onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                                        className="text-sm bg-orange-100 text-orange-800 px-4 py-2 rounded-xl hover:bg-orange-200 transition-colors font-bold shadow-sm">
                                        Out for Delivery
                                      </button>
                                  )}
                                  {order.orderStatus === 'Out for Delivery' && (
                                      <button 
                                        onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                        className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-xl hover:bg-green-200 transition-colors font-bold shadow-sm">
                                        Mark Delivered
                                      </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2 italic">This order is completed and no longer active.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
             ) : (
                <div className="text-center text-gray-400 flex flex-col justify-center items-center h-full pt-10">
                  <Settings className="w-16 h-16 mx-auto mb-4 opacity-50 animate-spin-slow" />
                  <p className="text-lg font-medium text-gray-600">The <strong>{activeTab}</strong> module is currently under construction.</p>
                  <p className="text-sm mt-2">More features for {activeTab.toLowerCase()} management will be added soon.</p>
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
