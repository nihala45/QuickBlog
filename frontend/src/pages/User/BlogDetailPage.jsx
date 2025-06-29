// src/pages/User/BlogDetailPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import { assets, comments_data } from '../../assets/assets';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import Loader from '../../components/User/Loader';
import Moment from 'moment';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loadingPublish, setLoadingPublish] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const isAuthor = data?.author?.email === user?.email;

  const fetchBlogData = async () => {
    try {
      const res = await api.get(`/blog/public/blogs/${id}/`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    setComments(comments_data);
  };

  const addComment = (e) => {
    e.preventDefault();
    const newComment = {
      name,
      content,
      createdAt: new Date(),
    };
    setComments((prev) => [...prev, newComment]);
    setName('');
    setContent('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await api.delete(`/blog/blogs/${id}/`);
      navigate('/user/blogs');
    } catch (error) {
      console.error(error);
      alert('Failed to delete blog.');
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this blog?')) return;

    try {
      setLoadingPublish(true);
      await api.patch(`/blog/blogs/${id}/`, {
        status: 'published',
      });
      await fetchBlogData();
    } catch (error) {
      console.error(error);
      alert('Failed to publish blog.');
    } finally {
      setLoadingPublish(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  return data ? (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="relative w-full">
        {data.image && (
          <img
            src={data.image}
            alt=""
            className="absolute top-0 left-0 w-full h-[300px] sm:h-[400px] object-cover opacity-50 -z-10"
          />
        )}

        <div className="text-center mt-16 sm:mt-20 text-gray-600 relative z-10 px-4 sm:px-6">
          <p className="text-primary py-2 font-medium text-sm sm:text-base">
            Published on {Moment(data.timestamp).format('MMM Do YYYY')}
          </p>
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800 break-words">
            {data.title}
          </h1>

          {data.category?.name && (
            <h2 className="my-4 text-primary text-xs sm:text-sm font-semibold truncate">
              {data.category.name}
            </h2>
          )}

          <p className="inline-block py-1 px-4 rounded-full mb-5 border text-xs sm:text-sm border-primary/35 bg-primary/5 font-medium text-primary">
            {data.author?.username || 'Unknown Author'} · {data.status}
          </p>

          {isAuthor && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {data.status === 'draft' && (
                <button
                  onClick={handlePublish}
                  disabled={loadingPublish}
                  className="px-4 py-2 text-xs sm:text-sm rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition disabled:opacity-50"
                >
                  {loadingPublish ? 'Publishing...' : 'Publish Blog'}
                </button>
              )}
              <button
                onClick={() => navigate(`/blog/edit/${id}`)}
                className="px-4 py-2 text-xs sm:text-sm rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
              >
                Edit Blog
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs sm:text-sm rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Delete Blog
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 max-w-6xl mx-auto py-10">
        {data.image && (
          <img
            src={data.image}
            alt=""
            className="rounded-3xl mb-5 w-full max-h-[400px] object-cover"
          />
        )}

        <div
          className="rich-text text-gray-800 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        {/* Comments Section */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4 text-lg">
            Comments ({comments.length})
          </p>
          <div className="flex flex-col gap-6">
            {comments.map((item, index) => (
              <div
                key={index}
                className="relative bg-white shadow border border-gray-200 p-4 rounded text-gray-700 w-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={assets.user_icon}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-semibold text-base break-words">{item.name}</p>
                </div>
                <p className="text-sm ml-11 break-words">{item.content}</p>
                <div className="absolute right-4 bottom-3 text-xs text-gray-400">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment */}
        <div className="max-w-3xl mx-auto mt-12">
          <p className="font-semibold mb-4 text-lg">Add Your Comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col gap-4 max-w-xl"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Your Name"
              required
              className="w-full p-3 border border-gray-300 rounded-md outline-none text-sm"
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Write your comment here..."
              required
              className="w-full p-3 border border-gray-300 rounded-md outline-none h-24 resize-none text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-md px-6 py-2 hover:scale-105 transition-transform text-sm"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold mb-4 text-lg">
            Share this article on social media
          </p>
          <div className="flex flex-wrap gap-5">
            <img src={assets.facebook_icon} width={40} alt="Facebook" />
            <img src={assets.twitter_icon} width={40} alt="Twitter" />
            <img src={assets.googleplus_icon} width={40} alt="Google Plus" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default BlogDetailPage;
