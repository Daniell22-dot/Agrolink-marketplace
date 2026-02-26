import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async ({ page = 1, limit = 10, role = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        params: { page, limit, role, search },
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'adminUsers/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'adminUsers/updateStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/users/${userId}/status`, 
        { status },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('User status updated!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      toast.success('User deleted successfully!');
      return userId;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const sendNotificationToUser = createAsyncThunk(
  'adminUsers/sendNotification',
  async ({ userId, title, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/users/${userId}/notify`, 
        { title, message },
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('Notification sent!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  isLoading: false,
  error: null,
  filters: {
    role: '',
    search: ''
  }
};

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    setUserFilters: (state, action) => {
      state.filters = action.payload;
    },
    setUserPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Details
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUser = action.payload.user;
      })
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.user.id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
        if (state.selectedUser?.id === action.payload.user.id) {
          state.selectedUser = action.payload.user;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      });
  }
});

export const { setUserFilters, setUserPage, clearSelectedUser } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
