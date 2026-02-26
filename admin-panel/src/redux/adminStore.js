import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/adminAuthSlice';
import dashboardReducer from './slices/dashboardSlice';
import usersReducer from './slices/usersSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import reportsReducer from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    dashboard: dashboardReducer,
    adminUsers: usersReducer,
    adminProducts: productsReducer,
    adminOrders: ordersReducer,
    adminReports: reportsReducer
  }
});
