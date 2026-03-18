import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 10, category = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: { page, limit, category, search }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Product created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${productId}`, productData, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Product updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${productId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Product deleted successfully!');
      return productId;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  isLoading: false,
  error: null,
  filters: {
    category: '',
    search: ''
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { category: '', search: '' };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
        state.pagination = {
          page: action.payload.currentPage || 1,
          limit: state.pagination.limit,
          total: action.payload.count || 0,
          totalPages: action.payload.totalPages || 1
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload.data);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  }
});

export const { setFilters, clearFilters, setPage } = productSlice.actions;
export default productSlice.reducer;
