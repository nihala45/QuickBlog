import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div>
      <h1>AdminDashboard</h1>
      <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="w-32 sm:w-44 cursor-pointer"
        />

      
  <button
    onClick={() => navigate('/profile')}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition"
  >
    <span>Profile</span>
    <img src={assets.arrow} className="w-3" alt="arrow" />
  </button>

      </div>
    </div>
  );
};

export default Navbar;
