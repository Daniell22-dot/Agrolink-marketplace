import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, approveProduct, rejectProduct, suspendProduct, fetchCategories, createProduct } from '../redux/slices/productsSlice';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { products, pagination, isLoading, categories, isCreating } = useSelector(state => state.adminProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: '',
    images: []
  });

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

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      if (key === 'images') {
        newProduct.images.forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, newProduct[key]);
      }
    });

    dispatch(createProduct(formData)).unwrap().then(() => {
      setShowCreateModal(false);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        unit: 'kg',
        location: '',
        images: []
      });
    });
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
  };

  return (
    <div className="manage-products">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-lg"
        >
          <span className="mr-2 text-xl">+</span> Add Product
        </button>
      </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Apply Filters
          </button>
        </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Seller</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.seller?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">${product.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'approved' ? 'bg-green-100 text-green-700' :
                          product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            product.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                        }`}>
                        {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {product.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(product.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(product)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {product.status === 'approved' && (
                        <button
                          onClick={() => handleSuspend(product)}
                          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        View
                      </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reject Product</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject "{selectedProduct?.name}"? Please provide a reason.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows="3"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-agrolink-green text-white rounded-t-xl">
              <h2 className="text-2xl font-bold uppercase tracking-wider">Add New Product</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-white hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Category *</label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all h-24"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Price (Ksh) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
                    placeholder="Quantity"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Unit *</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="liters">Liters (l)</option>
                    <option value="pieces">Pieces (pcs)</option>
                    <option value="bags">Bags</option>
                    <option value="crates">Crates</option>
                    <option value="bunches">Bunches</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Location</label>
                <input
                  type="text"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
                  placeholder="e.g., Nairobi, Kisumu"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Product Images</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-agrolink-green transition-all bg-gray-50">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="text-agrolink-green font-semibold">Click to upload images</div>
                    <div className="text-xs text-gray-400 mt-1">Up to 5 images (JPG, PNG)</div>
                  </label>
                  {newProduct.images.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600 font-medium">
                      {newProduct.images.length} files selected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border-2 border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-all font-semibold uppercase tracking-wider text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`px-6 py-2 bg-agrolink-green text-white rounded-lg hover:shadow-lg transition-all font-bold uppercase tracking-widest text-sm flex items-center ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
