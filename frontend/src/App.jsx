import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import TopBar from './components/layout/TopBar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Properties from './pages/Properties.jsx';
import Tenants from './pages/Tenants.jsx';
import TenantDetails from './pages/TenantDetails.jsx';
import SmartAssistant from './pages/SmartAssistant.jsx';
import Payments from './pages/Payments.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Messages from './pages/Messages.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import TenantDashboard from './pages/TenantDashboard.jsx';
import { ProtectedRoute, RoleRoute } from './components/auth/ProtectedRoutes.jsx';
import { useAuthStore } from './store/useAuthStore.js';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes Wrapper */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-[#F5F7FA]">
                <Sidebar />
                <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                  <TopBar />
                  <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
                    <Routes>
                      {/* Landlord Routes */}
                      <Route 
                        path="/" 
                        element={
                          <RoleRoute allowedRoles={['landlord']}>
                            <Dashboard />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/properties" 
                        element={
                          <RoleRoute allowedRoles={['landlord']}>
                            <Properties />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/tenants" 
                        element={
                          <RoleRoute allowedRoles={['landlord']}>
                            <Tenants />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/tenants/:id" 
                        element={
                          <RoleRoute allowedRoles={['landlord']}>
                            <TenantDetails />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/assistant" 
                        element={
                          <RoleRoute allowedRoles={['landlord']}>
                            <SmartAssistant />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/payments" 
                        element={
                          <RoleRoute allowedRoles={['landlord']}>
                            <Payments />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/maintenance" 
                        element={
                          <RoleRoute allowedRoles={['landlord']}>
                            <Maintenance />
                          </RoleRoute>
                        } 
                      />

                      {/* Tenant Routes */}
                      <Route 
                        path="/tenant-dashboard" 
                        element={
                          <RoleRoute allowedRoles={['tenant']}>
                            <TenantDashboard />
                          </RoleRoute>
                        } 
                      />

                      {/* Shared Routes */}
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/settings" element={<Settings />} />
                      
                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
