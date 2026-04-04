import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../redux/slices/adminAuthSlice';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.adminAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(loginAdmin({ email, password }));
      if (loginAdmin.fulfilled.match(result)) {
        if (result.payload.data?.role === 'admin') {
          navigate('/admin');
        } else {
          toast.error('Access denied. Admin role required.');
        }
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="admin-login min-h-screen flex bg-gray-50">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10 bg-white shadow-2xl">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-agrolink-green to-agrolink-lightGreen rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                Agri<span className="text-agrolink-lightGreen">Link</span>
              </h1>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Portal</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 font-medium text-sm">Sign in to manage the agriculture marketplace.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agrolink.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-agrolink-green focus:bg-white focus:ring-2 focus:ring-agrolink-green/20 transition-all duration-300 text-gray-800 font-medium"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                   Password
                 </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-agrolink-green focus:bg-white focus:ring-2 focus:ring-agrolink-green/20 transition-all duration-300 text-gray-800 font-medium"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 mt-4 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-agrolink-green hover:bg-agrolink-darkGreen hover:shadow-agrolink-green/30'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Access Dashboard
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-xs font-medium">
              &copy; {new Date().getFullYear()} AgriLink Enterprise. Secure connection.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Image Background */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/auth-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-16">
          <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-widest text-[10px]">Secure Gateway</span>
          </div>
          <h3 className="text-white text-5xl font-black tracking-tight leading-tight mb-4">
            Manage your <br/> agribusiness efficiently.
          </h3>
          <p className="text-gray-300 text-lg font-medium max-w-md line-clamp-2">
            Oversee the agricultural marketplace, manage users, monitor analytics, and secure transactions through the definitive admin terminal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
