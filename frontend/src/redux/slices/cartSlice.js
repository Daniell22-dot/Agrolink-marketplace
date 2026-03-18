import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart', { productId, quantity });
      toast.success('Added to cart!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      toast.success('Removed from cart');
      return productId;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove from cart');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/cart');
      toast.success('Cart cleared');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isLoading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload.data || { items: [], total: 0 };
        state.items = cart.items;
        state.totalPrice = cart.total;
        state.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cart = action.payload.data || { items: [], total: 0 };
        state.items = cart.items;
        state.totalPrice = cart.total;
        state.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload);
        state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
      })
      // Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const cart = action.payload.data || { items: [], total: 0 };
        state.items = cart.items;
        state.totalPrice = cart.total;
        state.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalPrice = 0;
        state.totalItems = 0;
      });
  }
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
