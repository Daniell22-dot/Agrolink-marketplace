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
    <div className="admin-login min-h-screen bg-gradient-to-br from-agrolink-green to-agrolink-darkGreen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black text-white mb-2 tracking-tighter">
            Agri<span className="text-agrolink-orange">Link</span>
          </h1>
          <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-sm font-bold text-white uppercase tracking-widest">Administrative Portal</span>
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-agrolink-green to-agrolink-orange"></div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mb-10 font-medium">Please enter your credentials to access the dashboard.</p>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest">
                Admin Email
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agrolink.com"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-agrolink-green focus:bg-white transition-all duration-300 text-gray-800 font-medium text-lg leading-tight"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-agrolink-green focus:bg-white transition-all duration-300 text-gray-800 font-medium text-lg leading-tight"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-10 py-5 px-6 rounded-2xl font-black text-white transition-all duration-300 transform active:scale-[0.98] shadow-xl group overflow-hidden relative ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-agrolink-green hover:bg-agrolink-darkGreen'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center text-lg uppercase tracking-wider">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Secure Login
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-center text-white/40 mb-4 bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">End-to-End Encrypted Access</span>
          </div>
          <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest text-center">
            &copy; {new Date().getFullYear()} AgriLink Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
