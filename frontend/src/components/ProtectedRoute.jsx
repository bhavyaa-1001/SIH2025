import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute component modified to allow public access
 * No longer redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // If still loading auth state, show loading indicator
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Allow access to all users, whether authenticated or not
  return children;
};

export default ProtectedRoute;