import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../redux/slices/adminAuthSlice';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '' },
    { path: '/admin/users', label: 'Users', icon: '' },
    { path: '/admin/products', label: 'Products', icon: '' },
    { path: '/admin/orders', label: 'Orders', icon: '' },
    { path: '/admin/reports', label: 'Reports', icon: '' },
    { path: '/admin/analytics', label: 'Analytics', icon: '' },
    { path: '/admin/settings', label: 'Settings', icon: '' }
  ];

  const isActive = (path) => location.pathname === path ? 'bg-agrolink-green text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800';

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  return (
    <aside className={`admin-sidebar bg-gray-900 text-white transition-all duration-300 relative ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        {isOpen && <h2 className="text-2xl font-bold tracking-tight text-agrolink-green">AgriLink</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="mt-8 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)}`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all duration-300 font-bold group"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
