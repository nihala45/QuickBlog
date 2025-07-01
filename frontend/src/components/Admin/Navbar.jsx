import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center h-auto md:h-16 gap-y-4 py-4 md:py-0">
          {/* Left: logo */}
          <div className="flex items-center flex-1 justify-center md:justify-start">
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

          {/* Right: user info and login/logout */}
          <div className="flex items-center flex-1 justify-center md:justify-end gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-gray-700 text-sm text-center md:text-left">
                  Hi, <span className="font-semibold text-blue-700">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                aria-label="Login"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
