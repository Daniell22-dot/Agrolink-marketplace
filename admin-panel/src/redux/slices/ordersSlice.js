import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchAdminOrders = createAsyncThunk(
  'adminOrders/fetchOrders',
  async ({ page = 1, limit = 10, status = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/orders`, {
        params: { page, limit, status, search },
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  'adminOrders/fetchDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/orders/${orderId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/orders/${orderId}/status`, 
        { status },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Order status updated!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'adminOrders/cancel',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/orders/${orderId}/cancel`, 
        { reason },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Order cancelled!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const refundOrder = createAsyncThunk(
  'adminOrders/refund',
  async ({ orderId, amount, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/orders/${orderId}/refund`, 
        { amount, reason },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Refund processed!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process refund');
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
    status: '',
    search: ''
  }
};

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
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
      .addCase(fetchAdminOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.order;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        if (state.selectedOrder?.id === action.payload.order.id) {
          state.selectedOrder = action.payload.order;
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(refundOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      });
  }
});

export const { setOrderFilters, setOrderPage } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
