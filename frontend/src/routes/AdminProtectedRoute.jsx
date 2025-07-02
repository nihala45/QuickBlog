import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && user && user.is_superuser) {
    return children;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminProtectedRoute;
