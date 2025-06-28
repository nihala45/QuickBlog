import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import UploadBlog from './UploadBlog';
import MyBlogs from './MyBlogs';
import ProfileInfo from './ProfileInfo';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activePage, setActivePage] = useState('upload');

  const renderPage = () => {
    switch (activePage) {
      case 'upload':
        return <UploadBlog />;
      case 'blogs':
        return <MyBlogs />;
      case 'profile':
        return <ProfileInfo />;
      default:
        return <UploadBlog />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-6">Welcome!</h2>
        <p className="text-sm mb-2">
          <strong>Email:</strong> {user?.email || 'N/A'}
        </p>
        <p className="text-sm mb-6">
          <strong>Username:</strong> {user?.username || 'N/A'}
        </p>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setActivePage('upload')}
            className={`text-left px-4 py-2 rounded ${
              activePage === 'upload'
                ? 'bg-blue-900'
                : 'hover:bg-blue-800'
            }`}
          >
            Upload Blog
          </button>
          <button
            onClick={() => setActivePage('blogs')}
            className={`text-left px-4 py-2 rounded ${
              activePage === 'blogs'
                ? 'bg-blue-900'
                : 'hover:bg-blue-800'
            }`}
          >
            My Blogs
          </button>
          <button
            onClick={() => setActivePage('profile')}
            className={`text-left px-4 py-2 rounded ${
              activePage === 'profile'
                ? 'bg-blue-900'
                : 'hover:bg-blue-800'
            }`}
          >
            Profile Info
          </button>
        </nav>

        <button
          onClick={logout}
          className="mt-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default Dashboard;
