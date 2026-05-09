import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Store, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminOverview = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
        setData(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading statistics...</div>;
  if (!data) return <div className="text-center py-10">No data available.</div>;

  const { stats, dailyStats, recentActivity } = data;

  const lineChartData = {
    labels: dailyStats.map(s => s.date),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: dailyStats.map(s => s.revenue),
        fill: true,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: dailyStats.map(s => s.date),
    datasets: [
      {
        label: 'Orders',
        data: dailyStats.map(s => s.orders),
        backgroundColor: '#f97316',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue}`} 
          icon={DollarSign} 
          color="bg-red-500" 
          trend={12.5} 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-orange-500" 
          trend={8.2} 
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-blue-500" 
          trend={5.4} 
        />
        <StatCard 
          title="Restaurants" 
          value={stats.totalRestaurants} 
          icon={Store} 
          color="bg-green-500" 
          trend={2.1} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Revenue Trends</h3>
            <div className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">Last 7 Days</div>
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Order Volume</h3>
            <div className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">Last 7 Days</div>
          </div>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
          <button className="text-red-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActivity.map((activity) => (
            <div key={activity._id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  New order from {activity.userId?.name || 'Customer'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Order ID: #{activity._id.substring(18)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">₹{activity.totalAmount}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 justify-end">
                  <Clock className="w-3 h-3" /> {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="p-10 text-center text-gray-400">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
