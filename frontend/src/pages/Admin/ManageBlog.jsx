import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { motion } from 'framer-motion';
import ManageBlogCard from './ManageBlogCard';

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState('All');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchBlogs = async (categoryId = null, search = '') => {
    setLoading(true);
    let url = '/adminside/admin/blogs/';

    const params = new URLSearchParams();
    if (categoryId) params.append('category', categoryId);
    if (search) params.append('search', search);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const res = await api.get(url);
      setBlogs(res.data);
    } catch (error) {
      console.error(error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/blog/blog/categories/');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  const handleMenuClick = (item) => {
    setMenu(item.name);
    setSearchQuery('');
    fetchBlogs(item.id, '');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const selectedCategoryId =
      menu === 'All' ? null : categories.find((c) => c.name === menu)?.id;

    fetchBlogs(selectedCategoryId, value);
  };

  return (
    <div className="py-10">
      {/* Top actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 sm:px-8 xl:px-40 gap-4">
        {/* Add button */}
        <button
          onClick={() => navigate('/admin/add-blog')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          + Add New Blog
        </button>

        {/* Search box */}
        <input
          type="text"
          placeholder="Search by title or content..."
          value={searchQuery}
          onChange={handleSearch}
          className="border px-4 py-2 rounded w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
        />
      </div>

      {/* Category filter */}
      <div className="w-full overflow-x-auto mb-6">
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-8 px-4 sm:px-0 py-4">
          <div className="relative">
            <button
              onClick={() => {
                setMenu('All');
                setSearchQuery('');
                fetchBlogs(null, '');
              }}
              className={`relative z-10 whitespace-nowrap text-gray-500 hover:text-primary font-medium transition-colors ${
                menu === 'All' ? 'text-white px-4 py-1' : ''
              }`}
            >
              All
              {menu === 'All' && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-full bg-primary rounded-full -z-10"
                ></motion.div>
              )}
            </button>
          </div>
          {categories.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleMenuClick(item)}
                className={`relative z-10 whitespace-nowrap text-gray-500 hover:text-primary font-medium transition-colors ${
                  menu === item.name ? 'text-white px-4 py-1' : ''
                }`}
              >
                {item.name}
                {menu === item.name && (
                  <motion.div
                    layoutId="underline"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute left-0 right-0 top-0 h-full bg-primary rounded-full -z-10"
                  ></motion.div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Blog grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-8 xl:px-40">
        {loading ? (
          <p className="text-center w-full col-span-full text-gray-500">
            Loading blogs...
          </p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <ManageBlogCard
              key={blog.id}
              blog={blog}
              onDelete={() =>
                fetchBlogs(
                  menu === 'All' ? null : categories.find((c) => c.name === menu)?.id,
                  searchQuery
                )
              }
            />
          ))
        ) : (
          <p className="text-center w-full col-span-full text-gray-500">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageBlog;

