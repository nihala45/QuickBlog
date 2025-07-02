import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && user && !user.is_superuser) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default UserProtectedRoute;