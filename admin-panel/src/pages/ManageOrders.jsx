import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateOrderStatus, refundOrder, cancelOrder, setOrderPage } from '../redux/slices/ordersSlice';
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
  }, [dispatch, pagination.page, pagination.limit, statusFilter, searchTerm]);

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

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(setOrderPage(newPage));
    dispatch(fetchAdminOrders({
      page: newPage,
      limit: pagination.limit,
      status: statusFilter,
      search: searchTerm
    }));
  };

  const handleCancelOrder = (orderId) => {
    const reason = window.prompt('Enter cancellation reason:');
    if (reason !== null && reason.trim()) {
      dispatch(cancelOrder({ orderId, reason }));
    }
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
    <div className="manage-orders space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#16191F] mb-4">Orders</h1>

        {/* Filters */}
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm bg-[#F4F4F4]"
              />
              <svg className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm bg-[#F4F4F4]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-primary w-full md:w-auto">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="table-container border-0 rounded-none">
          <table className="table">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5D9D9]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-[#6B7280]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-[#6B7280]">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-[#16191F]">#{order.id?.slice(0, 8)}</td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">{order.customer?.name || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#16191F]">KES {order.totalAmount?.toLocaleString() || '0'}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`badge ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#16191F]">{order.User?.county || 'N/A'}</span>
                        <span className="text-xs">{order.User?.location || 'No location data'}</span>
                        {order.User?.latitude && (
                          <a 
                            href={`https://www.google.com/maps?q=${order.User.latitude},${order.User.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-amber hover:underline mt-1"
                          >
                            View on Map
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="btn btn-sm btn-outline">
                          View
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Cancel
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <button
                            onClick={() => handleRefund(order)}
                            className="btn btn-sm btn-outline"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#F4F4F4] border-t border-[#D5D9D9]">
          <span className="text-sm text-[#6B7280]">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)} ({pagination.total} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-[#16191F] mb-4">Process Refund</h2>
            <p className="text-sm text-[#6B7280] mb-4">
              Order #{selectedOrder?.id?.slice(0, 8)}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#16191F] mb-2">Refund Amount</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#16191F] mb-2">Reason</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter refund reason..."
                className="w-full px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRefundModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={submitRefund}
                className="btn btn-primary"
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
