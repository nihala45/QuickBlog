import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import UserBlogCard from '../../components/User/UserBlogCard';
import api from '../../api/api';

const UserBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("blog/blogs/my-blogs/");
        setBlogs(res.data);
      } catch (error) {
        console.error(error);
        setMessage({
          type: "error",
          text: "Failed to load blogs. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = (deletedId) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== deletedId));
  };

  return (
    <div className="py-10">
      <div className="flex justify-between items-center px-4 sm:px-8 xl:px-40 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Blogs
        </h1>
        <button
  onClick={() => navigate('/add-blog')}
  className="bg-green-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-green-600 transition"
>
   + Add Blog
</button>

      </div>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs…</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t created any blogs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-24 px-4 sm:px-8 xl:px-40">
          {blogs.map((blog) => (
            <UserBlogCard
              key={blog.id}
              blog={blog}
              onDelete={handleDeleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogList;
