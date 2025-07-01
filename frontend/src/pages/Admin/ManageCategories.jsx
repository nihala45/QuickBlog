import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (pageNumber = 1, query = '') => {
    try {
      const params = {
        page: pageNumber,
        page_size: itemsPerPage,
      };

      if (query) {
        params.search = query;
      }

      const response = await api.get('/adminside/categories/', { params });
      setCategories(response.data.results);
      setCount(response.data.count);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchCategories(1, query);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setFormErrors({});
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
      fetchCategories(page, searchQuery);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setFormErrors(error.response.data);
      } else {
        alert('this item already there')
        console.error('Error saving category:', error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/adminside/categories/${id}/`);
      fetchCategories(page, searchQuery);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchCategories(page + 1, searchQuery);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchCategories(page - 1, searchQuery);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Categories</h1>

      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={handleSearch}
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 w-1/2"
        />
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
            {categories.map((cat) => (
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
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {count > itemsPerPage && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={!prevPage}
            className="flex items-center gap-1 text-primary hover:underline disabled:text-gray-400"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(count / itemsPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className="flex items-center gap-1 text-primary hover:underline disabled:text-gray-400"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </h2>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.name ? 'border-red-500' : ''
                }`}
              />
              {formErrors.name && (
                <p className="text-red-600 text-sm mt-1">{formErrors.name.join(' ')}</p>
              )}
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              {formErrors.description && (
                <p className="text-red-600 text-sm mt-1">{formErrors.description.join(' ')}</p>
              )}
            </div>
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
