import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
export { AuthContext } from './AuthContextInstance';
import { AuthContext } from './AuthContextInstance';

// Set default axios config
axios.defaults.withCredentials = true;

// Use relative paths now that we have a Vite proxy
const API_BASE = ''; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Don't intercept refresh or login requests to avoid infinite loops
        if (originalRequest.url.includes('/api/auth/refresh') || originalRequest.url.includes('/api/auth/login')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await axios.post(`${API_BASE}/api/auth/refresh`);
            localStorage.setItem('token', data.token);
            originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
            setUser(prev => ({ ...prev, token: data.token }));
            return axios(originalRequest);
          } catch (err) {
            // Refresh failed, logout
            setUser(null);
            localStorage.removeItem('token');
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        let token = localStorage.getItem('token');
        
        // If no token, try to refresh immediately
        if (!token) {
          try {
            const { data } = await axios.post(`${API_BASE}/api/auth/refresh`);
            token = data.token;
            localStorage.setItem('token', token);
          } catch (err) {
            // No valid refresh token either
          }
        }

        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get(`${API_BASE}/api/auth/profile`, config);
          setUser({ ...data, token });
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });
      setUser(data);
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
        name,
        email,
        password,
        phone,
      });
      setUser(data);
      localStorage.setItem('token', data.token);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const googleLogin = async (tokenId) => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/google`, { tokenId });
      setUser(data);
      localStorage.setItem('token', data.token);
      toast.success('Google login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_BASE}/api/auth/forgotpassword`, { email });
      toast.success('Password reset email sent');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_BASE}/api/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      toast.info('Logged out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
