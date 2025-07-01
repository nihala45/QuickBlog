import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const UserBlogCard = ({ blog, onDelete }) => {
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
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }
    try {
      await api.delete(`/blog/blogs/${id}/`);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete blog. Please try again.');
    }
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

        {/* <button
          onClick={handleDelete}
          className="mt-4 w-full py-2 text-center text-sm rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-200"
        >
          Delete Blog
        </button> */}
      </div>
    </div>
  );
};

export default UserBlogCard;