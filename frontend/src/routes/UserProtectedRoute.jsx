import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && user && !user.is_superuser) {
    return children;
  } else if (isAuthenticated && user && user.is_superuser) {
    return <Navigate to="/admin/home" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default UserProtectedRoute;
