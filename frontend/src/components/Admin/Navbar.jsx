import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { assets } from '../../assets/assets';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.svg';



const AdminNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg">
      <div className="flex justify-between items-center px-4 sm:px-8 xl:px-16 py-3">
       
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/admin-dashboard')}
        >
          <img
            src={logo}
            alt="Admin Logo"
            className="w-8 sm:w-10 h-auto"
          />
          <span className="text-xl sm:text-2xl font-semibold tracking-wide">
            Admin Panel
          </span>
        </div>

        {/* Right: User info and logout */}
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-gray-200 text-sm">
              Hi, <span className="font-semibold">{user?.username}</span>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium px-3 py-2 rounded transition duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
