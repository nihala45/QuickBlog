import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import Loader from '../../components/User/Loader';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blog/blogs/${id}/`);
      setBlog(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      setCategoryId(res.data.category?.id || '');
    } catch (error) {
      console.error(error);
      alert('Failed to fetch blog details.');
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
    fetchBlog();
    fetchCategories();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    if (image) formData.append('image', image);

    try {
      setSaving(true);
      await api.patch(`/blog/blogs/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Blog updated successfully!');
      
    } catch (error) {
      console.error(error);
      alert('Failed to update blog.');
    } finally {
      setSaving(false);
    }
  };

  return loading || !blog ? (
    <Loader />
  ) : (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Edit Blog
        </h1>

        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-6 bg-white p-4 sm:p-6 md:p-8 rounded shadow"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:ring focus:ring-primary/30 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base outline-none focus:ring focus:ring-primary/30"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Content
            </label>
            <textarea
              rows="6"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base outline-none focus:ring focus:ring-primary/30"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Upload New Image (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              className="w-full text-sm sm:text-base text-gray-700"
            />
          </div>

          {blog.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Current image:
              </p>
              <img
                src={blog.image}
                alt=""
                className="w-full max-h-64 object-cover rounded border border-gray-200"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white text-sm sm:text-base py-2 px-4 rounded hover:bg-primary-dark transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Blog'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditBlogPage;
