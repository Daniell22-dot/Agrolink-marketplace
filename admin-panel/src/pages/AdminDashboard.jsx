import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchRecentActivity } from '../redux/slices/dashboardSlice';
import StatsCards from '../components/dashboard/StatsCards';
import Charts from '../components/dashboard/Charts';
import RecentActivity from '../components/dashboard/RecentActivity';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentActivity, isLoading } = useSelector(state => state.dashboard);

  useEffect(() => {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];
    
    dispatch(fetchDashboardStats({ startDate, endDate }));
    dispatch(fetchRecentActivity(10));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <StatsCards stats={stats} />
      <Charts data={{}} />
      <RecentActivity activities={recentActivity} />
    </div>
  );
};

export default AdminDashboard;
