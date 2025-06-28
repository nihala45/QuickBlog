import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get('/adminside/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // OPEN MODAL FOR ADD
  const openAddModal = () => {
    setIsEditing(false);
    setCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setModalOpen(true);
  };

  // OPEN MODAL FOR EDIT
  const openEditModal = (category) => {
    setIsEditing(true);
    setCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setModalOpen(true);
  };

  // HANDLE SAVE (ADD OR EDIT)
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

  // DELETE
  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/adminside/categories/${id}/`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <button
        onClick={openAddModal}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add New Category
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </h2>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-3"
            />
            <textarea
              placeholder="Description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-3"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List categories */}
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="px-4 py-2 border">{cat.id}</td>
              <td className="px-4 py-2 border">{cat.name}</td>
              <td className="px-4 py-2 border">
                {cat.description || '-'}
              </td>
              <td className="px-4 py-2 border flex gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
