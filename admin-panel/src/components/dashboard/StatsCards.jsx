import React from 'react';

const StatsCards = ({ stats = {} }) => {
  const {
    totalUsers = 0,
    totalOrders = 0,
    totalRevenue = 0,
    totalProducts = 0,
    newOrdersToday = 0,
    pendingOrders = 0
  } = stats;

  const cards = [
    { title: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-blue-500' },
    { title: 'Total Products', value: totalProducts, icon: '📦', color: 'bg-green-500' },
    { title: 'Total Orders', value: totalOrders, icon: '🛒', color: 'bg-purple-500' },
    { title: 'Total Revenue', value: `$${totalRevenue?.toLocaleString() || 0}`, icon: '💰', color: 'bg-yellow-500' },
    { title: 'Orders Today', value: newOrdersToday, icon: '📊', color: 'bg-red-500' },
    { title: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'bg-orange-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
            </div>
            <div className={`${card.color} rounded-full p-4 text-white text-2xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
