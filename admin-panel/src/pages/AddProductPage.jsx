import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createProduct } from '../redux/slices/productsSlice';
import toast from 'react-hot-toast';

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, isCreating } = useSelector(state => state.adminProducts);
  
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
    dispatch(fetchCategories());
  }, [dispatch]);

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
      toast.success('Product created successfully!');
      navigate('/admin/products');
    }).catch((err) => {
      toast.error(err.message || 'Failed to create product');
    });
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
  };

  return (
    <div className="add-product-page bg-white rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-agrolink-green text-white rounded-t-xl">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Add New Product</h2>
        <button onClick={() => navigate('/admin/products')} className="text-white hover:text-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleCreateSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Product Name *</label>
            <input
              type="text"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
              placeholder="Enter product name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Category *</label>
            <select
              required
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
            >
              <option value="">Select Category</option>
              {categories && categories.map(cat => (
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
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all h-32"
            placeholder="Describe the product..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Price (Ksh) *</label>
            <input
              type="number"
              required
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
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
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
              placeholder="Quantity"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Unit *</label>
            <select
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
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
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
            placeholder="e.g., Nairobi, Kisumu"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Product Images</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-agrolink-green transition-all bg-gray-50">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className="text-agrolink-green font-semibold text-lg">Click to upload images</div>
              <div className="text-sm text-gray-400 mt-2">Up to 5 images (JPG, PNG)</div>
            </label>
            {newProduct.images.length > 0 && (
              <div className="mt-4 text-sm text-gray-600 font-medium">
                {newProduct.images.length} files selected
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3 border-2 border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-all font-semibold uppercase tracking-wider text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className={`px-8 py-3 bg-agrolink-green text-white rounded-lg hover:shadow-lg transition-all font-bold uppercase tracking-widest text-sm flex items-center ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
  );
};

export default AddProductPage;
