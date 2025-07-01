import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserLoginRedirect = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();
  console.log(location);
  console.log('AuthContext state:', isAuthenticated, user);

  if (isAuthenticated && user && !user.is_superuser) {
    return <Navigate to="/" />;
  } else if (isAuthenticated && user && user.is_superuser) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default UserLoginRedirect;
