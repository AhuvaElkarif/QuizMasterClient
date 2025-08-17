import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protects routes, redirecting to login if user not authenticated
 */
export const RequireAuth: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};