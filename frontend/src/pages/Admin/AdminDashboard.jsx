import React, { useEffect, useState } from 'react';
import {
  UsersIcon,
  FolderIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import api from '../../api/api';

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, blogsRes, categoriesRes] = await Promise.all([
          api.get('adminside/users/'),
          api.get('adminside/admin/blogs/'),
          api.get('adminside/categories/'),
        ]);

        setCounts({
          totalUsers: usersRes.data.count || 0,
          totalBlogs: blogsRes.data.count || 0,
          totalCategories: categoriesRes.data.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      name: 'Total Users',
      value: counts.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-600',
    },
    {
      name: 'Total Blogs',
      value: counts.totalBlogs,
      icon: DocumentTextIcon,
      color: 'bg-green-600',
    },
    {
      name: 'Categories',
      value: counts.totalCategories,
      icon: FolderIcon,
      color: 'bg-yellow-600',
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to the Admin Dashboard!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.name}
            className={`rounded-lg p-6 text-white shadow-md flex items-center gap-4 ${card.color}`}
          >
            <card.icon className="w-10 h-10 opacity-80" />
            <div>
              <p className="text-lg font-semibold">{card.value}</p>
              <p className="text-sm opacity-80">{card.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
