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
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C89B3C]"></div>
      </div>
    );
  }

  return (
    <div className="dashboard space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#16191F]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">Welcome back! Here's what's happening with your marketplace today.</p>
      </div>

      <StatsCards stats={stats} />
      <Charts data={{}} />
      <RecentActivity activities={recentActivity} />
    </div>
  );
};

export default AdminDashboard;
