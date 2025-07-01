import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (pageNumber = 1, query = '') => {
    try {
      const params = {
        page: pageNumber,
        page_size: itemsPerPage,
      };
      if (query) {
        params.search = query;
      }
      const response = await api.get('adminside/users/', { params });
      setUsers(response.data.results);
      setCount(response.data.count);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchUsers(1, query);
  };

  const handleBlock = async (id) => {
    const confirmBlock = window.confirm('Are you sure you want to block this user?');
    if (!confirmBlock) return;

    try {
      await api.post(`adminside/users/${id}/block/`);
      toast.success('User blocked successfully');
      fetchUsers(page, searchQuery);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  };

  const handleUnblock = async (id) => {
    const confirmUnblock = window.confirm('Are you sure you want to unblock this user?');
    if (!confirmUnblock) return;

    try {
      await api.post(`adminside/users/${id}/unblock/`);
      toast.success('User unblocked successfully');
      fetchUsers(page, searchQuery);
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchUsers(page + 1, searchQuery);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchUsers(page - 1, searchQuery);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        User Management
      </h1>

      {/* Search Box */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by username, email, or phone"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 bg-white rounded shadow border border-gray-200">
          <thead className="bg-primary text-white text-xs sm:text-sm uppercase">
            <tr>
              <th className="px-3 py-3 text-left">Username</th>
              <th className="px-3 py-3 text-left">Email</th>
              <th className="px-3 py-3 text-left">Phone</th>
              <th className="px-3 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-3 py-3 break-all">{user.username}</td>
                <td className="px-3 py-3 break-all">{user.email}</td>
                <td className="px-3 py-3 break-all">{user.phone || '-'}</td>
                <td className="px-3 py-3">
                  {user.is_active ? (
                    <button
                      onClick={() => handleBlock(user.id)}
                      className="px-3 py-1 text-xs sm:text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(user.id)}
                      className="px-3 py-1 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center px-3 py-5 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {count > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={!prevPage}
            className="flex items-center gap-1 text-primary hover:underline disabled:text-gray-400"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(count / itemsPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className="flex items-center gap-1 text-primary hover:underline disabled:text-gray-400"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
