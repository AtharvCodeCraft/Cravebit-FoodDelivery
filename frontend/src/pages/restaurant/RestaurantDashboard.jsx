import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, TrendingUp, Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import RestaurantOverview from './tabs/RestaurantOverview';
import RestaurantMenu from './tabs/RestaurantMenu';
import RestaurantOrders from './tabs/RestaurantOrders';
import RestaurantProfile from './tabs/RestaurantProfile';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'profile', label: 'Profile', icon: Settings },
];

const RestaurantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('overview');
  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const token = user?.token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch restaurant
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/restaurants', config);
        if (data.length > 0) {
          const r = data[0];
          setRestaurant(r);
          const [ana, ord, men] = await Promise.all([
            axios.get(`http://localhost:5000/api/restaurant-mgmt/${r._id}/analytics`, config),
            axios.get(`http://localhost:5000/api/restaurant-mgmt/${r._id}/orders`, config),
            axios.get(`http://localhost:5000/api/restaurant-mgmt/${r._id}/menu`, config),
          ]);
          setAnalytics(ana.data);
          setOrders(ord.data);
          setMenu(men.data);
        }
      } catch (e) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  // Real-time order notifications
  useEffect(() => {
    if (!restaurant) return;
    const socket = io('http://localhost:5000');
    socket.on('new_order', (order) => {
      if (order.restaurantId === restaurant._id) {
        setOrders(prev => [order, ...prev]);
        setNewOrderCount(c => c + 1);
        toast.info('🍽️ New order received!', { autoClose: 5000 });
      }
    });
    socket.on('order_status_update', ({ orderId, status }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    });
    return () => socket.disconnect();
  }, [restaurant]);

  const handleTabClick = (id) => {
    setTab(id);
    if (id === 'orders') setNewOrderCount(0);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-orange-500" />
    </div>
  );

  if (!restaurant) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[var(--foreground)]">
      <TrendingUp className="w-16 h-16 text-orange-400 mb-4" />
      <h2 className="text-2xl font-bold">No Restaurant Found</h2>
      <p className="text-[var(--muted-foreground)] mt-2">Create a restaurant first to use the dashboard.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-6 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Restaurant Dashboard</p>
            <h1 className="text-3xl font-black">{restaurant.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${restaurant.isActive ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
              {restaurant.isActive ? '● Open' : '● Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--card)] sticky top-20 z-40">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${
                tab === id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === 'orders' && newOrderCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {newOrderCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {tab === 'overview' && <RestaurantOverview analytics={analytics} />}
        {tab === 'menu' && <RestaurantMenu restaurant={restaurant} menu={menu} setMenu={setMenu} token={token} />}
        {tab === 'orders' && <RestaurantOrders restaurant={restaurant} orders={orders} setOrders={setOrders} token={token} />}
        {tab === 'profile' && <RestaurantProfile restaurant={restaurant} setRestaurant={setRestaurant} token={token} />}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
