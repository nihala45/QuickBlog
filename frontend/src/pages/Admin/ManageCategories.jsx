import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/adminside/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.patch(`/adminside/categories/${categoryId}/`, {
          name: categoryName,
          description: categoryDescription,
        });
      } else {
        await api.post('/adminside/categories/', {
          name: categoryName,
          description: categoryDescription,
        });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/adminside/categories/${id}/`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Categories</h1>

      <div className="flex justify-center sm:justify-end mb-6">
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded shadow transition transform hover:scale-105 text-sm sm:text-base"
        >
          + Add New Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm bg-white rounded shadow">
          <thead className="bg-primary text-white uppercase text-xs sm:text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50 transition">
              
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3">{cat.description || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-primary hover:underline disabled:text-gray-400"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-primary hover:underline disabled:text-gray-400"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </h2>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
