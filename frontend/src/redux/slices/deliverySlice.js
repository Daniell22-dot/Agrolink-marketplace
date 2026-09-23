import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAvailableDeliveries = createAsyncThunk(
    'delivery/fetchAvailable',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/deliveries/available');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchMyDeliveries = createAsyncThunk(
    'delivery/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/deliveries/my-jobs');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const acceptDelivery = createAsyncThunk(
    'delivery/accept',
    async (deliveryId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/deliveries/${deliveryId}/accept`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateDeliveryStatus = createAsyncThunk(
    'delivery/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/deliveries/${id}/status`, { status });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const submitProofOfDelivery = createAsyncThunk(
    'delivery/submitProof',
    async ({ id, proofOfDelivery, recipientName }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/deliveries/${id}/proof`, { proofOfDelivery, recipientName });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchDeliveryById = createAsyncThunk(
    'delivery/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/deliveries/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchMyAgentProfile = createAsyncThunk(
    'delivery/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/deliveries/me');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const deliverySlice = createSlice({
    name: 'delivery',
    initialState: {
        deliveries: [],
        selectedDelivery: null,
        agentProfile: null,
        loading: false,
        error: null
    },
    reducers: {
        clearDeliveryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailableDeliveries.pending, (state) => { state.loading = true; })
            .addCase(fetchAvailableDeliveries.fulfilled, (state) => {
                state.loading = false;
                state.deliveries = action.payload;
            })
            .addCase(fetchAvailableDeliveries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyDeliveries.fulfilled, (state) => {
                state.deliveries = action.payload;
            })
            .addCase(acceptDelivery.fulfilled, (state) => {
                const index = state.deliveries.findIndex(d => d.id === action.payload.id);
                if (index > -1) state.deliveries[index] = action.payload;
                if (state.selectedDelivery?.id === action.payload.id) state.selectedDelivery = action.payload;
            })
            .addCase(updateDeliveryStatus.fulfilled, (state) => {
                const index = state.deliveries.findIndex(d => d.id === action.payload.id);
                if (index > -1) state.deliveries[index] = action.payload;
                if (state.selectedDelivery?.id === action.payload.id) state.selectedDelivery = action.payload;
            })
            .addCase(submitProofOfDelivery.fulfilled, (state) => {
                const index = state.deliveries.findIndex(d => d.id === action.payload.id);
                if (index > -1) state.deliveries[index] = action.payload;
                if (state.selectedDelivery?.id === action.payload.id) state.selectedDelivery = action.payload;
            })
            .addCase(fetchDeliveryById.fulfilled, (state) => {
                state.selectedDelivery = action.payload;
            })
            .addCase(fetchMyAgentProfile.fulfilled, (state) => {
                state.agentProfile = action.payload;
            });
    }
});

export const { clearDeliveryError } = deliverySlice.actions;
export default deliverySlice.reducer;
