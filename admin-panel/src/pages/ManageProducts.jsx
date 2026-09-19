import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts, approveProduct, rejectProduct, suspendProduct, fetchCategories } from '../redux/slices/productsSlice';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { products, pagination, isLoading } = useSelector(state => state.adminProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    dispatch(fetchAdminProducts({
      page: pagination.page,
      limit: pagination.limit,
      status: statusFilter,
      search: searchTerm
    }));
    dispatch(fetchCategories());
  }, [dispatch, pagination.page, pagination.limit, statusFilter, searchTerm]);

  const handleApprove = (productId) => {
    if (window.confirm('Are you sure you want to approve this product?')) {
      dispatch(approveProduct(productId));
    }
  };

  const handleReject = (product) => {
    setSelectedProduct(product);
    setShowRejectModal(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    dispatch(rejectProduct({ productId: selectedProduct.id, reason: rejectReason }));
    setShowRejectModal(false);
    setRejectReason('');
  };

  const handleSuspend = (product) => {
    if (window.confirm(`Are you sure you want to suspend "${product.name}"?`)) {
      dispatch(suspendProduct({ productId: product.id, reason: 'Admin suspended' }));
    }
  };

  const handleView = (product) => {
    alert(
      `Product: ${product.name}\n` +
      `Price: $${product.price}\n` +
      `Status: ${product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}\n` +
      `Seller: ${product.seller?.name || 'N/A'}`
    );
  };



  return (
    <div className="manage-products space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#16191F]">Products</h1>
        <Link 
          to="/admin/products/add"
          className="btn btn-primary"
        >
          <span>+</span> Add Product
        </Link>
      </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm bg-[#F4F4F4]"
              />
              <svg className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm bg-[#F4F4F4]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="btn btn-primary w-full md:w-auto">
              Apply Filters
            </button>
          </div>
        </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="table-container border-0 rounded-none">
          <table className="table">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Seller</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Created</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5D9D9]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-[#6B7280]">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-[#6B7280]">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-[#16191F]">{product.name}</td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">{product.seller?.name || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#16191F]">KES {Number(product.price).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <span className={`badge ${product.status === 'approved' ? 'badge-success' :
                          product.status === 'pending' ? 'badge-warning' :
                            product.status === 'rejected' ? 'badge-danger' :
                              'badge-info'
                        }`}>
                        {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <div className="flex items-center gap-2">
                        {product.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(product.id)}
                              className="btn btn-sm btn-navy"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(product)}
                              className="btn btn-sm btn-danger"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {product.status === 'approved' && (
                          <button
                            onClick={() => handleSuspend(product)}
                            className="btn btn-sm btn-outline"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleView(product)}
                          className="btn btn-sm btn-outline"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-[#16191F] mb-4">Reject Product</h2>
            <p className="text-sm text-[#6B7280] mb-4">
              Are you sure you want to reject "{selectedProduct?.name}"? Please provide a reason.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 text-sm"
              rows="3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                className="btn btn-danger"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ManageProducts;
