import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  console.log('admin home protected', isAuthenticated, user);

  if (!isAuthenticated || !user || !user.is_superuser) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminProtectedRoute;