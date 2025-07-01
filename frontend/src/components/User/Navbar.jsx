import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Button = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
    >
      {children}
    </button>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-4 sm:mx-8 xl:mx-32 flex justify-between items-center py-4">
        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="w-28 sm:w-44 cursor-pointer"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Button onClick={() => navigate('/user-blog-page')}>
                <span>My Blog</span>
                <img src={assets.arrow} className="w-3" alt="arrow" />
              </Button>

              <Button onClick={() => navigate('/user-dashboard')}>
                <span>Profile</span>
                <img src={assets.arrow} className="w-3" alt="arrow" />
              </Button>

              <Button onClick={handleLogout}>
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>
              <span>Login</span>
              <img src={assets.arrow} className="w-3" alt="arrow" />
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => {
                  navigate('/user-blog-page');
                  setMenuOpen(false);
                }}
              >
                <span>My Blog</span>
                <img src={assets.arrow} className="w-3" alt="arrow" />
              </Button>
              <Button
                onClick={() => {
                  navigate('/user-dashboard');
                  setMenuOpen(false);
                }}
              >
                <span>Profile</span>
                <img src={assets.arrow} className="w-3" alt="arrow" />
              </Button>
              <Button onClick={handleLogout}>
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                navigate('/login');
                setMenuOpen(false);
              }}
            >
              <span>Login</span>
              <img src={assets.arrow} className="w-3" alt="arrow" />
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
