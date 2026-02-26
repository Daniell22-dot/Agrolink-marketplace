import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchReports = createAsyncThunk(
  'adminReports/fetchReports',
  async ({ page = 1, limit = 10, type = '', status = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/reports`, {
        params: { page, limit, type, status, search },
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchReportDetail = createAsyncThunk(
  'adminReports/fetchDetail',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/reports/${reportId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const resolveReport = createAsyncThunk(
  'adminReports/resolve',
  async ({ reportId, action, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/reports/${reportId}/resolve`, 
        { action, reason },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Report resolved!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resolve report');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const dismissReport = createAsyncThunk(
  'adminReports/dismiss',
  async ({ reportId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/reports/${reportId}/dismiss`, 
        { reason },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Report dismissed!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to dismiss report');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  reports: [],
  selectedReport: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  isLoading: false,
  error: null,
  filters: {
    type: '',
    status: '',
    search: ''
  }
};

const adminReportsSlice = createSlice({
  name: 'adminReports',
  initialState,
  reducers: {
    setReportFilters: (state, action) => {
      state.filters = action.payload;
    },
    setReportPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload.reports || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReportDetail.fulfilled, (state, action) => {
        state.selectedReport = action.payload.report;
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex(r => r.id === action.payload.report.id);
        if (index !== -1) {
          state.reports[index] = action.payload.report;
        }
      })
      .addCase(dismissReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex(r => r.id === action.payload.report.id);
        if (index !== -1) {
          state.reports[index] = action.payload.report;
        }
      });
  }
});

export const { setReportFilters, setReportPage } = adminReportsSlice.actions;
export default adminReportsSlice.reducer;
