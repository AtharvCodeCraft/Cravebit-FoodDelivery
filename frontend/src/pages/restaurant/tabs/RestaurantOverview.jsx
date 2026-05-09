import { TrendingUp, ShoppingBag, DollarSign, XCircle, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-[var(--muted-foreground)] text-sm">{label}</p>
      <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>
    </div>
  </div>
);

const RestaurantOverview = ({ analytics }) => {
  if (!analytics) return <div className="text-center py-20 text-[var(--muted-foreground)]">Loading analytics...</div>;

  const maxRevenue = Math.max(...analytics.last7Days.map(d => d.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`₹${analytics.totalRevenue.toLocaleString()}`} color="bg-green-500" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={analytics.totalOrders} color="bg-blue-500" />
        <StatCard icon={Clock} label="Pending" value={analytics.pendingOrders} color="bg-orange-500" />
        <StatCard icon={TrendingUp} label="Preparing" value={analytics.preparingOrders} color="bg-purple-500" />
        <StatCard icon={CheckCircle} label="Delivered" value={analytics.deliveredOrders} color="bg-emerald-500" />
        <StatCard icon={XCircle} label="Cancelled" value={analytics.cancelledOrders} color="bg-red-500" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-bold mb-6">Revenue – Last 7 Days</h2>
        <div className="flex items-end gap-3 h-40">
          {analytics.last7Days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-[var(--muted-foreground)] font-bold">₹{day.revenue}</span>
              <div
                className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg transition-all duration-500"
                style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: day.revenue > 0 ? '8px' : '2px' }}
              />
              <span className="text-[10px] text-[var(--muted-foreground)] text-center leading-tight">{day.date.split(',')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-lg font-bold mb-4">🏆 Top Selling Items</h2>
        {analytics.topItems.length === 0
          ? <p className="text-[var(--muted-foreground)]">No data yet.</p>
          : analytics.topItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 font-black text-sm flex items-center justify-center">{i + 1}</span>
                <span className="font-semibold">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500">₹{item.revenue}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{item.count} sold</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default RestaurantOverview;
