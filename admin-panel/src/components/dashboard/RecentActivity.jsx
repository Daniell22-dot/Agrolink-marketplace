import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  const mockActivities = [
    { id: 1, type: 'order', message: 'New order #12345 received', timestamp: '2 hours ago', icon: '' },
    { id: 2, type: 'product', message: 'Product "Organic Tomatoes" approved', timestamp: '4 hours ago', icon: '' },
    { id: 3, type: 'user', message: 'New user registered', timestamp: '6 hours ago', icon: '' },
    { id: 4, type: 'payment', message: 'Payment processed for order #12340', timestamp: '8 hours ago', icon: '' },
    { id: 5, type: 'report', message: 'New report submitted', timestamp: '10 hours ago', icon: '' }
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm font-medium">{activity.message}</p>
              <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
