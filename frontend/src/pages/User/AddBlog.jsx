import React, { useState, useEffect } from "react";
import api from "../../api/api";

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
      const res = await api.get("blog/user/categories/");
      
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
      const authorId = userData?.id;
      console.log(authorId)
      if (authorId) {
      formData.append("author", authorId);
    } else {
      console.warn("No user ID found in local storage!");
    }

      if (category) formData.append("category", category);
      if (image) formData.append("image", image);

      
      const res = await api.post("/blog/blogs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert('Blog created successfullyyyy')
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setStatus("draft");
    } catch (error) {
      console.error(error);
      const text =
        error.response?.data
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
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Add New Blog
      </h1>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog post here..."
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block mb-2 font-semibold text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-center py-3 font-semibold rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
