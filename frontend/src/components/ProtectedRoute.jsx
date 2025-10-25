import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component - Ensures user is authenticated before accessing route
 * @param {React.Component} children - The component to render if authenticated
 * @param {string} requiredRole - Optional role requirement ('admin' or 'cashier')
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Not authenticated - redirect to role selection page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check role if specified
  if (requiredRole && role !== requiredRole) {
    // User doesn't have required role - clear invalid session and redirect to role selection
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
