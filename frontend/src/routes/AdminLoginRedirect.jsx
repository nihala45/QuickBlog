import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLoginRedirect = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  console.log(isAuthenticated, user);

  if (isAuthenticated && user?.is_superuser) {
    console.log("Redirecting superuser to admin home");
    return <Navigate to="/admin" replace />;
  } else if (isAuthenticated && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminLoginRedirect;
