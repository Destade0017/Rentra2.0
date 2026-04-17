import React from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * PAUSED: Higher Order Component to protect routes
 * Currently allowing all access for development
 */
export const ProtectedRoute = ({ children }) => {
  // Always return children to bypass login
  return children;
};

/**
 * PAUSED: Higher Order Component for Role-Based Access Control
 * Currently allowing all roles for development
 */
export const RoleRoute = ({ children, allowedRoles }) => {
  // Always return children to bypass role checks
  return children;
};
