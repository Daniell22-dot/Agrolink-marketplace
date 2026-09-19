import React from 'react';

const AdminHeader = () => {
  return (
    <header className="admin-header bg-white border-b border-[#D5D9D9]">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#0E3D2B]">Agri<span className="text-[#C89B3C]">Link</span> <span className="text-sm font-normal text-slate-500 ml-2">Admin</span></h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-lg border border-[#D5D9D9] focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm bg-[#F4F4F4]"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center space-x-2 relative">
            <button className="p-2 rounded-full hover:bg-[#F0F1F2] text-slate-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="w-9 h-9 rounded-full bg-[#0E3D2B] flex items-center justify-center hover:bg-[#C89B3C] transition-colors">
              <span className="text-white text-sm font-semibold">A</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
