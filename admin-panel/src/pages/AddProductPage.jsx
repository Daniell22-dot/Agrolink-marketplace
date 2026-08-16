import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchImageCatalog, createProduct } from '../redux/slices/productsSlice';
import toast from 'react-hot-toast';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop';

// Curated fallback presets used when the API catalog is unavailable
const FALLBACK_PRESETS = [
  { label: 'Fresh Tomatoes', cat: 'vegetables', unit: 'crates', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop' },
  { label: 'Fresh Oranges', cat: 'fruits', unit: 'kg', img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop' },
  { label: 'Mangoes (Tomy)', cat: 'fruits', unit: 'kg', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop' },
  { label: 'Mwea Pishori Rice', cat: 'grains', unit: 'bags', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop' },
  { label: 'Fresh Cassava Roots', cat: 'vegetables', unit: 'kg', img: 'https://images.pexels.com/photos/7543161/pexels-photo-7543161.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { label: 'Tubers & Yams', cat: 'vegetables', unit: 'kg', img: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop' },
  { label: 'Arabica Coffee Beans', cat: 'grains', unit: 'kg', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop' },
  { label: 'Black Tea Leaves', cat: 'other', unit: 'kg', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop' },
  { label: 'White Cane Sugar', cat: 'other', unit: 'bags', img: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop' },
  { label: 'Raw Sugarcane Stalks', cat: 'fruits', unit: 'bunches', img: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=500&auto=format&fit=crop' },
  { label: 'White Maize (Grain)', cat: 'grains', unit: 'bags', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop' },
  { label: 'Sifted Maize Flour (Unga)', cat: 'grains', unit: 'bags', img: 'https://images.pexels.com/photos/6086003/pexels-photo-6086003.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { label: 'Grade A Wheat Grains', cat: 'grains', unit: 'bags', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop' },
  { label: 'All-Purpose Wheat Flour', cat: 'grains', unit: 'bags', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop' },
  { label: 'Organic Soya Beans', cat: 'grains', unit: 'kg', img: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop' },
  { label: 'Special Rosecoco Beans', cat: 'grains', unit: 'kg', img: 'https://images.pexels.com/photos/13620780/pexels-photo-13620780.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { label: 'Yellow Beans (Nyayo)', cat: 'grains', unit: 'kg', img: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop' },
  { label: 'Sukuma Wiki (Collard Greens)', cat: 'vegetables', unit: 'bunches', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop' },
  { label: 'Fresh Green Cabbage', cat: 'vegetables', unit: 'pieces', img: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop' },
  { label: 'Fresh Tilapia / Catfish', cat: 'other', unit: 'kg', img: 'https://images.pexels.com/photos/229789/pexels-photo-229789.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { label: 'Fresh Prime Beef Meat', cat: 'livestock', unit: 'kg', img: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop' },
  { label: 'Shangi Irish Potatoes', cat: 'vegetables', unit: 'bags', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop' },
  { label: 'Sweet Yellow Potatoes', cat: 'vegetables', unit: 'bags', img: 'https://images.pexels.com/photos/7999009/pexels-photo-7999009.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { label: 'Fresh Pork Cuts', cat: 'livestock', unit: 'kg', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop' },
  { label: 'Day-Old Kienyeji Chicks', cat: 'livestock', unit: 'pieces', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop' },
  { label: 'Friesian Dairy Cow', cat: 'livestock', unit: 'pieces', img: 'https://images.pexels.com/photos/422202/pexels-photo-422202.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { label: 'Mature Kienyeji Rooster (Cock)', cat: 'livestock', unit: 'pieces', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop' },
  { label: 'Dorper Breeding Sheep', cat: 'livestock', unit: 'pieces', img: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=500&auto=format&fit=crop' },
  { label: 'Galla Dairy Goat', cat: 'livestock', unit: 'pieces', img: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=500&auto=format&fit=crop' },
  { label: 'Fresh Milk & Butter', cat: 'dairy', unit: 'liters', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop' },
  { label: 'Veterinary Vaccination', cat: 'advisory', unit: 'service', img: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&auto=format&fit=crop' }
];

const normalize = (value) => String(value || '').toLowerCase().trim();

// Resolves the image the backend will auto-assign for a given product name,
// using the same catalog the API exposes (falls back to the default image).
const resolveAutoImage = (name, category, imageCatalog) => {
  const products = (imageCatalog && imageCatalog.products) || [];
  const normalizedName = normalize(name);
  if (!normalizedName) return DEFAULT_IMAGE;

  let best = null;
  let bestScore = 0;
  for (const entry of products) {
    for (const keyword of entry.keywords || []) {
      const kw = normalize(keyword);
      if (!kw || kw.length < 3) continue;
      const nameWords = normalizedName.split(/\s+/);
      const isSubstringMatch =
        normalizedName.includes(kw) || kw.includes(normalizedName);
      const isAllWordsMatch =
        nameWords.length > 1 && nameWords.every((word) => kw.includes(word));
      if (isSubstringMatch || isAllWordsMatch) {
        const score = kw.length * (isAllWordsMatch ? 2 : 1);
        if (score > bestScore) {
          bestScore = score;
          best = entry;
        }
      }
    }
  }
  if (best && best.images && best.images.length > 0) return best.images[0];

  const categories = (imageCatalog && imageCatalog.categories) || {};
  if (categories[category] && categories[category].length > 0) return categories[category][0];
  return DEFAULT_IMAGE;
};

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, isCreating, imageCatalog } = useSelector(state => state.adminProducts);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    original_price: '',
    quantity: '',
    unit: 'kg',
    location: '',
    images: []
  });
  const [autoImage, setAutoImage] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchImageCatalog());
  }, [dispatch]);

  // API-driven preset list (falls back to curated presets when offline)
  const presets = useMemo(() => {
    if (imageCatalog && imageCatalog.products && imageCatalog.products.length > 0) {
      return imageCatalog.products
        .filter(e => e.images && e.images.length > 0)
        .map(e => ({
          label: e.label,
          cat: e.category,
          unit: 'kg',
          img: e.images[0]
        }));
    }
    return FALLBACK_PRESETS;
  }, [imageCatalog]);

  // Live preview: recompute the auto-assigned image as the admin types
  useEffect(() => {
    setAutoImage(resolveAutoImage(newProduct.name, newProduct.category, imageCatalog));
  }, [newProduct.name, newProduct.category, imageCatalog]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      if (key === 'images') {
        const urls = newProduct.images.filter(i => typeof i === 'string');
        if (urls.length > 0) {
          formData.append('images', JSON.stringify(urls));
        }
        newProduct.images.filter(i => i instanceof File).forEach(file => {
          formData.append('images', file);
        });
      } else if (newProduct[key] !== '' && newProduct[key] !== null && newProduct[key] !== undefined) {
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
    const files = Array.from(e.target.files);
    setNewProduct({ ...newProduct, images: files });
  };

  const handlePresetClick = (preset) => {
    setNewProduct({
      ...newProduct,
      name: preset.label,
      category: preset.cat,
      unit: preset.unit,
      images: [preset.img]
    });
    toast.success(`Loaded "${preset.label}" template & catalog image!`);
  };

  return (
    <div className="add-product-page bg-white rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
      <form onSubmit={handleCreateSubmit}>
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-agrolink-green text-white rounded-t-xl">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Add New Product</h2>
        <button type="button" onClick={() => navigate('/admin/products')} className="text-white hover:text-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

        {/* PRESET CATALOG TEMPLATE PICKER */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 space-y-4">
          <h3 className="font-bold text-agrolink-darkGreen flex items-center gap-2">
            <span>⚡ Standard Catalog Presets (Auto-Fills Image & Template)</span>
          </h3>
          <p className="text-xs text-gray-600">
            Select a standard product preset to automatically load the correct catalog photography.
            No file upload needed — the backend auto-assigns the right image from the product name.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
            {presets.map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="text-left bg-white border border-gray-200 rounded-lg p-2 hover:border-agrolink-green transition-all shadow-sm flex items-center gap-2"
              >
                <img src={preset.img} alt={preset.label} className="w-10 h-10 rounded object-cover" />
                <div>
                  <div className="font-semibold text-xs text-gray-800 truncate max-w-[110px]">{preset.label}</div>
                  <div className="text-[10px] text-gray-500 capitalize">{preset.cat}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Product Name *</label>
            <input
              type="text"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
              placeholder="e.g. Fresh Tomatoes, Rosecoco Beans..."
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
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains & Cereals</option>
              <option value="livestock">Livestock & Poultry</option>
              <option value="dairy">Dairy</option>
              <option value="advisory">Veterinary & Advisory Services</option>
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
            placeholder="Describe the product or veterinary service details..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Original Price / Discount (Ksh)</label>
            <input
              type="number"
              value={newProduct.original_price || ''}
              onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
              placeholder="e.g. 1200 (shows strike-through)"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Quantity / Capacity *</label>
            <input
              type="number"
              required
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-agrolink-green outline-none transition-all"
              placeholder="e.g. 500"
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
              <option value="service">Per Service / Visit</option>
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-agrolink-green transition-all bg-gray-50 md:w-1/2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <div className="text-agrolink-green font-semibold text-lg">Click to upload images</div>
                <div className="text-sm text-gray-400 mt-2">Optional — up to 5 images (JPG, PNG)</div>
              </label>
              {newProduct.images.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 font-medium">
                  {newProduct.images.length} file(s) selected
                </div>
              )}
            </div>

            <div className="border border-green-200 rounded-lg p-4 bg-green-50 md:w-1/2">
              <div className="text-xs font-semibold text-agrolink-darkGreen uppercase tracking-wide mb-2">
                Auto-Assigned Catalog Image
              </div>
              <div className="flex items-center gap-3">
                <img src={autoImage} alt="Catalog preview" className="w-16 h-16 rounded object-cover border border-gray-200" />
                <p className="text-[11px] text-gray-600 leading-snug">
                  Leave upload empty and the backend will assign this image automatically
                  based on the product name and category.
                </p>
              </div>
            </div>
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
