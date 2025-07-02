import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLoginRedirect = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && user && user.is_superuser) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminLoginRedirect;
