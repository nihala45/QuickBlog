// src/components/User/BlogList.js

import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (categoryId = null) => {
    setLoading(true);
    let url = '/blog/public/blogs/';
    if (categoryId) {
      url += `?category=${categoryId}`;
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
    fetchBlogs(item.id);
  };

  return (
    <div className="py-10">
      {/* Category filter */}
      <div className="w-full overflow-x-auto">
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-8 px-4 sm:px-0 py-4">
          <div className="relative">
            <button
              onClick={() => {
                setMenu('All');
                fetchBlogs(null);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-24 px-4 sm:px-8 xl:px-40">
        {loading ? (
          <p className="text-center w-full col-span-full text-gray-500">
            Loading blogs...
          </p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : (
          <p className="text-center w-full col-span-full text-gray-500">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
