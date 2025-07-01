import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/User/Navbar';
import api from '../../api/api';
import Footer from '../../components/User/Footer';
import { AuthContext } from '../../context/AuthContext';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/account/user/profile/');
      setUserData(res.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setNewValue(userData[field] || '');
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setError('');

    if (editingField === 'phone') {
      if (!/^\d{10}$/.test(newValue)) {
        setError('Phone number must be exactly 10 digits.');
        return;
      }
    }

    if (editingField === 'username') {
      if (!/^[A-Za-z\s]{2,50}$/.test(newValue)) {
        setError('Username should be letters only, 2-50 characters.');
        return;
      }
    }

    try {
      const formData = new FormData();
      if (editingField && newValue !== '') {
        formData.append(editingField, newValue);
      }

      await api.patch('/account/user/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowModal(false);
      setEditingField(null);
      fetchUserData();
    } catch (err) {
      console.error('Failed to update user data:', err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      await api.patch('/account/user/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchUserData();
    } catch (err) {
      console.error('Failed to upload profile image:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto mt-10 px-4 w-full">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h2>

          {userData ? (
            <div className="flex flex-col md:flex-row md:space-x-10 items-start md:items-center">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg mb-4">
                  <img
                    src={
                      userData.profile_image_url
                        ? userData.profile_image_url
                        : 'https://ui-avatars.com/api/?name=' +
                          encodeURIComponent(userData.username || 'User') +
                          '&background=0D8ABC&color=fff&size=128'
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                  Change Profile Photo
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1 mt-6 md:mt-0 w-full">
                {/* Username */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Username</span>
                    <span className="text-gray-800 font-bold text-lg">{userData.username}</span>
                  </div>
                  <button
                    onClick={() => handleEditClick('username')}
                    className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </div>

                {/* Email (not editable) */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Email</span>
                    <span className="text-gray-800 font-bold text-lg">{userData.email}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Phone</span>
                    <span className="text-gray-800 font-bold text-lg">
                      {userData.phone || '—'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEditClick('phone')}
                    className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading profile...</p>
          )}
        </div>
      </main>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            {editingField && (
              <>
                <label className="block text-gray-700 mb-2">
                  Edit {editingField}:
                </label>
                <input
                  type={editingField === 'phone' ? 'tel' : 'text'}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring mb-4"
                  placeholder={
                    editingField === 'phone' ? 'Enter 10-digit phone number' : ''
                  }
                />
                {error && (
                  <p className="text-red-600 text-sm mb-2">{error}</p>
                )}
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingField(null);
                  setError('');
                }}
                className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
