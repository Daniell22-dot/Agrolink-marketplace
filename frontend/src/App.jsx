import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { store } from './redux/store';
import { fetchImageCatalog } from './redux/slices/productSlice';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AnnouncementBar from './components/common/AnnouncementBar';
import CookieBanner from './components/common/CookieBanner';

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
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PricingPage from './pages/PricingPage';
import StatusPage from './pages/StatusPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import WishlistPage from './pages/WishlistPage';
import CategoryPage from './pages/CategoryPage';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

import './App.css';

const SITE_URL = 'https://agrolink.co.ke';
const SITE_NAME = 'AgroLink';

const PageHelmet = ({ title, description, path }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={`${SITE_URL}${path}`} />
    <meta property="og:url" content={`${SITE_URL}${path}`} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </Helmet>
);

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
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AppInit />
        <Router>
          <div className="App">
            <AnnouncementBar />
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <>
                    <PageHelmet
                      title={`${SITE_NAME} - Kenya's Agricultural Marketplace`}
                      description="Buy and sell fresh farm produce, livestock, dairy, seeds, fertilizers, and farm tools directly from verified farmers across Kenya."
                      path="/"
                    />
                    <HomePage />
                  </>
                } />
                <Route path="/login" element={
                  <>
                    <PageHelmet title="Login - AgroLink" description="Login to your AgroLink account to buy and sell farm produce." path="/login" />
                    <LoginPage />
                  </>
                } />
                <Route path="/register" element={
                  <>
                    <PageHelmet title="Register - AgroLink" description="Create an AgroLink account to start buying and selling farm produce online." path="/register" />
                    <RegisterPage />
                  </>
                } />
                <Route path="/products" element={
                  <>
                    <PageHelmet title="Products - AgroLink" description="Browse fresh farm produce, grains, vegetables, fruits, livestock, and farm inputs on AgroLink." path="/products" />
                    <ProductsPage />
                  </>
                } />
                <Route path="/services" element={
                  <>
                    <PageHelmet title="Services - AgroLink" description="Explore farm services including logistics, advisory, inputs, and equipment on AgroLink." path="/services" />
                    <ServicesPage />
                  </>
                } />
                <Route path="/product/:id" element={
                  <>
                    <PageHelmet title="Product Details - AgroLink" description="View product details, pricing, and seller information on AgroLink." path="/product/:id" />
                    <ProductDetailPage />
                  </>
                } />
                <Route path="/about" element={
                  <>
                    <PageHelmet title="About Us - AgroLink" description="Learn about AgroLink, Kenya's agricultural marketplace connecting farmers to markets and services." path="/about" />
                    <AboutPage />
                  </>
                } />
                <Route path="/contact" element={
                  <>
                    <PageHelmet title="Contact Us - AgroLink" description="Get in touch with AgroLink support for questions about buying and selling farm produce." path="/contact" />
                    <ContactPage />
                  </>
                } />
                <Route path="/how-it-works" element={
                  <>
                    <PageHelmet title="How It Works - AgroLink" description="Learn how to buy and sell farm produce on AgroLink in simple steps." path="/how-it-works" />
                    <HowItWorksPage />
                  </>
                } />
                <Route path="/pricing" element={
                  <>
                    <PageHelmet title="Pricing - AgroLink" description="View AgroLink pricing plans for farmers, buyers, and sellers." path="/pricing" />
                    <PricingPage />
                  </>
                } />
                <Route path="/status" element={
                  <>
                    <PageHelmet title="System Status - AgroLink" description="Check AgroLink system status and uptime." path="/status" />
                    <StatusPage />
                  </>
                } />
                <Route path="/faq" element={
                  <>
                    <PageHelmet title="FAQ - AgroLink" description="Find answers to frequently asked questions about AgroLink marketplace." path="/faq" />
                    <FaqPage />
                  </>
                } />
                <Route path="/terms" element={
                  <>
                    <PageHelmet title="Terms & Conditions - AgroLink" description="Read AgroLink terms and conditions for using the agricultural marketplace." path="/terms" />
                    <TermsPage />
                  </>
                } />
                <Route path="/wishlist" element={
                  <>
                    <PageHelmet title="Wishlist - AgroLink" description="View your saved farm products on AgroLink." path="/wishlist" />
                    <WishlistPage />
                  </>
                } />
                <Route path="/category/:slug" element={
                  <>
                    <PageHelmet title="Category - AgroLink" description="Browse farm produce by category on AgroLink." path="/category/:slug" />
                    <CategoryPage />
                  </>
                } />

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

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <CookieBanner />
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
