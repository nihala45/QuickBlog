import React, { useState, useEffect } from "react";
import api from "../../api/api";
import Navbar from "../../components/Admin/Navbar";
import Footer from "../../components/User/Footer";

const AdminAddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("blog/blog/categories/");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];
        setCategories(data);
      } catch (error) {
        console.error(error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wordCount = content.trim().split(/\s+/).filter(w => w).length;
    if (wordCount < 50) {
      setMessage({
        type: "error",
        text: `Content is too short (${wordCount} words). Please write at least 50 words.`
      });
      return;
    }

    if (!window.confirm("Are you sure you want to create this blog?")) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);

      const userData = JSON.parse(localStorage.getItem("user"));
      const authorId = userData?.id;
      if (authorId) formData.append("author", authorId);
      if (category) formData.append("category_id", category);
      if (image) formData.append("image", image);

      await api.post("/blog/blogs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Blog created successfully." });
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setStatus("draft");
    } catch (error) {
      console.error(error);
      let text = "Title already exists. Please choose another name.";
      const data = error.response?.data;
      if (data?.title) {
        text = "Title already exists. Please choose another name.";
      } else if (data?.content) {
        text = data.content[0];
      } else if (typeof data === "object") {
        text = Object.values(data).flat().filter(msg => typeof msg === "string").join(" ");
      } else if (typeof data === "string") {
        text = data;
      }
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow flex justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6 sm:p-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-gray-800 mb-10">
            Add New Blog
          </h1>

          {message && (
            <div
              className={`p-4 mb-6 rounded text-sm sm:text-base ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter blog title"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
                placeholder="Write your blog post here..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Upload Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-center font-semibold rounded text-white text-sm sm:text-base transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              }`}
            >
              {loading ? "Submitting..." : "Submit Blog"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAddBlog;
