import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const ManageBlogCard = ({ blog, onDelete }) => {
  const navigate = useNavigate();

  const {
    id,
    title,
    content,
    category,
    image,
    status,
    timestamp,
    author,
  } = blog;

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await api.delete(`/adminside/admin/blogs/${id}/`);
      onDelete();
    } catch (error) {
      console.error(error);
      alert('Failed to delete blog');
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/admin/edit-blog/${id}`);
  };

  return (
    <div
      onClick={() => navigate(`/blog-detail/${id}`)}
      className="flex flex-col h-full rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition duration-300 cursor-pointer bg-white"
    >
      {image && (
        <img
          src={image}
          alt={title || 'Blog image'}
          className="w-full object-cover aspect-video"
        />
      )}

      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          {category?.name && (
            <span className="mb-2 inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-xs">
              {category.name}
            </span>
          )}

          <h5 className="mb-2 font-semibold text-gray-900 text-lg break-words">
            {title}
          </h5>

          <p
            className="mb-3 text-sm text-gray-700 break-words"
            dangerouslySetInnerHTML={{
              __html:
                content?.length > 80
                  ? content.slice(0, 80) + '...'
                  : content,
            }}
          ></p>

          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <strong>Status:</strong> {status}
            </div>
            <div>
              <strong>Date:</strong>{' '}
              {timestamp ? new Date(timestamp).toLocaleDateString() : ''}
            </div>
            {author?.username && (
              <div>
                <strong>Author:</strong> {author.username}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBlogCard;
