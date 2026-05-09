import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Menu from './pages/Menu';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import FoodDetails from './pages/FoodDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import RestaurantRoute from './components/RestaurantRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Dashboard />} /> {/* Dashboard acts as Orders page */}
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Restaurant Routes */}
          <Route path="/restaurant/dashboard" element={
            <RestaurantRoute>
              <RestaurantDashboard />
            </RestaurantRoute>
          } />
          {/* Add more routes here */}
        </Routes>
      </main>
      <Footer />
      <FloatingCart />
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        theme="colored"
        toastClassName="bg-[var(--card)] text-[var(--foreground)] shadow-xl rounded-xl border border-[var(--border)]" 
      />
    </div>
  );
}

export default App;
