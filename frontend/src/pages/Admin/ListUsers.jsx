import React, { useEffect, useState } from 'react';
import api from '../../api/api'

const ListUsers = () => {
  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/adminside/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleBlock = async (id) => {
    try {
      await api.post(`/adminside/users/${id}/block/`);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await api.post(`/adminside/users/${id}/unblock/`);
      fetchUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}/`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">List Users</h1>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border">Username</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">Phone</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-3 py-2 border">{user.username}</td>
              <td className="px-3 py-2 border">{user.email}</td>
              <td className="px-3 py-2 border">{user.phone || '-'}</td>
              <td className="px-3 py-2 border flex gap-2">
                {user.is_active ? (
                  <button
                    onClick={() => handleBlock(user.id)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Block
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnblock(user.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Unblock
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="px-3 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
