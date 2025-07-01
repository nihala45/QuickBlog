import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import BlogCard from './BlogCard';
import { useDebounce } from 'use-debounce';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState('All');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });

  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      const res = await api.get('/blog/blog/categories/');
      console.log('Categories API Response:', res.data);
      setCategories(res.data.results || []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  const fetchBlogs = async (page = 1, categoryId = null, search = '') => {
    setLoading(true);
    let url = '/blog/public/blogs/';
    const params = new URLSearchParams();
    params.append('page', page);
    if (categoryId) params.append('category', categoryId);
    if (search) params.append('search', search);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const res = await api.get(url);
      console.log('Blogs API Response:', res.data);
      setBlogs(res.data.results || []);
      setPagination({
        count: res.data.count || 0,
        next: res.data.next,
        previous: res.data.previous,
        currentPage: page,
      });
    } catch (error) {
      console.error(error);
      setBlogs([]);
      setPagination({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const selectedCategoryId =
      menu === 'All' ? null : categories.find((c) => c.name === menu)?.id;
    fetchBlogs(1, selectedCategoryId, debouncedSearch);
  }, [debouncedSearch, menu, categories]);

  const handleMenuClick = (item) => {
    setMenu(item.name);
    setSearchQuery('');
  };

  const handlePageChange = (page) => {
    const selectedCategoryId =
      menu === 'All' ? null : categories.find((c) => c.name === menu)?.id;
    fetchBlogs(page, selectedCategoryId, debouncedSearch);
  };

  const totalPages = Math.ceil(pagination.count / itemsPerPage);

  return (
    <div className="py-10">

      <div className="flex justify-center mb-8 px-4">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400 bg-gray-50 transition"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 10a6.65 6.65 0 11-13.3 0 6.65 6.65 0 0113.3 0z"
            />
          </svg>
        </div>
      </div>

 
      <div className="w-full overflow-x-auto mb-6">
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-8 px-4 sm:px-0 py-4">
          <button
            onClick={() => setMenu('All')}
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
              />
            )}
          </button>
          {Array.isArray(categories) &&
            categories.map((item) => (
              <button
                key={item.id}
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
                  />
                )}
              </button>
            ))}
        </div>
      </div>

  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-8 xl:px-40">
        {loading ? (
          <p className="text-center w-full col-span-full text-gray-500">
            Loading blogs...
          </p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))
        ) : (
          <p className="text-center w-full col-span-full text-gray-500">
            No blogs found.
          </p>
        )}
      </div>

     
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          <button
            onClick={() =>
              pagination.currentPage > 1 &&
              handlePageChange(pagination.currentPage - 1)
            }
            disabled={!pagination.previous}
            className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                pagination.currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              pagination.currentPage < totalPages &&
              handlePageChange(pagination.currentPage + 1)
            }
            disabled={!pagination.next}
            className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
