import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-4 sm:mx-8 xl:mx-32 flex justify-between items-center py-4">
      
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="w-28 sm:w-44 cursor-pointer"
        />

      
        <div className="hidden md:flex">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/userblogpage')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition"
            >
              <span>Myblog</span>
              <img src={assets.arrow} className="w-3" alt="arrow" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition"
            >
              <span>Login</span>
              <img src={assets.arrow} className="w-3" alt="arrow" />
            </button>
          )}
        </div>


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

      
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {isAuthenticated ? (
            <button
              onClick={() => {
                navigate('/userdashboard');
                setMenuOpen(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex justify-center items-center space-x-2 transition"
            >
              <span>Profile</span>
              <img src={assets.arrow} className="w-3" alt="arrow" />
            </button>
          ) : (
            <button
              onClick={() => {
                navigate('/login');
                setMenuOpen(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex justify-center items-center space-x-2 transition"
            >
              <span>Login</span>
              <img src={assets.arrow} className="w-3" alt="arrow" />
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
