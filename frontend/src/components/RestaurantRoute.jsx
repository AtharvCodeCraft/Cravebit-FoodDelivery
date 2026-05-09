import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RestaurantRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user && (user.role === 'admin' || user.role === 'restaurant')
    ? children
    : <Navigate to="/login" replace />;
};

export default RestaurantRoute;
