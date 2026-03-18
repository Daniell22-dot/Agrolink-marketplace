import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/adminStore';
import { verifyAdminToken } from './redux/slices/adminAuthSlice';

// Layout
import AdminLayout from './components/layout/AdminLayout';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';
import ManageReports from './pages/ManageReports';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Auth Page
import AdminLoginPage from './pages/AdminLoginPage';

// Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.adminAuth);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

// Main App Component
function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, isVerifying } = useSelector(state => state.adminAuth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(verifyAdminToken());
    }
  }, [dispatch, token, isAuthenticated]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen bg-agrolink-green">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Securing Connection...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Routes */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/products" element={
            <AdminProtectedRoute>
              <ManageProducts />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/orders" element={
            <AdminProtectedRoute>
              <ManageOrders />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/reports" element={
            <AdminProtectedRoute>
              <ManageReports />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/analytics" element={
            <AdminProtectedRoute>
              <AnalyticsPage />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <AdminProtectedRoute>
              <SettingsPage />
            </AdminProtectedRoute>
          } />

          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* 404 Route */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a href="/admin" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  Go to Dashboard
                </a>
              </div>
            </div>
          } />
        </Routes>

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
            },
            success: {
              background: '#d1fae5',
              color: '#065f46',
            },
            error: {
              background: '#fee2e2',
              color: '#7f1d1d',
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
