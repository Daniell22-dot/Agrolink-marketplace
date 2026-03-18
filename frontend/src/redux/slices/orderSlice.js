import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page = 1, limit = 10, status = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        params: { page, limit, status },
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Order created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Order cancelled successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, 
        { status },
        { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Order status updated!');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  isLoading: false,
  error: null,
  filters: {
    status: ''
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderFilters: (state, action) => {
      state.filters = action.payload;
    },
    setOrderPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data || [];
        // If the backend doesn't provide pagination object yet, we mock it from data
        state.pagination = {
          page: 1, // default for now as controller doesn't return page/limit yet for orders
          limit: 10,
          total: action.payload.data?.length || 0
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload.data;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload.data);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data;
        const index = state.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.selectedOrder?.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      })
      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data;
        const index = state.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.selectedOrder?.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      });
  }
});

export const { setOrderFilters, setOrderPage } = orderSlice.actions;
export default orderSlice.reducer;
