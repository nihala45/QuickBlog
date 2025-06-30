import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import { assets } from '../../assets/assets';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import Loader from '../../components/User/Loader';
import Moment from 'moment';
import {
  HeartIcon as HeartOutline,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid,
} from '@heroicons/react/24/solid';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  const isAdmin = user?.is_superuser;
  const isAuthor = data?.author?.email === user?.email;

  const fetchBlogData = async () => {
    try {
      const res = await api.get(`/blog/blogs/${id}/`);
      setData(res.data);
      setLikesCount(res.data.likes_count || 0);
      setLiked(res.data.is_liked || false);
    } catch (error) {
      console.error(error);
      alert('Failed to load blog.');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/blog/blogs/${id}/comments/`);
      setComments(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load comments.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blog/blogs/${id}/`);
      navigate('/blogs');
    } catch (error) {
      console.error(error);
      alert('Failed to delete blog.');
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this blog?')) return;
    try {
      setLoadingPublish(true);
      await api.patch(`/blog/blogs/${id}/`, { status: 'published' });
      await fetchBlogData();
    } catch (error) {
      console.error(error);
      alert('Failed to publish blog.');
    } finally {
      setLoadingPublish(false);
    }
  };

  const toggleLike = async () => {
    try {
      const res = await api.post(`/blog/blogs/${id}/like/`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch (error) {
      console.error(error);
      alert('Login required to like posts.');
    }
  };

 const addComment = async (e) => {
  e.preventDefault();
  try {
    await api.post(`/blog/blogs/${id}/comments/`, {
      blog: id,
      text: content,
    });
    setContent('');
    fetchComments();
  } catch (error) {
    console.error(error);
    alert('Failed to add comment.');
  }
};


  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  if (!data) return <Loader />;

  const plainTextContent = stripHtmlTags(data.content);
  const previewText = plainTextContent.slice(0, 500);

  return (
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
            {data.author?.username || 'Unknown Author'}
          </p>

          {(isAuthor || isAdmin) && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {data.status === 'draft' && isAuthor && (
                <button
                  onClick={handlePublish}
                  disabled={loadingPublish}
                  className="px-4 py-2 text-xs sm:text-sm rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition disabled:opacity-50"
                >
                  {loadingPublish ? 'Publishing...' : 'Publish Blog'}
                </button>
              )}

              {isAuthor && (
                <button
                  onClick={() => navigate(`/blog/edit/${id}`)}
                  className="px-4 py-2 text-xs sm:text-sm rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
                >
                  Edit Blog
                </button>
              )}

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

        {/* CONTENT SECTION */}
        <div className="rich-text text-gray-800 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base">
          {showFullContent ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
              {plainTextContent.length > 500 && (
                <button
                  onClick={() => setShowFullContent(false)}
                  className="mt-4 inline-block text-primary hover:underline text-sm sm:text-base"
                >
                  Show Less
                </button>
              )}
            </>
          ) : (
            <p>
              {previewText}
              {plainTextContent.length > 500 && (
                <>
                  ...{' '}
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="inline text-primary hover:underline text-sm sm:text-base"
                  >
                    Read More
                  </button>
                </>
              )}
            </p>
          )}
        </div>

        {/* LIKE + SHARE */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={toggleLike}
            className="flex items-center gap-2 text-red-600 hover:scale-110 transition"
          >
            {liked ? (
              <HeartSolid className="w-7 h-7" />
            ) : (
              <HeartOutline className="w-7 h-7" />
            )}
            <span className="text-base font-medium">{likesCount}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:scale-105 transition"
          >
            Share
          </button>
        </div>

        {/* SOCIAL MEDIA ICONS */}
        <div className="my-8 max-w-3xl mx-auto">
          <p className="font-semibold mb-4 text-lg">
            Share this article on social media
          </p>
          <div className="flex flex-wrap gap-5">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.facebook_icon} width={40} alt="Facebook" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.twitter_icon} width={40} alt="Twitter" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.googleplus_icon} width={40} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4 text-lg">
            Comments ({comments.length})
          </p>
          <div className="flex flex-col gap-6">
            {comments.map((item) => (
              <div
                key={item.id}
                className="relative bg-white shadow border border-gray-200 p-4 rounded text-gray-700 w-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={assets.user_icon}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-semibold text-base break-words">
                    {item.user || 'Anonymous'}
                  </p>
                </div>
                <p className="text-sm ml-11 break-words">{item.text}</p>
                <div className="absolute right-4 bottom-3 text-xs text-gray-400">
                  {Moment(item.created_at).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD COMMENT FORM */}
        <div className="max-w-3xl mx-auto mt-12">
          <p className="font-semibold mb-4 text-lg">Add Your Comment</p>
          <form onSubmit={addComment} className="flex flex-col gap-4 max-w-xl">
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
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
