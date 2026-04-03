import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../redux/slices/usersSlice';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading } = useSelector(state => state.adminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

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

  return (
    <div className="manage-users">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Manage Users</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="farmer">Farmer</option>
            <option value="admin">Admin</option>
          </select>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Verified</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">#{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'farmer' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.isVerified ? 'Yes' : 'No'}
                        </span>
                        {user.role === 'farmer' && (
                          <button
                            onClick={() => handleUpdateUser(user.id, { isVerified: !user.isVerified })}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Toggle
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={user.status || 'active'}
                        onChange={(e) => handleUpdateUser(user.id, { status: e.target.value })}
                        className={`px-2 py-1 rounded text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'suspended' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
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
    </div>
  );
};

export default ManageUsers;
