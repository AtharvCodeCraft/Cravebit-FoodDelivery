import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password, phone);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[var(--background)] transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10"></div>
      <div className="absolute top-10 -left-20 w-80 h-80 bg-orange-500/20 rounded-full filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-[var(--card)] p-10 rounded-3xl shadow-2xl relative z-10 border border-[var(--border)]"
      >
        <div>
          <h2 className="mt-2 text-center text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            Create an Account
          </h2>
          <p className="mt-3 text-center text-sm text-[var(--muted-foreground)]">
            Join thousands of foodies today.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-1">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[var(--muted)] border-transparent text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-[var(--card)] focus:shadow-md sm:text-sm transition-all duration-300 placeholder-[var(--muted-foreground)]"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[var(--muted)] border-transparent text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-[var(--card)] focus:shadow-md sm:text-sm transition-all duration-300 placeholder-[var(--muted-foreground)]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-1">Phone Number</label>
              <input
                type="tel"
                className="appearance-none relative block w-full px-4 py-3 bg-[var(--muted)] border-transparent text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-[var(--card)] focus:shadow-md sm:text-sm transition-all duration-300 placeholder-[var(--muted-foreground)]"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="appearance-none relative block w-full px-4 py-3 bg-[var(--muted)] border-transparent text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-[var(--card)] focus:shadow-md sm:text-sm transition-all duration-300 placeholder-[var(--muted-foreground)]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              Sign Up
            </button>
          </div>
          
          <div className="text-center mt-4">
            <span className="text-sm text-[var(--muted-foreground)]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-orange-500 hover:text-orange-400 transition-colors">
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
