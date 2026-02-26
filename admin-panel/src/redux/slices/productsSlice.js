import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchProducts',
  async ({ page = 1, limit = 10, category = '', status = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/products`, {
        params: { page, limit, category, status, search },
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'adminProducts/fetchDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const approveProduct = createAsyncThunk(
  'adminProducts/approve',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/products/${productId}/approve`, {}, {
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      toast.success('Product approved!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve product');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const rejectProduct = createAsyncThunk(
  'adminProducts/reject',
  async ({ productId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/products/${productId}/reject`, 
        { reason },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Product rejected!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject product');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const suspendProduct = createAsyncThunk(
  'adminProducts/suspend',
  async ({ productId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/products/${productId}/suspend`, 
        { reason },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Product suspended!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to suspend product');
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
    status: '',
    search: ''
  }
};

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {
    setProductFilters: (state, action) => {
      state.filters = action.payload;
    },
    setProductPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.selectedProduct = action.payload.product;
      })
      .addCase(approveProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(rejectProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(suspendProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      });
  }
});

export const { setProductFilters, setProductPage } = adminProductsSlice.actions;
export default adminProductsSlice.reducer;
