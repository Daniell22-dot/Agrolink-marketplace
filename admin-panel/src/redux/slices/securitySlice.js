import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const authHeaders = () => ({
  headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

export const fetchSecurityMetrics = createAsyncThunk(
  'security/fetchMetrics',
  async ({ hours = 24 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/status/security`, {
        params: { hours },
        ...authHeaders()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchSecurityStatus = createAsyncThunk(
  'security/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/security/status`, authHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createSecurityInvite = createAsyncThunk(
  'security/createInvite',
  async ({ email, expiresInHours }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/security/invites`, { email, expiresInHours }, authHeaders());
      toast.success('Invitation generated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate invitation');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchSecurityInvites = createAsyncThunk(
  'security/fetchInvites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/security/invites`, authHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const revokeSecurityInvite = createAsyncThunk(
  'security/revokeInvite',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/security/invites/${id}/revoke`, {}, authHeaders());
      toast.success('Invitation revoked');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to revoke invitation');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  metrics: null,
  status: null,
  invites: [],
  isLoading: false,
  invitesLoading: false,
  error: null
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    clearSecurity: (state) => {
      state.metrics = null;
      state.status = null;
      state.invites = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityMetrics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSecurityMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload.data || null;
      })
      .addCase(fetchSecurityMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSecurityStatus.fulfilled, (state, action) => {
        state.status = action.payload.data || null;
      })
      .addCase(fetchSecurityInvites.pending, (state) => {
        state.invitesLoading = true;
      })
      .addCase(fetchSecurityInvites.fulfilled, (state, action) => {
        state.invitesLoading = false;
        state.invites = action.payload.data || [];
      })
      .addCase(fetchSecurityInvites.rejected, (state) => {
        state.invitesLoading = false;
      })
      .addCase(createSecurityInvite.fulfilled, (state, action) => {
        state.invites = [action.payload.data, ...state.invites];
      })
      .addCase(revokeSecurityInvite.fulfilled, (state, action) => {
        state.invites = state.invites.map(inv =>
          inv.id === action.payload.data?.id ? action.payload.data : inv
        );
      });
  }
});

export const { clearSecurity } = securitySlice.actions;
export default securitySlice.reducer;
