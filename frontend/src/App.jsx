import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './redux/store';
import { fetchImageCatalog } from './redux/slices/productSlice';
import { organizationStructuredData, websiteStructuredData } from './components/seo/SEO';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AnnouncementBar from './components/common/AnnouncementBar';
import CookieBanner from './components/common/CookieBanner';
import SupportChat from './components/common/SupportChat';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DashboardPage from './pages/DashboardPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AgentDashboardPage from './pages/AgentDashboardPage';
import AgentJobPage from './pages/AgentJobPage';
import AgentEarningsPage from './pages/AgentEarningsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PricingPage from './pages/PricingPage';
import StatusPage from './pages/StatusPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import WishlistPage from './pages/WishlistPage';
import CategoryPage from './pages/CategoryPage';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';
import AgentRoute from './components/common/AgentRoute';

import './App.css';

// Fetches the API-driven image catalog once on startup (falls back to the
// bundled mirror catalog automatically if the API is unavailable)
function AppInit() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchImageCatalog());
  }, [dispatch]);
  return null;
}

function App() {
  const helmetContext = {};

  return (
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <AppInit />
        <Router>
          <div className="App">
            <AnnouncementBar />
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/product/:id/:slug?" element={<ProductDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/order/:id" element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Agent Routes */}
              <Route path="/agent" element={
                <AgentRoute>
                  <AgentDashboardPage />
                </AgentRoute>
              } />
              <Route path="/agent/job/:id" element={
                <AgentRoute>
                  <AgentJobPage />
                </AgentRoute>
              } />
              <Route path="/agent/earnings" element={
                <AgentRoute>
                  <AgentEarningsPage />
                </AgentRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <CookieBanner />
          <SupportChat />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
