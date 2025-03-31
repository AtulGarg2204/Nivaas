// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;