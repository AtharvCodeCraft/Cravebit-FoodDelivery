import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu as MenuIcon, Search, Sun, Moon, Utensils, X, Package, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-orange-500 to-red-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-orange-500/30">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 tracking-tight hidden sm:block">
                CraveBite
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted-foreground)] group-focus-within:text-orange-500 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-2.5 bg-[var(--muted)] border-transparent text-[var(--foreground)] rounded-2xl leading-5 placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-[var(--card)] sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-md"
                placeholder="Search for restaurants, dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div id="google_translate_element" className="mr-2"></div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            <Link to="/menu" className="text-[var(--foreground)] hover:text-orange-500 font-semibold transition-colors">
              Menu
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                {user.role !== 'admin' && (
                  <Link to="/cart" className="relative group p-2">
                    <ShoppingCart className="w-6 h-6 text-[var(--foreground)] group-hover:text-orange-500 transition-colors" />
                    {cartCount > 0 && (
                      <span className="absolute 0 right-0 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm ring-2 ring-[var(--card)] group-hover:scale-110 transition-transform">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative ml-4 pl-4 border-l border-[var(--border)]">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className="flex items-center space-x-3 text-left focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--foreground)] leading-tight">
                        {user.name}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-48 bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden z-50"
                      >
                        {user.role === 'admin' ? (
                          <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-orange-500 transition-colors">
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        ) : (
                          <>
                            <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-orange-500 transition-colors">
                              <User className="w-4 h-4" /> Profile
                            </Link>
                            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-orange-500 transition-colors">
                              <Package className="w-4 h-4" /> Orders
                            </Link>
                          </>
                        )}
                        <div className="border-t border-[var(--border)]">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="text-[var(--foreground)] hover:text-orange-500 font-semibold transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu controls */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--card)] border-b border-[var(--border)] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--muted)] text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <Link 
                to="/menu" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[var(--foreground)] hover:text-orange-500 hover:bg-[var(--muted)] transition-colors"
              >
                Menu
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-[var(--foreground)] hover:text-orange-500 hover:bg-[var(--muted)] transition-colors"
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-[var(--foreground)] hover:text-orange-500 hover:bg-[var(--muted)] transition-colors"
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-[var(--foreground)] hover:text-orange-500 hover:bg-[var(--muted)] transition-colors"
                      >
                        Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50/10 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border)]">
                  <Link 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-3 border border-[var(--border)] text-[var(--foreground)] rounded-xl font-bold hover:bg-[var(--muted)] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-colors shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
