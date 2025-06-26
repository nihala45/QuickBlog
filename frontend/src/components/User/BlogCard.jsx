import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
    >
      <img
        src={image}
        alt={title || 'Blog image'}
        className="aspect-video w-full object-cover"
      />

      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {category}
      </span>

      <div className="p-4">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
        <p
          className="mb-3 text-xs text-gray-600"
          dangerouslySetInnerHTML={{
            __html:
              description?.length > 80
                ? description.slice(0, 80) + '...'
                : description,
          }}
        ></p>
      </div>
    </div>
  );
};

export default BlogCard;
