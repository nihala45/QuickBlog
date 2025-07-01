import React from 'react';
import {
  UsersIcon,
  FolderIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const cards = [
  {
    name: 'Total Users',
    value: 1324,
    icon: UsersIcon,
    color: 'bg-blue-600',
  },
  {
    name: 'Total Blogs',
    value: 287,
    icon: DocumentTextIcon,
    color: 'bg-green-600',
  },
  {
    name: 'Categories',
    value: 14,
    icon: FolderIcon,
    color: 'bg-yellow-600',
  },
  {
    name: 'Views This Month',
    value: '23,145',
    icon: ChartBarIcon,
    color: 'bg-purple-600',
  },
];

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to the Admin Dashboard!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
