import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const loginAdmin = createAsyncThunk(
  'adminAuth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password
      });
      localStorage.setItem('adminToken', response.data.token);
      toast.success('Admin login successful!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const verifyAdminToken = createAsyncThunk(
  'adminAuth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/verify`, {
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('adminToken');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  admin: null,
  token: localStorage.getItem('adminToken'),
  isLoading: false,
  error: null,
  isAuthenticated: false
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      localStorage.removeItem('adminToken');
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      toast.success('Admin logged out successfully');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(verifyAdminToken.fulfilled, (state, action) => {
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
      })
      .addCase(verifyAdminToken.rejected, (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
