import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  Users, 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Settings, 
  CreditCard, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Package
} from 'lucide-react';

// Components
import AdminOverview from './components/AdminOverview';
import AdminUsers from './components/AdminUsers';
import AdminRestaurants from './components/AdminRestaurants';
import AdminFoodItems from './components/AdminFoodItems';
import AdminOrders from './components/AdminOrders';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'Overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'Orders', name: 'Manage Orders', icon: ShoppingBag },
    { id: 'Users', name: 'Users List', icon: Users },
    { id: 'Restaurants', name: 'Restaurants', icon: Store },
    { id: 'FoodItems', name: 'Menu Items', icon: Package },
    { id: 'Payments', name: 'Payments', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <AdminOverview user={user} />;
      case 'Users':
        return <AdminUsers user={user} />;
      case 'Restaurants':
        return <AdminRestaurants user={user} />;
      case 'FoodItems':
        return <AdminFoodItems user={user} />;
      case 'Orders':
        return <AdminOrders user={user} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-10 h-10 text-gray-400 animate-spin-slow" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Module Under Construction</h2>
            <p className="text-gray-500 mt-2 max-w-xs">We're working hard to bring you the {activeTab} management features.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cravebit</h1>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Admin Central</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                  ${activeTab === tab.id 
                    ? 'bg-red-50 text-red-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="font-semibold text-sm">{tab.name}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600" />
                )}
              </button>
            ))}

            <div className="pt-8 mt-8 border-t border-slate-100">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">System</p>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold text-sm">
                <Settings className="w-5 h-5 text-slate-400" />
                <span>Settings</span>
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-semibold text-sm mt-1"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* User Profile Mini */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-96 focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-200 transition-all">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm text-slate-900 w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {tabs.find(t => t.id === activeTab)?.name}
                </h2>
                <p className="text-slate-500 mt-1 font-medium">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  Export Data
                </button>
                <button className="px-5 py-2.5 bg-red-600 rounded-xl text-sm font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                  New Report
                </button>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
