import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="admin-footer bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm">
            © 2026 AgriLink Admin Panel. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#support" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
