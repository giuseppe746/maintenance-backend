// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";


const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default ProtectedRoute;
