import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
        params: { startDate, endDate },
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async ({ type, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/chart/${type}`, {
        params: { startDate, endDate },
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return { type, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchActivity',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/activity`, {
        params: { limit },
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  stats: {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    newOrdersToday: 0,
    pendingOrders: 0
  },
  chartData: {
    sales: {},
    users: {},
    orders: {}
  },
  recentActivity: [],
  isLoading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Chart Data
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData[action.payload.type] = action.payload.data;
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload.activity || [];
      });
  }
});

export default dashboardSlice.reducer;
