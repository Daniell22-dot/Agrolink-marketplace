import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser, setUserPage, sendNotificationToUser } from '../redux/slices/usersSlice';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading } = useSelector(state => state.adminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyUser, setNotifyUser] = useState(null);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUsers({
      page: pagination.page,
      limit: pagination.limit,
      role: roleFilter,
      search: searchTerm
    }));
  }, [dispatch, pagination.page, pagination.limit, roleFilter, searchTerm]);

  const handleUpdateUser = (userId, updateData) => {
    const field = Object.keys(updateData)[0];
    const value = updateData[field];
    if (window.confirm(`Are you sure you want to change ${field} to ${value}?`)) {
      dispatch(updateUser({ userId, ...updateData }));
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      dispatch(deleteUser(userId));
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(setUserPage(newPage));
    dispatch(fetchUsers({
      page: newPage,
      limit: pagination.limit,
      role: roleFilter,
      search: searchTerm
    }));
  };

  const handleOpenNotify = (user) => {
    setNotifyUser(user);
    setNotifyTitle('');
    setNotifyMessage('');
    setShowNotifyModal(true);
  };

  const handleSendNotification = () => {
    if (!notifyTitle.trim() || !notifyMessage.trim()) return;
    dispatch(sendNotificationToUser({
      userId: notifyUser.id,
      title: notifyTitle,
      message: notifyMessage
    }));
    setShowNotifyModal(false);
  };

  return (
    <div className="manage-users space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#16191F] mb-4">Users</h1>

        {/* Filters */}
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm bg-[#F4F4F4]"
              />
              <svg className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm bg-[#F4F4F4]"
            >
              <option value="">All Roles</option>
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary w-full md:w-auto">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="table-container border-0 rounded-none">
          <table className="table">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Verified</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5D9D9]">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-[#6B7280]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-[#6B7280]">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition-colors">
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">#{user.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-[#16191F]">{user.fullName}</td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">{user.email}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <span className={`badge ${user.role === 'admin' ? 'badge-purple' :
                          user.role === 'farmer' ? 'badge-success' :
                            'badge-info'
                        }`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-danger'}`}>
                          {user.isVerified ? 'Yes' : 'No'}
                        </span>
                        {user.role === 'farmer' && (
                          <button
                            onClick={() => handleUpdateUser(user.id, { isVerified: !user.isVerified })}
                            className="text-xs text-[#C89B3C] hover:underline"
                          >
                            Toggle
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <select
                        value={user.status || 'active'}
                        onChange={(e) => handleUpdateUser(user.id, { status: e.target.value })}
                        className={`badge ${user.status === 'active' ? 'badge-success' :
                            user.status === 'suspended' ? 'badge-danger' :
                              'badge-warning'
                          }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenNotify(user)}
                          className="btn btn-sm btn-primary"
                        >
                          Notify
                        </button>
                        <button className="btn btn-sm btn-outline">
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
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

      {/* Notification Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-[#16191F] mb-4">Send Notification</h2>
            <p className="text-sm text-[#6B7280] mb-4">To: {notifyUser?.fullName}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#16191F] mb-2">Title</label>
              <input
                type="text"
                value={notifyTitle}
                onChange={(e) => setNotifyTitle(e.target.value)}
                placeholder="Notification title..."
                className="w-full px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#16191F] mb-2">Message</label>
              <textarea
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                placeholder="Enter message..."
                className="w-full px-4 py-2 border border-[#D5D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-sm"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNotifyModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className="btn btn-primary"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
