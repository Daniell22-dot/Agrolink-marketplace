import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChartData } from '../redux/slices/dashboardSlice';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { chartData } = useSelector(state => state.dashboard);
  const [dateRange, setDateRange] = useState('30days');
  
  useEffect(() => {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];
    
    dispatch(fetchChartData({ type: 'sales', startDate, endDate }));
    dispatch(fetchChartData({ type: 'users', startDate, endDate }));
    dispatch(fetchChartData({ type: 'products', startDate, endDate }));
  }, [dispatch, dateRange]);

  const salesData = chartData?.sales?.length ? chartData.sales : [{ name: 'No Data', sales: 0, revenue: 0 }];
  const userData = chartData?.users?.length ? chartData.users : [{ name: 'No Data', value: 1, color: '#ccc' }];
  const productData = chartData?.products?.length ? chartData.products : [{ name: 'No Data', count: 0 }];

  return (
    <div className="analytics-page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Analytics</h1>
        
        {/* Date Range Selector */}
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Data */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Sales ($)" />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#10b981'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Analytics Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold text-gray-800">$156.50</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-green-600">4.8%</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Avg. Product Rating</span>
              <span className="font-semibold text-gray-800">4.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer Retention</span>
              <span className="font-semibold text-blue-600">72%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
