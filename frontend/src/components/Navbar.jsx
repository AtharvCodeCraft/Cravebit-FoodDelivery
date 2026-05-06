import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu as MenuIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 tracking-tight">
              CraveBite
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/menu" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
              Menu
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                {user.role !== 'admin' && (
                  <Link to="/cart" className="relative text-gray-600 hover:text-orange-500 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-orange-500" />
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && user.role !== 'admin' && (
              <Link to="/cart" className="relative text-gray-600 mr-4">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button className="text-gray-600 hover:text-orange-500 focus:outline-none">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
