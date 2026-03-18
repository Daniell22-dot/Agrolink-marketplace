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

export const updateUser = createAsyncThunk(
  'adminUsers/updateUser',
  async ({ userId, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/users/${userId}/update`, 
        updateData,
        { headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      toast.success('User updated successfully!');
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
        state.users = action.payload.data || [];
        state.pagination = {
          page: action.payload.currentPage || 1,
          limit: state.pagination.limit,
          total: action.payload.count || 0
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Details
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUser = action.payload.data;
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        const index = state.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        if (state.selectedUser?.id === updatedUser.id) {
          state.selectedUser = updatedUser;
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
