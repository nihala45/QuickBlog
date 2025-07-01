import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.svg';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: logo */}
          <div className="flex items-center flex-1">
            <div
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center cursor-pointer"
              aria-label="Go to admin dashboard"
            >
              <img 
                src={logo} 
                alt="Company Logo" 
                className="h-10 w-auto hover:scale-105 transition-transform duration-300" 
              />
            </div>
          </div>

          {/* Center: title (visible on larger screens) */}
          <div className="hidden md:flex flex-1 justify-center">
            <span
              onClick={() => navigate('/admin-dashboard')}
              className="text-gray-800 text-2xl font-bold tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
              aria-label="Admin Panel"
            >
              Admin Panel
            </span>
          </div>

          {/* Right: user info and logout */}
          <div className="flex items-center flex-1 justify-end gap-4">
            {isAuthenticated && (
              <>
                <span className="hidden sm:block text-gray-700 text-sm">
                  Hi, <span className="font-semibold text-blue-700">{user?.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  aria-label="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;