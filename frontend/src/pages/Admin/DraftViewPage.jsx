import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserBlogCard from '../../components/User/UserBlogCard';
import api from '../../api/api';

const UserDraftBlogList = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/adminside/admin/blogs/drafts/');
      setDrafts(res.data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return (
    <div className="py-10">
      <div className="flex justify-between items-center px-4 sm:px-8 xl:px-40 mb-8">
        <h1 className="text-3xl font-bold">My Draft Blogs</h1>
        
      </div>

      {loading ? (
        <p className="text-center">Loading drafts…</p>
      ) : drafts.length === 0 ? (
        <p className="text-center">You have no draft blogs.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-8 xl:px-40">
          {drafts.map(blog => (
            <UserBlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDraftBlogList;
