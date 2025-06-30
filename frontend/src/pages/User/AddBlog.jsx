import React, { useState, useEffect } from "react";
import api from "../../api/api";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";

const AddBlog = () => {
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
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);

      const userData = JSON.parse(localStorage.getItem("user"));
      console.log(userData, 'this is the userdatatat')
      const authorId = userData?.id;
      if (authorId) {
        formData.append("author", authorId);
      } else {
        console.warn("No user ID found in local storage!");
      }

      if (category) formData.append("category_id", category)
      if (image) formData.append("image", image);

      const res = await api.post("/blog/blogs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog created successfully!");
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setStatus("draft");
      setMessage({
        type: "success",
        text: "Blog created successfully.",
      });
    } catch (error) {
      console.error(error);
      const text = error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : "An unexpected error occurred. Please try again.";
      setMessage({
        type: "error",
        text,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow flex justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
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
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Write your blog post here..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Upload Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-center py-3 font-semibold rounded text-white text-sm sm:text-base ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
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

export default AddBlog;
