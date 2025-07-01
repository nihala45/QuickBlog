// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/api';
// import { motion } from 'framer-motion';
// import ManageBlogCard from './ManageBlogCard';

// const ManageBlog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [menu, setMenu] = useState('All');
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   const fetchBlogs = async (categoryId = null, search = '') => {
//     setLoading(true);
//     let url = '/adminside/admin/blogs/';

//     const params = new URLSearchParams();
//     if (categoryId) params.append('category', categoryId);
//     if (search) params.append('search', search);

//     if (params.toString()) {
//       url += `?${params.toString()}`;
//     }

//     try {
//       const res = await api.get(url);
//       setBlogs(res.data);
//     } catch (error) {
//       console.error(error);
//       setBlogs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get('/blog/blog/categories/');

//       setCategories(res.data.results || res.data || []);
//     } catch (error) {
//       console.error(error);
//       setCategories([]);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchBlogs();
//   }, []);

//   const handleMenuClick = (item) => {
//     setMenu(item.name);
//     setSearchQuery('');
//     fetchBlogs(item.id, '');
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     const selectedCategoryId =
//       menu === 'All'
//         ? null
//         : categories.find((c) => c.name === menu)?.id;

//     fetchBlogs(selectedCategoryId, value);
//   };

//   return (
//     <div className="py-10">
//       {/* Top actions */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 sm:px-8 xl:px-40 gap-4">
//         {/* Add button */}
//         <button
//           onClick={() => navigate('/admin/add-blog')}
//           className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
//         >
//           + Add New Blog
//         </button>

//         {/* Search box */}
//         <input
//           type="text"
//           placeholder="Search by title or content..."
//           value={searchQuery}
//           onChange={handleSearch}
//           className="border px-4 py-2 rounded w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
//         />
//       </div>

//       {/* Category filter */}
//       <div className="w-full overflow-x-auto mb-6">
//         <div className="flex justify-start sm:justify-center gap-4 sm:gap-8 px-4 sm:px-0 py-4">
//           <div className="relative">
//             <button
//               onClick={() => {
//                 setMenu('All');
//                 setSearchQuery('');
//                 fetchBlogs(null, '');
//               }}
//               className={`relative z-10 whitespace-nowrap text-gray-500 hover:text-primary font-medium transition-colors ${
//                 menu === 'All' ? 'text-white px-4 py-1' : ''
//               }`}
//             >
//               All
//               {menu === 'All' && (
//                 <motion.div
//                   layoutId="underline"
//                   transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                   className="absolute left-0 right-0 top-0 h-full bg-primary rounded-full -z-10"
//                 ></motion.div>
//               )}
//             </button>
//           </div>
//           {(categories || []).map((item) => (
//             <div key={item.id} className="relative">
//               <button
//                 onClick={() => handleMenuClick(item)}
//                 className={`relative z-10 whitespace-nowrap text-gray-500 hover:text-primary font-medium transition-colors ${
//                   menu === item.name ? 'text-white px-4 py-1' : ''
//                 }`}
//               >
//                 {item.name}
//                 {menu === item.name && (
//                   <motion.div
//                     layoutId="underline"
//                     transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                     className="absolute left-0 right-0 top-0 h-full bg-primary rounded-full -z-10"
//                   ></motion.div>
//                 )}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Blog grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-8 xl:px-40">
//         {loading ? (
//           <p className="text-center w-full col-span-full text-gray-500">
//             Loading blogs...
//           </p>
//         ) : blogs.length > 0 ? (
//           blogs.map((blog) => (
//             <ManageBlogCard
//               key={blog.id}
//               blog={blog}
//               onDelete={() =>
//                 fetchBlogs(
//                   menu === 'All'
//                     ? null
//                     : categories.find((c) => c.name === menu)?.id,
//                   searchQuery
//                 )
//               }
//             />
//           ))
//         ) : (
//           <p className="text-center w-full col-span-full text-gray-500">
//             No blogs found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageBlog;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserBlogCard from '../../components/User/UserBlogCard';
import api from '../../api/api';

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const pageSize = 10; 

  const fetchBlogs = async (page = 1, search = "") => {
    setLoading(true);
    try {
      let url = `/adminside/admin/blogs/?page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      setBlogs(res.data.results || []);
      setCount(res.data.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to load blogs." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(1); }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchBlogs(1, searchTerm);
  };

  const handleDelete = id => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 sm:px-8 xl:px-40 mb-8">
        <h1 className="text-3xl font-bold">My Blogs</h1>
        <div className="flex gap-2">
          
          <button
            onClick={() => navigate('/add-blog')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            + Add Blog
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6 px-4 sm:px-8 xl:px-40">
        <div className="relative w-full max-w-xl mx-auto">
          {/* Search icon */}
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 10a6.65 6.65 0 11-13.3 0 6.65 6.65 0 0113.3 0z" />
          </svg>

          {/* Text input */}
          <input
            type="text"
            placeholder="Search your blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-36 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />

          {/* Floating submit button */}
          <button
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-full shadow hover:shadow-md transition"
          >
            Search
          </button>
        </div>
      </form>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading…</p>
      ) : blogs.length === 0 ? (
        <p className="text-center">You haven’t created any blogs yet.</p>
      ) : (
        <>
          <p className="px-4 sm:px-8 xl:px-40 mb-4 text-gray-600">
            Total blogs: {count}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-8 xl:px-40">
            {blogs.map(blog => (
              <UserBlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
            ))}
          </div>

          {/* Prev / Numbered / Next */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            {/* Prev */}
            <button
              onClick={() => fetchBlogs(currentPage - 1, searchTerm)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {/* Numbered */}
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => fetchBlogs(page, searchTerm)}
                  className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-primary text-white' : ''}`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => fetchBlogs(currentPage + 1, searchTerm)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBlog;
