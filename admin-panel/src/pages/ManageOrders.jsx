import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateOrderStatus, refundOrder } from '../redux/slices/ordersSlice';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const dispatch = useDispatch();
  const { orders, pagination, isLoading } = useSelector(state => state.adminOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    dispatch(fetchAdminOrders({
      page: pagination.page,
      limit: pagination.limit,
      status: statusFilter,
      search: searchTerm
    }));
  }, [dispatch, pagination.page, statusFilter, searchTerm]);

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Are you sure you want to change order status to ${newStatus}?`)) {
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
    }
  };

  const handleRefund = (order) => {
    setSelectedOrder(order);
    setRefundAmount(order.totalAmount);
    setShowRefundModal(true);
  };

  const submitRefund = () => {
    if (!refundAmount || !refundReason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    dispatch(refundOrder({
      orderId: selectedOrder.id,
      amount: parseFloat(refundAmount),
      reason: refundReason
    }));
    setShowRefundModal(false);
    setRefundAmount('');
    setRefundReason('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="manage-orders">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Manage Orders</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">#{order.id?.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">Ksh {order.totalAmount?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{order.User?.county || 'N/A'}</span>
                        <span className="text-xs">{order.User?.location || 'No location data'}</span>
                        {order.User?.latitude && (
                          <a 
                            href={`https://www.google.com/maps?q=${order.User.latitude},${order.User.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline mt-1"
                          >
                            View on Map
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        View
                      </button>
                      {order.status === 'completed' && (
                        <button
                          onClick={() => handleRefund(order)}
                          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)} ({pagination.total} total)
          </span>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Process Refund</h2>
            <p className="text-gray-600 mb-4">
              Order #{selectedOrder?.id?.slice(0, 8)}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter refund reason..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRefund}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
